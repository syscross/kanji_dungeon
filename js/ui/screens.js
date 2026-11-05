/* Title screen, guide modal, depth select (Story Mode + Arcade Mode), and gate briefing modal. */

/* Title */
function updateSavedRunBanner() {
  const storyBanner = $("saved-story-banner");
  const arcadeBanner = $("saved-run-banner");
  const storyPlayBtn = $("story-play-btn");
  const storyExitBtn = $("story-exit-btn");
  const arcadePlayBtn = $("play-btn");
  const arcadeExitBtn = $("title-exit-btn");

  const storyRun = (
    state.active &&
    state.gameMode === "story" &&
    state.depthId !== "depth_0" &&
    !["returned", "cleared", "dead", "abandoned"].includes(state.phase)
  )
    ? state
    : getSavedStoryRun();
  const arcadeRun = (state.active && state.gameMode === "arcade" && state.playerHp > 0)
    ? state
    : getSavedArcadeRun();

  if (storyRun) {
    if (storyBanner) {
      storyBanner.textContent = `🏮 ${t("storyOngoingBadge")(depthName(storyRun.depthId), Math.max(1, storyRun.step), PATH_STEPS, storyRun.playerHp, storyRun.maxHp)}`;
      storyBanner.classList.add("show");
    }
    if (storyPlayBtn) storyPlayBtn.textContent = t("resumeStoryGame");
    if (storyExitBtn) storyExitBtn.style.display = "";
  } else {
    if (storyBanner) storyBanner.classList.remove("show");
    if (storyPlayBtn) storyPlayBtn.textContent = t("playStoryGame");
    if (storyExitBtn) storyExitBtn.style.display = "none";
  }

  if (arcadeRun) {
    if (arcadeBanner) {
      if (arcadeRun.phase === "returned") {
        arcadeBanner.textContent = `⚔ ${t("ongoingReturnedBadge")((arcadeRun.deck || []).length, arcadeRun.playerHp, arcadeRun.maxHp, formatTime(arcadeRun.elapsedSec))}`;
      } else {
        arcadeBanner.textContent = `⚔ ${t("ongoingBadge")(depthName(arcadeRun.depthId), Math.max(1, arcadeRun.step), PATH_STEPS, arcadeRun.playerHp, arcadeRun.maxHp)}`;
      }
      arcadeBanner.classList.add("show");
    }
    if (arcadePlayBtn) arcadePlayBtn.textContent = t("resumeArcadeGame");
    if (arcadeExitBtn) arcadeExitBtn.style.display = "";
  } else {
    if (arcadeBanner) arcadeBanner.classList.remove("show");
    if (arcadePlayBtn) arcadePlayBtn.textContent = t("playArcadeGame");
    if (arcadeExitBtn) arcadeExitBtn.style.display = "none";
  }
}

function handleStoryModeClick() {
  playClickSfx();
  activeGameMode = "story";
  const storyRun = (
    state.active &&
    state.gameMode === "story" &&
    state.depthId !== "depth_0" &&
    !["returned", "cleared", "dead", "abandoned"].includes(state.phase)
  )
    ? state
    : getSavedStoryRun();
  if (storyRun) {
    state = { ...createRunState(), ...storyRun, gameMode: "story" };
    resumeSavedRun();
    return;
  }
  ensureStoryConfig();
  state = createRunState();
  state.gameMode = "story";
  state.active = false;
  transitionToView("select", "漢字地獄", "");
}

function handlePlayGameClick() {
  playClickSfx();
  activeGameMode = "arcade";
  const arcadeRun = (state.active && state.gameMode === "arcade" && state.playerHp > 0)
    ? state
    : getSavedArcadeRun();
  if (arcadeRun) {
    state = { ...createRunState(), ...arcadeRun, gameMode: "arcade" };
    resumeSavedRun();
    return;
  }
  state = createRunState();
  state.gameMode = "arcade";
  state.active = false;
  transitionToView("select", "漢字地獄", "");
}

/* Guide */
let guidePageIdx = 0;

function openGuideModal() {
  playClickSfx();
  guidePageIdx = 0;
  renderGuidePage();
  openModal("guide-modal");
}

