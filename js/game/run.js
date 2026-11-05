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

  const storyMode = activeGameMode === "story";
  const roster = depthRoster(depthId);
  const bossPool = roster.bossPool && roster.bossPool.length ? roster.bossPool : [roster.boss];

  if (storyMode) {
    const st = ensureStoryConfig();
    st.started = true;
    const dNum = depthNumber(depthId);
    if (dNum === 11) st.visitedDepth11 = true;
    if (dNum === 12) st.visitedDepth12 = true;

    if (!st.gaolBosses[depthId]) {
      st.gaolBosses[depthId] = bossPool[Math.floor(Math.random() * bossPool.length)];
    }
    const runBoss = st.gaolBosses[depthId];
    const keptDeck = Array.isArray(st.deck)
      ? st.deck.map(k => String(k).replace(/[^\u4e00-\u9faf\u3400-\u4dbf]/g, "")).filter(Boolean)
      : [];
    const defeatedEnemies = [...new Set([...(st.defeatedFoes || []), ...(st.defeatedBosses || [])])];
    const encounteredEnemies = [...new Set([...(st.encounteredFoes || []), ...defeatedEnemies])];
    const bossEncountered = Boolean(
      encounteredEnemies.includes(runBoss) || defeatedEnemies.includes(runBoss)
    );

    const catBonusHp = (st.catRescued ? 15 : 0) + (st.catBlessedNextRun ? 15 : 0);
    const senseiBonusHp = st.senseiBlessedNextRun ? 15 : 0;
    const godStacks = countSpecialItem("talisman_god");
    const startMaxHp = STARTING_MAX_HP + catBonusHp + senseiBonusHp;
    const startRerolls = 1 + godStacks + (st.catBlessedNextRun ? 1 : 0) + (st.senseiBlessedNextRun ? 1 : 0);
    const startFreeSummons = godStacks;
    const hadCatBless = Boolean(st.catBlessedNextRun);
    const hadSenseiBless = Boolean(st.senseiBlessedNextRun);
    st.catBlessedNextRun = false;
    st.senseiBlessedNextRun = false;
    persistStoryState();

    config.stats.runs = (config.stats.runs || 0) + 1;
    persistStats();

    state = createRunState();
    Object.assign(state, {
      gameMode: "story",
      active: true,
      depthId,
      runNo: config.stats.runs,
      maxHp: startMaxHp,
      playerHp: startMaxHp,
      rerollTokens: startRerolls,
      freeSummons: startFreeSummons,
      lifeTalismanUsedThisRun: false,
      phase: "path",
      step: 1,
      sign: "",
      fieldState: t("forkFieldState"),
      gaolBosses: { ...st.gaolBosses },
      runBoss,
      bossEncountered,
      hasClearedBoss: false,
      deck: keptDeck,
      encounteredEnemies,
      defeatedEnemies,
      woundedEnemies: {}
    });

    state.fork = generateFork(1);
    achOnRunStart(depthId);

    resetBattleChrome();
    logMd(`── 🏮 ${depthNumStr(depthId)} ${depthName(depthId)} · ${kankenLabel(depthId)} ──`, "sep-log");
    logMd(t("enteredMsg")(depthName(depthId), depthGloss(depthId)), "sys-log");
    if (godStacks > 0 || catBonusHp > 0 || hadCatBless || hadSenseiBless) {
      const buffs = [];
      if (catBonusHp + senseiBonusHp > 0) buffs.push(`❤️ 최대 HP +${catBonusHp + senseiBonusHp}`);
      if (godStacks > 0) buffs.push(`👁 심안의 부적 (무료 고신 +${godStacks} · 리롤 +${godStacks})`);
      if (hadCatBless) buffs.push(`🐾 고양이의 온기 (리롤 +1)`);
      if (hadSenseiBless) buffs.push(`🍵 스승의 약차 (리롤 +1)`);
      logMd(`✨ **특수 소지 및 마을 가호**: ${buffs.join(" · ")}`, "fx-log");
    }
    if (dNum === 11) {
      logMd(`🩸 **【금역 침범】** — 인간계의 평화를 뒤로하고 상용 외 금역(第11獄)의 봉인을 찢었습니다. 마을 사람들의 시선이 두려움으로 물듭니다…`, "hint-log");
    } else if (dNum === 12) {
      logMd(`💀 **【나락 강림】** — 인간의 이성이 닿지 않는 최심부 나락(第12獄)에 발을 들였습니다. 이제 돌이킬 수 없는 수라(修羅)의 길입니다.`, "hint-log");
    }
    logMd(`◆ 1/${PATH_STEPS} — ${t("pathPrompt")}`, "sys-log");
    saveRunToStorage();

    enterGaolCinematic(depthId, () => renderPhase());
    return;
  }

  const isContinuing = Boolean(
    state.active &&
    state.gameMode === "arcade" &&
    state.playerHp > 0 &&
    (state.phase === "returned" || state.phase === "cleared")
  );

  if (!isContinuing) {
    config.stats.runs = (config.stats.runs || 0) + 1;
    persistStats();
  }

  if (isContinuing) {
    const keptDeck = Array.isArray(state.deck)
      ? state.deck.map(k => String(k).replace(/[^\u4e00-\u9faf\u3400-\u4dbf]/g, "")).filter(Boolean)
      : [];
    const gaolBosses = { ...(state.gaolBosses || {}) };
    if (!gaolBosses[depthId]) {
      gaolBosses[depthId] = bossPool[Math.floor(Math.random() * bossPool.length)];
    }
    const runBoss = gaolBosses[depthId];
    const encounteredEnemies = Array.isArray(state.encounteredEnemies) ? [...state.encounteredEnemies] : [];
    const defeatedEnemies = Array.isArray(state.defeatedEnemies) ? [...state.defeatedEnemies] : [];
    const woundedEnemies = { ...(state.woundedEnemies || {}) };
    const bossEncountered = Boolean(
      encounteredEnemies.includes(runBoss) || defeatedEnemies.includes(runBoss)
    );

    Object.assign(state, {
      gameMode: "arcade",
      active: true,
      depthId,
      phase: "path",
      step: 1,
      sign: "",
      fork: [],
      revealNext: false,
      eventId: null,
      offer: [],
      pending: null,
      deck: keptDeck,
      stageCards: [],
      drawPile: [],
      discard: [],
      playerHand: [],
      playerHandSources: [],
      enemyHand: [],
      gaolBosses,
      runBoss,
      bossEncountered,
      hasClearedBoss: false,
      enemyKanji: "",
      enemyRank: "normal",
      enemyHp: 0,
      enemyMaxHp: 0,
      encounteredEnemies,
      defeatedEnemies,
      woundedEnemies,
      lastKill: null,
      turn: 1,
      dmgTakenThisEnemy: 0,
      fieldState: t("forkFieldState"),
      playerState: "",
      enemyState: ""
    });
  } else {
    const runBoss = bossPool[Math.floor(Math.random() * bossPool.length)];
    state = createRunState();
    Object.assign(state, {
      gameMode: "arcade",
      active: true,
      depthId,
      runNo: config.stats.runs,
      maxHp: STARTING_MAX_HP,
      playerHp: STARTING_MAX_HP,
      phase: "path",
      step: 1,
      sign: "",
      fieldState: t("forkFieldState"),
      gaolBosses: { [depthId]: runBoss },
      runBoss,
      bossEncountered: false,
      hasClearedBoss: false,
      deck: []
    });
  }

  state.fork = generateFork(1);
  achOnRunStart(depthId);

  resetBattleChrome();
  logMd(`── ${depthNumStr(depthId)} ${depthName(depthId)} · ${kankenLabel(depthId)} ──`, "sep-log");
  logMd(t("enteredMsg")(depthName(depthId), depthGloss(depthId)), "sys-log");
  logMd(`◆ 1/${PATH_STEPS} — ${t("pathPrompt")}`, "sys-log");
  saveRunToStorage();

  enterGaolCinematic(depthId, () => renderPhase());
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
  const over = ["cleared", "dead", "abandoned", "returned"].includes(state.phase);
  view.classList.toggle("intermission", !over && state.phase !== "battle");
  view.classList.toggle("run-over", over);
  if (state.phase !== "reward" && state.phase !== "cleared") $("b-boss-card").classList.remove("defeated");
  $("b-boss-card").classList.remove("player-dead", "completed");
  if (state.phase !== "abandoned") $("b-boss-card").classList.remove("abandoned");
  if (state.phase !== "returned") $("b-boss-card").classList.remove("returned");
  updateBattleHUD(false);
  if (!state.pending) closePicker();

  if (state.depthId === "depth_0" && typeof renderVillagePhase === "function") {
    renderVillagePhase();
    return;
  }

  switch (state.phase) {
    case "draft":
      state.phase = "path";
      if (!state.fork || !state.fork.length) state.fork = generateFork(Math.max(1, state.step));
      renderFork();
      break;
    case "path": renderFork(); break;
    case "battle_encounter_omen": {
      const pe = state.pendingEncounter;
      if (pe && pe.kanji) {
        setDockActions([
          {
            label: "⚔ 무기를 쥐고 기척을 마주한다",
            gold: true,
            onClick: () => triggerEnemyCinematicReveal(pe.kanji, pe.rank || "normal")
          }
        ]);
      } else {
        state.phase = "path";
        renderFork();
      }
      break;
    }
    case "battle": setDockActions([]); break;
    case "reward": state.pending ? openPendingPick() : renderRewardOffer(); break;
    case "event": state.pending ? openPendingPick() : renderEventOptions(); break;
    case "cleared": endRunDock(state.depthId, { cleared: true }); break;
    case "returned":
      setDockActions([
        { label: t("selectNextGaolBtn"), onClick: () => transitionToView("select"), gold: true },
        { label: t("titleBtn"), onClick: () => transitionToView("title") }
      ]);
      break;
    default: break;
  }
}

