const MAP_URLS = [
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json",
  "https://unpkg.com/world-atlas@2/countries-110m.json",
  "https://raw.githubusercontent.com/topojson/world-atlas/master/countries-110m.json"
];

const COUNTRY_URLS = [
  "https://restcountries.com/v3.1/all?fields=name,cca2,cca3,ccn3,capital,population,area,region,subregion,languages,currencies,timezones,flags,independent,startOfWeek,unMember,continents,idd",
  "https://restcountries.com/v3.1/all",
  "https://raw.githubusercontent.com/mledoze/countries/master/countries.json"
];

const POPULATION_URLS = [
  "https://countriesnow.space/api/v0.1/countries/population",
  "https://raw.githubusercontent.com/samayo/country-json/master/src/country-by-population.json"
];

const LIB_URLS = {
  d3: [
    "https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js",
    "https://unpkg.com/d3@7/dist/d3.min.js"
  ],
  topojson: [
    "https://cdn.jsdelivr.net/npm/topojson-client@3/dist/topojson-client.min.js",
    "https://unpkg.com/topojson-client@3/dist/topojson-client.min.js"
  ]
};

const WIKIDATA_ENDPOINT = "https://query.wikidata.org/sparql";
const BASE_STROKE_WIDTH = 0.65;

const tooltip = document.getElementById("tooltip");
const panelTitle = document.getElementById("country-title");
const panelSubtitle = document.getElementById("country-subtitle");
const detailList = document.getElementById("country-details");
const rowTemplate = document.getElementById("detail-row-template");
const zoomInBtn = document.getElementById("zoom-in");
const zoomOutBtn = document.getElementById("zoom-out");
const zoomResetBtn = document.getElementById("zoom-reset");

let svg;
let g;
let path;
let zoomBehavior;
let activePath = null;
let countryByNumeric = new Map();
const leaderCache = new Map();

const fmtInt = new Intl.NumberFormat("en-US");

bootstrap().catch((err) => {
  panelTitle.textContent = "Failed to load map";
  panelSubtitle.textContent = err.message;
});

async function bootstrap() {
  await ensureLibraries();
  await initMap();
}

async function ensureLibraries() {
  if (!window.d3) {
    await loadOneOf(LIB_URLS.d3, "D3");
  }
  if (!window.topojson) {
    await loadOneOf(LIB_URLS.topojson, "TopoJSON");
  }
}

async function initMap() {
  const [topology, rawCountries, populationLookup] = await Promise.all([
    fetchFromAny(MAP_URLS, "world map borders"),
    fetchFromAny(COUNTRY_URLS, "country details"),
    fetchPopulationLookup()
  ]);

  const countries = normalizeCountries(rawCountries, populationLookup);
  hydrateCountryMaps(countries);

  svg = d3.select("#world-map");
  g = svg.append("g");

  const projection = d3.geoNaturalEarth1().fitExtent([[8, 8], [992, 552]], { type: "Sphere" });
  path = d3.geoPath(projection);

  const features = topojson.feature(topology, topology.objects.countries).features;

  g.selectAll("path.country")
    .data(features)
    .join("path")
    .attr("class", "country")
    .attr("tabindex", 0)
    .attr("aria-label", (d) => getCountryName(d.id) || "Unknown country")
    .attr("d", path)
    .on("mouseenter", function (_, d) {
      tooltip.textContent = getCountryName(d.id) || "Unknown country";
      tooltip.hidden = false;
    })
    .on("mousemove", function (event) {
      tooltip.style.left = `${event.offsetX + 12}px`;
      tooltip.style.top = `${event.offsetY + 12}px`;
    })
    .on("mouseleave", function () {
      tooltip.hidden = true;
    })
    .on("click", (_, d) => selectCountry(d))
    .on("keydown", function (event, d) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectCountry(d);
      }
    });

  setupZoom();
}

function setupZoom() {
  zoomBehavior = d3.zoom()
    .scaleExtent([1, 8])
    .translateExtent([[0, 0], [1000, 560]])
    .on("zoom", (event) => {
      g.attr("transform", event.transform);
      g.selectAll("path.country").attr("stroke-width", BASE_STROKE_WIDTH / event.transform.k);
    });

  svg.call(zoomBehavior);

  if (zoomInBtn) {
    zoomInBtn.addEventListener("click", () => {
      svg.transition().duration(180).call(zoomBehavior.scaleBy, 1.4);
    });
  }

  if (zoomOutBtn) {
    zoomOutBtn.addEventListener("click", () => {
      svg.transition().duration(180).call(zoomBehavior.scaleBy, 1 / 1.4);
    });
  }

  if (zoomResetBtn) {
    zoomResetBtn.addEventListener("click", () => {
      svg.transition().duration(220).call(zoomBehavior.transform, d3.zoomIdentity);
    });
  }
}

async function fetchPopulationLookup() {
  const byIso3 = new Map();
  const byName = new Map();

  for (const url of POPULATION_URLS) {
    try {
      const data = await fetchJSON(url);
      ingestPopulationData(data, byIso3, byName);
      if (byIso3.size || byName.size) {
        break;
      }
    } catch {
      // Best-effort enrichment only.
    }
  }

  return { byIso3, byName };
}

