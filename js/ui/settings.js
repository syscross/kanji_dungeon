/* Settings modal: sound, AI provider / key / model, GM rule mode. */

function populateProviderSelect() {
  const pSel = $("s-provider");
  pSel.innerHTML = "";
  Object.entries(PROVIDERS).forEach(([k, v]) => {
    const opt = document.createElement("option");
    opt.value = k;
    opt.textContent = v.name;
    pSel.appendChild(opt);
  });
}

function openSettingsModal() {
  playClickSfx();
  closeDropdowns();
  syncSettingsUI();
  openModal("settings-modal");
}

function closeSettingsModal() {
  playClickSfx();
  closeModal("settings-modal");
}

function onProviderChange() {
  const p = $("s-provider").value;
  const pInfo = PROVIDERS[p] || PROVIDERS.free_keyless;

  $("s-apikey").value = savedKeys[p] || "";
  const linkEl = $("s-key-link");
  linkEl.href = pInfo.keyUrl;
  linkEl.textContent = `[${pInfo.keyLabel}]`;

  $("s-endpoint-group").style.display = p === "custom" ? "flex" : "none";
  $("s-apikey-group").style.display = ["free_keyless", "offline"].includes(p) ? "none" : "flex";

  const presetSel = $("s-model-preset");
  presetSel.innerHTML = "";
  pInfo.models.forEach(m => {
    const opt = document.createElement("option");
    opt.value = m.id;
    opt.textContent = m.label;
    presetSel.appendChild(opt);
  });
  $("s-model-custom").value = pInfo.models[0].id;
}

function onInstModeChange() {
  const m = $("s-inst-mode").value;
  $("s-custom-group").style.display = m === "Default" ? "none" : "flex";
}

function syncSettingsUI() {
  $("s-default-inst").value = DEFAULT_GM_RULES;
  $("s-provider").value = config.provider;
  onProviderChange();
  $("s-apikey").value = savedKeys[config.provider] || "";
  $("s-endpoint").value = config.customEndpoint;
  $("s-model-custom").value = config.model;
  $("s-inst-mode").value = config.instMode;
  $("s-custom-inst").value = config.customInst;
  syncSoundBtn();
  onInstModeChange();
}

function saveSettings(silent = false) {
  if (!silent) playClickSfx();
  config.provider = $("s-provider").value;
  config.apiKey = $("s-apikey").value.trim();
  config.customEndpoint = $("s-endpoint").value.trim();
  config.model = $("s-model-custom").value.trim() || PROVIDERS[config.provider].models[0].id;
  config.instMode = $("s-inst-mode").value;
  config.customInst = $("s-custom-inst").value.trim();

  savedKeys[config.provider] = config.apiKey;
  persistConfig();

  applyLocalization();
  if (currentView === "battle") updateBattleHUD(false);
  if (!silent) {
    closeModal("settings-modal");
    showToast(t("toastSaved")(config.provider, config.model, config.instMode));
  }
}

async function testApiKey() {
  playClickSfx();
  if ($("settings-modal").classList.contains("active")) saveSettings(true);
  showToast(t("toastTesting")(config.provider, config.model));
  try {
    const reply = await callLLM("Reply with the single word: READY", false);
    showToast(t("toastOk")(config.provider, String(reply).slice(0, 35).trim()));
  } catch (err) {
    showToast(t("toastErr")(err.message.slice(0, 90)));
  }
}
