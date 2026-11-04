const DEFAULT_GM_RULES = `1. Judge the Player's action using ONLY Kanji present in their 5 Drawn Cards. If they lie about a Kanji's meaning or use unheld Kanji, mock them and deal 0 damage.
2. Normal attack damage is 15~45. If the player is absurdly greedy without matching Kanji (like 百/千), call out "Too greedy!" and scale damage to 15~38.
3. Reward clever Kanji combinations, healing (休/水/生/草/林 etc.), defense, or preemptively countering the Enemy's 5 visible cards!
4. If the enemy survives, the Enemy counterattacks using 1~3 Kanji from the Enemy's current hand.
5. Keep your narrative punchy and concise (2~4 sentences max).`;

let KANKEN_DATA = {};
let currentView = "title";
let guidePageIdx = 0;
let kbIndex = 0;

let savedKeys = JSON.parse(localStorage.getItem("kd_keys") || "{}");
const legacyKey = localStorage.getItem("kd_apikey");
if (legacyKey && !savedKeys.gemini) savedKeys.gemini = legacyKey;

const initialProvider = localStorage.getItem("kd_provider") || (legacyKey ? "gemini" : "free_keyless");

let config = {
  provider: initialProvider,
  apiKey: "",
  customEndpoint: localStorage.getItem("kd_custom_endpoint") || "http://localhost:11434/v1/chat/completions",
  model: localStorage.getItem("kd_model") || (initialProvider === "free_keyless" ? "openai" : "gemini-flash-lite-latest"),
  instMode: localStorage.getItem("kd_inst_mode") || "Default",
  customInst: localStorage.getItem("kd_custom_inst") || "",
  lang: localStorage.getItem("kd_lang") || "KO",
  scores: JSON.parse(localStorage.getItem("kd_scores") || "{}"),
  achievements: JSON.parse(localStorage.getItem("kd_achievements") || "{}")
};
config.apiKey = savedKeys[config.provider] || legacyKey || "";

let state = {
  active: false,
  depthId: "depth_1",
  turn: 1,
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
  prevPlayerHand: [],
  prevEnemyHand: [],
  elapsedSec: 0,
  history: [],
  runAchievements: []
};

async function initApp() {
  startEmberCanvas();
  syncSoundBtn();
  document.getElementById("s-default-inst").value = DEFAULT_GM_RULES;

  const pSel = document.getElementById("s-provider");
  pSel.innerHTML = "";
  Object.entries(PROVIDERS).forEach(([k, v]) => {
    const opt = document.createElement("option");
    opt.value = k;
    opt.textContent = v.name;
    pSel.appendChild(opt);
  });

  syncSettingsUI();

  const res = await fetch("./kanken_data.json");
  KANKEN_DATA = await res.json();

  loadSavedRunFromStorage();
  renderDepthSpine();
  applyLocalization();
  setupKeyboardNavigation();

  document.addEventListener("click", (e) => {
    const dd = document.getElementById("lang-dropdown");
    if (dd && !dd.contains(e.target)) dd.classList.remove("open");
  });

  window.addEventListener("popstate", () => {
    if (anyModalOpen()) {
      closeAllModals();
      return;
    }
    if (currentView === "battle") {
      pauseRunToTitle();
    } else if (currentView !== "title") {
      switchDomView("title", false);
    }
  });

  setInterval(() => {
    if (currentView === "battle" && state.active && state.playerHp > 0 && !anyModalOpen()) {
      state.elapsedSec = (state.elapsedSec || 0) + 1;
      updateTimerBadge();
    }
  }, 1000);
}

