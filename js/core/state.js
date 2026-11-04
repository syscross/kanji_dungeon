/* Global config (persisted settings), run state, and localStorage persistence. */

const STORAGE = {
  keys: "kd_keys",
  legacyKey: "kd_apikey",
  provider: "kd_provider",
  endpoint: "kd_custom_endpoint",
  model: "kd_model",
  instMode: "kd_inst_mode",
  customInst: "kd_custom_inst",
  lang: "kd_lang",
  achievements: "kd_achievements",
  seenFoes: "kd_seen_foes",
  stats: "kd_stats",
  records: "kd_records",
  savedRun: "kd_saved_run"
};

const RUN_VERSION = 3; // bump when the saved-run shape changes; older saves are discarded

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (_) {
    return fallback;
  }
}

let KANKEN_DATA = {};
let currentView = "title";

let savedKeys = readJson(STORAGE.keys, {});
// Migrate the pre-multi-provider single key (it was always a Gemini key).
const legacyKey = localStorage.getItem(STORAGE.legacyKey);
if (legacyKey) {
  if (!savedKeys.gemini) savedKeys.gemini = legacyKey;
  localStorage.setItem(STORAGE.keys, JSON.stringify(savedKeys));
  localStorage.removeItem(STORAGE.legacyKey);
}

const initialProvider = localStorage.getItem(STORAGE.provider) || "free_keyless";

let config = {
  provider: initialProvider,
  apiKey: savedKeys[initialProvider] || "",
  customEndpoint: localStorage.getItem(STORAGE.endpoint) || "http://localhost:11434/v1/chat/completions",
  model: localStorage.getItem(STORAGE.model) || "openai",
  instMode: localStorage.getItem(STORAGE.instMode) || "Default",
  customInst: localStorage.getItem(STORAGE.customInst) || "",
  lang: localStorage.getItem(STORAGE.lang) || "KO",
  achievements: readJson(STORAGE.achievements, {}),
  seenFoes: readJson(STORAGE.seenFoes, {}),
  stats: readJson(STORAGE.stats, { kills: 0, runs: 0 }),
  records: readJson(STORAGE.records, {})
};

/*
 * One descent. Each run is completely isolated and starts empty-handed (`deck: []`).
 * `phase` drives what the screen shows:
 *   path ↔ battle → reward | event → boss battle → cleared | dead
 */
function createRunState() {
  return {
    v: RUN_VERSION,
    active: false,
    depthId: "depth_1",
    runNo: 0,
    phase: "path",
    step: 0,                 // 0 at start; steps 1..PATH_STEPS
    sign: "道",              // sign kanji of the current stage
    fork: [],                // [{ sign, outcome, revealed }]
    revealNext: false,
    eventId: null,
    lastEventId: null,
    quizKanji: "",
    offer: [],               // pending spoils [{ id, params }]
    pending: null,           // { mode: "add"|"burn"|"dup"|"scavenge", choices, selected, rest }

    deck: [],                // cards the player has scavenged/kept in their bag this run
    stageCards: [],          // base environment cards provided by the current stage
    drawPile: [],            // [{ kanji, source: "bag"|"stage" }]
    discard: [],             // [{ kanji, source: "bag"|"stage" }]
    draftOffer: [],
    playerHand: [],          // ["火", ...]
    playerHandSources: [],   // ["bag"|"stage", ...] matching playerHand indices
    enemyHand: [],           // 1-2 telegraphed Intent Kanji for the foe

    maxHp: 100,
    playerHp: 100,
    rerollTokens: 1,         // start with 1 free reroll token
    summonCost: 10,          // escalates for the whole descent; spoils / shrines reset it

    runBoss: "",             // the boss assigned to this run
    bossEncountered: false,  // true once the player has laid eyes on runBoss this run
    enemyKanji: "",
    enemyRank: "normal",
    enemyHp: 0,
    enemyMaxHp: 0,
    seenEnemies: [],         // legacy compat: defeated enemies
    encounteredEnemies: [],  // enemies encountered in this run (shown gray if not yet killed)
    defeatedEnemies: [],     // enemies killed in this run (shown red, never respawn this run)
    woundedEnemies: {},      // { [kanji]: remainingHp } for foes escaped from in this run
    lastKill: null,          // { kanji, turns, dmgTaken } for the kill card
    turn: 1,                 // turns against the current foe
    totalTurns: 0,
    fights: 0,
    kills: 0,
    dmgTakenThisEnemy: 0,
    offlineTurns: 0,

    fieldState: "",
    playerState: "",
    enemyState: "",
    elapsedSec: 0,
    history: [],             // log entries of this run, replayed after a reload
    recentActions: [],
    trialNudgeShown: false,
    runAchievements: []
  };
}

