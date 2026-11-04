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

/* Depth select */
function renderDepthSpine() {
  const spine = $("depth-spine");
  if (!spine) return;
  spine.innerHTML = "";
  Object.keys(KANKEN_DATA).forEach((did) => {
    const d = KANKEN_DATA[did];
    const roster = depthRoster(did);
    const seen = allRosterKanji(did).filter(k => config.achievements[`boss_${k}`]).length;
    const best = bestRecord(did);
    const recordLine = best
      ? `⛩ ${t("bestLabel")} ${formatTime(best.timeSec)} · ${escapeHtml(modelTag(best))}`
      : `<span class="unconquered">${escapeHtml(t("unconquered"))}</span>`;
    const node = document.createElement("div");
    node.className = "abyss-node" + (best ? " cleared" : "");
    node.onclick = () => requestStartRun(did);
    node.innerHTML = `
      <div class="node-num">${depthNumStr(did)}</div>
      <div class="node-body">
        <div class="node-title">${escapeHtml(depthName(did))} <span class="node-gloss">${escapeHtml(depthGloss(did))}</span></div>
        <div class="node-meta">${kankenLabel(did)} · ${d.count.toLocaleString()}字 · ${t("depthBestiary")(seen, allRosterKanji(did).length)}</div>
        <div class="node-scores">${recordLine}</div>
      </div>
      <div class="node-bosses">${[...roster.normal, ...roster.elite].map(k => `<span class="${config.achievements[`boss_${k}`] ? "seen" : ""}">${escapeHtml(k)}</span>`).join("")}<span class="boss ${config.achievements[`boss_${roster.boss}`] ? "seen" : ""}">${escapeHtml(roster.boss)}</span></div>
    `;
    spine.appendChild(node);
  });
}
