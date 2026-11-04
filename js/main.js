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

  buildAchievementCatalog();
  migrateLegacyAchievements();
  loadSavedRunFromStorage();
  applyLocalization();
  setupKeyboardNavigation();
  setupInstall();
  restoreViewFromHash();

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".dropdown")) closeDropdowns();
  });

  window.addEventListener("popstate", () => {
    if (anyModalOpen()) {
      closeAllModals();
      return;
    }
    if (currentView === "battle") pauseRunToTitle();
    else if (currentView !== "title") switchDomView("title", false);
  });

  setInterval(() => {
    if (currentView === "battle" && state.active && state.playerHp > 0 && !anyModalOpen() && !document.hidden) {
      state.elapsedSec = (state.elapsedSec || 0) + 1;
      updateTimerBadge();
    }
  }, 1000);
}

/* A refresh keeps you where you were: #battle resumes the saved run, #select reopens depth select. */
function restoreViewFromHash() {
  const view = location.hash.replace("#", "");
  if (view === "battle" && hasActiveRun()) resumeSavedRun();
  else if (view === "select") switchDomView("select", true);
  else if (view) history.replaceState(null, "", location.pathname);
}

initApp();