function formatTime(sec) {
  const m = String(Math.floor((sec || 0) / 60)).padStart(2, "0");
  const s = String((sec || 0) % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function updateTimerBadge() {
  const el = document.getElementById("b-timer");
  if (el) el.textContent = `⏱ ${formatTime(state.elapsedSec)}`;
}

function showToast(msg) {
  document.getElementById("global-toast").textContent = msg;
}

/* Achievements */
function unlockAchievement(id) {
  const ach = ACHIEVEMENTS.find(a => a.id === id);
  if (!ach) return;
  if (!state.runAchievements.includes(id)) state.runAchievements.push(id);
  if (config.achievements[id]) return;

  config.achievements[id] = Date.now();
  localStorage.setItem("kd_achievements", JSON.stringify(config.achievements));
  updateAchCounter();

  const toast = document.getElementById("ach-toast");
  toast.textContent = `🏆 업적 달성: ${ach.icon} ${ach.name}`;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3400);
}

function updateAchCounter() {
  const unlockedCount = Object.keys(config.achievements).length;
  const btn = document.getElementById("ach-corner-btn");
  if (btn) btn.textContent = `${t("achBtn")} (${unlockedCount}/${ACHIEVEMENTS.length})`;
}

function openAchievementsModal() {
  playClickSfx();
  const grid = document.getElementById("ach-grid");
  grid.innerHTML = "";
  ACHIEVEMENTS.forEach(a => {
    const isUnlocked = Boolean(config.achievements[a.id]);
    const item = document.createElement("div");
    item.className = "ach-item" + (isUnlocked ? " unlocked" : "");
    item.innerHTML = `
      <div class="ach-name">${a.icon} ${a.name} ${isUnlocked ? "✓" : "🔒"}</div>
      <div class="ach-desc">${a.desc}</div>
    `;
    grid.appendChild(item);
  });
  document.getElementById("ach-modal").classList.add("active");
}

/* Guide Modal */
function openGuideModal() {
  playClickSfx();
  guidePageIdx = 0;
  renderGuidePage();
  document.getElementById("guide-modal").classList.add("active");
}

function stepGuidePage(delta) {
  playClickSfx();
  guidePageIdx = (guidePageIdx + delta + GUIDE_PAGES.length) % GUIDE_PAGES.length;
  renderGuidePage();
}

function renderGuidePage() {
  const p = GUIDE_PAGES[guidePageIdx];
  document.getElementById("guide-page-title").textContent = `📖 ${p.title}`;
  document.getElementById("guide-page-body").innerHTML = formatGmText(p.body);
}

/* Settings Modal (Popup overlay — never interrupts active battle!) */
function openSettingsModal() {
  playClickSfx();
  syncSettingsUI();
  document.getElementById("settings-modal").classList.add("active");
}

function closeSettingsModal() {
  playClickSfx();
  document.getElementById("settings-modal").classList.remove("active");
}

function anyModalOpen() {
  return document.querySelectorAll(".modal-backdrop.active").length > 0;
}

function closeAllModals() {
  document.querySelectorAll(".modal-backdrop.active").forEach(m => m.classList.remove("active"));
}

/* Run Persistence */
function saveRunToStorage() {
  if (!state.active || state.playerHp <= 0) {
    localStorage.removeItem("kd_saved_run");
  } else {
    localStorage.setItem("kd_saved_run", JSON.stringify(state));
  }
  updateSavedRunBanner();
}

function loadSavedRunFromStorage() {
  try {
    const raw = localStorage.getItem("kd_saved_run");
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.active && parsed.playerHp > 0 && KANKEN_DATA[parsed.depthId]) {
      state = { ...state, ...parsed };
    }
  } catch (_) {}
  updateSavedRunBanner();
}

function clearSavedRun() {
  state.active = false;
  localStorage.removeItem("kd_saved_run");
  updateSavedRunBanner();
}

function updateSavedRunBanner() {
  const banner = document.getElementById("saved-run-banner");
  if (!banner) return;
  if (state.active && state.playerHp > 0 && KANKEN_DATA[state.depthId]) {
    const dTitle = KANKEN_DATA[state.depthId].title;
    banner.textContent = t("ongoingBadge")(dTitle, state.turn, state.playerHp);
    banner.classList.add("show");
  } else {
    banner.classList.remove("show");
  }
}

function handlePlayGameClick() {
  playClickSfx();
  if (state.active && state.playerHp > 0 && KANKEN_DATA[state.depthId]) {
    resumeSavedRun();
  } else {
    transitionToView("select", "奈落選択", "CHOOSE YOUR DEPTH (01 — 12)");
  }
}

function resumeSavedRun() {
  const d = KANKEN_DATA[state.depthId];
  clearGmLog(false);
  updateBattleHUD(true);
  if (state.history.length > 0) {
    state.history.slice(-6).forEach(h => appendGmLog(h));
  } else {
    appendGmLog(t("enteredMsg")(d.title, state.enemyKanji), "sys-log");
  }
  transitionToView("battle", "探索再開", `RESUMING ${d.title} (TURN ${state.turn})`);
}

function pauseRunToTitle() {
  saveRunToStorage();
  transitionToView("title", "一時中断", "RUN SAVED — CLICK PLAY GAME TO RESUME");
}

function promptAbandonRun() {
  playClickSfx();
  openConfirmModal(t("abandonModalTitle"), t("abandonModalDesc"), () => {
    showGameOverModal(true);
  });
}

