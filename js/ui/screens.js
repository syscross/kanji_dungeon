/* Title screen, guide modal, depth select, game-over modal. */

/* Title */
function updateSavedRunBanner() {
  const banner = $("saved-run-banner");
  if (!banner) return;
  const playBtn = $("play-btn");
  if (hasActiveRun()) {
    banner.textContent = t("ongoingBadge")(KANKEN_DATA[state.depthId].title, state.turn, state.playerHp);
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
  else transitionToView("select", "奈落選択", "CHOOSE YOUR DEPTH (01 — 12)");
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
    const numStr = depthNumStr(did);
    const cleanTitle = depthCleanTitle(did);
    const seen = d.enemies.filter(k => config.achievements[`boss_${k}`]).length;
    const node = document.createElement("div");
    node.className = "abyss-node";
    node.onclick = () => requestStartRun(did);
    node.innerHTML = `
      <div class="node-num">${numStr}</div>
      <div class="node-body">
        <div class="node-title">${escapeHtml(cleanTitle)}</div>
        <div class="node-meta">${d.count.toLocaleString()} Kanji · ${t("depthBestiary")(seen, d.enemies.length)}</div>
        <div class="node-scores">🏆 ${getScore(did, "Default")} · 🛠 ${getScore(did, "Custom")} · 🧪 ${getScore(did, "Sandbox")}</div>
      </div>
      <div class="node-bosses">${d.enemies.map(k => `<span class="${config.achievements[`boss_${k}`] ? "seen" : ""}">${escapeHtml(k)}</span>`).join("")}</div>
    `;
    spine.appendChild(node);
  });
}
