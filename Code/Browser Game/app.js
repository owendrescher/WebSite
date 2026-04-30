const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const TILE = 40;
const GRID_FEET = 5;
const CHUNK_TILES = 24;
const CHUNK_SIZE = TILE * CHUNK_TILES;
const PLAYER_RADIUS = 15;
const LOAD_RADIUS = 2;
const STEP_DURATION = 0.16;
const MIN_VIEW_TILES_HIGH = 3;
const MAX_VIEW_TILES_HIGH = 100;

const directionVectors = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const movementKeys = {
  w: "up",
  arrowup: "up",
  s: "down",
  arrowdown: "down",
  a: "left",
  arrowleft: "left",
  d: "right",
  arrowright: "right",
};

const terrainColors = {
  grass: "#314f34",
  grass2: "#3e5e3d",
  meadow: "#4d7342",
  path: "#a78355",
  plaza: "#9a8865",
  bridgeH: "#8f643f",
  bridgeV: "#8f643f",
  dirt: "#7c6848",
  field: "#8c8a45",
  yard: "#86704d",
  garden: "#5c7d4d",
  orchard: "#61784a",
  pine: "#244031",
  marsh: "#486b58",
  grave: "#6d745d",
  sand: "#d1bb70",
  scree: "#7c776f",
  shallow: "#4d88a1",
  water: "#2d6f86",
  tree: "#24492e",
  stone: "#71706a",
  flower: "#c8a2a5",
};

const buildingPalettes = [
  { wall: "#986f4b", roof: "#5d3d38", trim: "#d9c7a1" },
  { wall: "#b18758", roof: "#47605b", trim: "#f1dfb8" },
  { wall: "#8f7c57", roof: "#704d41", trim: "#e5d1a8" },
  { wall: "#9f8e67", roof: "#4d5940", trim: "#ead8b4" },
];

const equipmentSlots = [
  ["weapon", "Main Hand"],
  ["ranged", "Ranged"],
  ["armor", "Armor"],
  ["shield", "Shield"],
  ["trinket", "Trinket"],
];

const itemCatalog = {
  longsword: {
    id: "longsword",
    name: "Longsword",
    type: "weapon",
    slot: "weapon",
    style: "melee",
    ability: "str",
    damage: [1, 8, 0],
    weight: 3,
    value: 15,
    summary: "Reliable steel for close work.",
  },
  shortbow: {
    id: "shortbow",
    name: "Shortbow",
    type: "weapon",
    slot: "ranged",
    style: "ranged",
    ability: "dex",
    damage: [1, 6, 0],
    weight: 2,
    value: 14,
    summary: "Light draw, quick release.",
  },
  leather_armor: {
    id: "leather_armor",
    name: "Leather Armor",
    type: "armor",
    slot: "armor",
    armorBase: 11,
    dexCap: 10,
    weight: 10,
    value: 10,
    summary: "Supple hide and stitched plates.",
  },
  wooden_shield: {
    id: "wooden_shield",
    name: "Wooden Shield",
    type: "shield",
    slot: "shield",
    acBonus: 2,
    weight: 6,
    value: 8,
    summary: "Good oak, iron-rimmed.",
  },
  traveler_cloak: {
    id: "traveler_cloak",
    name: "Traveler's Cloak",
    type: "trinket",
    slot: "trinket",
    skillBonus: { ability: "wis", amount: 1, tag: "Observe" },
    weight: 1,
    value: 5,
    summary: "Keeps rain, dust, and eyes off you.",
  },
  healing_potion: {
    id: "healing_potion",
    name: "Healing Potion",
    type: "consumable",
    heal: [2, 4, 2],
    weight: 0.2,
    value: 8,
    summary: "Restores a little life in a hurry.",
  },
  iron_mace: {
    id: "iron_mace",
    name: "Iron Mace",
    type: "weapon",
    slot: "weapon",
    style: "melee",
    ability: "str",
    damage: [1, 6, 1],
    weight: 4,
    value: 12,
    summary: "Heavy-headed, honest, and brutal.",
  },
  chain_shirt: {
    id: "chain_shirt",
    name: "Chain Shirt",
    type: "armor",
    slot: "armor",
    armorBase: 13,
    dexCap: 2,
    weight: 20,
    value: 50,
    summary: "Riveted rings over quilted cloth.",
  },
  guard_lantern: {
    id: "guard_lantern",
    name: "Guard Lantern",
    type: "trinket",
    slot: "trinket",
    skillBonus: { ability: "int", amount: 1, tag: "Search" },
    weight: 1,
    value: 11,
    summary: "A hooded lamp etched with old watch marks.",
  },
};

const firstNames = [
  "Alden", "Bryn", "Calder", "Dessa", "Elian", "Fenn", "Garrick", "Hale",
  "Iona", "Jessa", "Kael", "Liora", "Merrin", "Nola", "Orin", "Petra",
  "Quill", "Rowan", "Sable", "Tamsin", "Ulric", "Vera", "Wyn", "Ysra"
];

const surnames = [
  "Ashwell", "Brindle", "Cask", "Dunlow", "Emberlane", "Fallow", "Greyford",
  "Hearth", "Irongate", "Juniper", "Kettle", "Lark", "Moss", "Nettle",
  "Oatbank", "Pike", "Quarry", "Reed", "Stonecup", "Thatch", "Underhill",
  "Vale", "Wick", "Yarrow"
];

const roles = [
  "Miller", "Smith", "Herbalist", "Teamster", "Innkeeper", "Scribe",
  "Goatherd", "Watch Captain", "Peddler", "Carpenter", "Scout", "Baker",
  "Farmer", "Stablehand", "Guard", "Brewer", "Shepherd", "Potter",
  "Priest", "Hunter", "Cooper", "Merchant"
];

const moods = ["Guarded", "Warm", "Worried", "Shrewd", "Curious", "Tired"];

const secrets = [
  "keeps seeing candlelight in the abandoned granary",
  "owes coin to a masked lender from the north road",
  "found a brass key in the old well",
  "heard drums under the hill after midnight",
  "is hiding a map stitched into a flour sack",
  "believes the shrine bell rings when nobody is near it",
];

const hooks = [
  "missing sheep near the west copse",
  "strange tracks around the millrace",
  "a locked cellar beneath the market store",
  "a fever spreading from the river huts",
  "smoke rising from the quarry road",
  "a courier overdue from Thornbridge",
];

const mbtiWeights = [
  ["ISFJ", 13.8], ["ESFJ", 12.3], ["ISTJ", 11.6], ["ISFP", 8.8],
  ["ESTJ", 8.7], ["ESFP", 8.5], ["ENFP", 8.1], ["ISTP", 5.4],
  ["INFP", 4.4], ["ESTP", 4.3], ["INTP", 3.3], ["ENTP", 3.2],
  ["ENFJ", 2.5], ["INTJ", 2.1], ["ENTJ", 1.8], ["INFJ", 1.5],
];

const ancestryWeights = {
  village: [
    ["Human", 46], ["Halfling", 18], ["Dwarf", 13], ["Elf", 9],
    ["Gnome", 7], ["Tiefling", 4], ["Orc-kin", 3],
  ],
  fields: [
    ["Halfling", 36], ["Human", 34], ["Dwarf", 9], ["Elf", 8],
    ["Gnome", 7], ["Tiefling", 3], ["Orc-kin", 3],
  ],
  woods: [
    ["Elf", 42], ["Human", 24], ["Halfling", 11], ["Gnome", 9],
    ["Dwarf", 6], ["Tiefling", 5], ["Orc-kin", 3],
  ],
  mountains: [
    ["Dwarf", 58], ["Human", 19], ["Gnome", 8], ["Orc-kin", 7],
    ["Elf", 4], ["Halfling", 2], ["Tiefling", 2],
  ],
  river: [
    ["Human", 38], ["Halfling", 18], ["Elf", 15], ["Dwarf", 10],
    ["Gnome", 8], ["Tiefling", 7], ["Orc-kin", 4],
  ],
  road: [
    ["Human", 42], ["Halfling", 15], ["Dwarf", 13], ["Elf", 11],
    ["Tiefling", 8], ["Gnome", 6], ["Orc-kin", 5],
  ],
};

const genderWeights = {
  village: [["Woman", 49], ["Man", 48], ["Nonbinary", 3]],
  fields: [["Woman", 51], ["Man", 46], ["Nonbinary", 3]],
  woods: [["Woman", 47], ["Man", 45], ["Nonbinary", 8]],
  mountains: [["Man", 52], ["Woman", 45], ["Nonbinary", 3]],
  river: [["Woman", 48], ["Man", 47], ["Nonbinary", 5]],
  road: [["Man", 49], ["Woman", 47], ["Nonbinary", 4]],
};

const ancestryVisuals = {
  Human: { skin: "#d7a878", hair: "#3a2a24", body: "#6f4e72", accent: "#d8c395", height: 1, width: 1 },
  Halfling: { skin: "#c99162", hair: "#5b3928", body: "#8f7046", accent: "#e2b761", height: 0.76, width: 0.88 },
  Dwarf: { skin: "#bf815b", hair: "#7a4d30", body: "#5e6674", accent: "#c9a25f", height: 0.82, width: 1.2 },
  Elf: { skin: "#dfbe93", hair: "#e8dfbd", body: "#4d7f71", accent: "#b7d6a2", height: 1.12, width: 0.86 },
  Gnome: { skin: "#d9a871", hair: "#b5543d", body: "#526da1", accent: "#d9c44e", height: 0.68, width: 0.78 },
  Tiefling: { skin: "#9b4b66", hair: "#1f2026", body: "#553a76", accent: "#d5896f", height: 1.02, width: 0.96 },
  "Orc-kin": { skin: "#78915f", hair: "#20251e", body: "#7a5d3d", accent: "#d3d0b3", height: 1.08, width: 1.14 },
};

const genderVisuals = {
  Woman: { waist: 0.84, hair: 1.08, sash: "#d08b96" },
  Man: { waist: 1.06, hair: 0.82, sash: "#7ea2c8" },
  Nonbinary: { waist: 0.94, hair: 0.95, sash: "#d6c36f" },
};

const animalTypes = {
  chicken: { body: "#d9caa1", accent: "#c55343", size: 0.55 },
  cat: { body: "#4d4a46", accent: "#d8c395", size: 0.5 },
  dog: { body: "#8f6b45", accent: "#2b2420", size: 0.72 },
  sheep: { body: "#eee5d0", accent: "#3f342c", size: 0.86 },
  goat: { body: "#b8aa8d", accent: "#4a4137", size: 0.78 },
  cow: { body: "#e6dfcf", accent: "#3b2b23", size: 1.18, long: 1.55 },
  horse: { body: "#8a5d3d", accent: "#2d211b", size: 1.12, long: 1.72 },
  pig: { body: "#d69a91", accent: "#8e4d56", size: 0.82, long: 1.18 },
  deer: { body: "#9a6b44", accent: "#f0dfb9", size: 0.92 },
  raven: { body: "#202329", accent: "#6f7380", size: 0.48 },
};

const animalWeights = {
  village: [["chicken", 26], ["cat", 18], ["dog", 16], ["sheep", 14], ["goat", 10], ["pig", 8], ["cow", 5], ["horse", 3]],
  fields: [["sheep", 28], ["goat", 18], ["cow", 15], ["horse", 11], ["chicken", 10], ["dog", 8], ["deer", 6], ["raven", 4]],
  woods: [["deer", 42], ["raven", 24], ["goat", 12], ["cat", 8], ["dog", 8], ["sheep", 6]],
  mountains: [["goat", 44], ["raven", 24], ["deer", 15], ["dog", 8], ["sheep", 5], ["horse", 4]],
  river: [["raven", 24], ["dog", 16], ["cat", 12], ["sheep", 12], ["goat", 10], ["cow", 8], ["horse", 6], ["deer", 12]],
  road: [["dog", 22], ["raven", 18], ["goat", 15], ["cat", 12], ["horse", 11], ["cow", 8], ["chicken", 8], ["deer", 6]],
};

const questTemplates = [
  { id: "lost_lambs", title: "Lost Lambs by the Fence", area: "fields", objective: "lost lambs", minigame: "timing", reward: 7, xp: 10, text: "Round up the lambs before they scatter into the west barley." },
  { id: "well_runes", title: "Runes in the Old Well", area: "village", objective: "well runes", minigame: "memory", reward: 8, xp: 12, text: "Copy the sequence carved below the well lip." },
  { id: "herb_basket", title: "Moonmint for the Healer", area: "woods", objective: "moonmint patch", minigame: "search", reward: 9, xp: 12, text: "Find clean moonmint without pulling nettles with it." },
  { id: "bridge_planks", title: "Loose Planks on Riverward Bridge", area: "river", objective: "broken bridge", minigame: "timing", reward: 10, xp: 14, text: "Set the planks while the river spray keeps shifting them." },
  { id: "goat_bell", title: "The Bell Goat", area: "mountains", objective: "bell goat", minigame: "barter", reward: 8, xp: 11, text: "Coax a stubborn goat down from the crags." },
  { id: "market_ledger", title: "The Market Ledger", area: "village", objective: "market ledger", minigame: "memory", reward: 6, xp: 9, text: "Rebuild the order of missing ledger marks." },
  { id: "mushroom_ring", title: "Mushrooms Under Blue Pines", area: "woods", objective: "mushroom ring", minigame: "search", reward: 9, xp: 13, text: "Pick the safe caps from a strange ring." },
  { id: "cart_axle", title: "Axle on the East Road", area: "road", objective: "stuck cart", minigame: "timing", reward: 11, xp: 12, text: "Brace the cart while the teamster resets the axle." },
  { id: "shrine_bell", title: "The Shrine Bell Rings Alone", area: "village", objective: "shrine bell", minigame: "memory", reward: 8, xp: 13, text: "Match the bell pattern before the echo fades." },
  { id: "river_eel", title: "Eel in the Millrace", area: "river", objective: "millrace eel", minigame: "timing", reward: 9, xp: 12, text: "Snare the eel when it flashes under the boards." },
  { id: "smoke_quarry", title: "Smoke at the Quarry Road", area: "mountains", objective: "smoke marker", minigame: "search", reward: 12, xp: 15, text: "Find the source of the smoke before dusk." },
  { id: "sly_peddler", title: "A Peddler's Odd Prices", area: "road", objective: "peddler camp", minigame: "barter", reward: 10, xp: 12, text: "Talk down a suspicious price without starting a scene." },
  { id: "courier_cache", title: "Courier Cache", area: "road", objective: "hidden cache", minigame: null, reward: 7, xp: 8, text: "Fetch a sealed pouch from a cairn near the road." },
  { id: "field_scarecrow", title: "Scarecrow Watch", area: "fields", objective: "tilted scarecrow", minigame: null, reward: 6, xp: 7, text: "Check the scarecrow that keeps turning toward town." },
  { id: "quiet_grave", title: "A Name on the Grave Marker", area: "woods", objective: "old grave", minigame: null, reward: 5, xp: 8, text: "Read the marker and bring the name back intact." },
];

const testQuestTemplates = [
  { id: "test_str_millstone", title: "STR: Lift the Millstone", area: "village", objective: "fallen millstone", minigame: "mash", ability: "STR", reward: 5, xp: 8, text: "Hammer the button to heave the millstone back into place." },
  { id: "test_dex_eel", title: "DEX: Snare the Eel", area: "river", objective: "flashing eel", minigame: "timing", ability: "DEX", reward: 5, xp: 8, text: "Stop the marker inside the green zone three times." },
  { id: "test_con_crates", title: "CON: Stack the Crates", area: "village", objective: "crate stack", minigame: "stack", ability: "CON", reward: 5, xp: 8, text: "Drop moving crates into a stable tower." },
  { id: "test_int_ledger", title: "INT: Balance the Ledger", area: "village", objective: "ledger slate", minigame: "math", ability: "INT", reward: 5, xp: 8, text: "Solve the arithmetic before Mara loses patience." },
  { id: "test_wis_riddle", title: "WIS: Riddle at the Shrine", area: "woods", objective: "riddle stone", minigame: "riddle", ability: "WIS", reward: 5, xp: 8, text: "Choose the answer that listens past the words." },
  { id: "test_cha_toast", title: "CHA: Rallying Toast", area: "road", objective: "nervous traveler", minigame: "typing", ability: "CHA", difficulty: 2, reward: 5, xp: 8, text: "Type the toast cleanly and quickly to win the room." },
];

const riddleBank = [
  { q: "I speak without a mouth and answer without ears. What am I?", a: "Echo", options: ["Echo", "Lantern", "River", "Shadow"] },
  { q: "The more you take from me, the larger I become.", a: "Hole", options: ["Debt", "Hole", "Fire", "Road"] },
  { q: "I follow every traveler, but vanish in full darkness.", a: "Shadow", options: ["Shadow", "Name", "Boot", "Coin"] },
];

const typingPhrases = [
  "steady hearts make steady hands",
  "the road is long but we are longer",
  "good courage keeps the lantern lit",
];

const xpThresholds = [0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000, 85000];

const roleServices = {
  Tavernkeep: ["Quests", "Rooms", "Rumors"],
  Innkeeper: ["Quests", "Rooms", "Rumors"],
  Baker: ["Food", "Rumors"],
  Brewer: ["Food", "Rumors"],
  Herbalist: ["Tonics", "Healing", "Training"],
  "Hedge Healer": ["Tonics", "Healing", "Training"],
  Smith: ["Gear", "Training"],
  Carpenter: ["Supplies", "Training"],
  Guard: ["Rumors", "Training"],
  "Watch Captain": ["Rumors", "Training"],
  Scout: ["Rumors", "Training"],
  Hunter: ["Supplies", "Training"],
  Merchant: ["Trade", "Supplies"],
  Peddler: ["Trade", "Supplies"],
  Stablehand: ["Travel", "Rumors"],
  Miller: ["Food", "Rumors"],
  Priest: ["Blessing", "Rumors"],
};

const professionProps = {
  Tavernkeep: "mug",
  Innkeeper: "mug",
  Baker: "basket",
  Brewer: "mug",
  Smith: "hammer",
  Carpenter: "hammer",
  Herbalist: "satchel",
  "Hedge Healer": "satchel",
  Guard: "spear",
  "Watch Captain": "spear",
  Scout: "bow",
  Hunter: "bow",
  Stablehand: "rope",
  Miller: "sack",
  Shepherd: "crook",
  Farmer: "sack",
  Priest: "lantern",
  Merchant: "ledger",
  Peddler: "ledger",
  Scribe: "ledger",
};

const hostileProfiles = {
  woods: [
    { kind: "Wolf", hp: 9, ac: 13, attack: 4, damage: [1, 6, 2], xp: 35, intent: "Circle and snap." },
    { kind: "Bandit Scout", hp: 12, ac: 12, attack: 3, damage: [1, 8, 1], xp: 45, intent: "Look for an opening." },
  ],
  road: [
    { kind: "Bandit", hp: 11, ac: 12, attack: 3, damage: [1, 6, 2], xp: 40, intent: "Rush with a rough blade." },
    { kind: "Cutpurse", hp: 8, ac: 14, attack: 4, damage: [1, 4, 3], xp: 35, intent: "Feint and dart away." },
  ],
  mountains: [
    { kind: "Raider", hp: 14, ac: 13, attack: 4, damage: [1, 8, 2], xp: 55, intent: "Crash downhill hard." },
    { kind: "Stoneback Boar", hp: 16, ac: 12, attack: 4, damage: [2, 4, 2], xp: 60, intent: "Charge straight through." },
  ],
  river: [
    { kind: "River Knife", hp: 10, ac: 13, attack: 4, damage: [1, 6, 2], xp: 42, intent: "Strike from wet cover." },
    { kind: "Marsh Hound", hp: 9, ac: 13, attack: 4, damage: [1, 6, 1], xp: 38, intent: "Bark and lunge." },
  ],
  fields: [
    { kind: "Wild Dog", hp: 8, ac: 12, attack: 3, damage: [1, 6, 1], xp: 30, intent: "Worry the flanks." },
    { kind: "Poacher", hp: 10, ac: 12, attack: 3, damage: [1, 8, 1], xp: 40, intent: "Loose an arrow then run." },
  ],
};

const dungeonEnemyProfiles = [
  { kind: "Goblin Delver", hp: 18, ac: 13, attack: 4, damage: [1, 6, 2], xp: 85, intent: "Slides in and cuts at the gaps." },
  { kind: "Skeleton Sentry", hp: 20, ac: 14, attack: 4, damage: [1, 8, 1], xp: 95, intent: "Holds the choke and batters forward." },
  { kind: "Barrow Bandit", hp: 16, ac: 13, attack: 5, damage: [1, 6, 3], xp: 90, intent: "Tests your guard with quick feints." },
];

const dungeonSiteNames = ["Sunken Barrow", "Mosscrypt", "Old Watch Cellar", "Ashvault"];

const biomePresets = [
  { category: "fields", variant: "meadow", names: ["Amber Reach", "Longgrass", "Clover Plain", "Sunmeadow"] },
  { category: "fields", variant: "orchard", names: ["Apple March", "Cider Fold", "Pearbank", "Orchard Rise"] },
  { category: "fields", variant: "heath", names: ["Heather Step", "Bramble Flat", "Red Heath", "Thorn Heath"] },
  { category: "woods", variant: "broadwood", names: ["Blueleaf Wood", "Ashen Copse", "Hollow Bough", "Blackbriar Wood"] },
  { category: "woods", variant: "pinewood", names: ["Needle March", "Cold Pine", "Green Spire", "Moss Pine"] },
  { category: "mountains", variant: "highland", names: ["Slate Rise", "Grey Shelf", "Windbreak Heights", "Stone Crown"] },
  { category: "mountains", variant: "crags", names: ["Broken Teeth", "Raven Crags", "Iron Step", "Old Quarry Rim"] },
  { category: "river", variant: "fen", names: ["Reedfen", "Mirebank", "Stillwater Fen", "Glass Reed"] },
];

const villageBuildingTemplates = [
  { id: "tavern", kind: "Tavern", label: "Hearth & Harrow", x: 6, y: -14, w: 5, h: 3, workforce: ["Tavernkeep"], occupants: 4, district: "North Row", doorSide: "south", pathTo: { x: 8, y: -10 } },
  { id: "forge", kind: "Forge", label: "Forge", x: 15, y: -15, w: 4, h: 4, workforce: ["Smith"], occupants: 2, district: "North Row", doorSide: "south", pathTo: { x: 17, y: -10 } },
  { id: "shrine", kind: "Shrine", label: "Shrine", x: -24, y: -18, w: 3, h: 4, workforce: ["Priest"], occupants: 1, district: "Bell Walk", doorSide: "east", pathTo: { x: -18, y: -15 }, plot: { x: -29, y: -22, w: 7, h: 5, terrain: "grave" } },
  { id: "healerHouse", kind: "Cottage", label: "Healer's Cottage", x: -8, y: -26, w: 3, h: 3, workforce: ["Herbalist"], occupants: 2, district: "North Verge", doorSide: "south", pathTo: { x: -6, y: -21 }, plot: { x: -12, y: -25, w: 5, h: 5, terrain: "garden" } },
  { id: "northCottage", kind: "Cottage", label: "Lantern House", x: 3, y: -26, w: 3, h: 3, workforce: ["Peddler"], occupants: 2, district: "North Verge", doorSide: "south", pathTo: { x: 5, y: -21 }, plot: { x: 0, y: -24, w: 4, h: 4, terrain: "yard" } },
  { id: "orchardHouse", kind: "Cottage", label: "Orchard House", x: 15, y: -26, w: 3, h: 3, workforce: ["Laborer"], occupants: 2, district: "Orchard Lane", doorSide: "south", pathTo: { x: 18, y: -21 }, plot: { x: 20, y: -26, w: 8, h: 7, terrain: "orchard" } },
  { id: "bakery", kind: "Bakery", label: "Bakery", x: -11, y: 12, w: 4, h: 3, workforce: ["Baker"], occupants: 2, district: "South Row", doorSide: "north", pathTo: { x: -9, y: 10 } },
  { id: "store", kind: "Store", label: "Store", x: 8, y: 12, w: 4, h: 3, workforce: ["Merchant"], occupants: 2, district: "South Row", doorSide: "north", pathTo: { x: 10, y: 10 } },
  { id: "stable", kind: "Stable", label: "Stable", x: 19, y: 12, w: 5, h: 3, workforce: ["Stablehand"], occupants: 2, district: "South Row", doorSide: "north", pathTo: { x: 21, y: 10 }, pen: { x: 26, y: 12, w: 6, h: 4 } },
  { id: "westFarm", kind: "Farmhouse", label: "West Fold Farm", x: -31, y: 12, w: 4, h: 3, workforce: ["Farmer"], occupants: 5, district: "West Fold", doorSide: "north", pathTo: { x: -29, y: 10 }, plot: { x: -35, y: 16, w: 13, h: 8, terrain: "field" } },
  { id: "southCottage", kind: "Cottage", label: "South Cottage", x: -23, y: 18, w: 3, h: 3, workforce: ["Shepherd"], occupants: 2, district: "West Fold", doorSide: "north", pathTo: { x: -21, y: 16 }, pen: { x: -29, y: 18, w: 5, h: 4 } },
  { id: "eastCottage", kind: "Cottage", label: "East Cottage", x: 19, y: 20, w: 3, h: 3, workforce: ["Carpenter"], occupants: 3, district: "East Spur", doorSide: "west", pathTo: { x: 17, y: 21 }, plot: { x: 23, y: 20, w: 7, h: 5, terrain: "garden" } },
];

const tavernSize = { w: 16, h: 12 };
const tavernkeeper = {
  id: "tavernkeep",
  name: "Mara Hearth",
  role: "Tavernkeep",
  mood: "Busy",
  ancestry: "Human",
  gender: "Woman",
  personality: "ESFJ",
  x: 8.5 * TILE,
  y: 3.5 * TILE,
  speech: "",
  speechTimer: 0,
  lineIndex: 0,
  trust: 1,
  homeName: "Hearth & Harrow",
  workName: "Quest Board",
  district: "Market",
  serviceTags: ["Quests", "Rooms", "Rumors"],
  goods: buildTradeInventory("Tavernkeep", mulberry32(hashString("mara-goods"))),
  appearance: makeAppearance(mulberry32(hashString("mara-look")), "Human", "Woman", "Tavernkeep"),
};

const player = {
  name: "Mira Thorn",
  className: "Fighter",
  level: 1,
  hp: 12,
  maxHp: 12,
  ac: 14,
  gold: 18,
  xp: 0,
  speed: 30,
  proficiencyBonus: 2,
  potions: 2,
  reputation: 0,
  tempAc: 0,
  secondWindUsed: false,
  actionSurgeUsed: false,
  inventory: [],
  equipment: {
    weapon: null,
    ranged: null,
    armor: null,
    shield: null,
    trinket: null,
  },
  stats: {
    str: 10,
    dex: 15,
    con: 13,
    int: 12,
    wis: 14,
    cha: 11,
  },
  x: TILE / 2,
  y: TILE / 2,
  fromX: TILE / 2,
  fromY: TILE / 2,
  targetX: TILE / 2,
  targetY: TILE / 2,
  moveProgress: 0,
  moving: false,
  facing: "down",
  walkClock: 0,
};

const keys = new Set();
const chunks = new Map();
const visibleChunkKeys = new Set();
let activeNpc = null;
let nearestNpc = null;
let lastTime = performance.now();
let currentChunkId = "";
let promptTimer = 0;
let worldSeed = Math.floor(Math.random() * 1000000);
let queuedDirection = null;
let gameMode = "world";
let worldReturnPosition = { x: TILE / 2, y: TILE / 2 };
let worldClock = 8 * 60;
let worldLayout = null;
let worldModel = null;
let tavernPatrons = [];
let availableQuests = [];
let activeQuests = [];
let completedQuestIds = new Set();
let questIdCounter = 0;
let currentObjective = null;
let minigame = null;
let nearbyThreat = null;
let combatState = null;
let diceOverlay = null;
let freeCheckIndex = 0;
let cameraZoom = 1;
let questTrackerDirty = true;
let lastQuestTrackerTile = "";
let inventoryVisible = false;
let itemUidCounter = 1;
let dungeonSite = null;
let dungeonState = null;
let worldMovementTick = 0;

