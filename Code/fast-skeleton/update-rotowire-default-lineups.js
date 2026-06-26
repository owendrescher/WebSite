const fs = require('fs');
const path = require('path');

const sourcePath = process.argv[2] || 'rotowire-current-defaults.json';
const outputPath = process.argv[3] || 'rotowire-default-lineups.js';
const payload = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

function assertValidSeeds(seeds) {
  const teams = Object.keys(seeds || {}).sort();
  if (teams.length !== 30) throw new Error(`Expected 30 teams, got ${teams.length}`);
  for (const team of teams) {
    for (const hand of ['RHP', 'LHP']) {
      const names = seeds[team]?.[hand];
      if (!Array.isArray(names) || names.length !== 9) throw new Error(`${team} ${hand} must have 9 hitters`);
      if (new Set(names).size !== names.length) throw new Error(`${team} ${hand} has duplicate hitters`);
    }
  }
}

assertValidSeeds(payload);
const body = [
  '// Generated from current RotoWire default-vs-hand batting orders.',
  `// Generated at ${new Date().toISOString()}.`,
  `window.ROTOWIRE_DEFAULT_LINEUP_SEEDS = ${JSON.stringify(payload)};`,
  ''
].join('\n');
fs.writeFileSync(outputPath, body, 'utf8');
console.log(JSON.stringify({ outputPath, teams: Object.keys(payload).length, lineups: Object.keys(payload).length * 2, slots: Object.keys(payload).length * 18 }, null, 2));
