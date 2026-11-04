/*
 * Run lifecycle and the path: start (empty-handed at a stage fork) → fights / events / spoils → boss.
 * renderPhase() is the single place that maps state.phase to what the screen shows,
 * so a reload can rebuild any moment of a descent.
 */

function startRun(depthId) {
  if (!config.apiKey && !KEYLESS_PROVIDERS.includes(config.provider)) {
    showToast(t("toastKeyless"));
    config.provider = "free_keyless";
    config.model = "openai";
  }
  config.stats.runs = (config.stats.runs || 0) + 1;
  persistStats();

  const roster = depthRoster(depthId);
  const bossPool = roster.bossPool && roster.bossPool.length ? roster.bossPool : [roster.boss];
  const runBoss = bossPool[Math.floor(Math.random() * bossPool.length)];

  state = createRunState();
  Object.assign(state, {
    active: true,
    depthId,
    runNo: config.stats.runs,
    maxHp: STARTING_MAX_HP,
    playerHp: STARTING_MAX_HP,
    phase: "path",
    step: 1,
    sign: (DEPTH_STAGE_POOLS[depthId] || ["道"])[0],
    runBoss,
    bossEncountered: false,
    deck: []
  });

  state.fork = generateFork(1);
  achOnRunStart(depthId);

  resetBattleChrome();
  logMd(`── ${depthNumStr(depthId)} ${depthName(depthId)} · ${kankenLabel(depthId)} ──`, "sep-log");
  logMd(t("enteredMsg")(depthName(depthId), depthGloss(depthId)), "sys-log");
  logMd(`⛩ 1/${PATH_STEPS} — ${t("pathPrompt")}`, "sys-log");
  saveRunToStorage();

  if (currentView !== "battle") transitionToView("battle", depthName(depthId), depthGloss(depthId));
  renderPhase();
}

/* Closing the draft (legacy fallback) backs out of the descent. */
function cancelDraft() {
  clearSavedRun();
  state.phase = "dead";
  transitionToView("select");
}

/* Map the current phase to screen state. Safe to call any time (also after a reload). */
function renderPhase() {
  const view = $("view-battle");
  const over = ["cleared", "dead"].includes(state.phase);
  view.classList.toggle("intermission", !over && state.phase !== "battle");
  view.classList.toggle("run-over", over);
  if (!["reward", "cleared"].includes(state.phase)) $("b-boss-card").classList.remove("defeated");
  updateBattleHUD(false);
  if (!state.pending) closePicker();

  switch (state.phase) {
    case "draft":
      state.phase = "path";
      if (!state.fork || !state.fork.length) state.fork = generateFork(Math.max(1, state.step));
      renderFork();
      break;
    case "path": renderFork(); break;
    case "battle": setDockActions([]); break;
    case "reward": state.pending ? openPendingPick() : renderRewardOffer(); break;
    case "event": state.pending ? openPendingPick() : renderEventOptions(); break;
    default: break;
  }
}

/* ---- Path ---- */

function enterNode(node) {
  state.sign = node.sign;
  state.fork = [];
  state.stageCards = buildStageCards(state.depthId, state.sign);
  const o = node.outcome;
  if (o === "battle") return startBattle("normal");
  if (o === "elite") return startBattle("elite");
  if (o === "boss") return startBattle("boss");
  if (o === "treasure") {
    logMd(`🎁 【${node.sign}】`, "sys-log");
    return runEffects([{ scavenge: 5 }, { offerSpoils: "elite" }]);
  }
  if (o.startsWith("event:")) return startEvent(o.slice(6));
}

function advance() {
  state.offer = [];
  state.eventId = null;
  state.pending = null;
  if (!state.active) return;

  const nextStep = state.step + 1;
  state.step = nextStep;
  if (nextStep >= PATH_STEPS) {
    const boss = state.runBoss || depthRoster(state.depthId).boss;
    state.fork = [{ sign: boss, outcome: "boss", revealed: true }];
    logMd(t("bossPrompt")(boss), "sys-log");
  } else {
    state.fork = generateFork(nextStep);
    if (state.revealNext) {
      state.fork.forEach(f => { f.revealed = true; });
      state.revealNext = false;
    }
    logMd(`⛩ ${nextStep}/${PATH_STEPS} — ${t("pathPrompt")}`, "sys-log");
  }
  state.phase = "path";
  saveRunToStorage();
  renderPhase();
}

