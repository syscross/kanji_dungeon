/* Title screen, guide modal, depth select (Story Mode + Arcade Mode), and gate briefing modal. */

/* Title */
function updateSavedRunBanner() {
  const storyBanner = $("saved-story-banner");
  const arcadeBanner = $("saved-run-banner");
  const storyPlayBtn = $("story-play-btn");
  const storyExitBtn = $("story-exit-btn");
  const arcadePlayBtn = $("play-btn");
  const arcadeExitBtn = $("title-exit-btn");

  const storyRun = (state.active && state.gameMode === "story" && !["returned", "cleared", "dead", "abandoned"].includes(state.phase))
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
  const storyRun = (state.active && state.gameMode === "story" && !["returned", "cleared", "dead", "abandoned"].includes(state.phase))
    ? state
    : getSavedStoryRun();
  if (storyRun) {
    state = { ...createRunState(), ...storyRun, gameMode: "story" };
    resumeSavedRun();
    return;
  }
  const st = typeof ensureStoryConfig === "function" ? ensureStoryConfig() : config.story;
  const firstTime = !st.started;
  state = createRunState();
  state.gameMode = "story";
  state.active = false;
  transitionToView("select", "【 灯 の 里 】", t("villageSubTitle"));
  if (firstTime && typeof openVillageModal === "function") {
    setTimeout(() => openVillageModal("sensei"), 420);
  }
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

/* Depth select — supports both Story Mode (Village node + sequential gates + persistent kills) and Arcade Mode. */
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
      const aura = typeof getStoryAuraStage === "function" ? getStoryAuraStage() : "early";
      const auraBadge = aura === "abyss12" ? " · 🩸 修羅(奈落)" : aura === "abyss11" ? " · 🩸 修羅" : aura === "peace" ? " · 🌸 인간계 평정" : "";
      if (infoEl) {
        infoEl.textContent = `🪙 ${st.yen.toLocaleString()} 円 · 📿 ${t("specialBagShort")} ${st.specialItems.length} · 🀄 ${t("normalBagShort")} ${st.deck.length}${auraBadge}`;
      }
      const btnsWrap = expBar.querySelector(".select-exp-btns");
      if (btnsWrap) {
        btnsWrap.innerHTML = `
          <button class="btn btn-gold" onclick="openVillageModal('sensei')">🏮 ${escapeHtml(t("enterVillageBtn"))}</button>
          <button class="btn" onclick="openDeckViewer()">📿/🀄 ${escapeHtml(t("deckBtn"))} (${st.deck.length})</button>
        `;
      }
    } else if (!storyMode && hasActiveArcadeRun() && state.phase === "returned") {
      expBar.style.display = "flex";
      const infoEl = $("select-exp-info");
      if (infoEl) infoEl.textContent = t("selectExpBarInfo")(state.deck.length, state.playerHp, state.maxHp, formatTime(state.elapsedSec));
      const btnsWrap = expBar.querySelector(".select-exp-btns");
      if (btnsWrap) {
        btnsWrap.innerHTML = `
          <button class="btn btn-gold" id="select-bag-btn" onclick="openDeckViewer()">${escapeHtml(t("deckBtn"))} (${state.deck.length})</button>
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

  // In Story Mode, place the Village Hub Node 【里】 at the very top of the spine!
  if (storyMode && st) {
    const aura = typeof getStoryAuraStage === "function" ? getStoryAuraStage() : "early";
    const villageNode = document.createElement("div");
    villageNode.className = `abyss-node village-node ${aura === "abyss11" || aura === "abyss12" ? "shura" : ""}`;
    villageNode.onclick = () => openVillageModal("sensei");
    const npcs = [
      `<span class="v-npc">【先】${escapeHtml(t("npcSenseiShort"))}</span>`,
      `<span class="v-npc">【老】${escapeHtml(t("npcElderShort"))}</span>`,
      `<span class="v-npc">【友】${escapeHtml(t("npcFriendShort"))}</span>`,
      st.catRescued ? `<span class="v-npc cat">🐱【猫】</span>` : ""
    ].filter(Boolean).join(" · ");
    villageNode.innerHTML = `
      <div class="node-num village-seal">里</div>
      <div class="node-body">
        <div class="node-title">${escapeHtml(t("villageNodeTitle"))} <span class="node-gloss">${escapeHtml(t("villageNodeGloss"))}</span></div>
        <div class="node-meta">${npcs}</div>
        <div class="node-scores">${escapeHtml(t("villageNodeHint"))}</div>
      </div>
    `;
    spine.appendChild(villageNode);
  }

  Object.keys(KANKEN_DATA).forEach((did) => {
    const d = KANKEN_DATA[did];
    const dNum = depthNumber(did);
    const dTier = dNum >= 11 ? "abyss" : dNum >= 7 ? "common" : "edu";

    // In Story Mode, Depth 11 only reveals & opens after clearing Depth 10, and Depth 12 only after clearing Depth 11!
    if (storyMode && st && dNum >= 11 && dNum > st.unlockedDepth) {
      return;
    }

    const isLocked = storyMode && st && dNum > st.unlockedDepth;
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
    if (isLocked) {
      recordLine = `<span class="locked-hint">🔒 ${escapeHtml(t("storyLockedHint")(dNum - 1))}</span>`;
    } else if (storyConquered) {
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
      const cls = [isBoss ? "boss" : "", killedInExpedition ? "seen" : seenEver ? "encountered" : "unknown"].filter(Boolean).join(" ");
      const txt = (killedInExpedition || seenEver) ? k : "？";
      return `<span class="${cls}">${escapeHtml(txt)}</span>`;
    };

    const node = document.createElement("div");
    node.className = `abyss-node tier-${dTier}` + ((best || storyConquered) ? " cleared" : "") + (isLocked ? " locked" : "");
    node.onclick = () => {
      if (isLocked) {
        playClickSfx();
        showToast(`🔒 ${t("storyLockedHint")(dNum - 1)}`);
        return;
      }
      openDepthEnterModal(did);
    };
    node.innerHTML = `
      <div class="node-num tier-${dTier}">${isLocked ? "封" : depthNumStr(did)}</div>
      <div class="node-body">
        <div class="node-title">${escapeHtml(depthName(did))} <span class="node-gloss">${escapeHtml(depthGloss(did))}</span></div>
        <div class="node-meta">${kankenLabel(did)} · ${d.count.toLocaleString()}字 · ${t("depthBestiary")(discoveredCount, allFoes.length)}</div>
        <div class="node-scores">${recordLine}</div>
      </div>
      <div class="node-bosses">${mobs.map(k => renderFoeSpan(k, false)).join("")}<span class="boss-group">主 ${bosses.map(k => renderFoeSpan(k, true)).join("")}</span></div>
    `;
    spine.appendChild(node);
  });
}

/* Pre-Entry Gate Lore & Stage Briefing Modal (with double-confirmation for Red Zone Depths 11 & 12) */
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
  stageWrap.style.display = "";
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
  requestStartRun(did);
}