let state = createRunState();

function persistConfig() {
  localStorage.setItem(STORAGE.keys, JSON.stringify(savedKeys));
  localStorage.setItem(STORAGE.provider, config.provider);
  localStorage.setItem(STORAGE.endpoint, config.customEndpoint);
  localStorage.setItem(STORAGE.model, config.model);
  localStorage.setItem(STORAGE.instMode, config.instMode);
  localStorage.setItem(STORAGE.customInst, config.customInst);
}

function persistAchievements() {
  localStorage.setItem(STORAGE.achievements, JSON.stringify(config.achievements));
}

function persistSeenFoes() {
  localStorage.setItem(STORAGE.seenFoes, JSON.stringify(config.seenFoes));
}

function recordFoeEncountered(kanji) {
  if (!kanji) return;
  if (!config.seenFoes[kanji]) {
    config.seenFoes[kanji] = Date.now();
    persistSeenFoes();
  }
}

function persistStats() {
  localStorage.setItem(STORAGE.stats, JSON.stringify(config.stats));
}

function persistRecords() {
  localStorage.setItem(STORAGE.records, JSON.stringify(config.records));
}

function hasActiveRun() {
  return Boolean(state.active && state.playerHp > 0 && KANKEN_DATA[state.depthId]);
}

function saveRunToStorage() {
  if (!state.active || state.playerHp <= 0) localStorage.removeItem(STORAGE.savedRun);
  else localStorage.setItem(STORAGE.savedRun, JSON.stringify(state));
  if (typeof updateSavedRunBanner === "function") updateSavedRunBanner();
}

function loadSavedRunFromStorage() {
  const parsed = readJson(STORAGE.savedRun, null);
  if (parsed && parsed.v === RUN_VERSION && parsed.active && parsed.playerHp > 0 && KANKEN_DATA[parsed.depthId]) {
    state = { ...createRunState(), ...parsed };
  } else if (parsed) {
    localStorage.removeItem(STORAGE.savedRun);
  }
}

function clearSavedRun() {
  state.active = false;
  localStorage.removeItem(STORAGE.savedRun);
  if (typeof updateSavedRunBanner === "function") updateSavedRunBanner();
}

/* Clear records: fastest first, at most 10 per gaol. */
function addClearRecord(depthId, rec) {
  const list = config.records[depthId] || [];
  list.push(rec);
  list.sort((a, b) => a.timeSec - b.timeSec);
  config.records[depthId] = list.slice(0, 10);
  persistRecords();
}

function bestRecord(depthId) {
  return (config.records[depthId] || [])[0] || null;
}

function depthNumber(depthId) {
  return parseInt(String(depthId).replace("depth_", ""), 10) || 1;
}

function depthNumStr(depthId) {
  return String(depthNumber(depthId)).padStart(2, "0");
}

function randInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function sample(arr, n) {
  const copy = [...arr];
  const out = [];
  for (let i = 0; i < n && copy.length > 0; i++) {
    out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
  }
  return out;
}

function weightedPick(pairs) {
  const total = pairs.reduce((s, [, w]) => s + w, 0);
  let r = Math.random() * total;
  for (const [v, w] of pairs) {
    if ((r -= w) < 0) return v;
  }
  return pairs[pairs.length - 1][0];
}
