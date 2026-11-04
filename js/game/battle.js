/* Battle turn flow: input parsing, slash commands, GM judging, applying results. */

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

function prefillSlash(prefix) {
  playClickSfx();
  const inp = $("b-input");
  inp.value = prefix;
  inp.focus();
}

function triggerSlash(cmd) {
  playClickSfx();
  $("b-input").value = cmd;
  handleBattleSubmit(null);
}

function setInputBusy(busy) {
  $("b-input").disabled = busy;
  $("b-send-btn").disabled = busy;
}

function canAct() {
  return state.active && state.phase === "battle" && state.playerHp > 0 && !$("b-input").disabled;
}

function doReroll() {
  if (state.rerollTokens > 0) {
    state.rerollTokens -= 1;
  } else if (state.playerHp <= REROLL_HP_COST) {
    logMd(t("rerollTooWeak"), "hint-log", false);
    return;
  } else {
    state.playerHp -= REROLL_HP_COST;
  }
  achOnCommand("REROLL");
  drawHand();
  for (let i = 0; i < HAND_SIZE; i++) playCardDealSfx(i * 65);
  updateBattleHUD(true);
  saveRunToStorage();
  logMd(t("rerollDone")(state.playerHand.join(" · ")), "hint-log");
}

async function handleBattleSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();
  const inp = $("b-input");
  const raw = inp.value.trim();
  if (!raw || !canAct()) return;

  state._lastRawInput = raw;
  const parsed = parseInputCommand(raw);

  if (parsed.type === "REROLL") {
    inp.value = "";
    doReroll();
    return;
  }
  if (parsed.type === "PROMPT" && !parsed.arg) {
    logMd(t("promptUsage"), "hint-log", false);
    return;
  }
  if (parsed.type === "UNKNOWN_SLASH") {
    logMd(t("unknownCmd")(parsed.cmd), "hint-log", false);
    return;
  }

  // Free briefings (no turn spent)
  if (parsed.type === "HINT" || parsed.type === "PROMPT") {
    achOnCommand(parsed.type);
    setInputBusy(true);
    const stopJudging = startJudgingIndicator();
    try {
      const prompt = parsed.type === "HINT" ? buildHintPrompt() : buildQuestionPrompt(parsed.arg);
      const reply = await callLLM(prompt, false);
      const sec = stopJudging();
      inp.value = "";
      logMd(`💡 **[${parsed.type} · ⏱ ${sec}s]**\n${reply}`, "hint-log", false);
    } catch (err) {
      stopJudging();
      logMd(t("apiError")(err.message), "hint-log", false);
    } finally {
      setInputBusy(false);
      if (!isCoarsePointer()) inp.focus();
    }
    return;
  }

  // Judged turn: the player's move, or an ancient god acting in their place.
  const summon = parsed.type === "SUMMON";
  let summonDirective = "";
  let summonPaid = 0;
  if (summon) {
    if (state.playerHp <= state.summonCost) {
      logMd(t("summonNoHp")(state.summonCost), "hint-log", false);
      return;
    }
    achOnCommand("SUMMON");
    summonPaid = state.summonCost;
    state.playerHp -= summonPaid;
    state.summonCost += SUMMON_COST_STEP;
    summonDirective = buildSummonDirective(summonPaid, parsed.arg);
    updateBattleHUD(false);
  }

  setInputBusy(true);
  const stopJudging = startJudgingIndicator();
  try {
    const res = await callLLM(buildJudgePrompt(raw, summonDirective), true, { summon });
    const sec = stopJudging();
    inp.value = "";
    applyTurnResult(raw, normalizeJudgment(res), sec, { summon });
  } catch (err) {
    stopJudging();
    if (summonPaid) {
      // The turn never happened — refund the summon.
      state.playerHp += summonPaid;
      state.summonCost -= SUMMON_COST_STEP;
      updateBattleHUD(false);
    }
    logMd(t("apiError")(err.message), "hint-log", false);
  } finally {
    setInputBusy(false);
    if (state.phase === "battle") {
      if (isCoarsePointer()) inp.blur();
      else inp.focus();
    }
  }
}

/* Once per run, explain why a turn got the offline verdict and offer to connect an AI. */
function maybeShowTrialNudge(j) {
  if (!j.offline || state.trialNudgeShown || config.provider === "offline") return;
  state.trialNudgeShown = true;
  const entry = logMd(t("trialNudge"), "hint-log", false);
  const btn = document.createElement("button");
  btn.className = "btn btn-gold log-cta";
  btn.textContent = t("connectBtn");
  btn.onclick = () => openConnectModal();
  entry.appendChild(btn);
}

const DEFENSE_MARK = { none: "", partial: " 🛡½", full: " 🛡0" };

