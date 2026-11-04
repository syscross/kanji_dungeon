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
  scores: "kd_scores",
  achievements: "kd_achievements",
  stats: "kd_stats",
  savedRun: "kd_saved_run"
};

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
  model: localStorage.getItem(STORAGE.model) || (initialProvider === "free_keyless" ? "openai" : "gemini-flash-lite-latest"),
  instMode: localStorage.getItem(STORAGE.instMode) || "Default",
  customInst: localStorage.getItem(STORAGE.customInst) || "",
  lang: localStorage.getItem(STORAGE.lang) || "KO",
  scores: readJson(STORAGE.scores, {}),
  achievements: readJson(STORAGE.achievements, {}),
  stats: readJson(STORAGE.stats, { kills: 0 })
};

function createRunState() {
  return {
    active: false,
    depthId: "depth_1",
    turn: 1,               // turn counter against the current enemy
    streak: 0,
    summonCost: 10,
    playerHp: 100,
    enemyHp: 100,
    enemyKanji: "犬",
    fieldState: "Pitch-Black Dungeon",
    playerState: "Normal",
    enemyState: "Hostile",
    playerHand: [],
    enemyHand: [],
    elapsedSec: 0,
    history: [],           // full turn logs (for export / resume)
    recentActions: [],     // last few player inputs, sent to the GM to discourage repetition
    dmgTakenThisEnemy: 0,
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

function persistStats() {
  localStorage.setItem(STORAGE.stats, JSON.stringify(config.stats));
}

function persistScores() {
  localStorage.setItem(STORAGE.scores, JSON.stringify(config.scores));
}

function hasActiveRun() {
  return Boolean(state.active && state.playerHp > 0 && KANKEN_DATA[state.depthId]);
}

function saveRunToStorage() {
  if (!state.active || state.playerHp <= 0) {
    localStorage.removeItem(STORAGE.savedRun);
  } else {
    localStorage.setItem(STORAGE.savedRun, JSON.stringify(state));
  }
  if (typeof updateSavedRunBanner === "function") updateSavedRunBanner();
}

function loadSavedRunFromStorage() {
  const parsed = readJson(STORAGE.savedRun, null);
  if (parsed && parsed.active && parsed.playerHp > 0 && KANKEN_DATA[parsed.depthId]) {
    state = { ...createRunState(), ...parsed };
  }
}

function clearSavedRun() {
  state.active = false;
  localStorage.removeItem(STORAGE.savedRun);
  if (typeof updateSavedRunBanner === "function") updateSavedRunBanner();
}

function getScore(depthId, mode) {
  return (config.scores[depthId] && config.scores[depthId][mode]) || 0;
}

function recordStreakScore(depthId) {
  if (!config.scores[depthId]) config.scores[depthId] = {};
  const cur = config.scores[depthId][config.instMode] || 0;
  if (state.streak > cur) {
    config.scores[depthId][config.instMode] = state.streak;
    persistScores();
  }
}

function depthNumber(depthId) {
  return parseInt(String(depthId).replace("depth_", ""), 10) || 1;
}

function depthNumStr(depthId) {
  return String(depthNumber(depthId)).padStart(2, "0");
}

/* "01 — 拾ノ獄 (Kanken 10)" -> "拾ノ獄 (Kanken 10)" */
function depthCleanTitle(depthId) {
  const d = KANKEN_DATA[depthId];
  return d ? d.title.replace(/^(Depth\s*)?\d+\s*—\s*/i, "") : depthId;
}

/* "01 — 拾ノ獄 (Kanken 10)" -> "拾ノ獄" */
function depthShortName(depthId) {
  return depthCleanTitle(depthId).replace(/\s*\(.*\)\s*$/, "");
}
