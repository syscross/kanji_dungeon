/* Battle screen rendering: HUD, run encounter strip, cards, the run log, combat effects, judging spinner, dock actions. */

const LOG_DOM_CAP = 250;   // entries kept on screen (older ones are dropped from the DOM)
const LOG_HISTORY_CAP = 300;

function formatTime(sec) {
  const m = String(Math.floor((sec || 0) / 60)).padStart(2, "0");
  const s = String((sec || 0) % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function updateTimerBadge() {
  const el = $("b-timer");
  if (el) el.textContent = `⏱ ${formatTime(state.elapsedSec)}`;
}

function setHpBar(barId, numId, hp, max) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (hp / max) * 100)) : 0;
  $(numId).textContent = `${Math.max(0, hp)}/${max}`;
  const bar = $(barId);
  bar.style.width = `${pct}%`;
  bar.classList.toggle("low", pct <= 30);
}

/* What the big card on the enemy stage shows, by phase.
 * - Initial gate (before entering a stage, state.sign === ""): top-right stage badge shows 門, top-left portrait shows 開 (열 개).
 * - During events (including friendly/ambiguous NPCs): top-left portrait stays as the Stage Kanji (state.sign), while the NPC/event appears only in the log.
 * - If an event NPC reveals itself as an enemy, phase switches to "battle" and the portrait transforms into the enemy kanji! */
function stageCardContent() {
  if (state.phase === "dead") {
    return { kanji: state.enemyKanji || state.sign || "開", neutral: !state.enemyKanji };
  }
  if (state.phase === "abandoned") {
    return { kanji: state.enemyKanji || state.sign || "閉", neutral: false, abandoned: true };
  }
  if (state.phase === "returned") {
    return { kanji: state.sign || "門", neutral: true, returned: true };
  }
  if (state.phase === "cleared") {
    return { kanji: state.enemyKanji || state.runBoss || "主", neutral: false, defeated: true };
  }
  if (state.phase === "battle" || (state.phase === "reward" && state.enemyKanji)) {
    return { kanji: state.enemyKanji, neutral: false };
  }
  // During stage/village exploration, portrait is strictly the stage sign (e.g. 塾, 炉, 橋, 家, 田, 川, etc.)
  return { kanji: state.sign || "開", neutral: true };
}

/* Top bar showing this run's encountered/slain foes (left) and the run's boss as ?/gray/red (right). */
function renderRunRosterBar() {
  const bar = $("b-run-roster");
  if (!bar) return;
  if (state.depthId === "depth_0") {
    const st = typeof ensureStoryConfig === "function" ? ensureStoryConfig() : (config.story || {});
    const validNpcs = ["先", "老", "友", "猫", "女", "男"];
    const met = Array.isArray(st.metNpcs) ? st.metNpcs.filter(k => validNpcs.includes(k)) : [];
    const npcHtml = met.map(k => `<span class="rr-chip seen" title="${escapeHtml(k)}">${escapeHtml(k)}</span>`).join("");
    bar.innerHTML = `<div class="rr-mobs">${npcHtml}</div>`;
    return;
  }
  if (!KANKEN_DATA[state.depthId]) return;
  const roster = depthRoster(state.depthId);
  const runBoss = state.runBoss || roster.boss;
  const mobs = [...new Set([...roster.normal, ...roster.elite])].filter(k => k !== runBoss);

  // User request: No question marks (？) like a chore checklist. Only show actually encountered/slain foes as discovered!
  const mobHtml = mobs.filter(k => {
    return (state.defeatedEnemies || []).includes(k) ||
      (state.encounteredEnemies || []).includes(k) ||
      Boolean(config.seenFoes && config.seenFoes[k]) ||
      Boolean(config.achievements && config.achievements[`boss_${k}`]);
  }).map(k => {
    const killed = (state.defeatedEnemies || []).includes(k);
    const wHp = state.woundedEnemies && state.woundedEnemies[k];
    const tip = killed ? `${k} (殺)` : (wHp ? `${k} (HP ${wHp})` : k);
    const cls = killed ? "rr-chip killed" : "rr-chip seen";
    return `<span class="${cls}" title="${escapeHtml(tip)}">${escapeHtml(k)}</span>`;
  }).join("");

  const bossKilled = (state.defeatedEnemies || []).includes(runBoss);
  const bossSeen = Boolean(state.bossEncountered || (state.encounteredEnemies || []).includes(runBoss));
  // User request: Remove "主" prefix kanji from boss chip so it doesn't look like 2 kanji stuck together
  let bossHtml = "";
  if (bossKilled) {
    bossHtml = `<span class="rr-chip boss killed" title="${escapeHtml(runBoss)} (殺)">${escapeHtml(runBoss)}</span>`;
  } else if (bossSeen) {
    const bHp = state.woundedEnemies && state.woundedEnemies[runBoss];
    const tip = bHp ? `${runBoss} (HP ${bHp})` : runBoss;
    bossHtml = `<span class="rr-chip boss seen" title="${escapeHtml(tip)}">${escapeHtml(runBoss)}</span>`;
  }

  bar.innerHTML = `<div class="rr-mobs">${mobHtml}</div>${bossHtml}`;
}