function stepGuidePage(delta) {
  playClickSfx();
  const pages = getGuidePages();
  guidePageIdx = (guidePageIdx + delta + pages.length) % pages.length;
  renderGuidePage();
}

function renderGuidePage() {
  const p = getGuidePages()[guidePageIdx];
  $("guide-page-title").textContent = `📖 ${p.title}`;
  $("guide-page-body").innerHTML = formatGmText(p.body);
}

/* Depth select — supports both Story Mode (Village stage + strictly sequential unlocked gates) and Arcade Mode. */
function renderDepthSpine() {
  const storyMode = activeGameMode === "story";
  const st = storyMode && typeof ensureStoryConfig === "function" ? ensureStoryConfig() : null;
  const expBar = $("select-exp-bar");
  const selectTitleEl = document.querySelector("#view-select .select-title");

  if (selectTitleEl) {
    selectTitleEl.textContent = storyMode ? t("selectDepthStory") : t("selectDepth");
  }

  if (expBar) {
    if (storyMode && st) {
      expBar.style.display = "flex";
      const infoEl = $("select-exp-info");
      const nPhase = typeof getStoryNarrativePhase === "function" ? getStoryNarrativePhase() : "early";
      const auraBadge = nPhase === "shura_12" ? " · 🩸 修羅(奈落)" : nPhase === "abyss_11" ? " · 🩸 修羅" : nPhase === "peace_10" ? " · 🌸 인간계 평정" : "";
      if (infoEl) {
        infoEl.textContent = `🪙 ${st.yen.toLocaleString()} 円 · 📿 ${t("specialBagShort")} ${st.specialItems.length} · 🀄 ${t("normalBagShort")} ${st.deck.length}${auraBadge}`;
      }
      const btnsWrap = expBar.querySelector(".select-exp-btns");
      if (btnsWrap) {
        btnsWrap.innerHTML = `
          <button class="btn btn-gold" onclick="openDeckViewer()">${escapeHtml(t("deckBtn"))}</button>
        `;
      }
    } else if (!storyMode && hasActiveArcadeRun() && state.phase === "returned") {
      expBar.style.display = "flex";
      const infoEl = $("select-exp-info");
      if (infoEl) infoEl.textContent = t("selectExpBarInfo")(state.deck.length, state.playerHp, state.maxHp, formatTime(state.elapsedSec));
      const btnsWrap = expBar.querySelector(".select-exp-btns");
      if (btnsWrap) {
        btnsWrap.innerHTML = `
          <button class="btn btn-gold" id="select-bag-btn" onclick="openDeckViewer()">${escapeHtml(t("deckBtn"))}</button>
          <button class="btn" onclick="promptExitFromSelect()">${escapeHtml(t("exit"))}</button>
        `;
      }
    } else {
      expBar.style.display = "none";
    }
  }

  const spine = $("depth-spine");
  if (!spine) return;
  spine.innerHTML = "";

  // In Story Mode, place the Village Stage Node (00 【里】 등불의 마을) at the very top of the spine!
  if (storyMode && st) {
    const nPhase = typeof getStoryNarrativePhase === "function" ? getStoryNarrativePhase() : "early";
    const villageNode = document.createElement("div");
    villageNode.className = `abyss-node village-node ${nPhase === "abyss_11" || nPhase === "shura_12" ? "shura" : ""}`;
    villageNode.onclick = () => openDepthEnterModal("depth_0");
    const validNpcs = ["先", "老", "友", "猫", "女", "男"];
    const metNpcs = Array.isArray(st.metNpcs) ? st.metNpcs.filter(k => validNpcs.includes(k)) : [];
    const npcsHtml = metNpcs
      .map(k => `<span class="encountered">${escapeHtml(k)}</span>`)
      .join("");
    villageNode.innerHTML = `
      <div class="node-num village-seal">里</div>
      <div class="node-body">
        <div class="node-title">${escapeHtml(t("villageNodeTitle"))} <span class="node-gloss">${escapeHtml(t("villageNodeGloss"))}</span></div>
        <div class="node-meta">故郷 · 燈火之里</div>
      </div>
      <div class="node-bosses">${npcsHtml}</div>
    `;
    spine.appendChild(villageNode);
  }

  Object.keys(KANKEN_DATA).forEach((did) => {
    const d = KANKEN_DATA[did];
    const dNum = depthNumber(did);
    const dTier = dNum >= 11 ? "abyss" : dNum >= 7 ? "common" : "edu";

    // In Story Mode, ONLY unlocked Gaols (dNum <= st.unlockedDepth) appear!
    // At the start (unlockedDepth === 0), not even 10급 (01 獄門) is shown until discovered in the Village!
    if (storyMode && st && dNum > st.unlockedDepth) {
      return;
    }

    const roster = depthRoster(did);
    const allFoes = allRosterKanji(did);

    const runSlain = storyMode && st
      ? [...new Set([...(st.defeatedFoes || []), ...(st.defeatedBosses || [])])]
      : (hasActiveArcadeRun() && Array.isArray(state.defeatedEnemies) ? state.defeatedEnemies : []);
    const runSeen = storyMode && st
      ? (st.encounteredFoes || [])
      : (hasActiveArcadeRun() && Array.isArray(state.encounteredEnemies) ? state.encounteredEnemies : []);

    const isDiscovered = (k) => Boolean(
      (config.seenFoes && config.seenFoes[k]) ||
      (config.achievements && config.achievements[`boss_${k}`]) ||
      runSeen.includes(k) ||
      runSlain.includes(k)
    );
    const discoveredCount = allFoes.filter(isDiscovered).length;
    const best = bestRecord(did);

    const bosses = roster.bossPool || [roster.boss];
    const storyConquered = storyMode && st && bosses.some(b => (st.defeatedBosses || []).includes(b));

    let recordLine = "";
    if (storyConquered) {
      recordLine = `🏆 ${escapeHtml(t("storyBossSlainBadge"))}${best ? ` · ★ ${formatTime(best.timeSec)}` : ""}`;
    } else if (best) {
      recordLine = `★ ${t("bestLabel")} ${formatTime(best.timeSec)} · ${escapeHtml(modelTag(best))}`;
    } else {
      recordLine = `<span class="unconquered">${escapeHtml(t("unconquered"))}</span>`;
    }

    const mobs = [...new Set([...roster.normal, ...roster.elite])].filter(k => !bosses.includes(k));

    const renderFoeSpan = (k, isBoss = false) => {
      const killedInExpedition = runSlain.includes(k);
      const seenEver = isDiscovered(k);
      if (!killedInExpedition && !seenEver) return ""; // User request: No question mark chore list
      const cls = [isBoss ? "boss" : "", killedInExpedition ? "seen" : "encountered"].filter(Boolean).join(" ");
      return `<span class="${cls}">${escapeHtml(k)}</span>`;
    };

    const node = document.createElement("div");
    node.className = `abyss-node tier-${dTier}` + ((best || storyConquered) ? " cleared" : "");
    node.onclick = () => openDepthEnterModal(did);
    node.innerHTML = `
      <div class="node-num tier-${dTier}">${depthNumStr(did)}</div>
      <div class="node-body">
        <div class="node-title">${escapeHtml(depthName(did))} <span class="node-gloss">${escapeHtml(depthGloss(did))}</span></div>
        <div class="node-meta">${kankenLabel(did)} · ${d.count.toLocaleString()}字 · ${t("depthBestiary")(discoveredCount, allFoes.length)}</div>
        <div class="node-scores">${recordLine}</div>
      </div>
      <div class="node-bosses">${mobs.map(k => renderFoeSpan(k, false)).join("")}<span class="boss-group">${bosses.map(k => renderFoeSpan(k, true)).join("")}</span></div>
    `;
    spine.appendChild(node);
  });
}

