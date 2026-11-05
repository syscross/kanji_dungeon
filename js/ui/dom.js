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

/* Modals — dynamic z-index stack so newly opened modals (e.g. #confirm-modal over #settings-modal) always sit on top */
let _modalZCounter = 2000;

function openModal(id) {
  const el = $(id);
  if (!el) return;
  _modalZCounter += 2;
  // Confirmation & info modals get an extra boost so they can never be obscured by any dialog
  const boost = (id === "confirm-modal" || id === "info-modal") ? 500 : 0;
  el.style.zIndex = String(_modalZCounter + boost);
  el.classList.add("active");
}

function closeModal(id) {
  const el = $(id);
  if (!el) return;
  el.classList.remove("active");
  el.style.zIndex = "";
  if (!document.querySelector(".modal-backdrop.active")) {
    _modalZCounter = 2000;
  }
}

function anyModalOpen() {
  return document.querySelector(".modal-backdrop.active") !== null;
}

/* Closes only the topmost unlocked modal when ESC is pressed (preserves underlying modals like Settings). */
function closeTopModal() {
  const unlocked = Array.from(document.querySelectorAll(".modal-backdrop.active:not([data-locked='1'])"));
  if (!unlocked.length) return false;
  unlocked.sort((a, b) => {
    const za = parseInt(a.style.zIndex || getComputedStyle(a).zIndex || "0", 10) || 0;
    const zb = parseInt(b.style.zIndex || getComputedStyle(b).zIndex || "0", 10) || 0;
    return zb - za;
  });
  const top = unlocked[0];
  if (!top) return false;
  if (top.id === "confirm-modal") {
    closeConfirmModal(false);
  } else if (top.id === "pick-modal") {
    dismissPicker();
  } else {
    closeModal(top.id);
  }
  return true;
}

/* Locked modals (a required choice, e.g. the draft) ignore ESC / back. */
function closeAllModals() {
  document.querySelectorAll(".modal-backdrop.active").forEach(m => {
    if (m.dataset.locked) return;
    if (m.id === "pick-modal") dismissPicker();
    else {
      m.classList.remove("active");
      m.style.zIndex = "";
    }
  });
  if (!document.querySelector(".modal-backdrop.active")) {
    _modalZCounter = 2000;
  }
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
  closeDropdowns();
  const curtain = $("cinematic-curtain");
  if (!curtainKanji) {
    if (typeof playGateSlideSfx === "function") playGateSlideSfx();
    else playClickSfx();
    switchDomView(viewName, true);
    return;
  }
  playGongSfx();
  curtain.className = "active";
  if ($("curtain-badge")) $("curtain-badge").textContent = "";
  const titleEl = $("curtain-title");
  if (titleEl) {
    titleEl.textContent = curtainKanji;
    titleEl.dataset.len = "";
  }
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
  const titleEl = $("curtain-title");
  if (titleEl) {
    titleEl.textContent = `【 ${depthName(depthId)} 】`;
    titleEl.dataset.len = "";
  }
  $("curtain-sub").textContent = depthGloss(depthId);
  if ($("curtain-stages")) {
    $("curtain-stages").textContent = "";
  }

  curtain.className = `active descent tier-${tier}`;
  setTimeout(() => {
    switchDomView("battle", true);
    if (typeof onReady === "function") onReady();
    setTimeout(() => {
      curtain.classList.remove("active");
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

function promptExitStoryGame() {
  playClickSfx();
  if (!hasActiveStoryDungeonRun()) return;
  openConfirmModal(t("abandonModalTitle"), t("abandonStoryModalDesc"), () => {
    const storyRun = (state.active && state.gameMode === "story") ? state : getSavedStoryRun();
    if (storyRun) {
      state = { ...createRunState(), ...storyRun, gameMode: "story" };
    }
    if (typeof playSealStampSfx === "function") playSealStampSfx();
    else playGongSfx();
    if (typeof resolveStoryDeathOrAbandonBag === "function") {
      resolveStoryDeathOrAbandonBag();
    }
    state.phase = "abandoned";
    state.active = false;
    clearSavedRun("story");
    if (currentView === "select") renderDepthSpine();
    showToast(t("toastRunEnded"));
  });
}

function promptExitGame() {
  if (!hasActiveArcadeRun()) return;
  const arcadeRun = (state.active && state.gameMode === "arcade") ? state : getSavedArcadeRun();
  if (arcadeRun) {
    state = { ...createRunState(), ...arcadeRun, gameMode: "arcade" };
  }
  if (state.hasClearedBoss || state.phase === "cleared") {
    finishExpeditionFromClear();
    return;
  }
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

  const bossCard = $("b-boss-card");
  if (bossCard) {
    bossCard.classList.remove("hit", "defeated", "player-dead", "returned", "completed");
    bossCard.classList.add("abandoned");
  }
  state.phase = "abandoned";
  state.deck = [];
  clearSavedRun("arcade");
  if (currentView === "select") renderDepthSpine();
  showToast(t("toastRunEnded"));
}

function promptExitFromSelect() {
  playClickSfx();
  if (!hasActiveArcadeRun()) return;
  if (state.hasClearedBoss || state.phase === "cleared") {
    finishExpeditionFromClear();
    return;
  }
  openConfirmModal(t("abandonModalTitle"), t("abandonModalDesc"), () => {
    promptExitGame();
  });
}


