/*
 * Battle "beats" that pause the turn loop and live inside the log:
 *  - victory intermission: kill stamp + summary card, the player advances when ready
 *  - run end (death / abandon): fatal blow stays visible, summary card + actions in the dock
 * The dock's prompt row is swapped for #b-dock-action while a beat is showing.
 */

function setDockActions(buttons) {
  const box = $("b-dock-action");
  box.innerHTML = "";
  buttons.forEach(({ label, onClick, gold }) => {
    const b = document.createElement("button");
    b.className = `btn${gold ? " btn-gold" : ""}`;
    b.textContent = label;
    b.onclick = onClick;
    box.appendChild(b);
  });
}

/* Clear beat-related chrome (called when a run starts or a new enemy appears). */
function resetBattleChrome() {
  const view = $("view-battle");
  view.classList.remove("intermission", "run-over");
  $("b-boss-card").classList.remove("defeated");
  $("b-dock-action").innerHTML = "";
}

function appendBeatCard(cls, title, lines) {
  const entry = document.createElement("div");
  entry.className = `log-entry beat-log ${cls}`;
  entry.innerHTML = `<div class="beat-title">${escapeHtml(title)}</div>` +
    lines.map(l => `<div class="beat-line">${formatGmText(l)}</div>`).join("");
  $("b-gm-log").appendChild(entry);
  scrollLogToBottom();
}

/* ---- Victory ---- */

function showVictoryBeat(silent = false) {
  const k = state.lastKill || { kanji: state.enemyKanji, turns: state.turn, dmgTaken: 0 };
  $("view-battle").classList.add("intermission");
  const boss = $("b-boss-card");
  boss.classList.remove("hit");
  boss.classList.add("defeated");
  if (!silent) playGongSfx();

  appendBeatCard("victory-log", t("victoryTitle")(k.kanji), [t("victoryStats")(state.streak, k.turns, k.dmgTaken)]);
  setDockActions([{ label: t("nextEnemyBtn"), onClick: proceedToNextEnemy, gold: true }]);
}

function proceedToNextEnemy() {
  if (!state.awaitingNext) return;
  playClickSfx();
  state.awaitingNext = false;
  state.lastKill = null;
  resetBattleChrome();
  spawnNextEnemy(false);
  const boss = $("b-boss-card");
  boss.classList.remove("enter");
  void boss.offsetWidth;
  boss.classList.add("enter");
  if (!isCoarsePointer()) $("b-input").focus();
}

/* ---- Run end ---- */

function showRunEnd(wasAbandoned = false) {
  const depthId = state.depthId;
  const dTitle = KANKEN_DATA[depthId] ? KANKEN_DATA[depthId].title : depthId;
  clearSavedRun();
  state.awaitingNext = false;
  $("view-battle").classList.remove("intermission");
  $("view-battle").classList.add("run-over");
  if (!wasAbandoned) playGongSfx();

  const achNames = state.runAchievements
    .map(id => findAchievement(id))
    .filter(Boolean)
    .map(a => `${a.icon} ${a.name}`)
    .join(", ") || t("goNone");

  appendBeatCard("death-log", wasAbandoned ? t("goAbandon") : t("goDead"), [
    `**${t("goDepth")}**: ${dTitle}`,
    `**${t("goBoss")}**: 【${state.enemyKanji}】 (HP ${state.enemyHp}/100)`,
    `**${t("goStreak")}**: 🔥 ${state.streak} (Mode: ${config.instMode})`,
    `**${t("goTotalTurns")}**: ${state.totalTurns || state.turn} · ⏱ ${formatTime(state.elapsedSec)}`,
    `**${t("goAch")}**: ${achNames}`,
    `*${t("runEndHint")}*`
  ]);

  setDockActions([
    { label: t("retryBtn"), onClick: () => startRun(depthId), gold: true },
    { label: t("copyLogBtn"), onClick: exportBattleLog },
    { label: t("titleBtn"), onClick: () => transitionToView("title") }
  ]);
}
