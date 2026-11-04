/* Title screen, guide modal, depth select, game-over modal. */

/* Title */
function updateSavedRunBanner() {
  const banner = $("saved-run-banner");
  if (!banner) return;
  const playBtn = $("play-btn");
  if (hasActiveRun()) {
    banner.textContent = t("ongoingBadge")(depthName(state.depthId), Math.max(1, state.step), PATH_STEPS, state.playerHp, state.maxHp);
    banner.classList.add("show");
    if (playBtn) playBtn.textContent = t("resumeGame");
  } else {
    banner.classList.remove("show");
    if (playBtn) playBtn.textContent = t("playGame");
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
  const spine = $("depth-spine");
  if (!spine) return;
  spine.innerHTML = "";
  Object.keys(KANKEN_DATA).forEach((did) => {
    const d = KANKEN_DATA[did];
    const dNum = depthNumber(did);
    const dTier = dNum >= 11 ? "abyss" : dNum >= 7 ? "common" : "edu";
    const roster = depthRoster(did);
    const allFoes = allRosterKanji(did);
    const killedCount = allFoes.filter(k => config.achievements[`boss_${k}`]).length;
    const best = bestRecord(did);
    const recordLine = best
      ? `⛩ ${t("bestLabel")} ${formatTime(best.timeSec)} · ${escapeHtml(modelTag(best))}`
      : `<span class="unconquered">${escapeHtml(t("unconquered"))}</span>`;

    const bosses = roster.bossPool || [roster.boss];
    const mobs = [...new Set([...roster.normal, ...roster.elite])].filter(k => !bosses.includes(k));

    const renderFoeSpan = (k, isBoss = false) => {
      const killed = Boolean(config.achievements[`boss_${k}`]);
      const seen = Boolean(config.seenFoes && config.seenFoes[k]);
      const cls = [isBoss ? "boss" : "", killed ? "seen" : seen ? "encountered" : "unknown"].filter(Boolean).join(" ");
      const txt = (killed || seen) ? k : "？";
      return `<span class="${cls}">${escapeHtml(txt)}</span>`;
    };

    const node = document.createElement("div");
    node.className = `abyss-node tier-${dTier}` + (best ? " cleared" : "");
    node.onclick = () => requestStartRun(did);
    node.innerHTML = `
      <div class="node-num tier-${dTier}">${depthNumStr(did)}</div>
      <div class="node-body">
        <div class="node-title">${escapeHtml(depthName(did))} <span class="node-gloss">${escapeHtml(depthGloss(did))}</span></div>
        <div class="node-meta">${kankenLabel(did)} · ${d.count.toLocaleString()}字 · ${t("depthBestiary")(killedCount, allFoes.length)}</div>
        <div class="node-scores">${recordLine}</div>
      </div>
      <div class="node-bosses">${mobs.map(k => renderFoeSpan(k, false)).join("")}<span class="boss-group">主 ${bosses.map(k => renderFoeSpan(k, true)).join("")}</span></div>
    `;
    spine.appendChild(node);
  });
}
