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
      elapsedSec: (st.sectorTime && st.sectorTime[depthId]) || 0,   // the sector's clock continues across visits
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
      if (catBonusHp + senseiBonusHp > 0) buffs.push(`최대 HP +${catBonusHp + senseiBonusHp}`);
      if (godStacks > 0) buffs.push(`심안의 부적 · 고신 +${godStacks} · 리롤 +${godStacks}`);
      if (hadCatBless) buffs.push(`고양이의 온기 · 리롤 +1`);
      if (hadSenseiBless) buffs.push(`스승의 약차 · 리롤 +1`);
      logMd(`✨ **마을 가호**: ${buffs.join(" · ")}`, "fx-log");
    }
    const gaolEntryWhispers = {
      1: {
        EN: "🕯 *At the threshold of the First Gate, stolen elementary words of fire, water, and wild beasts prowl the ash.*",
        KO: "🕯 *첫 번째 옥문 어귀—마을 이정표에서 뜯겨 나간 물과 불, 들개와 구미호의 원초적인 획들이 안개 속을 배회합니다.*",
        JA: "🕯 *第一の獄門の入り口——里の道標から剥がれ落ちた水や火、野犬や九尾狐の原初の画が霧の中を徘徊している。*"
      },
      2: {
        EN: "🕯 *Cold gusts sweep the Second Gaol; the stolen seasons and directions swirl like lost leaves.*",
        KO: "🕯 *두 번째 옥문인 황야—계절과 방위를 잃어버린 바람이 메마른 들판을 할퀴며 지나갑니다.*",
        JA: "🕯 *第二獄・荒野——季節と方角を失った風が乾いた野を掻き毟るように吹き抜ける。*"
      },
      3: {
        EN: "🕯 *Bitter medicinal fumes hang in the Third Gaol's Silent Ward, where feverish whispers echo.*",
        KO: "🕯 *세 번째 옥문인 적막의 병동—쓴 약초 냄새와 멈추지 않는 기침 소리가 축축한 복도에 고여 있습니다.*",
        JA: "🕯 *第三獄・静寂の病棟——苦い薬草の匂いと止まらぬ咳の音が湿った回廊に澱んでいる。*"
      },
      4: {
        EN: "🕯 *Across the Fourth Gaol, the swallowed provinces of Ibaraki, Ehime, Tochigi, and Osaka echo with marching ghosts.*",
        KO: "🕯 *네 번째 옥문—이바라키, 에히메, 도치기, 오사카 등 안개에 삼켜진 옛 고을의 가도 위로 패잔병들의 발소리가 울립니다.*",
        JA: "🕯 *第四獄——いばらき、えひめ、とちぎ、おおさか……霧に呑まれた古き州の街道に敗残兵の足音が響く。*"
      },
      5: {
        EN: "🕯 *Mirrors and shifting corridors fill the Fifth Gaol, reflecting the faces of those who lost their names.*",
        KO: "🕯 *다섯 번째 옥문인 미망각—이름을 잃은 망자들의 얼굴이 깨진 거울과 환각의 회랑마다 어른거립니다.*",
        JA: "🕯 *第五獄・迷妄閣——名を失った亡者たちの顔が砕けた鏡と幻覚の回廊に揺らめいている。*"
      },
      6: {
        EN: "🕯 *White bone ramparts tower in the Sixth Gaol—the final boundary of everyday mortal script.*",
        KO: "🕯 *여섯 번째 옥문인 백골성—산 자가 평소에 배우는 교육한자의 마지막 성벽이 창백한 뼈를 드러냅니다.*",
        JA: "🕯 *第六獄・白骨城——生者が日頃学ぶ教育漢字の最後の城壁が蒼白な骨を晒している。*"
      },
      7: {
        EN: "🕯 *Beyond the Seventh Gate, two characters fuse into compound fiends; the air reeks of iron and blood.*",
        KO: "🕯 *일곱 번째 옥문인 귀살의 사지—낱글자들이 두 글자씩 엉겨 붙어 흉물로 변이하는 상용한자의 사지입니다.*",
        JA: "🕯 *第七獄・鬼殺の死地——一字一字が二字に絡み合い凶物へと変異する常用漢字の死地だ。*"
      },
      8: {
        EN: "🕯 *Sparks of crimson karma rain down inside the Eighth Gaol's scorching furnace.*",
        KO: "🕯 *여덟 번째 옥문인 업화의 화로—살과 쇠를 녹이는 화염 속에서 죄업의 글자들이 시뻘겋게 달아오릅니다.*",
        JA: "🕯 *第八獄・業火の炉——肉と鉄を溶かす炎の中で罪業の文字が赤熱している。*"
      },
      9: {
        EN: "🕯 *Thunder shakes the Ninth Gaol's abyssal ridge as ancient dragon-veins uncoil.*",
        KO: "🕯 *아홉 번째 옥문인 용연—천둥 치는 절벽 아래로 묵직한 용맥의 글자들이 꿈틀거립니다.*",
        JA: "🕯 *第九獄・龍淵——雷鳴轟く断崖の下で重厚な龍脈の文字がうねっている。*"
      },
      10: {
        EN: "🕯 *The Tenth Gate—the bottom of the mortal Underworld. Slay its master to return dawn to Lantern Village.*",
        KO: "🕯 *열 번째 옥문인 황천의 밑바닥—이곳의 주인을 베면 마침내 등불의 마을에 사람의 말과 여명이 돌아옵니다.*",
        JA: "🕯 *第十獄・黄泉の底——ここの主を討てば、ついに灯の里へ人の言葉と黎明が還る。*"
      },
      11: {
        EN: "🩸 **【Seal Broken — Eleventh Gaol】** — Turning your back on human peace, you have torn open the Beast-King's Sanctum…",
        KO: "🩸 **【금역 침범】** — 인간계의 평화를 뒤로하고 상용 외 금역(第11獄)의 봉인을 찢었습니다. 세 글자까지 뒤엉킨 규격 외의 괴물들이 눈을 뜹니다…",
        JA: "🩸 **【禁域侵犯】** — 人の世の平穏を背に、常用外禁域（第十一獄）の封印を破った。三字まで絡み合う規格外の化け物どもが目を覚ます……"
      },
      12: {
        EN: "💀 **【Descent into Naraka — Twelfth Gaol】** — Four-character abominations writhe in the deepest abyss beyond sanity.",
        KO: "💀 **【나락 강림】** — 인간의 이성이 닿지 않는 최심부 나락(第12獄)에 발을 들였습니다. 네 글자 사자성어로 뭉친 태고의 재앙들이 수라(修羅)를 맞이합니다.",
        JA: "💀 **【奈落降臨】** — 人の理性が届かぬ最深部・奈落（第十二獄）へ足を踏み入れた。四字熟語と化した太古の災厄が修羅を迎え撃つ。"
      }
    };
    if (gaolEntryWhispers[dNum]) {
      logMd(pickLang(gaolEntryWhispers[dNum]), "hint-log");
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
    case "battle_encounter_omen":
    case "battle_encounter_ready": {
      let pe = state.pendingEncounter;
      if (!pe || !pe.kanji) {
        const fallbackRank = state.step >= PATH_STEPS ? "boss" : "normal";
        const picked = pickEnemyForStage(fallbackRank);
        if (picked && picked.kanji) {
          pe = { rank: picked.rank || fallbackRank, kanji: picked.kanji, picked };
          state.pendingEncounter = pe;
        }
      }
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
        if (!state.fork || !state.fork.length) state.fork = generateFork(Math.max(1, state.step));
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
    const def = STAGE_SIGNS[bossStageSign];
    const omenTxt = def ? ` — *${pickLang(def.omen)}*` : "";
    logMd(`→ 【${bossStageSign}】${omenTxt}`, "choice-log");
    enterNode({ sign: bossStageSign, boss, outcome: "boss", revealed: true });
    return;
  }
  state.fork = generateFork(nextStep);
  if (state.revealNext) {
    state.fork.forEach(f => { f.revealed = true; });
    state.revealNext = false;
  }
  logMd(`◆ ${nextStep}/${PATH_STEPS} — ${t("pathPrompt")}`, "sys-log");
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
  if (step === PATH_STEPS - 1 && signs.includes("寺") && !picks.includes("寺") && !picks.includes("堂") && !picks.includes("祠")) {
    picks[picks.length - 1] = "寺";
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

function sanitizeDepthStageSigns() {
  if (!state.depthId || state.depthId === "depth_0") return;
  const validPool = (DEPTH_STAGE_POOLS[state.depthId] || []).filter(s => STAGE_SIGNS[s]);
  if (!validPool.length) return;
  if (state.sign && (!STAGE_SIGNS[state.sign] || (state.depthId === "depth_4" && !validPool.includes(state.sign)))) {
    state.sign = validPool[0];
    const signDef = STAGE_SIGNS[state.sign];
    state.fieldState = signDef ? pickLang(signDef.omen) : "";
  }
  if (Array.isArray(state.fork) && state.fork.length) {
    const used = new Set();
    state.fork.forEach((f) => {
      if (!f || !STAGE_SIGNS[f.sign] || (state.depthId === "depth_4" && !validPool.includes(f.sign))) {
        const replacement = validPool.find(s => !used.has(s)) || validPool[0];
        f.sign = replacement;
      }
      used.add(f.sign);
    });
  }
}

function renderFork() {
  sanitizeDepthStageSigns();
  if (state.fork.length === 1 && state.fork[0].outcome === "boss") {
    enterNode(state.fork[0]);
    return;
  }
  const tiles = state.fork.map((f, i) => {
    const def = STAGE_SIGNS[f.sign] || STAGE_SIGNS.田;
    return {
      html: `<span class="fork-kanji tier-${getKanjiTier(f.sign)}${[...f.sign].length > 1 ? " multi" : ""}">${escapeHtml(f.sign)}</span>` +
        `<span class="fork-omen">${escapeHtml(pickLang(def.omen))}</span>` +
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
    t("emptyStageDesc")(state.sign)
  ]);
  runEffects([{ hp: 12 }, { scavenge: 5 }]);
}

function enterConqueredBossSanctum() {
  state.enemyKanji = state.runBoss || depthRoster(state.depthId).boss;
  state.phase = "reward";
  state.stageCards = buildStageCards(state.depthId, state.sign);
  logBeat("event-log", `🍃 【${state.sign}】 ${t("emptyStageTitle")}`, [
    t("emptyStageDesc")(state.sign)
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

  if (!ambush && state.phase !== "battle_encounter_ready") {
    state.phase = "battle_encounter_omen";
    state.pendingEncounter = { rank: actualRank, kanji, picked };
    state.enemyKanji = "";

    playGongSfx();
    const omenLines = actualRank === "boss"
      ? [
          "대지가 울리며 숨 막히는 살기가 안개 너머에서 밀려온다.",
          "*이 옥문의 주인이 모습을 드러내려 합니다.*"
        ]
      : actualRank === "elite"
      ? [
          "칠흑 같은 어둠 너머에서 짙은 피비린내가 스며든다.",
          "*심상치 않은 정예 원령이 다가옵니다.*"
        ]
      : [
          "자욱한 안개 너머에서 기괴한 기척이 다가온다.",
          "*무기를 쥐고 원령의 정체를 마주하세요.*"
        ];
    logBeat("foe-omen-log", "🩸 【 살기의 전조 】", omenLines);

    renderPhase();
    saveRunToStorage();
    return;
  }

  if (!state.encounteredEnemies.includes(kanji)) state.encounteredEnemies.push(kanji);
  if (actualRank === "boss" || kanji === state.runBoss) state.bossEncountered = true;
  recordFoeEncountered(kanji);

  const maxHp = ENEMY_HP[actualRank];
  const prevWoundedHp = state.woundedEnemies && state.woundedEnemies[kanji];
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
  for (let i = 0; i < 2; i++) playCardDealSfx(i * 90);

  resetBattleChrome();
  const shortName = typeof getEnemyShortName === "function" ? getEnemyShortName(kanji) : "";
  const nameTag = shortName ? ` ${shortName}` : "";
  const encounterLine = typeof getEnemyEncounterLine === "function"
    ? getEnemyEncounterLine(kanji, actualRank, Boolean(prevWoundedHp), Boolean(ambush))
    : "";
  const fallbackTail = actualRank === "boss"
    ? "옥문을 지배하는 거대한 원념이 퇴로를 막아선다!"
    : actualRank === "elite"
    ? "범상치 않은 살기를 두른 강적이 거리를 좁혀 온다!"
    : "어둠 속에서 굶주린 원령이 핏빛 획을 번뜩인다!";
  const descLine = encounterLine || fallbackTail;
  if (prevWoundedHp) {
    logMd(
      `🩸 ${t("reEncounterChallenger")(kanji, startHp, maxHp)}${nameTag} — ${descLine}`,
      "foe-log"
    );
  } else {
    logMd(
      `🩸 ${t("nextChallenger")(kanji)}${nameTag} — ${descLine}`,
      "foe-log"
    );
  }

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
  if (typeof setActiveGameMode === "function") {
    setActiveGameMode(state.gameMode || activeGameMode || "arcade");
  } else {
    activeGameMode = state.gameMode || activeGameMode || "arcade";
  }
  if (state.enemyKanji === "九尾狐") {
    state.enemyKanji = state.depthId === "depth_11" ? "狐" : "九";
  } else if (state.enemyKanji === "血傑") {
    state.enemyKanji = "傑";
  } else if (state.enemyKanji === "怨鬼") {
    state.enemyKanji = "怨";
  }
  sanitizeDepthStageSigns();
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
  if (kanji === "九尾狐") {
    kanji = state.depthId === "depth_11" ? "狐" : "九";
  } else if (kanji === "血傑") {
    kanji = "傑";
  } else if (kanji === "怨鬼") {
    kanji = "怨";
  }
  playSealStampSfx();
  if (typeof playDamageSfx === "function") setTimeout(() => playDamageSfx(), 160);
  const curtain = $("cinematic-curtain");
  if (curtain) {
    if ($("curtain-badge")) {
      const badgeMap = actualRank === "boss"
        ? { EN: "MASTER ENCOUNTER", KO: "주인 조우", JA: "主 遭 遇", ZH_CN: "主 遭 遇", ZH_TW: "主 遭 遇" }
        : actualRank === "elite"
        ? { EN: "ELITE ENCOUNTER", KO: "강적 조우", JA: "強 敵 遭 遇", ZH_CN: "强 敌 遭 遇", ZH_TW: "強 敵 遭 遇" }
        : { EN: "ENCOUNTER", KO: "적 조우", JA: "敵 遭 遇", ZH_CN: "敌 遭 遇", ZH_TW: "敵 遭 遇" };
      $("curtain-badge").textContent = pickLang(badgeMap);
    }
    const titleEl = $("curtain-title");
    if (titleEl) {
      titleEl.textContent = kanji;
      titleEl.dataset.len = String(Array.from(String(kanji || "")).length);
    }
    const shortName = typeof getEnemyShortName === "function" ? getEnemyShortName(kanji) : "";
    $("curtain-sub").textContent = shortName;
    if ($("curtain-stages")) $("curtain-stages").textContent = "";
    curtain.className = `active foe-reveal rank-${actualRank || "normal"}`;
    const schedule = typeof registerCinematicTimer === "function" ? registerCinematicTimer : setTimeout;
    schedule(() => {
      curtain.classList.remove("active");
    }, 1650);
  }

  const scheduleReveal = typeof registerCinematicTimer === "function" ? registerCinematicTimer : setTimeout;
  scheduleReveal(() => {
    state.phase = "battle_encounter_ready";
    startBattle(actualRank, kanji);
  }, 1050);
}
