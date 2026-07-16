const rise = document.querySelector('#rise');
const heat = document.querySelector('#heat');
const cities = [...document.querySelectorAll('.city')];

function updateSea() {
  const value = Number(rise.value);
  document.querySelector('#riseReadout').textContent = `+${value.toFixed(1)} m`;
  document.querySelector('#floodTint').style.height = `${Math.min(24, value * 2.4)}%`;
  const exposed = cities.filter(city => {
    const active = value >= Number(city.dataset.at);
    city.classList.toggle('submerged', active);
    city.setAttribute('aria-pressed', active);
    return active;
  });
  document.querySelector('#seaNote').textContent = exposed.length
    ? `Illustrative exposure: ${exposed.map(city => city.dataset.name).join(', ')}.`
    : 'Move the control to explore an illustrative scenario.';
}

function updateHeat() {
  const value = Number(heat.value);
  const risk = value >= 4 ? 'EXTREME' : value >= 2.5 ? 'HIGH' : 'ELEVATED';
  document.querySelector('#heatReadout').textContent = `+${value.toFixed(1)}°C`;
  document.querySelector('#heatFill').style.height = `${(value / 5) * 100}%`;
  document.querySelector('#riskPill').textContent = risk;
  document.querySelector('#heatNote').textContent = `Illustrative heat pressure is ${risk.toLowerCase()}. Future versions can connect temperature, humidity and adaptation data.`;
}

rise.addEventListener('input', updateSea);
heat.addEventListener('input', updateHeat);
updateSea();
updateHeat();