/* Pre-Entry Gate Lore & Stage Briefing Modal (supports depth_0 Village stage + Depths 1..12) */
function openDepthEnterModal(did) {
  if (activeGameMode === "arcade" && hasActiveArcadeRun() && state.phase !== "returned" && state.phase !== "cleared") {
    resumeSavedRun();
    return;
  }
  if (activeGameMode === "story" && hasActiveStoryDungeonRun()) {
    resumeSavedRun();
    return;
  }
  if (typeof playGateSlideSfx === "function") playGateSlideSfx();
  else playClickSfx();

  if (did === "depth_0") {
    const card = $("depth-modal-card");
    card.className = "modal-card depth-modal-card tier-edu";
    const seal = $("dm-seal");
    seal.textContent = "里";
    seal.className = "depth-modal-seal tier-edu";
    const zoneEl = $("dm-zone");
    zoneEl.textContent = pickLang({
      EN: "HOMETOWN · 燈火之里",
      KO: "고향 거점 · 燈火之里",
      JA: "故郷の拠点 · 燈火之里",
      ZH_CN: "故乡据点 · 灯火之里",
      ZH_TW: "故鄉據點 · 燈火之里"
    });
    zoneEl.className = "depth-modal-zone tier-edu";
    $("dm-title").textContent = `【${t("villageNodeTitle")}】 — ${t("villageNodeGloss")}`;
    $("dm-meta").textContent = "故郷 · 燈火之里";
    $("dm-lore").textContent = pickLang({
      EN: "Broken roofs lie buried under black ash, and the characters on the village signposts have been gouged out as if clawed by unseen beasts. Through the suffocating fog, only a faint paper lantern sways in the distance.",
      KO: "오랜만에 돌아온 고향의 처마들은 검은 재에 파묻혀 있고, 어귀의 이정표와 현판은 누군가 후벼 판 듯 글자가 흉측하게 파여 나갔습니다. 숨 막히는 잿빛 안개 너머로 오직 꺼져가는 등불만이 희미하게 흔들리며 돌아온 이를 맞이합니다.",
      JA: "久方ぶりに戻った故郷の軒並みは黒い灰に埋もれ、道標や扁額は抉られたように文字が削り取られている。息詰まる灰色の霧の向こうで、ただ一つ消えかけの灯だけが揺れていた。",
      ZH_CN: "久违的故乡屋檐埋在黑灰之下，路标与牌匾上的字迹被残忍挖去。令人窒息的灰雾深处，唯有微弱的灯火仍在摇曳。",
      ZH_TW: "久違的故鄉屋簷埋在黑灰之下，路標與牌匾上的字跡被殘忍挖去。令人窒息的灰霧深處，唯有微弱的燈火仍在搖曳。"
    });
    $("dm-lore").classList.remove("warn-step");

    const stageWrap = $("dm-stages-wrap");
    stageWrap.style.display = "none";
    $("dm-stages-label").textContent = t("dmStagesLabel");
    const stagesEl = $("dm-stages");
    const vSpots = typeof VILLAGE_SPOTS !== "undefined" ? Object.keys(VILLAGE_SPOTS) : ["塾", "炉", "橋", "家"];
    stagesEl.innerHTML = vSpots.map((s) => {
      const sDef = typeof VILLAGE_SPOTS !== "undefined" ? VILLAGE_SPOTS[s] : null;
      const omen = sDef ? pickLang(sDef.title) : s;
      return `<div class="dm-stage-chip tier-edu"><span class="dm-stage-kanji">${escapeHtml(s)}</span><span class="dm-stage-omen">${escapeHtml(omen)}</span></div>`;
    }).join("");

    const actions = $("dm-actions");
    actions.innerHTML = "";
    const enterBtn = document.createElement("button");
    enterBtn.className = "btn btn-gold";
    enterBtn.textContent = pickLang({
      EN: "Enter the Village",
      KO: "마을로 들어서기",
      JA: "里へ足を踏み入れる",
      ZH_CN: "踏入村落",
      ZH_TW: "踏入村落"
    });
    enterBtn.onclick = () => confirmEnterDepth("depth_0");

    const backBtn = document.createElement("button");
    backBtn.className = "btn";
    backBtn.textContent = t("stepBackBtn");
    backBtn.onclick = () => {
      playClickSfx();
      closeModal("depth-enter-modal");
    };
    actions.appendChild(enterBtn);
    actions.appendChild(backBtn);
    openModal("depth-enter-modal");
    return;
  }

  const d = KANKEN_DATA[did];
  const dNum = depthNumber(did);
  const tier = typeof depthTier === "function" ? depthTier(did) : (dNum >= 11 ? "abyss" : dNum >= 7 ? "common" : "edu");
  const card = $("depth-modal-card");
  card.className = `modal-card depth-modal-card tier-${tier}`;

  const seal = $("dm-seal");
  seal.textContent = depthNumStr(did);
  seal.className = `depth-modal-seal tier-${tier}`;

  const zoneMap = {
    edu: t("zoneEduBadge"),
    common: t("zoneCommonBadge"),
    abyss: t("zoneAbyssBadge")
  };
  const zoneEl = $("dm-zone");
  zoneEl.textContent = zoneMap[tier] || "";
  zoneEl.className = `depth-modal-zone tier-${tier}`;

  $("dm-title").textContent = `【${depthName(did)}】 — ${depthGloss(did)}`;
  $("dm-meta").textContent = `${kankenLabel(did)} · ${(d ? d.count : 0).toLocaleString()}字`;
  $("dm-lore").textContent = typeof depthLore === "function" ? depthLore(did) : "";
  $("dm-lore").classList.remove("warn-step");

  const stageWrap = $("dm-stages-wrap");
  stageWrap.style.display = "none";
  $("dm-stages-label").textContent = t("dmStagesLabel");
  const stagesEl = $("dm-stages");
  const stageSigns = (typeof DEPTH_STAGE_POOLS !== "undefined" && DEPTH_STAGE_POOLS[did]) || [];
  stagesEl.innerHTML = stageSigns.map((s) => {
    const sDef = typeof STAGE_SIGNS !== "undefined" ? STAGE_SIGNS[s] : null;
    const omen = sDef ? pickLang(sDef.omen) : "";
    const sTier = typeof getKanjiTier === "function" ? getKanjiTier(s) : tier;
    return `<div class="dm-stage-chip tier-${sTier}"><span class="dm-stage-kanji">${escapeHtml(s)}</span><span class="dm-stage-omen">${escapeHtml(omen)}</span></div>`;
  }).join("");

  const actions = $("dm-actions");
  actions.innerHTML = "";

  const enterBtn = document.createElement("button");
  enterBtn.className = tier === "abyss" ? "btn btn-abyss-enter" : "btn btn-gold";
  enterBtn.textContent = tier === "abyss" ? t("unsealAbyssBtn") : t("enterGaolBtn");
  enterBtn.onclick = () => {
    if (tier === "abyss") openAbyssSecondConfirm(did);
    else confirmEnterDepth(did);
  };

  const backBtn = document.createElement("button");
  backBtn.className = "btn";
  backBtn.textContent = t("stepBackBtn");
  backBtn.onclick = () => {
    playClickSfx();
    closeModal("depth-enter-modal");
  };

  actions.appendChild(enterBtn);
  actions.appendChild(backBtn);
  openModal("depth-enter-modal");
}