function showGameOverModal(wasAbandoned = false) {
  const dTitle = KANKEN_DATA[state.depthId] ? KANKEN_DATA[state.depthId].title : state.depthId;
  const savedDepth = state.depthId;
  clearSavedRun();

  document.getElementById("go-title").textContent = wasAbandoned
    ? "【원정 포기 — RUN ABANDONED】"
    : "【死 — YOU HAVE MET YOUR DEMISE】";

  const achNames = state.runAchievements
    .map(id => ACHIEVEMENTS.find(a => a.id === id))
    .filter(Boolean)
    .map(a => `${a.icon} ${a.name}`)
    .join(", ") || "None";

  document.getElementById("go-stats").innerHTML = formatGmText(
    `• **계층 (Depth)**: ${dTitle}\n` +
    `• **마주한 보스 (Boss)**: 【${state.enemyKanji}】 (HP: ${state.enemyHp}/100)\n` +
    `• **연속 처치 (Streak)**: 🔥 ${state.streak} Kills (Mode: ${config.instMode})\n` +
    `• **진행 턴 / 소요 시간**: ${state.turn} Turns · ⏱ ${formatTime(state.elapsedSec)}\n` +
    `• **달성 업적**: ${achNames}`
  );

  document.getElementById("go-retry-btn").onclick = () => {
    document.getElementById("gameover-modal").classList.remove("active");
    startRun(savedDepth, savedDepth.replace("depth_", "").padStart(2, "0"), dTitle);
  };

  document.getElementById("gameover-modal").classList.add("active");
}

function closeGameOverToTitle() {
  playClickSfx();
  document.getElementById("gameover-modal").classList.remove("active");
  transitionToView("title");
}

function toggleLangMenu(e) {
  e.stopPropagation();
  playClickSfx();
  document.getElementById("lang-dropdown").classList.toggle("open");
}

function selectLanguage(langCode, e) {
  if (e) e.stopPropagation();
  playClickSfx();
  config.lang = langCode;
  localStorage.setItem("kd_lang", langCode);
  document.getElementById("lang-dropdown").classList.remove("open");
  applyLocalization();
}

function handleBrandClick() {
  playClickSfx();
  if (currentView === "title") return;
  if (currentView === "battle") {
    pauseRunToTitle();
  } else {
    transitionToView("title");
  }
}

function transitionToView(viewName, curtainKanji = null, curtainSub = "") {
  playClickSfx();
  const curtain = document.getElementById("cinematic-curtain");
  if (curtainKanji) {
    playGongSfx();
    document.getElementById("curtain-title").textContent = curtainKanji;
    document.getElementById("curtain-sub").textContent = curtainSub;
    curtain.classList.add("active");
    setTimeout(() => {
      switchDomView(viewName, true);
      setTimeout(() => curtain.classList.remove("active"), 240);
    }, 330);
  } else {
    switchDomView(viewName, true);
  }
}

function switchDomView(name, pushHist = true) {
  currentView = name;
  kbIndex = 0;
  if (pushHist) {
    history.replaceState({ view: name }, "", name === "title" ? window.location.pathname : `#${name}`);
  }
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.getElementById(`view-${name}`).classList.add("active");
  if (name === "select") renderDepthSpine();
  if (name === "title") updateSavedRunBanner();
}

let modalConfirmCallback = null;
function openConfirmModal(title, desc, onConfirm) {
  document.getElementById("modal-title").textContent = title;
  document.getElementById("modal-desc").textContent = desc;
  modalConfirmCallback = onConfirm;
  document.getElementById("confirm-modal").classList.add("active");
}

function closeConfirmModal(confirmed) {
  playClickSfx();
  document.getElementById("confirm-modal").classList.remove("active");
  if (confirmed && modalConfirmCallback) modalConfirmCallback();
  modalConfirmCallback = null;
}

function promptExitGame() {
  playClickSfx();
  openConfirmModal(t("exitModalTitle"), t("exitModalDesc"), () => {
    playGongSfx();
    const curtain = document.getElementById("cinematic-curtain");
    document.getElementById("curtain-title").textContent = "閉 門";
    document.getElementById("curtain-sub").textContent = "SEVERING CONNECTION... FAREWELL.";
    curtain.classList.add("active");
    setTimeout(() => {
      window.open("", "_self");
      window.close();
      document.getElementById("curtain-sub").textContent = "CONNECTION CLOSED. YOU MAY CLOSE THIS TAB (OR CLICK TO REBOOT).";
      curtain.onclick = () => {
        curtain.onclick = null;
        curtain.classList.remove("active");
        switchDomView("title", false);
      };
    }, 850);
  });
}

function getScore(depthId, mode) {
  return (config.scores[depthId] && config.scores[depthId][mode]) || 0;
}

function recordKill(depthId) {
  if (!config.scores[depthId]) config.scores[depthId] = {};
  const cur = config.scores[depthId][config.instMode] || 0;
  if (state.streak > cur) {
    config.scores[depthId][config.instMode] = state.streak;
    localStorage.setItem("kd_scores", JSON.stringify(config.scores));
  }
}

