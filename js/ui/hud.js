/* Battle screen rendering: HUD, cards, GM log, combat effects, judging spinner. */

function formatTime(sec) {
  const m = String(Math.floor((sec || 0) / 60)).padStart(2, "0");
  const s = String((sec || 0) % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function updateTimerBadge() {
  const el = $("b-timer");
  if (el) el.textContent = `⏱ ${formatTime(state.elapsedSec)}`;
}

function setHpBar(barId, numId, hp) {
  const v = Math.max(0, Math.min(100, hp));
  $(numId).textContent = Math.max(0, hp);
  const bar = $(barId);
  bar.style.width = `${v}%`;
  bar.classList.toggle("low", v <= 30);
}

function updateBattleHUD(animateCards = false) {
  $("b-depth-title").textContent = `${depthNumStr(state.depthId)} ${depthShortName(state.depthId)}`;
  $("b-depth-title").title = `${KANKEN_DATA[state.depthId].title} [${config.instMode}]`;
  $("b-turn").textContent = `T${state.turn}`;
  $("b-streak").textContent = `🔥 ${state.streak}`;
  updateTimerBadge();

  $("b-boss-kanji").textContent = state.enemyKanji;
  $("b-boss-kanji").classList.toggle("multi", [...state.enemyKanji].length > 1);
  $("b-enemy-state").textContent = state.enemyState;
  $("b-field-state").textContent = state.fieldState;
  setHpBar("b-enemy-bar", "b-enemy-hp", state.enemyHp);

  $("b-player-state").textContent = state.playerState;
  setHpBar("b-player-bar", "b-player-hp", state.playerHp);
  $("b-summon-cost").textContent = state.summonCost;

  renderCardRow("b-enemy-hand", state.enemyHand, true, animateCards);
  renderCardRow("b-player-hand", state.playerHand, false, animateCards);
}

function renderCardRow(rowId, cards, isEnemy, animate) {
  const row = $(rowId);
  row.innerHTML = "";
  cards.forEach((k, i) => row.appendChild(makeCardEl(k, isEnemy, i, animate)));
}

function makeCardEl(k, isEnemy = false, idx = 0, animate = true) {
  const el = document.createElement("div");
  el.className = "kanji-card" + (isEnemy ? " enemy-sm" : "");
  if (animate) el.style.animationDelay = `${idx * 65}ms`;
  else el.style.animation = "none";
  el.onclick = (e) => {
    if (e.target.tagName === "A") return;
    playClickSfx();
    insertKanji(k);
  };
  el.innerHTML = `
    <a class="dict-link" href="https://jisho.org/search/${encodeURIComponent(k)}%20%23kanji" target="_blank" rel="noopener" title="Dictionary">🔍</a>
    <div class="char">${escapeHtml(k)}</div>
    ${!isEnemy ? `<span class="key-hint">Alt+${idx + 1}</span>` : ""}
  `;
  return el;
}

/* Insert a Kanji at the caret. On touch devices, don't pop the keyboard unless it is already open. */
function insertKanji(k) {
  const inp = $("b-input");
  const focused = document.activeElement === inp;
  const start = focused ? (inp.selectionStart ?? inp.value.length) : inp.value.length;
  const end = focused ? (inp.selectionEnd ?? inp.value.length) : inp.value.length;
  inp.value = inp.value.slice(0, start) + k + inp.value.slice(end);
  const caret = start + k.length;
  if (focused || !isCoarsePointer()) {
    inp.focus();
    inp.setSelectionRange(caret, caret);
  }
  inp.classList.remove("flash");
  void inp.offsetWidth;
  inp.classList.add("flash");
}

function scrollLogToBottom() {
  const gmBox = $("b-gm-log");
  if (gmBox) requestAnimationFrame(() => { gmBox.scrollTop = gmBox.scrollHeight; });
}

function appendGmLog(markdownText, extraClass = "") {
  const entry = document.createElement("div");
  entry.className = `log-entry ${extraClass}`.trim();
  entry.innerHTML = formatGmText(markdownText);
  $("b-gm-log").appendChild(entry);
  scrollLogToBottom();
  return entry;
}

function clearGmLog(toast = true) {
  $("b-gm-log").innerHTML = "";
  if (toast) showToast(t("toastCleared"));
}

function popNumber(anchor, text, cls) {
  const pop = document.createElement("div");
  pop.className = `num-pop ${cls}`;
  pop.textContent = text;
  anchor.appendChild(pop);
  setTimeout(() => pop.remove(), 950);
}

function triggerCombatFX(enemyDmg, playerDmg, playerHeal = 0) {
  if (enemyDmg > 0) {
    playSlashSfx();
    const bossCard = $("b-boss-card");
    bossCard.classList.remove("hit");
    void bossCard.offsetWidth;
    bossCard.classList.add("hit");
    popNumber(bossCard, `-${enemyDmg}`, "dmg");
  }
  if (playerHeal > 0) {
    popNumber($("b-player-stat"), `+${playerHeal}`, "heal");
  }
  if (playerDmg > 0) {
    playDamageSfx();
    popNumber($("b-player-stat"), `-${playerDmg}`, "dmg");
    const appRoot = $("app-root");
    const vig = $("damage-vignette");
    appRoot.classList.remove("shake");
    void appRoot.offsetWidth;
    appRoot.classList.add("shake");
    vig.classList.add("flash");
    setTimeout(() => vig.classList.remove("flash"), 340);
  }
}

/* Shows a live "judging…" entry; returns a stop() that removes it and yields elapsed seconds. */
function startJudgingIndicator() {
  const sendBtn = $("b-send-btn");
  const entry = document.createElement("div");
  entry.className = "log-entry pending-log";
  const label = t("judgingMsg");
  entry.innerHTML = `<span class="rune-spinner"></span><span class="judge-txt">${label} (0.0s)</span>`;
  $("b-gm-log").appendChild(entry);
  scrollLogToBottom();

  const t0 = performance.now();
  const iv = setInterval(() => {
    const sec = ((performance.now() - t0) / 1000).toFixed(1);
    const txtEl = entry.querySelector(".judge-txt");
    if (txtEl) txtEl.textContent = `${label} (${sec}s)`;
    sendBtn.textContent = `⏳ ${sec}s`;
  }, 100);

  return () => {
    clearInterval(iv);
    entry.remove();
    sendBtn.textContent = t("castBtn");
    return ((performance.now() - t0) / 1000).toFixed(1);
  };
}