/* Pick a fitting stage sign for the Boss sanctum so state.sign is always a true stage kanji, never the Boss kanji itself. */
function pickBossStageSign(depthId, bossKanji) {
  const pool = (DEPTH_STAGE_POOLS[depthId] || ["山"]).filter(s => STAGE_SIGNS[s] && s !== bossKanji);
  const withBoss = pool.filter(s => (STAGE_SIGNS[s].foes || []).includes(bossKanji));
  if (withBoss.length) return withBoss[Math.floor(Math.random() * withBoss.length)];
  const risky = pool.filter(s => STAGE_SIGNS[s].risky);
  if (risky.length) return risky[Math.floor(Math.random() * risky.length)];
  return pool[0] || "山";
}

/* ---- Path ---- */

function enterNode(node) {
  state.sign = node.sign;
  state.fork = [];
  state.stageCards = buildStageCards(state.depthId, state.sign);
  const signDef = STAGE_SIGNS[state.sign];
  state.fieldState = signDef ? pickLang(signDef.omen) : "";
  const o = node.outcome;
  if (o === "battle") return startBattle("normal");
  if (o === "elite") return startBattle("elite");
  if (o === "boss") return startBattle("boss");
  if (o === "treasure") {
    state.enemyKanji = "";
    state.phase = "reward";
    logBeat("event-log", `🎁 【${node.sign}】 ${t("treasureStageTitle")}`, [t("treasureStageDesc")(node.sign)]);
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
    const bossStageSign = pickBossStageSign(state.depthId, boss);
    state.fork = [{ sign: bossStageSign, boss, outcome: "boss", revealed: true }];
    logMd(t("bossPrompt")(boss), "sys-log");
  } else {
    state.fork = generateFork(nextStep);
    if (state.revealNext) {
      state.fork.forEach(f => { f.revealed = true; });
      state.revealNext = false;
    }
    logMd(`◆ ${nextStep}/${PATH_STEPS} — ${t("pathPrompt")}`, "sys-log");
  }
  state.phase = "path";
  saveRunToStorage();
  renderPhase();
}

