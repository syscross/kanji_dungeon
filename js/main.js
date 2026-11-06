/* App bootstrap. Loaded last; every other script only declares globals/functions. */

async function initApp() {
  document.body.dataset.view = "title";
  setupViewport();
  startEmberCanvas();
  syncSoundBtn();
  populateProviderSelect();
  syncSettingsUI();

  const res = await fetch("/kanken_data.json");
  KANKEN_DATA = await res.json();
  try {
    const cur = await fetch("/kanken_curated.json");
    if (cur.ok) PLAYABLE_POOLS = await cur.json();   // optional per-depth whitelist (GUIDELINE §5)
  } catch (_) { /* none shipped */ }
  if (typeof buildKanjiDepthMap === "function") buildKanjiDepthMap();

  buildAchievementCatalog();
  migrateLegacyAchievements();
  loadSavedRunFromStorage();
  applyLocalization();
  setupKeyboardNavigation();
  setupInstall();
  restoreViewFromHash();
  if (typeof initBrowserHistory === "function") {
    initBrowserHistory();
  }

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".dropdown")) closeDropdowns();
  });

  window.addEventListener("popstate", () => {
    handleBrowserBack();
  });

  setInterval(() => {
    const runningPhase = !["cleared", "dead", "abandoned", "returned"].includes(state.phase);
    if (currentView === "battle" && state.active && runningPhase && state.playerHp > 0 && !anyModalOpen() && !document.hidden) {
      state.elapsedSec = (state.elapsedSec || 0) + 1;
      updateTimerBadge();
    }
  }, 1000);
}

function handleBrowserBack() {
  if (anyModalOpen()) {
    if (!closeTopModal()) {
      // Locked modal (e.g. required pick): keep it open and re-arm history
      if (typeof ensureActiveHistoryEntry === "function") ensureActiveHistoryEntry();
      return;
    }
    if (typeof ensureActiveHistoryEntry === "function") ensureActiveHistoryEntry();
    return;
  }

  if (document.querySelector(".dropdown.open")) {
    closeDropdowns();
    if (typeof ensureActiveHistoryEntry === "function") ensureActiveHistoryEntry();
    return;
  }

  if (typeof cancelPendingCinematics === "function") {
    cancelPendingCinematics();
  }

  if (currentView === "battle") {
    if (state.depthId === "depth_0") {
      if (state.phase === "village_spot" && typeof returnToVillageCrossroads === "function") {
        returnToVillageCrossroads();
        if (typeof ensureActiveHistoryEntry === "function") ensureActiveHistoryEntry();
        return;
      }
      state.active = false;
      if (typeof persistStoryState === "function") persistStoryState();
      switchDomView("select", false);
      if (typeof ensureActiveHistoryEntry === "function") ensureActiveHistoryEntry();
      return;
    }

    const over = ["cleared", "dead", "abandoned", "returned"].includes(state.phase);
    if (over) {
      switchDomView("select", false);
      if (typeof ensureActiveHistoryEntry === "function") ensureActiveHistoryEntry();
      return;
    }

    if (typeof _flushSaveRunToStorage === "function") _flushSaveRunToStorage();
    else saveRunToStorage();
    switchDomView("title", false);
    if (typeof ensureActiveHistoryEntry === "function") ensureActiveHistoryEntry();
    return;
  }

  if (currentView === "select") {
    switchDomView("title", false);
    if (typeof ensureActiveHistoryEntry === "function") ensureActiveHistoryEntry();
    return;
  }

  switchDomView("title", false);
  if (typeof ensureActiveHistoryEntry === "function") ensureActiveHistoryEntry();
}

/* A refresh keeps you where you were: #battle resumes the saved run, #select reopens depth select (only if not mid-gaol). */
function restoreViewFromHash() {
  const view = location.hash.replace("#", "");
  if (view === "battle" && hasActiveRun()) {
    switchDomView("battle", false);
    resumeSavedRun();
  } else if (view === "select") {
    if (hasActiveRun() && state.phase !== "returned" && state.phase !== "cleared") {
      switchDomView("battle", false);
      resumeSavedRun();
    } else {
      switchDomView("select", false);
    }
  } else {
    switchDomView("title", false);
  }
}

initApp();
