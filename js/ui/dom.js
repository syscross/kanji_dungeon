/* Generic DOM helpers: toasts, text formatting, modals, view switching, dropdowns. */

function $(id) {
  return document.getElementById(id);
}

const isCoarsePointer = () => window.matchMedia("(pointer: coarse)").matches;

let toastTimer = null;
function showToast(msg) {
  const el = $("global-toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 3200);
}

function escapeHtml(raw) {
  return String(raw).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* Minimal markdown: headings, **bold**, *italic*, `code`. Input is escaped first. */
function formatGmText(raw) {
  return escapeHtml(raw)
    .replace(/^#{1,4}\s*(.+)$/gm, "<strong>▸ $1</strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|\s)\*([^*\s][^*\n]*?)\*(?=\s|$)/gm, "$1<em>$2</em>")
    .replace(/`([^`]+)`/g, "<strong>[$1]</strong>");
}

/* Modals */
function openModal(id) {
  $(id).classList.add("active");
}

function closeModal(id) {
  $(id).classList.remove("active");
}

function anyModalOpen() {
  return document.querySelector(".modal-backdrop.active") !== null;
}

/* Locked modals (a required choice, e.g. the draft) ignore ESC / back. */
function closeAllModals() {
  document.querySelectorAll(".modal-backdrop.active").forEach(m => {
    if (m.dataset.locked) return;
    if (m.id === "pick-modal") dismissPicker();
    else m.classList.remove("active");
  });
}

let modalConfirmCallback = null;
function openConfirmModal(title, desc, onConfirm) {
  $("modal-title").textContent = title;
  $("modal-desc").textContent = desc;
  modalConfirmCallback = onConfirm;
  openModal("confirm-modal");
}

function closeConfirmModal(confirmed) {
  playClickSfx();
  closeModal("confirm-modal");
  const cb = modalConfirmCallback;
  modalConfirmCallback = null;
  if (confirmed && cb) cb();
}

/* Views */
function transitionToView(viewName, curtainKanji = null, curtainSub = "") {
  playClickSfx();
  closeDropdowns();
  const curtain = $("cinematic-curtain");
  if (!curtainKanji) {
    switchDomView(viewName, true);
    return;
  }
  playGongSfx();
  curtain.className = "active";
  if ($("curtain-badge")) $("curtain-badge").textContent = "";
  $("curtain-title").textContent = curtainKanji;
  $("curtain-sub").textContent = curtainSub;
  if ($("curtain-stages")) $("curtain-stages").textContent = "";
  setTimeout(() => {
    switchDomView(viewName, true);
    setTimeout(() => {
      curtain.className = "";
    }, 240);
  }, 330);
}

/* Heavy gate-unsealing descent animation when entering a Gaol */
function enterGaolCinematic(depthId, onReady) {
  closeDropdowns();
  const curtain = $("cinematic-curtain");
  const tier = typeof depthTier === "function" ? depthTier(depthId) : "edu";
  const stageSigns = (typeof DEPTH_STAGE_POOLS !== "undefined" && DEPTH_STAGE_POOLS[depthId]) || [];

  playGongSfx();
  setTimeout(() => {
    if (typeof playSealStampSfx === "function") playSealStampSfx();
  }, 340);

  if ($("curtain-badge")) {
    $("curtain-badge").textContent = `第 ${depthNumStr(depthId)} 獄 · ${kankenLabel(depthId)}`;
  }
  $("curtain-title").textContent = `【 ${depthName(depthId)} 】`;
  $("curtain-sub").textContent = depthGloss(depthId);
  if ($("curtain-stages")) {
    $("curtain-stages").textContent = stageSigns.length ? `⛩ ${stageSigns.join("  ·  ")}` : "";
  }

  curtain.className = `active descent tier-${tier}`;
  setTimeout(() => {
    switchDomView("battle", true);
    if (typeof onReady === "function") onReady();
    setTimeout(() => {
      curtain.className = "";
    }, 460);
  }, 1150);
}

function switchDomView(name, pushHist = true) {
  currentView = name;
  kbIndex = 0;
  if (pushHist) {
    history.replaceState({ view: name }, "", name === "title" ? window.location.pathname : `#${name}`);
  }
  document.body.dataset.view = name;
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  $(`view-${name}`).classList.add("active");
  if (name === "select") renderDepthSpine();
  if (name === "title") updateSavedRunBanner();
  if (name === "battle") scrollLogToBottom();
}

/* Dropdowns (language menu, battle menu) */
function closeDropdowns(except = null) {
  document.querySelectorAll(".dropdown.open").forEach(dd => {
    if (dd !== except) dd.classList.remove("open");
  });
}

function toggleDropdown(id, e) {
  if (e) e.stopPropagation();
  playClickSfx();
  const dd = $(id);
  closeDropdowns(dd);
  dd.classList.toggle("open");
}

function selectLanguage(langCode, e) {
  if (e) e.stopPropagation();
  playClickSfx();
  config.lang = langCode;
  localStorage.setItem(STORAGE.lang, langCode);
  closeDropdowns();
  applyLocalization();
  if (currentView === "battle") updateBattleHUD(false);
}

function handleBrandClick() {
  playClickSfx();
  if (currentView === "title") return;
  if (currentView === "battle") pauseRunToTitle();
  else transitionToView("title");
}

function promptExitGame() {
  if (!hasActiveRun()) return;
  if (typeof playSealStampSfx === "function") playSealStampSfx();
  else playGongSfx();

  // Ensure previous log entries are rendered in #b-gm-log so the full run log remains intact behind
  if (!$("b-gm-log").children.length && state.history && state.history.length) {
    replayHistory();
  }

  const depthId = state.depthId;
  const rec = typeof runSummary === "function" ? runSummary() : { kills: state.kills || 0, totalTurns: state.totalTurns || 0, timeSec: state.elapsedSec || 0 };
  logBeat("death-log", t("goAbandon"), [
    `**${t("goDepth")}**: ${depthNumStr(depthId)} ${depthName(depthId)} — ${depthGloss(depthId)}`,
    `**${t("goReached")}**: ${Math.max(1, state.step)}/${PATH_STEPS} · ${t("goBoss")} 【${state.enemyKanji || state.sign || "—"}】`,
    `**${t("goStreak")}**: ⚔ ${rec.kills} · ${rec.totalTurns}T · ⏱ ${formatTime(rec.timeSec)}`,
    `**${t("goModel")}**: ${typeof modelTag === "function" ? modelTag(rec) : ""}`,
    `**${t("goAch")}**: ${typeof achievementLine === "function" ? achievementLine() : t("goNone")}`
  ]);

  state.phase = "dead";
  clearSavedRun();
  showToast(t("toastRunEnded"));
}