function updateBattleHUD(animateCards = false) {
  if (state.depthId !== "depth_0" && !KANKEN_DATA[state.depthId]) return;
  if (state.depthId === "depth_0") {
    $("b-depth-title").textContent = t("villageNodeTitle");
    $("b-depth-title").title = t("villageNodeGloss");
    $("b-step").textContent = "";
    $("b-step").style.display = "none";
    $("b-kills").textContent = `📿 ${(config.story && config.story.specialItems ? config.story.specialItems.length : 0)}`;
  } else {
    $("b-depth-title").textContent = depthName(state.depthId);
    $("b-depth-title").title = `${depthGloss(state.depthId)} · ${kankenLabel(state.depthId)} · ${config.instMode}`;
    $("b-step").style.display = "";
    $("b-step").textContent = `${Math.max(1, state.step)}/${PATH_STEPS}`;
    $("b-kills").textContent = `⚔ ${state.kills}`;
  }
  const yenEl = $("b-yen");
  if (yenEl) {
    if (typeof isStoryMode === "function" && isStoryMode() && config.story) {
      yenEl.style.display = "";
      yenEl.textContent = `🪙 ${(config.story.yen || 0).toLocaleString()} 円`;
    } else {
      yenEl.style.display = "none";
    }
  }
  const signInfo = state.sign ? STAGE_SIGNS[state.sign] : null;
  $("b-sign").textContent = state.sign || "門";
  $("b-sign").title = signInfo ? pickLang(signInfo.omen) : t("forkFieldState");
  updateTimerBadge();
  renderRunRosterBar();

  const inFight = state.phase === "battle";
  const card = stageCardContent();
  const bossKanjiEl = $("b-boss-kanji");
  bossKanjiEl.textContent = card.kanji;
  const bossLen = [...String(card.kanji || "")].length;
  bossKanjiEl.classList.toggle("multi", bossLen > 1);
  bossKanjiEl.dataset.len = String(Math.min(5, Math.max(1, bossLen)));
  const bossTier = typeof getKanjiTier === "function" ? getKanjiTier(card.kanji) : "edu";
  bossKanjiEl.dataset.tier = bossTier;
  const bossCardEl = $("b-boss-card");
  const isEndSeal = Boolean(card.abandoned || card.returned);
  bossCardEl.classList.toggle("neutral", Boolean(card.neutral));
  bossCardEl.classList.remove("player-dead", "completed");
  if (card.defeated) bossCardEl.classList.add("defeated");
  bossCardEl.classList.toggle("abandoned", Boolean(card.abandoned));
  bossCardEl.classList.toggle("returned", Boolean(card.returned));
  $("enemy-stage").classList.toggle("no-foe", Boolean(card.neutral) || isEndSeal);
  $("b-rank").textContent = RANK_MARK[state.enemyRank] || "";
  $("b-rank").style.display = !card.neutral && !isEndSeal && RANK_MARK[state.enemyRank] ? "" : "none";
  $("b-enemy-state").textContent = state.enemyState || "";
  $("b-field-state").textContent = state.fieldState || "";
  setHpBar("b-enemy-bar", "b-enemy-hp", state.enemyHp, state.enemyMaxHp || 1);

  $("b-player-state").textContent = state.playerState || "";
  setHpBar("b-player-bar", "b-player-hp", state.playerHp, state.maxHp);
  $("b-deck-count").textContent = state.deck.length;
  updateRerollChip();
  updateSummonChip();

  renderCardRow("b-enemy-hand", inFight ? state.enemyHand : [], true, animateCards);
  renderCardRow("b-player-hand", inFight ? state.playerHand : [], false, animateCards);
}

function updateRerollChip() {
  const el = $("b-reroll-label");
  if (!el) return;
  el.textContent = state.rerollTokens > 0 ? t("rerollChipFree")(state.rerollTokens) : t("rerollChip");
}