function openAbyssSecondConfirm(did) {
  if (typeof playDamageSfx === "function") playDamageSfx();
  const card = $("depth-modal-card");
  card.classList.remove("abyss-second-step");
  void card.offsetWidth;
  card.classList.add("abyss-second-step");

  const def = DEPTHS[did] || {};
  $("dm-title").textContent = pickLang(def.abyssWarnTitle) || "【WARNING】";
  const loreEl = $("dm-lore");
  loreEl.textContent = pickLang(def.abyssWarnDesc) || "";
  loreEl.classList.add("warn-step");
  $("dm-stages-wrap").style.display = "none";

  const actions = $("dm-actions");
  actions.innerHTML = "";

  const confirmBtn = document.createElement("button");
  confirmBtn.className = "btn btn-abyss-enter final";
  confirmBtn.textContent = pickLang(def.abyssConfirmBtn) || t("enterGaolBtn");
  confirmBtn.onclick = () => confirmEnterDepth(did);

  const cancelBtn = document.createElement("button");
  cancelBtn.className = "btn";
  cancelBtn.textContent = t("stepBackBtn");
  cancelBtn.onclick = () => {
    playClickSfx();
    closeModal("depth-enter-modal");
  };

  actions.appendChild(confirmBtn);
  actions.appendChild(cancelBtn);
}

function confirmEnterDepth(did) {
  closeModal("depth-enter-modal");
  if (did === "depth_0") {
    startVillageStage();
    return;
  }
  startRun(did);
}
