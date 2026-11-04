/*
 * Story beats that live inside the log: the kill stamp, the clear card, the death card.
 * Run-end beats also record results (clear records carry the judging model).
 */

function resetBattleChrome() {
  $("view-battle").classList.remove("run-over");
  $("b-boss-card").classList.remove("defeated", "player-dead", "abandoned", "returned", "completed");
}

function showVictoryBeat() {
  const k = state.lastKill || { kanji: state.enemyKanji, turns: state.turn, dmgTaken: 0 };
  $("b-boss-card").classList.remove("hit", "player-dead", "abandoned", "returned", "completed");
  $("b-boss-card").classList.add("defeated");
  if (typeof playSealStampSfx === "function") playSealStampSfx();
  else playGongSfx();
  logBeat("victory-log", `【${k.kanji}】 殺`, [t("victoryStats")(k.turns, k.dmgTaken)]);
}

/* "gemini-2.5-flash", plus markers when the record is not a clean AI-judged Default run. */
function modelTag(rec) {
  const tags = [rec.model || rec.provider];
  if (rec.totalTurns && rec.offlineTurns / rec.totalTurns > 0.5) tags.push("🔌");
  if (rec.mode && rec.mode !== "Default") tags.push(rec.mode);
  return tags.join(" · ");
}

function runSummary() {
  return {
    timeSec: state.elapsedSec,
    totalTurns: state.totalTurns,
    hp: state.playerHp,
    maxHp: state.maxHp,
    kills: state.kills,
    fights: state.fights,
    deckSize: state.deck.length,
    provider: config.provider,
    model: config.model,
    mode: config.instMode,
    offlineTurns: state.offlineTurns,
    date: Date.now()
  };
}

function endRunDock(depthId, { cleared }) {
  if (cleared) {
    setDockActions([
      { label: t("continueExpeditionBtn"), onClick: continueExpeditionFromClear, gold: true },
      { label: t("finishExpeditionBtn"), onClick: finishExpeditionFromClear }
    ]);
    return;
  }
  setDockActions([
    { label: t("retryBtn"), onClick: () => startRun(depthId), gold: true },
    { label: t("titleBtn"), onClick: () => transitionToView("title") }
  ]);
}

function continueExpeditionFromClear() {
  playClickSfx();
  state.active = true;
  state.phase = "returned";
  state.enemyKanji = "";
  state.pending = null;
  state.offer = [];
  saveRunToStorage();
  transitionToView("select", "【 帰 還 】", depthName(state.depthId));
}

function finishExpeditionFromClear() {
  if (typeof playSealStampSfx === "function") playSealStampSfx();
  else playClickSfx();
  clearSavedRun();
  showToast(t("toastExpeditionFinished"));
  transitionToView("title");
}

function triggerFormalReturn() {
  state.active = true;
  state.phase = "returned";
  state.enemyKanji = "";
  state.pending = null;
  state.offer = [];
  saveRunToStorage();

  const bossCard = $("b-boss-card");
  bossCard.classList.remove("hit", "defeated", "player-dead", "abandoned", "completed");
  bossCard.classList.add("returned");
  if (typeof playSealStampSfx === "function") playSealStampSfx();
  else playGongSfx();

  renderPhase();
  logBeat("clear-log", t("returnBeatTitle"), [
    t("returnBeatDesc")(state.deck.length, state.playerHp, state.maxHp),
    `*${t("returnSelectHint")}*`
  ]);
  setDockActions([
    { label: t("selectNextGaolBtn"), onClick: () => transitionToView("select"), gold: true },
    { label: t("titleBtn"), onClick: () => transitionToView("title") }
  ]);
  setTimeout(() => {
    if (currentView === "battle" && state.phase === "returned") {
      transitionToView("select");
    }
  }, 650);
}

function achievementLine() {
  return state.runAchievements.map(id => findAchievement(id)).filter(Boolean).map(a => `${a.icon} ${a.name}`).join(", ") || t("goNone");
}

function runCleared() {
  const depthId = state.depthId;
  const rec = runSummary();
  addClearRecord(depthId, rec);
  achOnRunCleared({ depthId, fights: state.fights });

  state.active = true;
  state.phase = "cleared";
  state.pending = null;
  state.offer = [];
  saveRunToStorage();

  const bossCard = $("b-boss-card");
  bossCard.classList.remove("hit", "defeated", "player-dead", "abandoned", "returned");
  bossCard.classList.add("completed");
  if (typeof playSealStampSfx === "function") playSealStampSfx();
  else playGongSfx();

  renderPhase();

  logBeat("clear-log", `【完】 ${depthName(depthId)}`, [
    t("clearDesc")(depthName(depthId), depthGloss(depthId)),
    `⏱ **${formatTime(rec.timeSec)}** · ${rec.totalTurns}T · ⚔ ${rec.kills} · HP ${rec.hp}/${rec.maxHp} · 🀄 ${rec.deckSize}`,
    `**${t("goModel")}**: ${modelTag(rec)}`,
    `**${t("goAch")}**: ${achievementLine()}`,
    `*${t("clearHint")}*`
  ]);
  endRunDock(depthId, { cleared: true });
}

function showRunEnd(wasAbandoned = false) {
  const depthId = state.depthId;
  const rec = runSummary();
  state.phase = wasAbandoned ? "abandoned" : "dead";
  state.deck = [];
  clearSavedRun();
  const bossCard = $("b-boss-card");
  bossCard.classList.remove("hit", "defeated", "player-dead", "abandoned", "returned", "completed");
  bossCard.classList.add(wasAbandoned ? "abandoned" : "player-dead");
  if (typeof playSealStampSfx === "function") playSealStampSfx();
  if (!wasAbandoned) playGongSfx();
  renderPhase();

  logBeat("death-log", wasAbandoned ? t("goAbandon") : t("goDead"), [
    `**${t("goDepth")}**: ${depthNumStr(depthId)} ${depthName(depthId)} — ${depthGloss(depthId)}`,
    `**${t("goReached")}**: ${Math.max(1, state.step)}/${PATH_STEPS} · ${t("goBoss")} 【${state.enemyKanji || state.sign || "—"}】`,
    `**${t("goStreak")}**: ⚔ ${rec.kills} · ${rec.totalTurns}T · ⏱ ${formatTime(rec.timeSec)}`,
    `**${t("goModel")}**: ${modelTag(rec)}`,
    `**${t("goAch")}**: ${achievementLine()}`,
    `*${t("runEndHint")}*`
  ]);
  endRunDock(depthId, { cleared: false });
}