const ui = {
  heroName: document.getElementById("heroName"),
  heroClass: document.getElementById("heroClass"),
  heroLevel: document.getElementById("heroLevel"),
  proficiencyBonus: document.getElementById("proficiencyBonus"),
  heroSpeed: document.getElementById("heroSpeed"),
  hpNow: document.getElementById("hpNow"),
  hpMax: document.getElementById("hpMax"),
  healthFill: document.getElementById("healthFill"),
  armorClass: document.getElementById("armorClass"),
  gold: document.getElementById("gold"),
  xp: document.getElementById("xp"),
  xpNext: document.getElementById("xpNext"),
  regionName: document.getElementById("regionName"),
  areaName: document.getElementById("areaName"),
  timeOfDay: document.getElementById("timeOfDay"),
  localThreat: document.getElementById("localThreat"),
  kitBackdrop: document.getElementById("kitBackdrop"),
  kitPanel: document.getElementById("kitPanel"),
  equipmentGrid: document.getElementById("equipmentGrid"),
  inventoryList: document.getElementById("inventoryList"),
  carryWeight: document.getElementById("carryWeight"),
  carryValue: document.getElementById("carryValue"),
  potionCount: document.getElementById("potionCount"),
  inventoryToggleButton: document.getElementById("inventoryToggleButton"),
  toggleKitButton: document.getElementById("toggleKitButton"),
  settlementName: document.getElementById("settlementName"),
  settlementMood: document.getElementById("settlementMood"),
  populationCount: document.getElementById("populationCount"),
  homeCount: document.getElementById("homeCount"),
  worksiteCount: document.getElementById("worksiteCount"),
  prosperityScore: document.getElementById("prosperityScore"),
  serviceList: document.getElementById("serviceList"),
  nearbyList: document.getElementById("nearbyList"),
  eventLog: document.getElementById("eventLog"),
  prompt: document.getElementById("prompt"),
  npcPanel: document.getElementById("npcPanel"),
  npcRole: document.getElementById("npcRole"),
  npcName: document.getElementById("npcName"),
  npcText: document.getElementById("npcText"),
  npcAncestry: document.getElementById("npcAncestry"),
  npcGender: document.getElementById("npcGender"),
  npcDc: document.getElementById("npcDc"),
  npcMood: document.getElementById("npcMood"),
  npcHome: document.getElementById("npcHome"),
  npcWork: document.getElementById("npcWork"),
  npcTrust: document.getElementById("npcTrust"),
  npcServicePanel: document.getElementById("npcServicePanel"),
  questPanel: document.getElementById("questPanel"),
  questIntro: document.getElementById("questIntro"),
  questList: document.getElementById("questList"),
  questTracker: document.getElementById("questTracker"),
  minigamePanel: document.getElementById("minigamePanel"),
  minigameType: document.getElementById("minigameType"),
  minigameTitle: document.getElementById("minigameTitle"),
  minigameText: document.getElementById("minigameText"),
  minigameStage: document.getElementById("minigameStage"),
  statStr: document.getElementById("statStr"),
  statDex: document.getElementById("statDex"),
  statCon: document.getElementById("statCon"),
  statInt: document.getElementById("statInt"),
  statWis: document.getElementById("statWis"),
  statCha: document.getElementById("statCha"),
  modStr: document.getElementById("modStr"),
  modDex: document.getElementById("modDex"),
  modCon: document.getElementById("modCon"),
  modInt: document.getElementById("modInt"),
  modWis: document.getElementById("modWis"),
  modCha: document.getElementById("modCha"),
  combatPanel: document.getElementById("combatPanel"),
  combatTitle: document.getElementById("combatTitle"),
  combatHeroName: document.getElementById("combatHeroName"),
  combatHeroHp: document.getElementById("combatHeroHp"),
  combatHeroAc: document.getElementById("combatHeroAc"),
  combatHeroState: document.getElementById("combatHeroState"),
  combatEnemyName: document.getElementById("combatEnemyName"),
  combatEnemyHp: document.getElementById("combatEnemyHp"),
  combatEnemyAc: document.getElementById("combatEnemyAc"),
  combatEnemyIntent: document.getElementById("combatEnemyIntent"),
  combatStatus: document.getElementById("combatStatus"),
  combatLog: document.getElementById("combatLog"),
  combatStrikeButton: document.getElementById("combatStrikeButton"),
  combatShotButton: document.getElementById("combatShotButton"),
  combatBraceButton: document.getElementById("combatBraceButton"),
  combatSurgeButton: document.getElementById("combatSurgeButton"),
  combatItemButton: document.getElementById("combatItemButton"),
  combatFleeButton: document.getElementById("combatFleeButton"),
  dicePanel: document.getElementById("dicePanel"),
  diceType: document.getElementById("diceType"),
  diceRollValue: document.getElementById("diceRollValue"),
  diceReason: document.getElementById("diceReason"),
  diceOutcome: document.getElementById("diceOutcome"),
  diceBreakdown: document.getElementById("diceBreakdown"),
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function smoothStep(value, min, max) {
  if (max === min) return value >= max ? 1 : 0;
  const t = clamp((value - min) / (max - min), 0, 1);
  return t * t * (3 - 2 * t);
}

function minZoom() {
  return window.innerHeight / (TILE * MAX_VIEW_TILES_HIGH);
}

function maxZoom() {
  return window.innerHeight / (TILE * MIN_VIEW_TILES_HIGH);
}

function clampZoom() {
  cameraZoom = clamp(cameraZoom, minZoom(), maxZoom());
}

function visibleWidth() {
  return window.innerWidth / cameraZoom;
}

function visibleHeight() {
  return window.innerHeight / cameraZoom;
}

function setZoom(nextZoom) {
  cameraZoom = nextZoom;
  clampZoom();
  showPrompt(`Zoom: ${Math.round(visibleHeight() / TILE)} tiles high`);
}

function zoomBy(factor) {
  setZoom(cameraZoom * factor);
}

function terrainDetailLevel() {
  const tilesHigh = visibleHeight() / TILE;
  if (tilesHigh > 58) return 0;
  if (tilesHigh > 30) return 1;
  return 2;
}

function actorDetailLevel() {
  const tilesHigh = visibleHeight() / TILE;
  if (tilesHigh > 52) return 0;
  if (tilesHigh > 26) return 1;
  return 2;
}

function hashString(value) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed) {
  return function random() {
    let t = seed += 0x6d2b79f5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randomChoice(random, list) {
  return list[Math.floor(random() * list.length)];
}

function weightedChoice(random, entries) {
  const total = entries.reduce((sum, entry) => sum + entry[1], 0);
  let roll = random() * total;
  for (const [value, weight] of entries) {
    roll -= weight;
    if (roll <= 0) return value;
  }
  return entries[entries.length - 1][0];
}

function createItem(id, overrides = {}) {
  const base = itemCatalog[id];
  if (!base) return null;
  return {
    ...base,
    uid: `item:${itemUidCounter++}`,
    ...overrides,
  };
}

function addItemToInventory(id, overrides = {}) {
  const item = createItem(id, overrides);
  if (!item) return null;
  player.inventory.push(item);
  return item;
}

function inventoryItemByUid(uid) {
  return player.inventory.find((item) => item.uid === uid) || null;
}

function removeInventoryItem(uid) {
  const index = player.inventory.findIndex((item) => item.uid === uid);
  if (index < 0) return null;
  return player.inventory.splice(index, 1)[0];
}

function getEquippedItem(slot) {
  const uid = player.equipment?.[slot];
  return uid ? inventoryItemByUid(uid) : null;
}

function countInventoryItems(id) {
  return player.inventory.filter((item) => item.id === id).length;
}

function totalCarryWeight() {
  return player.inventory.reduce((sum, item) => sum + (item.weight || 0), 0);
}

function totalInventoryValue() {
  return player.inventory.reduce((sum, item) => sum + (item.value || 0), 0);
}

function equippedSkillBonus(tag) {
  let bonus = 0;
  for (const [slot] of equipmentSlots) {
    const item = getEquippedItem(slot);
    if (item?.skillBonus && item.skillBonus.tag === tag) bonus += item.skillBonus.amount;
  }
  return bonus;
}

function ensureStarterKit() {
  if (player.inventory.length > 0) return;
  addItemToInventory("longsword");
  addItemToInventory("shortbow");
  addItemToInventory("leather_armor");
  addItemToInventory("wooden_shield");
  addItemToInventory("traveler_cloak");
  addItemToInventory("healing_potion");
  addItemToInventory("healing_potion");
  const sword = player.inventory.find((item) => item.id === "longsword");
  const bow = player.inventory.find((item) => item.id === "shortbow");
  const armor = player.inventory.find((item) => item.id === "leather_armor");
  const shield = player.inventory.find((item) => item.id === "wooden_shield");
  const cloak = player.inventory.find((item) => item.id === "traveler_cloak");
  player.equipment.weapon = sword?.uid || null;
  player.equipment.ranged = bow?.uid || null;
  player.equipment.armor = armor?.uid || null;
  player.equipment.shield = shield?.uid || null;
  player.equipment.trinket = cloak?.uid || null;
}

function equipInventoryItem(uid) {
  const item = inventoryItemByUid(uid);
  if (!item || !item.slot) return;
  player.equipment[item.slot] = uid;
  syncPlayerDerived();
  updateHud();
  logEvent("Kit", `${item.name} equipped.`);
}

function unequipSlot(slot) {
  const item = getEquippedItem(slot);
  if (!item) return;
  player.equipment[slot] = null;
  syncPlayerDerived();
  updateHud();
  logEvent("Kit", `${item.name} stowed.`);
}

function useInventoryItem(uid, options = {}) {
  const item = inventoryItemByUid(uid);
  if (!item) return;
  if (item.type === "consumable" && item.heal) {
    const heal = rollDamage(item.heal[0], item.heal[1], item.heal[2], item.name);
    player.hp = clamp(player.hp + heal, 1, player.maxHp);
    removeInventoryItem(uid);
    player.potions = countInventoryItems("healing_potion");
    if (!options.silent) logEvent("Item", `${item.name} restores ${heal} HP.`);
    updateHud();
  }
}

function toggleInventoryPanel(force) {
  inventoryVisible = force === undefined ? !inventoryVisible : !!force;
  if (inventoryVisible) {
    closeNpc();
    closeQuestPanel();
    closeMinigame();
  }
  ui.kitPanel.classList.toggle("hidden", !inventoryVisible);
  ui.kitBackdrop.classList.toggle("hidden", !inventoryVisible);
  if (inventoryVisible) renderKitPanel();
}

function equippedWeapon(style) {
  if (style === "ranged") return getEquippedItem("ranged") || getEquippedItem("weapon");
  return getEquippedItem("weapon") || getEquippedItem("ranged");
}

function snapToTile(value) {
  return Math.round(value / TILE) * TILE;
}

function snapToTileCenter(value) {
  return Math.floor(value / TILE) * TILE + TILE / 2;
}

function chunkKey(cx, cy) {
  return `${cx},${cy}`;
}

function worldToChunk(value) {
  return Math.floor(value / CHUNK_SIZE);
}

function rectsIntersect(a, b) {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

function chunkContainsVillage(cx, cy) {
  if (!worldModel?.surfaceBounds) return Math.hypot(cx, cy) < 1.2;
  const bounds = {
    left: cx * CHUNK_SIZE,
    top: cy * CHUNK_SIZE,
    right: cx * CHUNK_SIZE + CHUNK_SIZE,
    bottom: cy * CHUNK_SIZE + CHUNK_SIZE,
  };
  return rectsIntersect(bounds, worldModel.surfaceBounds);
}

function getAreaProfile(cx, cy) {
  const wx = cx * CHUNK_SIZE + CHUNK_SIZE / 2;
  const wy = cy * CHUNK_SIZE + CHUNK_SIZE / 2;
  if (chunkContainsVillage(cx, cy) || Math.hypot(wx, wy) < TILE * 20) {
    return { id: "village", name: cx === 0 && cy === 0 ? "Village Green" : "Waymark Vale", region: "Waymark Vale", variant: "village" };
  }
  const biome = biomeBlendAtWorld(wx, wy).primary;
  const roadInfo = nearestRoadInfo(wx, wy);
  const riverInfo = nearestRiverInfo(wx, wy);
  if (roadInfo.distance < TILE * 0.8) {
    return { id: "road", name: `${biome.name} Road`, region: biome.region, variant: biome.variant };
  }
  if (riverInfo.segment && riverInfo.distance < riverInfo.segment.width * 2.2) {
    return { id: "river", name: riverInfo.segment.name, region: "Lowlands", variant: biome.variant };
  }
  return { id: biome.category, name: biome.name, region: biome.region, variant: biome.variant };
}

function mod(score) {
  const value = Math.floor((score - 10) / 2);
  return value >= 0 ? `+${value}` : `${value}`;
}

function numericMod(score) {
  return Math.floor((score - 10) / 2);
}

function proficiencyForLevel(level) {
  if (level >= 17) return 6;
  if (level >= 13) return 5;
  if (level >= 9) return 4;
  if (level >= 5) return 3;
  return 2;
}

function nextLevelXp(level) {
  return xpThresholds[Math.min(level, xpThresholds.length - 1)] || xpThresholds[xpThresholds.length - 1];
}

function gainXp(amount, label = "Progress") {
  player.xp += amount;
  levelUpIfNeeded();
  updateHud();
  logEvent("XP", `${label}: +${amount} XP.`);
}

function levelUpIfNeeded() {
  let leveled = false;
  while (player.level < xpThresholds.length - 1 && player.xp >= nextLevelXp(player.level)) {
    player.level += 1;
    player.proficiencyBonus = proficiencyForLevel(player.level);
    const hpGain = Math.max(4, 6 + numericMod(player.stats.con));
    player.maxHp += hpGain;
    player.hp = player.maxHp;
    if (player.level === 4 || player.level === 8) {
      player.stats.dex += 1;
      player.stats.wis += 1;
    }
    player.secondWindUsed = false;
    player.actionSurgeUsed = false;
    leveled = true;
    logEvent("Level", `Reached level ${player.level}. Max HP +${hpGain}, proficiency bonus now +${player.proficiencyBonus}.`);
    showPrompt(`Level ${player.level}. Your footing in the vale deepens.`);
  }
  if (leveled) syncPlayerDerived();
}

function syncPlayerDerived() {
  player.proficiencyBonus = proficiencyForLevel(player.level);
  ensureStarterKit();
  const armor = getEquippedItem("armor");
  const shield = getEquippedItem("shield");
  const dexBonus = numericMod(player.stats.dex);
  const armorAc = armor ? armor.armorBase + Math.min(dexBonus, armor.dexCap ?? dexBonus) : 10 + dexBonus;
  player.ac = armorAc + (shield?.acBonus || 0) + Math.floor(player.level / 4) + player.tempAc;
  player.potions = countInventoryItems("healing_potion");
}

function worldTimeLabel() {
  const hour = Math.floor(worldClock / 60) % 24;
  if (hour < 6) return "Before Dawn";
  if (hour < 10) return "Early Morning";
  if (hour < 13) return "Late Morning";
  if (hour < 17) return "Afternoon";
  if (hour < 20) return "Evening";
  return "Night";
}

function advanceWorldTime(minutes) {
  worldClock = (worldClock + minutes) % (24 * 60);
}

function showDiceRoll(result, options = {}) {
  const outcome = result.success === undefined ? "Roll" : result.success ? "Success" : "Failure";
  diceOverlay = {
    timer: options.duration || 1.25,
    type: options.die || "d20",
    value: result.roll,
    reason: options.reason || result.label || "Check",
    outcome,
    breakdown: options.breakdown || `${result.roll}${modText(result.bonus)} = ${result.total}${result.dc ? ` vs DC ${result.dc}` : ""}`,
  };
  ui.diceType.textContent = diceOverlay.type;
  ui.diceRollValue.textContent = String(diceOverlay.value);
  ui.diceReason.textContent = diceOverlay.reason;
  ui.diceOutcome.textContent = outcome;
  ui.diceBreakdown.textContent = diceOverlay.breakdown;
  ui.dicePanel.classList.remove("hidden");
}

function updateDiceOverlay(delta) {
  if (!diceOverlay) return;
  diceOverlay.timer -= delta;
  if (diceOverlay.timer <= 0) {
    diceOverlay = null;
    ui.dicePanel.classList.add("hidden");
  }
}

function rollD20(abilityKey, dc, label = "Check", options = {}) {
  const roll = Math.floor(Math.random() * 20) + 1;
  const abilityBonus = abilityKey ? numericMod(player.stats[abilityKey]) : 0;
  const bonus = abilityBonus + (options.proficient ? player.proficiencyBonus : 0) + (options.bonus || 0);
  const total = roll + bonus;
  const result = { roll, bonus, total, dc, success: total >= dc, label };
  if (!options.silent) showDiceRoll(result, { reason: label });
  return result;
}

function rollDamage(count, sides, bonus = 0, label = "Damage") {
  let roll = 0;
  for (let i = 0; i < count; i += 1) roll += Math.floor(Math.random() * sides) + 1;
  const total = Math.max(1, roll + bonus);
  showDiceRoll({ roll, bonus, total, success: undefined, label }, {
    die: `d${sides}`,
    reason: label,
    breakdown: `${count}d${sides}${modText(bonus)} = ${total}`,
    duration: 1.1,
  });
  return total;
}

function resize() {
  const scale = window.devicePixelRatio || 1;
  canvas.width = Math.floor(window.innerWidth * scale);
  canvas.height = Math.floor(window.innerHeight * scale);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  clampZoom();
}

function tileKey(tx, ty) {
  return `${tx},${ty}`;
}

function tileKeyFromWorld(x, y) {
  return tileKey(Math.floor(x / TILE), Math.floor(y / TILE));
}

function tileCenter(tx, ty) {
  return { x: tx * TILE + TILE / 2, y: ty * TILE + TILE / 2 };
}

function setSurfaceTile(surfaceTiles, tx, ty, terrain) {
  surfaceTiles.set(tileKey(tx, ty), terrain);
}

function stampSurfaceRect(surfaceTiles, tx, ty, width, height, terrain) {
  for (let y = ty; y < ty + height; y += 1) {
    for (let x = tx; x < tx + width; x += 1) {
      setSurfaceTile(surfaceTiles, x, y, terrain);
    }
  }
}

function stampSurfaceLine(surfaceTiles, x1, y1, x2, y2, terrain) {
  const stepX = x1 === x2 ? 0 : x2 > x1 ? 1 : -1;
  const stepY = y1 === y2 ? 0 : y2 > y1 ? 1 : -1;
  let x = x1;
  let y = y1;
  setSurfaceTile(surfaceTiles, x, y, terrain);
  while (x !== x2 || y !== y2) {
    if (x !== x2) x += stepX;
    else if (y !== y2) y += stepY;
    setSurfaceTile(surfaceTiles, x, y, terrain);
  }
}

function stampSurfaceBand(surfaceTiles, orientation, along, start, end, width, terrain = "path") {
  const from = Math.min(start, end);
  const to = Math.max(start, end);
  const half = Math.floor(width / 2);
  if (orientation === "horizontal") {
    stampSurfaceRect(surfaceTiles, from, along - half, to - from + 1, width, terrain);
  } else {
    stampSurfaceRect(surfaceTiles, along - half, from, width, to - from + 1, terrain);
  }
}

function distanceToSegment(x, y, segment) {
  const dx = segment.x2 - segment.x1;
  const dy = segment.y2 - segment.y1;
  const lengthSq = dx * dx + dy * dy || 1;
  let t = ((x - segment.x1) * dx + (y - segment.y1) * dy) / lengthSq;
  t = clamp(t, 0, 1);
  const px = segment.x1 + dx * t;
  const py = segment.y1 + dy * t;
  return {
    distance: Math.hypot(x - px, y - py),
    point: { x: px, y: py },
    t,
  };
}

function nearestSegmentInfo(x, y, segments) {
  let best = { distance: Infinity, point: { x, y }, segment: null };
  for (const segment of segments) {
    const test = distanceToSegment(x, y, segment);
    if (test.distance < best.distance) {
      best = { ...test, segment };
    }
  }
  return best;
}

function nearestRoadInfo(x, y) {
  return nearestSegmentInfo(x, y, worldLayout?.roads || []);
}

function nearestRiverInfo(x, y) {
  return nearestSegmentInfo(x, y, worldLayout?.rivers || []);
}

function makeBiomeName(random, preset) {
  return randomChoice(random, preset.names);
}

function buildRoadLayout(random) {
  const roads = [
    { x1: 0, y1: -5200, x2: 0, y2: 5200, orientation: "vertical", name: "Vale Road" },
    { x1: -4200, y1: 0, x2: 4200, y2: 0, orientation: "horizontal", name: "Market Road" },
  ];
  const branchX = (12 + Math.floor(random() * 12)) * TILE;
  const branchY = (9 + Math.floor(random() * 10)) * TILE;
  roads.push({ x1: branchX, y1: 0, x2: branchX, y2: branchY, orientation: "vertical", name: "Mill Lane" });
  roads.push({ x1: -branchX, y1: 0, x2: -branchX, y2: -branchY, orientation: "vertical", name: "Hedge Walk" });
  return roads;
}

function buildRiver(random, axis, name) {
  const points = [];
  if (axis === "vertical") {
    let x = (random() * 2 - 1) * 2200;
    let drift = (random() * 2 - 1) * 140;
    for (let y = -5600; y <= 5600; y += 320) {
      drift += (random() - 0.5) * 140;
      drift = clamp(drift, -240, 240);
      x += drift * 0.35 + (random() - 0.5) * 70;
      points.push({ x, y });
    }
  } else {
    let y = (random() * 2 - 1) * 2200;
    let drift = (random() * 2 - 1) * 140;
    for (let x = -5600; x <= 5600; x += 320) {
      drift += (random() - 0.5) * 140;
      drift = clamp(drift, -240, 240);
      y += drift * 0.35 + (random() - 0.5) * 70;
      points.push({ x, y });
    }
  }
  const segments = [];
  for (let i = 0; i < points.length - 1; i += 1) {
    segments.push({
      x1: points[i].x,
      y1: points[i].y,
      x2: points[i + 1].x,
      y2: points[i + 1].y,
      width: 22 + Math.floor(random() * 16),
      name,
    });
  }
  return segments;
}

function buildBiomeSites(random) {
  const sites = [];
  const innerPresets = biomePresets.filter((preset) => preset.category !== "mountains");
  for (let cluster = 0; cluster < 10; cluster += 1) {
    const innerRing = cluster < 5;
    const preset = randomChoice(random, innerRing ? innerPresets : biomePresets);
    const siteName = makeBiomeName(random, preset);
    const angle = random() * Math.PI * 2;
    const radius = innerRing ? 900 + random() * 1900 : 2200 + random() * 3200;
    const centerX = Math.cos(angle) * radius + (random() - 0.5) * 980;
    const centerY = Math.sin(angle) * radius + (random() - 0.5) * 980;
    const clusterRadius = (innerRing ? 980 : 1460) + random() * (innerRing ? 1200 : 1700);
    const childCount = 3 + Math.floor(random() * 3);
    for (let child = 0; child < childCount; child += 1) {
      const childAngle = random() * Math.PI * 2;
      const childRadius = random() * clusterRadius * 0.7;
      sites.push({
        x: centerX + Math.cos(childAngle) * childRadius,
        y: centerY + Math.sin(childAngle) * childRadius,
        category: preset.category,
        variant: preset.variant,
        name: siteName,
        region: preset.category === "mountains" ? "High Country" : preset.category === "woods" ? "Wild Verge" : "Low Country",
        radius: clusterRadius * (0.9 + random() * 0.45),
        jitter: 70 + random() * 85,
      });
    }
  }
  return sites;
}

function buildWorldLayout(seed) {
  const random = mulberry32(hashString(`${seed}:world-layout`));
  return {
    roads: buildRoadLayout(random),
    rivers: [
      ...buildRiver(random, "vertical", "Aster Run"),
      ...buildRiver(random, "horizontal", "Reedwater"),
    ],
    biomeSites: buildBiomeSites(random),
  };
}

function buildDungeonSite(seed) {
  const random = mulberry32(hashString(`${seed}:dungeon-site`));
  const offsets = [];
  for (let ring = 2; ring <= 5; ring += 1) {
    for (let cy = -ring; cy <= ring; cy += 1) {
      for (let cx = -ring; cx <= ring; cx += 1) {
        if (Math.max(Math.abs(cx), Math.abs(cy)) !== ring) continue;
        offsets.push([cx, cy]);
      }
    }
  }
  offsets.sort(() => random() - 0.5);
  for (const [cx, cy] of offsets) {
    const area = getAreaProfile(cx, cy);
    if (area.id !== "woods" && area.id !== "mountains") continue;
    const chunk = generateChunk(cx, cy);
    const point = findClearPointInChunk(random, chunk, null, { waterBuffer: 1, structureMargin: TILE * 1.4, avoidPens: true });
    return {
      id: "dungeon-site",
      name: randomChoice(random, dungeonSiteNames),
      cx,
      cy,
      x: point.x,
      y: point.y,
    };
  }
  const fallbackChunk = generateChunk(3, -2);
  const fallbackPoint = findClearPointInChunk(random, fallbackChunk, null, { waterBuffer: 1, structureMargin: TILE * 1.4, avoidPens: true });
  return {
    id: "dungeon-site",
    name: "Sunken Barrow",
    cx: 3,
    cy: -2,
    x: fallbackPoint.x,
    y: fallbackPoint.y,
  };
}

function carveDungeonRect(tiles, x, y, w, h, value = "floor") {
  for (let ty = y; ty < y + h; ty += 1) {
    for (let tx = x; tx < x + w; tx += 1) {
      if (tiles[ty] && tiles[ty][tx] !== undefined) tiles[ty][tx] = value;
    }
  }
}

function carveDungeonHall(tiles, x1, y1, x2, y2) {
  let x = x1;
  let y = y1;
  tiles[y][x] = "floor";
  while (x !== x2) {
    x += x2 > x ? 1 : -1;
    tiles[y][x] = "floor";
  }
  while (y !== y2) {
    y += y2 > y ? 1 : -1;
    tiles[y][x] = "floor";
  }
}

function makeDungeonHostile(seed, tx, ty) {
  const random = mulberry32(hashString(`${seed}:dungeon:enemy`));
  const profile = randomChoice(random, dungeonEnemyProfiles);
  const x = tx * TILE + TILE / 2;
  const y = ty * TILE + TILE / 2;
  return {
    id: "dungeon:enemy:0",
    kind: profile.kind,
    name: profile.kind,
    x,
    y,
    fromX: x,
    fromY: y,
    targetX: x,
    targetY: y,
    anchorX: x,
    anchorY: y,
    moveProgress: 0,
    moving: false,
    facing: randomChoice(random, ["up", "down", "left", "right"]),
    wander: false,
    wait: 99,
    hp: profile.hp,
    maxHp: profile.hp,
    ac: profile.ac,
    attackBonus: profile.attack,
    damage: profile.damage,
    xpReward: profile.xp,
    intent: profile.intent,
    speech: "",
    speechTimer: 0,
    inCombat: false,
  };
}

function buildDungeonState(seed) {
  const random = mulberry32(hashString(`${seed}:dungeon-layout`));
  const size = { w: 18, h: 16 };
  const tiles = Array.from({ length: size.h }, () => Array.from({ length: size.w }, () => "wall"));
  carveDungeonRect(tiles, 7, 11, 4, 3);
  carveDungeonRect(tiles, 6, 7, 6, 3);
  carveDungeonRect(tiles, 3, 2, 12, 4);
  carveDungeonRect(tiles, 12, 6, 3, 3);
  carveDungeonHall(tiles, 9, 12, 9, 8);
  carveDungeonHall(tiles, 9, 8, 9, 4);
  carveDungeonHall(tiles, 9, 8, 13, 7);
  carveDungeonRect(tiles, 4, 3, 2, 2, "rubble");
  carveDungeonRect(tiles, 12, 3, 2, 2, "rubble");
  const enemy = makeDungeonHostile(seed, 9, 4);
  const chestLoot = [
    createItem("healing_potion"),
    createItem(random() > 0.5 ? "iron_mace" : "guard_lantern"),
    createItem(random() > 0.62 ? "chain_shirt" : "traveler_cloak"),
  ].filter(Boolean);
  return {
    name: dungeonSite?.name || randomChoice(random, dungeonSiteNames),
    size,
    tiles,
    entrance: { x: 9.5 * TILE, y: 12.5 * TILE },
    chest: {
      x: 13.5 * TILE,
      y: 7.5 * TILE,
      opened: false,
      gold: 14 + Math.floor(random() * 12),
      loot: chestLoot,
    },
    hostiles: [enemy],
    braziers: [
      { x: 6.5 * TILE, y: 8.5 * TILE },
      { x: 12.5 * TILE, y: 8.5 * TILE },
    ],
  };
}

function biomeBlendAtWorld(x, y) {
  if (!worldLayout) {
    return {
      primary: { category: "fields", variant: "meadow", name: "Outskirts", region: "Low Country" },
      secondary: { category: "fields", variant: "meadow", name: "Outskirts", region: "Low Country" },
      blend: 0,
      gap: Infinity,
    };
  }
  const warpX = x + (fractalNoise(x * 0.00055, y * 0.00055, `${worldSeed}:warp-x`) - 0.5) * 560;
  const warpY = y + (fractalNoise(x * 0.00055 + 31, y * 0.00055 - 17, `${worldSeed}:warp-y`) - 0.5) * 560;
  let best = { site: worldLayout.biomeSites[0], score: Infinity };
  let second = { site: worldLayout.biomeSites[0], score: Infinity };
  for (const site of worldLayout.biomeSites) {
    const dist = Math.hypot(warpX - site.x, warpY - site.y);
    const scale = Math.max(520, site.radius || 1600);
    const nextScore = (dist / scale) * 1000
      + fractalNoise((warpX + site.x) * 0.00037, (warpY + site.y) * 0.00037, `${worldSeed}:biome-jitter:${site.name}:${Math.round(site.x)}:${Math.round(site.y)}`) * (site.jitter || 110);
    if (nextScore < best.score) {
      second = best;
      best = { site, score: nextScore };
    } else if (nextScore < second.score) {
      second = { site, score: nextScore };
    }
  }
  const gap = second.score - best.score;
  const edgeNoise = fractalNoise(warpX * 0.00072 + 11, warpY * 0.00072 - 23, `${worldSeed}:biome-edge`) - 0.5;
  return {
    primary: best.site,
    secondary: second.site || best.site,
    blend: clamp(1 - smoothStep(gap, 120, 620) + edgeNoise * 0.08, 0, 1),
    gap,
  };
}

function biomeAtWorld(x, y) {
  return biomeBlendAtWorld(x, y).primary;
}

function assignBuildingDoor(building) {
  const tx = Math.round(building.x / TILE);
  const ty = Math.round(building.y / TILE);
  const wTiles = Math.round(building.w / TILE);
  const hTiles = Math.round(building.h / TILE);
  const midX = tx + Math.floor(wTiles / 2);
  const midY = ty + Math.floor(hTiles / 2);
  if (building.doorSide === "north") {
    building.entryTx = midX;
    building.entryTy = ty - 1;
  } else if (building.doorSide === "south") {
    building.entryTx = midX;
    building.entryTy = ty + hTiles;
  } else if (building.doorSide === "west") {
    building.entryTx = tx - 1;
    building.entryTy = midY;
  } else {
    building.entryTx = tx + wTiles;
    building.entryTy = midY;
  }
  const entry = tileCenter(building.entryTx, building.entryTy);
  building.entryX = entry.x;
  building.entryY = entry.y;
}

function stampEntryPath(surfaceTiles, building, target, terrain = "path") {
  let tx = building.entryTx;
  let ty = building.entryTy;
  setSurfaceTile(surfaceTiles, tx, ty, terrain);
  if (building.doorSide === "west" || building.doorSide === "east") {
    while (tx !== target.x) {
      tx += target.x > tx ? 1 : -1;
      setSurfaceTile(surfaceTiles, tx, ty, terrain);
    }
    while (ty !== target.y) {
      ty += target.y > ty ? 1 : -1;
      setSurfaceTile(surfaceTiles, tx, ty, terrain);
    }
  } else {
    while (ty !== target.y) {
      ty += target.y > ty ? 1 : -1;
      setSurfaceTile(surfaceTiles, tx, ty, terrain);
    }
    while (tx !== target.x) {
      tx += target.x > tx ? 1 : -1;
      setSurfaceTile(surfaceTiles, tx, ty, terrain);
    }
  }
}

function valueNoise2D(x, y, seed) {
  return hashString(`${seed}:${x}:${y}`) / 4294967295;
}

function smoothNoise(x, y, seed) {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const tx = x - x0;
  const ty = y - y0;
  const a = valueNoise2D(x0, y0, seed);
  const b = valueNoise2D(x0 + 1, y0, seed);
  const c = valueNoise2D(x0, y0 + 1, seed);
  const d = valueNoise2D(x0 + 1, y0 + 1, seed);
  const sx = tx * tx * (3 - 2 * tx);
  const sy = ty * ty * (3 - 2 * ty);
  const top = a + (b - a) * sx;
  const bottom = c + (d - c) * sx;
  return top + (bottom - top) * sy;
}

function fractalNoise(x, y, seed) {
  let amplitude = 1;
  let frequency = 1;
  let total = 0;
  let weight = 0;
  for (let octave = 0; octave < 3; octave += 1) {
    total += smoothNoise(x * frequency, y * frequency, `${seed}:${octave}`) * amplitude;
    weight += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }
  return total / weight;
}

function randomColor(random, options) {
  return options[Math.floor(random() * options.length)];
}

function makeAppearance(random, ancestry, gender, role) {
  const ancestryBase = ancestryVisuals[ancestry] || ancestryVisuals.Human;
  const rolePalette = {
    Tavernkeep: ["#7f4d3f", "#9a6a43", "#5f3943"],
    Smith: ["#515660", "#6d5d4e", "#39404a"],
    Guard: ["#51657c", "#3f566f", "#6b735c"],
    "Watch Captain": ["#556a7d", "#4f5d76", "#5e5d45"],
    Baker: ["#9a7c52", "#8b5b43", "#6b4d39"],
    Priest: ["#6e5b7f", "#4e6a63", "#7b6c4f"],
    Herbalist: ["#4f7655", "#6d8b52", "#51715f"],
    Scout: ["#5a6c44", "#56736e", "#6c5a46"],
    Hunter: ["#566b44", "#6b5e43", "#5e6d4a"],
    Merchant: ["#5f5b7f", "#7b5b62", "#4e6680"],
  }[role] || ["#6f4e72", "#4d7f71", "#7a5d3d", "#526da1", "#8f7046"];
  const hairOptions = [ancestryBase.hair, "#312621", "#65453b", "#d2c7ab", "#3e3a4e"];
  const skinOptions = [ancestryBase.skin, ancestryBase.skin, ancestryBase.skin];
  const hairStylePool = gender === "Woman"
    ? ["long", "part", "bun", "braid", "crop"]
    : gender === "Man"
      ? ["crop", "part", "swept", "close", "bun"]
      : ["crop", "part", "braid", "bun", "swept"];
  const headwear = role === "Smith" || role === "Farmer" || role === "Miller"
    ? (random() > 0.58 ? "cap" : "none")
    : role === "Scout" || role === "Hunter"
      ? (random() > 0.68 ? "hood" : "none")
      : "none";
  const facialHairRoll = random();
  let facialHair = "none";
  if (gender === "Man") {
    if (facialHairRoll > 0.82) facialHair = "beard";
    else if (facialHairRoll > 0.68) facialHair = "mustache";
    else if (facialHairRoll > 0.58) facialHair = "goatee";
  } else if (gender === "Nonbinary" && facialHairRoll > 0.92) {
    facialHair = "goatee";
  }
  return {
    coat: randomColor(random, rolePalette),
    trim: randomColor(random, [ancestryBase.accent, "#d9caa1", "#c3d5a3", "#d3b074"]),
    hair: randomColor(random, hairOptions),
    skin: randomColor(random, skinOptions),
    eyes: randomColor(random, ["#34291f", "#3c2f26", "#44535e", "#5f4c31", "#43503e"]),
    prop: professionProps[role] || null,
    cloak: random() > 0.72,
    badge: gender === "Nonbinary" ? "#d6c36f" : gender === "Woman" ? "#d08b96" : "#7ea2c8",
    hairStyle: randomChoice(random, hairStylePool),
    headwear,
    facialHair,
    faceWidth: 0.94 + random() * 0.14,
    shoulder: 0.9 + random() * 0.18,
    coatFlare: 0.92 + random() * 0.16,
    jaw: 0.92 + random() * 0.14,
    freckles: random() > 0.84,
    weathered: random() > 0.78,
  };
}

function buildTradeInventory(role, random) {
  const stock = {
    Tavernkeep: [
      { name: "Hot Meal", price: 3, text: "Recover 2 HP and steady yourself." },
      { name: "Room for the Night", price: 6, text: "Recover fully and reset second wind." },
      { name: "Healing Potion", price: 8, text: "A stoppered red draft.", itemId: "healing_potion" },
    ],
    Innkeeper: [
      { name: "Hot Meal", price: 3, text: "Recover 2 HP and steady yourself." },
      { name: "Room for the Night", price: 6, text: "Recover fully and reset second wind." },
    ],
    Baker: [
      { name: "Travel Bread", price: 2, text: "A simple meal for the road." },
      { name: "Sweet Roll", price: 1, text: "A small comfort that lifts morale." },
    ],
    Smith: [
      { name: "Whetstone", price: 5, text: "Gain +1 damage on your next strike." },
      { name: "Wooden Shield", price: 8, text: "A sturdy village shield.", itemId: "wooden_shield" },
    ],
    Herbalist: [
      { name: "Minor Potion", price: 8, text: "Restore 6 HP.", itemId: "healing_potion" },
      { name: "Calming Draught", price: 6, text: "Gain +2 on your next Wisdom check." },
    ],
    Merchant: [
      { name: "Torch Bundle", price: 3, text: "Useful for later delves." },
      { name: "Traveler's Cloak", price: 6, text: "Weathered wool and a good clasp.", itemId: "traveler_cloak" },
    ],
  }[role];
  if (stock) return stock.map((item) => ({ ...item }));
  if (random() > 0.55) {
    return [{ name: "Field Kit", price: 4, text: "A practical bundle of odds and ends." }];
  }
  return [];
}

function localName(random, index) {
  return `${randomChoice(random, ["North", "West", "South", "High", "Bell", "River"])} ${["Cottage", "House", "Hold", "Lodge"][index % 4]}`;
}

function createVillageResident(random, building, role, slotIndex, homeName) {
  const ancestry = weightedChoice(random, ancestryWeights.village);
  const gender = weightedChoice(random, genderWeights.village);
  const personality = weightedChoice(random, mbtiWeights);
  const name = role === "Tavernkeep" ? "Mara Hearth" : `${randomChoice(random, firstNames)} ${randomChoice(random, surnames)}`;
  const anchorX = (building.entryX || (building.x + TILE / 2)) + ((slotIndex % 2) - 0.5) * TILE;
  const anchorY = (building.entryY || (building.y + building.h + TILE / 2)) + (Math.floor(slotIndex / 2) - 0.5) * TILE;
  return {
    id: `${building.id}:resident:${slotIndex}:${role.toLowerCase().replace(/[^a-z]/g, "")}`,
    name,
    role,
    mood: randomChoice(random, moods),
    ancestry,
    gender,
    personality,
    areaId: "village",
    dc: 10 + Math.floor(random() * 6),
    hook: randomChoice(random, hooks),
    secret: randomChoice(random, secrets),
    hasFullDialogue: role !== "Farmer" && role !== "Goatherd" && role !== "Shepherd" ? true : random() < 0.32,
    x: snapToTileCenter(anchorX),
    y: snapToTileCenter(anchorY),
    fromX: snapToTileCenter(anchorX),
    fromY: snapToTileCenter(anchorY),
    targetX: snapToTileCenter(anchorX),
    targetY: snapToTileCenter(anchorY),
    anchorX: snapToTileCenter(anchorX),
    anchorY: snapToTileCenter(anchorY),
    moveProgress: 0,
    moving: false,
    facing: randomChoice(random, ["up", "down", "left", "right"]),
    wander: random() < 0.26,
    wait: 0.8 + random() * 3.2,
    talked: false,
    helped: false,
    revealed: false,
    interacted: false,
    lineIndex: 0,
    speech: "",
    speechTimer: 0,
    trust: 0,
    homeName,
    workName: building.kind,
    district: building.district,
    serviceTags: roleServices[role] || [],
    goods: buildTradeInventory(role, random),
    appearance: makeAppearance(random, ancestry, gender, role),
  };
}

function createHouseholdRole(random, building) {
  const defaults = {
    Cottage: ["Farmer", "Farmer", "Child", "Child"],
    Farmhouse: ["Farmer", "Goatherd", "Child", "Child", "Grandparent"],
    Longhouse: ["Guard", "Guard", "Stablehand", "Child", "Child"],
    Tavern: ["Brewer", "Server", "Cook"],
    Stable: ["Stablehand", "Teamster", "Child"],
    Mill: ["Miller", "Miller", "Child"],
  }[building.kind] || ["Farmer", "Child", "Child"];
  const pick = defaults[Math.floor(random() * defaults.length)];
  if (pick === "Child" || pick === "Grandparent" || pick === "Server" || pick === "Cook") return "Laborer";
  return pick;
}

function buildVillageModel(seed) {
  const random = mulberry32(hashString(`${seed}:village:model`));
  const buildings = [];
  const residents = [];
  const pens = [];
  const animals = [];
  const services = new Set();
  const surfaceTiles = new Map();
  let homeCount = 0;
  let population = 0;

  const roadBands = [
    { orientation: "vertical", along: 0, start: -44, end: 38, width: 3 },
    { orientation: "horizontal", along: 0, start: -38, end: 38, width: 3 },
    { orientation: "horizontal", along: -14, start: -28, end: 20, width: 2 },
    { orientation: "horizontal", along: -28, start: -14, end: 34, width: 2 },
    { orientation: "horizontal", along: 15, start: -18, end: 32, width: 2 },
    { orientation: "horizontal", along: 26, start: -42, end: -10, width: 2 },
    { orientation: "vertical", along: -24, start: -30, end: 18, width: 2 },
    { orientation: "vertical", along: 24, start: -28, end: 22, width: 2 },
    { orientation: "vertical", along: -34, start: 0, end: 18, width: 2 },
  ];
  for (const road of roadBands) {
    stampSurfaceBand(surfaceTiles, road.orientation, road.along, road.start, road.end, road.width, "path");
  }
  stampSurfaceRect(surfaceTiles, -4, -4, 9, 9, "plaza");
  stampSurfaceRect(surfaceTiles, -2, -18, 5, 4, "yard");
  stampSurfaceRect(surfaceTiles, 20, -30, 11, 9, "orchard");
  stampSurfaceRect(surfaceTiles, -40, 23, 18, 10, "field");

  const villagePlans = [
    { id: "tavern", kind: "Tavern", label: "Hearth & Harrow", x: 6, y: -18, w: 5, h: 3, workforce: ["Tavernkeep", "Brewer"], occupants: 5, district: "Market Cross", doorSide: "south", pathTo: { x: 8, y: -14 }, plot: { x: 4, y: -19, w: 10, h: 5, terrain: "yard" }, residential: true, visible: 0 },
    { id: "forge", kind: "Forge", label: "Forge", x: 18, y: -17, w: 4, h: 4, workforce: ["Smith"], occupants: 2, district: "North Row", doorSide: "south", pathTo: { x: 20, y: -14 }, residential: false, plot: { x: 17, y: -18, w: 6, h: 6, terrain: "yard" } },
    { id: "watchhouse", kind: "Longhouse", label: "Watchhouse", x: 27, y: -6, w: 4, h: 3, workforce: ["Watch Captain", "Guard"], occupants: 3, district: "East Spur", doorSide: "west", pathTo: { x: 24, y: -5 }, residential: false, visible: 1, plot: { x: 26, y: -8, w: 6, h: 6, terrain: "yard" } },
    { id: "shrine", kind: "Shrine", label: "Shrine", x: -33, y: -22, w: 3, h: 4, workforce: ["Priest"], occupants: 1, district: "Bell Walk", doorSide: "east", pathTo: { x: -24, y: -20 }, plot: { x: -38, y: -24, w: 7, h: 7, terrain: "grave" }, residential: false },
    { id: "healerHouse", kind: "Cottage", label: "Healer's Cottage", x: -8, y: -32, w: 3, h: 3, workforce: ["Herbalist"], occupants: 2, district: "North Verge", doorSide: "south", pathTo: { x: -6, y: -28 }, plot: { x: -12, y: -33, w: 6, h: 6, terrain: "garden" }, residential: true },
    { id: "northCottage", kind: "Cottage", label: "North Cottage", x: 5, y: -32, w: 3, h: 3, workforce: ["Laborer"], occupants: 2, district: "North Verge", doorSide: "south", pathTo: { x: 6, y: -28 }, plot: { x: 2, y: -33, w: 6, h: 6, terrain: "yard" }, residential: true },
    { id: "orchardHouse", kind: "Farmhouse", label: "Orchard House", x: 17, y: -32, w: 4, h: 3, workforce: ["Farmer", "Laborer"], occupants: 4, district: "Orchard Lane", doorSide: "south", pathTo: { x: 19, y: -28 }, plot: { x: 21, y: -33, w: 12, h: 10, terrain: "orchard" }, residential: true },
    { id: "bellCottage", kind: "Cottage", label: "Bell Cottage", x: -31, y: -31, w: 3, h: 3, workforce: ["Peddler"], occupants: 2, district: "Bell Walk", doorSide: "east", pathTo: { x: -24, y: -29 }, plot: { x: -35, y: -32, w: 6, h: 5, terrain: "yard" }, residential: true },
    { id: "carpenterHouse", kind: "Cottage", label: "Lantern House", x: -31, y: -7, w: 3, h: 3, workforce: ["Carpenter"], occupants: 3, district: "Bell Walk", doorSide: "east", pathTo: { x: -24, y: -5 }, plot: { x: -35, y: -8, w: 6, h: 5, terrain: "yard" }, residential: true },
    { id: "mill", kind: "Mill", label: "Mill", x: -39, y: 5, w: 4, h: 4, workforce: ["Miller"], occupants: 3, district: "Mill Spur", doorSide: "east", pathTo: { x: -34, y: 7 }, plot: { x: -40, y: 4, w: 7, h: 7, terrain: "yard" }, residential: true, visible: 1 },
    { id: "bakery", kind: "Bakery", label: "Bakery", x: -14, y: 17, w: 4, h: 3, workforce: ["Baker"], occupants: 2, district: "South Row", doorSide: "north", pathTo: { x: -12, y: 15 }, residential: false, visible: 1 },
    { id: "store", kind: "Store", label: "Store", x: 4, y: 17, w: 4, h: 3, workforce: ["Merchant"], occupants: 2, district: "South Row", doorSide: "north", pathTo: { x: 6, y: 15 }, residential: false, visible: 1 },
    { id: "stable", kind: "Stable", label: "Stable", x: 21, y: 18, w: 5, h: 3, workforce: ["Stablehand", "Teamster"], occupants: 3, district: "South Row", doorSide: "north", pathTo: { x: 23, y: 15 }, pen: { x: 28, y: 18, w: 6, h: 4 }, residential: true, visible: 1 },
    { id: "westFarm", kind: "Farmhouse", label: "West Fold Farm", x: -39, y: 23, w: 4, h: 3, workforce: ["Farmer", "Goatherd"], occupants: 5, district: "West Fold", doorSide: "north", pathTo: { x: -37, y: 26 }, pen: { x: -31, y: 23, w: 5, h: 4 }, plot: { x: -42, y: 27, w: 16, h: 8, terrain: "field" }, residential: true },
    { id: "riverFarm", kind: "Farmhouse", label: "Reedbank Farm", x: -21, y: 23, w: 4, h: 3, workforce: ["Farmer"], occupants: 4, district: "West Fold", doorSide: "north", pathTo: { x: -19, y: 26 }, pen: { x: -25, y: 23, w: 4, h: 4 }, plot: { x: -22, y: 27, w: 10, h: 8, terrain: "field" }, residential: true },
    { id: "southCottage", kind: "Cottage", label: "South Cottage", x: 11, y: 20, w: 3, h: 3, workforce: ["Shepherd"], occupants: 2, district: "South Row", doorSide: "north", pathTo: { x: 12, y: 15 }, plot: { x: 9, y: 19, w: 5, h: 5, terrain: "yard" }, residential: true },
    { id: "eastFarm", kind: "Farmhouse", label: "East Spur Farm", x: 28, y: -23, w: 4, h: 3, workforce: ["Farmer", "Stablehand"], occupants: 4, district: "East Spur", doorSide: "west", pathTo: { x: 24, y: -22 }, pen: { x: 33, y: -23, w: 4, h: 4 }, plot: { x: 31, y: -26, w: 10, h: 8, terrain: "field" }, residential: true },
  ];

  function addVillageBuilding(template, index) {
    const palette = randomChoice(random, buildingPalettes);
    const building = {
      id: template.id,
      x: template.x * TILE,
      y: template.y * TILE,
      w: template.w * TILE,
      h: template.h * TILE,
      kind: template.kind,
      label: template.label || (template.kind === "Cottage" ? localName(random, index) : template.kind),
      palette,
      district: template.district,
      doorSide: template.doorSide,
      workforce: template.workforce.slice(),
      occupants: template.occupants,
    };
    assignBuildingDoor(building);
    if (template.plot) {
      stampSurfaceRect(surfaceTiles, template.plot.x, template.plot.y, template.plot.w, template.plot.h, template.plot.terrain);
    } else if (template.kind === "Cottage" || template.kind === "Farmhouse") {
      stampSurfaceRect(
        surfaceTiles,
        Math.round(building.x / TILE) - 1,
        Math.round(building.y / TILE) - 1,
        Math.round(building.w / TILE) + 2,
        Math.round(building.h / TILE) + 2,
        template.kind === "Farmhouse" ? "yard" : random() > 0.5 ? "yard" : "garden",
      );
    }
    stampEntryPath(surfaceTiles, building, template.pathTo);
    buildings.push(building);
    if (template.residential) homeCount += 1;
    population += template.occupants;
    for (const role of template.workforce) {
      for (const tag of roleServices[role] || []) services.add(tag);
    }

    const visibleCount = template.visible ?? (
      template.id === "tavern"
        ? 0
        : template.residential
          ? 1
          : Math.min(2, Math.max(1, template.workforce.length))
    );
    for (let slot = 0; slot < visibleCount; slot += 1) {
      const fallbackRole = template.residential ? createHouseholdRole(random, building) : template.workforce[template.workforce.length - 1];
      const role = template.workforce[slot] || fallbackRole;
      const resident = createVillageResident(random, building, role, slot, building.label);
      residents.push(resident);
      for (const tag of resident.serviceTags) services.add(tag);
    }

    if (template.pen) {
      const pen = {
        x: template.pen.x * TILE,
        y: template.pen.y * TILE,
        w: template.pen.w * TILE,
        h: template.pen.h * TILE,
      };
      pens.push(pen);
      stampSurfaceRect(surfaceTiles, template.pen.x, template.pen.y, template.pen.w, template.pen.h, "yard");
      const pennedCount = template.kind === "Stable" ? 2 + Math.floor(random() * 2) : 1 + Math.floor(random() * 2);
      for (let i = 0; i < pennedCount; i += 1) {
        animals.push(makePennedAnimal(random, pen, i));
      }
    }
  }

  villagePlans.forEach((template, index) => addVillageBuilding(template, index));
  let minTx = Infinity;
  let minTy = Infinity;
  let maxTx = -Infinity;
  let maxTy = -Infinity;
  for (const key of surfaceTiles.keys()) {
    const [tx, ty] = key.split(",").map(Number);
    minTx = Math.min(minTx, tx);
    minTy = Math.min(minTy, ty);
    maxTx = Math.max(maxTx, tx);
    maxTy = Math.max(maxTy, ty);
  }

  const prosperity = 5 + Math.floor(random() * 4);
  const mood = prosperity >= 8 ? "Thriving" : prosperity >= 6 ? "Stable" : "Strained";
  const worksiteCount = buildings.filter((building) => (
    building.kind !== "Cottage"
    || building.workforce.some((role) => role !== "Laborer")
  )).length;
  return {
    name: "Waymark Vale",
    mood,
    prosperity,
    buildings,
    residents,
    pens,
    animals,
    surfaceTiles,
    surfaceBounds: {
      left: minTx * TILE,
      top: minTy * TILE,
      right: (maxTx + 1) * TILE,
      bottom: (maxTy + 1) * TILE,
    },
    services: Array.from(services).sort(),
    population,
    homeCount,
    worksiteCount,
  };
}

function structureIntersectsChunk(structure, cx, cy) {
  const left = cx * CHUNK_SIZE;
  const top = cy * CHUNK_SIZE;
  return structure.x < left + CHUNK_SIZE
    && structure.x + structure.w > left
    && structure.y < top + CHUNK_SIZE
    && structure.y + structure.h > top;
}

function villageTerrainOverride(wx, wy) {
  if (!worldModel?.surfaceTiles) return null;
  return worldModel.surfaceTiles.get(tileKeyFromWorld(wx, wy)) || null;
}

function terrainFromBiome(biome, context) {
  const { elevation, moisture, heat, detail, patch, vein, randomValue } = context;
  const lush = moisture > 0.56;
  const dry = moisture < 0.38;
  if (biome.category === "mountains") {
    if (elevation > 0.74 || patch > 0.8) return "stone";
    if (elevation > 0.64 || vein > 0.68) return randomValue > 0.52 ? "scree" : "stone";
    if (biome.variant === "highland" && lush && patch > 0.54) return "pine";
    if (patch > 0.61) return "dirt";
    return lush ? "meadow" : "grass2";
  }

  if (biome.category === "woods") {
    if (biome.variant === "pinewood" && patch > 0.56) return "pine";
    if (patch > 0.48) return "tree";
    if (lush && vein > 0.72) return "marsh";
    if (randomValue > 0.82) return "flower";
    return lush ? "meadow" : "grass2";
  }

  if (biome.category === "river") {
    if (moisture > 0.68 && patch > 0.5) return "marsh";
    if (dry && heat > 0.58 && vein > 0.44) return "sand";
    if (patch > 0.66) return "shallow";
    return lush ? "meadow" : "grass2";
  }

  if (biome.variant === "orchard") {
    if (patch > 0.68) return "orchard";
    if (vein > 0.62) return "field";
    return lush ? "meadow" : "grass";
  }
  if (biome.variant === "heath") {
    if (vein > 0.74) return "scree";
    if (patch > 0.58) return "dirt";
    return randomValue > 0.45 ? "meadow" : "grass2";
  }
  if (moisture > 0.7 && patch > 0.66) return "marsh";
  if (patch > 0.74) return dry && heat > 0.6 ? "sand" : "field";
  return randomValue > 0.52 ? "grass2" : randomValue > 0.28 ? "meadow" : "grass";
}

function blendTerrainWithinCategory(primary, secondary, context, blend) {
  const { elevation, moisture, heat, detail, patch, vein, randomValue, blendNoise } = context;
  if (primary.category === "fields") {
    if ((primary.variant === "orchard" || secondary.variant === "orchard") && patch > 0.6 && blendNoise < 0.48 + blend * 0.28) return "orchard";
    if ((primary.variant === "heath" || secondary.variant === "heath") && (vein > 0.64 || blendNoise > 0.72)) return patch > 0.74 ? "scree" : "dirt";
    if (patch > 0.68) return heat > 0.6 && moisture < 0.42 ? "sand" : "field";
    if (randomValue > 0.78) return "flower";
    return moisture > 0.54 ? "meadow" : "grass2";
  }
  if (primary.category === "woods") {
    if ((primary.variant === "pinewood" || secondary.variant === "pinewood") && patch > 0.5 && blendNoise < 0.55 + blend * 0.18) return "pine";
    if (patch > 0.46) return "tree";
    return moisture > 0.5 ? "meadow" : "grass2";
  }
  if (primary.category === "mountains") {
    if ((primary.variant === "crags" || secondary.variant === "crags") && (elevation > 0.56 || patch > 0.68)) return "stone";
    if (vein > 0.64) return "scree";
    if (patch > 0.54) return "dirt";
    if (moisture > 0.52 && blendNoise < 0.54) return "pine";
    return "meadow";
  }
  if (moisture > 0.58 || patch > 0.72) return heat > 0.58 && moisture < 0.4 ? "sand" : "marsh";
  if (patch > 0.78 && blend > 0.7 && blendNoise < 0.46) return "shallow";
  return randomValue > 0.48 ? "meadow" : "grass2";
}

function transitionTerrainForBiomes(primary, secondary, context, blend) {
  const { elevation, moisture, heat, detail, patch, vein, randomValue, blendNoise } = context;
  const categories = [primary.category, secondary.category].sort().join(":");
  if (categories === "fields:woods") {
    if (patch > 0.64 && blendNoise < 0.34 + blend * 0.34) return primary.variant === "pinewood" || secondary.variant === "pinewood" ? "pine" : "tree";
    if (randomValue > 0.8) return "flower";
    return moisture > 0.5 ? "meadow" : "grass2";
  }
  if (categories === "fields:mountains") {
    if (elevation > 0.62 && blendNoise < 0.32 + blend * 0.28) return patch > 0.72 ? "stone" : "scree";
    if (vein > 0.54) return "dirt";
    return moisture > 0.48 ? "meadow" : "grass2";
  }
  if (categories === "fields:river") {
    if (moisture > 0.54 || blendNoise < 0.32 + blend * 0.3) return heat > 0.6 && moisture < 0.42 ? "sand" : "marsh";
    if (patch > 0.64) return "field";
    return randomValue > 0.44 ? "meadow" : "grass2";
  }
  if (categories === "mountains:woods") {
    if (elevation > 0.58 && blendNoise < 0.3 + blend * 0.24) return patch > 0.7 ? "stone" : "scree";
    if (patch > 0.58) return primary.variant === "pinewood" || secondary.variant === "pinewood" ? "pine" : "tree";
    return moisture > 0.5 ? "meadow" : "dirt";
  }
  if (categories === "river:woods") {
    if (moisture > 0.53) return "marsh";
    if (patch > 0.58 && blendNoise < 0.36 + blend * 0.32) return primary.variant === "pinewood" || secondary.variant === "pinewood" ? "pine" : "tree";
    return "meadow";
  }
  if (moisture > 0.55) return heat > 0.58 && moisture < 0.42 ? "sand" : "marsh";
  if (elevation > 0.56 || patch > 0.72) return "stone";
  return vein > 0.52 ? "dirt" : "meadow";
}

function baseTerrain(wx, wy, randomValue, areaId) {
  const terrainSeed = `${worldSeed}:terrain`;
  const elevation = fractalNoise(wx * 0.0016, wy * 0.0016, `${terrainSeed}:elevation`);
  const moisture = fractalNoise(wx * 0.0014 + 17, wy * 0.0014 - 21, `${terrainSeed}:moisture`);
  const detail = fractalNoise(wx * 0.0032 - 9, wy * 0.0032 + 13, `${terrainSeed}:detail`);
  const heat = fractalNoise(wx * 0.0011 - 71, wy * 0.0011 + 43, `${terrainSeed}:heat`);
  const villageOverride = villageTerrainOverride(wx, wy);
  const roadInfo = nearestRoadInfo(wx, wy);
  const riverInfo = nearestRiverInfo(wx, wy);

  if (villageOverride) return villageOverride;
  if (riverInfo.segment && riverInfo.distance < riverInfo.segment.width * 0.76) {
    if (roadInfo.segment && roadInfo.distance < TILE * 0.45) {
      return roadInfo.segment.orientation === "horizontal" ? "bridgeH" : "bridgeV";
    }
    return "water";
  }
  if (riverInfo.segment && riverInfo.distance < riverInfo.segment.width * 1.1) {
    return "shallow";
  }
  if (riverInfo.segment && riverInfo.distance < riverInfo.segment.width * 1.85) {
    if (heat > 0.58 && moisture < 0.42 && detail > 0.46) return "sand";
    return moisture > 0.45 || detail > 0.48 ? "marsh" : randomValue > 0.5 ? "meadow" : "grass2";
  }
  if (roadInfo.segment && roadInfo.distance < TILE * 0.42) return "path";
  if (roadInfo.segment && roadInfo.distance < TILE * 0.72) return detail > 0.55 ? "dirt" : "meadow";

  const biomeBlend = biomeBlendAtWorld(wx, wy);
  const context = {
    elevation,
    moisture,
    heat,
    detail,
    randomValue,
    patch: fractalNoise(wx * 0.0022 + 19, wy * 0.0022 - 7, `${terrainSeed}:patch`),
    vein: fractalNoise(wx * 0.0041 - 13, wy * 0.0041 + 29, `${terrainSeed}:vein`),
    blendNoise: fractalNoise(wx * 0.0019 + 37, wy * 0.0019 - 41, `${terrainSeed}:blend`),
  };
  if (biomeBlend.blend < 0.2 || !biomeBlend.secondary) {
    return terrainFromBiome(biomeBlend.primary, context);
  }
  if (biomeBlend.primary.category === biomeBlend.secondary.category) {
    return blendTerrainWithinCategory(biomeBlend.primary, biomeBlend.secondary, context, biomeBlend.blend);
  }
  return transitionTerrainForBiomes(biomeBlend.primary, biomeBlend.secondary, context, biomeBlend.blend);
}

function makeStructure(random, cx, cy, index, attempt = 0) {
  const palette = randomChoice(random, buildingPalettes);
  const w = (random() > 0.72 ? 4 : 3) * TILE;
  const h = (random() > 0.68 ? 4 : 3) * TILE;
  const chunkLeft = cx * CHUNK_SIZE;
  const chunkTop = cy * CHUNK_SIZE;
  const roadAnchor = nearestRoadInfo(chunkLeft + CHUNK_SIZE / 2, chunkTop + CHUNK_SIZE / 2);
  const orientation = roadAnchor.segment?.orientation || (random() > 0.5 ? "horizontal" : "vertical");
  let x = chunkLeft + TILE * 5;
  let y = chunkTop + TILE * 5;
  if (orientation === "vertical") {
    const roadX = roadAnchor.segment ? roadAnchor.point.x : chunkLeft + CHUNK_SIZE / 2;
    const side = (index + attempt) % 2 === 0 ? 1 : -1;
    x = roadX + side * (TILE * (3 + Math.floor(random() * 2)));
    y = chunkTop + TILE * (3 + ((index * 3 + attempt) % 15));
  } else {
    const roadY = roadAnchor.segment ? roadAnchor.point.y : chunkTop + CHUNK_SIZE / 2;
    const side = (index + attempt) % 2 === 0 ? 1 : -1;
    x = chunkLeft + TILE * (3 + ((index * 3 + attempt) % 15));
    y = roadY + side * (TILE * (3 + Math.floor(random() * 2)));
  }
  x += (random() - 0.5) * TILE;
  y += (random() - 0.5) * TILE;

  const typeRoll = random();
  let kind = "Cottage";
  if (typeRoll > 0.78) kind = "Barn";
  else if (typeRoll > 0.6) kind = "Store";
  else if (typeRoll < 0.16) kind = "Ruin";

  return {
    x: Math.round(x / TILE) * TILE,
    y: Math.round(y / TILE) * TILE,
    w,
    h,
    kind,
    palette,
    doorSide: orientation === "vertical" ? (x < (roadAnchor.point?.x || chunkLeft + CHUNK_SIZE / 2) ? "east" : "west") : (y < (roadAnchor.point?.y || chunkTop + CHUNK_SIZE / 2) ? "south" : "north"),
  };
}

function setTileAtWorld(tiles, cx, cy, tx, ty, terrain) {
  const localX = tx - cx * CHUNK_TILES;
  const localY = ty - cy * CHUNK_TILES;
  if (localX >= 0 && localX < CHUNK_TILES && localY >= 0 && localY < CHUNK_TILES) {
    tiles[localY][localX] = terrain;
  }
}

function stampChunkPath(tiles, cx, cy, startTx, startTy, endTx, endTy) {
  let tx = startTx;
  let ty = startTy;
  setTileAtWorld(tiles, cx, cy, tx, ty, "path");
  while (tx !== endTx) {
    tx += endTx > tx ? 1 : -1;
    setTileAtWorld(tiles, cx, cy, tx, ty, "path");
  }
  while (ty !== endTy) {
    ty += endTy > ty ? 1 : -1;
    setTileAtWorld(tiles, cx, cy, tx, ty, "path");
  }
}

function assignStructurePath(structure, tiles, cx, cy) {
  assignBuildingDoor(structure);
  const road = nearestRoadInfo(structure.entryX, structure.entryY);
  if (!road.segment) return;
  const targetTx = Math.floor(road.point.x / TILE);
  const targetTy = Math.floor(road.point.y / TILE);
  stampChunkPath(tiles, cx, cy, structure.entryTx, structure.entryTy, targetTx, targetTy);
}

function structureBounds(structure, margin = TILE * 1.15) {
  return {
    left: structure.x - margin,
    top: structure.y - margin,
    right: structure.x + structure.w + margin,
    bottom: structure.y + structure.h + margin,
  };
}

function boundsOverlap(a, b) {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

function tileAtWorld(tiles, cx, cy, x, y) {
  const tx = Math.floor((x - cx * CHUNK_SIZE) / TILE);
  const ty = Math.floor((y - cy * CHUNK_SIZE) / TILE);
  return tiles[ty]?.[tx] || "water";
}

function terrainIsWalkable(terrain) {
  return terrain !== "water" && terrain !== "shallow" && terrain !== "tree" && terrain !== "stone" && terrain !== "scree";
}

function hasWaterNear(tiles, cx, cy, x, y, radiusTiles) {
  for (let oy = -radiusTiles; oy <= radiusTiles; oy += 1) {
    for (let ox = -radiusTiles; ox <= radiusTiles; ox += 1) {
      if (tileAtWorld(tiles, cx, cy, x + ox * TILE, y + oy * TILE) === "water") return true;
    }
  }
  return false;
}

function pointInsidePenInterior(x, y, pens, margin = TILE * 0.2) {
  return (pens || []).some((pen) => (
    x > pen.x - margin
    && x < pen.x + pen.w + margin
    && y > pen.y - margin
    && y < pen.y + pen.h + margin
  ));
}

function structureTerrainIsClear(candidate, tiles, cx, cy) {
  const bounds = structureBounds(candidate, TILE * 3);
  for (let y = bounds.top; y <= bounds.bottom; y += TILE) {
    for (let x = bounds.left; x <= bounds.right; x += TILE) {
      if (tileAtWorld(tiles, cx, cy, x, y) === "water") return false;
    }
  }
  const footprint = structureBounds(candidate, TILE * 0.2);
  for (let y = footprint.top; y <= footprint.bottom; y += TILE) {
    for (let x = footprint.left; x <= footprint.right; x += TILE) {
      if (!terrainIsWalkable(tileAtWorld(tiles, cx, cy, x, y))) return false;
    }
  }
  return true;
}

function pointCollidesWithStructure(x, y, structures, margin = TILE * 0.7) {
  return structures.some((structure) => {
    const insideX = x > structure.x - margin && x < structure.x + structure.w + margin;
    const insideY = y > structure.y - margin && y < structure.y + structure.h + margin;
    return insideX && insideY;
  });
}

function pointIsClearInChunk(x, y, chunk, options = {}) {
  const terrain = tileAtWorld(chunk.tiles, chunk.cx, chunk.cy, x, y);
  if (!terrainIsWalkable(terrain)) return false;
  if (hasWaterNear(chunk.tiles, chunk.cx, chunk.cy, x, y, options.waterBuffer ?? 1)) return false;
  if (options.avoidPens && pointInsidePenInterior(x, y, chunk.pens || [])) return false;
  if (pointCollidesWithStructure(x, y, chunk.structures, options.structureMargin ?? TILE * 0.7)) return false;
  return true;
}

function findClearPointInChunk(random, chunk, preferred, options = {}) {
  if (preferred && pointIsClearInChunk(preferred.x, preferred.y, chunk, options)) return preferred;
  if (options.pen) {
    for (let attempt = 0; attempt < 40; attempt += 1) {
      const x = snapToTileCenter(options.pen.x + TILE * 0.8 + random() * Math.max(TILE, options.pen.w - TILE * 1.6));
      const y = snapToTileCenter(options.pen.y + TILE * 0.8 + random() * Math.max(TILE, options.pen.h - TILE * 1.6));
      if (pointIsClearInChunk(x, y, chunk, options)) return { x, y };
    }
  }
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const x = chunk.cx * CHUNK_SIZE + snapToTileCenter(TILE * 2 + random() * (CHUNK_SIZE - TILE * 4));
    const y = chunk.cy * CHUNK_SIZE + snapToTileCenter(TILE * 2 + random() * (CHUNK_SIZE - TILE * 4));
    if (pointIsClearInChunk(x, y, chunk, options)) return { x, y };
  }
  return {
    x: chunk.cx * CHUNK_SIZE + CHUNK_SIZE / 2,
    y: chunk.cy * CHUNK_SIZE + CHUNK_SIZE / 2,
  };
}

function findNearbyClearPointInChunk(random, chunk, preferred, radiusTiles = 3, options = {}) {
  if (!preferred) return findClearPointInChunk(random, chunk, preferred, options);
  const baseTx = Math.floor(preferred.x / TILE);
  const baseTy = Math.floor(preferred.y / TILE);
  const candidates = [];
  for (let dy = -radiusTiles; dy <= radiusTiles; dy += 1) {
    for (let dx = -radiusTiles; dx <= radiusTiles; dx += 1) {
      const distance = Math.abs(dx) + Math.abs(dy);
      if (distance > radiusTiles) continue;
      const tx = baseTx + dx;
      const ty = baseTy + dy;
      candidates.push({
        x: tx * TILE + TILE / 2,
        y: ty * TILE + TILE / 2,
        distance: Math.hypot(dx, dy) + random() * 0.08,
      });
    }
  }
  candidates.sort((a, b) => a.distance - b.distance);
  for (const candidate of candidates) {
    if (worldToChunk(candidate.x) !== chunk.cx || worldToChunk(candidate.y) !== chunk.cy) continue;
    if (options.pen) {
      const insidePen = candidate.x > options.pen.x + TILE * 0.45
        && candidate.x < options.pen.x + options.pen.w - TILE * 0.45
        && candidate.y > options.pen.y + TILE * 0.45
        && candidate.y < options.pen.y + options.pen.h - TILE * 0.45;
      if (!insidePen) continue;
    }
    if (pointIsClearInChunk(candidate.x, candidate.y, chunk, options)) return candidate;
  }
  return findClearPointInChunk(random, chunk, preferred, options);
}

function moveEntityTo(entity, point) {
  entity.x = point.x;
  entity.y = point.y;
  entity.fromX = point.x;
  entity.fromY = point.y;
  entity.targetX = point.x;
  entity.targetY = point.y;
}

function settleEntityInChunk(entity, random, chunk, options = {}) {
  const point = findNearbyClearPointInChunk(random, chunk, { x: entity.x, y: entity.y }, options.radiusTiles || 3, options);
  moveEntityTo(entity, point);
  if (entity.anchorX !== undefined && entity.anchorY !== undefined && !options.keepAnchor) {
    entity.anchorX = point.x;
    entity.anchorY = point.y;
  }
}

function structureIsClear(candidate, structures, tiles, cx, cy) {
  const protectedCenter = {
    left: -TILE * 1.2,
    top: -TILE * 1.2,
    right: TILE * 2.2,
    bottom: TILE * 2.2,
  };
  if (boundsOverlap(structureBounds(candidate, TILE * 0.25), protectedCenter)) return false;
  if (!structureTerrainIsClear(candidate, tiles, cx, cy)) return false;
  const candidateBounds = structureBounds(candidate, TILE * 1.35);
  return structures.every((structure) => !boundsOverlap(candidateBounds, structureBounds(structure)));
}

function makeNpc(random, cx, cy, index, nearStructure, areaProfile) {
  const name = `${randomChoice(random, firstNames)} ${randomChoice(random, surnames)}`;
  const role = randomChoice(random, roles);
  const mood = randomChoice(random, moods);
  const ancestry = weightedChoice(random, ancestryWeights[areaProfile.id] || ancestryWeights.road);
  const gender = weightedChoice(random, genderWeights[areaProfile.id] || genderWeights.road);
  const personality = weightedChoice(random, mbtiWeights);
  const dc = 9 + Math.floor(random() * 7);
  const hook = randomChoice(random, hooks);
  const secret = randomChoice(random, secrets);
  const hasFullDialogue = random() < (areaProfile.id === "village" ? 0.28 : 0.18)
    || role === "Watch Captain"
    || role === "Hedge Healer";
  const x = nearStructure
    ? (nearStructure.entryX || (nearStructure.x + nearStructure.w / 2)) + (random() - 0.5) * 60
    : cx * CHUNK_SIZE + 120 + random() * (CHUNK_SIZE - 240);
  const y = nearStructure
    ? (nearStructure.entryY || (nearStructure.y + nearStructure.h)) + (random() - 0.5) * 60
    : cy * CHUNK_SIZE + 120 + random() * (CHUNK_SIZE - 240);
  const snappedX = snapToTileCenter(x);
  const snappedY = snapToTileCenter(y);

  return {
    id: `${cx},${cy}:${index}`,
    name,
    role,
    mood,
    ancestry,
    gender,
    personality,
    areaId: areaProfile.id,
    dc,
    hook,
    secret,
    hasFullDialogue,
    x: snappedX,
    y: snappedY,
    fromX: snappedX,
    fromY: snappedY,
    targetX: snappedX,
    targetY: snappedY,
    anchorX: snappedX,
    anchorY: snappedY,
    moveProgress: 0,
    moving: false,
    facing: randomChoice(random, ["up", "down", "left", "right"]),
    wander: random() < 0.28,
    wait: 0.7 + random() * 3.8,
    talked: false,
    helped: false,
    revealed: false,
    interacted: false,
    lineIndex: 0,
    speech: "",
    speechTimer: 0,
    trust: 0,
    homeName: nearStructure?.label || nearStructure?.kind || `${areaProfile.name} Cottage`,
    workName: nearStructure?.kind || areaProfile.name,
    district: areaProfile.name,
    serviceTags: roleServices[role] || [],
    goods: buildTradeInventory(role, random),
    appearance: makeAppearance(random, ancestry, gender, role),
  };
}

function makeAnimal(random, cx, cy, index, areaProfile) {
  const type = weightedChoice(random, animalWeights[areaProfile.id] || animalWeights.road);
  const x = cx * CHUNK_SIZE + TILE * 2 + random() * (CHUNK_SIZE - TILE * 4);
  const y = cy * CHUNK_SIZE + TILE * 2 + random() * (CHUNK_SIZE - TILE * 4);
  return {
    id: `${cx},${cy}:animal:${index}`,
    type,
    x: snapToTileCenter(x),
    y: snapToTileCenter(y),
    fromX: snapToTileCenter(x),
    fromY: snapToTileCenter(y),
    targetX: snapToTileCenter(x),
    targetY: snapToTileCenter(y),
    moveProgress: 0,
    moving: false,
    facing: randomChoice(random, ["up", "down", "left", "right"]),
    wander: random() < 0.55,
    wait: 0.5 + random() * 4,
    bob: random() * Math.PI * 2,
    pen: null,
    speech: "",
    speechTimer: 0,
  };
}

function makePen(random, structure, index) {
  const side = index % 2 === 0 ? 1 : -1;
  const w = 4 * TILE;
  const h = 3 * TILE;
  const x = Math.round((structure.x + side * (structure.w + TILE * 1.5)) / TILE) * TILE;
  const y = Math.round((structure.y + structure.h - h + random() * TILE) / TILE) * TILE;
  return { x, y, w, h };
}

function penIsClear(pen, chunk, structures, pens) {
  const bounds = {
    left: pen.x - TILE,
    top: pen.y - TILE,
    right: pen.x + pen.w + TILE,
    bottom: pen.y + pen.h + TILE,
  };
  for (let y = bounds.top; y <= bounds.bottom; y += TILE) {
    for (let x = bounds.left; x <= bounds.right; x += TILE) {
      if (tileAtWorld(chunk.tiles, chunk.cx, chunk.cy, x, y) === "water") return false;
    }
  }
  const penBounds = { left: pen.x, top: pen.y, right: pen.x + pen.w, bottom: pen.y + pen.h };
  if (structures.some((structure) => boundsOverlap(penBounds, structureBounds(structure, TILE * 0.4)))) return false;
  if (pens.some((other) => boundsOverlap(penBounds, { left: other.x - TILE, top: other.y - TILE, right: other.x + other.w + TILE, bottom: other.y + other.h + TILE }))) return false;
  return true;
}

function makePennedAnimal(random, pen, index) {
  const type = weightedChoice(random, [["cow", 34], ["horse", 26], ["sheep", 18], ["goat", 12], ["pig", 10]]);
  const x = snapToTileCenter(pen.x + TILE + random() * Math.max(TILE, pen.w - TILE * 2));
  const y = snapToTileCenter(pen.y + TILE + random() * Math.max(TILE, pen.h - TILE * 2));
  return {
    id: `pen:${pen.x}:${pen.y}:${index}`,
    type,
    x,
    y,
    fromX: x,
    fromY: y,
    targetX: x,
    targetY: y,
    moveProgress: 0,
    moving: false,
    facing: randomChoice(random, ["up", "down", "left", "right"]),
    wander: true,
    wait: 0.5 + random() * 3,
    bob: random() * Math.PI * 2,
    pen,
    speech: "",
    speechTimer: 0,
  };
}

function makeHostile(random, cx, cy, index, areaProfile, chunk) {
  const pool = hostileProfiles[areaProfile.id] || hostileProfiles.road;
  const profile = randomChoice(random, pool);
  const point = findClearPointInChunk(random, chunk, null, { waterBuffer: 2, structureMargin: TILE * 1.2 });
  return {
    id: `${cx},${cy}:hostile:${index}`,
    kind: profile.kind,
    name: profile.kind,
    x: point.x,
    y: point.y,
    fromX: point.x,
    fromY: point.y,
    targetX: point.x,
    targetY: point.y,
    anchorX: point.x,
    anchorY: point.y,
    moveProgress: 0,
    moving: false,
    facing: randomChoice(random, ["up", "down", "left", "right"]),
    wander: true,
    wait: 0.8 + random() * 3.6,
    hp: profile.hp,
    maxHp: profile.hp,
    ac: profile.ac,
    attackBonus: profile.attack,
    damage: profile.damage,
    xpReward: profile.xp,
    intent: profile.intent,
    speech: "",
    speechTimer: 0,
    inCombat: false,
  };
}

function villageEntitiesForChunk(cx, cy) {
  if (!worldModel) return { structures: [], pens: [], npcs: [], animals: [] };
  const structures = worldModel.buildings.filter((building) => worldToChunk(building.x + building.w / 2) === cx && worldToChunk(building.y + building.h / 2) === cy);
  const pens = worldModel.pens.filter((pen) => worldToChunk(pen.x + pen.w / 2) === cx && worldToChunk(pen.y + pen.h / 2) === cy);
  const npcs = worldModel.residents
    .filter((npc) => worldToChunk(npc.x) === cx && worldToChunk(npc.y) === cy && npc.role !== "Tavernkeep")
    .map((npc) => ({ ...npc }));
  const animals = worldModel.animals
    .filter((animal) => worldToChunk(animal.x) === cx && worldToChunk(animal.y) === cy)
    .map((animal) => ({ ...animal }));
  return { structures, pens, npcs, animals };
}

function generateChunk(cx, cy) {
  const key = chunkKey(cx, cy);
  if (chunks.has(key)) return chunks.get(key);

  const areaProfile = getAreaProfile(cx, cy);
  const random = mulberry32(hashString(`${worldSeed}:waymark:${cx}:${cy}`));
  const tiles = [];
  const grains = [];
  for (let ty = 0; ty < CHUNK_TILES; ty += 1) {
    const row = [];
    const grainRow = [];
    for (let tx = 0; tx < CHUNK_TILES; tx += 1) {
      const wx = cx * CHUNK_SIZE + tx * TILE + TILE / 2;
      const wy = cy * CHUNK_SIZE + ty * TILE + TILE / 2;
      const detail = hashString(`${worldSeed}:${Math.floor(wx / 43)}:${Math.floor(wy / 43)}`) / 4294967295;
      row.push(baseTerrain(wx, wy, (detail + random() * 0.35) % 1, areaProfile.id));
      grainRow.push(hashString(`${worldSeed}:grain:${cx}:${cy}:${tx}:${ty}`));
    }
    tiles.push(row);
    grains.push(grainRow);
  }

  const nearVillage = chunkContainsVillage(cx, cy) || Math.hypot(cx, cy) <= 1.1;
  const structureChance = areaProfile.id === "road" || areaProfile.id === "fields" ? 0.58 : areaProfile.id === "river" ? 0.28 : 0.12;
  let structures = [];
  let pens = [];
  let npcs = [];
  let animals = [];
  if (nearVillage && worldModel) {
    const villageSlice = villageEntitiesForChunk(cx, cy);
    structures = villageSlice.structures;
    pens = villageSlice.pens;
    npcs = villageSlice.npcs;
    animals = villageSlice.animals;
    const villageChunk = { cx, cy, tiles, grains, structures, pens, areaProfile };
    for (const npc of npcs) {
      settleEntityInChunk(npc, random, villageChunk, {
        radiusTiles: 3,
        waterBuffer: 1,
        structureMargin: TILE * 0.65,
        avoidPens: true,
      });
    }
    for (const animal of animals) {
      if (animal.pen) {
        settleEntityInChunk(animal, random, villageChunk, {
          radiusTiles: 2,
          waterBuffer: 0,
          structureMargin: TILE * 0.4,
          pen: animal.pen,
          keepAnchor: true,
        });
      } else {
        settleEntityInChunk(animal, random, villageChunk, {
          radiusTiles: 2,
          waterBuffer: 1,
          structureMargin: TILE * 0.6,
          avoidPens: true,
        });
      }
    }
  } else {
    if (cx === 0 && cy === 0) {
      structures.push({
        x: -3 * TILE,
        y: -5 * TILE,
        w: 5 * TILE,
        h: 3 * TILE,
        kind: "Tavern",
        label: "Tavern",
        palette: { wall: "#b18758", roof: "#5d3d38", trim: "#f1dfb8" },
      });
    }
    const roadNearby = nearestRoadInfo(cx * CHUNK_SIZE + CHUNK_SIZE / 2, cy * CHUNK_SIZE + CHUNK_SIZE / 2).distance < TILE * 5.5;
    const structureCount = roadNearby && random() < structureChance ? 1 + (random() > 0.88 ? 1 : 0) : 0;
    for (let i = 0; i < structureCount; i += 1) {
      for (let attempt = 0; attempt < 18; attempt += 1) {
        const candidate = makeStructure(random, cx, cy, i, attempt);
        if (structureIsClear(candidate, structures, tiles, cx, cy)) {
          candidate.label = candidate.kind;
          assignStructurePath(candidate, tiles, cx, cy);
          structures.push(candidate);
          break;
        }
      }
    }

    const draftChunk = { cx, cy, tiles, grains, structures, areaProfile };
    if (areaProfile.id === "fields" || areaProfile.id === "road") {
      for (let i = 0; i < structures.length; i += 1) {
        const structure = structures[i];
        if ((structure.kind === "Cottage" || structure.kind === "Barn" || structure.kind === "Store") && random() < 0.38) {
          const candidate = makePen(random, structure, i);
          if (penIsClear(candidate, draftChunk, structures, pens)) pens.push(candidate);
        }
      }
    }

    const npcCount = structures.length > 0 && random() > 0.82 ? 1 : 0;
    for (let i = 0; i < npcCount; i += 1) {
      const npc = makeNpc(random, cx, cy, i, structures[i % Math.max(1, structures.length)], areaProfile);
      settleEntityInChunk(npc, random, draftChunk, { radiusTiles: 3, waterBuffer: 2, avoidPens: true });
      npcs.push(npc);
    }

    const animalCount = random() > 0.52 ? 1 + Math.floor(random() * 2) : 0;
    for (let i = 0; i < animalCount; i += 1) {
      const animal = makeAnimal(random, cx, cy, i, areaProfile);
      settleEntityInChunk(animal, random, draftChunk, { radiusTiles: 2, waterBuffer: 1, structureMargin: TILE, avoidPens: true });
      animals.push(animal);
    }
    for (const pen of pens) {
      const pennedCount = 1 + Math.floor(random() * 2);
      for (let i = 0; i < pennedCount; i += 1) {
        animals.push(makePennedAnimal(random, pen, i));
      }
    }
  }

  const draftChunk = { cx, cy, tiles, grains, structures, areaProfile };
  const hostiles = [];
  if (!nearVillage && areaProfile.id !== "village" && random() > 0.58) {
    const hostileCount = 1 + Math.floor(random() * (areaProfile.id === "mountains" ? 2 : 1));
    for (let i = 0; i < hostileCount; i += 1) {
      hostiles.push(makeHostile(random, cx, cy, i, areaProfile, draftChunk));
    }
  }

  const chunk = { cx, cy, tiles, grains, structures, pens, npcs, animals, hostiles, areaProfile };
  chunks.set(key, chunk);
  return chunk;
}

function preloadChunks() {
  const pcx = worldToChunk(player.x);
  const pcy = worldToChunk(player.y);
  const loadRadius = Math.max(
    LOAD_RADIUS,
    Math.ceil(Math.max(visibleWidth(), visibleHeight()) / (CHUNK_SIZE * 2)) + 1,
  );
  visibleChunkKeys.clear();
  for (let cy = pcy - loadRadius; cy <= pcy + loadRadius; cy += 1) {
    for (let cx = pcx - loadRadius; cx <= pcx + loadRadius; cx += 1) {
      visibleChunkKeys.add(chunkKey(cx, cy));
      generateChunk(cx, cy);
    }
  }
}

function isBlocked(x, y, options = {}) {
  if (gameMode === "tavern" && !options.world) {
    return isTavernBlocked(x, y, options);
  }
  if (gameMode === "dungeon" && !options.world) {
    return isDungeonBlocked(x, y, options);
  }

  const cx = worldToChunk(x);
  const cy = worldToChunk(y);
  const chunk = generateChunk(cx, cy);
  const tx = Math.floor((x - cx * CHUNK_SIZE) / TILE);
  const ty = Math.floor((y - cy * CHUNK_SIZE) / TILE);
  const terrain = chunk.tiles[ty]?.[tx];
  if (!terrainIsWalkable(terrain)) {
    return true;
  }

  for (const key of visibleChunkKeys) {
    const nearby = chunks.get(key);
    if (!nearby) continue;
    for (const structure of nearby.structures) {
      const insideX = x > structure.x - PLAYER_RADIUS && x < structure.x + structure.w + PLAYER_RADIUS;
      const insideY = y > structure.y - PLAYER_RADIUS && y < structure.y + structure.h + PLAYER_RADIUS;
      if (insideX && insideY) return true;
    }
    for (const npc of nearby.npcs) {
      if (options.ignore === npc || options.ignoreNpcs) continue;
      if (Math.hypot(npc.x - x, npc.y - y) < PLAYER_RADIUS * 1.6) return true;
    }
    for (const animal of nearby.animals || []) {
      if (options.ignore === animal || options.ignoreAnimals) continue;
      if (Math.hypot(animal.x - x, animal.y - y) < PLAYER_RADIUS * 1.25) return true;
    }
    for (const hostile of nearby.hostiles || []) {
      if (options.ignore === hostile || options.ignoreHostiles) continue;
      if (Math.hypot(hostile.x - x, hostile.y - y) < PLAYER_RADIUS * 1.45) return true;
    }
    for (const pen of nearby.pens || []) {
      const insideX = x > pen.x && x < pen.x + pen.w;
      const insideY = y > pen.y && y < pen.y + pen.h;
      const nearFenceX = Math.min(Math.abs(x - pen.x), Math.abs(x - (pen.x + pen.w))) < PLAYER_RADIUS;
      const nearFenceY = Math.min(Math.abs(y - pen.y), Math.abs(y - (pen.y + pen.h))) < PLAYER_RADIUS;
      if ((insideX && nearFenceY) || (insideY && nearFenceX)) return true;
    }
  }

  return false;
}

function isDungeonBlocked(x, y, options = {}) {
  if (!dungeonState) return true;
  const tx = Math.floor(x / TILE);
  const ty = Math.floor(y / TILE);
  if (tx < 0 || ty < 0 || tx >= dungeonState.size.w || ty >= dungeonState.size.h) return true;
  const tile = dungeonState.tiles[ty]?.[tx] || "wall";
  if (tile === "wall") return true;
  if (dungeonState.chest && !options.ignoreChest && Math.hypot(dungeonState.chest.x - x, dungeonState.chest.y - y) < PLAYER_RADIUS * 1.25) {
    return true;
  }
  for (const hostile of dungeonState.hostiles) {
    if (hostile.defeated || options.ignore === hostile || options.ignoreHostiles) continue;
    if (Math.hypot(hostile.x - x, hostile.y - y) < PLAYER_RADIUS * 1.45) return true;
  }
  return false;
}

function isTavernBlocked(x, y, options = {}) {
  const tx = Math.floor(x / TILE);
  const ty = Math.floor(y / TILE);
  if (tx < 1 || ty < 1 || tx >= tavernSize.w - 1 || ty >= tavernSize.h - 1) return true;
  const furniture = [
    { x: 1, y: 1, w: 14, h: 1 },
    { x: 6, y: 3, w: 5, h: 1 },
    { x: 3, y: 5, w: 2, h: 2 },
    { x: 8, y: 6, w: 2, h: 2 },
    { x: 12, y: 5, w: 2, h: 2 },
  ];
  for (const item of furniture) {
    if (tx >= item.x && tx < item.x + item.w && ty >= item.y && ty < item.y + item.h) return true;
  }
  if (options.ignore !== tavernkeeper && Math.hypot(tavernkeeper.x - x, tavernkeeper.y - y) < PLAYER_RADIUS * 1.55) return true;
  for (const patron of tavernPatrons) {
    if (options.ignore === patron) continue;
    if (Math.hypot(patron.x - x, patron.y - y) < PLAYER_RADIUS * 1.55) return true;
  }
  return false;
}

function directionIsHeld(direction) {
  return Object.entries(movementKeys).some(([key, value]) => value === direction && keys.has(key));
}

function directionFromHeldKeys() {
  if (queuedDirection && directionIsHeld(queuedDirection)) {
    return queuedDirection;
  }
  if (keys.has("w") || keys.has("arrowup")) return "up";
  if (keys.has("s") || keys.has("arrowdown")) return "down";
  if (keys.has("a") || keys.has("arrowleft")) return "left";
  if (keys.has("d") || keys.has("arrowright")) return "right";
  return null;
}

function startTileMove(direction) {
  const vector = directionVectors[direction];
  if (!vector) return;

  player.facing = direction;
  const targetX = snapToTileCenter(player.x) + vector.x * TILE;
  const targetY = snapToTileCenter(player.y) + vector.y * TILE;
  if (isBlocked(targetX, targetY)) return;

  player.fromX = snapToTileCenter(player.x);
  player.fromY = snapToTileCenter(player.y);
  player.targetX = targetX;
  player.targetY = targetY;
  player.moveProgress = 0;
  player.moving = true;
}

function movePlayer(delta) {
  if (combatState || inventoryVisible) return;
  if (player.moving) {
    player.moveProgress = Math.min(1, player.moveProgress + delta / STEP_DURATION);
    const eased = player.moveProgress < 0.5
      ? 2 * player.moveProgress * player.moveProgress
      : 1 - Math.pow(-2 * player.moveProgress + 2, 2) / 2;
    player.x = player.fromX + (player.targetX - player.fromX) * eased;
    player.y = player.fromY + (player.targetY - player.fromY) * eased;
    player.walkClock += delta;
    if (player.moveProgress >= 1) {
      player.x = player.targetX;
      player.y = player.targetY;
      player.moving = false;
      player.walkClock = 0;
      advanceWorldTime(gameMode === "tavern" ? 1 : 3);
    }
    return;
  }

  const direction = directionFromHeldKeys();
  if (direction) startTileMove(direction);
}

function camera() {
  if (gameMode === "tavern") {
    return {
      x: (tavernSize.w * TILE - visibleWidth()) / 2,
      y: (tavernSize.h * TILE - visibleHeight()) / 2,
    };
  }
  if (gameMode === "dungeon" && dungeonState) {
    const maxX = Math.max(0, dungeonState.size.w * TILE - visibleWidth());
    const maxY = Math.max(0, dungeonState.size.h * TILE - visibleHeight());
    return {
      x: clamp(player.x - visibleWidth() / 2, 0, maxX),
      y: clamp(player.y - visibleHeight() / 2, 0, maxY),
    };
  }
  return {
    x: player.x - visibleWidth() / 2,
    y: player.y - visibleHeight() / 2,
  };
}

const rgbaCache = new Map();

function colorWithAlpha(color, alpha) {
  const key = `${color}:${alpha}`;
  if (rgbaCache.has(key)) return rgbaCache.get(key);
  if (!color || color[0] !== "#" || color.length !== 7) return color;
  const r = Number.parseInt(color.slice(1, 3), 16);
  const g = Number.parseInt(color.slice(3, 5), 16);
  const b = Number.parseInt(color.slice(5, 7), 16);
  const value = `rgba(${r},${g},${b},${alpha})`;
  rgbaCache.set(key, value);
  return value;
}

function terrainAtWorldTile(tx, ty) {
  const wx = tx * TILE + TILE / 2;
  const wy = ty * TILE + TILE / 2;
  const cx = worldToChunk(wx);
  const cy = worldToChunk(wy);
  const chunk = chunks.get(chunkKey(cx, cy)) || generateChunk(cx, cy);
  const localTx = tx - cx * CHUNK_TILES;
  const localTy = ty - cy * CHUNK_TILES;
  return chunk.tiles?.[localTy]?.[localTx] || "water";
}

function terrainNeighbor(chunk, tx, ty, dx, dy) {
  return terrainAtWorldTile(chunk.cx * CHUNK_TILES + tx + dx, chunk.cy * CHUNK_TILES + ty + dy);
}

function connectedNeighbors(chunk, tx, ty, terrain) {
  return {
    n: terrainNeighbor(chunk, tx, ty, 0, -1) === terrain,
    s: terrainNeighbor(chunk, tx, ty, 0, 1) === terrain,
    w: terrainNeighbor(chunk, tx, ty, -1, 0) === terrain,
    e: terrainNeighbor(chunk, tx, ty, 1, 0) === terrain,
  };
}

function terrainBlendFamily(terrain) {
  if (terrain === "grass" || terrain === "grass2" || terrain === "meadow") {
    return "ground";
  }
  return "";
}

function collapsedTerrainPriority(terrain) {
  return {
    bridgeH: 120,
    bridgeV: 120,
    path: 110,
    plaza: 100,
    yard: 96,
    water: 90,
    shallow: 82,
    stone: 72,
    scree: 68,
    tree: 64,
    pine: 64,
    field: 58,
    orchard: 56,
    garden: 54,
    marsh: 50,
    sand: 46,
    dirt: 42,
    grave: 38,
    flower: 36,
    meadow: 32,
    grass2: 30,
    grass: 28,
  }[terrain] || 24;
}

function collapsedTerrainForBlock(chunk, startTx, startTy, blockSize, endTx, endTy) {
  const counts = new Map();
  for (let ty = startTy; ty <= Math.min(endTy, startTy + blockSize - 1); ty += 1) {
    for (let tx = startTx; tx <= Math.min(endTx, startTx + blockSize - 1); tx += 1) {
      const terrain = chunk.tiles[ty][tx];
      counts.set(terrain, (counts.get(terrain) || 0) + 1);
    }
  }
  let bestTerrain = "grass";
  let bestScore = -Infinity;
  for (const [terrain, count] of counts) {
    const score = count * 10 + collapsedTerrainPriority(terrain);
    if (score > bestScore) {
      bestTerrain = terrain;
      bestScore = score;
    }
  }
  return bestTerrain;
}

function actorOnScreen(actor, cam, margin = TILE * 1.5) {
  const sx = actor.x - cam.x;
  const sy = actor.y - cam.y;
  return sx > -margin
    && sx < visibleWidth() + margin
    && sy > -margin
    && sy < visibleHeight() + margin;
}

function pathRoundedRect(x, y, w, h, radius) {
  const r = Math.min(radius, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function buildConnectedMassPath(sx, sy, inset, radius, neighbors) {
  pathRoundedRect(sx + inset, sy + inset, TILE - inset * 2, TILE - inset * 2, radius);
  if (neighbors.n) ctx.rect(sx + inset, sy, TILE - inset * 2, TILE / 2 + inset);
  if (neighbors.s) ctx.rect(sx + inset, sy + TILE / 2 - inset, TILE - inset * 2, TILE / 2 + inset);
  if (neighbors.w) ctx.rect(sx, sy + inset, TILE / 2 + inset, TILE - inset * 2);
  if (neighbors.e) ctx.rect(sx + TILE / 2 - inset, sy + inset, TILE / 2 + inset, TILE - inset * 2);
  if (neighbors.n && neighbors.w) ctx.rect(sx, sy, TILE / 2 + inset, TILE / 2 + inset);
  if (neighbors.n && neighbors.e) ctx.rect(sx + TILE / 2 - inset, sy, TILE / 2 + inset, TILE / 2 + inset);
  if (neighbors.s && neighbors.w) ctx.rect(sx, sy + TILE / 2 - inset, TILE / 2 + inset, TILE / 2 + inset);
  if (neighbors.s && neighbors.e) ctx.rect(sx + TILE / 2 - inset, sy + TILE / 2 - inset, TILE / 2 + inset, TILE / 2 + inset);
}

function fillConnectedMass(sx, sy, inset, radius, fillStyle, neighbors) {
  ctx.fillStyle = fillStyle;
  buildConnectedMassPath(sx, sy, inset, radius, neighbors);
  ctx.fill();
}

function clipConnectedMass(sx, sy, inset, radius, neighbors) {
  ctx.save();
  buildConnectedMassPath(sx, sy, inset, radius, neighbors);
  ctx.clip();
}

function terrainUnderlay(terrain) {
  if (terrain === "water") return "shallow";
  if (terrain === "shallow") return "sand";
  if (terrain === "stone" || terrain === "scree") return "dirt";
  if (terrain === "sand") return "meadow";
  if (terrain === "field" || terrain === "garden" || terrain === "orchard" || terrain === "marsh" || terrain === "grave" || terrain === "flower" || terrain === "dirt") return "grass2";
  return terrain;
}

function terrainPatchPalette(terrain) {
  return {
    dirt: { base: "#9b764c", edge: "#6d553b", light: "#c59c69", shade: "#5c442f", inset: 4 },
    sand: { base: "#e4cf84", edge: "#c0a861", light: "#f6e8ae", shade: "#c9b16a", inset: 4 },
    shallow: { base: "#87bac9", edge: "#5c99ae", light: "#cce9ef", shade: "#5f98a3", inset: 3 },
    field: { base: "#bba75b", edge: "#88783e", light: "#e4d57d", shade: "#7a6b2f", inset: 4 },
    garden: { base: "#6f8b53", edge: "#53653d", light: "#94b272", shade: "#485b37", inset: 4 },
    orchard: { base: "#647c4c", edge: "#465839", light: "#88a669", shade: "#3f5035", inset: 4 },
    marsh: { base: "#5d866f", edge: "#46614f", light: "#90b4a0", shade: "#425a49", inset: 4 },
    grave: { base: "#7f8770", edge: "#5f6554", light: "#b0b89d", shade: "#585c4e", inset: 4 },
    stone: { base: "#938c82", edge: "#6d655d", light: "#c5bdb0", shade: "#605953", inset: 3 },
    scree: { base: "#8a8478", edge: "#6a645a", light: "#b6b1a5", shade: "#5b554c", inset: 4 },
    flower: { base: "#a48ca0", edge: "#7c6878", light: "#e0bfd0", shade: "#6c5668", inset: 5 },
    water: { base: "#4e9ab3", edge: "#2a7188", light: "#d4eef5", shade: "#2f6e81", inset: 2 },
  }[terrain] || { base: terrainColors[terrain], edge: "#334", light: "#fff", shade: "#222", inset: 4 };
}

function isOrganicOverlayTerrain(terrain) {
  return ["dirt", "sand", "shallow", "field", "garden", "orchard", "marsh", "grave", "stone", "scree", "flower", "water"].includes(terrain);
}

function drawPatchWaves(sx, sy, color, detail, grain, amplitude = 3.5, spacing = 9) {
  ctx.strokeStyle = color;
  ctx.lineWidth = detail > 1 ? 1.4 : 1;
  for (let y = -4; y <= TILE + 4; y += spacing) {
    const offset = ((grain >> ((y + 8) % 11)) & 3) - 1.5;
    ctx.beginPath();
    ctx.moveTo(sx - 4, sy + y + offset);
    ctx.bezierCurveTo(
      sx + TILE * 0.22,
      sy + y - amplitude,
      sx + TILE * 0.54,
      sy + y + amplitude,
      sx + TILE + 4,
      sy + y + offset,
    );
    ctx.stroke();
  }
}

function drawStoneCells(sx, sy, detail, grain) {
  ctx.strokeStyle = "rgba(68,60,55,0.34)";
  ctx.lineWidth = 1;
  const rows = detail > 1 ? 3 : 2;
  const cols = detail > 1 ? 4 : 3;
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const ox = sx + 4 + col * 9 + ((grain >> (row * 3 + col)) & 3);
      const oy = sy + 5 + row * 11 + ((grain >> (row * 4 + col + 1)) & 2);
      ctx.beginPath();
      ctx.moveTo(ox, oy + 3);
      ctx.lineTo(ox + 4, oy);
      ctx.lineTo(ox + 9, oy + 2);
      ctx.lineTo(ox + 8, oy + 8);
      ctx.lineTo(ox + 2, oy + 9);
      ctx.closePath();
      ctx.stroke();
    }
  }
}

function drawOrganicTerrainPatch(chunk, tx, ty, sx, sy, terrain, grain, detail) {
  const palette = terrainPatchPalette(terrain);
  const neighbors = connectedNeighbors(chunk, tx, ty, terrain);
  fillConnectedMass(sx, sy, palette.inset, 12, colorWithAlpha(palette.base, terrain === "water" ? 0.92 : 0.85), neighbors);
  if (detail < 1) {
    ctx.strokeStyle = colorWithAlpha(palette.edge, 0.2);
    ctx.lineWidth = terrain === "water" ? 1.5 : 1.1;
    buildConnectedMassPath(sx, sy, palette.inset, 12, neighbors);
    ctx.stroke();
    return;
  }
  clipConnectedMass(sx, sy, palette.inset, 12, neighbors);
  const wash = ctx.createLinearGradient(sx, sy, sx + TILE, sy + TILE);
  wash.addColorStop(0, colorWithAlpha(palette.light, 0.24));
  wash.addColorStop(0.55, colorWithAlpha(palette.base, 0.08));
  wash.addColorStop(1, colorWithAlpha(palette.shade, 0.18));
  ctx.fillStyle = wash;
  ctx.fillRect(sx - 2, sy - 2, TILE + 4, TILE + 4);

  if (terrain === "stone" || terrain === "scree") {
    drawStoneCells(sx, sy, detail, grain);
  } else if (terrain === "water" || terrain === "shallow") {
    drawPatchWaves(sx, sy, colorWithAlpha(palette.light, 0.4), detail, grain, 2.7, detail > 1 ? 8 : 11);
  } else {
    drawPatchWaves(sx, sy, colorWithAlpha(palette.light, 0.28), detail, grain, 3.1, detail > 1 ? 8 : 10);
  }

  if (terrain === "field") {
    ctx.strokeStyle = "rgba(99,79,35,0.28)";
    ctx.lineWidth = 1;
    for (let i = -TILE; i < TILE * 2; i += 12) {
      ctx.beginPath();
      ctx.moveTo(sx + i, sy + TILE + 1);
      ctx.lineTo(sx + i + TILE, sy - 1);
      ctx.stroke();
    }
  } else if (terrain === "orchard") {
    ctx.fillStyle = "rgba(37,59,30,0.32)";
    ctx.beginPath();
    ctx.arc(sx + 14, sy + 15, 8, 0, Math.PI * 2);
    ctx.arc(sx + 27, sy + 23, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ad6656";
    ctx.beginPath();
    ctx.arc(sx + 13, sy + 16, 2, 0, Math.PI * 2);
    ctx.arc(sx + 29, sy + 21, 2, 0, Math.PI * 2);
    ctx.fill();
  } else if (terrain === "garden" || terrain === "flower") {
    ctx.fillStyle = terrain === "flower" ? "#e5c17d" : "#d39bad";
    ctx.beginPath();
    ctx.arc(sx + 12, sy + 13, 2.2, 0, Math.PI * 2);
    ctx.arc(sx + 24, sy + 18, 2.4, 0, Math.PI * 2);
    ctx.arc(sx + 18, sy + 28, 1.9, 0, Math.PI * 2);
    ctx.fill();
  } else if (terrain === "marsh") {
    ctx.fillStyle = "rgba(38,64,47,0.38)";
    ctx.fillRect(sx + 8, sy + 19, 3, 12);
    ctx.fillRect(sx + 16, sy + 17, 3, 14);
    ctx.fillRect(sx + 26, sy + 20, 3, 11);
  } else if (terrain === "grave") {
    ctx.fillStyle = "#b9bda6";
    ctx.fillRect(sx + 10, sy + 12, 6, 14);
    ctx.fillRect(sx + 22, sy + 15, 7, 12);
  }

  ctx.restore();
  ctx.strokeStyle = colorWithAlpha(palette.edge, 0.24);
  ctx.lineWidth = terrain === "water" ? 1.8 : 1.3;
  buildConnectedMassPath(sx, sy, palette.inset, 12, neighbors);
  ctx.stroke();
}

function drawGroundBlendEdges(chunk, tx, ty, sx, sy, terrain) {
  const family = terrainBlendFamily(terrain);
  if (family !== "ground") return;
  const edges = [
    { dx: -1, dy: 0, x1: sx, y1: sy, x2: sx + 12, y2: sy, w: 12, h: TILE, horizontal: true },
    { dx: 1, dy: 0, x1: sx + TILE, y1: sy, x2: sx + TILE - 12, y2: sy, w: 12, h: TILE, horizontal: true },
    { dx: 0, dy: -1, x1: sx, y1: sy, x2: sx, y2: sy + 12, w: TILE, h: 12, horizontal: false },
    { dx: 0, dy: 1, x1: sx, y1: sy + TILE, x2: sx, y2: sy + TILE - 12, w: TILE, h: 12, horizontal: false },
  ];
  for (const edge of edges) {
    const neighbor = terrainNeighbor(chunk, tx, ty, edge.dx, edge.dy);
    if (terrainBlendFamily(neighbor) !== family || neighbor === terrain) continue;
    const gradient = edge.horizontal
      ? ctx.createLinearGradient(edge.x1, edge.y1, edge.x2, edge.y2)
      : ctx.createLinearGradient(edge.x1, edge.y1, edge.x2, edge.y2);
    gradient.addColorStop(0, colorWithAlpha(terrainColors[neighbor], 0.22));
    gradient.addColorStop(1, colorWithAlpha(terrainColors[neighbor], 0));
    ctx.fillStyle = gradient;
    ctx.fillRect(edge.horizontal && edge.dx > 0 ? sx + TILE - edge.w : sx, edge.horizontal ? sy : edge.dy > 0 ? sy + TILE - edge.h : sy, edge.w, edge.h);
  }
}

function drawWaterMass(chunk, tx, ty, sx, sy, grain, detail) {
  drawOrganicTerrainPatch(chunk, tx, ty, sx, sy, "water", grain, detail);
}

function drawStoneMass(chunk, tx, ty, sx, sy, grain, detail) {
  drawOrganicTerrainPatch(chunk, tx, ty, sx, sy, "stone", grain, detail);
}

function drawTile(x, y, color, cam, detail = 2) {
  const sx = Math.floor(x - cam.x);
  const sy = Math.floor(y - cam.y);
  ctx.fillStyle = color;
  ctx.fillRect(sx, sy, TILE + 1, TILE + 1);
  if (detail < 2) return;
  ctx.fillStyle = "rgba(255,255,255,0.035)";
  ctx.fillRect(sx, sy, TILE + 1, 3);
  ctx.fillStyle = "rgba(0,0,0,0.045)";
  ctx.fillRect(sx, sy + TILE - 4, TILE + 1, 5);
}

function drawTerrain(chunk, cam, detail = terrainDetailLevel()) {
  const startTx = clamp(Math.floor((cam.x - chunk.cx * CHUNK_SIZE) / TILE), 0, CHUNK_TILES - 1);
  const endTx = clamp(Math.ceil((cam.x + visibleWidth() - chunk.cx * CHUNK_SIZE) / TILE), 0, CHUNK_TILES - 1);
  const startTy = clamp(Math.floor((cam.y - chunk.cy * CHUNK_SIZE) / TILE), 0, CHUNK_TILES - 1);
  const endTy = clamp(Math.ceil((cam.y + visibleHeight() - chunk.cy * CHUNK_SIZE) / TILE), 0, CHUNK_TILES - 1);
  if (detail === 0) {
    const blockSize = visibleHeight() / TILE > 78 ? 4 : 2;
    for (let ty = startTy; ty <= endTy; ty += blockSize) {
      for (let tx = startTx; tx <= endTx; tx += blockSize) {
        const terrain = collapsedTerrainForBlock(chunk, tx, ty, blockSize, endTx, endTy);
        const wx = chunk.cx * CHUNK_SIZE + tx * TILE;
        const wy = chunk.cy * CHUNK_SIZE + ty * TILE;
        const sx = wx - cam.x;
        const sy = wy - cam.y;
        const spanW = (Math.min(endTx, tx + blockSize - 1) - tx + 1) * TILE;
        const spanH = (Math.min(endTy, ty + blockSize - 1) - ty + 1) * TILE;
        const baseTerrain = isOrganicOverlayTerrain(terrain) ? terrainUnderlay(terrain) : terrain;
        ctx.fillStyle = terrainColors[baseTerrain];
        ctx.fillRect(sx, sy, spanW + 1, spanH + 1);
        if (terrain === "path" || terrain === "bridgeH" || terrain === "bridgeV") {
          ctx.fillStyle = terrain === "path" ? "rgba(109,79,52,0.78)" : "#7a5436";
          if (terrain === "bridgeV") ctx.fillRect(sx + spanW * 0.28, sy, spanW * 0.44, spanH);
          else if (terrain === "bridgeH") ctx.fillRect(sx, sy + spanH * 0.28, spanW, spanH * 0.44);
          else ctx.fillRect(sx, sy, spanW, spanH);
        } else if (terrain === "water" || terrain === "shallow") {
          ctx.fillStyle = terrain === "water" ? "rgba(219,244,248,0.12)" : "rgba(239,240,210,0.08)";
          ctx.fillRect(sx, sy, spanW, Math.max(8, spanH * 0.18));
        }
      }
    }
    return;
  }
  for (let ty = startTy; ty <= endTy; ty += 1) {
    for (let tx = startTx; tx <= endTx; tx += 1) {
      const terrain = chunk.tiles[ty][tx];
      const wx = chunk.cx * CHUNK_SIZE + tx * TILE;
      const wy = chunk.cy * CHUNK_SIZE + ty * TILE;
      const sx = wx - cam.x;
      const sy = wy - cam.y;
      const grain = chunk.grains?.[ty]?.[tx] || 0;
      const useOrganicOverlay = detail > 0 && isOrganicOverlayTerrain(terrain);
      const baseColor = useOrganicOverlay ? terrainColors[terrainUnderlay(terrain)] : terrainColors[terrain];
      drawTile(wx, wy, baseColor, cam, detail);
      if (useOrganicOverlay && terrain === "water") drawWaterMass(chunk, tx, ty, sx, sy, grain, detail);
      else if (useOrganicOverlay && terrain === "stone") drawStoneMass(chunk, tx, ty, sx, sy, grain, detail);
      else if (useOrganicOverlay && (terrain === "shallow" || terrain === "scree" || terrain === "dirt" || terrain === "sand" || terrain === "field" || terrain === "garden" || terrain === "orchard" || terrain === "marsh" || terrain === "grave" || terrain === "flower")) {
        drawOrganicTerrainPatch(chunk, tx, ty, sx, sy, terrain, grain, detail);
      }
      if (detail === 0) continue;
      if (!isOrganicOverlayTerrain(terrain) && terrain !== "path" && terrain !== "plaza" && terrain !== "yard" && terrain !== "bridgeH" && terrain !== "bridgeV" && terrain !== "tree" && terrain !== "pine") {
        drawGroundBlendEdges(chunk, tx, ty, sx, sy, terrain);
      }
      if (isOrganicOverlayTerrain(terrain)) continue;

      if (terrain === "bridgeH" || terrain === "bridgeV") {
        ctx.fillStyle = "#6e482e";
        if (terrain === "bridgeH") {
          ctx.fillRect(sx, sy + 5, TILE, TILE - 10);
        } else {
          ctx.fillRect(sx + 5, sy, TILE - 10, TILE);
        }
        ctx.strokeStyle = "rgba(37,24,16,0.45)";
        ctx.lineWidth = 2;
        for (let i = 7; i < TILE; i += 9) {
          ctx.beginPath();
          if (terrain === "bridgeH") {
            ctx.moveTo(sx + i, sy + 6);
            ctx.lineTo(sx + i, sy + TILE - 6);
          } else {
            ctx.moveTo(sx + 6, sy + i);
            ctx.lineTo(sx + TILE - 6, sy + i);
          }
          ctx.stroke();
        }
        ctx.strokeStyle = "rgba(235,196,123,0.42)";
        ctx.beginPath();
        if (terrain === "bridgeH") {
          ctx.moveTo(sx + 3, sy + 8);
          ctx.lineTo(sx + TILE - 3, sy + 8);
          ctx.moveTo(sx + 3, sy + TILE - 8);
          ctx.lineTo(sx + TILE - 3, sy + TILE - 8);
        } else {
          ctx.moveTo(sx + 8, sy + 3);
          ctx.lineTo(sx + 8, sy + TILE - 3);
          ctx.moveTo(sx + TILE - 8, sy + 3);
          ctx.lineTo(sx + TILE - 8, sy + TILE - 3);
        }
        ctx.stroke();
      } else if (terrain === "path") {
        ctx.fillStyle = "rgba(73,48,30,0.14)";
        ctx.fillRect(sx + 3, sy + 5 + (grain % 7), TILE - 6, 4);
        if (detail < 2) continue;
        ctx.fillStyle = "rgba(255,245,213,0.14)";
        ctx.fillRect(sx + 8, sy + 11, 6, 4);
        ctx.fillRect(sx + 25, sy + 26, 5, 3);
        ctx.fillStyle = "rgba(71,45,27,0.18)";
        ctx.beginPath();
        ctx.arc(sx + 27, sy + 12, 2, 0, Math.PI * 2);
        ctx.arc(sx + 12, sy + 29, 1.6, 0, Math.PI * 2);
        ctx.fill();
      } else if (terrain === "plaza" || terrain === "yard") {
        ctx.fillStyle = terrain === "plaza" ? "rgba(255,244,214,0.08)" : "rgba(75,55,34,0.09)";
        ctx.fillRect(sx, sy, TILE, TILE);
        if (detail < 2) continue;
        ctx.strokeStyle = "rgba(46,36,24,0.18)";
        ctx.lineWidth = 1;
        ctx.strokeRect(sx + 5, sy + 5, TILE - 10, TILE - 10);
        if (terrain === "plaza") {
          ctx.fillStyle = "rgba(255,235,183,0.12)";
          ctx.beginPath();
          ctx.arc(sx + TILE / 2, sy + TILE / 2, 6, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (terrain === "field") {
        if (detail < 2) continue;
        ctx.strokeStyle = "rgba(63,53,26,0.28)";
        ctx.lineWidth = 2;
        for (let i = -TILE; i < TILE * 2; i += 10) {
          ctx.beginPath();
          ctx.moveTo(sx + i, sy + TILE);
          ctx.lineTo(sx + i + TILE, sy);
          ctx.stroke();
        }
        ctx.strokeStyle = "rgba(245,230,141,0.22)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(sx + 4, sy + 8);
        ctx.lineTo(sx + 31, sy + 29);
        ctx.stroke();
      } else if (terrain === "orchard") {
        ctx.fillStyle = "rgba(49,65,37,0.18)";
        ctx.fillRect(sx, sy, TILE, TILE);
        if (detail < 2) continue;
        ctx.fillStyle = "#314b25";
        ctx.beginPath();
        ctx.arc(sx + 14, sy + 14, 9, 0, Math.PI * 2);
        ctx.arc(sx + 24, sy + 24, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#7c3f36";
        ctx.beginPath();
        ctx.arc(sx + 13, sy + 17, 2, 0, Math.PI * 2);
        ctx.arc(sx + 24, sy + 20, 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (terrain === "garden") {
        if (detail < 2) continue;
        ctx.strokeStyle = "rgba(73,57,32,0.24)";
        ctx.lineWidth = 1;
        for (let i = 6; i < TILE; i += 8) {
          ctx.beginPath();
          ctx.moveTo(sx + i, sy + 3);
          ctx.lineTo(sx + i, sy + TILE - 3);
          ctx.stroke();
        }
        ctx.fillStyle = "#c68593";
        ctx.beginPath();
        ctx.arc(sx + 10, sy + 12, 2, 0, Math.PI * 2);
        ctx.arc(sx + 22, sy + 18, 2, 0, Math.PI * 2);
        ctx.arc(sx + 30, sy + 11, 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (terrain === "marsh") {
        ctx.fillStyle = "rgba(123,171,156,0.08)";
        ctx.fillRect(sx, sy, TILE, TILE);
        if (detail < 2) continue;
        ctx.fillStyle = "#506a4f";
        ctx.fillRect(sx + 8, sy + 21, 3, 12);
        ctx.fillRect(sx + 16, sy + 18, 3, 15);
        ctx.fillRect(sx + 27, sy + 19, 3, 14);
        ctx.strokeStyle = "rgba(214,243,244,0.24)";
        ctx.beginPath();
        ctx.moveTo(sx + 5, sy + 12);
        ctx.quadraticCurveTo(sx + 16, sy + 7, sx + 30, sy + 15);
        ctx.stroke();
      } else if (terrain === "grave") {
        if (detail < 2) continue;
        ctx.fillStyle = "#89917e";
        ctx.fillRect(sx + 9, sy + 11, 7, 16);
        ctx.fillRect(sx + 23, sy + 14, 8, 13);
        ctx.strokeStyle = "rgba(245,245,226,0.18)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(sx + 12.5, sy + 14);
        ctx.lineTo(sx + 12.5, sy + 23);
        ctx.moveTo(sx + 9, sy + 18.5);
        ctx.lineTo(sx + 16, sy + 18.5);
        ctx.stroke();
      } else if (terrain === "meadow") {
        if (detail < 2) continue;
        ctx.strokeStyle = "rgba(216,236,175,0.15)";
        ctx.lineWidth = 1;
        for (let i = 0; i < 5; i += 1) {
          const gx = sx + 5 + ((grain >> (i * 3)) % 28);
          const gy = sy + 10 + ((grain >> (i * 4)) % 20);
          ctx.beginPath();
          ctx.moveTo(gx, gy + 5);
          ctx.lineTo(gx + 2, gy);
          ctx.stroke();
        }
      } else if (terrain === "flower") {
        if (detail < 2) continue;
        ctx.fillStyle = "rgba(54,92,50,0.5)";
        ctx.fillRect(sx + 7, sy + 15, 2, 9);
        ctx.fillRect(sx + 24, sy + 17, 2, 8);
        ctx.fillStyle = grain % 2 === 0 ? "#e7c35c" : "#e7a6ba";
        ctx.beginPath();
        ctx.arc(sx + 9, sy + 14, 2.4, 0, Math.PI * 2);
        ctx.arc(sx + 26, sy + 16, 2.2, 0, Math.PI * 2);
        ctx.arc(sx + 19, sy + 27, 1.9, 0, Math.PI * 2);
        ctx.fill();
      } else if (terrain === "tree" || terrain === "pine") {
        ctx.fillStyle = "#4e3428";
        ctx.fillRect(sx + 17, sy + 19, 6, 14);
        if (terrain === "pine") {
          ctx.fillStyle = "#183025";
          ctx.beginPath();
          ctx.moveTo(sx + 20, sy + 4);
          ctx.lineTo(sx + 7, sy + 21);
          ctx.lineTo(sx + 33, sy + 21);
          ctx.closePath();
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(sx + 20, sy + 11);
          ctx.lineTo(sx + 9, sy + 27);
          ctx.lineTo(sx + 31, sy + 27);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.fillStyle = "#1b3325";
          ctx.beginPath();
          ctx.arc(sx + 16, sy + 15, 13, 0, Math.PI * 2);
          ctx.arc(sx + 25, sy + 20, 10, 0, Math.PI * 2);
          ctx.arc(sx + 9, sy + 21, 9, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "rgba(151,198,119,0.18)";
          ctx.beginPath();
          ctx.arc(sx + 12, sy + 10, 5, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (terrain === "water") {
        ctx.fillStyle = "rgba(255,255,255,0.025)";
        ctx.fillRect(sx + 2, sy + 2, TILE - 4, TILE - 4);
        if (detail < 2) continue;
        ctx.strokeStyle = "rgba(160,220,232,0.12)";
        ctx.beginPath();
        ctx.arc(sx + 13, sy + 18, 4, 0, Math.PI * 2);
        ctx.arc(sx + 25, sy + 24, 3, 0, Math.PI * 2);
        ctx.stroke();
      } else if (terrain === "stone") {
        if (detail < 2) continue;
        ctx.strokeStyle = "rgba(46,42,39,0.26)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(sx + 10, sy + 25);
        ctx.lineTo(sx + 18, sy + 17);
        ctx.lineTo(sx + 29, sy + 21);
        ctx.stroke();
      } else {
        if (detail < 2) continue;
        ctx.strokeStyle = "rgba(196,225,155,0.13)";
        ctx.lineWidth = 1;
        for (let i = 0; i < 3; i += 1) {
          const gx = sx + 7 + ((grain >> (i * 4)) % 24);
          const gy = sy + 11 + ((grain >> (i * 5)) % 18);
          ctx.beginPath();
          ctx.moveTo(gx, gy + 5);
          ctx.lineTo(gx + 2, gy);
          ctx.stroke();
        }
      }
    }
  }
}

function drawGrid(cam) {
  if (visibleHeight() / TILE > 34) return;
  const startX = Math.floor(cam.x / TILE) * TILE;
  const startY = Math.floor(cam.y / TILE) * TILE;
  const endX = cam.x + visibleWidth() + TILE;
  const endY = cam.y + visibleHeight() + TILE;
  const majorEvery = Math.max(1, Math.round(20 / GRID_FEET));
  ctx.save();
  ctx.lineWidth = 1;
  for (let x = startX; x <= endX; x += TILE) {
    ctx.strokeStyle = Math.round(x / TILE) % majorEvery === 0
      ? "rgba(255,255,255,0.12)"
      : "rgba(255,255,255,0.07)";
    ctx.beginPath();
    ctx.moveTo(Math.floor(x - cam.x) + 0.5, 0);
    ctx.lineTo(Math.floor(x - cam.x) + 0.5, visibleHeight());
    ctx.stroke();
  }
  for (let y = startY; y <= endY; y += TILE) {
    ctx.strokeStyle = Math.round(y / TILE) % majorEvery === 0
      ? "rgba(255,255,255,0.12)"
      : "rgba(255,255,255,0.07)";
    ctx.beginPath();
    ctx.moveTo(0, Math.floor(y - cam.y) + 0.5);
    ctx.lineTo(visibleWidth(), Math.floor(y - cam.y) + 0.5);
    ctx.stroke();
  }
  ctx.restore();
}

function drawStructure(structure, cam, detail = 2) {
  const sx = structure.x - cam.x;
  const sy = structure.y - cam.y;
  if (detail < 1) {
    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.fillRect(sx + 5, sy + 6, structure.w + 2, structure.h + 2);
    ctx.fillStyle = structure.palette.wall;
    ctx.fillRect(sx, sy, structure.w, structure.h);
    ctx.fillStyle = structure.palette.roof;
    ctx.beginPath();
    ctx.moveTo(sx - 8, sy + 8);
    ctx.lineTo(sx + structure.w / 2, sy - 14);
    ctx.lineTo(sx + structure.w + 8, sy + 8);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#35241a";
    if (structure.doorSide === "north") ctx.fillRect(sx + structure.w * 0.38, sy, 18, 18);
    else if (structure.doorSide === "west") ctx.fillRect(sx, sy + structure.h * 0.38, 18, 18);
    else if (structure.doorSide === "east") ctx.fillRect(sx + structure.w - 18, sy + structure.h * 0.38, 18, 18);
    else ctx.fillRect(sx + structure.w * 0.38, sy + structure.h - 20, 18, 20);
    return;
  }
  const wall = ctx.createLinearGradient(sx, sy, sx, sy + structure.h);
  wall.addColorStop(0, structure.palette.trim);
  wall.addColorStop(0.12, structure.palette.wall);
  wall.addColorStop(1, structure.palette.wall);
  ctx.fillStyle = "rgba(0,0,0,0.28)";
  ctx.fillRect(sx + 8, sy + 10, structure.w + 4, structure.h + 3);
  ctx.fillStyle = wall;
  ctx.fillRect(sx, sy, structure.w, structure.h);
  ctx.strokeStyle = "rgba(48,31,24,0.55)";
  ctx.lineWidth = 2;
  ctx.strokeRect(sx + 1, sy + 1, structure.w - 2, structure.h - 2);

  if (detail > 0) {
    ctx.strokeStyle = "rgba(255,244,203,0.1)";
    ctx.lineWidth = 1;
    for (let y = sy + 13; y < sy + structure.h - 8; y += 13) {
      ctx.beginPath();
      ctx.moveTo(sx + 7, y);
      ctx.lineTo(sx + structure.w - 7, y);
      ctx.stroke();
    }
  }

  const roof = ctx.createLinearGradient(sx, sy - 28, sx, sy + 13);
  roof.addColorStop(0, "#3b2928");
  roof.addColorStop(0.5, structure.palette.roof);
  roof.addColorStop(1, "#2b2020");
  ctx.fillStyle = roof;
  ctx.beginPath();
  ctx.moveTo(sx - 13, sy + 10);
  ctx.lineTo(sx + structure.w / 2, sy - 26);
  ctx.lineTo(sx + structure.w + 13, sy + 10);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(20,14,13,0.6)";
  ctx.lineWidth = 2;
  ctx.stroke();

  if (detail > 0) {
    ctx.strokeStyle = "rgba(255,239,190,0.16)";
    ctx.lineWidth = 1;
    for (let x = sx + 4; x < sx + structure.w; x += 15) {
      ctx.beginPath();
      ctx.moveTo(x, sy + 7);
      ctx.lineTo(sx + structure.w / 2, sy - 23);
      ctx.stroke();
    }
  }

  ctx.fillStyle = structure.palette.trim;
  let doorX = sx + structure.w * 0.42;
  let doorY = sy + structure.h - 30;
  let doorW = 24;
  let doorH = 30;
  if (structure.doorSide === "north") {
    doorY = sy;
    doorH = 24;
  } else if (structure.doorSide === "west") {
    doorX = sx;
    doorY = sy + structure.h * 0.42;
    doorW = 24;
    doorH = 24;
  } else if (structure.doorSide === "east") {
    doorX = sx + structure.w - 24;
    doorY = sy + structure.h * 0.42;
    doorW = 24;
    doorH = 24;
  }
  ctx.fillRect(doorX, doorY, doorW, doorH);
  ctx.fillStyle = "#38261d";
  ctx.fillRect(doorX + 3, doorY + 3, Math.max(12, doorW - 6), Math.max(12, doorH - 3));
  ctx.fillStyle = "#e0b457";
  ctx.beginPath();
  ctx.arc(doorX + doorW - 7, doorY + Math.max(10, doorH / 2), 2, 0, Math.PI * 2);
  ctx.fill();

  function drawWindow(wx, wy) {
    ctx.fillStyle = "#2d4f5e";
    ctx.fillRect(wx, wy, 19, 17);
    ctx.fillStyle = "rgba(255,230,145,0.42)";
    ctx.fillRect(wx + 3, wy + 3, 13, 11);
    ctx.strokeStyle = structure.palette.trim;
    ctx.lineWidth = 2;
    ctx.strokeRect(wx, wy, 19, 17);
    ctx.beginPath();
    ctx.moveTo(wx + 9.5, wy + 1);
    ctx.lineTo(wx + 9.5, wy + 16);
    ctx.moveTo(wx + 1, wy + 8.5);
    ctx.lineTo(wx + 18, wy + 8.5);
    ctx.stroke();
  }
  if (detail > 0) {
    drawWindow(sx + 14, sy + 24);
    if (structure.w > 110) drawWindow(sx + structure.w - 35, sy + 24);
  }
  if (detail > 0 && structure.kind === "Tavern") {
    ctx.fillStyle = "#f1d47a";
    ctx.fillRect(doorX + 7, doorY + 8, 5, 5);
    ctx.strokeStyle = "rgba(241,212,122,0.58)";
    ctx.lineWidth = 2;
    ctx.strokeRect(doorX - 2, doorY - 2, doorW + 4, doorH + 4);
    ctx.fillStyle = "#d7a74d";
    ctx.beginPath();
    ctx.arc(sx + structure.w + 5, sy + 30, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#271d17";
    ctx.font = "800 9px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("INN", sx + structure.w + 5, sy + 33);
  } else if (detail > 0 && structure.kind === "Forge") {
    ctx.fillStyle = "#2f2420";
    ctx.fillRect(sx + structure.w - 22, sy - 18, 10, 26);
    ctx.fillStyle = "rgba(255,211,128,0.42)";
    ctx.fillRect(sx + structure.w - 20, sy - 16, 6, 10);
    ctx.fillStyle = "#ddb879";
    ctx.fillRect(sx - 16, sy + structure.h - 15, 11, 5);
    ctx.fillRect(sx - 12, sy + structure.h - 22, 3, 18);
  } else if (detail > 0 && structure.kind === "Bakery") {
    ctx.fillStyle = "#c98d5c";
    ctx.fillRect(sx + 8, sy + structure.h - 36, structure.w - 16, 7);
    ctx.fillStyle = "rgba(255,241,187,0.35)";
    ctx.fillRect(sx + 10, sy + structure.h - 29, structure.w - 20, 4);
  } else if (detail > 0 && structure.kind === "Shrine") {
    ctx.fillStyle = "#c5d6a4";
    ctx.beginPath();
    ctx.moveTo(sx + structure.w / 2, sy - 10);
    ctx.lineTo(sx + structure.w / 2 - 5, sy + 4);
    ctx.lineTo(sx + structure.w / 2 + 5, sy + 4);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#e9e1b7";
    ctx.beginPath();
    ctx.moveTo(sx + structure.w / 2, sy - 14);
    ctx.lineTo(sx + structure.w / 2, sy - 2);
    ctx.moveTo(sx + structure.w / 2 - 5, sy - 8);
    ctx.lineTo(sx + structure.w / 2 + 5, sy - 8);
    ctx.stroke();
  } else if (detail > 0 && structure.kind === "Stable") {
    ctx.fillStyle = "rgba(94,62,35,0.6)";
    for (let x = sx + 8; x < sx + structure.w - 4; x += 20) {
      ctx.fillRect(x, sy + structure.h - 23, 14, 11);
    }
  } else if (detail > 0 && structure.kind === "Mill") {
    ctx.strokeStyle = "#d8c69d";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(sx + structure.w + 8, sy + 16);
    ctx.lineTo(sx + structure.w + 8, sy + 48);
    ctx.moveTo(sx + structure.w - 6, sy + 32);
    ctx.lineTo(sx + structure.w + 22, sy + 32);
    ctx.stroke();
  } else if (detail > 0 && (structure.kind === "Store" || structure.kind === "Apothecary")) {
    ctx.fillStyle = structure.kind === "Apothecary" ? "#7bb384" : "#8b7dd0";
    ctx.fillRect(sx + 10, sy + structure.h - 36, structure.w - 20, 6);
  }

  if (detail < 2) return;
  ctx.fillStyle = "rgba(0,0,0,0.48)";
  ctx.font = "700 10px system-ui";
  ctx.textAlign = "center";
  ctx.fillText(structure.label || structure.kind, sx + structure.w / 2 + 1, sy + structure.h + 17);
  ctx.fillStyle = "#f7ecd0";
  ctx.fillText(structure.label || structure.kind, sx + structure.w / 2, sy + structure.h + 16);
}

function drawPen(pen, cam, detail = 2) {
  const x = pen.x - cam.x;
  const y = pen.y - cam.y;
  ctx.save();
  ctx.strokeStyle = "#d1b078";
  ctx.lineWidth = 4;
  ctx.strokeRect(x, y, pen.w, pen.h);
  if (detail < 1) {
    ctx.restore();
    return;
  }
  ctx.strokeStyle = "rgba(56,35,22,0.55)";
  ctx.lineWidth = 1;
  for (let px = x + TILE; px < x + pen.w; px += TILE) {
    ctx.beginPath();
    ctx.moveTo(px, y);
    ctx.lineTo(px, y + pen.h);
    ctx.stroke();
  }
  for (let py = y + TILE; py < y + pen.h; py += TILE) {
    ctx.beginPath();
    ctx.moveTo(x, py);
    ctx.lineTo(x + pen.w, py);
    ctx.stroke();
  }
  ctx.restore();
}

function drawNpc(npc, cam, now = performance.now(), detail = actorDetailLevel()) {
  const x = npc.x - cam.x;
  const hash = hashString(npc.id);
  const idle = Math.sin(now / 360 + hash * 0.0001) * 0.9;
  const y = npc.y - cam.y - 6 + idle;
  const ancestry = ancestryVisuals[npc.ancestry] || ancestryVisuals.Human;
  const gender = genderVisuals[npc.gender] || genderVisuals.Nonbinary;
  const look = npc.appearance || makeAppearance(Math.random, npc.ancestry, npc.gender, npc.role);
  const bodyW = 15 * ancestry.width * gender.waist * (look.shoulder || 1);
  const bodyH = 21 * ancestry.height;
  const headR = 8 * Math.max(0.82, ancestry.width) * (look.faceWidth || 1);
  const bodyTop = y + 7 - bodyH * 0.3;
  const headY = bodyTop - headR + 2;
  const shoulderW = bodyW * 0.64;
  const hemW = bodyW * (look.coatFlare || 1);

  ctx.fillStyle = "rgba(0,0,0,0.26)";
  ctx.beginPath();
  ctx.ellipse(x + 1, y + 15, 12 * ancestry.width, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  if (detail === 0) {
    ctx.fillStyle = look.coat;
    ctx.beginPath();
    ctx.ellipse(x, y + 4, 8 * ancestry.width, 11 * ancestry.height, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = look.skin;
    ctx.beginPath();
    ctx.arc(x, y - 7, 5.5 * Math.max(0.8, ancestry.width), 0, Math.PI * 2);
    ctx.fill();
    if (npc === nearestNpc) {
      ctx.strokeStyle = "#f1d47a";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y + 6, 16, 0, Math.PI * 2);
      ctx.stroke();
    }
    return;
  }

  if (npc.ancestry === "Elf" && detail > 1) {
    ctx.fillStyle = look.skin;
    ctx.beginPath();
    ctx.moveTo(x - headR + 2, headY - 1);
    ctx.lineTo(x - headR - 7, headY - 6);
    ctx.lineTo(x - headR + 1, headY + 5);
    ctx.moveTo(x + headR - 2, headY - 1);
    ctx.lineTo(x + headR + 7, headY - 6);
    ctx.lineTo(x + headR - 1, headY + 5);
    ctx.fill();
  }

  if (npc.ancestry === "Tiefling") {
    ctx.strokeStyle = ancestry.accent;
    ctx.lineWidth = detail > 1 ? 3 : 2;
    ctx.beginPath();
    ctx.moveTo(x - 5, headY - headR + 2);
    ctx.lineTo(x - 10, headY - headR - 6);
    ctx.moveTo(x + 5, headY - headR + 2);
    ctx.lineTo(x + 10, headY - headR - 6);
    ctx.stroke();
  }

  const clothing = ctx.createLinearGradient(x, bodyTop, x, bodyTop + bodyH);
  clothing.addColorStop(0, look.trim);
  clothing.addColorStop(0.24, look.coat);
  clothing.addColorStop(1, "#2a2523");
  ctx.fillStyle = clothing;
  ctx.beginPath();
  ctx.moveTo(x - shoulderW - 1, bodyTop + 3);
  ctx.quadraticCurveTo(x, bodyTop - 3, x + shoulderW + 1, bodyTop + 3);
  ctx.lineTo(x + hemW * 0.5, bodyTop + bodyH - 1);
  ctx.lineTo(x - hemW * 0.5, bodyTop + bodyH - 1);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.beginPath();
  ctx.moveTo(x - bodyW * 0.08, bodyTop + 4);
  ctx.lineTo(x + bodyW * 0.06, bodyTop + bodyH - 4);
  ctx.lineTo(x + bodyW * 0.18, bodyTop + bodyH - 4);
  ctx.lineTo(x + bodyW * 0.02, bodyTop + 4);
  ctx.closePath();
  ctx.fill();

  if (look.cloak) {
    ctx.fillStyle = "rgba(18,20,24,0.42)";
    ctx.beginPath();
    ctx.moveTo(x - bodyW / 2 - 2, bodyTop + 4);
    ctx.lineTo(x, bodyTop + bodyH + 7);
    ctx.lineTo(x + bodyW / 2 + 2, bodyTop + 4);
    ctx.closePath();
    ctx.fill();
  }

  ctx.fillStyle = look.skin;
  ctx.fillRect(x - 3, bodyTop - 1, 6, 5);
  ctx.fillStyle = npc.helped ? "#76bf9a" : look.badge;
  ctx.fillRect(x - shoulderW * 0.82, bodyTop + bodyH * 0.47, shoulderW * 1.64, 4);
  ctx.fillStyle = "rgba(255,255,255,0.13)";
  ctx.fillRect(x - shoulderW * 0.86 + 2, bodyTop + 3, 3, bodyH - 7);
  ctx.fillStyle = "#2d2620";
  ctx.fillRect(x - hemW * 0.34, bodyTop + bodyH - 2, 5, 5);
  ctx.fillRect(x + hemW * 0.18, bodyTop + bodyH - 2, 5, 5);

  ctx.strokeStyle = look.skin;
  ctx.lineWidth = detail > 1 ? 3 : 2;
  ctx.beginPath();
  ctx.moveTo(x - shoulderW + 1, bodyTop + 7);
  ctx.lineTo(x - shoulderW - 7 * ancestry.width, bodyTop + 17);
  ctx.moveTo(x + shoulderW - 1, bodyTop + 7);
  ctx.lineTo(x + shoulderW + 7 * ancestry.width, bodyTop + 17);
  ctx.stroke();
  ctx.fillStyle = look.skin;
  ctx.beginPath();
  ctx.arc(x - shoulderW - 7 * ancestry.width, bodyTop + 17, 2.4, 0, Math.PI * 2);
  ctx.arc(x + shoulderW + 7 * ancestry.width, bodyTop + 17, 2.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = look.skin;
  ctx.beginPath();
  ctx.ellipse(x, headY, headR, headR * (look.jaw || 1), 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(124,84,60,0.16)";
  ctx.beginPath();
  ctx.ellipse(x + 1, headY + 2, headR * 0.7, headR * 0.88, -0.2, 0, Math.PI * 2);
  ctx.fill();

  if (look.headwear === "hood") {
    ctx.fillStyle = "#2a2523";
    ctx.beginPath();
    ctx.moveTo(x - headR - 4, headY + 3);
    ctx.quadraticCurveTo(x, headY - headR - 10, x + headR + 4, headY + 3);
    ctx.lineTo(x + shoulderW * 0.72, bodyTop + 12);
    ctx.lineTo(x - shoulderW * 0.72, bodyTop + 12);
    ctx.closePath();
    ctx.fill();
  } else if (look.headwear === "cap") {
    ctx.fillStyle = colorWithAlpha(look.trim, 0.95);
    ctx.beginPath();
    ctx.arc(x, headY - 3, headR + 1.5, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(x - headR * 0.9, headY - 3, headR * 1.8, 4);
  }

  ctx.fillStyle = look.hair;
  if (look.hairStyle === "long") {
    ctx.beginPath();
    ctx.arc(x, headY - 2, headR + 1, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(x - headR, headY - 1, 4, 13 * gender.hair);
    ctx.fillRect(x + headR - 4, headY - 1, 4, 13 * gender.hair);
  } else if (look.hairStyle === "bun") {
    ctx.beginPath();
    ctx.arc(x, headY - 3, headR + 1, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, headY - headR - 4, 4, 0, Math.PI * 2);
    ctx.fill();
  } else if (look.hairStyle === "braid") {
    ctx.beginPath();
    ctx.arc(x, headY - 2, headR + 1, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(x - 2, headY + 3, 4, 12 * gender.hair);
  } else if (look.hairStyle === "part") {
    ctx.beginPath();
    ctx.arc(x, headY - 3, headR + 1, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(x - 1, headY - headR, 2, 7);
  } else if (look.hairStyle === "swept") {
    ctx.beginPath();
    ctx.moveTo(x - headR - 1, headY - 1);
    ctx.quadraticCurveTo(x + 2, headY - headR - 5, x + headR + 2, headY - 1);
    ctx.lineTo(x + headR - 2, headY + 4);
    ctx.lineTo(x - headR + 2, headY + 3);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.arc(x, headY - 4, headR + 0.8, Math.PI, Math.PI * 2);
    ctx.fill();
  }

  if (npc.ancestry === "Dwarf") {
    ctx.fillStyle = look.hair;
    ctx.beginPath();
    ctx.moveTo(x - 7, headY + 5);
    ctx.lineTo(x, headY + 17);
    ctx.lineTo(x + 7, headY + 5);
    ctx.closePath();
    ctx.fill();
  }

  if (npc.ancestry === "Gnome") {
    ctx.fillStyle = look.trim;
    ctx.beginPath();
    ctx.moveTo(x - 8, headY - headR + 1);
    ctx.lineTo(x, headY - headR - 13);
    ctx.lineTo(x + 8, headY - headR + 1);
    ctx.closePath();
    ctx.fill();
  }

  if (npc.ancestry === "Orc-kin" && detail > 1) {
    ctx.fillStyle = "#f3edd7";
    ctx.fillRect(x - 7, headY + 3, 3, 5);
    ctx.fillRect(x + 4, headY + 3, 3, 5);
  }

  if (detail > 1) {
    ctx.strokeStyle = "rgba(90,70,49,0.35)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x - 2, headY + 1);
    ctx.lineTo(x + 1, headY + 4);
    ctx.stroke();
    ctx.fillStyle = look.eyes || "#1d1d1d";
    ctx.fillRect(x - 4, headY - 2, 2, 2);
    ctx.fillRect(x + 3, headY - 2, 2, 2);
    ctx.fillStyle = "rgba(255,255,255,0.16)";
    ctx.beginPath();
    ctx.arc(x - 3, headY - 5, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(80,45,36,0.45)";
    ctx.beginPath();
    ctx.moveTo(x - 3, headY + 6);
    ctx.quadraticCurveTo(x, headY + 8, x + 3, headY + 6);
    ctx.stroke();
    ctx.strokeStyle = "rgba(47,33,26,0.32)";
    ctx.beginPath();
    ctx.moveTo(x - 5, headY - 5);
    ctx.lineTo(x - 1, headY - 4);
    ctx.moveTo(x + 1, headY - 4);
    ctx.lineTo(x + 5, headY - 5);
    ctx.stroke();
    if (look.freckles) {
      ctx.fillStyle = "rgba(140,92,67,0.4)";
      ctx.fillRect(x - 6, headY + 1, 1, 1);
      ctx.fillRect(x - 5, headY + 3, 1, 1);
      ctx.fillRect(x + 4, headY + 2, 1, 1);
      ctx.fillRect(x + 5, headY + 4, 1, 1);
    }
    if (look.weathered) {
      ctx.strokeStyle = "rgba(92,73,58,0.28)";
      ctx.beginPath();
      ctx.moveTo(x - 6, headY + 6);
      ctx.lineTo(x - 3, headY + 7);
      ctx.moveTo(x + 3, headY + 7);
      ctx.lineTo(x + 6, headY + 6);
      ctx.stroke();
    }
  }

  if (look.facialHair === "beard") {
    ctx.fillStyle = look.hair;
    ctx.beginPath();
    ctx.moveTo(x - 7, headY + 3);
    ctx.lineTo(x, headY + 15);
    ctx.lineTo(x + 7, headY + 3);
    ctx.closePath();
    ctx.fill();
  } else if (look.facialHair === "mustache") {
    ctx.fillStyle = look.hair;
    ctx.fillRect(x - 5, headY + 3, 10, 2);
  } else if (look.facialHair === "goatee") {
    ctx.fillStyle = look.hair;
    ctx.beginPath();
    ctx.moveTo(x - 3, headY + 5);
    ctx.lineTo(x, headY + 11);
    ctx.lineTo(x + 3, headY + 5);
    ctx.closePath();
    ctx.fill();
  }

  drawNpcProp(look.prop, x, bodyTop + bodyH * 0.64, look.trim);

  if (npc === nearestNpc) {
    ctx.fillStyle = ancestry.accent;
    ctx.beginPath();
    ctx.arc(x, bodyTop - 9, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#f1d47a";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y + 8, 20, 0, Math.PI * 2);
    ctx.stroke();
  }

  if (npc.speechTimer > 0 && npc.speech) {
    drawSpeechBubble(npc.speech, x, headY - headR - 12);
  }
}

function drawNpcProp(prop, x, y, color) {
  if (!prop) return;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2;
  if (prop === "hammer") {
    ctx.beginPath();
    ctx.moveTo(x + 8, y - 6);
    ctx.lineTo(x + 14, y + 6);
    ctx.stroke();
    ctx.fillRect(x + 9, y - 10, 8, 4);
  } else if (prop === "mug") {
    ctx.fillRect(x + 7, y - 7, 8, 9);
    ctx.strokeRect(x + 14, y - 5, 4, 5);
  } else if (prop === "basket" || prop === "satchel" || prop === "ledger") {
    ctx.fillRect(x + 7, y - 6, 10, 8);
    ctx.strokeRect(x + 9, y - 9, 6, 3);
  } else if (prop === "spear" || prop === "crook" || prop === "rope") {
    ctx.beginPath();
    ctx.moveTo(x + 12, y - 12);
    ctx.lineTo(x + 12, y + 10);
    ctx.stroke();
    if (prop === "crook") {
      ctx.beginPath();
      ctx.arc(x + 12, y - 12, 4, Math.PI * 0.9, Math.PI * 2);
      ctx.stroke();
    }
  } else if (prop === "bow") {
    ctx.beginPath();
    ctx.arc(x + 12, y - 1, 8, Math.PI * 1.45, Math.PI * 0.55, true);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + 8, y - 8);
    ctx.lineTo(x + 16, y + 7);
    ctx.stroke();
  } else if (prop === "lantern") {
    ctx.fillRect(x + 9, y - 4, 7, 9);
    ctx.beginPath();
    ctx.arc(x + 12.5, y - 5, 3.5, Math.PI, Math.PI * 2);
    ctx.stroke();
  } else if (prop === "sack") {
    ctx.beginPath();
    ctx.ellipse(x + 12, y, 6, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawSpeechBubble(text, x, y) {
  ctx.save();
  ctx.font = "700 12px system-ui";
  const maxWidth = Math.min(280, visibleWidth() - 36);
  const width = Math.min(maxWidth, ctx.measureText(text).width + 22);
  const height = 30;
  const bx = clamp(x - width / 2, 12, visibleWidth() - width - 12);
  const by = clamp(y - height, 12, visibleHeight() - height - 12);
  ctx.fillStyle = "rgba(18,18,18,0.88)";
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 1;
  roundedRectPath(bx, by, width, height, 7);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#fff2d6";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, bx + width / 2, by + height / 2, maxWidth - 20);
  ctx.restore();
}

function roundedRectPath(x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawAnimal(animal, cam, detail = actorDetailLevel()) {
  const visual = animalTypes[animal.type] || animalTypes.dog;
  const x = animal.x - cam.x;
  const y = animal.y - cam.y - 4 + Math.sin(animal.bob) * 1.5;
  const scale = visual.size;
  const length = visual.long || 1;
  ctx.fillStyle = "rgba(0,0,0,0.22)";
  ctx.beginPath();
  ctx.ellipse(x + 1, y + 11 * scale, 16 * scale * length, 5 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = visual.body;
  ctx.beginPath();
  ctx.ellipse(x, y, 15 * scale * length, 9 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
  if (detail < 2) {
    ctx.fillStyle = visual.accent;
    ctx.beginPath();
    ctx.arc(x + 11 * scale * length, y - 5 * scale, 7 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(x - 9 * scale, y + 7 * scale, 3 * scale, 9 * scale);
    ctx.fillRect(x + 6 * scale, y + 7 * scale, 3 * scale, 9 * scale);
    return;
  }
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.beginPath();
  ctx.ellipse(x - 5 * scale, y - 5 * scale, 6 * scale, 2.5 * scale, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = visual.accent;
  ctx.fillRect(x - 9 * scale, y + 7 * scale, 3 * scale, 9 * scale);
  ctx.fillRect(x + 6 * scale, y + 7 * scale, 3 * scale, 9 * scale);
  ctx.beginPath();
  ctx.arc(x + 11 * scale * length, y - 5 * scale, 7 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = visual.accent;
  if (animal.type === "chicken") {
    ctx.fillRect(x + 11 * scale, y - 16 * scale, 4 * scale, 5 * scale);
  } else if (animal.type === "goat" || animal.type === "deer") {
    ctx.strokeStyle = visual.accent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 8 * scale, y - 12 * scale);
    ctx.lineTo(x + 3 * scale, y - 20 * scale);
    ctx.moveTo(x + 15 * scale, y - 12 * scale);
    ctx.lineTo(x + 20 * scale, y - 20 * scale);
    ctx.stroke();
  } else if (animal.type === "cat" || animal.type === "dog") {
    ctx.beginPath();
    ctx.moveTo(x + 6 * scale, y - 11 * scale);
    ctx.lineTo(x + 10 * scale, y - 18 * scale);
    ctx.lineTo(x + 13 * scale, y - 10 * scale);
    ctx.fill();
  } else if (animal.type === "raven") {
    ctx.beginPath();
    ctx.moveTo(x + 16 * scale, y - 5 * scale);
    ctx.lineTo(x + 25 * scale, y - 2 * scale);
    ctx.lineTo(x + 16 * scale, y + 1 * scale);
    ctx.fill();
  } else if (animal.type === "cow") {
    ctx.fillRect(x - 8 * scale, y - 5 * scale, 8 * scale, 7 * scale);
    ctx.fillRect(x + 8 * scale, y + 2 * scale, 10 * scale, 5 * scale);
    ctx.strokeStyle = visual.accent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 15 * scale, y - 11 * scale);
    ctx.lineTo(x + 19 * scale, y - 18 * scale);
    ctx.moveTo(x + 8 * scale, y - 10 * scale);
    ctx.lineTo(x + 4 * scale, y - 17 * scale);
    ctx.stroke();
  } else if (animal.type === "horse") {
    ctx.fillRect(x + 12 * scale, y - 16 * scale, 5 * scale, 16 * scale);
    ctx.fillStyle = "#3b2921";
    ctx.fillRect(x - 6 * scale, y - 8 * scale, 16 * scale, 7 * scale);
    ctx.strokeStyle = visual.accent;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - 18 * scale, y - 2 * scale);
    ctx.lineTo(x - 28 * scale, y - 10 * scale);
    ctx.stroke();
  } else if (animal.type === "pig") {
    ctx.beginPath();
    ctx.arc(x + 14 * scale, y - 4 * scale, 5 * scale, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "#181818";
  ctx.fillRect(x + 12 * scale * length, y - 7 * scale, 2, 2);
}

function drawHostile(hostile, cam, now = performance.now(), detail = actorDetailLevel()) {
  const x = hostile.x - cam.x;
  const y = hostile.y - cam.y - 6;
  const bob = Math.sin(now / 220 + hashString(hostile.id) * 0.0002) * 1.2;
  ctx.fillStyle = "rgba(0,0,0,0.28)";
  ctx.beginPath();
  ctx.ellipse(x + 1, y + 18, 15, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  if (detail === 0) {
    ctx.fillStyle = "#6b4c42";
    ctx.beginPath();
    ctx.ellipse(x, y + bob + 4, 10, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    if (hostile === nearbyThreat) {
      ctx.strokeStyle = "#d87058";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y + 8, 18, 0, Math.PI * 2);
      ctx.stroke();
    }
    return;
  }
  ctx.fillStyle = hostile.kind.includes("Wolf") || hostile.kind.includes("Hound") || hostile.kind.includes("Dog")
    ? "#6a5c4b"
    : hostile.kind.includes("Boar")
      ? "#6d4736"
      : "#6b4c42";
  ctx.beginPath();
  ctx.ellipse(x, y + bob, 14, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#2a1a17";
  ctx.beginPath();
  ctx.arc(x + 11, y + bob - 2, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#efe4d0";
  ctx.fillRect(x + 12, y + bob + 2, 2, 4);
  ctx.fillRect(x + 7, y + bob + 2, 2, 4);
  ctx.fillStyle = "#181313";
  ctx.fillRect(x + 12, y + bob - 4, 2, 2);
  if (hostile === nearbyThreat) {
    ctx.strokeStyle = "#d87058";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y + 8, 22, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawQuestObjective(objective, cam) {
  if (objective.completed) return;
  const x = objective.x - cam.x;
  const y = objective.y - cam.y;
  const label = `Q${objective.marker}`;
  ctx.save();
  ctx.fillStyle = "rgba(224,180,87,0.22)";
  ctx.beginPath();
  ctx.arc(x, y, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#e0b457";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, 16 + Math.sin(performance.now() / 240) * 3, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#fff2d6";
  ctx.beginPath();
  ctx.moveTo(x, y - 12);
  ctx.lineTo(x + 9, y);
  ctx.lineTo(x, y + 12);
  ctx.lineTo(x - 9, y);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#202020";
  ctx.font = "800 11px system-ui";
  ctx.textAlign = "center";
  ctx.fillText(label, x, y + 4);
  ctx.font = "800 12px system-ui";
  const title = objective.template.title;
  const width = Math.min(260, ctx.measureText(title).width + 18);
  const bx = clamp(x - width / 2, 10, visibleWidth() - width - 10);
  const by = clamp(y - 48, 10, visibleHeight() - 34);
  ctx.fillStyle = "rgba(18,18,18,0.78)";
  roundedRectPath(bx, by, width, 26, 7);
  ctx.fill();
  ctx.fillStyle = "#fff2d6";
  ctx.fillText(`${label}: ${title}`, bx + width / 2, by + 17, width - 12);
  ctx.restore();
}

function drawTavernInterior(now = performance.now(), actorDetail = actorDetailLevel()) {
  const cam = camera();
  ctx.fillStyle = "#2d241d";
  ctx.fillRect(0, 0, visibleWidth(), visibleHeight());
  const roomX = -cam.x;
  const roomY = -cam.y;
  ctx.fillStyle = "#5d412c";
  ctx.fillRect(roomX, roomY, tavernSize.w * TILE, tavernSize.h * TILE);
  for (let y = 0; y < tavernSize.h; y += 1) {
    for (let x = 0; x < tavernSize.w; x += 1) {
      ctx.fillStyle = (x + y) % 2 === 0 ? "#765438" : "#6d4c32";
      ctx.fillRect(roomX + x * TILE, roomY + y * TILE, TILE, TILE);
    }
  }
  ctx.fillStyle = "#33261f";
  ctx.fillRect(roomX, roomY, tavernSize.w * TILE, TILE);
  ctx.fillRect(roomX, roomY, TILE, tavernSize.h * TILE);
  ctx.fillRect(roomX + (tavernSize.w - 1) * TILE, roomY, TILE, tavernSize.h * TILE);
  ctx.fillRect(roomX, roomY + (tavernSize.h - 1) * TILE, tavernSize.w * TILE, TILE);
  ctx.fillStyle = "#a78355";
  ctx.fillRect(roomX + 7 * TILE, roomY + (tavernSize.h - 1) * TILE, 2 * TILE, TILE);

  ctx.fillStyle = "#4b2f22";
  ctx.fillRect(roomX + 6 * TILE, roomY + 3 * TILE, 5 * TILE, TILE);
  ctx.fillStyle = "#8e6440";
  for (const table of [{ x: 3, y: 5 }, { x: 8, y: 6 }, { x: 12, y: 5 }]) {
    ctx.fillRect(roomX + table.x * TILE, roomY + table.y * TILE, 2 * TILE, 2 * TILE);
    ctx.fillStyle = "#d2b06c";
    ctx.fillRect(roomX + table.x * TILE + 10, roomY + table.y * TILE + 12, 10, 10);
    ctx.fillStyle = "#8e6440";
  }

  drawGrid(cam);
  drawNpc(tavernkeeper, cam, now, actorDetail);
  for (const patron of tavernPatrons) drawNpc(patron, cam, now, actorDetail);
  drawPlayer(cam);
}

function drawDungeonChest(chest, cam) {
  const x = chest.x - cam.x;
  const y = chest.y - cam.y;
  ctx.fillStyle = "rgba(0,0,0,0.26)";
  ctx.beginPath();
  ctx.ellipse(x, y + 14, 14, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = chest.opened ? "#5f4a2e" : "#8a6537";
  ctx.fillRect(x - 13, y - 6, 26, 18);
  ctx.fillStyle = chest.opened ? "#74583a" : "#b68a49";
  ctx.fillRect(x - 13, y - 12, 26, 8);
  ctx.strokeStyle = "#352619";
  ctx.lineWidth = 2;
  ctx.strokeRect(x - 13, y - 6, 26, 18);
  ctx.strokeRect(x - 13, y - 12, 26, 8);
  ctx.fillStyle = "#e0b457";
  ctx.fillRect(x - 2, y - 2, 4, 6);
}

function drawDungeonSite(cam) {
  if (!dungeonSite) return;
  const x = dungeonSite.x - cam.x;
  const y = dungeonSite.y - cam.y;
  ctx.fillStyle = "rgba(0,0,0,0.26)";
  ctx.beginPath();
  ctx.ellipse(x, y + 16, 18, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#554a42";
  ctx.fillRect(x - 16, y - 18, 8, 30);
  ctx.fillRect(x + 8, y - 18, 8, 30);
  ctx.fillRect(x - 16, y - 18, 32, 8);
  ctx.strokeStyle = "#342c27";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y - 2, 14, Math.PI, 0);
  ctx.stroke();
  ctx.fillStyle = "rgba(120,184,223,0.22)";
  ctx.beginPath();
  ctx.arc(x, y + 1, 10, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = "#f7ecd0";
  ctx.font = "700 11px system-ui";
  ctx.textAlign = "center";
  ctx.fillText(dungeonSite.name, x, y - 24);
}

function drawDungeonInterior() {
  const cam = camera();
  const now = performance.now();
  const hostileDetail = actorDetailLevel();
  ctx.fillStyle = "#12100f";
  ctx.fillRect(0, 0, visibleWidth(), visibleHeight());
  if (!dungeonState) return;
  for (let ty = 0; ty < dungeonState.size.h; ty += 1) {
    for (let tx = 0; tx < dungeonState.size.w; tx += 1) {
      const tile = dungeonState.tiles[ty][tx];
      const sx = tx * TILE - cam.x;
      const sy = ty * TILE - cam.y;
      const grain = hashString(`dungeon:${tx}:${ty}`);
      if (tile === "wall") {
        ctx.fillStyle = "#2d2826";
        ctx.fillRect(sx, sy, TILE, TILE);
        ctx.fillStyle = "#3d3531";
        ctx.fillRect(sx + 2, sy + 2, TILE - 4, 10);
        ctx.fillStyle = "#221d1b";
        ctx.fillRect(sx + 3, sy + 14, TILE - 6, TILE - 17);
        ctx.strokeStyle = "rgba(255,255,255,0.06)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(sx + 10, sy + 3);
        ctx.lineTo(sx + 10, sy + TILE - 4);
        ctx.moveTo(sx + 23, sy + 3);
        ctx.lineTo(sx + 23, sy + TILE - 4);
        ctx.stroke();
      } else {
        ctx.fillStyle = tile === "rubble" ? "#403934" : "#35302d";
        ctx.fillRect(sx, sy, TILE, TILE);
        ctx.fillStyle = "rgba(255,255,255,0.04)";
        ctx.fillRect(sx, sy, TILE, 3);
        ctx.strokeStyle = "rgba(0,0,0,0.18)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(sx + 6, sy + 10 + (grain % 4));
        ctx.lineTo(sx + 22, sy + 7);
        ctx.lineTo(sx + 32, sy + 18);
        ctx.stroke();
        if (tile === "rubble") {
          ctx.fillStyle = "#70675f";
          ctx.beginPath();
          ctx.arc(sx + 12, sy + 23, 4, 0, Math.PI * 2);
          ctx.arc(sx + 22, sy + 17, 3, 0, Math.PI * 2);
          ctx.arc(sx + 28, sy + 25, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  ctx.fillStyle = "#8aa9bd";
  ctx.fillRect(dungeonState.entrance.x - cam.x - 12, dungeonState.entrance.y - cam.y - 5, 24, 10);
  ctx.strokeStyle = "rgba(255,255,255,0.24)";
  ctx.strokeRect(dungeonState.entrance.x - cam.x - 12, dungeonState.entrance.y - cam.y - 5, 24, 10);
  for (const brazier of dungeonState.braziers) {
    const bx = brazier.x - cam.x;
    const by = brazier.y - cam.y;
    const glow = ctx.createRadialGradient(bx, by, 2, bx, by, 18);
    glow.addColorStop(0, "rgba(240,181,87,0.5)");
    glow.addColorStop(1, "rgba(240,181,87,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(bx, by, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#d28046";
    ctx.fillRect(bx - 3, by - 8, 6, 10);
  }
  drawDungeonChest(dungeonState.chest, cam);
  for (const hostile of dungeonState.hostiles) {
    if (!hostile.defeated) drawHostile(hostile, cam, now, hostileDetail);
  }
  drawPlayer(cam);
}

function drawPlayer(cam) {
  const x = player.x - cam.x;
  const y = player.y - cam.y - 8;
  const frame = player.moving ? Math.floor(player.walkClock / 0.08) % 2 : 0;
  const stride = player.moving ? (frame === 0 ? -3 : 3) : 0;
  const facing = player.facing;

  ctx.fillStyle = "rgba(0,0,0,0.32)";
  ctx.beginPath();
  ctx.ellipse(x + 1, y + 18, 15, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  const tunic = ctx.createLinearGradient(x, y, x, y + 27);
  tunic.addColorStop(0, "#78a4bd");
  tunic.addColorStop(0.45, "#4f7894");
  tunic.addColorStop(1, "#2d465c");
  ctx.fillStyle = tunic;
  ctx.fillRect(x - 9, y + 1, 18, 21);
  ctx.fillStyle = "rgba(255,255,255,0.16)";
  ctx.fillRect(x - 6, y + 4, 3, 15);
  ctx.fillStyle = "#2d2520";
  ctx.fillRect(x - 7, y + 20, 5, 7 + Math.max(0, stride * 0.45));
  ctx.fillRect(x + 2, y + 20, 5, 7 + Math.max(0, -stride * 0.45));
  ctx.fillStyle = "#151515";
  ctx.fillRect(x - 8, y + 26 + Math.max(0, stride * 0.45), 7, 3);
  ctx.fillRect(x + 1, y + 26 + Math.max(0, -stride * 0.45), 7, 3);

  ctx.strokeStyle = "#d2ad76";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x - 9, y + 8 + stride * 0.2);
  ctx.lineTo(x - 15, y + 17 - stride * 0.15);
  ctx.moveTo(x + 9, y + 8 - stride * 0.2);
  ctx.lineTo(x + 15, y + 17 + stride * 0.15);
  ctx.stroke();

  ctx.fillStyle = "#ddbd83";
  ctx.beginPath();
  ctx.arc(x, y - 8, 9.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#3a2c26";
  if (facing === "up") {
    ctx.beginPath();
    ctx.arc(x, y - 10, 10, Math.PI, Math.PI * 2);
    ctx.fill();
  } else if (facing === "left") {
    ctx.fillRect(x - 10, y - 16, 7, 14);
  } else if (facing === "right") {
    ctx.fillRect(x + 3, y - 16, 7, 14);
  } else {
    ctx.fillRect(x - 8, y - 17, 16, 6);
  }

  ctx.fillStyle = "#202020";
  if (facing === "down") {
    ctx.fillRect(x - 4, y - 9, 2, 2);
    ctx.fillRect(x + 4, y - 9, 2, 2);
    ctx.strokeStyle = "rgba(80,45,36,0.5)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x - 3, y - 3);
    ctx.quadraticCurveTo(x, y, x + 3, y - 3);
    ctx.stroke();
  } else if (facing === "left") {
    ctx.fillRect(x - 6, y - 9, 2, 2);
  } else if (facing === "right") {
    ctx.fillRect(x + 5, y - 9, 2, 2);
  }

  ctx.strokeStyle = "#ead8b4";
  ctx.lineWidth = 4;
  ctx.beginPath();
  if (facing === "left") {
    ctx.moveTo(x - 10, y + 8 + stride * 0.4);
    ctx.lineTo(x - 23, y - 1 + stride * 0.4);
  } else if (facing === "right") {
    ctx.moveTo(x + 10, y + 8 + stride * 0.4);
    ctx.lineTo(x + 23, y - 1 + stride * 0.4);
  } else if (facing === "up") {
    ctx.moveTo(x + 9, y + 8 + stride * 0.4);
    ctx.lineTo(x + 17, y - 4 + stride * 0.4);
  } else {
    ctx.moveTo(x + 10, y + 8 + stride * 0.4);
    ctx.lineTo(x + 22, y - 2 + stride * 0.4);
  }
  ctx.stroke();
  ctx.fillStyle = "#c9a25f";
  ctx.beginPath();
  ctx.arc(x + 11, y + 6, 5, 0, Math.PI * 2);
  ctx.fill();
}

function render() {
  const pixelScale = window.devicePixelRatio || 1;
  const now = performance.now();
  const structureDetail = terrainDetailLevel();
  const actorDetail = actorDetailLevel();
  if (gameMode === "tavern") {
    ctx.setTransform(pixelScale, 0, 0, pixelScale, 0, 0);
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.save();
    ctx.scale(cameraZoom, cameraZoom);
    drawTavernInterior(now, actorDetail);
    ctx.restore();
    return;
  }
  if (gameMode === "dungeon") {
    ctx.setTransform(pixelScale, 0, 0, pixelScale, 0, 0);
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.save();
    ctx.scale(cameraZoom, cameraZoom);
    drawDungeonInterior();
    ctx.restore();
    return;
  }

  const cam = camera();
  ctx.setTransform(pixelScale, 0, 0, pixelScale, 0, 0);
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctx.save();
  ctx.scale(cameraZoom, cameraZoom);

  for (const key of visibleChunkKeys) {
    const chunk = chunks.get(key);
    if (chunk && chunkIsVisible(chunk, cam)) drawTerrain(chunk, cam, structureDetail);
  }
  drawGrid(cam);

  for (const key of visibleChunkKeys) {
    const chunk = chunks.get(key);
    if (!chunk || !chunkIsVisible(chunk, cam)) continue;
    for (const structure of chunk.structures) drawStructure(structure, cam, structureDetail);
    for (const pen of chunk.pens || []) drawPen(pen, cam, structureDetail);
  }

  const npcsToDraw = [];
  for (const key of visibleChunkKeys) {
    const chunk = chunks.get(key);
    if (!chunk || !chunkIsVisible(chunk, cam)) continue;
    for (const npc of chunk.npcs) {
      if (actorOnScreen(npc, cam)) npcsToDraw.push(npc);
    }
  }
  npcsToDraw.sort((a, b) => a.y - b.y);
  for (const npc of npcsToDraw) drawNpc(npc, cam, now, actorDetail);
  if (actorDetail > 0) {
    const animalsToDraw = [];
    for (const key of visibleChunkKeys) {
      const chunk = chunks.get(key);
      if (!chunk || !chunkIsVisible(chunk, cam)) continue;
      for (const animal of chunk.animals || []) {
        if (actorOnScreen(animal, cam, TILE)) animalsToDraw.push(animal);
      }
    }
    animalsToDraw.sort((a, b) => a.y - b.y);
    for (const animal of animalsToDraw) drawAnimal(animal, cam, actorDetail);
  }
  const hostilesToDraw = [];
  for (const key of visibleChunkKeys) {
    const chunk = chunks.get(key);
    if (!chunk || !chunkIsVisible(chunk, cam)) continue;
    for (const hostile of chunk.hostiles || []) {
      if (!hostile.defeated && actorOnScreen(hostile, cam)) hostilesToDraw.push(hostile);
    }
  }
  hostilesToDraw.sort((a, b) => a.y - b.y);
  for (const hostile of hostilesToDraw) drawHostile(hostile, cam, now, actorDetail);
  for (const objective of activeQuests) drawQuestObjective(objective, cam);
  drawDungeonSite(cam);
  drawPlayer(cam);
  ctx.restore();
}

function chunkIsVisible(chunk, cam) {
  const left = chunk.cx * CHUNK_SIZE;
  const top = chunk.cy * CHUNK_SIZE;
  return left < cam.x + visibleWidth() + TILE
    && left + CHUNK_SIZE > cam.x - TILE
    && top < cam.y + visibleHeight() + TILE
    && top + CHUNK_SIZE > cam.y - TILE;
}

function getAreaName(cx, cy) {
  return getAreaProfile(cx, cy).name;
}

function checkArea() {
  const cx = worldToChunk(player.x);
  const cy = worldToChunk(player.y);
  const id = chunkKey(cx, cy);
  if (id !== currentChunkId) {
    currentChunkId = id;
    const name = getAreaName(cx, cy);
    ui.areaName.textContent = name;
    ui.regionName.textContent = getAreaProfile(cx, cy).region;
    logEvent("Area", name);
  }
}

function getTavernDoor() {
  const tavern = worldModel?.buildings?.find((building) => building.id === "tavern");
  if (tavern) return { x: tavern.entryX, y: tavern.entryY };
  return { x: -0.5 * TILE, y: -2 * TILE };
}

function isNearTavernDoor() {
  if (gameMode !== "world") return false;
  const door = getTavernDoor();
  return Math.hypot(player.x - door.x, player.y - door.y) < TILE * 1.25;
}

function isNearTavernExit() {
  if (gameMode !== "tavern") return false;
  return Math.hypot(player.x - 8.5 * TILE, player.y - 10.5 * TILE) < TILE * 1.1;
}

function isNearDungeonEntrance() {
  if (gameMode !== "world" || !dungeonSite) return false;
  return Math.hypot(player.x - dungeonSite.x, player.y - dungeonSite.y) < TILE * 1.2;
}

function isNearDungeonExit() {
  if (gameMode !== "dungeon" || !dungeonState) return false;
  return Math.hypot(player.x - dungeonState.entrance.x, player.y - dungeonState.entrance.y) < TILE * 1.15;
}

function nearestDungeonChest() {
  if (gameMode !== "dungeon" || !dungeonState || dungeonState.chest.opened) return null;
  if (dungeonState.hostiles.some((hostile) => !hostile.defeated)) return null;
  return Math.hypot(player.x - dungeonState.chest.x, player.y - dungeonState.chest.y) < TILE * 1.15 ? dungeonState.chest : null;
}

function nearestDungeonHostile() {
  if (gameMode !== "dungeon" || !dungeonState) return null;
  let closest = null;
  let distance = TILE * 1.8;
  for (const hostile of dungeonState.hostiles) {
    if (hostile.defeated) continue;
    const nextDistance = Math.hypot(hostile.x - player.x, hostile.y - player.y);
    if (nextDistance < distance) {
      distance = nextDistance;
      closest = hostile;
    }
  }
  return closest;
}

function enterDungeon() {
  if (!dungeonState) return;
  worldReturnPosition = { x: player.x, y: player.y };
  gameMode = "dungeon";
  combatState = null;
  closeNpc();
  closeQuestPanel();
  closeCombat();
  player.x = dungeonState.entrance.x;
  player.y = dungeonState.entrance.y;
  player.fromX = player.x;
  player.fromY = player.y;
  player.targetX = player.x;
  player.targetY = player.y;
  player.moving = false;
  player.facing = "up";
  ui.regionName.textContent = dungeonState.name;
  ui.areaName.textContent = "Entry Vault";
  updateHud();
  logEvent("Dungeon", `You descend into ${dungeonState.name}.`);
}

function leaveDungeon() {
  gameMode = "world";
  player.x = worldReturnPosition.x;
  player.y = worldReturnPosition.y;
  player.fromX = player.x;
  player.fromY = player.y;
  player.targetX = player.x;
  player.targetY = player.y;
  player.moving = false;
  player.facing = "down";
  currentChunkId = "";
  preloadChunks();
  checkArea();
  updateHud();
  logEvent("Dungeon", `You climb back out of ${dungeonState?.name || "the depths"}.`);
}

function openDungeonChest() {
  const chest = nearestDungeonChest();
  if (!chest) return;
  chest.opened = true;
  player.gold += chest.gold;
  const lootNames = [];
  for (const item of chest.loot) {
    player.inventory.push(item);
    lootNames.push(item.name);
  }
  updateHud();
  const lootText = lootNames.length > 0 ? `${chest.gold} gold, ${lootNames.join(", ")}` : `${chest.gold} gold`;
  showPrompt(`Chest opened: ${lootText}.`);
  logEvent("Loot", `${dungeonState.name}: ${lootText}.`);
}

function nearestQuestObjective() {
  if (gameMode !== "world") return null;
  let closest = null;
  let distance = TILE * 1.4;
  for (const objective of activeQuests) {
    if (objective.completed) continue;
    const nextDistance = Math.hypot(objective.x - player.x, objective.y - player.y);
    if (nextDistance < distance) {
      distance = nextDistance;
      closest = objective;
    }
  }
  return closest;
}

function nearestTavernActor() {
  let closest = null;
  let distance = TILE * 1.35;
  for (const actor of [tavernkeeper, ...tavernPatrons]) {
    const nextDistance = Math.hypot(actor.x - player.x, actor.y - player.y);
    if (nextDistance < distance) {
      distance = nextDistance;
      closest = actor;
    }
  }
  return closest;
}

function nearestHostile() {
  if (gameMode !== "world") return null;
  let closest = null;
  let distance = TILE * 1.8;
  const pcx = worldToChunk(player.x);
  const pcy = worldToChunk(player.y);
  for (const key of visibleChunkKeys) {
    const chunk = chunks.get(key);
    if (!chunk) continue;
    if (Math.abs(chunk.cx - pcx) > 1 || Math.abs(chunk.cy - pcy) > 1) continue;
    for (const hostile of chunk.hostiles || []) {
      if (hostile.defeated) continue;
      const nextDistance = Math.hypot(hostile.x - player.x, hostile.y - player.y);
      if (nextDistance < distance) {
        distance = nextDistance;
        closest = hostile;
      }
    }
  }
  return closest;
}

function updateNearestNpc() {
  if (combatState) {
    nearestNpc = null;
    currentObjective = null;
    nearbyThreat = combatState.enemy;
    hidePrompt();
    return;
  }
  if (gameMode === "dungeon") {
    nearestNpc = null;
    currentObjective = null;
    nearbyThreat = nearestDungeonHostile();
    if (nearbyThreat) {
      showPrompt(`Attack: engage ${nearbyThreat.kind}`);
    } else if (nearestDungeonChest()) {
      showPrompt("Space: open chest");
    } else if (isNearDungeonExit()) {
      showPrompt("Space: leave dungeon");
    } else {
      hidePrompt();
    }
    return;
  }
  currentObjective = nearestQuestObjective();
  nearbyThreat = nearestHostile();
  if (gameMode === "tavern") {
    nearestNpc = nearestTavernActor();
    if (nearestNpc === tavernkeeper && !activeNpc) {
      showPrompt("Space: ask Mara Hearth about work");
    } else if (nearestNpc && !activeNpc) {
      showPrompt(`Space: ${nearestNpc.name}`);
    } else if (isNearTavernExit()) {
      showPrompt("Space: leave tavern");
    } else if (!activeNpc) {
      hidePrompt();
    }
    return;
  }

  nearestNpc = null;
  let nearestDistance = 66;
  const pcx = worldToChunk(player.x);
  const pcy = worldToChunk(player.y);
  for (const key of visibleChunkKeys) {
    const chunk = chunks.get(key);
    if (!chunk) continue;
    if (Math.abs(chunk.cx - pcx) > 1 || Math.abs(chunk.cy - pcy) > 1) continue;
    for (const npc of chunk.npcs) {
      const distance = Math.hypot(npc.x - player.x, npc.y - player.y);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestNpc = npc;
      }
    }
  }

  if (nearbyThreat && !activeNpc && !combatState) {
    showPrompt(`Attack: engage ${nearbyThreat.kind}`);
  } else if (currentObjective && !activeNpc) {
    showPrompt(`Space: ${currentObjective.template.objective}`);
  } else if (isNearDungeonEntrance() && !activeNpc) {
    showPrompt(`Space: enter ${dungeonSite.name}`);
  } else if (isNearTavernDoor() && !activeNpc) {
    showPrompt("Space: enter Hearth & Harrow");
  } else if (nearestNpc && !activeNpc) {
    showPrompt(`Space: ${nearestNpc.name}, ${nearestNpc.ancestry} ${nearestNpc.role}`);
  } else if (!activeNpc) {
    hidePrompt();
  }
}

function updateNpcSpeech(delta) {
  if (tavernkeeper.speechTimer > 0) tavernkeeper.speechTimer = Math.max(0, tavernkeeper.speechTimer - delta);
  for (const patron of tavernPatrons) {
    if (patron.speechTimer > 0) patron.speechTimer = Math.max(0, patron.speechTimer - delta);
  }
  if (gameMode === "dungeon") return;
  for (const key of visibleChunkKeys) {
    const chunk = chunks.get(key);
    if (!chunk) continue;
    for (const npc of chunk.npcs) {
      if (npc.speechTimer > 0) {
        npc.speechTimer = Math.max(0, npc.speechTimer - delta);
      }
    }
    for (const animal of chunk.animals || []) {
      animal.bob += delta * 5;
      if (animal.speechTimer > 0) animal.speechTimer = Math.max(0, animal.speechTimer - delta);
    }
  }
}

function updateActorWander(actor, delta, speed, options = {}) {
  if (!actor.wander || actor.inCombat) return;
  if (actor.moving) {
    actor.moveProgress = Math.min(1, actor.moveProgress + delta / speed);
    actor.x = actor.fromX + (actor.targetX - actor.fromX) * actor.moveProgress;
    actor.y = actor.fromY + (actor.targetY - actor.fromY) * actor.moveProgress;
    if (actor.moveProgress >= 1) {
      actor.x = actor.targetX;
      actor.y = actor.targetY;
      actor.moving = false;
      actor.wait = 1 + Math.random() * 4;
    }
    return;
  }
  actor.wait -= delta;
  if (actor.wait > 0) return;
  const direction = randomChoice(Math.random, ["up", "down", "left", "right"]);
  const vector = directionVectors[direction];
  const nextX = snapToTileCenter(actor.x) + vector.x * TILE;
  const nextY = snapToTileCenter(actor.y) + vector.y * TILE;
  actor.facing = direction;
  if (actor.pen) {
    const insidePen = nextX > actor.pen.x + TILE * 0.5
      && nextX < actor.pen.x + actor.pen.w - TILE * 0.5
      && nextY > actor.pen.y + TILE * 0.5
      && nextY < actor.pen.y + actor.pen.h - TILE * 0.5;
    if (!insidePen) {
      actor.wait = 0.7 + Math.random() * 2.4;
      return;
    }
  }
  if (actor.anchorX !== undefined && actor.anchorY !== undefined && options.anchorRadius) {
    if (Math.hypot(nextX - actor.anchorX, nextY - actor.anchorY) > options.anchorRadius) {
      actor.wait = 0.7 + Math.random() * 2.4;
      return;
    }
  }
  if (!isBlocked(nextX, nextY, { ignore: actor, ignoreNpcs: options.ignoreNpcs, ignoreAnimals: options.ignoreAnimals })) {
    actor.fromX = snapToTileCenter(actor.x);
    actor.fromY = snapToTileCenter(actor.y);
    actor.targetX = nextX;
    actor.targetY = nextY;
    actor.moveProgress = 0;
    actor.moving = true;
  } else {
    actor.wait = 0.7 + Math.random() * 2.4;
  }
}

function updateWorldMovement(delta) {
  const detail = actorDetailLevel();
  const step = detail === 0 ? 0.12 : detail === 1 ? 0.06 : 0;
  if (step > 0) {
    worldMovementTick += delta;
    if (worldMovementTick < step) return;
    delta = worldMovementTick;
    worldMovementTick = 0;
  } else {
    worldMovementTick = 0;
  }
  if (gameMode === "tavern") {
    for (const patron of tavernPatrons) updateActorWander(patron, delta, 0.42, { ignoreAnimals: true, anchorRadius: TILE * 3 });
    return;
  }
  if (gameMode === "dungeon") return;
  const pcx = worldToChunk(player.x);
  const pcy = worldToChunk(player.y);
  for (const key of visibleChunkKeys) {
    const chunk = chunks.get(key);
    if (!chunk) continue;
    if (Math.abs(chunk.cx - pcx) > 2 || Math.abs(chunk.cy - pcy) > 2) continue;
    for (const npc of chunk.npcs) updateActorWander(npc, delta, 0.42, { ignoreAnimals: true, anchorRadius: TILE * 3 });
    for (const animal of chunk.animals || []) updateActorWander(animal, delta, 0.32, { ignoreNpcs: true, anchorRadius: animal.pen ? TILE * 99 : TILE * 2.5 });
    for (const hostile of chunk.hostiles || []) updateActorWander(hostile, delta, 0.38, { ignoreNpcs: true, ignoreAnimals: true, anchorRadius: TILE * 4 });
  }
}

function showPrompt(text) {
  ui.prompt.textContent = text;
  ui.prompt.classList.remove("hidden");
  promptTimer = 0.2;
}

function hidePrompt() {
  ui.prompt.classList.add("hidden");
}

function openNpc(npc) {
  if (!npc.hasFullDialogue) {
    quickSpeak(npc);
    return;
  }
  activeNpc = npc;
  ui.npcRole.textContent = npc.role;
  ui.npcName.textContent = npc.name;
  ui.npcAncestry.textContent = npc.ancestry;
  ui.npcGender.textContent = npc.gender;
  ui.npcDc.textContent = npc.dc;
  ui.npcMood.textContent = npc.mood;
  ui.npcHome.textContent = npc.homeName || "Waymark Vale";
  ui.npcWork.textContent = npc.workName || npc.role;
  ui.npcTrust.textContent = `${npc.trust || 0}`;
  ui.npcText.textContent = npc.talked
    ? `${npc.name} watches the road and waits to see what you make of the trouble around ${npc.hook}.`
    : `${npc.name} sizes you up with a ${npc.mood.toLowerCase()} look. Word around here circles back to ${npc.hook}.`;
  renderNpcServicePanel(npc);
  ui.npcPanel.classList.remove("hidden");
}

function closeNpc() {
  activeNpc = null;
  ui.npcServicePanel.innerHTML = "";
  ui.npcPanel.classList.add("hidden");
}

function renderNpcServicePanel(npc) {
  ui.npcServicePanel.innerHTML = "";
  const serviceTags = npc.serviceTags || [];
  if (serviceTags.length < 1 && (!npc.goods || npc.goods.length < 1)) return;
  if (npc.goods && npc.goods.length > 0) {
    for (const item of npc.goods) {
      const card = document.createElement("article");
      card.className = "service-card";
      const info = document.createElement("div");
      const title = document.createElement("h3");
      title.textContent = `${item.name} (${item.price}g)`;
      const text = document.createElement("p");
      text.textContent = item.text;
      info.append(title, text);
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = "Buy";
      button.addEventListener("click", () => buyNpcItem(npc, item));
      card.append(info, button);
      ui.npcServicePanel.append(card);
    }
  } else {
    const card = document.createElement("article");
    card.className = "service-card";
    const info = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = serviceTags.join(", ");
    const text = document.createElement("p");
    text.textContent = `${npc.name} can help with ${serviceTags.join(", ").toLowerCase()}.`;
    info.append(title, text);
    card.append(info);
    ui.npcServicePanel.append(card);
  }
}

function logEvent(label, text) {
  const item = document.createElement("li");
  item.innerHTML = `<span>${label}</span> ${text}`;
  ui.eventLog.prepend(item);
  while (ui.eventLog.children.length > 9) {
    ui.eventLog.lastChild.remove();
  }
}

function updateHud() {
  syncPlayerDerived();
  const dungeonNearby = dungeonSite && gameMode === "world" && Math.hypot(dungeonSite.x - player.x, dungeonSite.y - player.y) < TILE * 6;
  ui.heroName.textContent = player.name;
  ui.heroClass.textContent = player.className;
  ui.heroLevel.textContent = player.level;
  ui.proficiencyBonus.textContent = `+${player.proficiencyBonus}`;
  ui.heroSpeed.textContent = player.speed;
  ui.hpNow.textContent = player.hp;
  ui.hpMax.textContent = player.maxHp;
  ui.healthFill.style.width = `${(player.hp / player.maxHp) * 100}%`;
  ui.armorClass.textContent = player.ac;
  ui.gold.textContent = player.gold;
  ui.xp.textContent = player.xp;
  ui.xpNext.textContent = player.level < xpThresholds.length - 1 ? nextLevelXp(player.level) : "Max";
  ui.timeOfDay.textContent = worldTimeLabel();
  ui.localThreat.textContent = nearbyThreat
    ? nearbyThreat.kind
    : gameMode === "dungeon"
      ? "Delve"
      : dungeonNearby
        ? "Watching"
        : "Low";

  for (const [key, value] of Object.entries(player.stats)) {
    const title = key[0].toUpperCase() + key.slice(1);
    ui[`stat${title}`].textContent = value;
    ui[`mod${title}`].textContent = mod(value);
  }
  if (inventoryVisible) renderKitPanel();
  updateSettlementPanel();
  updateNearbyList();
  updateCombatPanel();
}

function itemActionLabel(item) {
  if (item.type === "consumable") return "Use";
  if (item.slot) return "Equip";
  return "";
}

function itemMetaText(item) {
  const pieces = [];
  if (item.damage) pieces.push(`${item.damage[0]}d${item.damage[1]}${modText(item.damage[2] || 0)}`);
  if (item.armorBase) pieces.push(`AC ${item.armorBase}${item.dexCap < 10 ? ` + Dex (${item.dexCap})` : ""}`);
  if (item.acBonus) pieces.push(`AC +${item.acBonus}`);
  if (item.skillBonus) pieces.push(`${item.skillBonus.tag} +${item.skillBonus.amount}`);
  if (item.weight !== undefined) pieces.push(`${item.weight} wt`);
  return pieces.join(" | ");
}

function renderKitPanel() {
  if (!ui.equipmentGrid || !ui.inventoryList) return;
  ui.carryWeight.textContent = totalCarryWeight().toFixed(1);
  ui.carryValue.textContent = totalInventoryValue();
  ui.potionCount.textContent = countInventoryItems("healing_potion");

  ui.equipmentGrid.innerHTML = "";
  for (const [slot, label] of equipmentSlots) {
    const item = getEquippedItem(slot);
    const card = document.createElement("article");
    card.className = "equipment-card";
    const header = document.createElement("header");
    const title = document.createElement("h3");
    title.textContent = label;
    const tag = document.createElement("span");
    tag.className = "slot-tag";
    tag.textContent = item ? item.name : "Empty";
    header.append(title, tag);
    const text = document.createElement("p");
    text.textContent = item ? `${item.summary} ${itemMetaText(item)}` : "Nothing equipped in this slot.";
    card.append(header, text);
    if (item) {
      const actions = document.createElement("div");
      actions.className = "equipment-actions";
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = "Stow";
      button.addEventListener("click", () => unequipSlot(slot));
      actions.append(button);
      card.append(actions);
    }
    ui.equipmentGrid.append(card);
  }

  ui.inventoryList.innerHTML = "";
  const sorted = [...player.inventory].sort((a, b) => {
    if ((a.slot || "") === (b.slot || "")) return a.name.localeCompare(b.name);
    return (a.slot || a.type).localeCompare(b.slot || b.type);
  });
  for (const item of sorted) {
    const card = document.createElement("article");
    card.className = "inventory-card";
    const header = document.createElement("header");
    const title = document.createElement("h3");
    title.textContent = item.name;
    const tag = document.createElement("span");
    tag.className = "item-tag";
    tag.textContent = item.slot || item.type;
    header.append(title, tag);
    const text = document.createElement("p");
    text.textContent = item.summary;
    const meta = document.createElement("div");
    meta.className = "inventory-meta";
    meta.textContent = itemMetaText(item) || `${item.value} g`;
    card.append(header, text, meta);
    const actions = document.createElement("div");
    actions.className = "inventory-actions";
    if (item.slot && player.equipment[item.slot] !== item.uid) {
      const equipButton = document.createElement("button");
      equipButton.type = "button";
      equipButton.textContent = "Equip";
      equipButton.addEventListener("click", () => equipInventoryItem(item.uid));
      actions.append(equipButton);
    }
    if (item.type === "consumable") {
      const useButton = document.createElement("button");
      useButton.type = "button";
      useButton.textContent = "Use";
      useButton.addEventListener("click", () => useInventoryItem(item.uid));
      actions.append(useButton);
    }
    if (actions.children.length > 0) card.append(actions);
    ui.inventoryList.append(card);
  }
}

function updateSettlementPanel() {
  if (gameMode === "dungeon" && dungeonState) {
    const activeHostiles = dungeonState.hostiles.filter((hostile) => !hostile.defeated).length;
    ui.settlementName.textContent = dungeonState.name;
    ui.settlementMood.textContent = activeHostiles > 0 ? "Occupied" : "Cleared";
    ui.populationCount.textContent = activeHostiles;
    ui.homeCount.textContent = 0;
    ui.worksiteCount.textContent = 1;
    ui.prosperityScore.textContent = dungeonState.chest.opened ? 0 : dungeonState.chest.gold;
    ui.serviceList.innerHTML = "";
    for (const service of [
      "Old Wards",
      dungeonState.chest.opened ? "Chest Opened" : "Sealed Chest",
      activeHostiles > 0 ? "Enemy Active" : "Enemy Cleared",
      "Exit Stair",
    ]) {
      const chip = document.createElement("span");
      chip.textContent = service;
      ui.serviceList.append(chip);
    }
    return;
  }
  if (!worldModel) return;
  ui.settlementName.textContent = worldModel.name;
  ui.settlementMood.textContent = worldModel.mood;
  ui.populationCount.textContent = worldModel.population;
  ui.homeCount.textContent = worldModel.homeCount;
  ui.worksiteCount.textContent = worldModel.worksiteCount;
  ui.prosperityScore.textContent = worldModel.prosperity;
  ui.serviceList.innerHTML = "";
  for (const service of worldModel.services) {
    const chip = document.createElement("span");
    chip.textContent = service;
    ui.serviceList.append(chip);
  }
}

function updateNearbyList() {
  if (!ui.nearbyList) return;
  ui.nearbyList.innerHTML = "";
  const items = [];
  if (gameMode === "dungeon") {
    if (nearestDungeonChest()) items.push("Treasure chest within reach");
    if (nearbyThreat) items.push(`${nearbyThreat.kind} guarding the chamber`);
    if (isNearDungeonExit()) items.push("Stairs back to the surface");
    if (items.length < 1) items.push("Cold stone, old dust, and no immediate movement.");
    for (const text of items.slice(0, 4)) {
      const item = document.createElement("li");
      item.textContent = text;
      ui.nearbyList.append(item);
    }
    return;
  }
  if (nearestNpc) {
    items.push(`${nearestNpc.name}, ${nearestNpc.role}, ${nearestNpc.district || nearestNpc.workName}`);
  }
  if (nearbyThreat) {
    const distance = Math.round((Math.hypot(nearbyThreat.x - player.x, nearbyThreat.y - player.y) / TILE) * GRID_FEET);
    items.push(`${nearbyThreat.kind} ${distance} ft away`);
  }
  if (currentObjective && !currentObjective.completed) {
    items.push(`Q${currentObjective.marker}: ${currentObjective.template.title}`);
  }
  if (dungeonSite) {
    const siteDistance = Math.hypot(dungeonSite.x - player.x, dungeonSite.y - player.y);
    if (siteDistance < TILE * 6) {
      items.push(`${dungeonSite.name} ${Math.round((siteDistance / TILE) * GRID_FEET)} ft away`);
    }
  }
  const building = nearestStructure();
  if (building) {
    items.push(`${building.label || building.kind} in ${building.district || getAreaProfile(worldToChunk(building.x), worldToChunk(building.y)).name}`);
  }
  if (items.length < 1) items.push("No immediate concerns nearby.");
  for (const text of items.slice(0, 4)) {
    const item = document.createElement("li");
    item.textContent = text;
    ui.nearbyList.append(item);
  }
}

function nearestStructure() {
  if (gameMode !== "world") return null;
  let closest = null;
  let distance = TILE * 4.5;
  for (const key of visibleChunkKeys) {
    const chunk = chunks.get(key);
    if (!chunk) continue;
    for (const structure of chunk.structures) {
      const centerX = structure.x + structure.w / 2;
      const centerY = structure.y + structure.h / 2;
      const nextDistance = Math.hypot(centerX - player.x, centerY - player.y);
      if (nextDistance < distance) {
        distance = nextDistance;
        closest = structure;
      }
    }
  }
  return closest;
}

function directionToQuest(objective) {
  if (gameMode !== "world") return "marked outside";
  const dx = objective.x - player.x;
  const dy = objective.y - player.y;
  const distanceFeet = Math.max(5, Math.round((Math.hypot(dx, dy) / TILE) * GRID_FEET / 5) * 5);
  const vertical = dy < -TILE ? "N" : dy > TILE ? "S" : "";
  const horizontal = dx < -TILE ? "W" : dx > TILE ? "E" : "";
  return `${distanceFeet} ft ${vertical}${horizontal || ""}`.trim();
}

function updateQuestTracker() {
  ui.questTracker.innerHTML = "";
  questTrackerDirty = false;
  lastQuestTrackerTile = `${Math.floor(player.x / TILE)},${Math.floor(player.y / TILE)},${gameMode}`;
  const visible = activeQuests.filter((quest) => !quest.completed);
  if (visible.length < 1) {
    const item = document.createElement("li");
    item.innerHTML = `<span class="quest-pin">-</span><div>No active quests<small>Ask Mara in the tavern for work.</small></div>`;
    ui.questTracker.append(item);
    return;
  }
  for (const quest of visible) {
    const item = document.createElement("li");
    const area = getAreaProfile(worldToChunk(quest.x), worldToChunk(quest.y)).name;
    item.innerHTML = `<span class="quest-pin">Q${quest.marker}</span><div>${quest.template.title}<small>${area}, ${directionToQuest(quest)}</small></div>`;
    ui.questTracker.append(item);
  }
}

function markQuestTrackerDirty() {
  questTrackerDirty = true;
}

function updateQuestTrackerIfNeeded() {
  const tileKey = `${Math.floor(player.x / TILE)},${Math.floor(player.y / TILE)},${gameMode}`;
  const dungeonNearby = dungeonSite && gameMode === "world" && Math.hypot(dungeonSite.x - player.x, dungeonSite.y - player.y) < TILE * 6;
  ui.timeOfDay.textContent = worldTimeLabel();
  ui.localThreat.textContent = nearbyThreat ? nearbyThreat.kind : gameMode === "dungeon" ? "Delve" : dungeonNearby ? "Watching" : "Low";
  if (questTrackerDirty || tileKey !== lastQuestTrackerTile) {
    updateQuestTracker();
    updateNearbyList();
  }
}

function npcTalk() {
  if (!activeNpc) return;
  const line = quickSpeak(activeNpc);
  ui.npcText.textContent = `${personalityCue(activeNpc)} "${line}"`;
  activeNpc.trust = Math.min(6, (activeNpc.trust || 0) + 1);
  ui.npcTrust.textContent = `${activeNpc.trust}`;
}

function personalityCue(npc) {
  const type = npc.personality;
  if (type[0] === "E") return "They answer quickly, almost eager to trade news.";
  return "They study you for a beat before answering.";
}

function quickNpcLines(npc) {
  const type = npc.personality;
  const topic = npc.hook || "the roads tonight";
  const lines = [];
  lines.push(type[0] === "E" ? `Busy day for ${topic}.` : `Keep your voice down about ${topic}.`);
  lines.push(type[1] === "S" ? `I work out of ${npc.workName || "the lane"} and saw tracks at dawn.` : `This has the shape of old trouble settling in ${npc.district || "town"}.`);
  lines.push(type[2] === "T" ? "Bring proof before you ask for trust." : `Folk in ${npc.homeName || "the village"} are sleeping lightly.`);
  lines.push(type[3] === "J" ? "Make a plan before sunset." : "Stay loose. Plans break fast here.");
  if (npc.revealed) lines.push(`Remember: ${npc.secret}.`);
  if ((npc.serviceTags || []).length > 0) lines.push(`I can help with ${(npc.serviceTags || []).join(", ").toLowerCase()}.`);
  return lines;
}

function quickSpeak(npc) {
  const lines = quickNpcLines(npc);
  const line = lines[npc.lineIndex % lines.length];
  npc.lineIndex += 1;
  npc.talked = true;
  npc.interacted = true;
  npc.speech = line;
  npc.speechTimer = 3.2;
  showPrompt(`${npc.name}: ${line}`);
  logEvent("Talk", `${npc.name}: ${line}`);
  return line;
}

function npcPersonalityInteract() {
  if (!activeNpc) return;
  const line = quickSpeak(activeNpc);
  ui.npcText.textContent = `${personalityCue(activeNpc)} "${line}"`;
}

function buyNpcItem(npc, item) {
  if (player.gold < item.price) {
    ui.npcText.textContent = `${npc.name} gives you an apologetic shrug. You need ${item.price} gold.`;
    return;
  }
  player.gold -= item.price;
  if (item.itemId) {
    const gained = addItemToInventory(item.itemId);
    ui.npcText.textContent = `${npc.name} hands over ${gained?.name.toLowerCase() || item.name.toLowerCase()}. ${item.text}`;
  } else if (item.name.includes("Meal")) {
    player.hp = clamp(player.hp + 2, 1, player.maxHp);
    ui.npcText.textContent = `${npc.name} sets a hot plate in front of you. ${item.text}`;
  } else if (item.name.includes("Room")) {
    player.hp = player.maxHp;
    player.secondWindUsed = false;
    player.actionSurgeUsed = false;
    ui.npcText.textContent = `${npc.name} clears a room upstairs. ${item.text}`;
  } else if (item.name.includes("Shield")) {
    player.tempAc += 1;
    ui.npcText.textContent = `${npc.name} adjusts your kit. ${item.text}`;
  }
  npc.trust = Math.min(8, (npc.trust || 0) + 1);
  ui.npcTrust.textContent = `${npc.trust}`;
  updateHud();
  logEvent("Trade", `${npc.name}: ${item.name} for ${item.price} gold.`);
}

function npcRumor() {
  if (!activeNpc) return;
  const result = rollD20("cha", activeNpc.dc, `${activeNpc.name} rumor`, { proficient: true });
  if (result.success) {
    activeNpc.trust = Math.min(10, (activeNpc.trust || 0) + 2);
    const rumor = activeNpc.secret || activeNpc.hook;
    ui.npcText.textContent = `${activeNpc.name} leans in. "${rumor}."`;
    logEvent("Rumor", `${activeNpc.name}: ${rumor}.`);
  } else {
    ui.npcText.textContent = `${activeNpc.name} measures you and keeps the useful part back.`;
  }
  ui.npcTrust.textContent = `${activeNpc.trust || 0}`;
}

function npcTrade() {
  if (!activeNpc) return;
  if (!activeNpc.goods || activeNpc.goods.length < 1) {
    ui.npcText.textContent = `${activeNpc.name} has no real wares to spare today.`;
    return;
  }
  renderNpcServicePanel(activeNpc);
  ui.npcText.textContent = `${activeNpc.name} lays a few practical items out on the table.`;
}

function npcTrain() {
  if (!activeNpc) return;
  if (!(activeNpc.serviceTags || []).includes("Training")) {
    ui.npcText.textContent = `${activeNpc.name} is not much for formal instruction.`;
    return;
  }
  if (player.gold < 8) {
    ui.npcText.textContent = `${activeNpc.name} names a price of 8 gold for an afternoon of drills.`;
    return;
  }
  player.gold -= 8;
  gainXp(20, `${activeNpc.name}'s drills`);
  activeNpc.trust = Math.min(10, (activeNpc.trust || 0) + 1);
  ui.npcTrust.textContent = `${activeNpc.trust}`;
  ui.npcText.textContent = `${activeNpc.name} runs you through the basics until your footing improves.`;
  updateHud();
}

function interactWithNearestOrActive() {
  if (minigame) return;
  if (activeNpc) {
    npcPersonalityInteract();
    return;
  }
  if (gameMode === "dungeon") {
    if (nearestDungeonChest()) {
      openDungeonChest();
      return;
    }
    if (isNearDungeonExit()) {
      leaveDungeon();
    }
    return;
  }
  if (gameMode === "tavern") {
    if (isNearTavernExit()) {
      leaveTavern();
      return;
    }
    const actor = nearestTavernActor();
    if (actor === tavernkeeper) {
      openQuestPanel();
    } else if (actor) {
      quickSpeak(actor);
    }
    return;
  }
  if (currentObjective) {
    startObjective(currentObjective);
    return;
  }
  if (isNearDungeonEntrance()) {
    enterDungeon();
    return;
  }
  if (isNearTavernDoor()) {
    enterTavern();
    return;
  }
  if (nearestNpc) {
    quickSpeak(nearestNpc);
  }
}

function npcInsight() {
  if (!activeNpc) return;
  const result = rollD20("wis", activeNpc.dc, `${activeNpc.name} insight`, { proficient: true });
  if (result.success) {
    activeNpc.revealed = true;
    ui.npcText.textContent = `Wisdom check ${result.total} beats DC ${result.dc}. ${activeNpc.name} ${activeNpc.secret}.`;
    logEvent("Check", `Insight ${result.roll}${modText(result.bonus)} = ${result.total}; secret learned.`);
    activeNpc.trust = Math.min(10, (activeNpc.trust || 0) + 1);
  } else {
    ui.npcText.textContent = `Wisdom check ${result.total} misses DC ${result.dc}. ${activeNpc.name}'s expression gives away nothing useful.`;
    logEvent("Check", `Insight ${result.roll}${modText(result.bonus)} = ${result.total}; no read.`);
  }
  ui.npcTrust.textContent = `${activeNpc.trust || 0}`;
}

function npcPersuade() {
  if (!activeNpc) return;
  const result = rollD20("cha", activeNpc.dc, `${activeNpc.name} persuade`, { proficient: true });
  if (result.success) {
    const coin = 1 + Math.floor(Math.random() * 5);
    player.gold += coin;
    gainXp(5, `${activeNpc.name}'s favor`);
    ui.npcText.textContent = `Charisma check ${result.total} beats DC ${result.dc}. ${activeNpc.name} trusts you with a lead and presses ${coin} gold into your palm.`;
    logEvent("Check", `Persuasion ${result.roll}${modText(result.bonus)} = ${result.total}; +${coin} gold, +5 XP.`);
    activeNpc.trust = Math.min(10, (activeNpc.trust || 0) + 2);
  } else {
    ui.npcText.textContent = `Charisma check ${result.total} misses DC ${result.dc}. ${activeNpc.name} folds their arms and keeps the useful details private.`;
    logEvent("Check", `Persuasion ${result.roll}${modText(result.bonus)} = ${result.total}; rebuffed.`);
  }
  ui.npcTrust.textContent = `${activeNpc.trust || 0}`;
  updateHud();
}

function npcAid() {
  if (!activeNpc || activeNpc.helped) return;
  const stat = activeNpc.role.includes("Smith") || activeNpc.role.includes("Carpenter") ? "str" : "dex";
  const result = rollD20(stat, activeNpc.dc, `${activeNpc.name} aid`, { proficient: true });
  if (result.success) {
    activeNpc.helped = true;
    const reward = 6 + Math.floor(Math.random() * 7);
    player.gold += reward;
    gainXp(12, `${activeNpc.name}'s job`);
    ui.npcText.textContent = `${stat.toUpperCase()} check ${result.total} beats DC ${result.dc}. You settle the immediate problem around ${activeNpc.hook}; ${activeNpc.name} rewards you.`;
    logEvent("Aid", `${result.roll}${modText(result.bonus)} = ${result.total}; +${reward} gold, +12 XP.`);
    activeNpc.trust = Math.min(10, (activeNpc.trust || 0) + 2);
  } else {
    player.hp = Math.max(1, player.hp - 1);
    ui.npcText.textContent = `${stat.toUpperCase()} check ${result.total} misses DC ${result.dc}. The attempt costs you a bruise, but the problem remains.`;
    logEvent("Aid", `${result.roll}${modText(result.bonus)} = ${result.total}; -1 HP.`);
  }
  ui.npcTrust.textContent = `${activeNpc.trust || 0}`;
  updateHud();
}

function modText(value) {
  if (value === 0) return "";
  return value > 0 ? `+${value}` : `${value}`;
}

function shortRest() {
  const before = player.hp;
  const heal = 2 + numericMod(player.stats.con);
  player.hp = clamp(player.hp + Math.max(1, heal), 1, player.maxHp);
  player.secondWindUsed = false;
  player.actionSurgeUsed = false;
  updateHud();
  updateQuestTracker();
  logEvent("Rest", `Recovered ${player.hp - before} HP.`);
}

function createTavernPatrons() {
  const random = mulberry32(hashString(`${worldSeed}:tavern:patrons`));
  const spots = [
    { x: 3.5, y: 7.5 }, { x: 5.5, y: 5.5 }, { x: 8.5, y: 8.5 },
    { x: 10.5, y: 6.5 }, { x: 12.5, y: 7.5 }, { x: 13.5, y: 4.5 },
  ];
  const count = 2 + Math.floor(random() * 4);
  tavernPatrons = [];
  for (let i = 0; i < count; i += 1) {
    const spot = spots[i % spots.length];
    const ancestry = weightedChoice(random, ancestryWeights.village);
    const gender = weightedChoice(random, genderWeights.village);
    tavernPatrons.push({
      id: `patron:${i}`,
      name: `${randomChoice(random, firstNames)} ${randomChoice(random, surnames)}`,
      role: randomChoice(random, ["Patron", "Minstrel", "Drover", "Traveler", "Card Player"]),
      mood: randomChoice(random, moods),
      ancestry,
      gender,
      personality: weightedChoice(random, mbtiWeights),
      x: spot.x * TILE,
      y: spot.y * TILE,
      fromX: spot.x * TILE,
      fromY: spot.y * TILE,
      targetX: spot.x * TILE,
      targetY: spot.y * TILE,
      moveProgress: 0,
      moving: false,
      facing: randomChoice(random, ["up", "down", "left", "right"]),
      wander: random() < 0.32,
      wait: 1 + random() * 4,
      speech: "",
      speechTimer: 0,
      lineIndex: 0,
      talked: false,
      helped: false,
      revealed: false,
      hasFullDialogue: false,
      trust: 0,
      homeName: "Hearth & Harrow",
      workName: "Common Room",
      district: "Market",
      serviceTags: [],
      goods: [],
      appearance: makeAppearance(random, ancestry, gender, "Traveler"),
    });
  }
}

function enterTavern() {
  worldReturnPosition = { x: player.x, y: player.y };
  gameMode = "tavern";
  combatState = null;
  closeNpc();
  closeQuestPanel();
  closeCombat();
  player.x = 8.5 * TILE;
  player.y = 10.5 * TILE;
  player.fromX = player.x;
  player.fromY = player.y;
  player.targetX = player.x;
  player.targetY = player.y;
  player.moving = false;
  player.facing = "up";
  ui.regionName.textContent = "Waymark Vale";
  ui.areaName.textContent = "Hearth & Harrow";
  updateHud();
  logEvent("Enter", "Warm lamplight and cedar smoke close around you.");
}

function leaveTavern() {
  gameMode = "world";
  closeQuestPanel();
  player.x = worldReturnPosition.x;
  player.y = worldReturnPosition.y;
  player.fromX = player.x;
  player.fromY = player.y;
  player.targetX = player.x;
  player.targetY = player.y;
  player.moving = false;
  player.facing = "down";
  currentChunkId = "";
  preloadChunks();
  checkArea();
  updateHud();
  logEvent("Exit", "You step back onto the village green.");
}

function pickQuestTemplates() {
  const pool = questTemplates
    .filter((template) => !completedQuestIds.has(template.id))
    .filter((template) => !activeQuests.some((quest) => quest.template.id === template.id));
  const random = mulberry32(hashString(`${worldSeed}:quest-board:${completedQuestIds.size}:${activeQuests.length}`));
  const picks = [...pool];
  availableQuests = [];
  const count = Math.min(pool.length, 1 + Math.floor(random() * 4));
  while (availableQuests.length < count && picks.length > 0) {
    const index = Math.floor(random() * picks.length);
    availableQuests.push(picks.splice(index, 1)[0]);
  }
}

function renderQuestPanel() {
  ui.questIntro.textContent = availableQuests.length > 0
    ? "Mara wipes a mug dry and nods toward the road board. Take what you mean to do; the board does not refill until the valley is regenerated."
    : "Mara taps the empty board. No more fresh work is posted right now.";
  ui.questList.innerHTML = "";
  if (availableQuests.length < 1) {
    const empty = document.createElement("p");
    empty.textContent = "No available quests.";
    ui.questList.append(empty);
    return;
  }
  for (const template of availableQuests) {
    const card = document.createElement("article");
    card.className = "quest-card";
    const info = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = template.title;
    const text = document.createElement("p");
    text.textContent = `${template.text} Reward: ${template.reward} gold, ${template.xp} XP.`;
    info.append(title, text);
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Accept";
    button.addEventListener("click", () => acceptQuest(template.id));
    card.append(info, button);
    ui.questList.append(card);
  }
}

function openQuestPanel() {
  tavernkeeper.speech = availableQuests.length > 0
    ? "Work? Aye. Pick one and I will mark your map."
    : "That is the board cleared for now. Finish what you took.";
  tavernkeeper.speechTimer = 3.2;
  renderQuestPanel();
  ui.questPanel.classList.remove("hidden");
}

function closeQuestPanel() {
  ui.questPanel.classList.add("hidden");
}

function objectiveLocation(template) {
  const random = mulberry32(hashString(`${worldSeed}:objective:${template.id}:${questIdCounter}`));
  const candidates = {
    village: [[0, 0], [1, 0], [0, 1], [-1, 0]],
    fields: [[-2, 0], [-2, 1], [-3, 0], [-3, 1]],
    woods: [[0, -2], [1, -2], [-1, -2], [0, -3]],
    mountains: [[0, -3], [1, -3], [-1, -3], [0, -4]],
    river: [[0, 2], [1, 2], [-1, 2], [0, 3]],
    road: [[2, 0], [2, 1], [3, 0], [1, 1]],
  }[template.area] || [[1, 0]];
  const [cx, cy] = randomChoice(random, candidates);
  const chunk = generateChunk(cx, cy);
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const x = cx * CHUNK_SIZE + snapToTileCenter(TILE * 2 + random() * (CHUNK_SIZE - TILE * 4));
    const y = cy * CHUNK_SIZE + snapToTileCenter(TILE * 2 + random() * (CHUNK_SIZE - TILE * 4));
    const tx = Math.floor((x - cx * CHUNK_SIZE) / TILE);
    const ty = Math.floor((y - cy * CHUNK_SIZE) / TILE);
    const terrain = chunk.tiles[ty]?.[tx];
    const terrainClear = terrain !== "water" && terrain !== "tree" && terrain !== "stone";
    const structureClear = chunk.structures.every((structure) => {
      const insideX = x > structure.x - TILE && x < structure.x + structure.w + TILE;
      const insideY = y > structure.y - TILE && y < structure.y + structure.h + TILE;
      return !(insideX && insideY);
    });
    if (terrainClear && structureClear) return { x, y };
  }
  return { x: cx * CHUNK_SIZE + CHUNK_SIZE / 2, y: cy * CHUNK_SIZE + CHUNK_SIZE / 2 };
}

function acceptQuest(templateId) {
  const template = availableQuests.find((quest) => quest.id === templateId);
  if (!template) return;
  questIdCounter += 1;
  const location = objectiveLocation(template);
  const objective = {
    id: `${template.id}:${questIdCounter}`,
    marker: questIdCounter,
    template,
    x: location.x,
    y: location.y,
    completed: false,
  };
  activeQuests.push(objective);
  availableQuests = availableQuests.filter((quest) => quest.id !== templateId);
  renderQuestPanel();
  updateQuestTracker();
  const area = getAreaProfile(worldToChunk(objective.x), worldToChunk(objective.y)).name;
  logEvent("Quest", `Q${objective.marker} ${template.title} marked in ${area}.`);
  tavernkeeper.speech = "Marked it. Follow the road and keep your eyes open.";
  tavernkeeper.speechTimer = 3.4;
}

function closeMinigame() {
  minigame = null;
  ui.minigamePanel.classList.add("hidden");
}

function startObjective(objective) {
  if (!objective || objective.completed) return;
  if (!objective.template.minigame) {
    completeQuestObjective(objective, "You handle the errand without trouble.");
    return;
  }
  startMinigame(objective);
}

function startMinigame(objective) {
  const type = objective.template.minigame;
  const random = mulberry32(hashString(`${worldSeed}:minigame:${objective.id}`));
  minigame = {
    objective,
    type,
    ability: objective.template.ability || "DEX",
    marker: random(),
    direction: random() > 0.5 ? 1 : -1,
    progress: 0,
    mistakes: 0,
    sequence: [],
    index: 0,
    found: new Set(),
    targetCells: new Set(),
    answer: "",
    options: [],
    prompt: "",
    target: 18,
    stackTarget: 0.5,
    stackWidth: 0.34,
    startedAt: performance.now(),
    requiredWpm: 0,
  };
  ui.minigameType.textContent = `${minigame.ability} ${type.toUpperCase()}`;
  ui.minigameTitle.textContent = objective.template.title;
  ui.minigameText.textContent = objective.template.text;
  ui.minigamePanel.classList.remove("hidden");

  if (type === "memory") {
    const runes = ["A", "B", "C", "D"];
    minigame.sequence = Array.from({ length: 4 }, () => randomChoice(random, runes));
  } else if (type === "search") {
    while (minigame.targetCells.size < 3) minigame.targetCells.add(Math.floor(random() * 16));
  } else if (type === "barter") {
    minigame.answer = randomChoice(random, ["Kind", "Firm", "Clever", "Patient"]);
  } else if (type === "math") {
    const a = 8 + Math.floor(random() * 15);
    const b = 4 + Math.floor(random() * 11);
    const c = 2 + Math.floor(random() * 8);
    minigame.prompt = `${a} + ${b} x ${c}`;
    minigame.answer = String(a + b * c);
    minigame.options = makeAnswerOptions(random, Number(minigame.answer));
  } else if (type === "typing") {
    minigame.answer = randomChoice(random, typingPhrases);
    minigame.requiredWpm = 22 + (objective.template.difficulty || 1) * 8;
    minigame.startedAt = performance.now();
  } else if (type === "riddle") {
    const riddle = randomChoice(random, riddleBank);
    minigame.prompt = riddle.q;
    minigame.answer = riddle.a;
  } else if (type === "mash") {
    minigame.target = 18;
  } else if (type === "stack") {
    minigame.marker = random();
    minigame.stackTarget = 0.5;
    minigame.stackWidth = 0.34;
  }
  renderMinigame();
}

function makeAnswerOptions(random, answer) {
  const options = new Set([String(answer)]);
  while (options.size < 4) {
    const miss = answer + Math.floor(random() * 13) - 6;
    if (miss !== answer && miss > 0) options.add(String(miss));
  }
  return Array.from(options).sort(() => random() - 0.5);
}

function renderMinigame() {
  if (!minigame) return;
  ui.minigameStage.innerHTML = "";
  if (minigame.type === "timing") {
    const track = document.createElement("div");
    track.className = "timing-track";
    const zone = document.createElement("div");
    zone.className = "timing-zone";
    const marker = document.createElement("div");
    marker.className = "timing-marker";
    marker.style.left = `${minigame.marker * 100}%`;
    track.append(zone, marker);
    const meter = document.createElement("div");
    meter.className = "mini-meter";
    const fill = document.createElement("span");
    fill.style.width = `${minigame.progress * 34}%`;
    meter.append(fill);
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Stop";
    button.addEventListener("click", handleTimingStop);
    ui.minigameStage.append(track, meter, button);
  } else if (minigame.type === "memory") {
    const pattern = document.createElement("p");
    pattern.textContent = `Pattern: ${minigame.sequence.join(" ")}`;
    const buttons = document.createElement("div");
    buttons.className = "mini-buttons";
    for (const rune of ["A", "B", "C", "D"]) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = rune;
      button.addEventListener("click", () => handleMemoryChoice(rune));
      buttons.append(button);
    }
    ui.minigameStage.append(pattern, buttons);
  } else if (minigame.type === "search") {
    const hint = document.createElement("p");
    hint.textContent = `Find ${3 - minigame.found.size} useful signs.`;
    const grid = document.createElement("div");
    grid.className = "search-grid";
    for (let i = 0; i < 16; i += 1) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = minigame.found.has(i) ? "Found" : "?";
      if (minigame.found.has(i)) button.classList.add("found");
      button.addEventListener("click", () => handleSearchCell(i));
      grid.append(button);
    }
    ui.minigameStage.append(hint, grid);
  } else if (minigame.type === "barter") {
    const hint = document.createElement("p");
    hint.textContent = "Read the moment and choose an approach.";
    const buttons = document.createElement("div");
    buttons.className = "mini-buttons";
    for (const option of ["Kind", "Firm", "Clever", "Patient"]) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = option;
      button.addEventListener("click", () => handleBarter(option));
      buttons.append(button);
    }
    ui.minigameStage.append(hint, buttons);
  } else if (minigame.type === "math") {
    const problem = document.createElement("p");
    problem.textContent = `${minigame.prompt} = ?`;
    const buttons = document.createElement("div");
    buttons.className = "mini-buttons";
    for (const option of minigame.options) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = option;
      button.addEventListener("click", () => handleMath(option));
      buttons.append(button);
    }
    ui.minigameStage.append(problem, buttons);
  } else if (minigame.type === "mash") {
    const hint = document.createElement("p");
    hint.textContent = `Power: ${minigame.progress}/${minigame.target}`;
    const meter = document.createElement("div");
    meter.className = "mini-meter";
    const fill = document.createElement("span");
    fill.style.width = `${Math.min(100, (minigame.progress / minigame.target) * 100)}%`;
    meter.append(fill);
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Push";
    button.addEventListener("click", handleMash);
    ui.minigameStage.append(hint, meter, button);
  } else if (minigame.type === "typing") {
    const phrase = document.createElement("p");
    phrase.textContent = `${minigame.answer} (${minigame.requiredWpm} WPM required)`;
    const input = document.createElement("input");
    input.className = "mini-input";
    input.type = "text";
    input.autocomplete = "off";
    input.spellcheck = false;
    input.placeholder = "Type the line exactly";
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Speak";
    button.addEventListener("click", () => handleTyping(input.value));
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") handleTyping(input.value);
    });
    ui.minigameStage.append(phrase, input, button);
    input.focus();
  } else if (minigame.type === "riddle") {
    const question = document.createElement("p");
    question.textContent = minigame.prompt;
    const input = document.createElement("input");
    input.className = "mini-input";
    input.type = "text";
    input.autocomplete = "off";
    input.spellcheck = false;
    input.placeholder = "Type your answer";
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Answer";
    button.addEventListener("click", () => handleRiddle(input.value));
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") handleRiddle(input.value);
    });
    ui.minigameStage.append(question, input, button);
    input.focus();
  } else if (minigame.type === "stack") {
    const track = document.createElement("div");
    track.className = "timing-track";
    const zone = document.createElement("div");
    zone.className = "timing-zone";
    zone.style.left = `${(minigame.stackTarget - minigame.stackWidth / 2) * 100}%`;
    zone.style.width = `${minigame.stackWidth * 100}%`;
    const marker = document.createElement("div");
    marker.className = "timing-marker";
    marker.style.left = `${minigame.marker * 100}%`;
    track.append(zone, marker);
    const hint = document.createElement("p");
    hint.textContent = `Stack height: ${minigame.progress}/4`;
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Drop";
    button.addEventListener("click", handleStackDrop);
    ui.minigameStage.append(track, hint, button);
  }
}

function updateMinigame(delta) {
  if (!minigame) return;
  if (minigame.type === "mash") {
    minigame.progress = Math.max(0, minigame.progress - delta * 2.6);
    return;
  }
  if (minigame.type !== "timing" && minigame.type !== "stack") return;
  minigame.marker += delta * 0.9 * minigame.direction;
  if (minigame.marker > 1) {
    minigame.marker = 1;
    minigame.direction = -1;
  } else if (minigame.marker < 0) {
    minigame.marker = 0;
    minigame.direction = 1;
  }
  const marker = ui.minigameStage.querySelector(".timing-marker");
  if (marker) marker.style.left = `${minigame.marker * 100}%`;
}

function handleTimingStop() {
  if (!minigame) return;
  if (minigame.marker >= 0.42 && minigame.marker <= 0.58) {
    minigame.progress += 1;
    if (minigame.progress >= 3) {
      completeQuestObjective(minigame.objective, "Good hands and good timing finish the job.");
      return;
    }
  } else {
    minigame.mistakes += 1;
    if (minigame.mistakes >= 3) {
      player.hp = Math.max(1, player.hp - 1);
      updateHud();
      minigame.mistakes = 0;
      logEvent("Slip", "The work costs you 1 HP.");
    }
  }
  renderMinigame();
}

function handleMemoryChoice(choice) {
  if (!minigame) return;
  if (choice === minigame.sequence[minigame.index]) {
    minigame.index += 1;
    if (minigame.index >= minigame.sequence.length) {
      completeQuestObjective(minigame.objective, "You keep the pattern straight.");
      return;
    }
    ui.minigameText.textContent = `Correct. ${minigame.sequence.length - minigame.index} marks remain.`;
  } else {
    minigame.index = 0;
    ui.minigameText.textContent = "The pattern slips. Start again.";
  }
}

function handleSearchCell(index) {
  if (!minigame || minigame.found.has(index)) return;
  if (minigame.targetCells.has(index)) {
    minigame.found.add(index);
    if (minigame.found.size >= minigame.targetCells.size) {
      completeQuestObjective(minigame.objective, "You find exactly what the job needed.");
      return;
    }
  } else {
    minigame.mistakes += 1;
    ui.minigameText.textContent = minigame.mistakes > 1 ? "Still nothing useful there." : "That sign leads nowhere.";
  }
  renderMinigame();
}

function handleBarter(option) {
  if (!minigame) return;
  if (option === minigame.answer) {
    completeQuestObjective(minigame.objective, "You choose the right pressure and the matter turns.");
  } else {
    minigame.mistakes += 1;
    ui.minigameText.textContent = minigame.mistakes >= 2
      ? `They soften after the failed angle. Try ${minigame.answer.toLowerCase()}.`
      : "That approach lands poorly.";
  }
}

function handleMath(option) {
  if (!minigame) return;
  if (option === minigame.answer) {
    completeQuestObjective(minigame.objective, "The numbers settle cleanly.");
  } else {
    minigame.mistakes += 1;
    ui.minigameText.textContent = minigame.mistakes >= 2
      ? `The ledger margin suggests ${minigame.answer}.`
      : "The arithmetic does not balance.";
  }
}

function handleMash() {
  if (!minigame) return;
  minigame.progress += 1;
  if (minigame.progress >= minigame.target) {
    completeQuestObjective(minigame.objective, "You put your back into it and the weight moves.");
    return;
  }
  renderMinigame();
}

function handleTyping(value) {
  if (!minigame) return;
  const typed = value.trim();
  const elapsedMinutes = Math.max(0.01, (performance.now() - minigame.startedAt) / 60000);
  const words = typed.length / 5;
  const wpm = Math.round(words / elapsedMinutes);
  if (typed === minigame.answer && wpm >= minigame.requiredWpm) {
    completeQuestObjective(minigame.objective, `The words land cleanly at ${wpm} WPM.`);
  } else if (typed === minigame.answer) {
    minigame.mistakes += 1;
    ui.minigameText.textContent = `Clean line, but ${wpm} WPM is too slow. Need ${minigame.requiredWpm} WPM.`;
  } else {
    minigame.mistakes += 1;
    ui.minigameText.textContent = "The room winces at the stumble. Try the line exactly.";
  }
}

function handleRiddle(option) {
  if (!minigame) return;
  const answer = option.trim().toLowerCase();
  if (answer === minigame.answer.toLowerCase()) {
    completeQuestObjective(minigame.objective, "The quiet answer feels true.");
  } else {
    minigame.mistakes += 1;
    ui.minigameText.textContent = minigame.mistakes >= 2
      ? "Listen for what answers without speaking."
      : "That answer has the wrong shape.";
  }
}

function handleStackDrop() {
  if (!minigame) return;
  const drift = Math.abs(minigame.marker - minigame.stackTarget);
  if (drift <= minigame.stackWidth / 2) {
    minigame.progress += 1;
    minigame.stackTarget = minigame.marker;
    minigame.stackWidth = Math.max(0.12, minigame.stackWidth * 0.82);
    if (minigame.progress >= 4) {
      completeQuestObjective(minigame.objective, "The tower holds steady.");
      return;
    }
  } else {
    minigame.mistakes += 1;
    minigame.stackWidth = Math.max(0.1, minigame.stackWidth * 0.72);
    ui.minigameText.textContent = minigame.mistakes >= 2 ? "Breathe, then drop over the last crate." : "The crate clips the edge.";
  }
  renderMinigame();
}

function completeQuestObjective(objective, resultText) {
  objective.completed = true;
  completedQuestIds.add(objective.template.id);
  player.gold += objective.template.reward;
  gainXp(objective.template.xp, objective.template.title);
  updateHud();
  updateQuestTracker();
  logEvent("Done", `${objective.template.title}: +${objective.template.reward} gold, +${objective.template.xp} XP.`);
  showPrompt(resultText);
  closeMinigame();
}

function appendCombatLog(text) {
  if (!combatState) return;
  combatState.log.unshift(text);
  combatState.log = combatState.log.slice(0, 10);
  updateCombatPanel();
}

function updateCombatPanel() {
  if (!ui.combatPanel) return;
  if (!combatState) {
    ui.combatPanel.classList.add("hidden");
    return;
  }
  const enemy = combatState.enemy;
  ui.combatTitle.textContent = combatState.title;
  ui.combatHeroName.textContent = player.name;
  ui.combatHeroHp.textContent = `${player.hp}/${player.maxHp}`;
  ui.combatHeroAc.textContent = `${player.ac}`;
  ui.combatHeroState.textContent = combatState.playerGuard ? "Braced" : combatState.turn === "player" ? "Acting" : "Waiting";
  ui.combatEnemyName.textContent = enemy.kind;
  ui.combatEnemyHp.textContent = `${enemy.hp}/${enemy.maxHp}`;
  ui.combatEnemyAc.textContent = `${enemy.ac}`;
  ui.combatEnemyIntent.textContent = enemy.intent;
  ui.combatStatus.textContent = combatState.status;
  const melee = equippedWeapon("melee");
  const ranged = equippedWeapon("ranged");
  ui.combatStrikeButton.textContent = melee ? melee.name : "Strike";
  ui.combatShotButton.textContent = ranged ? ranged.name : "Shot";
  ui.combatItemButton.textContent = `Potion (${countInventoryItems("healing_potion")})`;
  ui.combatLog.innerHTML = "";
  for (const line of combatState.log) {
    const item = document.createElement("li");
    item.textContent = line;
    ui.combatLog.append(item);
  }
  ui.combatPanel.classList.remove("hidden");
}

function closeCombat() {
  if (combatState && !combatState.resolved) {
    combatState.status = "This fight is still live.";
    updateCombatPanel();
    return;
  }
  combatState = null;
  ui.combatPanel.classList.add("hidden");
}

function startCombat(threat) {
  if (combatState) return;
  if (!threat || threat.defeated) return;
  toggleInventoryPanel(false);
  const playerInit = rollD20("dex", 0, "Initiative", { proficient: true, silent: true });
  const enemyRoll = Math.floor(Math.random() * 20) + 1;
  showDiceRoll(playerInit, { reason: `Initiative vs ${threat.kind}`, breakdown: `${playerInit.roll}${modText(playerInit.bonus)} = ${playerInit.total}; foe rolled ${enemyRoll}` });
  combatState = {
    enemy: threat,
    title: gameMode === "dungeon"
      ? `${threat.kind} in ${dungeonState?.name || "the dungeon"}`
      : `${threat.kind} on the ${getAreaProfile(worldToChunk(threat.x), worldToChunk(threat.y)).name}`,
    log: [],
    status: "Steel comes free of the sheath.",
    playerGuard: false,
    turn: playerInit.total >= enemyRoll ? "player" : "enemy",
    resolved: false,
  };
  threat.inCombat = true;
  threat.wander = false;
  appendCombatLog(`${threat.kind} steps in close.`);
  updateCombatPanel();
  if (combatState.turn === "enemy") {
    combatState.status = `${threat.kind} seizes the first move.`;
    updateCombatPanel();
    setTimeout(enemyTurn, 380);
  }
}

function resolveCombatWin() {
  const enemy = combatState?.enemy;
  if (!enemy) return;
  enemy.defeated = true;
  enemy.inCombat = false;
  enemy.wander = false;
  player.gold += 3 + Math.floor(Math.random() * 7);
  gainXp(enemy.xpReward, enemy.kind);
  combatState.resolved = true;
  combatState.status = gameMode === "dungeon"
    ? `${enemy.kind} drops, and the chamber finally goes quiet.`
    : `${enemy.kind} breaks and the road is yours.`;
  appendCombatLog(`${enemy.kind} falls.`);
  if (gameMode === "dungeon" && dungeonState && !dungeonState.chest.opened) {
    showPrompt("The chest in the chamber is no longer guarded.");
  }
  updateHud();
}

function resolveCombatLoss() {
  const enemy = combatState?.enemy;
  combatState.resolved = true;
  combatState.status = "You stagger free and are carried back to the tavern.";
  appendCombatLog("The fight gets away from you.");
  if (enemy) {
    enemy.inCombat = false;
    enemy.wander = gameMode === "world";
  }
  player.hp = Math.max(1, Math.floor(player.maxHp * 0.35));
  player.gold = Math.max(0, player.gold - 4);
  gameMode = "tavern";
  player.x = 8.5 * TILE;
  player.y = 10.5 * TILE;
  player.fromX = player.x;
  player.fromY = player.y;
  player.targetX = player.x;
  player.targetY = player.y;
  player.moving = false;
  updateHud();
}

function enemyTurn() {
  if (!combatState || combatState.resolved) return;
  const enemy = combatState.enemy;
  combatState.turn = "enemy";
  combatState.status = `${enemy.kind} acts.`;
  const enemyRoll = Math.floor(Math.random() * 20) + 1;
  const total = enemyRoll + enemy.attackBonus;
  showDiceRoll({ roll: enemyRoll, bonus: enemy.attackBonus, total, dc: player.ac, success: total >= player.ac, label: `${enemy.kind} attack` }, {
    reason: `${enemy.kind} attack`,
    breakdown: `${enemyRoll}+${enemy.attackBonus} = ${total} vs AC ${player.ac}`,
  });
  if (total >= player.ac) {
    const damage = rollDamage(enemy.damage[0], enemy.damage[1], enemy.damage[2], `${enemy.kind} damage`);
    player.hp = Math.max(0, player.hp - damage);
    appendCombatLog(`${enemy.kind} hits for ${damage}.`);
  } else {
    appendCombatLog(`${enemy.kind} misses.`);
  }
  player.tempAc = 0;
  syncPlayerDerived();
  if (player.hp <= 0) {
    resolveCombatLoss();
    return;
  }
  combatState.turn = "player";
  combatState.playerGuard = false;
  combatState.status = "Your turn.";
  updateHud();
}

function endPlayerTurn() {
  if (!combatState || combatState.resolved) return;
  if (combatState.enemy.hp <= 0) {
    resolveCombatWin();
    return;
  }
  combatState.turn = "enemy";
  updateCombatPanel();
  setTimeout(enemyTurn, 380);
}

function combatStrike() {
  if (!combatState || combatState.turn !== "player" || combatState.resolved) return;
  const enemy = combatState.enemy;
  const weapon = equippedWeapon("melee");
  const ability = weapon?.ability || "str";
  const damageProfile = weapon?.damage || [1, 4, 0];
  const result = rollD20(ability, enemy.ac, weapon?.name || "Strike", { proficient: true });
  if (result.success) {
    const damage = rollDamage(damageProfile[0], damageProfile[1], (damageProfile[2] || 0) + numericMod(player.stats[ability]), `${weapon?.name || "Strike"} damage`);
    enemy.hp = Math.max(0, enemy.hp - damage);
    appendCombatLog(`Strike lands for ${damage}.`);
  } else {
    appendCombatLog("Your strike skates wide.");
  }
  combatState.status = result.success ? "Steel bites home." : "The enemy keeps just outside your line.";
  updateCombatPanel();
  endPlayerTurn();
}

function combatShot() {
  if (!combatState || combatState.turn !== "player" || combatState.resolved) return;
  const enemy = combatState.enemy;
  const weapon = equippedWeapon("ranged");
  const ability = weapon?.ability || "dex";
  const damageProfile = weapon?.damage || [1, 4, 0];
  const result = rollD20(ability, enemy.ac, weapon?.name || "Bow Shot", { proficient: true });
  if (result.success) {
    const damage = rollDamage(damageProfile[0], damageProfile[1], (damageProfile[2] || 0) + numericMod(player.stats[ability]), `${weapon?.name || "Bow"} damage`);
    enemy.hp = Math.max(0, enemy.hp - damage);
    appendCombatLog(`Shot lands for ${damage}.`);
  } else {
    appendCombatLog("The arrow slips past.");
  }
  combatState.status = result.success ? "The shaft flies true." : "The target ducks the line.";
  updateCombatPanel();
  endPlayerTurn();
}

function combatBrace() {
  if (!combatState || combatState.turn !== "player" || combatState.resolved) return;
  combatState.playerGuard = true;
  player.tempAc = 2;
  syncPlayerDerived();
  appendCombatLog("You brace and raise your guard.");
  combatState.status = "You settle behind your defense.";
  updateHud();
  endPlayerTurn();
}

function combatSurge() {
  if (!combatState || combatState.turn !== "player" || combatState.resolved) return;
  if (player.secondWindUsed) {
    combatState.status = "You already drew on your reserve this rest.";
    updateCombatPanel();
    return;
  }
  player.secondWindUsed = true;
  const heal = rollDamage(1, 10, player.level, "Second Wind");
  player.hp = clamp(player.hp + heal, 1, player.maxHp);
  appendCombatLog(`You recover ${heal} HP.`);
  combatState.status = "Breath returns to your chest.";
  updateHud();
  endPlayerTurn();
}

function combatItem() {
  if (!combatState || combatState.turn !== "player" || combatState.resolved) return;
  const potion = player.inventory.find((item) => item.id === "healing_potion");
  if (!potion) {
    combatState.status = "No potions left.";
    updateCombatPanel();
    return;
  }
  const before = player.hp;
  useInventoryItem(potion.uid, { silent: true });
  appendCombatLog(`Potion restores ${player.hp - before} HP.`);
  combatState.status = "You drink quickly and reset your footing.";
  updateHud();
  endPlayerTurn();
}

function combatFlee() {
  if (!combatState || combatState.turn !== "player" || combatState.resolved) return;
  const enemy = combatState.enemy;
  const dc = 11 + Math.floor(enemy.attackBonus / 2);
  const result = rollD20("dex", dc, "Disengage", { proficient: true });
  if (result.success) {
    combatState.resolved = true;
    enemy.inCombat = false;
    enemy.wander = true;
    combatState.status = "You break contact and fade back.";
    appendCombatLog("You escape the fight.");
    updateCombatPanel();
  } else {
    appendCombatLog("No clean lane out.");
    endPlayerTurn();
  }
}

function startWorldAttack() {
  if (combatState) return;
  if (gameMode === "tavern") {
    showPrompt("No blades in the tavern.");
    return;
  }
  if (!nearbyThreat) {
    showPrompt("No nearby threat to engage.");
    return;
  }
  startCombat(nearbyThreat);
}

function performObserve() {
  if (combatState || minigame) return;
  if (gameMode === "dungeon") {
    const chest = nearestDungeonChest();
    if (chest) {
      showPrompt("A sealed chest waits beyond the old chamber.");
    } else if (nearbyThreat) {
      showPrompt(`${nearbyThreat.kind}: ${nearbyThreat.intent}`);
    } else {
      showPrompt("Dust, old stone, and a stair back to daylight.");
    }
    return;
  }
  if (gameMode !== "world") {
    showPrompt("Take that back outside.");
    return;
  }
  const dc = nearbyThreat ? 12 : 10;
  const result = rollD20("wis", dc, "Observe", { proficient: true, bonus: equippedSkillBonus("Observe") });
  if (result.success) {
    const text = nearbyThreat
      ? `${nearbyThreat.kind}: ${nearbyThreat.intent}`
      : nearestNpc
        ? `${nearestNpc.name} seems ${nearestNpc.mood.toLowerCase()} and tied to ${nearestNpc.hook}.`
        : "You catch fresh tracks, a stronger road line, and the shape of the land.";
    showPrompt(text);
    logEvent("Observe", text);
  } else {
    showPrompt("Nothing beyond the obvious settles into focus.");
  }
}

function performSearch() {
  if (combatState || minigame) return;
  if (gameMode === "dungeon") {
    const chest = nearestDungeonChest();
    if (chest) {
      openDungeonChest();
    } else {
      showPrompt("You turn up only grit and old mortar.");
    }
    return;
  }
  if (gameMode !== "world") {
    showPrompt("There is not much to search in arm's reach here.");
    return;
  }
  const dc = 11;
  const result = rollD20("int", dc, "Search", { proficient: true, bonus: equippedSkillBonus("Search") });
  if (result.success) {
    const gold = 1 + Math.floor(Math.random() * 5);
    player.gold += gold;
    const reward = randomChoice(Math.random, ["herbs", "a tucked coin purse", "a clean trail mark", "a useful scrap of cord"]);
    showPrompt(`You find ${reward} and ${gold} gold.`);
    logEvent("Search", `Found ${reward} and ${gold} gold.`);
  } else {
    showPrompt("You turn up only dust and old boot prints.");
  }
  updateHud();
}

function campAction() {
  if (combatState || minigame) return;
  if (gameMode === "dungeon") {
    showPrompt("This is a bad place to lower your guard.");
    return;
  }
  if (gameMode !== "world") {
    shortRest();
    showPrompt("You take a breather by the hearth.");
    return;
  }
  advanceWorldTime(80);
  shortRest();
  player.secondWindUsed = false;
  player.actionSurgeUsed = false;
  showPrompt("You take a field rest and reorganize your kit.");
  updateHud();
}

function freeSkillCheck() {
  if (combatState || minigame) return;
  const checks = [
    ["str", "Athletics test"],
    ["dex", "Dexterity drill"],
    ["con", "Endurance check"],
    ["int", "Investigation pulse"],
    ["wis", "Perception sweep"],
    ["cha", "Presence check"],
  ];
  const [ability, label] = checks[freeCheckIndex % checks.length];
  freeCheckIndex += 1;
  const dc = 10 + (freeCheckIndex % 4);
  const result = rollD20(ability, dc, label, { proficient: true });
  showPrompt(`${label}: ${result.total} vs DC ${dc}.`);
}

function resetMap() {
  worldSeed = Math.floor(Math.random() * 1000000);
  chunks.clear();
  visibleChunkKeys.clear();
  worldLayout = buildWorldLayout(worldSeed);
  worldModel = buildVillageModel(worldSeed);
  dungeonSite = buildDungeonSite(worldSeed);
  dungeonState = buildDungeonState(worldSeed);
  activeQuests = [];
  availableQuests = [];
  completedQuestIds = new Set();
  questIdCounter = 0;
  createTavernPatrons();
  pickQuestTemplates();
  gameMode = "world";
  worldClock = 8 * 60;
  activeNpc = null;
  nearestNpc = null;
  nearbyThreat = null;
  combatState = null;
  diceOverlay = null;
  currentChunkId = "";
  queuedDirection = null;
  player.x = TILE / 2;
  player.y = TILE / 2;
  player.fromX = TILE / 2;
  player.fromY = TILE / 2;
  player.targetX = TILE / 2;
  player.targetY = TILE / 2;
  player.moveProgress = 0;
  player.moving = false;
  player.facing = "down";
  player.walkClock = 0;
  player.tempAc = 0;
  player.secondWindUsed = false;
  player.actionSurgeUsed = false;
  ui.eventLog.innerHTML = "";
  closeNpc();
  closeQuestPanel();
  closeMinigame();
  closeCombat();
  toggleInventoryPanel(false);
  preloadChunks();
  updateHud();
  updateQuestTracker();
  checkArea();
  logEvent("Seed", `Generated map ${worldSeed}.`);
}

function gameLoop(now) {
  const delta = Math.min(0.05, (now - lastTime) / 1000);
  lastTime = now;

  movePlayer(delta);
  if (gameMode === "world") {
    preloadChunks();
    checkArea();
  }
  updateNearestNpc();
  updateQuestTrackerIfNeeded();
  updateNpcSpeech(delta);
  updateWorldMovement(delta);
  updateMinigame(delta);
  updateDiceOverlay(delta);
  render();

  if (promptTimer > 0) {
    promptTimer -= delta;
  }

  requestAnimationFrame(gameLoop);
}

window.addEventListener("resize", resize);

window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  if (event.target?.tagName === "INPUT" && key !== "escape") return;
  if (key === "i") {
    event.preventDefault();
    toggleInventoryPanel();
    return;
  }
  if (inventoryVisible && key !== "escape") {
    event.preventDefault();
    return;
  }
  if (key === "+" || key === "=") {
    event.preventDefault();
    zoomBy(1.2);
    return;
  }
  if (key === "-" || key === "_") {
    event.preventDefault();
    zoomBy(1 / 1.2);
    return;
  }
  if (key in movementKeys) {
    queuedDirection = movementKeys[key];
    keys.add(key);
    event.preventDefault();
  }
  if (key === "1") {
    event.preventDefault();
    performObserve();
  }
  if (key === "2") {
    event.preventDefault();
    performSearch();
  }
  if (key === "3") {
    event.preventDefault();
    startWorldAttack();
  }
  if (key === "4") {
    event.preventDefault();
    campAction();
  }
  if (key === "5") {
    event.preventDefault();
    freeSkillCheck();
  }
  if (key === " ") {
    event.preventDefault();
    if (combatState && combatState.turn === "player" && !combatState.resolved) {
      combatStrike();
    } else if (minigame && minigame.type === "mash") {
      handleMash();
    } else if (!event.repeat) {
      if (minigame && minigame.type === "timing") handleTimingStop();
      else if (minigame && minigame.type === "stack") handleStackDrop();
      else interactWithNearestOrActive();
    }
  }
  if (key === "e" && nearestNpc) {
    if (gameMode === "tavern" && nearestNpc === tavernkeeper) openQuestPanel();
    else openNpc(nearestNpc);
  }
  if (key === "escape") {
    toggleInventoryPanel(false);
    closeNpc();
    closeQuestPanel();
    closeMinigame();
    closeCombat();
  }
});

window.addEventListener("keyup", (event) => {
  const key = event.key.toLowerCase();
  keys.delete(key);
  if (movementKeys[key] && queuedDirection === movementKeys[key] && !directionIsHeld(queuedDirection)) {
    queuedDirection = null;
  }
});

canvas.addEventListener("pointerdown", (event) => {
  const cam = camera();
  const wx = event.clientX / cameraZoom + cam.x;
  const wy = event.clientY / cameraZoom + cam.y;
  if (gameMode === "dungeon") {
    const chest = nearestDungeonChest();
    if (chest && Math.hypot(chest.x - wx, chest.y - wy) < 28) {
      openDungeonChest();
      return;
    }
    const hostile = nearestDungeonHostile();
    if (hostile && Math.hypot(hostile.x - wx, hostile.y - wy) < 28) {
      startCombat(hostile);
      return;
    }
    if (isNearDungeonExit() && Math.hypot(dungeonState.entrance.x - wx, dungeonState.entrance.y - wy) < 30) {
      leaveDungeon();
    }
    return;
  }
  if (gameMode === "tavern") {
    const actor = nearestTavernActor();
    if (actor && Math.hypot(actor.x - wx, actor.y - wy) < 30) {
      if (actor === tavernkeeper) openQuestPanel();
      else quickSpeak(actor);
    }
    return;
  }
  const objective = nearestQuestObjective();
  if (objective && Math.hypot(objective.x - wx, objective.y - wy) < 34) {
    startObjective(objective);
    return;
  }
  if (dungeonSite && Math.hypot(dungeonSite.x - wx, dungeonSite.y - wy) < 32 && Math.hypot(dungeonSite.x - player.x, dungeonSite.y - player.y) < 92) {
    enterDungeon();
    return;
  }
  for (const key of visibleChunkKeys) {
    const chunk = chunks.get(key);
    if (!chunk) continue;
    for (const hostile of chunk.hostiles || []) {
      if (!hostile.defeated && Math.hypot(hostile.x - wx, hostile.y - wy) < 28 && Math.hypot(hostile.x - player.x, hostile.y - player.y) < 92) {
        startCombat(hostile);
        return;
      }
    }
  }
  for (const key of visibleChunkKeys) {
    const chunk = chunks.get(key);
    if (!chunk) continue;
    for (const npc of chunk.npcs) {
      if (Math.hypot(npc.x - wx, npc.y - wy) < 28 && Math.hypot(npc.x - player.x, npc.y - player.y) < 92) {
        openNpc(npc);
        return;
      }
    }
  }
});

document.getElementById("closeNpc").addEventListener("click", closeNpc);
document.getElementById("talkButton").addEventListener("click", npcTalk);
document.getElementById("rumorButton").addEventListener("click", npcRumor);
document.getElementById("tradeButton").addEventListener("click", npcTrade);
document.getElementById("trainButton").addEventListener("click", npcTrain);
document.getElementById("insightButton").addEventListener("click", npcInsight);
document.getElementById("aidButton").addEventListener("click", npcAid);
document.getElementById("restButton").addEventListener("click", shortRest);
document.getElementById("resetMapButton").addEventListener("click", resetMap);
document.getElementById("zoomInButton").addEventListener("click", () => zoomBy(1.2));
document.getElementById("zoomOutButton").addEventListener("click", () => zoomBy(1 / 1.2));
document.getElementById("inventoryToggleButton").addEventListener("click", () => toggleInventoryPanel());
document.getElementById("toggleKitButton").addEventListener("click", () => toggleInventoryPanel(false));
document.getElementById("kitBackdrop").addEventListener("click", () => toggleInventoryPanel(false));
document.getElementById("closeQuest").addEventListener("click", closeQuestPanel);
document.getElementById("closeMinigame").addEventListener("click", closeMinigame);
document.getElementById("worldObserveButton").addEventListener("click", performObserve);
document.getElementById("worldSearchButton").addEventListener("click", performSearch);
document.getElementById("worldAttackButton").addEventListener("click", startWorldAttack);
document.getElementById("worldCampButton").addEventListener("click", campAction);
document.getElementById("worldRollButton").addEventListener("click", freeSkillCheck);
document.getElementById("closeCombat").addEventListener("click", closeCombat);
document.getElementById("combatStrikeButton").addEventListener("click", combatStrike);
document.getElementById("combatShotButton").addEventListener("click", combatShot);
document.getElementById("combatBraceButton").addEventListener("click", combatBrace);
document.getElementById("combatSurgeButton").addEventListener("click", combatSurge);
document.getElementById("combatItemButton").addEventListener("click", combatItem);
document.getElementById("combatFleeButton").addEventListener("click", combatFlee);

resize();
worldLayout = buildWorldLayout(worldSeed);
worldModel = buildVillageModel(worldSeed);
dungeonSite = buildDungeonSite(worldSeed);
dungeonState = buildDungeonState(worldSeed);
createTavernPatrons();
pickQuestTemplates();
preloadChunks();
updateHud();
toggleInventoryPanel(false);
updateQuestTracker();
checkArea();
logEvent("Begin", "A road sign creaks above the green as Waymark Vale wakes around you.");
requestAnimationFrame(gameLoop);
