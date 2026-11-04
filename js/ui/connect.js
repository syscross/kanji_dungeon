/*
 * Trial mode (keyless) vs. a connected AI.
 * The quick-connect modal walks the player through a free Gemini key; it is shown
 * before a new run while in trial mode, from the 🔌 badge, and from the offline-verdict nudge.
 */

const TRIAL_ACK_KEY = "kd_trial_ack"; // sessionStorage: player chose "continue in trial" this session
let connectCallback = null;

function isTrialMode() {
  return ["free_keyless", "offline"].includes(config.provider) || (!config.apiKey && !KEYLESS_PROVIDERS.includes(config.provider));
}

function updateTrialUI() {
  const trial = isTrialMode();
  const badge = $("b-trial");
  if (badge) badge.style.display = trial ? "" : "none";
  const line = $("title-trial");
  if (line) line.classList.toggle("show", trial);
}

/* Depth select → start run, asking once per session to connect an AI while in trial mode. */
function requestStartRun(depthId) {
  if (isTrialMode() && config.provider !== "offline" && !sessionStorage.getItem(TRIAL_ACK_KEY)) {
    openConnectModal(() => startRun(depthId));
    return;
  }
  startRun(depthId);
}

function openConnectModal(onDone = null) {
  playClickSfx();
  closeDropdowns();
  connectCallback = typeof onDone === "function" ? onDone : null;
  $("c-key").value = savedKeys.gemini || "";
  setConnectStatus("", "");
  openModal("connect-modal");
}

/* continueTrial=true → player picked "continue in trial mode"; ✕ just closes. */
function closeConnectModal(continueTrial) {
  closeModal("connect-modal");
  const cb = connectCallback;
  connectCallback = null;
  if (continueTrial) {
    sessionStorage.setItem(TRIAL_ACK_KEY, "1");
    if (cb) cb();
  }
}

function setConnectStatus(text, cls) {
  const el = $("c-status");
  el.textContent = text;
  el.className = `connect-status ${cls}`.trim();
}

async function connectGeminiKey() {
  playClickSfx();
  const key = $("c-key").value.trim();
  if (!key) {
    setConnectStatus(t("connectEmpty"), "err");
    return;
  }
  const prev = { provider: config.provider, apiKey: config.apiKey, model: config.model };
  const geminiModels = PROVIDERS.gemini.models.map(m => m.id);
  config.provider = "gemini";
  config.apiKey = key;
  if (!geminiModels.includes(config.model)) config.model = geminiModels[0];

  const btn = $("c-save-btn");
  btn.disabled = true;
  setConnectStatus("⏳ …", "");
  try {
    await callLLM("Reply with the single word: READY", false);
    savedKeys.gemini = key;
    persistConfig();
    applyLocalization();
    if (currentView === "battle") updateBattleHUD(false);
    setConnectStatus(t("connectOk"), "ok");
    const cb = connectCallback;
    setTimeout(() => {
      closeModal("connect-modal");
      connectCallback = null;
      if (cb) cb();
    }, 700);
  } catch (err) {
    Object.assign(config, prev);
    setConnectStatus(t("connectFail")(err.message.slice(0, 120)), "err");
  } finally {
    btn.disabled = false;
  }
}
