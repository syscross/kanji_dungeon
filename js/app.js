const DEFAULT_GM_RULES = `1. Judge the Player's action using ONLY Kanji present in their 5 Drawn Cards. If they lie about a Kanji's meaning or use unheld Kanji, mock them and deal 0 damage.
2. Normal attack damage is 15~45. If the player is absurdly greedy without matching Kanji (like 百/千), call out "Too greedy!" and scale damage to 15~38.
3. Reward clever Kanji combinations, healing (休/水/生/草/林 etc.), defense, or preemptively countering the Enemy's 5 visible cards!
4. If the enemy survives, the Enemy counterattacks using 1~3 Kanji from the Enemy's current hand.
5. Keep your narrative punchy and concise (2~4 sentences max).`;

let KANKEN_DATA = {};
let currentView = "title";
let viewStack = ["title"];

let savedKeys = JSON.parse(localStorage.getItem("kd_keys") || "{}");
const legacyKey = localStorage.getItem("kd_apikey");
if (legacyKey && !savedKeys.gemini) savedKeys.gemini = legacyKey;

let config = {
  provider: localStorage.getItem("kd_provider") || "gemini",
  apiKey: "",
  customEndpoint: localStorage.getItem("kd_custom_endpoint") || "http://localhost:11434/v1/chat/completions",
  model: localStorage.getItem("kd_model") || "gemini-flash-lite-latest",
  instMode: localStorage.getItem("kd_inst_mode") || "Default",
  customInst: localStorage.getItem("kd_custom_inst") || "",
  lang: localStorage.getItem("kd_lang") || "KO",
  scores: JSON.parse(localStorage.getItem("kd_scores") || "{}")
};
config.apiKey = savedKeys[config.provider] || legacyKey || "";

let state = {
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
  history: []
};

async function initApp() {
  startEmberCanvas();
  document.getElementById("sound-btn").textContent = soundEnabled ? "🔊" : "🔇";
  document.getElementById("s-default-inst").value = DEFAULT_GM_RULES;

  // Populate Provider Select
  const pSel = document.getElementById("s-provider");
  pSel.innerHTML = "";
  Object.entries(PROVIDERS).forEach(([k, v]) => {
    const opt = document.createElement("option");
    opt.value = k;
    opt.textContent = v.name;
    pSel.appendChild(opt);
  });

  syncSettingsUI();
  applyLocalization();

  // Close language dropdown on outside click
  document.addEventListener("click", (e) => {
    const dd = document.getElementById("lang-dropdown");
    if (dd && !dd.contains(e.target)) dd.classList.remove("open");
  });

  // Browser Hardware Back Button Support (Never goes back into battle)
  window.addEventListener("popstate", () => {
    if (currentView === "battle") {
      history.pushState({ view: "battle" }, "", "#battle");
      askLeaveBattle(() => transitionToView("select", "撤退", "RETREATING FROM FLOOR"));
    } else if (currentView !== "title") {
      switchDomView("title", false);
    }
  });

  const res = await fetch("./kanken_data.json");
  KANKEN_DATA = await res.json();
  renderDepthSpine();
}

function showToast(msg) {
  document.getElementById("global-toast").textContent = msg;
}

/* Language Dropdown Logic */
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

/* Deterministic Navigation: Battle -> Select -> Title (Never loops back to Battle) */
function handleBrandClick() {
  playClickSfx();
  if (currentView === "title") return;
  if (currentView === "battle") {
    askLeaveBattle(() => transitionToView("title", "漢字地獄", "RETURNING TO MAIN GATE"));
  } else {
    transitionToView("title");
  }
}

function handleBackButton() {
  playClickSfx();
  if (currentView === "battle") {
    askLeaveBattle(() => transitionToView("select", "撤退", "RETREATING FROM FLOOR"));
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
      setTimeout(() => curtain.classList.remove("active"), 260);
    }, 340);
  } else {
    switchDomView(viewName, true);
  }
}

function switchDomView(name, pushHist = true) {
  currentView = name;
  if (pushHist) {
    history.replaceState({ view: name }, "", name === "title" ? window.location.pathname : `#${name}`);
  }
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.getElementById(`view-${name}`).classList.add("active");
  document.getElementById("back-btn").style.display = name === "title" ? "none" : "inline-block";
  if (name === "select") renderDepthSpine();
}

/* Confirmation Modal System */
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

