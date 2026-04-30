const MAP_URLS = [
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json",
  "https://unpkg.com/world-atlas@2/countries-110m.json",
  "https://raw.githubusercontent.com/topojson/world-atlas/master/countries-110m.json"
];

const COUNTRY_URLS = [
  "https://restcountries.com/v3.1/all?fields=name,cca2,cca3,ccn3,ccn,capital,population,area,region,subregion,languages,currencies,timezones,flags,flag,independent,startOfWeek,unMember,continents,idd",
  "https://restcountries.com/v3.1/all",
  "https://raw.githubusercontent.com/mledoze/countries/master/countries.json"
];

const POPULATION_URLS = [
  "https://countriesnow.space/api/v0.1/countries/population",
  "https://raw.githubusercontent.com/samayo/country-json/master/src/country-by-population.json"
];

const GDP_URLS = [
  "https://api.worldbank.org/v2/country/all/indicator/NY.GDP.MKTP.CD?format=json&per_page=20000"
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
const DEFAULT_COUNTRY_FILL = "#d6dfd0";

const tooltip = document.getElementById("tooltip");
const panelTitle = document.getElementById("country-title");
const panelSubtitle = document.getElementById("country-subtitle");
const selectionSummary = document.getElementById("selection-summary");
const detailList = document.getElementById("country-details");
const rowTemplate = document.getElementById("detail-row-template");
const clearSelectionBtn = document.getElementById("clear-selection");
const zoomInBtn = document.getElementById("zoom-in");
const zoomOutBtn = document.getElementById("zoom-out");
const zoomResetBtn = document.getElementById("zoom-reset");

let svg;
let g;
let countryLayer;
let selectionLayer;
let path;
let zoomBehavior;
let worldTopology;
let selectedIds = new Set();
let countryByNumeric = new Map();
let geometryByNumeric = new Map();
let leaderCache = new Map();
let selectionVersion = 0;
let currentZoom = 1;

const fmtInt = new Intl.NumberFormat("en-US");

bootstrap().catch((err) => {
  panelTitle.textContent = "Failed to load map";
  panelSubtitle.textContent = err.message;
  if (selectionSummary) {
    selectionSummary.textContent = "Unable to build map data";
  }
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
  const [topology, rawCountries, populationLookup, gdpLookup] = await Promise.all([
    fetchFromAny(MAP_URLS, "world map borders"),
    fetchFromAny(COUNTRY_URLS, "country details"),
    fetchPopulationLookup(),
    fetchGdpLookup()
  ]);

  worldTopology = topology;
  const countries = normalizeCountries(rawCountries, populationLookup, gdpLookup);
  hydrateCountryMaps(countries, topology.objects.countries.geometries);

  svg = d3.select("#world-map");
  const defs = svg.append("defs");
  g = svg.append("g");
  selectionLayer = g.append("g").attr("class", "selection-layer");
  countryLayer = g.append("g").attr("class", "country-layer");

  const projection = d3.geoNaturalEarth1().fitExtent([[8, 8], [992, 552]], { type: "Sphere" });
  path = d3.geoPath(projection);

  const features = topojson.feature(topology, topology.objects.countries).features;
  createFlagPatterns(defs, countries);

  countryLayer.selectAll("path.country")
    .data(features)
    .join("path")
    .attr("class", "country")
    .attr("tabindex", 0)
    .attr("aria-label", (d) => getCountryName(d.id) || "Unknown country")
    .attr("d", path)
    .attr("fill", (d) => getCountryFill(d.id))
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
    .on("click", (_, d) => toggleCountrySelection(d))
    .on("keydown", function (event, d) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleCountrySelection(d);
      }
    });

  selectionLayer.append("path").attr("class", "combo-fill");
  selectionLayer.append("path").attr("class", "combo-border");

  if (clearSelectionBtn) {
    clearSelectionBtn.addEventListener("click", clearSelection);
  }

  setupZoom();
  renderSelectionState();
}

