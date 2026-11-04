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

/* Minimal markdown: headings, **bold**, `code`. Input is escaped first. */
function formatGmText(raw) {
  return escapeHtml(raw)
    .replace(/^#{1,4}\s*(.+)$/gm, "<strong>▸ $1</strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
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

function closeAllModals() {
  document.querySelectorAll(".modal-backdrop.active").forEach(m => m.classList.remove("active"));
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
  $("curtain-title").textContent = curtainKanji;
  $("curtain-sub").textContent = curtainSub;
  curtain.classList.add("active");
  setTimeout(() => {
    switchDomView(viewName, true);
    setTimeout(() => curtain.classList.remove("active"), 240);
  }, 330);
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
  playClickSfx();
  openConfirmModal(t("exitModalTitle"), t("exitModalDesc"), () => {
    playGongSfx();
    const curtain = $("cinematic-curtain");
    $("curtain-title").textContent = "閉 門";
    $("curtain-sub").textContent = "SEVERING CONNECTION... FAREWELL.";
    curtain.classList.add("active");
    setTimeout(() => {
      window.open("", "_self");
      window.close();
      $("curtain-sub").textContent = "CONNECTION CLOSED. YOU MAY CLOSE THIS TAB (OR TAP TO RETURN).";
      curtain.onclick = () => {
        curtain.onclick = null;
        curtain.classList.remove("active");
        switchDomView("title", false);
      };
    }, 850);
  });
}