function askLeaveBattle(onConfirm) {
  openConfirmModal(t("leaveBattleTitle"), t("leaveBattleDesc"), onConfirm);
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
      // Fallback if browser blocks closing tab not opened by window.open
      document.getElementById("curtain-sub").textContent = "CONNECTION CLOSED. YOU MAY CLOSE THIS TAB (OR CLICK TO REBOOT).";
      curtain.onclick = () => {
        curtain.onclick = null;
        curtain.classList.remove("active");
        switchDomView("title", false);
      };
    }, 900);
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
  if (!config.apiKey && config.provider !== "custom") {
    showToast("⚠ Please set your API Key in Settings first!");
    transitionToView("settings");
    return;
  }
  state.depthId = depthId;
  state.streak = 0;
  state.playerHp = 100;
  state.playerState = "Normal";
  state.fieldState = "Pitch-Black Dungeon";
  state.history = [];
  clearGmLog(false);
  spawnNextEnemy(true);
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
    : `🩸 Enemy slain! Streak: **🔥 ${state.streak} Kills** (/summon reset to 10 HP)\nNext Challenger: **【 ${state.enemyKanji} 】** (HP: 100/100) emerges!`;
  updateBattleHUD(true);
  appendGmLog(msg, "sys-log");
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
    el.classList.add("selected-pulse");
    setTimeout(() => el.classList.remove("selected-pulse"), 350);
    insertKanji(k);
  };
  el.innerHTML = `
    <a class="dict-link" href="https://jisho.org/search/${encodeURIComponent(k)}%20%23kanji" target="_blank" title="Dictionary">🔍</a>
    <div class="char">${k}</div>
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

/* Cumulative Append-Only GM Log */
function appendGmLog(markdownText, extraClass = "") {
  const gmBox = document.getElementById("b-gm-log");
  const entry = document.createElement("div");
  entry.className = `log-entry ${extraClass}`.trim();
  entry.innerHTML = formatGmText(markdownText);
  gmBox.appendChild(entry);
  gmBox.scrollTop = gmBox.scrollHeight;
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

async function handleBattleSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();
  const inp = document.getElementById("b-input");
  const raw = inp.value.trim();
  if (!raw) return;

  const parsed = parseInputCommand(raw);

  // 1. /reroll (Immediate, -5 HP, 3D Deck Draw Animation!)
  if (parsed.type === "REROLL") {
    if (state.playerHp <= 5) {
      appendGmLog("⚠ **[GM]**: Too weak to **/reroll**! (Requires > 5 HP)", "hint-log");
      return;
    }
    state.playerHp -= 5;
    triggerCombatFX(0, 5);
    state.prevPlayerHand = [...state.playerHand];
    state.playerHand = sample5(KANKEN_DATA[state.depthId].kanji);
    for (let i = 0; i < 5; i++) playCardDealSfx(i * 65);
    inp.value = "";
    updateBattleHUD(true);
    appendGmLog(`🎲 **[/reroll]**: Paid 5 HP and drew 5 fresh Kanji cards: **[ ${state.playerHand.join(" · ")} ]**`, "hint-log");
    return;
  }

  // 2. /prompt requires argument
  if (parsed.type === "PROMPT" && !parsed.arg) {
    appendGmLog("⚠ Usage: **/prompt [Your question]** (Tip: Click any Kanji card to insert it!)", "hint-log");
    return;
  }

  if (parsed.type === "UNKNOWN_SLASH") {
    appendGmLog(`⚠ Unknown command "${parsed.cmd}". Use **/hint**, **/reroll**, **/prompt <text>**, **/summon [text]**`, "hint-log");
    return;
  }

  inp.disabled = true;
  document.getElementById("b-send-btn").disabled = true;

  try {
    // 3. /hint or /prompt (Appends to log without wiping previous turns!)
    if (parsed.type === "HINT" || parsed.type === "PROMPT") {
      appendGmLog(`🔮 **[ ${parsed.type} — Consulting the Abyss (${config.model})... ]**`, "hint-log");
      const qText = parsed.type === "HINT"
        ? `Provide an ULTRA-CONCISE tactical briefing (max 6 lines total, no markdown headers) in ${config.lang}:
