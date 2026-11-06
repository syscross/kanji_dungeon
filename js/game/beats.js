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
  const storyMode = typeof isStoryMode === "function" && isStoryMode();
  if (cleared) {
    if (storyMode) {
      setDockActions([
        { label: `🏮 ${t("villageNodeTitle")}`, onClick: () => startVillageStage(), gold: true },
        { label: `⛩ ${t("selectNextGaolBtn")}`, onClick: continueExpeditionFromClear },
        { label: t("titleBtn"), onClick: finishExpeditionFromClear }
      ]);
      return;
    }
    setDockActions([
      { label: t("continueExpeditionBtn"), onClick: continueExpeditionFromClear, gold: true },
      { label: t("finishExpeditionBtn"), onClick: finishExpeditionFromClear }
    ]);
    return;
  }
  if (storyMode) {
    setDockActions([
      {
        label: `🏮 ${t("storyReturnVillageBtn")}`,
        onClick: () => startVillageStage(),
        gold: true
      },
      { label: `⛩ ${t("selectNextGaolBtn")}`, onClick: () => transitionToView("select") },
      { label: t("titleBtn"), onClick: () => transitionToView("title") }
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
  if (typeof isStoryMode === "function" && isStoryMode()) {
    const st = ensureStoryConfig();
    st.deck = [...state.deck];
    persistStoryState();
    clearSavedRun("story");
    transitionToView("select", "【 帰 還 】", depthName(state.depthId));
    return;
  }
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
  if (typeof isStoryMode === "function" && isStoryMode()) {
    const st = ensureStoryConfig();
    st.deck = [...state.deck];
    persistStoryState();
    clearSavedRun("story");
    showToast(t("toastExpeditionFinished"));
    transitionToView("title");
    return;
  }
  clearSavedRun("arcade");
  showToast(t("toastExpeditionFinished"));
  transitionToView("title");
}

function triggerFormalReturn() {
  const storyMode = typeof isStoryMode === "function" && isStoryMode();
  state.active = !storyMode;
  state.phase = "returned";
  state.enemyKanji = "";
  state.pending = null;
  state.offer = [];

  if (storyMode) {
    const st = ensureStoryConfig();
    st.deck = [...state.deck];
    persistStoryState();
    clearSavedRun("story");
  } else {
    saveRunToStorage();
  }

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
  if (storyMode) {
    setDockActions([
      { label: `🏮 ${t("villageNodeTitle")}`, onClick: () => startVillageStage(), gold: true },
      { label: `⛩ ${t("selectNextGaolBtn")}`, onClick: () => transitionToView("select") },
      { label: t("titleBtn"), onClick: () => transitionToView("title") }
    ]);
  } else {
    setDockActions([
      { label: t("selectNextGaolBtn"), onClick: () => transitionToView("select"), gold: true },
      { label: t("titleBtn"), onClick: () => transitionToView("title") }
    ]);
  }
}

function achievementLine() {
  return state.runAchievements.map(id => findAchievement(id)).filter(Boolean).map(a => `${a.icon} ${a.name}`).join(", ") || t("goNone");
}

/* Called right when the Boss is slain (before Boss Kanji scavenge):
 * Boss head keeps 【殺】 (.defeated), while 【完】 is immediately logged and recorded! */
function logBossClearImmediate() {
  const depthId = state.depthId;
  const dNum = depthNumber(depthId);
  const rec = runSummary();
  addClearRecord(depthId, rec);
  achOnRunCleared({ depthId, fights: state.fights });
  state.hasClearedBoss = true;
  if (typeof isStoryMode === "function" && isStoryMode() && typeof syncStoryKillProgress === "function") {
    syncStoryKillProgress(state.enemyKanji || state.runBoss, true, depthId);
  }
  saveRunToStorage();

  const bossCard = $("b-boss-card");
  bossCard.classList.remove("hit", "player-dead", "abandoned", "returned", "completed");
  bossCard.classList.add("defeated");

  const bossKanji = state.enemyKanji || state.runBoss || depthRoster(depthId).boss;
  if (typeof getBossLastWords === "function") {
    const dyingLine = getBossLastWords(bossKanji, depthId);
    if (dyingLine) {
      logMd(`💬 **【${bossKanji}】** — *${dyingLine}*`, "verdict-clever");
    }
  } else if (dNum === 10 && typeof getDepth10BossLastWords === "function") {
    logMd(getDepth10BossLastWords(bossKanji), "verdict-clever");
  }

  if (typeof isStoryMode === "function" && isStoryMode() && typeof getGaolRestoredLore === "function") {
    const restored = getGaolRestoredLore(depthId);
    if (restored && restored.lore) {
      const kList = restored.kanji.map(k => `【${k}】`).join("·");
      logMd(`🕯 **${kList}** — ${restored.lore}`, "fx-log");
    }
  }

  logBeat("clear-log", `【完】 ${depthName(depthId)}`, [
    t("clearDesc")(depthName(depthId), depthGloss(depthId)),
    `⏱ **${formatTime(rec.timeSec)}** · ${rec.totalTurns}T · ⚔ ${rec.kills} · HP ${rec.hp}/${rec.maxHp} · 🀄 ${rec.deckSize}`,
    `**${t("goModel")}**: ${modelTag(rec)}`,
    `**${t("goAch")}**: ${achievementLine()}`,
    `*${t("clearHint")}*`
  ]);

  if (typeof isStoryMode === "function" && isStoryMode()) {
    if (dNum < 12) {
      const nextDid = `depth_${dNum + 1}`;
      if (KANKEN_DATA[nextDid]) {
        logMd(pickLang({
          EN: `🔓 **【Gaol Unsealed】**: The path to **【${depthNumStr(nextDid)} ${depthName(nextDid)}】** lies open.`,
          KO: `🔓 **【봉인 해금】**: 다음 심연인 **【${depthNumStr(nextDid)} ${depthName(nextDid)}】**로 향하는 문이 열렸습니다.`,
          JA: `🔓 **【獄門解禁】**: 次の深淵 **【${depthNumStr(nextDid)} ${depthName(nextDid)}】** への門が開かれた。`,
          ZH_CN: `🔓 **【狱门解禁】**: 通往下一深渊 **【${depthNumStr(nextDid)} ${depthName(nextDid)}】** 的门已开启。`,
          ZH_TW: `🔓 **【獄門解禁】**: 通往下一深淵 **【${depthNumStr(nextDid)} ${depthName(nextDid)}】** 的門已開啟。`
        }), "fx-log");
      }
    }
    if (dNum === 10 && typeof getHumanWorldHappyEndingLines === "function") {
      logBeat("clear-log", t("storyHumanEndingTitle"), getHumanWorldHappyEndingLines());
    } else if (dNum === 12 && typeof getShuraEndingLines === "function") {
      logBeat("death-log", t("storyShuraEndingTitle"), getShuraEndingLines());
    }
  }
}

function runCleared() {
  const depthId = state.depthId;
  if (!state.hasClearedBoss) {
    logBossClearImmediate();
  }

  const storyMode = typeof isStoryMode === "function" && isStoryMode();
  state.phase = "cleared";
  state.pending = null;
  state.offer = [];

  if (storyMode) {
    const st = ensureStoryConfig();
    st.deck = [...state.deck];
    persistStoryState();
    clearSavedRun("story");
  } else {
    state.active = true;
    saveRunToStorage();
  }

  const bossCard = $("b-boss-card");
  bossCard.classList.remove("hit", "player-dead", "abandoned", "returned", "completed");
  bossCard.classList.add("defeated");

  renderPhase();
  endRunDock(depthId, { cleared: true });
}

function showRunEnd(wasAbandoned = false) {
  if (wasAbandoned && (state.hasClearedBoss || state.phase === "cleared")) {
    finishExpeditionFromClear();
    return;
  }
  const storyMode = typeof isStoryMode === "function" && isStoryMode();
  const depthId = state.depthId;
  const rec = runSummary();
  state.phase = wasAbandoned ? "abandoned" : "dead";

  let storyBagNote = "";
  if (storyMode && typeof resolveStoryDeathOrAbandonBag === "function") {
    const res = resolveStoryDeathOrAbandonBag();
    state.deck = [...res.kept];
    clearSavedRun("story");
    storyBagNote = res.reason || `🕯 ${t("storyDeathPersistedNote")}`;
  } else {
    state.deck = [];
    clearSavedRun("arcade");
  }

  const bossCard = $("b-boss-card");
  bossCard.classList.remove("hit", "defeated", "player-dead", "abandoned", "returned", "completed");
  if (wasAbandoned) {
    bossCard.classList.add("abandoned");
  }
  if (typeof playSealStampSfx === "function") playSealStampSfx();
  if (!wasAbandoned) playGongSfx();
  renderPhase();

  const lines = [
    `**${t("goDepth")}**: ${depthNumStr(depthId)} ${depthName(depthId)} — ${depthGloss(depthId)}`,
    `**${t("goReached")}**: ${Math.max(1, state.step)}/${PATH_STEPS} · ${t("goBoss")} 【${state.enemyKanji || state.sign || "—"}】`,
    `**${t("goStreak")}**: ⚔ ${rec.kills} · ${rec.totalTurns}T · ⏱ ${formatTime(rec.timeSec)}`,
    `**${t("goModel")}**: ${modelTag(rec)}`,
    `**${t("goAch")}**: ${achievementLine()}`
  ];
  if (storyBagNote) lines.push(storyBagNote);
  lines.push(`*${t("runEndHint")}*`);

  logBeat("death-log", wasAbandoned ? t("goAbandon") : t("goDead"), lines);
  endRunDock(depthId, { cleared: false });
}