function setupZoom() {
  applyMapZoom(1);

  if (zoomInBtn) {
    zoomInBtn.addEventListener("click", () => {
      applyMapZoom(currentZoom * 1.4);
    });
  }

  if (zoomOutBtn) {
    zoomOutBtn.addEventListener("click", () => {
      applyMapZoom(currentZoom / 1.4);
    });
  }

  if (zoomResetBtn) {
    zoomResetBtn.addEventListener("click", () => {
      applyMapZoom(1);
    });
  }
}

function applyMapZoom(nextZoom) {
  currentZoom = Math.max(1, Math.min(8, Number(nextZoom) || 1));

  const centerX = 500;
  const centerY = 280;
  const translateX = centerX - centerX * currentZoom;
  const translateY = centerY - centerY * currentZoom;

  g.attr("transform", `translate(${translateX} ${translateY}) scale(${currentZoom})`);
  countryLayer.selectAll("path.country").attr("stroke-width", BASE_STROKE_WIDTH / currentZoom);
  selectionLayer.select(".combo-border").attr("stroke-width", 2.1 / currentZoom);
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

async function fetchGdpLookup() {
  const byIso3 = new Map();

  for (const url of GDP_URLS) {
    try {
      const data = await fetchJSON(url);
      ingestGdpData(data, byIso3);
      if (byIso3.size) {
        break;
      }
    } catch {
      // GDP is best-effort enrichment only.
    }
  }

  return byIso3;
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

function ingestGdpData(data, byIso3) {
  if (!Array.isArray(data) || !Array.isArray(data[1])) {
    return;
  }

  const latestByIso3 = new Map();
  data[1].forEach((row) => {
    const iso3 = toText(row.countryiso3code).toUpperCase();
    const year = toNumber(row.date);
    const value = toNumber(row.value);

    if (!iso3 || iso3.length !== 3 || year == null || value == null) {
      return;
    }

    const current = latestByIso3.get(iso3);
    if (!current || year > current.year) {
      latestByIso3.set(iso3, { value, year });
    }
  });

  latestByIso3.forEach((entry, iso3) => {
    byIso3.set(iso3, entry);
  });
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

function normalizeCountries(data, populationLookup, gdpLookup) {
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
    const gdp = gdpLookup.get(cca3) || null;

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
      gdp: gdp?.value ?? null,
      gdpYear: gdp?.year ?? null,
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

function hydrateCountryMaps(countries, geometries) {
  countryByNumeric = new Map();
  geometryByNumeric = new Map();

  countries.forEach((country) => {
    const key = normalizeFeatureId(country.ccn3);
    if (!key) return;
    countryByNumeric.set(key, country);
  });

  geometries.forEach((geometry) => {
    const key = normalizeFeatureId(geometry.id);
    if (!key) return;
    geometryByNumeric.set(key, geometry);
  });
}

function createFlagPatterns(defs, countries) {
  // Kept as a no-op so the setup path remains stable while countries use solid pastel flag colors.
}

function getPatternId(country) {
  if (!country?.cca2) return null;
  return `flag-pattern-${country.cca2.toLowerCase()}`;
}

function getCountryFill(id) {
  const country = getCountryData(id);
  return getPastelFlagColor(country);
}

const FLAG_COLOR_GROUPS = {
  red: ["AL","AT","BH","BM","CA","CH","CN","CZ","DK","ES","GE","GI","HK","ID","IM","JP","KG","LV","MA","MC","ME","NO","NP","PE","PL","PT","QA","SG","TN","TR","TW","US"],
  blue: ["AR","AU","BA","BB","BZ","CL","CU","EE","EU","FI","FM","GR","GT","HN","IS","IL","KZ","LI","LU","NI","NZ","PA","PY","SE","SO","SV","UY","VE"],
  green: ["BD","BJ","BR","CG","CM","DZ","ET","GH","GN","GW","GY","IE","IR","JM","JO","KE","KW","LY","ML","MR","NG","PK","PS","SA","SN","ST","SY","TJ","TM","TZ","ZM","ZW"],
  yellow: ["AD","BE","BN","BT","CO","DE","EC","ER","LT","MD","MK","MY","RO","RW","SC","TD","UA","VA","VN"],
  white: ["CY","KR","MT"],
  black: ["AO","BW","EE","MW","PG","SS","SZ","TT"],
  orange: ["AM","CI","IN","LK","NE"]
};

const PASTEL_FLAG_COLORS = {
  red: "#efb3ad",
  blue: "#adc9ee",
  green: "#b7d9bd",
  yellow: "#f2df9b",
  white: "#edf0e8",
  black: "#bec3c4",
  orange: "#edc49f"
};

function getPastelFlagColor(country) {
  const code = toText(country?.cca2).toUpperCase();
  if (!code) return DEFAULT_COUNTRY_FILL;

  const matches = Object.entries(FLAG_COLOR_GROUPS)
    .filter(([, codes]) => codes.includes(code))
    .map(([color]) => color);

  if (matches.length) {
    return PASTEL_FLAG_COLORS[matches[matches.length - 1]] || DEFAULT_COUNTRY_FILL;
  }

  const regionFallback = {
    Africa: "green",
    Americas: "blue",
    Asia: "red",
    Europe: "blue",
    Oceania: "blue",
    Antarctic: "white"
  };
  return PASTEL_FLAG_COLORS[regionFallback[country?.region] || "white"] || DEFAULT_COUNTRY_FILL;
}

function getCountryData(id) {
  return countryByNumeric.get(normalizeFeatureId(id)) || null;
}

function getCountryName(id) {
  return getCountryData(id)?.name?.common || null;
}

function toggleCountrySelection(feature) {
  const featureId = normalizeFeatureId(feature.id);
  if (!featureId) {
    return;
  }

  const next = new Set(selectedIds);
  if (next.has(featureId)) {
    next.delete(featureId);
  } else {
    next.add(featureId);
  }

  selectedIds = next;
  renderSelectionState();
}

function clearSelection() {
  selectedIds = new Set();
  renderSelectionState();
}

function renderSelectionState() {
  selectionVersion += 1;
  updateSelectionVisuals();

  const selectedCountries = getSelectedCountries();
  updateSelectionSummary(selectedCountries);

  if (!selectedCountries.length) {
    panelTitle.textContent = "Build a country combo";
    panelSubtitle.textContent = "Click countries to add them into one combined profile.";
    detailList.innerHTML = "";
    return;
  }

  if (selectedCountries.length === 1) {
    const country = selectedCountries[0];
    panelTitle.textContent = country.name.common;
    panelSubtitle.textContent = country.name.official;
    renderDetailPairs(buildCountryDetailPairs(country));
    hydrateLeaderDetails(selectedCountries);
    return;
  }

  const combined = combineCountries(selectedCountries);
  panelTitle.textContent = buildComboTitle(selectedCountries);
  panelSubtitle.textContent = `${selectedCountries.length} countries selected. Borders merge where the landmasses connect.`;
  renderDetailPairs(buildCombinedDetailPairs(combined));
  hydrateLeaderDetails(selectedCountries);
}

function updateSelectionVisuals() {
  countryLayer.selectAll("path.country")
    .classed("is-selected", (d) => selectedIds.has(normalizeFeatureId(d.id)));
  selectionLayer.select(".combo-fill").attr("d", null);
  selectionLayer.select(".combo-border").attr("d", null);
}

function getSelectedCountries() {
  return [...selectedIds]
    .map((id) => getCountryData(id))
    .filter(Boolean)
    .sort((a, b) => a.name.common.localeCompare(b.name.common));
}

function updateSelectionSummary(selectedCountries) {
  if (!selectionSummary) {
    return;
  }

  if (!selectedCountries.length) {
    selectionSummary.textContent = "0 countries selected";
    return;
  }

  const noun = selectedCountries.length === 1 ? "country" : "countries";
  selectionSummary.textContent = `${selectedCountries.length} ${noun} selected`;
}

function buildCountryDetailPairs(country) {
  return [
    ["Native Name", getNativeName(country)],
    ["Capital", formatValues(country.capital)],
    ["Population", formatInteger(country.population)],
    ["GDP (USD)", formatUsd(country.gdp)],
    ["Area (km2)", formatInteger(country.area != null ? Math.round(country.area) : null)],
    ["Region", country.region || "N/A"],
    ["Subregion", country.subregion || "N/A"],
    ["Continents", formatValues(country.continents)],
    ["Languages", formatValues(Object.values(country.languages || {}))],
    ["Currencies", formatCurrencies(country.currencies)],
    ["Time Zones", formatValues(country.timezones)],
    ["Calling Code", formatCallingCode(country.idd)],
    ["UN Member", yesNo(country.unMember)],
    ["Independent", yesNo(country.independent)],
    ["Week Starts", country.startOfWeek || "N/A"],
    ["Flag", country.flags?.emoji || "N/A"],
    ["Leader", "Loading..."]
  ];
}

function combineCountries(countries) {
  const gdpYears = uniqueValues(countries.map((country) => country.gdpYear).filter((year) => year != null));

  return {
    countries,
    nativeNames: uniqueValues(countries.map((country) => getNativeName(country)).filter(isPresent)),
    capitals: uniqueValues(countries.flatMap((country) => country.capital || []).filter(isPresent)),
    population: sumValues(countries.map((country) => country.population)),
    gdp: sumValues(countries.map((country) => country.gdp)),
    gdpYears,
    area: sumValues(countries.map((country) => country.area)),
    regions: uniqueValues(countries.map((country) => country.region).filter(isMeaningful)),
    subregions: uniqueValues(countries.map((country) => country.subregion).filter(isMeaningful)),
    continents: uniqueValues(countries.flatMap((country) => country.continents || []).filter(isPresent)),
    languages: uniqueValues(countries.flatMap((country) => Object.values(country.languages || {})).filter(isPresent)),
    currencies: uniqueValues(countries.flatMap((country) => formatCurrencyList(country.currencies)).filter(isPresent)),
    timezones: uniqueValues(countries.flatMap((country) => country.timezones || []).filter(isPresent)),
    callingCodes: uniqueValues(countries.map((country) => formatCallingCode(country.idd)).filter(isMeaningful)),
    unMembers: countTrue(countries.map((country) => country.unMember)),
    independents: countTrue(countries.map((country) => country.independent)),
    weekStarts: uniqueValues(countries.map((country) => country.startOfWeek).filter(isMeaningful)),
    flags: uniqueValues(countries.map((country) => country.flags?.emoji).filter(isPresent))
  };
}

function buildCombinedDetailPairs(combined) {
  const gdpLabel = combined.gdpYears.length === 1
    ? `GDP (USD, latest ${combined.gdpYears[0]})`
    : "GDP (USD, latest by country)";

  return [
    ["Countries", combined.countries.map((country) => country.name.common).join(", ")],
    ["Official Names", combined.countries.map((country) => country.name.official).join(" | ")],
    ["Native Names", formatValues(combined.nativeNames)],
    ["Capitals", formatValues(combined.capitals)],
    ["Population", formatInteger(combined.population)],
    [gdpLabel, formatUsd(combined.gdp)],
    ["Area (km2)", formatInteger(combined.area != null ? Math.round(combined.area) : null)],
    ["Regions", formatValues(combined.regions)],
    ["Subregions", formatValues(combined.subregions)],
    ["Continents", formatValues(combined.continents)],
    ["Languages", formatValues(combined.languages)],
    ["Currencies", formatValues(combined.currencies)],
    ["Time Zones", formatValues(combined.timezones)],
    ["Calling Codes", formatValues(combined.callingCodes)],
    ["UN Members", `${combined.unMembers} of ${combined.countries.length}`],
    ["Independent States", `${combined.independents} of ${combined.countries.length}`],
    ["Week Starts", formatValues(combined.weekStarts)],
    ["Flags", combined.flags.join(" ") || "N/A"],
    ["Leaders", "Loading..."]
  ];
}

function renderDetailPairs(detailPairs) {
  detailList.innerHTML = "";
  detailPairs.forEach(([label, value]) => addDetail(label, value));
}

async function hydrateLeaderDetails(countries) {
  const requestVersion = selectionVersion;
  const results = await Promise.all(countries.map(async (country) => {
    try {
      const leader = await getLeader(country.cca2);
      return { country: country.name.common, leader };
    } catch {
      return { country: country.name.common, leader: null };
    }
  }));

  if (requestVersion !== selectionVersion) {
    return;
  }

  if (countries.length === 1) {
    updateOrInsertDetail("Leader", results[0]?.leader || "Unavailable from live source");
    return;
  }

  const summary = results
    .map((entry) => `${entry.country}: ${entry.leader || "Unavailable"}`)
    .join(" | ");

  updateOrInsertDetail("Leaders", summary || "Unavailable from live source");
}

function buildComboTitle(countries) {
  if (countries.length <= 3) {
    return countries.map((country) => country.name.common).join(" + ");
  }

  return `${countries[0].name.common} + ${countries.length - 1} more`;
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

function getNativeName(country) {
  const native = country?.name?.nativeName || country?.name?.native;
  if (!native) return "N/A";
  const first = Object.values(native)[0];
  if (typeof first === "string") return first;
  return toText(first?.common) || toText(first?.official) || "N/A";
}

function formatCurrencies(currencies = {}) {
  const values = formatCurrencyList(currencies);
  return values.length ? values.join(", ") : "N/A";
}

function formatCurrencyList(currencies = {}) {
  const values = Object.values(currencies);
  return values
    .map((currency) => {
      if (typeof currency === "string") {
        return currency;
      }
      const name = toText(currency?.name);
      const symbol = toText(currency?.symbol);
      if (!name && !symbol) {
        return "";
      }
      return symbol ? `${name || "Currency"} (${symbol})` : name;
    })
    .filter(Boolean);
}

function formatCallingCode(idd = {}) {
  const root = toText(idd.root);
  const suffixes = Array.isArray(idd.suffixes) && idd.suffixes.length ? idd.suffixes : [""];
  const codes = suffixes
    .map((suffix) => `${root}${toText(suffix)}`.trim())
    .filter(Boolean);

  return codes.length ? uniqueValues(codes).join(", ") : "N/A";
}

function yesNo(value) {
  if (value === true) return "Yes";
  if (value === false) return "No";
  return "N/A";
}

function formatInteger(value) {
  return value != null ? fmtInt.format(Math.round(value)) : "N/A";
}

function formatUsd(value) {
  if (value == null) return "N/A";
  const abs = Math.abs(value);
  if (abs >= 1e12) return `$${(value / 1e12).toFixed(abs >= 1e13 ? 0 : 1)}T`;
  if (abs >= 1e9) return `$${(value / 1e9).toFixed(abs >= 1e10 ? 0 : 1)}B`;
  if (abs >= 1e6) return `$${(value / 1e6).toFixed(abs >= 1e7 ? 0 : 1)}M`;
  return `$${fmtInt.format(Math.round(value))}`;
}

function formatValues(values) {
  return values && values.length ? values.join(", ") : "N/A";
}

function sumValues(values) {
  const known = values.filter((value) => value != null);
  if (!known.length) {
    return null;
  }
  return known.reduce((sum, value) => sum + value, 0);
}

function countTrue(values) {
  return values.reduce((count, value) => count + (value === true ? 1 : 0), 0);
}

function uniqueValues(values) {
  return [...new Set(values)];
}

function isPresent(value) {
  return toText(value) !== "";
}

function isMeaningful(value) {
  const text = toText(value);
  return text !== "" && text !== "N/A";
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

function normalizeFeatureId(id) {
  const text = toText(id);
  return text ? text.padStart(3, "0") : "";
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