/* Pick 3 distinct stage signs from the current depth's stage pool. */
function generateFork(step) {
  const depthPoolSigns = DEPTH_STAGE_POOLS[state.depthId] || Object.keys(STAGE_SIGNS);
  let signs = depthPoolSigns.filter(s => STAGE_SIGNS[s]);
  if (step > 1 && signs.length > FORK_WIDTH) {
    signs = signs.filter(s => s !== state.sign);
  }
  if (step === 1) {
    // First step: avoid pure risky/rest signs so the player explores an opening stage cleanly
    const gentle = signs.filter(s => !STAGE_SIGNS[s].risky && s !== "寺" && s !== "謎");
    if (gentle.length >= FORK_WIDTH) signs = gentle;
  }
  let picks = sample(signs, FORK_WIDTH);
  if (step === PATH_STEPS - 1 && !picks.includes("寺") && !picks.includes("堂") && !picks.includes("祠")) {
    picks[picks.length - 1] = STAGE_SIGNS["寺"] ? "寺" : picks[picks.length - 1];
  }
  return picks.map((sign, idx) => {
    const def = STAGE_SIGNS[sign] || STAGE_SIGNS.道;
    let outcome = weightedPick(def.outcomes);
    // Guarantee at least 2 battle opportunities on step 1 so empty-handed players get stage action & cards
    if (step === 1 && idx < 2 && outcome.startsWith("event:")) {
      outcome = "battle";
    }
    if (outcome === "event:*") {
      outcome = `event:${RANDOM_EVENT_POOL[Math.floor(Math.random() * RANDOM_EVENT_POOL.length)]}`;
    }
    return { sign, outcome, revealed: false };
  });
}

function outcomeIcon(outcome) {
  if (outcome === "event:rest") return OUTCOME_ICONS.rest;
  if (outcome.startsWith("event:")) return OUTCOME_ICONS.event;
  return OUTCOME_ICONS[outcome] || "";
}

function renderFork() {
  if (state.fork.length === 1 && state.fork[0].outcome === "boss") {
    const boss = state.fork[0].sign;
    const labelKanji = state.bossEncountered ? boss : "？";
    setDockActions([{ label: t("bossBtn")(labelKanji), onClick: () => choosePath(0), gold: true, cls: "boss-door" }]);
    return;
  }
  setDockActions(state.fork.map((f, i) => {
    const def = STAGE_SIGNS[f.sign] || STAGE_SIGNS.道;
    const previewCards = (def.cards || []).slice(0, 4).join(" ");
    return {
      html: `<span class="fork-kanji tier-${getKanjiTier(f.sign)}">${escapeHtml(f.sign)}</span>` +
        `<span class="fork-omen">${escapeHtml(pickLang(def.omen))}</span>` +
        `<span class="fork-cards-hint">${escapeHtml(previewCards)}…</span>` +
        (f.revealed ? `<span class="fork-reveal">${outcomeIcon(f.outcome)}</span>` : ""),
      onClick: () => choosePath(i),
      cls: "fork-tile"
    };
  }));
}

function choosePath(i) {
  playClickSfx();
  const node = state.fork[i];
  if (!node) return;
  const def = STAGE_SIGNS[node.sign];
  const omenTxt = def ? ` — *${pickLang(def.omen)}*` : "";
  logMd(`→ 【${node.sign}】${omenTxt}`, "choice-log");
  enterNode(node);
}

/* ---- Fights ---- */

