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

function doReroll() {
  if (state.playerHp <= 5) {
    appendGmLog(t("rerollTooWeak"), "hint-log");
    return;
  }
  achOnCommand("REROLL");
  state.playerHp -= 5;
  triggerCombatFX(0, 0);
  state.playerHand = sample(KANKEN_DATA[state.depthId].kanji, 5);
  for (let i = 0; i < 5; i++) playCardDealSfx(i * 65);
  updateBattleHUD(true);
  saveRunToStorage();
  appendGmLog(t("rerollDone")(state.playerHand.join(" · ")), "hint-log");
}

async function handleBattleSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();
  const inp = $("b-input");
  const raw = inp.value.trim();
  if (!raw || inp.disabled || !state.active || state.awaitingNext || state.playerHp <= 0) return;

  state._lastRawInput = raw;
  const parsed = parseInputCommand(raw);

  if (parsed.type === "REROLL") {
    inp.value = "";
    doReroll();
    return;
  }
  if (parsed.type === "PROMPT" && !parsed.arg) {
    appendGmLog(t("promptUsage"), "hint-log");
    return;
  }
  if (parsed.type === "UNKNOWN_SLASH") {
    appendGmLog(t("unknownCmd")(parsed.cmd), "hint-log");
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
      appendGmLog(`💡 **[${parsed.type} · ⏱ ${sec}s]**\n${reply}`, "hint-log");
    } catch (err) {
      stopJudging();
      appendGmLog(t("apiError")(err.message), "hint-log");
    } finally {
      setInputBusy(false);
      if (!isCoarsePointer()) inp.focus();
    }
    return;
  }

  // Judged turn (normal action or summon)
  let summonDirective = "";
  let summonPaid = 0;
  if (parsed.type === "SUMMON") {
    if (state.playerHp <= state.summonCost) {
      appendGmLog(t("summonNoHp")(state.summonCost), "hint-log");
      return;
    }
    achOnCommand("SUMMON");
    summonPaid = state.summonCost;
    state.playerHp -= summonPaid;
    state.summonCost += 10;
    summonDirective = buildSummonDirective(summonPaid, parsed.arg);
    updateBattleHUD(false);
  }

  setInputBusy(true);
  const stopJudging = startJudgingIndicator();
  try {
    const res = await callLLM(buildJudgePrompt(raw, summonDirective), true);
    const sec = stopJudging();
    applyTurnResult(raw, normalizeJudgment(res), sec);
    inp.value = "";
  } catch (err) {
    stopJudging();
    if (summonPaid) {
      // The turn never happened — refund the summon.
      state.playerHp += summonPaid;
      state.summonCost -= 10;
      updateBattleHUD(false);
    }
    appendGmLog(t("apiError")(err.message), "hint-log");
  } finally {
    setInputBusy(false);
    if (isCoarsePointer()) inp.blur();
    else inp.focus();
  }
}

/* Once per run, explain why a turn got the crude offline verdict and offer to connect an AI. */
function maybeShowTrialNudge(j) {
  if (!j.offline || state.trialNudgeShown) return;
  state.trialNudgeShown = true;
  const entry = appendGmLog(t("trialNudge"), "hint-log");
  const btn = document.createElement("button");
  btn.className = "btn btn-gold log-cta";
  btn.textContent = t("connectBtn");
  btn.onclick = () => openConnectModal();
  entry.appendChild(btn);
}

function applyTurnResult(rawInput, j, sec = "0.0") {
  state.fieldState = j.fieldState;
  state.playerState = j.playerState;
  state.enemyState = j.enemyState;
  state.recentActions = [...state.recentActions, rawInput.slice(0, 140)].slice(-3);
  state.totalTurns = (state.totalTurns || 0) + 1;

  state.enemyHp = Math.max(0, state.enemyHp - j.enemyDamage);
  const hpBefore = state.playerHp;
  state.playerHp = Math.min(100, state.playerHp + j.playerHeal);
  const healed = state.playerHp - hpBefore;
  achOnTurnJudged({ ...j, playerHeal: healed });

  const usedTxt = j.used.length ? `${t("usedCards")}: ${j.used.join(" · ")} → ` : "";
  const gains = [`**${t("dmgEnemy")(j.enemyDamage)}**`];
  if (healed > 0) gains.push(`**${t("healYou")(healed)}**`);
  const youLine = `🗣 **[T${state.turn} · ${t("logYou")}]** "${rawInput}" *(${state.playerHand.join(" ")})*`;
  const gmLine = `⚖ **[${VERDICT_LABELS[j.verdict]} · ${j.offline ? "🔌 offline GM" : `⏱ ${sec}s`}]** ${j.judgment}\n   ${usedTxt}${gains.join(", ")}`;
  const verdictClass = `verdict-${j.verdict.toLowerCase()}`;

  if (state.enemyHp <= 0) {
    triggerCombatFX(j.enemyDamage, 0, healed);
    state.streak += 1;
    recordStreakScore(state.depthId);
    const log = `${youLine}\n${gmLine}`;
    state.history.push(log);
    appendGmLog(log, verdictClass);
    maybeShowTrialNudge(j);
    achOnEnemyDefeated({
      kanji: state.enemyKanji,
      depthId: state.depthId,
      turn: state.turn,
      dmgTaken: state.dmgTakenThisEnemy,
      playerHp: state.playerHp,
      streak: state.streak
    });
    state.lastKill = { kanji: state.enemyKanji, turns: state.turn, dmgTaken: state.dmgTakenThisEnemy };
    state.awaitingNext = true;
    updateBattleHUD(false);
    saveRunToStorage();
    setTimeout(() => showVictoryBeat(), 450);
    return;
  }

  state.playerHp = Math.max(0, state.playerHp - j.playerDamage);
  state.dmgTakenThisEnemy += j.playerDamage;
  triggerCombatFX(j.enemyDamage, j.playerDamage, healed);

  const enemyUsedTxt = j.enemyUsed.length ? `\n   ${t("usedCards")}: ${j.enemyUsed.join(" · ")} → ` : "\n   ";
  const enemyLine = `👹 **【${state.enemyKanji}】** *(${t("enemyHandLog")}: ${state.enemyHand.join(" ")})* ${j.enemyAction}${enemyUsedTxt}**${t("dmgYou")(j.playerDamage)}**`;
  const log = `${youLine}\n${gmLine}\n${enemyLine}`;
  state.history.push(log);
  appendGmLog(log, verdictClass);
  maybeShowTrialNudge(j);

  if (state.playerHp <= 0) {
    updateBattleHUD(false);
    setTimeout(() => showRunEnd(false), 650);
    return;
  }

  state.turn += 1;
  dealNewHands(true);
  updateBattleHUD(true);
  saveRunToStorage();
}

function exportBattleLog() {
  playClickSfx();
  closeDropdowns();
  const d = KANKEN_DATA[state.depthId];
  const header = `=== KANJI DUNGEON 【漢字地獄】 (${d ? d.title : state.depthId}) ===\nMode: ${config.instMode} | Model: ${config.model} | Streak: 🔥 ${state.streak} | Time: ${formatTime(state.elapsedSec)}\n\n`;
  const body = state.history.length ? state.history.join("\n\n---\n\n") : $("b-gm-log").innerText;
  navigator.clipboard.writeText(header + body).then(
    () => showToast(t("toastCopied")),
    () => showToast(t("toastErr")("clipboard"))
  );
}