function ingestPopulationData(data, byIso3, byName) {
  if (data && Array.isArray(data.data)) {
    data.data.forEach((row) => {
      const iso3 = toText(row.iso3).toUpperCase();
      const countryName = toText(row.country);
      const latest = getLatestPopulationFromSeries(row.populationCounts);
      if (latest == null) return;

      if (iso3 && iso3.length === 3) {
        byIso3.set(iso3, latest);
      }
      if (countryName) {
        byName.set(normalizeNameKey(countryName), latest);
      }
    });
    return;
  }

  if (Array.isArray(data) && data.length && data[0].country && data[0].population != null) {
    data.forEach((row) => {
      const name = toText(row.country);
      const population = toNumber(row.population);
      if (!name || population == null) return;
      byName.set(normalizeNameKey(name), population);
    });
  }
}

function getLatestPopulationFromSeries(series) {
  if (!Array.isArray(series) || !series.length) return null;
  let latestYear = -Infinity;
  let latestValue = null;
  for (const entry of series) {
    const year = toNumber(entry.year);
    const value = toNumber(entry.value);
    if (year == null || value == null) continue;
    if (year > latestYear) {
      latestYear = year;
      latestValue = value;
    }
  }
  return latestValue;
}

function normalizeCountries(data, populationLookup) {
  if (!Array.isArray(data) || !data.length) return [];

  return data.map((c) => {
    const commonName = toText(c?.name?.common) || toText(c?.name) || "Unknown";
    const officialName = toText(c?.name?.official) || toText(c?.official_name) || commonName;
    const nativeName = c?.name?.nativeName || c?.name?.native || c?.nativeName || c?.native || null;

    const cca3 = toText(c.cca3).toUpperCase();
    const fallbackPopulation =
      populationLookup.byIso3.get(cca3) ||
      populationLookup.byName.get(normalizeNameKey(commonName)) ||
      null;

    const population = toNumber(c.population) ?? fallbackPopulation;

    return {
      name: {
        common: commonName,
        official: officialName,
        nativeName
      },
      cca2: toText(c.cca2).toUpperCase(),
      cca3,
      ccn3: toText(c.ccn3 || c.numericCode || c.ccn),
      capital: normalizeCapital(c.capital),
      population,
      area: toNumber(c.area),
      region: toText(c.region) || "N/A",
      subregion: toText(c.subregion) || "N/A",
      languages: normalizeLanguages(c.languages),
      currencies: normalizeCurrencies(c.currencies),
      timezones: normalizeTimezones(c.timezones || c.timezone),
      flags: normalizeFlags(c),
      independent: c.independent,
      startOfWeek: toText(c.startOfWeek) || "N/A",
      unMember: c.unMember,
      continents: normalizeContinents(c.continents, c.region),
      idd: normalizeIdd(c.idd)
    };
  });
}

function normalizeCapital(capital) {
  if (!capital) return [];
  return Array.isArray(capital) ? capital : [capital];
}

function normalizeLanguages(languages) {
  if (!languages) return {};
  if (Array.isArray(languages)) {
    return languages.reduce((acc, entry, idx) => {
      const value = toText(entry?.name || entry);
      if (value) acc[`lang_${idx}`] = value;
      return acc;
    }, {});
  }
  return languages;
}

function normalizeCurrencies(currencies) {
  if (!currencies) return {};
  if (Array.isArray(currencies)) {
    return currencies.reduce((acc, entry, idx) => {
      const name = toText(entry?.name || entry);
      if (name) acc[`curr_${idx}`] = { name };
      return acc;
    }, {});
  }
  return currencies;
}

function normalizeTimezones(timezones) {
  if (!timezones) return [];
  return Array.isArray(timezones) ? timezones : [timezones];
}

function normalizeFlags(country) {
  if (country.flags) return country.flags;
  return { emoji: toText(country.flag) };
}

function normalizeContinents(continents, region) {
  if (Array.isArray(continents) && continents.length) return continents;
  if (region) return [region];
  return [];
}

function normalizeIdd(idd) {
  if (idd) return idd;
  return {};
}

function hydrateCountryMaps(countries) {
  countryByNumeric = new Map();
  countries.forEach((country) => {
    if (!country.ccn3) return;
    countryByNumeric.set(country.ccn3.padStart(3, "0"), country);
  });
}

function getCountryData(id) {
  return countryByNumeric.get(String(id).padStart(3, "0")) || null;
}

function getCountryName(id) {
  return getCountryData(id)?.name?.common || null;
}

async function selectCountry(feature) {
  const country = getCountryData(feature.id);
  if (!country) {
    panelTitle.textContent = "Unmapped country";
    panelSubtitle.textContent = "No country details found in the current dataset.";
    detailList.innerHTML = "";
    setActive(feature.id);
    return;
  }

  panelTitle.textContent = country.name.common;
  panelSubtitle.textContent = country.name.official;
  setActive(feature.id);
  renderCountryDetails(country);

  try {
    const leader = await getLeader(country.cca2);
    updateOrInsertDetail("Leader", leader || "Unavailable from live source");
  } catch {
    updateOrInsertDetail("Leader", "Unavailable from live source");
  }
}

