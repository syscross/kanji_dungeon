/*
 * PWA install. Browsers only allow the install prompt from a user gesture, so we
 * capture `beforeinstallprompt` (Chrome / Edge / Android) and fire it from the
 * title-screen button. iOS Safari has no prompt API — we show Add-to-Home-Screen steps.
 */

let deferredInstallPrompt = null;

const isStandalone = () =>
  window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;

const isIOS = () =>
  /iphone|ipad|ipod/i.test(navigator.userAgent) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

function setupInstall() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    updateInstallUI();
  });
  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    updateInstallUI();
  });
  updateInstallUI();
}

function updateInstallUI() {
  const btn = $("install-btn");
  if (!btn) return;
  const canInstall = !isStandalone() && (deferredInstallPrompt || isIOS());
  btn.style.display = canInstall ? "" : "none";
}

async function handleInstallClick() {
  playClickSfx();
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice.catch(() => {});
    deferredInstallPrompt = null;
    updateInstallUI();
    return;
  }
  if (isIOS()) {
    $("info-title").textContent = t("iosInstallTitle");
    $("info-desc").textContent = t("iosInstallDesc");
    openModal("info-modal");
  }
}
