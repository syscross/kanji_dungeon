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
  savedRun: "kd_saved_run",
  savedStoryRun: "kd_saved_story_run",
  storyState: "kd_story_state"
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
let activeGameMode = "arcade"; // "story" | "arcade"

const STORY_STATE_VERSION = 2;

function createDefaultStoryState() {
  return {
    v: STORY_STATE_VERSION,
    started: false,
    unlockedDepth: 0,        // 0 = only Village (里) open; 1 = 01 獄門 (10급) unlocked after village intro
    introStage: 0,           // 0 = arrived at ruined hometown, 1 = spoke to Sensei, 2 = received 生 talisman & 01 獄門 location
    senseiOfferingStage: 0,  // 0 -> 1 (持 talisman) -> 2 (帰 bell) -> 3+ (tea/incense blessing)
    senseiBlessedNextRun: false,
    elderRelicClaimed: false,
    yen: 0,
    deck: [],
    specialItems: [],
    defeatedFoes: [],
    defeatedBosses: [],
    encounteredFoes: [],
    gaolBosses: {},
    humanEndingSeen: false,
    shuraEndingSeen: false,
    visitedDepth11: false,
    visitedDepth12: false,
    catRescued: false,
    catBlessedNextRun: false,
    friendGiftClaimed: false,
    metNpcs: [],
    villageVisits: 0
  };
}

function loadStoryStateFromStorage() {
  const saved = readJson(STORAGE.storyState, null);
  if (!saved || typeof saved !== "object") {
    return createDefaultStoryState();
  }
  const def = createDefaultStoryState();
  // Safe migration: preserve any existing player progress (unlocked depths, relics, kills, yen, deck, cat)
  const validNpcs = ["先", "老", "友", "猫", "女", "男"];
  const migratedNpcs = Array.isArray(saved.metNpcs)
    ? saved.metNpcs.filter(k => validNpcs.includes(k))
    : [];
  if (saved.introStage > 0 && !migratedNpcs.includes("先")) migratedNpcs.push("先");
  if (saved.elderRelicClaimed && !migratedNpcs.includes("老")) migratedNpcs.push("老");
  if (saved.friendGiftClaimed && !migratedNpcs.includes("友")) migratedNpcs.push("友");
  if (saved.catRescued && !migratedNpcs.includes("猫")) migratedNpcs.push("猫");
  return {
    ...def,
    ...saved,
    v: STORY_STATE_VERSION,
    yen: typeof saved.yen === "number" ? saved.yen : def.yen,
    deck: Array.isArray(saved.deck) ? saved.deck : def.deck,
    specialItems: Array.isArray(saved.specialItems) ? saved.specialItems : def.specialItems,
    defeatedFoes: Array.isArray(saved.defeatedFoes) ? saved.defeatedFoes : def.defeatedFoes,
    defeatedBosses: Array.isArray(saved.defeatedBosses) ? saved.defeatedBosses : def.defeatedBosses,
    metNpcs: migratedNpcs,
    unlockedDepth: typeof saved.unlockedDepth === "number" ? saved.unlockedDepth : def.unlockedDepth
  };
}

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
  records: readJson(STORAGE.records, {}),
  story: loadStoryStateFromStorage()
};

/*
 * One descent.
 * `phase` drives what the screen shows:
 *   path ↔ battle → reward | event → boss battle → cleared | dead
 */