function renderDepthSpine() {
  const spine = document.getElementById("depth-spine");
  spine.innerHTML = "";
  Object.keys(KANKEN_DATA).forEach((did, idx) => {
    const d = KANKEN_DATA[did];
    const numStr = String(idx + 1).padStart(2, "0");
    const cleanTitle = d.title.replace(/^(Depth\s*)?\d+\s*—\s*/i, "");
    const node = document.createElement("div");
    node.className = "abyss-node";
    node.onclick = () => startRun(did, numStr, cleanTitle);
    node.innerHTML = `
      <div class="node-num">${numStr}</div>
      <div class="node-body">
        <div class="node-title">${cleanTitle}</div>
        <div class="node-meta">${d.count.toLocaleString()} Kanji Pool  |  Bosses: ${d.enemies.slice(0, 8).join(" ")}</div>
        <div class="node-scores">
          🏆 Default: ${getScore(did, "Default")}  ·  🛠 Custom: ${getScore(did, "Custom")}  ·  🧪 Sandbox: ${getScore(did, "Sandbox")}
        </div>
      </div>
    `;
    spine.appendChild(node);
  });
}

function sample5(arr) {
  const copy = [...arr];
  const out = [];
  for (let i = 0; i < 5 && copy.length > 0; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

function startRun(depthId, numStr = "01", cleanTitle = "") {
  if (!config.apiKey && config.provider !== "free_keyless" && config.provider !== "custom") {
    showToast("⚡ Switched to Free Keyless mode for instant play!");
    config.provider = "free_keyless";
    config.model = "openai";
  }
  state.active = true;
  state.depthId = depthId;
  state.streak = 0;
  state.playerHp = 100;
  state.playerState = "Normal";
  state.fieldState = "Pitch-Black Dungeon";
  state.elapsedSec = 0;
  state.history = [];
  state.runAchievements = [];
  if (depthId === "depth_12") unlockAchievement("abyss_12");

  clearGmLog(false);
  spawnNextEnemy(true);
  saveRunToStorage();
  transitionToView("battle", `DEPTH ${numStr}`, cleanTitle || KANKEN_DATA[depthId].title);
}

function spawnNextEnemy(isFirst = false) {
  const d = KANKEN_DATA[state.depthId];
  state.enemyKanji = d.enemies[Math.floor(Math.random() * d.enemies.length)];
  state.enemyHp = 100;
  state.enemyState = "Hostile";
  state.turn = 1;
  state.summonCost = 10;
  state.prevPlayerHand = [];
  state.prevEnemyHand = [];
  dealNewHands(true);

  const msg = isFirst
    ? t("enteredMsg")(d.title, state.enemyKanji)
    : `🩸 Enemy slain! Streak: **🔥 ${state.streak} Kills** (/summon reset to 10 HP)\nNext Challenger: **【${state.enemyKanji}】** (HP: 100/100) emerges!`;
  updateBattleHUD(true);
  appendGmLog(msg, "sys-log");
  saveRunToStorage();
}

function dealNewHands(animate = true) {
  const pool = KANKEN_DATA[state.depthId].kanji;
  if (state.playerHand.length) state.prevPlayerHand = [...state.playerHand];
  if (state.enemyHand.length) state.prevEnemyHand = [...state.enemyHand];
  state.playerHand = sample5(pool);
  state.enemyHand = sample5(pool);
  if (animate) {
    for (let i = 0; i < 5; i++) playCardDealSfx(i * 65);
  }
}

function makeCardEl(k, isEnemy = false, idx = 0, animate = true) {
  const el = document.createElement("div");
  el.className = "kanji-card" + (isEnemy ? " enemy-sm" : "");
  if (animate) {
    el.style.animationDelay = `${idx * 65}ms`;
  } else {
    el.style.animation = "none";
  }
  el.onclick = (e) => {
    if (e.target.tagName === "A") return;
    playClickSfx();
    insertKanji(k);
  };
  el.innerHTML = `
    <a class="dict-link" href="https://jisho.org/search/${encodeURIComponent(k)}%20%23kanji" target="_blank" title="Dictionary">🔍</a>
    <div class="char">${k}</div>
    ${!isEnemy ? `<span class="key-hint">Alt+${idx + 1}</span>` : ""}
  `;
  return el;
}

function insertKanji(k) {
  const inp = document.getElementById("b-input");
  const start = inp.selectionStart || inp.value.length;
  const end = inp.selectionEnd || inp.value.length;
  inp.value = inp.value.slice(0, start) + k + inp.value.slice(end);
  inp.focus();
  inp.selectionStart = inp.selectionEnd = start + k.length;
}

function formatGmText(raw) {
  const escaped = String(raw)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped
    .replace(/^#{1,4}\s*(.+)$/gm, "<strong>▸ $1</strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<strong>[$1]</strong>");
}

function appendGmLog(markdownText, extraClass = "") {
  const gmBox = document.getElementById("b-gm-log");
  const entry = document.createElement("div");
  entry.className = `log-entry ${extraClass}`.trim();
  entry.innerHTML = formatGmText(markdownText);
  gmBox.appendChild(entry);
  gmBox.scrollTop = gmBox.scrollHeight;
  return entry;
}

function clearGmLog(toast = true) {
  document.getElementById("b-gm-log").innerHTML = "";
  if (toast) showToast("🧹 Log view cleared.");
}

function triggerCombatFX(enemyDmg, playerDmg) {
  if (enemyDmg > 0) {
    playSlashSfx();
    const bossCard = document.getElementById("b-boss-card");
    bossCard.classList.remove("hit");
    void bossCard.offsetWidth;
    bossCard.classList.add("hit");

    const pop = document.createElement("div");
    pop.className = "dmg-pop";
    pop.textContent = `-${enemyDmg}`;
    bossCard.appendChild(pop);
    setTimeout(() => pop.remove(), 950);
  }
  if (playerDmg > 0) {
    playDamageSfx();
    const appRoot = document.getElementById("app-root");
    const vig = document.getElementById("damage-vignette");
    appRoot.classList.remove("shake");
    void appRoot.offsetWidth;
    appRoot.classList.add("shake");
    vig.classList.add("flash");
    setTimeout(() => vig.classList.remove("flash"), 340);
  }
}

function updateBattleHUD(animateCards = false) {
  const d = KANKEN_DATA[state.depthId];
  document.getElementById("b-depth-title").textContent = `${d.title} [${config.instMode}]`;
  document.getElementById("b-turn").textContent = `Turn ${state.turn}`;
  updateTimerBadge();
  document.getElementById("b-field-state").textContent = state.fieldState;
  document.getElementById("b-streak").textContent = `🔥 ${state.streak} Kills`;

  document.getElementById("b-boss-kanji").textContent = state.enemyKanji;
  document.getElementById("b-boss-name").textContent = state.enemyKanji;
  document.getElementById("b-enemy-hp").textContent = state.enemyHp;
  document.getElementById("b-enemy-state").textContent = state.enemyState;
  document.getElementById("b-enemy-bar").style.width = `${Math.max(0, state.enemyHp)}%`;

  document.getElementById("b-player-hp").textContent = state.playerHp;
  document.getElementById("b-player-state").textContent = state.playerState;
  document.getElementById("b-summon-cost").textContent = `${state.summonCost} HP`;
  document.getElementById("b-player-bar").style.width = `${Math.max(0, state.playerHp)}%`;

  document.getElementById("b-enemy-prev").textContent = state.prevEnemyHand.length
    ? `Prev: ${state.prevEnemyHand.join(" ")}`
    : "Prev: (None)";
  document.getElementById("b-player-prev").textContent = state.prevPlayerHand.length
    ? `Prev: ${state.prevPlayerHand.join(" ")}`
    : "Prev: (None)";

  const eRow = document.getElementById("b-enemy-hand");
  eRow.innerHTML = "";
  state.enemyHand.forEach((k, i) => eRow.appendChild(makeCardEl(k, true, i, animateCards)));

  const pRow = document.getElementById("b-player-hand");
  pRow.innerHTML = "";
  state.playerHand.forEach((k, i) => pRow.appendChild(makeCardEl(k, false, i, animateCards)));
}

function prefillSlash(prefix) {
  playClickSfx();
  const inp = document.getElementById("b-input");
  inp.value = prefix;
  inp.focus();
}

function triggerSlash(cmd) {
  playClickSfx();
  const inp = document.getElementById("b-input");
  inp.value = cmd;
  handleBattleSubmit(new Event("submit"));
}

function parseInputCommand(raw) {
  const trimmed = raw.trim();
  if (!trimmed.startsWith("/")) return { type: "NORMAL", arg: trimmed };

  const parts = trimmed.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const arg = parts.slice(1).join(" ").trim();

  if (cmd === "/hint") return { type: "HINT", arg: "" };
  if (cmd === "/reroll") return { type: "REROLL", arg: "" };
  if (cmd === "/prompt") return { type: "PROMPT", arg };
  if (cmd === "/summon") return { type: "SUMMON", arg };
  return { type: "UNKNOWN_SLASH", cmd, arg };
}

function startJudgingIndicator(customLabel = null) {
  const gmBox = document.getElementById("b-gm-log");
  const sendBtn = document.getElementById("b-send-btn");
  const entry = document.createElement("div");
  entry.className = "log-entry pending-log";
  const label = customLabel || t("judgingMsg");
  entry.innerHTML = `<span class="rune-spinner"></span><span class="judge-txt">${label} (0.0s)</span>`;
  gmBox.appendChild(entry);
  gmBox.scrollTop = gmBox.scrollHeight;

  const t0 = performance.now();
  const iv = setInterval(() => {
    const sec = ((performance.now() - t0) / 1000).toFixed(1);
    const txtEl = entry.querySelector(".judge-txt");
    if (txtEl) txtEl.textContent = `${label} (${sec}s)`;
    sendBtn.textContent = `⏳ ${sec}s`;
  }, 100);

  return () => {
    clearInterval(iv);
    const elapsed = ((performance.now() - t0) / 1000).toFixed(1);
    entry.remove();
    sendBtn.textContent = t("castBtn");
    return elapsed;
  };
}

async function handleBattleSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();
  const inp = document.getElementById("b-input");
  const raw = inp.value.trim();
  if (!raw) return;

  state._lastRawInput = raw;
  const parsed = parseInputCommand(raw);

  if (parsed.type === "REROLL") {
    if (state.playerHp <= 5) {
      appendGmLog("⚠ **[GM]**: Too weak to **/reroll**! (Requires > 5 HP)", "hint-log");
      return;
    }
    unlockAchievement("gambler");
    state.playerHp -= 5;
    triggerCombatFX(0, 5);
    state.prevPlayerHand = [...state.playerHand];
    state.playerHand = sample5(KANKEN_DATA[state.depthId].kanji);
    for (let i = 0; i < 5; i++) playCardDealSfx(i * 65);
    inp.value = "";
    updateBattleHUD(true);
    saveRunToStorage();
    appendGmLog(`🎲 **[/reroll]**: Paid 5 HP and drew 5 fresh Kanji cards: **[ ${state.playerHand.join(" · ")} ]**`, "hint-log");
    return;
  }

  if (parsed.type === "PROMPT" && !parsed.arg) {
    appendGmLog("⚠ Usage: **/prompt [Your question]** (Tip: Click any Kanji card or press Alt+1~5!)", "hint-log");
    return;
  }

  if (parsed.type === "UNKNOWN_SLASH") {
    appendGmLog(`⚠ Unknown command "${parsed.cmd}". Use **/hint**, **/reroll**, **/prompt <text>**, **/summon [text]**`, "hint-log");
    return;
  }

  inp.disabled = true;
  document.getElementById("b-send-btn").disabled = true;
  const stopJudging = startJudgingIndicator();

  try {
    if (parsed.type === "HINT" || parsed.type === "PROMPT") {
      unlockAchievement("scholar");
      const qText = parsed.type === "HINT"
        ? `Provide an ULTRA-CONCISE tactical briefing (max 6 lines total, no markdown headers) in ${config.lang}:
- Player Hand ${JSON.stringify(state.playerHand)}: each Kanji(reading: meaning) on ONE compact line.
- Enemy Hand ${JSON.stringify(state.enemyHand)}: each Kanji(reading: meaning) on ONE compact line.
- 2 clever 1-line combo ideas against Boss 【${state.enemyKanji}】.`
        : `Answer concisely (max 4 lines) in ${config.lang} for this Kanji battle (Player Hand: ${JSON.stringify(state.playerHand)}, Boss: ${state.enemyKanji}): "${parsed.arg}"`;
      const reply = await callLLM(qText, false);
      const sec = stopJudging();
      inp.value = "";
      appendGmLog(`💡 **[${parsed.type} — ⏱ ${sec}s]**\n${reply}`, "hint-log");
      return;
    }

    if (state.playerHand.length === 5 && state.playerHand.every(k => raw.includes(k))) {
      unlockAchievement("full_hand");
    }

    let summonDirective = "";
    if (parsed.type === "SUMMON") {
      if (state.playerHp <= state.summonCost) {
        stopJudging();
        appendGmLog(`⚠ Not enough HP for **/summon**! Current summon cost this round is **${state.summonCost} HP**.`, "hint-log");
        return;
      }
      unlockAchievement("summoner");
      state.playerHp -= state.summonCost;
      const paid = state.summonCost;
      state.summonCost += 10;
      summonDirective = `\n[SPECIAL COMMAND: /summon (Player paid ${paid} HP!)] Summon a fitting entity from Player's hand (${JSON.stringify(state.playerHand)}). Direction: "${parsed.arg || "Auto-summon best entity"}". Set it in 'new_player_state' and apply immediate attack/shield!`;
    }

    const ruleBody = config.instMode === "Default"
      ? DEFAULT_GM_RULES
      : config.instMode === "Custom"
      ? `${DEFAULT_GM_RULES}\n\n[User Custom Patch Rules]:\n${config.customInst}`
      : `[Sandbox Rules]:\n${config.customInst || DEFAULT_GM_RULES}`;

    const gmPrompt = `You are the TRPG Game Master of 'KANJI DUNGEON' (Mode: ${config.instMode}, Preferred Lang: ${config.lang}).
Battle State:
- Field State: [${state.fieldState}]
- Enemy Boss: 【 ${state.enemyKanji} 】 (HP: ${state.enemyHp}/100, State: [${state.enemyState}])
- Player (HP: ${state.playerHp}/100, State: [${state.playerState}])
- Player's 5 Drawn Kanji Cards: ${JSON.stringify(state.playerHand)}
- Enemy's 5 Drawn Kanji Cards: ${JSON.stringify(state.enemyHand)}

Player's Input: "${raw}"${summonDirective}

Rules:
${ruleBody}
- Always include reading/meaning in parentheses when mentioning Kanji.
- Language: Respond in the language the player used, or ${config.lang}.

Respond ONLY in valid JSON:
{
  "gm_judgment": "string",
  "enemy_damage_taken": 0,
  "player_heal": 0,
  "enemy_action": "string",
  "player_damage_taken": 0,
  "new_field_state": "string",
  "new_player_state": "string",
  "new_enemy_state": "string"
}`;

    const res = await callLLM(gmPrompt, true);
    const sec = stopJudging();
    applyTurnResult(raw, res, sec);
    inp.value = "";
  } catch (err) {
    stopJudging();
    appendGmLog(`⚠ **API Error**: ${err.message}`, "hint-log");
  } finally {
    inp.disabled = false;
    document.getElementById("b-send-btn").disabled = false;
    inp.focus();
  }
}

function applyTurnResult(rawPrompt, res, sec = "0.0") {
  const dmgE = Math.max(0, parseInt(res.enemy_damage_taken || 0, 10));
  const healP = Math.max(0, parseInt(res.player_heal || 0, 10));
  const dmgP = Math.max(0, parseInt(res.player_damage_taken || 0, 10));

  if (res.new_field_state) state.fieldState = String(res.new_field_state).slice(0, 36);
  if (res.new_player_state) state.playerState = String(res.new_player_state).slice(0, 36);
  if (res.new_enemy_state) state.enemyState = String(res.new_enemy_state).slice(0, 36);

  state.enemyHp = Math.max(0, state.enemyHp - dmgE);
  state.playerHp = Math.min(100, state.playerHp + healP);

  if (state.enemyHp <= 0) {
    triggerCombatFX(dmgE, 0);
    state.streak += 1;
    recordKill(state.depthId);

    unlockAchievement("first_blood");
    if (state.enemyKanji === "犬") unlockAchievement("dog_slayer");
    if (state.enemyKanji === "天" || state.enemyKanji === "神") unlockAchievement("heaven_defier");
    if (state.playerHp >= 100) unlockAchievement("flawless");
    if (state.streak >= 5) unlockAchievement("streak_5");

    const winLog = `🗣 **[Turn ${state.turn} — You]**: "${rawPrompt}"\n⚖ **[GM — ⏱ ${sec}s]**: ${res.gm_judgment} (**Enemy -${dmgE} HP**)`;
    state.history.push(winLog);
    appendGmLog(winLog);
    spawnNextEnemy(false);
    return;
  }

  state.playerHp = Math.max(0, state.playerHp - dmgP);
  triggerCombatFX(dmgE, dmgP);

  const turnLog = `🗣 **[Turn ${state.turn} — You]**: "${rawPrompt}" *(Hand: ${state.playerHand.join(" ")})*\n⚖ **[GM — ⏱ ${sec}s]**: ${res.gm_judgment} (**Enemy -${dmgE} HP**${healP ? `, **You +${healP} HP**` : ""})\n👹 **【${state.enemyKanji}】**: ${res.enemy_action} (**You -${dmgP} HP**)`;
  state.history.push(turnLog);
  appendGmLog(turnLog);

  if (state.playerHp <= 0) {
    updateBattleHUD(false);
    showGameOverModal(false);
    return;
  }

  state.turn += 1;
  dealNewHands(true);
  updateBattleHUD(true);
  saveRunToStorage();
}

function exportBattleLog() {
  playClickSfx();
  const header = `=== KANJI DUNGEON 【漢字地獄】 (${KANKEN_DATA[state.depthId].title}) ===\nMode: ${config.instMode} | Model: ${config.model} | Streak: 🔥 ${state.streak} Kills | Time: ${formatTime(state.elapsedSec)}\n\n`;
  const body = state.history.length ? state.history.join("\n\n---\n\n") : document.getElementById("b-gm-log").innerText;
  navigator.clipboard.writeText(header + body);
  showToast("📋 Battle History copied to clipboard!");
}

/* Laptop / Keyboard Navigation (WASD / Arrow Keys / Alt+1~5 / ESC) */
function setupKeyboardNavigation() {
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (anyModalOpen()) {
        closeAllModals();
        return;
      }
      if (document.activeElement && document.activeElement.tagName === "INPUT") {
        document.activeElement.blur();
        return;
      }
    }

    // Alt + 1~5 inserts Player Hand Kanji directly even while typing
    if (e.altKey && currentView === "battle" && ["1", "2", "3", "4", "5"].includes(e.key)) {
      e.preventDefault();
      const idx = parseInt(e.key, 10) - 1;
      if (state.playerHand[idx]) {
        playClickSfx();
        insertKanji(state.playerHand[idx]);
      }
      return;
    }

    if (anyModalOpen()) return;
    if (document.activeElement && ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) return;

    const selector = currentView === "title"
      ? "#view-title .menu-btn"
      : currentView === "select"
      ? "#view-select .abyss-node"
      : "#b-player-hand .kanji-card";

    const items = Array.from(document.querySelectorAll(selector));
    if (!items.length) return;

    if (["ArrowDown", "ArrowRight", "s", "S", "d", "D"].includes(e.key)) {
      e.preventDefault();
      kbIndex = (kbIndex + 1) % items.length;
      highlightKbItem(items);
    } else if (["ArrowUp", "ArrowLeft", "w", "W", "a", "A"].includes(e.key)) {
      e.preventDefault();
      kbIndex = (kbIndex - 1 + items.length) % items.length;
      highlightKbItem(items);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const target = items[kbIndex] || items[0];
      if (target) target.click();
    }
  });
}