function renderCountryDetails(country) {
  detailList.innerHTML = "";
  const detailPairs = [
    ["Native Name", getNativeName(country)],
    ["Capital", (country.capital || []).join(", ") || "N/A"],
    ["Population", country.population != null ? fmtInt.format(country.population) : "N/A"],
    ["Area (km2)", country.area != null ? fmtInt.format(Math.round(country.area)) : "N/A"],
    ["Region", country.region || "N/A"],
    ["Subregion", country.subregion || "N/A"],
    ["Continents", (country.continents || []).join(", ") || "N/A"],
    ["Languages", Object.values(country.languages || {}).join(", ") || "N/A"],
    ["Currencies", formatCurrencies(country.currencies)],
    ["Time Zones", (country.timezones || []).join(", ") || "N/A"],
    ["Calling Code", formatCallingCode(country.idd)],
    ["UN Member", yesNo(country.unMember)],
    ["Independent", yesNo(country.independent)],
    ["Week Starts", country.startOfWeek || "N/A"],
    ["Flag", country.flags?.emoji || "N/A"],
    ["Leader", "Loading..."]
  ];

  detailPairs.forEach(([label, value]) => addDetail(label, value));
}

function addDetail(label, value) {
  const fragment = rowTemplate.content.cloneNode(true);
  fragment.querySelector("dt").textContent = label;
  fragment.querySelector("dd").textContent = value;
  detailList.appendChild(fragment);
}

function updateOrInsertDetail(label, value) {
  const rows = Array.from(detailList.querySelectorAll(".row"));
  for (const row of rows) {
    const dt = row.querySelector("dt");
    if (dt?.textContent === label) {
      const dd = row.querySelector("dd");
      if (dd) dd.textContent = value;
      return;
    }
  }
  addDetail(label, value);
}

function setActive(featureId) {
  const idAsString = String(featureId);
  if (activePath) activePath.classList.remove("active");
  activePath = g.selectAll("path.country").filter((d) => String(d.id) === idAsString).node();
  if (activePath) activePath.classList.add("active");
}

function getNativeName(country) {
  const native = country?.name?.nativeName || country?.name?.native;
  if (!native) return "N/A";
  const first = Object.values(native)[0];
  if (typeof first === "string") return first;
  return toText(first?.common) || toText(first?.official) || "N/A";
}

function formatCurrencies(currencies = {}) {
  const values = Object.values(currencies);
  if (!values.length) return "N/A";
  return values
    .map((c) => (typeof c === "string" ? c : `${c.name || "Currency"}${c.symbol ? ` (${c.symbol})` : ""}`))
    .join(", ");
}

function formatCallingCode(idd = {}) {
  const root = toText(idd.root);
  const suffix = toText((idd.suffixes || [""])[0]);
  const code = `${root}${suffix}`.trim();
  return code || "N/A";
}

function yesNo(value) {
  if (value === true) return "Yes";
  if (value === false) return "No";
  return "N/A";
}

async function getLeader(cca2) {
  if (!cca2) return null;
  if (leaderCache.has(cca2)) return leaderCache.get(cca2);

  const query = `
SELECT ?leaderLabel WHERE {
  ?country wdt:P297 "${cca2}".
  ?country wdt:P35 ?leader.
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
LIMIT 1`;

  const url = `${WIKIDATA_ENDPOINT}?format=json&query=${encodeURIComponent(query)}`;
  const data = await fetchJSON(url, {
    headers: {
      Accept: "application/sparql-results+json"
    }
  });

  const leader = data?.results?.bindings?.[0]?.leaderLabel?.value || null;
  leaderCache.set(cca2, leader);
  return leader;
}

async function fetchFromAny(urls, label) {
  const errors = [];
  for (const url of urls) {
    try {
      return await fetchJSON(url);
    } catch (err) {
      errors.push(`${url} -> ${err.message}`);
    }
  }
  throw new Error(`Could not load ${label}. Tried: ${errors.join(" | ")}`);
}

async function loadOneOf(urls, label) {
  const errors = [];
  for (const url of urls) {
    try {
      await loadScript(url);
      return;
    } catch (err) {
      errors.push(`${url} -> ${err.message}`);
    }
  }
  throw new Error(`Could not load ${label}. Tried: ${errors.join(" | ")}`);
}

function loadScript(url) {
  return new Promise((resolve, reject) => {
    const el = document.createElement("script");
    el.src = url;
    el.async = true;
    el.onload = () => resolve();
    el.onerror = () => reject(new Error("script load failed"));
    document.head.appendChild(el);
  });
}

function normalizeNameKey(name) {
  return toText(name).toLowerCase().replace(/[^a-z0-9]/g, "");
}

function toText(value) {
  if (value == null) return "";
  return String(value).trim();
}

function toNumber(value) {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

async function fetchJSON(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`);
  }
  return res.json();
}