function applyTurnResult(rawInput, j, sec = "0.0", { summon = false } = {}) {
  state.fieldState = j.fieldState;
  state.playerState = j.playerState;
  state.enemyState = j.enemyState;
  if (!summon) state.recentActions = [...state.recentActions, rawInput.slice(0, 140)].slice(-3);
  state.totalTurns += 1;
  if (j.offline) state.offlineTurns += 1;

  const n = resolveTurnNumbers(j);
  state.enemyHp = Math.max(0, state.enemyHp - n.enemyDamage);
  const hpBefore = state.playerHp;
  state.playerHp = Math.min(state.maxHp, state.playerHp + n.heal);
  const healed = state.playerHp - hpBefore;
  achOnTurnJudged({ ...j, playerHeal: healed }, { summon });

  const usedTxt = j.used.length ? `${t("usedCards")}: ${j.used.join(" · ")} → ` : "";
  const gains = [`**${t("dmgEnemy")(n.enemyDamage)}**`];
  if (healed > 0) gains.push(`**${t("healYou")(healed)}**`);
  const who = summon ? "🐉" : "🗣";
  const youLine = `${who} **[T${state.turn} · ${t("logYou")}]** "${rawInput}" *(${state.playerHand.join(" ")})*`;
  const judgeTag = j.offline ? `🔌 ${t("offlineTag")}` : `⏱ ${sec}s`;
  const gmLine = `⚖ **[${VERDICT_LABELS[j.verdict]} · ${judgeTag}]** ${j.judgment}\n   ${usedTxt}${gains.join(", ")}`;
  const verdictClass = `verdict-${j.verdict.toLowerCase()}`;

  if (state.enemyHp <= 0) {
    triggerCombatFX(n.enemyDamage, 0, healed);
    logMd(`${youLine}\n${gmLine}`, verdictClass);
    maybeShowTrialNudge(j);
    onEnemyDefeated();
    return;
  }

  state.playerHp = Math.max(0, state.playerHp - n.playerDamage);
  state.dmgTakenThisEnemy += n.playerDamage;
  triggerCombatFX(n.enemyDamage, n.playerDamage, healed);

  const enemyUsedTxt = j.enemyUsed.length ? `${t("usedCards")}: ${j.enemyUsed.join(" · ")} → ` : "";
  const enemyLine = `👹 **【${state.enemyKanji}】** *(${t("enemyHandLog")}: ${state.enemyHand.join(" ")})* ${j.enemyAction}\n   ${enemyUsedTxt}**${t("dmgYou")(n.playerDamage)}**${DEFENSE_MARK[n.defense]}`;
  logMd(`${youLine}\n${gmLine}\n${enemyLine}`, verdictClass);
  maybeShowTrialNudge(j);

  if (state.playerHp <= 0) {
    updateBattleHUD(false);
    setTimeout(() => showRunEnd(false), 650);
    return;
  }

  state.turn += 1;
  drawHand();
  dealEnemyHand();
  updateBattleHUD(true);
  saveRunToStorage();
}

function onEnemyDefeated() {
  state.kills += 1;
  achOnEnemyDefeated({
    kanji: state.enemyKanji,
    depthId: state.depthId,
    turn: state.turn,
    dmgTaken: state.dmgTakenThisEnemy,
    playerHp: state.playerHp,
    kills: state.kills
  });
  const rank = state.enemyRank;
  state.lastKill = { kanji: state.enemyKanji, turns: state.turn, dmgTaken: state.dmgTakenThisEnemy };

  if (rank === "boss") {
    state.phase = "reward"; // locks input until the clear card appears
    updateBattleHUD(false);
    setTimeout(runCleared, 650);
    return;
  }
  state.phase = "reward";
  state.offer = [];
  updateBattleHUD(false);
  saveRunToStorage();
  setTimeout(() => {
    showVictoryBeat();
    offerRewards(rank === "elite" ? "elite" : "normal");
  }, 450);
}

function exportBattleLog() {
  playClickSfx();
  closeDropdowns();
  const d = KANKEN_DATA[state.depthId];
  const header = `=== KANJI DUNGEON 【漢字地獄】 ${depthName(state.depthId)} (${d ? kankenLabel(state.depthId) : ""}) ===\n` +
    `GM: ${config.provider} / ${config.model} · Mode: ${config.instMode} · ${state.step}/${PATH_STEPS} · ⏱ ${formatTime(state.elapsedSec)}\n\n`;
  const body = state.history.length ? historyAsText() : $("b-gm-log").innerText;
  navigator.clipboard.writeText(header + body).then(
    () => showToast(t("toastCopied")),
    () => showToast(t("toastErr")("clipboard"))
  );
}
