/* Run lifecycle: start, enemy spawning, dealing hands, pause / resume / abandon. */

function sample(arr, n) {
  const copy = [...arr];
  const out = [];
  for (let i = 0; i < n && copy.length > 0; i++) {
    out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
  }
  return out;
}

function startRun(depthId) {
  if (!config.apiKey && config.provider !== "free_keyless" && config.provider !== "custom") {
    showToast(t("toastKeyless"));
    config.provider = "free_keyless";
    config.model = "openai";
  }
  state = createRunState();
  state.active = true;
  state.depthId = depthId;
  achOnRunStart(depthId);

  clearGmLog(false);
  spawnNextEnemy(true);
  transitionToView("battle", `DEPTH ${depthNumStr(depthId)}`, depthCleanTitle(depthId));
}

function spawnNextEnemy(isFirst = false) {
  const d = KANKEN_DATA[state.depthId];
  const candidates = d.enemies.length > 1 ? d.enemies.filter(k => k !== state.enemyKanji) : d.enemies;
  state.enemyKanji = candidates[Math.floor(Math.random() * candidates.length)];
  state.enemyHp = 100;
  state.enemyState = "Hostile";
  state.turn = 1;
  state.summonCost = 10;
  state.dmgTakenThisEnemy = 0;
  state.recentActions = [];
  dealNewHands(true);

  updateBattleHUD(true);
  appendGmLog(isFirst ? t("enteredMsg")(d.title, state.enemyKanji) : t("enemySlain")(state.streak, state.enemyKanji), "sys-log");
  saveRunToStorage();
}

function dealNewHands(animate = true) {
  const pool = KANKEN_DATA[state.depthId].kanji;
  state.playerHand = sample(pool, 5);
  state.enemyHand = sample(pool, 5);
  if (animate) for (let i = 0; i < 5; i++) playCardDealSfx(i * 65);
}

function resumeSavedRun() {
  const d = KANKEN_DATA[state.depthId];
  clearGmLog(false);
  updateBattleHUD(true);
  if (state.history.length > 0) state.history.slice(-6).forEach(h => appendGmLog(h));
  else appendGmLog(t("enteredMsg")(d.title, state.enemyKanji), "sys-log");
  transitionToView("battle", "探索再開", `RESUMING ${d.title} (TURN ${state.turn})`);
}

function pauseRunToTitle() {
  closeDropdowns();
  saveRunToStorage();
  transitionToView("title", "一時中断", "RUN SAVED");
}

function promptAbandonRun() {
  playClickSfx();
  closeDropdowns();
  openConfirmModal(t("abandonModalTitle"), t("abandonModalDesc"), () => showGameOverModal(true));
}
