/*
 * Run lifecycle and the path: start → draft → forks → fights / events / spoils → boss.
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

  state = createRunState();
  Object.assign(state, {
    active: true,
    depthId,
    runNo: config.stats.runs,
    maxHp: STARTING_MAX_HP,
    playerHp: STARTING_MAX_HP,
    phase: "draft"
  });
  state.draftOffer = rollDraftOffer();
  achOnRunStart(depthId);

  resetBattleChrome();
  logMd(`── ${depthNumStr(depthId)} ${depthName(depthId)} · ${kankenLabel(depthId)} ──`, "sep-log");
  logMd(t("enteredMsg")(depthName(depthId), depthGloss(depthId)), "sys-log");
  saveRunToStorage();

  if (currentView !== "battle") transitionToView("battle", depthName(depthId), depthGloss(depthId));
  renderPhase();
}

function confirmDraft() {
  state.deck = [...state.draftOffer];
  state.draftOffer = [];
  closePicker();
  logMd(`🀄 ${t("deckBtn")}: **${state.deck.join(" ")}**`, "sys-log");
  enterNode({ sign: "道", outcome: "battle" });
}

/* Map the current phase to screen state. Safe to call any time (also after a reload). */
function renderPhase() {
  const view = $("view-battle");
  const over = ["cleared", "dead"].includes(state.phase);
  view.classList.toggle("intermission", !over && state.phase !== "battle");
  view.classList.toggle("run-over", over);
  // The kill stamp belongs to the spoils moment and the run end; clear it elsewhere.
  if (!["reward", "cleared"].includes(state.phase)) $("b-boss-card").classList.remove("defeated");
  updateBattleHUD(false);
  if (state.phase !== "draft" && !state.pending) closePicker();

  switch (state.phase) {
    case "draft": setDockActions([]); openDraftPicker(); break;
    case "path": renderFork(); break;
    case "battle": setDockActions([]); break;
    case "reward": state.pending ? openPendingPick() : renderRewardOffer(); break;
    case "event": state.pending ? openPendingPick() : renderEventOptions(); break;
    default: break;
  }
}

/* ---- Path ---- */

function enterNode(node) {
  state.step += 1;
  state.sign = node.sign;
  state.fork = [];
  const o = node.outcome;
  if (o === "battle") return startBattle("normal");
  if (o === "elite") return startBattle("elite");
  if (o === "boss") return startBattle("boss");
  if (o === "treasure") {
    logMd(`🎁 【${node.sign}】`, "sys-log");
    return offerRewards("elite");
  }
  if (o.startsWith("event:")) return startEvent(o.slice(6));
}

function advance() {
  state.offer = [];
  state.eventId = null;
  state.pending = null;
  if (!state.active) return;

  const nextStep = state.step + 1;
  if (nextStep >= PATH_STEPS) {
    const boss = depthRoster(state.depthId).boss;
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

/* Three distinct signs; no risky signs right after the first fight; a temple before the boss. */
function generateFork(step) {
  let signs = Object.keys(STAGE_SIGNS);
  if (step <= 2) signs = signs.filter(s => !STAGE_SIGNS[s].risky);
  let picks = sample(signs, FORK_WIDTH);
  if (step === PATH_STEPS - 1 && !picks.includes("寺")) picks[picks.length - 1] = "寺";
  return picks.map(sign => {
    let outcome = weightedPick(STAGE_SIGNS[sign].outcomes);
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
    setDockActions([{ label: t("bossBtn")(boss), onClick: () => choosePath(0), gold: true, cls: "boss-door" }]);
    return;
  }
  setDockActions(state.fork.map((f, i) => ({
    html: `<span class="fork-kanji">${escapeHtml(f.sign)}</span>` +
      `<span class="fork-omen">${escapeHtml(pickLang(STAGE_SIGNS[f.sign].omen))}</span>` +
      (f.revealed ? `<span class="fork-reveal">${outcomeIcon(f.outcome)}</span>` : ""),
    onClick: () => choosePath(i),
    cls: "fork-tile"
  })));
}

function choosePath(i) {
  playClickSfx();
  const node = state.fork[i];
  if (!node) return;
  logMd(`→ 【${node.sign}】`, "choice-log");
  enterNode(node);
}

/* ---- Fights ---- */

function startBattle(rank, forcedKanji = null) {
  const roster = depthRoster(state.depthId);
  let kanji = forcedKanji;
  if (!kanji) {
    const list = rank === "boss" ? [roster.boss] : roster[rank];
    const fresh = list.filter(k => !state.seenEnemies.includes(k));
    const from = fresh.length ? fresh : list;
    kanji = from[Math.floor(Math.random() * from.length)];
  }
  state.seenEnemies.push(kanji);
  Object.assign(state, {
    phase: "battle",
    enemyKanji: kanji,
    enemyRank: rank,
    enemyHp: ENEMY_HP[rank],
    enemyMaxHp: ENEMY_HP[rank],
    enemyState: "",
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
  logMd(t("nextChallenger")(`${RANK_MARK[rank] ? RANK_MARK[rank] + "·" : ""}${kanji}`), "sys-log");
  saveRunToStorage();
  renderPhase();
  updateBattleHUD(true);
  const boss = $("b-boss-card");
  boss.classList.remove("enter");
  void boss.offsetWidth;
  boss.classList.add("enter");
  if (rank === "boss") playGongSfx();
  if (!isCoarsePointer()) $("b-input").focus();
}

/* ---- Leaving / resuming ---- */

function resumeSavedRun() {
  resetBattleChrome();
  if (!$("b-gm-log").children.length) replayHistory(); // after a reload the log is empty
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