- Player Hand ${JSON.stringify(state.playerHand)}: each Kanji(reading: meaning) on ONE compact line.
- Enemy Hand ${JSON.stringify(state.enemyHand)}: each Kanji(reading: meaning) on ONE compact line.
- 2 clever 1-line combo ideas against Boss 【${state.enemyKanji}】.`
        : `Answer concisely (max 4 lines) in ${config.lang} for this Kanji battle (Player Hand: ${JSON.stringify(state.playerHand)}, Boss: ${state.enemyKanji}): "${parsed.arg}"`;
      const reply = await callLLM(qText, false);
      inp.value = "";
      appendGmLog(`💡 **[${parsed.type}]**\n${reply}`, "hint-log");
      return;
    }

    // 4. /summon (Escalating 10 -> 20 -> 30 HP cost)
    let summonDirective = "";
    if (parsed.type === "SUMMON") {
      if (state.playerHp <= state.summonCost) {
        appendGmLog(`⚠ Not enough HP for **/summon**! Current summon cost this round is **${state.summonCost} HP**.`, "hint-log");
        return;
      }
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
    applyTurnResult(raw, res);
    inp.value = "";
  } catch (err) {
    appendGmLog(`⚠ **API Error**: ${err.message}`, "hint-log");
  } finally {
    inp.disabled = false;
    document.getElementById("b-send-btn").disabled = false;
    inp.focus();
  }
}

function applyTurnResult(rawPrompt, res) {
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
    const winLog = `🗣 **[Turn ${state.turn} — You]**: "${rawPrompt}"\n⚖ **[GM]**: ${res.gm_judgment} (**Enemy -${dmgE} HP**)`;
    state.history.push(winLog);
    appendGmLog(winLog);
    spawnNextEnemy(false);
    return;
  }

  state.playerHp = Math.max(0, state.playerHp - dmgP);
  triggerCombatFX(dmgE, dmgP);

  const turnLog = `🗣 **[Turn ${state.turn} — You]**: "${rawPrompt}" *(Hand: ${state.playerHand.join(" ")})*\n⚖ **[GM]**: ${res.gm_judgment} (**Enemy -${dmgE} HP**${healP ? `, **You +${healP} HP**` : ""})\n👹 **【${state.enemyKanji}】**: ${res.enemy_action} (**You -${dmgP} HP**)`;
  state.history.push(turnLog);
  appendGmLog(turnLog);

  if (state.playerHp <= 0) {
    updateBattleHUD(false);
    appendGmLog(`💀 **【 死 — YOU HAVE MET YOUR DEMISE 】**\nFinal Streak in ${KANKEN_DATA[state.depthId].title}: **🔥 ${state.streak} Kills** (Mode: ${config.instMode})`, "sys-log");
    return;
  }

  state.turn += 1;
  dealNewHands(true);
  updateBattleHUD(true);
}

function exportBattleLog() {
  playClickSfx();
  const header = `=== KANJI DUNGEON 【漢字地獄】 (${KANKEN_DATA[state.depthId].title}) ===\nMode: ${config.instMode} | Model: ${config.model} | Streak: 🔥 ${state.streak} Kills\n\n`;
  const body = state.history.length ? state.history.join("\n\n---\n\n") : document.getElementById("b-gm-log").innerText;
  navigator.clipboard.writeText(header + body);
  showToast("📋 Battle History copied to clipboard!");
}

/* Settings & Multi-Provider Key Management */
function onProviderChange() {
  const p = document.getElementById("s-provider").value;
  const pInfo = PROVIDERS[p] || PROVIDERS.gemini;

  // Load saved key for this specific provider
  document.getElementById("s-apikey").value = savedKeys[p] || "";

  // Update Key Help Link
  const linkEl = document.getElementById("s-key-link");
  linkEl.href = pInfo.keyUrl;
  linkEl.textContent = `[${pInfo.keyLabel}]`;

  // Show/Hide Custom Endpoint field
  document.getElementById("s-endpoint-group").style.display = p === "custom" ? "flex" : "none";

  // Populate Model Presets for this provider
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
  onInstModeChange();
}

function saveSettings(stay = false) {
  playClickSfx();
  config.provider = document.getElementById("s-provider").value;
  config.apiKey = document.getElementById("s-apikey").value.trim();
  config.customEndpoint = document.getElementById("s-endpoint").value.trim();
  config.model = document.getElementById("s-model-custom").value.trim() || "gemini-flash-lite-latest";
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
  showToast(`✅ Saved! (${config.provider} / ${config.model} / Mode: ${config.instMode})`);
  if (!stay) transitionToView("title");
}

async function testApiKey() {
  playClickSfx();
  if (document.getElementById("view-settings").classList.contains("active")) {
    saveSettings(true);
  }
  if (!config.apiKey && config.provider !== "custom") {
    showToast("❌ API Key is empty! Opening Settings...");
    transitionToView("settings");
    return;
  }
  showToast(`⏳ Testing ${config.provider} (${config.model})...`);
  try {
    const reply = await callLLM("Reply with the single word: READY", false);
    showToast(`✅ OK [${config.model}]: "${String(reply).slice(0, 30).trim()}"`);
  } catch (err) {
    showToast(`❌ Error: ${err.message.slice(0, 90)}`);
  }
}

initApp();