function updateSummonChip() {
  const el = $("b-summon-label");
  if (!el) return;
  const free = state.freeSummons || 0;
  el.textContent = free > 0 ? t("summonChipFree")(free) : t("summonChip");
}

function renderCardRow(rowId, cards, isEnemy, animate) {
  const row = $(rowId);
  row.innerHTML = "";
  cards.forEach((k, i) => {
    const source = !isEnemy && state.playerHandSources ? state.playerHandSources[i] : null;
    row.appendChild(makeCardEl(k, isEnemy, i, animate, source));
  });
}

function makeCardEl(k, isEnemy = false, idx = 0, animate = true, source = null) {
  const el = document.createElement("div");
  const tier = typeof getKanjiTier === "function" ? getKanjiTier(k) : "edu";
  const srcCls = !isEnemy ? (source === "bag" ? " src-bag" : " src-stage") : "";
  const charLen = [...String(k)].length;
  const multiCls = charLen > 1 ? ` multi${charLen >= 3 ? " multi-long" : ""}` : "";
  el.className = `kanji-card tier-${tier}${isEnemy ? " enemy-sm" : ""}${srcCls}${multiCls}`;
  el.dataset.len = String(Math.min(5, Math.max(1, charLen)));
  if (animate) el.style.animationDelay = `${idx * 65}ms`;
  else el.style.animation = "none";

  const keepFocus = (e) => { if (document.activeElement === $("b-input")) e.preventDefault(); };
  el.addEventListener("pointerdown", keepFocus);
  el.addEventListener("mousedown", keepFocus);
  el.onclick = () => {
    playClickSfx();
    insertKanji(k);
  };

  const srcBadge = !isEnemy
    ? `<span class="src-badge" title="${source === "bag" ? t("bagCardTip") : t("stageCardTip")(state.sign || "門")}">${source === "bag" ? "★" : escapeHtml(state.sign || "地")}</span>`
    : "";
  el.innerHTML = `${srcBadge}<div class="char">${escapeHtml(k)}</div>${!isEnemy ? `<span class="key-hint">Alt+${idx + 1}</span>` : ""}`;
  return el;
}

