/* Battle turn flow: input parsing, slash commands, GM judging, escape, and applying results. */

function parseInputCommand(raw) {
  const trimmed = raw.trim();
  if (!trimmed.startsWith("/")) return { type: "NORMAL", arg: trimmed };
  const parts = trimmed.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const arg = parts.slice(1).join(" ").trim();
  if (cmd === "/hint") return { type: "HINT", arg: "" };
  if (cmd === "/reroll") return { type: "REROLL", arg: "" };
  if (cmd === "/prompt") return { type: "PROMPT", arg };
  if (cmd === "/summon" || cmd === "/소환") return { type: "SUMMON", arg };
  if (cmd === "/flee" || cmd === "/escape" || cmd === "/도주") return { type: "FLEE", arg };
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

/*
 * Clicking the Ancient God Summon chip:
 * - If the input box is empty, summons the Ancient God immediately with no argument (autonomous play).
 * - If the input box has text (e.g. "회복 위주로" or "/summon 방어"), uses that text as the tactical direction!
 */
function triggerSummonChip() {
  playClickSfx();
  if (!canAct()) return;
  const inp = $("b-input");
  const cur = inp.value.trim();
  if (!cur || cur === "/summon") {
    inp.value = "/summon";
  } else if (!cur.toLowerCase().startsWith("/summon")) {
    inp.value = `/summon ${cur}`;
  }
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
    const stopJudging = startJudgingIndicator(parsed.type);
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

  // Judged turn: normal move, escape attempt (/flee), or ancient god summon (/summon).
  const summon = parsed.type === "SUMMON";
  const flee = parsed.type === "FLEE";
  let summonDirective = "";
  let fleeDirective = "";
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
  } else if (flee) {
    fleeDirective = buildFleeDirective(parsed.arg);
  }

  const moveText = summon
    ? (parsed.arg || t("summonDefaultMove"))
    : flee
      ? (parsed.arg || t("defaultFleeMove"))
      : raw;

  setInputBusy(true);
  const stopJudging = startJudgingIndicator(summon ? "SUMMON" : flee ? "FLEE" : "JUDGE");
  try {
    const res = await callLLM(buildJudgePrompt(moveText, summonDirective, fleeDirective), true, { summon, flee });
    const sec = stopJudging();
    inp.value = "";
    applyTurnResult(moveText, normalizeJudgment(res), sec, { summon, flee, summonArg: parsed.arg });
  } catch (err) {
    stopJudging();
    if (summonPaid) {
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

function applySpecialEvent(j) {
  if (!j.specialEvent) return "";
  switch (j.specialEvent) {
    case "TIME_REWIND": {
      state.playerHp = state.maxHp;
      state.turn = 1;
      return `\n⏪ **${t("spTimeRewind")}**`;
    }
    case "STEAL_KANJI": {
      const stolen = state.enemyKanji;
      addCardToDeck(stolen);
      return `\n🧲 **${t("spStealKanji")(stolen)}**`;
    }
    case "MUTATE_ENEMY": {
      const nextK = j.mutatedKanji || "灰";
      const oldK = state.enemyKanji;
      state.enemyKanji = nextK;
      state.enemyHp = Math.max(1, Math.floor(state.enemyHp * 0.5));
      return `\n🧬 **${t("spMutateEnemy")(oldK, nextK)}**`;
    }
    case "FORGE_CARD": {
      const forged = j.forgedKanji || (j.used.length >= 2 ? j.used.slice(0, 2).join("") : null);
      if (forged) {
        addCardToDeck(forged);
        return `\n⚗️ **${t("spForgeCard")(forged)}**`;
      }
      return "";
    }
    case "INSTANT_PACIFY": {
      state.enemyHp = 0;
      return `\n🕯 **${t("spInstantPacify")(state.enemyKanji)}**`;
    }
    default:
      return "";
  }
}

function applyTurnResult(rawInput, j, sec = "0.0", { summon = false, flee = false, summonArg = "" } = {}) {
  state.fieldState = j.fieldState;
  state.playerState = j.playerState;
  state.enemyState = j.enemyState;
  if (!summon) state.recentActions = [...state.recentActions, rawInput.slice(0, 140)].slice(-3);
  state.totalTurns += 1;
  if (j.offline) state.offlineTurns += 1;

  const n = resolveTurnNumbers(j);
  const specialNote = applySpecialEvent(j);

  // Record a 2-kanji combo on MASTERFUL or CLEVER (with 2+ used single-char kanji) so it can appear in post-battle scavenge!
  if ((j.verdict === "MASTERFUL" || j.verdict === "CLEVER") && j.used.length >= 2) {
    const singleUsed = j.used.filter(k => [...k].length === 1);
    if (singleUsed.length >= 2) {
      state.lastComboKanji = j.forgedKanji || singleUsed.slice(0, 2).join("");
    }
  }

  // Reward countering enemy intent with full defense or MASTERFUL play with +1 free reroll token
  let bonusNote = "";
  if (j.verdict === "MASTERFUL" || (j.verdict === "CLEVER" && n.defense === "full")) {
    state.rerollTokens += 1;
    bonusNote = `\n⚡ **${t("counterBonusLog")}**`;
  }

  state.enemyHp = Math.max(0, state.enemyHp - n.enemyDamage);
  const hpBefore = state.playerHp;
  state.playerHp = Math.min(state.maxHp, state.playerHp + n.heal);
  const healed = state.playerHp - hpBefore;
  achOnTurnJudged({ ...j, playerHeal: healed }, { summon });

  const usedTxt = j.used.length ? `${t("usedCards")}: ${j.used.join(" · ")} → ` : "";
  const gains = [];
  if (n.enemyDamage > 0) gains.push(`**${t("dmgEnemy")(n.enemyDamage)}**`);
  if (healed > 0) gains.push(`**${t("healYou")(healed)}**`);

  const who = summon ? "🐉" : flee ? "🏃" : "🗣";
  const actorLabel = summon ? t("logGod") : t("logYou");
  const displayMove = summon
    ? `${j.godChant || rawInput}${summonArg ? ` *(${t("summonDirLabel")}: ${summonArg})*` : ""}`
    : `"${rawInput}"`;
  const youLine = `${who} **[T${state.turn} · ${actorLabel}]** ${displayMove} *(${state.playerHand.join(" ")})*`;
  const judgeTag = j.offline ? `🔌 ${t("offlineTag")}` : `⏱ ${sec}s`;
  const gainsStr = gains.length ? `${usedTxt}${gains.join(", ")}` : usedTxt;
  const gmLine = `⚖ **[${VERDICT_LABELS[j.verdict]} · ${judgeTag}]** ${j.judgment}${gainsStr ? `\n   ${gainsStr}` : ""}${specialNote}${bonusNote}`;
  const verdictClass = `verdict-${j.verdict.toLowerCase()}`;

  if (state.enemyHp <= 0) {
    triggerCombatFX(n.enemyDamage, 0, healed);
    logMd(`${youLine}\n${gmLine}`, verdictClass);
    maybeShowTrialNudge(j);
    onEnemyDefeated();
    return;
  }

  // Handle PLAYER's successful or costly escape!
  if (j.escape === "success" || j.escape === "costly") {
    state.playerHp = Math.max(0, state.playerHp - n.playerDamage);
    state.dmgTakenThisEnemy += n.playerDamage;
    triggerCombatFX(n.enemyDamage, n.playerDamage, healed);

    const costLine = n.playerDamage > 0
      ? `\n👹 **【${state.enemyKanji}】** ${j.enemyAction} (**${t("dmgYou")(n.playerDamage)}**)`
      : "";
    const escLine = `\n🏃 **${t("escapeSuccessLog")(state.enemyKanji, state.enemyHp, state.enemyMaxHp)}**`;
    logMd(`${youLine}\n${gmLine}${costLine}${escLine}`, verdictClass);
    maybeShowTrialNudge(j);

    if (state.playerHp <= 0) {
      updateBattleHUD(false);
      setTimeout(() => showRunEnd(false), 650);
      return;
    }

    // Foe remains alive in this run with its current wounded HP!
    state.woundedEnemies = state.woundedEnemies || {};
    state.woundedEnemies[state.enemyKanji] = state.enemyHp;
    state.phase = "path";
    updateBattleHUD(false);
    saveRunToStorage();
    setTimeout(() => advance(), 550);
    return;
  }

  // Handle ENEMY's telegraphed escape attempt (when state.enemyEscapeIntent was active this turn!)
  if (state.enemyEscapeIntent) {
    if (n.defense === "full" || n.defense === "partial") {
      // Player successfully chased/blocked the enemy's escape!
      const staggerDmg = Math.min(state.enemyHp - 1, 6);
      if (staggerDmg > 0) state.enemyHp -= staggerDmg;
      triggerCombatFX(n.enemyDamage + staggerDmg, 0, healed);
      const foilLine = `🛑 **${t("enemyEscapeFoiledLog")(state.enemyKanji)}**${staggerDmg > 0 ? ` (**${t("dmgEnemy")(staggerDmg)}**)` : ""}`;
      logMd(`${youLine}\n${gmLine}\n${foilLine}`, verdictClass);
      maybeShowTrialNudge(j);
    } else {
      // Player failed to stop the enemy from fleeing! The enemy escapes with its remaining HP!
      triggerCombatFX(n.enemyDamage, 0, healed);
      const fledLine = `💨 **【${state.enemyKanji}】** *(${t("enemyHandLog")}: ${state.enemyHand.join(" ")})* ${j.enemyAction}\n   **${t("enemyEscapedLog")(state.enemyKanji, state.enemyHp, state.enemyMaxHp)}**`;
      logMd(`${youLine}\n${gmLine}\n${fledLine}`, verdictClass);
      maybeShowTrialNudge(j);

      state.woundedEnemies = state.woundedEnemies || {};
      state.woundedEnemies[state.enemyKanji] = state.enemyHp;
      state.enemyKanji = "";
      state.phase = "reward";
      updateBattleHUD(false);
      saveRunToStorage();
      // Enemy fled: no spoils, only scavenge up to 3 stage cards left behind!
      setTimeout(() => runEffects([{ scavenge: 3 }]), 400);
      return;
    }

    state.turn += 1;
    drawHand();
    dealEnemyHand();
    updateBattleHUD(true);
    saveRunToStorage();
    return;
  }

  const escapeFailNote = (j.escape === "failed" || flee)
    ? `\n🚫 **${t("escapeFailedLog")}**`
    : "";

  state.playerHp = Math.max(0, state.playerHp - n.playerDamage);
  state.dmgTakenThisEnemy += n.playerDamage;
  triggerCombatFX(n.enemyDamage, n.playerDamage, healed);

  const enemyUsedTxt = j.enemyUsed.length ? `${t("enemyIntentUsed")}: 【${j.enemyUsed.join("·")}】 → ` : "";
  const enemyLine = `👹 **【${state.enemyKanji}】** *(${t("enemyHandLog")}: ${state.enemyHand.join(" ")})* ${j.enemyAction}\n   ${enemyUsedTxt}**${t("dmgYou")(n.playerDamage)}**${DEFENSE_MARK[n.defense]}${escapeFailNote}`;
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
  if (state.enemyEscapeIntent) {
    logMd(`⚠️ **${t("enemyEscapeOmenLog")(state.enemyKanji, state.enemyHand.join(" · "))}**`, "hint-log");
  }
  updateBattleHUD(true);
  saveRunToStorage();
}

function onEnemyDefeated() {
  state.kills += 1;
  if (!state.defeatedEnemies.includes(state.enemyKanji)) state.defeatedEnemies.push(state.enemyKanji);
  if (!state.seenEnemies.includes(state.enemyKanji)) state.seenEnemies.push(state.enemyKanji);
  if (state.woundedEnemies) delete state.woundedEnemies[state.enemyKanji];

  achOnEnemyDefeated({
    kanji: state.enemyKanji,
    depthId: state.depthId,
    turn: state.turn,
    dmgTaken: state.dmgTakenThisEnemy,
    playerHp: state.playerHp,
    kills: state.kills
  });
  const rank = state.enemyRank;
  const isRunBoss = rank === "boss" || state.enemyKanji === state.runBoss;
  state.lastKill = { kanji: state.enemyKanji, turns: state.turn, dmgTaken: state.dmgTakenThisEnemy };

  if (isRunBoss) {
    state.phase = "reward";
    updateBattleHUD(false);
    setTimeout(runCleared, 650);
    return;
  }
  state.phase = "reward";
  state.offer = [];
  updateBattleHUD(false);
  saveRunToStorage();

  // Immediately show victory beat in the log and open the inline 5-card scavenge in the bottom dock!
  showVictoryBeat();
  runEffects([
    { scavenge: 5 },
    { offerSpoils: rank === "elite" ? "elite" : "normal" }
  ]);
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