function highlightKbItem(items) {
  playClickSfx();
  document.querySelectorAll(".kb-focus").forEach(el => el.classList.remove("kb-focus"));
  const target = items[kbIndex];
  if (target) {
    target.classList.add("kb-focus");
    target.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }
}

/* Settings & Provider Management */
function onProviderChange() {
  const p = document.getElementById("s-provider").value;
  const pInfo = PROVIDERS[p] || PROVIDERS.free_keyless;

  document.getElementById("s-apikey").value = savedKeys[p] || "";
  const linkEl = document.getElementById("s-key-link");
  linkEl.href = pInfo.keyUrl;
  linkEl.textContent = `[${pInfo.keyLabel}]`;

  document.getElementById("s-endpoint-group").style.display = p === "custom" ? "flex" : "none";
  document.getElementById("s-apikey-group").style.display = p === "free_keyless" ? "none" : "flex";

  const presetSel = document.getElementById("s-model-preset");
  presetSel.innerHTML = "";
  pInfo.models.forEach(m => {
    const opt = document.createElement("option");
    opt.value = m.id;
    opt.textContent = m.label;
    presetSel.appendChild(opt);
  });

  document.getElementById("s-model-custom").value = pInfo.models[0].id;
}

function onInstModeChange() {
  const m = document.getElementById("s-inst-mode").value;
  document.getElementById("s-custom-group").style.display = m === "Default" ? "none" : "flex";
}