/* Insert a Kanji at the caret. On touch devices, don't pop the keyboard unless it is already open. */
function insertKanji(k) {
  const inp = $("b-input");
  if (inp.disabled || state.phase !== "battle") return;
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

/* ---- Run log ----
 * Entries are recorded in state.history so a reload can replay the current descent.
 * The log is never wiped between runs; separators mark where a new descent begins. */

function scrollLogToBottom() {
  const gmBox = $("b-gm-log");
  if (gmBox) requestAnimationFrame(() => { gmBox.scrollTop = gmBox.scrollHeight; });
}

function pushLogNode(node) {
  const box = $("b-gm-log");
  box.appendChild(node);
  while (box.children.length > LOG_DOM_CAP) box.removeChild(box.firstChild);
  scrollLogToBottom();
  return node;
}

function recordHistory(entry) {
  state.history.push(entry);
  if (state.history.length > LOG_HISTORY_CAP) state.history.splice(0, state.history.length - LOG_HISTORY_CAP);
}

function renderMdEntry(md, cls) {
  const entry = document.createElement("div");
  entry.className = `log-entry ${cls || ""}`.trim();
  entry.innerHTML = formatGmText(md);
  return entry;
}

function renderBeatEntry({ cls, title, lines }) {
  const entry = document.createElement("div");
  entry.className = `log-entry beat-log ${cls}`;
  entry.innerHTML = `<div class="beat-title">${escapeHtml(title)}</div>` +
    lines.map(l => `<div class="beat-line">${formatGmText(l)}</div>`).join("");
  return entry;
}

/* Append a markdown entry. record=false for transient notes (hints, errors). */
function logMd(md, cls = "", record = true) {
  if (record) recordHistory({ md, cls });
  return pushLogNode(renderMdEntry(md, cls));
}

function logBeat(cls, title, lines, record = true) {
  const beat = { cls, title, lines };
  if (record) recordHistory({ beat });
  return pushLogNode(renderBeatEntry(beat));
}

/* After a reload: show the tail of this descent's log. */
function replayHistory(count = 40) {
  state.history.slice(-count).forEach(e => pushLogNode(e.beat ? renderBeatEntry(e.beat) : renderMdEntry(e.md, e.cls)));
}

function historyAsText() {
  return state.history.map(e => (e.beat ? [e.beat.title, ...e.beat.lines].join("\n") : e.md)).join("\n\n");
}

function clearGmLog(toast = true) {
  $("b-gm-log").innerHTML = "";
  if (toast) showToast(t("toastCleared"));
}

/* ---- Dock actions (fork tiles, spoils, event options, run-end buttons) ---- */

function setDockActions(buttons) {
  const box = $("b-dock-action");
  box.innerHTML = "";
  const forkCount = buttons.filter(b => b && b.cls && b.cls.includes("fork-tile")).length;
  box.classList.toggle("fork-grid-4", forkCount === 4);
  buttons.forEach(({ label, right, html, onClick, gold, cls }) => {
    const b = document.createElement("button");
    b.className = `btn${gold ? " btn-gold" : ""}${cls ? ` ${cls}` : ""}`;
    if (html) {
      b.innerHTML = html;
    } else {
      let mainTxt = String(label || "");
      let rightTxt = right ? String(right) : "";
      if (!rightTxt) {
        const yenMatch = mainTxt.match(/^(.*?)\s*·\s*([+-]?[\d,]+\s*円)$/);
        if (yenMatch) {
          mainTxt = yenMatch[1];
          rightTxt = yenMatch[2];
        } else if (mainTxt.includes(" — ")) {
          const parts = mainTxt.split(" — ");
          mainTxt = parts[0].trim();
          rightTxt = parts.slice(1).join(" · ").trim();
        }
      }
      if (rightTxt) {
        b.classList.add("btn-split");
        b.innerHTML =
          `<span class="btn-label-main">${escapeHtml(mainTxt)}</span>` +
          `<span class="btn-label-right">${escapeHtml(rightTxt)}</span>`;
      } else {
        b.textContent = mainTxt;
      }
    }
    b.onclick = onClick;
    box.appendChild(b);
  });
}

/* ---- Combat FX ---- */

function popNumber(anchor, text, cls) {
  const pop = document.createElement("div");
  pop.className = `num-pop ${cls}`;
  pop.textContent = text;
  anchor.appendChild(pop);
  setTimeout(() => pop.remove(), 950);
}

function triggerCombatFX(enemyDmg, playerDmg, playerHeal = 0, defense = "none") {
  const hasSlash = enemyDmg > 0;
  if (hasSlash) {
    playSlashSfx();
    const bossCard = $("b-boss-card");
    bossCard.classList.remove("hit");
    void bossCard.offsetWidth;
    bossCard.classList.add("hit");

    const slash = document.createElement("div");
    slash.className = "slash-streak";
    bossCard.appendChild(slash);
    setTimeout(() => slash.remove(), 480);

    popNumber(bossCard, `-${enemyDmg}`, "dmg");
  }
  if (playerHeal > 0) {
    popNumber($("b-player-stat"), `+${playerHeal}`, "heal");
    if (typeof playHealSfx === "function") {
      setTimeout(() => playHealSfx(), hasSlash ? 110 : 0);
    }
  }
  if (playerDmg > 0) {
    const delay = hasSlash ? 195 : 0;
    setTimeout(() => {
      playDamageSfx();
      popNumber($("b-player-stat"), `-${playerDmg}`, "dmg");
      const appRoot = $("app-root");
      const vig = $("damage-vignette");
      appRoot.classList.remove("shake");
      void appRoot.offsetWidth;
      appRoot.classList.add("shake");
      vig.classList.add("flash");
      setTimeout(() => vig.classList.remove("flash"), 380);
    }, delay);
  } else if (defense === "full" && typeof playParrySfx === "function") {
    setTimeout(() => playParrySfx(), hasSlash ? 165 : 0);
  }
}

/* Shows a live context-aware indicator; returns a stop() that removes it and yields elapsed seconds. */
function startJudgingIndicator(kind = "JUDGE") {
  const sendBtn = $("b-send-btn");
  const entry = document.createElement("div");
  entry.className = "log-entry pending-log";
  const keyMap = {
    HINT: "judgingHintMsg",
    PROMPT: "judgingPromptMsg",
    SUMMON: "judgingSummonMsg",
    FLEE: "judgingFleeMsg",
    JUDGE: "judgingMsg"
  };
  const label = t(keyMap[kind] || "judgingMsg");
  entry.innerHTML = `<span class="rune-spinner"></span><span class="judge-txt">${label} (0.0s)</span>`;
  pushLogNode(entry);

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