function pickEnemyForStage(rank, forcedKanji = null) {
  if (forcedKanji) return { kanji: forcedKanji, rank };
  const roster = depthRoster(state.depthId);
  const runBoss = state.runBoss || roster.boss;

  if (rank === "boss") return { kanji: runBoss, rank: "boss" };

  const stageDef = STAGE_SIGNS[state.sign] || {};
  const stageFoes = stageDef.foes || [];

  // Mid-to-late run: chance to stumble upon the run's Boss early if it haunts this stage (or risky stage)!
  if (state.step >= 4 && !state.defeatedEnemies.includes(runBoss)) {
    const bossHauntsStage = stageFoes.includes(runBoss);
    const ambushChance = bossHauntsStage ? 0.45 : (stageDef.risky && state.step >= 5 ? 0.2 : 0);
    if (Math.random() < ambushChance) {
      return { kanji: runBoss, rank: "boss" };
    }
  }

  const allPool = [...new Set([...roster.normal, ...roster.elite])];
  const alivePool = allPool.filter(k => !state.defeatedEnemies.includes(k));

  // If every single normal/elite foe in this depth has been slain, the stage is empty!
  if (!alivePool.length) return null;

  // Prefer foes that match this stage's theme and are still alive
  const stageMatches = stageFoes.filter(k => alivePool.includes(k));
  const rankMatches = (roster[rank] || roster.normal).filter(k => alivePool.includes(k));

  let from = stageMatches.length ? stageMatches : (rankMatches.length ? rankMatches : alivePool);
  // Prefer foes not yet encountered unless only wounded/escaped foes remain
  const unencountered = from.filter(k => !state.encounteredEnemies.includes(k));
  if (unencountered.length && Math.random() < 0.75) from = unencountered;

  const chosen = from[Math.floor(Math.random() * from.length)];
  const actualRank = roster.elite.includes(chosen) ? "elite" : rank;
  return { kanji: chosen, rank: actualRank };
}

function enterPeacefulClearedStage() {
  state.stageCards = buildStageCards(state.depthId, state.sign);
  logBeat("event-log", `【${state.sign}】 ${t("emptyStageTitle")}`, [t("emptyStageDesc")(state.sign)]);
  runEffects([{ hp: 12 }, { scavenge: 5 }]);
}

function startBattle(rank, forcedKanji = null) {
  const picked = pickEnemyForStage(rank, forcedKanji);
  if (!picked) {
    return enterPeacefulClearedStage();
  }

  const { kanji, rank: actualRank } = picked;
  if (!state.encounteredEnemies.includes(kanji)) state.encounteredEnemies.push(kanji);
  if (actualRank === "boss" || kanji === state.runBoss) state.bossEncountered = true;
  recordFoeEncountered(kanji);

  const maxHp = ENEMY_HP[actualRank];
  const prevWoundedHp = state.woundedEnemies && state.woundedEnemies[kanji];
  // If we fled from this foe earlier in the run, it keeps its wounded HP (with a tiny 10% breath recovery)
  const startHp = prevWoundedHp
    ? Math.min(maxHp, prevWoundedHp + Math.round(maxHp * 0.1))
    : maxHp;

  Object.assign(state, {
    phase: "battle",
    enemyKanji: kanji,
    enemyRank: actualRank,
    enemyHp: startHp,
    enemyMaxHp: maxHp,
    enemyState: prevWoundedHp ? t("woundedState") : "",
    turn: 1,
    dmgTakenThisEnemy: 0,
    recentActions: []
  });
  state.fights += 1;
  resetPilesForFight();
  drawHand();
  dealEnemyHand();
  for (let i = 0; i < HAND_SIZE; i++) playCardDealSfx(i * 65);

  resetBattleChrome();
  const mark = RANK_MARK[actualRank] ? `${RANK_MARK[actualRank]}·` : "";
  if (prevWoundedHp) {
    logMd(t("reEncounterChallenger")(`${mark}${kanji}`, startHp, maxHp), "sys-log");
  } else {
    logMd(t("nextChallenger")(`${mark}${kanji}`), "sys-log");
  }
  logMd(`🎴 **${t("stageCardsLog")}(【${state.sign}】)**: ${state.stageCards.join(" · ")}`, "fx-log");

  saveRunToStorage();
  renderPhase();
  updateBattleHUD(true);
  const boss = $("b-boss-card");
  boss.classList.remove("enter");
  void boss.offsetWidth;
  boss.classList.add("enter");
  if (actualRank === "boss") playGongSfx();
  if (!isCoarsePointer()) $("b-input").focus();
}

/* ---- Leaving / resuming ---- */

function resumeSavedRun() {
  resetBattleChrome();
  if (!$("b-gm-log").children.length) replayHistory();
  transitionToView("battle", depthName(state.depthId), depthGloss(state.depthId));
  renderPhase();
  if (state.phase === "battle") updateBattleHUD(true);
}

function pauseRunToTitle() {
  closeDropdowns();
  saveRunToStorage();
  transitionToView("title", "一時中断", "RUN SAVED");
}

function promptAbandonRun() {
  playClickSfx();
  closeDropdowns();
  if (!state.active) return;
  openConfirmModal(t("abandonModalTitle"), t("abandonModalDesc"), () => showRunEnd(true));
}