function syncSettingsUI() {
  document.getElementById("s-provider").value = config.provider;
  onProviderChange();
  document.getElementById("s-apikey").value = savedKeys[config.provider] || config.apiKey || "";
  document.getElementById("s-endpoint").value = config.customEndpoint;
  document.getElementById("s-model-custom").value = config.model;
  document.getElementById("s-inst-mode").value = config.instMode;
  document.getElementById("s-custom-inst").value = config.customInst;
  syncSoundBtn();
  onInstModeChange();
}

function saveSettings() {
  playClickSfx();
  config.provider = document.getElementById("s-provider").value;
  config.apiKey = document.getElementById("s-apikey").value.trim();
  config.customEndpoint = document.getElementById("s-endpoint").value.trim();
  config.model = document.getElementById("s-model-custom").value.trim() || "openai";
  config.instMode = document.getElementById("s-inst-mode").value;
  config.customInst = document.getElementById("s-custom-inst").value.trim();

  savedKeys[config.provider] = config.apiKey;
  localStorage.setItem("kd_keys", JSON.stringify(savedKeys));
  localStorage.setItem("kd_provider", config.provider);
  localStorage.setItem("kd_apikey", config.apiKey);
  localStorage.setItem("kd_custom_endpoint", config.customEndpoint);
  localStorage.setItem("kd_model", config.model);
  localStorage.setItem("kd_inst_mode", config.instMode);
  localStorage.setItem("kd_custom_inst", config.customInst);

  applyLocalization();
  if (currentView === "battle") updateBattleHUD(false);
  closeSettingsModal();
  showToast(`✅ Saved! (${config.provider} / ${config.model} / Mode: ${config.instMode})`);
}

async function testApiKey() {
  playClickSfx();
  if (document.getElementById("settings-modal").classList.contains("active")) {
    saveSettings();
  }
  showToast(`⏳ Testing ${config.provider} (${config.model})...`);
  try {
    const reply = await callLLM("Reply with the single word: READY", false);
    showToast(`✅ OK [${config.provider}]: "${String(reply).slice(0, 35).trim()}"`);
  } catch (err) {
    showToast(`❌ Error: ${err.message.slice(0, 90)}`);
  }
}

initApp();