/* Pick 3 distinct stage signs from the current depth's stage pool.
 * When enemies in a stage (or across the Gaol) have already been slain during this expedition,
 * outcomes shift naturally toward events and peaceful stage exploration! */
function generateFork(step) {
  const depthPoolSigns = DEPTH_STAGE_POOLS[state.depthId] || Object.keys(STAGE_SIGNS);
  let signs = depthPoolSigns.filter(s => STAGE_SIGNS[s]);
  if (step > 1 && state.sign && signs.length > FORK_WIDTH) {
    signs = signs.filter(s => s !== state.sign);
  }
  if (step === 1) {
    const gentle = signs.filter(s => !STAGE_SIGNS[s].risky && s !== "寺" && s !== "謎");
    if (gentle.length >= FORK_WIDTH) signs = gentle;
  }
  let picks = sample(signs, FORK_WIDTH);
  if (step === PATH_STEPS - 1 && !picks.includes("寺") && !picks.includes("堂") && !picks.includes("祠")) {
    picks[picks.length - 1] = STAGE_SIGNS["寺"] ? "寺" : picks[picks.length - 1];
  }

  const roster = depthRoster(state.depthId);
  const allDepthMobs = [...new Set([...roster.normal, ...roster.elite])];
  const defeated = state.defeatedEnemies || [];
  const aliveDepthMobs = allDepthMobs.filter(k => !defeated.includes(k));

  return picks.map((sign, idx) => {
    const def = STAGE_SIGNS[sign] || STAGE_SIGNS.田;
    const stageMobs = (def.foes || []).filter(k => allDepthMobs.includes(k));
    const aliveStageMobs = stageMobs.filter(k => !defeated.includes(k));
    const stageCleared = aliveDepthMobs.length === 0 || (stageMobs.length > 0 && aliveStageMobs.length === 0);
    const stageAliveRatio = stageMobs.length > 0 ? (aliveStageMobs.length / stageMobs.length) : 1;

    let outcome = weightedPick(def.outcomes);

    if (stageCleared) {
      // All enemies in this stage (or Gaol) were already slain in this expedition: spawn events / caches!
      if (outcome === "battle" || outcome === "elite") {
        outcome = Math.random() < 0.78 ? "event:*" : "treasure";
      }
    } else if ((outcome === "battle" || outcome === "elite") && stageAliveRatio < 1) {
      // Partially cleared stage: proportionally higher chance for an event instead of a fight
      if (Math.random() > stageAliveRatio) {
        outcome = "event:*";
      }
    } else if (step === 1 && idx < 2 && outcome.startsWith("event:")) {
      outcome = "battle";
    }

    if (outcome === "event:*") {
      if (isStoryMode() && config.story && !config.story.catRescued && step >= 2 && Math.random() < 0.38) {
        outcome = "event:cat_rescue";
      } else {
        outcome = `event:${RANDOM_EVENT_POOL[Math.floor(Math.random() * RANDOM_EVENT_POOL.length)]}`;
      }
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
    const boss = state.fork[0].boss || state.runBoss || depthRoster(state.depthId).boss;
    const bossKnown = Boolean(
      state.bossEncountered ||
      (state.encounteredEnemies || []).includes(boss) ||
      (state.defeatedEnemies || []).includes(boss)
    );
    const labelKanji = bossKnown ? boss : "？";
    setDockActions([
      { label: t("bossBtn")(labelKanji), onClick: () => choosePath(0), gold: true, cls: "boss-door" },
      { label: t("returnGaolBtn"), onClick: () => triggerFormalReturn(), cls: "fork-return-btn" }
    ]);
    return;
  }
  const tiles = state.fork.map((f, i) => {
    const def = STAGE_SIGNS[f.sign] || STAGE_SIGNS.田;
    const maxD = depthNumber(state.depthId);
    const allFoesInDepth = typeof allRosterKanji === "function" ? allRosterKanji(state.depthId) : [];
    const validCards = (def.cards || []).filter(k => k !== f.sign && !allFoesInDepth.includes(k) && getKanjiDepthNum(k) <= maxD);
    const previewCards = validCards.slice(0, 4).join(" ");
    return {
      html: `<span class="fork-kanji tier-${getKanjiTier(f.sign)}">${escapeHtml(f.sign)}</span>` +
        `<span class="fork-omen">${escapeHtml(pickLang(def.omen))}</span>` +
        `<span class="fork-cards-hint">${escapeHtml(previewCards)}…</span>` +
        (f.revealed ? `<span class="fork-reveal">${outcomeIcon(f.outcome)}</span>` : ""),
      onClick: () => choosePath(i),
      cls: "fork-tile"
    };
  });
  tiles.push({
    label: t("returnGaolBtn"),
    onClick: () => triggerFormalReturn(),
    cls: "fork-return-btn"
  });
  setDockActions(tiles);
}

function choosePath(i) {
  if (typeof playFootstepSfx === "function") playFootstepSfx();
  else playClickSfx();
  const node = state.fork[i];
  if (!node) return;
  const def = STAGE_SIGNS[node.sign];
  const omenTxt = def ? ` — *${pickLang(def.omen)}*` : "";
  logMd(`→ 【${node.sign}】${omenTxt}`, "choice-log");
  enterNode(node);
}

/* ---- Fights ---- */

function pickEnemyForStage(rank, forcedKanji = null) {
  const defeated = state.defeatedEnemies || [];
  if (forcedKanji) {
    if (defeated.includes(forcedKanji)) return null;
    return { kanji: forcedKanji, rank };
  }
  const roster = depthRoster(state.depthId);
  const runBoss = state.runBoss || roster.boss;

  if (rank === "boss") {
    if (defeated.includes(runBoss)) return null;
    return { kanji: runBoss, rank: "boss" };
  }

  const stageDef = STAGE_SIGNS[state.sign] || {};
  const stageFoes = stageDef.foes || [];

  // Mid-to-late run: chance to stumble upon the run's Boss early if it haunts this stage (or risky stage)!
  if (state.step >= 4 && !defeated.includes(runBoss)) {
    const bossHauntsStage = stageFoes.includes(runBoss);
    const ambushChance = bossHauntsStage ? 0.45 : (stageDef.risky && state.step >= 5 ? 0.2 : 0);
    if (Math.random() < ambushChance) {
      return { kanji: runBoss, rank: "boss" };
    }
  }

  const allPool = [...new Set([...roster.normal, ...roster.elite])];
  const alivePool = allPool.filter(k => !defeated.includes(k));

  // If every single normal/elite foe in this depth has been slain, the stage is empty!
  if (!alivePool.length) return null;

  // Prefer foes that match this stage's theme and are still alive
  const stageMatches = stageFoes.filter(k => alivePool.includes(k));
  if (!stageMatches.length) {
    // All native foes of this stage were already slain during this expedition!
    // Most of the time, the stage is now peaceful / event-driven rather than pulling unrelated stragglers.
    if (Math.random() < 0.75) return null;
  }
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
  state.enemyKanji = "";
  state.phase = "reward";
  state.stageCards = buildStageCards(state.depthId, state.sign);
  logBeat("event-log", `🍃 【${state.sign}】 ${t("emptyStageTitle")}`, [
    t("emptyStageDesc")(state.sign),
    `🎴 ${t("stageCardsLog")}: ${state.stageCards.join(" · ")}`
  ]);
  runEffects([{ hp: 12 }, { scavenge: 5 }]);
}

function enterConqueredBossSanctum() {
  state.enemyKanji = state.runBoss || depthRoster(state.depthId).boss;
  state.phase = "reward";
  state.stageCards = buildStageCards(state.depthId, state.sign);
  logBeat("event-log", `🍃 【${state.sign}】 ${t("emptyStageTitle")}`, [
    t("emptyStageDesc")(state.sign),
    `🎴 ${t("stageCardsLog")}: ${state.stageCards.join(" · ")}`
  ]);
  logBossClearImmediate();
  runEffects([{ hp: 15 }, { scavenge: 5 }, { bossClear: true }]);
}

function startBattle(rank, forcedKanji = null, { ambush = false } = {}) {
  const picked = pickEnemyForStage(rank, forcedKanji);
  if (!picked) {
    if (rank === "boss") return enterConqueredBossSanctum();
    if (Math.random() < 0.55) return startEvent("*");
    return enterPeacefulClearedStage();
  }

  const { kanji, rank: actualRank } = picked;

  // Staged multi-step encounter buildup:
  // Step 1: "무언가 다가오는 소리가 들린다..." -> button to face the threat
  // Step 2: Full-screen shadow flash of the enemy kanji
  // Step 3: Formal battle HUD & portrait reveal
  if (!ambush && state.phase !== "battle_encounter_ready") {
    state.phase = "battle_encounter_omen";
    state.pendingEncounter = { rank: actualRank, kanji, picked };
    state.enemyKanji = "";
    updateBattleHUD(false);

    playGongSfx();
    const omenLines = actualRank === "boss"
      ? [
          "대지가 갈라지는 듯한 육중한 진동과 함께, 숨통을 틀어쥐는 거대한 살기가 안개 너머에서 밀려온다…",
          "주변의 모든 글자(漢字)들이 공포에 질려 바르르 떨며 핏빛으로 물들기 시작한다.",
          "*이 옥문을 지배하는 주인이 모습을 드러내려 합니다. 무기를 고쳐 쥐고 진명을 마주하세요.*"
        ]
      : actualRank === "elite"
      ? [
          "칠흑 같은 어둠 저편에서 바닥을 긁는 날카로운 소리와 함께 짙은 피비린내가 코끝을 찌른다…",
          "심상치 않은 흉기(凶氣)를 품은 정예 원령의 그림자가 안개를 가르며 성큼성큼 다가온다.",
          "*숨을 가다듬고 다가오는 적의 진명을 마주해야 합니다.*"
        ]
      : [
          "자욱한 안개 너머에서… 으스스하게 삐걱거리며 무언가 기어 다가오는 소리가 들린다…",
          "산 자의 온기와 피 냄새를 맡은 원령의 일그러진 획(画)이 어둠 속에서 번뜩인다.",
          "*물러설 곳은 없습니다. 무기를 쥐고 기척의 정체를 마주하세요.*"
        ];
    logBeat("foe-omen-log", "🩸 【 살기의 전조 (前兆) 】", omenLines);

    setDockActions([
      {
        label: "⚔ 무기를 쥐고 기척을 마주한다",
        gold: true,
        onClick: () => triggerEnemyCinematicReveal(kanji, actualRank)
      }
    ]);
    saveRunToStorage();
    return;
  }
  if (!state.encounteredEnemies.includes(kanji)) state.encounteredEnemies.push(kanji);
  if (actualRank === "boss" || kanji === state.runBoss) state.bossEncountered = true;
  recordFoeEncountered(kanji);

  const maxHp = ENEMY_HP[actualRank];
  const prevWoundedHp = state.woundedEnemies && state.woundedEnemies[kanji];
  // If we fled from this foe (or it fled from us) earlier in the run, it keeps its wounded HP (+10% breath recovery)
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
    enemyEscapeIntent: false,
    enemyEscapeTried: false,
    enemyIntentsSeen: [],
    lastComboKanji: null,
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
  const encounterLine = typeof getEnemyEncounterLine === "function"
    ? getEnemyEncounterLine(kanji, actualRank, Boolean(prevWoundedHp), Boolean(ambush))
    : "";
  const rankTail = actualRank === "boss"
    ? " 옥문을 지배하는 압도적인 원념이 사방의 퇴로를 완전히 틀어막고 당신의 숨통을 겨눈다!"
    : actualRank === "elite"
    ? " 범상치 않은 흉기를 두른 강적이 살기를 뿜어내며 단숨에 거리를 좁혀 온다!"
    : " 어둠 속에서 굶주린 원령이 핏빛 획을 번뜩이며 당신의 빈틈을 노린다!";
  if (prevWoundedHp) {
    logMd(
      `🩸 ${t("reEncounterChallenger")(`${mark}${kanji}`, startHp, maxHp)}` + (encounterLine ? ` — ${encounterLine}` : "") + rankTail,
      "foe-log"
    );
  } else {
    logMd(
      `🩸 ${t("nextChallenger")(`${mark}${kanji}`)}` + (encounterLine ? ` — ${encounterLine}` : "") + rankTail,
      "foe-log"
    );
  }
  logMd(`🎴 **${t("stageCardsLog")}(【${state.sign}】)**: ${state.stageCards.join(" · ")}`, "fx-log");

  saveRunToStorage();
  renderPhase();
  updateBattleHUD(true);
  const boss = $("b-boss-card");
  boss.classList.remove("enter", "ambush-reveal");
  void boss.offsetWidth;
  if (ambush) {
    boss.classList.add("ambush-reveal");
    if (typeof playSealStampSfx === "function") playSealStampSfx();
    if (typeof playDamageSfx === "function") setTimeout(() => playDamageSfx(), 120);
    const vig = $("damage-vignette");
    if (vig) {
      vig.classList.add("flash");
      setTimeout(() => vig.classList.remove("flash"), 360);
    }
  } else {
    boss.classList.add("enter");
    if (actualRank === "boss") playGongSfx();
  }
  if (!isCoarsePointer()) $("b-input").focus();
}

/* ---- Leaving / resuming ---- */

function resumeSavedRun() {
  activeGameMode = state.gameMode || activeGameMode || "arcade";
  if (Array.isArray(state.deck)) {
    state.deck = state.deck
      .map(k => String(k).replace(/[^\u4e00-\u9faf\u3400-\u4dbf]/g, ""))
      .filter(Boolean);
  }
  if (Array.isArray(state.playerHand)) {
    state.playerHand = state.playerHand
      .map(k => String(k).replace(/[^\u4e00-\u9faf\u3400-\u4dbf]/g, "") || "火");
  }
  if (state.phase === "returned") {
    transitionToView("select", "漢字地獄", "");
    return;
  }
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
  if (state.depthId === "depth_0" && typeof leaveVillageToSelect === "function") {
    leaveVillageToSelect();
    return;
  }
  if (state.hasClearedBoss || state.phase === "cleared") {
    finishExpeditionFromClear();
    return;
  }
  openConfirmModal(t("abandonModalTitle"), t("abandonModalDesc"), () => showRunEnd(true));
}

function triggerEnemyCinematicReveal(kanji, actualRank) {
  playSealStampSfx();
  if (typeof playDamageSfx === "function") setTimeout(() => playDamageSfx(), 160);
  const curtain = $("cinematic-curtain");
  const prevWounded = Boolean(state.woundedEnemies && state.woundedEnemies[kanji]);
  const encounterLine = typeof getEnemyEncounterLine === "function"
    ? getEnemyEncounterLine(kanji, actualRank, prevWounded, false)
    : "";
  if (curtain) {
    if ($("curtain-badge")) {
      $("curtain-badge").textContent = actualRank === "boss"
        ? "【 獄 門 之 主 顕 現 】"
        : actualRank === "elite"
        ? "【 強 敵 顕 現 】"
        : "【 敵 影 顕 現 】";
    }
    $("curtain-title").textContent = kanji;
    $("curtain-sub").textContent = encounterLine || "칠흑 같은 어둠을 찢고 핏빛 원령이 모습을 드러낸다…";
    if ($("curtain-stages")) $("curtain-stages").textContent = "";
    curtain.className = "active foe-reveal";
    setTimeout(() => {
      curtain.classList.remove("active");
    }, 1750);
  }

  setTimeout(() => {
    state.phase = "battle_encounter_ready";
    startBattle(actualRank, kanji);
  }, 1150);
}
