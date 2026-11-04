/* Title screen, guide modal, depth select, game-over modal. */

/* Title */
function updateSavedRunBanner() {
  const banner = $("saved-run-banner");
  if (!banner) return;
  const playBtn = $("play-btn");
  const exitBtn = $("title-exit-btn");
  if (hasActiveRun()) {
    if (state.phase === "returned") {
      banner.textContent = t("ongoingReturnedBadge")(state.deck.length, state.playerHp, state.maxHp, formatTime(state.elapsedSec));
    } else {
      banner.textContent = t("ongoingBadge")(depthName(state.depthId), Math.max(1, state.step), PATH_STEPS, state.playerHp, state.maxHp);
    }
    banner.classList.add("show");
    if (playBtn) playBtn.textContent = t("resumeGame");
    if (exitBtn) exitBtn.style.display = "";
  } else {
    banner.classList.remove("show");
    if (playBtn) playBtn.textContent = t("playGame");
    if (exitBtn) exitBtn.style.display = "none";
  }
}

function handlePlayGameClick() {
  playClickSfx();
  if (hasActiveRun()) resumeSavedRun();
  else transitionToView("select", "漢字地獄", "");
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

/* Depth select — hides unseen foes as '？', shows encountered as gray, slain as red. */
function renderDepthSpine() {
  const expBar = $("select-exp-bar");
  if (expBar) {
    if (hasActiveRun() && state.phase === "returned") {
      expBar.style.display = "flex";
      const infoEl = $("select-exp-info");
      if (infoEl) infoEl.textContent = t("selectExpBarInfo")(state.deck.length, state.playerHp, state.maxHp, formatTime(state.elapsedSec));
      const bagBtn = $("select-bag-btn");
      if (bagBtn) bagBtn.textContent = `${t("deckBtn")} (${state.deck.length})`;
    } else {
      expBar.style.display = "none";
    }
  }
  const spine = $("depth-spine");
  if (!spine) return;
  spine.innerHTML = "";
  Object.keys(KANKEN_DATA).forEach((did) => {
    const d = KANKEN_DATA[did];
    const dNum = depthNumber(did);
    const dTier = dNum >= 11 ? "abyss" : dNum >= 7 ? "common" : "edu";
    const roster = depthRoster(did);
    const allFoes = allRosterKanji(did);
    const activeRun = hasActiveRun();
    const runSlain = activeRun && Array.isArray(state.defeatedEnemies) ? state.defeatedEnemies : [];
    const runSeen = activeRun && Array.isArray(state.encounteredEnemies) ? state.encounteredEnemies : [];
    const isDiscovered = (k) => Boolean(
      (config.seenFoes && config.seenFoes[k]) ||
      (config.achievements && config.achievements[`boss_${k}`]) ||
      runSeen.includes(k) ||
      runSlain.includes(k)
    );
    const discoveredCount = allFoes.filter(isDiscovered).length;
    const best = bestRecord(did);
    const recordLine = best
      ? `★ ${t("bestLabel")} ${formatTime(best.timeSec)} · ${escapeHtml(modelTag(best))}`
      : `<span class="unconquered">${escapeHtml(t("unconquered"))}</span>`;

    const bosses = roster.bossPool || [roster.boss];
    const mobs = [...new Set([...roster.normal, ...roster.elite])].filter(k => !bosses.includes(k));

    const renderFoeSpan = (k, isBoss = false) => {
      const killedInExpedition = runSlain.includes(k);
      const seenEver = isDiscovered(k);
      const cls = [isBoss ? "boss" : "", killedInExpedition ? "seen" : seenEver ? "encountered" : "unknown"].filter(Boolean).join(" ");
      const txt = (killedInExpedition || seenEver) ? k : "？";
      return `<span class="${cls}">${escapeHtml(txt)}</span>`;
    };

    const node = document.createElement("div");
    node.className = `abyss-node tier-${dTier}` + (best ? " cleared" : "");
    node.onclick = () => openDepthEnterModal(did);
    node.innerHTML = `
      <div class="node-num tier-${dTier}">${depthNumStr(did)}</div>
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
  if (hasActiveRun() && state.phase !== "returned" && state.phase !== "cleared") {
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