function createRunState() {
  return {
    v: RUN_VERSION,
    gameMode: activeGameMode || "arcade",
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
    eventNpcKanji: "",
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
    freeSummons: 0,          // free Ancient God summon tokens
    summonCost: 10,          // fixed at 10 HP per summon

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

function isStoryMode() {
  return (state && state.active ? state.gameMode : activeGameMode) === "story";
}

function persistStoryState() {
  if (!config.story) config.story = createDefaultStoryState();
  localStorage.setItem(STORAGE.storyState, JSON.stringify(config.story));
}

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
  if (isStoryMode() && config.story) {
    if (!Array.isArray(config.story.encounteredFoes)) config.story.encounteredFoes = [];
    if (!config.story.encounteredFoes.includes(kanji)) {
      config.story.encounteredFoes.push(kanji);
      persistStoryState();
    }
  }
}

function persistStats() {
  localStorage.setItem(STORAGE.stats, JSON.stringify(config.stats));
}

function persistRecords() {
  localStorage.setItem(STORAGE.records, JSON.stringify(config.records));
}

function hasActiveRun() {
  return Boolean(state.active && state.playerHp > 0 && (state.depthId === "depth_0" || KANKEN_DATA[state.depthId]));
}

function getSavedArcadeRun() {
  const parsed = readJson(STORAGE.savedRun, null);
  if (parsed && parsed.v === RUN_VERSION && parsed.active && parsed.playerHp > 0 && KANKEN_DATA[parsed.depthId]) {
    return parsed;
  }
  return null;
}

/* Story Mode only treats an UNRETURNED mid-gaol expedition (depth_1..depth_12) as a resumable/abandonable active dungeon run! */
function getSavedStoryRun() {
  const parsed = readJson(STORAGE.savedStoryRun, null);
  if (
    parsed &&
    parsed.v === RUN_VERSION &&
    parsed.active &&
    parsed.depthId !== "depth_0" &&
    parsed.playerHp > 0 &&
    !["returned", "cleared", "dead", "abandoned"].includes(parsed.phase) &&
    KANKEN_DATA[parsed.depthId]
  ) {
    return parsed;
  }
  return null;
}

function hasActiveArcadeRun() {
  if (state.active && state.gameMode === "arcade" && state.playerHp > 0 && KANKEN_DATA[state.depthId]) {
    return true;
  }
  return Boolean(getSavedArcadeRun());
}

function hasActiveStoryDungeonRun() {
  if (
    state.active &&
    state.gameMode === "story" &&
    state.depthId !== "depth_0" &&
    state.playerHp > 0 &&
    !["returned", "cleared", "dead", "abandoned"].includes(state.phase) &&
    KANKEN_DATA[state.depthId]
  ) {
    return true;
  }
  return Boolean(getSavedStoryRun());
}

function cleanRunForStorage(runObj) {
  if (!runObj || typeof runObj !== "object") return null;
  const clone = { ...runObj };
  // Truncate run history in localStorage to 50 entries to prevent quota overflow
  if (Array.isArray(clone.history) && clone.history.length > 50) {
    clone.history = clone.history.slice(-50);
  }
  return clone;
}

function saveRunToStorage() {
  const mode = state.gameMode || activeGameMode || "arcade";
  if (mode === "story") {
    if (
      !state.active ||
      state.depthId === "depth_0" ||
      state.playerHp <= 0 ||
      ["returned", "cleared", "dead", "abandoned"].includes(state.phase)
    ) {
      localStorage.removeItem(STORAGE.savedStoryRun);
    } else {
      const cleaned = cleanRunForStorage(state);
      try {
        localStorage.setItem(STORAGE.savedStoryRun, JSON.stringify(cleaned));
      } catch (_e) {
        // Quota exceeded emergency fallback: drop history completely
        if (cleaned) {
          cleaned.history = [];
          localStorage.setItem(STORAGE.savedStoryRun, JSON.stringify(cleaned));
        }
      }
    }
    persistStoryState();
  } else {
    if (!state.active || state.playerHp <= 0) {
      localStorage.removeItem(STORAGE.savedRun);
    } else {
      const cleaned = cleanRunForStorage(state);
      try {
        localStorage.setItem(STORAGE.savedRun, JSON.stringify(cleaned));
      } catch (_e) {
        if (cleaned) {
          cleaned.history = [];
          localStorage.setItem(STORAGE.savedRun, JSON.stringify(cleaned));
        }
      }
    }
  }
  if (typeof updateSavedRunBanner === "function") updateSavedRunBanner();
}

function loadSavedRunFromStorage() {
  const storyRun = getSavedStoryRun();
  const arcadeRun = getSavedArcadeRun();
  if (storyRun) {
    activeGameMode = "story";
    state = { ...createRunState(), ...storyRun, gameMode: "story" };
  } else if (arcadeRun) {
    activeGameMode = "arcade";
    state = { ...createRunState(), ...arcadeRun, gameMode: "arcade" };
  } else {
    localStorage.removeItem(STORAGE.savedStoryRun);
  }
}

function clearSavedRun(targetMode = null) {
  const mode = targetMode || state.gameMode || activeGameMode || "arcade";
  if (state.gameMode === mode) {
    state.active = false;
  }
  if (mode === "story") {
    localStorage.removeItem(STORAGE.savedStoryRun);
  } else {
    localStorage.removeItem(STORAGE.savedRun);
  }
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
  if (depthId === "depth_0") return 0;
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
