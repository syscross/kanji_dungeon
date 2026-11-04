/*
 * Story beats that live inside the log: the kill stamp, the clear card, the death card.
 * Run-end beats also record results (clear records carry the judging model).
 */

function resetBattleChrome() {
  $("view-battle").classList.remove("run-over");
  $("b-boss-card").classList.remove("defeated");
}

function showVictoryBeat() {
  const k = state.lastKill || { kanji: state.enemyKanji, turns: state.turn, dmgTaken: 0 };
  $("b-boss-card").classList.remove("hit");
  $("b-boss-card").classList.add("defeated");
  playGongSfx();
  logBeat("victory-log", `【${k.kanji}】 斬`, [t("victoryStats")(k.turns, k.dmgTaken)]);
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
  const buttons = [{ label: t("retryBtn"), onClick: () => startRun(depthId), gold: !cleared }];
  const next = `depth_${depthNumber(depthId) + 1}`;
  if (cleared && KANKEN_DATA[next]) {
    buttons.push({ label: `⛩ ${depthNumStr(next)} ${depthName(next)}`, onClick: () => startRun(next), gold: true });
  }
  buttons.push({ label: t("copyLogBtn"), onClick: exportBattleLog });
  buttons.push({ label: t("titleBtn"), onClick: () => transitionToView("title") });
  setDockActions(buttons);
}

function achievementLine() {
  return state.runAchievements.map(id => findAchievement(id)).filter(Boolean).map(a => `${a.icon} ${a.name}`).join(", ") || t("goNone");
}

function runCleared() {
  const depthId = state.depthId;
  const rec = runSummary();
  addClearRecord(depthId, rec);
  showVictoryBeat();
  achOnRunCleared({ depthId, fights: state.fights });

  state.phase = "cleared";
  clearSavedRun();
  renderPhase();

  logBeat("clear-log", `【踏破】 ${depthName(depthId)}`, [
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
  state.phase = "dead";
  clearSavedRun();
  if (!wasAbandoned) playGongSfx();
  renderPhase();

  logBeat("death-log", wasAbandoned ? t("goAbandon") : t("goDead"), [
    `**${t("goDepth")}**: ${depthNumStr(depthId)} ${depthName(depthId)} — ${depthGloss(depthId)}`,
    `**${t("goReached")}**: ${Math.max(1, state.step)}/${PATH_STEPS} · ${t("goBoss")} 【${state.enemyKanji || "—"}】`,
    `**${t("goStreak")}**: ⚔ ${rec.kills} · ${rec.totalTurns}T · ⏱ ${formatTime(rec.timeSec)}`,
    `**${t("goModel")}**: ${modelTag(rec)}`,
    `**${t("goAch")}**: ${achievementLine()}`,
    `*${t("runEndHint")}*`
  ]);
  endRunDock(depthId, { cleared: false });
}
