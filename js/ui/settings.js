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

/* ---- Save Data Export & Import (excludes API keys for safety) ---- */

function exportSaveData() {
  playClickSfx();
  const payload = {
    app: "KANJI_DUNGEON",
    version: 1,
    exportedAt: new Date().toISOString(),
    achievements: config.achievements || {},
    seenFoes: config.seenFoes || {},
    stats: config.stats || { kills: 0, flawless: 0, maxStreak: 0, summons: 0 },
    records: config.records || {},
    instMode: config.instMode || "Default",
    customInst: config.customInst || "",
    lang: config.lang || "KO",
    savedRun: readJson(STORAGE.savedRun, null)
  };
  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  a.href = url;
  a.download = `kanji-dungeon-save-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    a.remove();
    URL.revokeObjectURL(url);
  }, 200);
  showToast(t("toastExported"));
}

function triggerImportSave() {
  playClickSfx();
  const inp = $("save-file-input");
  if (!inp) return;
  inp.value = "";
  inp.click();
}

function handleImportSaveFile(event) {
  const file = event && event.target && event.target.files && event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(String(reader.result || ""));
      if (!data || typeof data !== "object" || (data.app && data.app !== "KANJI_DUNGEON" && !data.achievements && !data.records && !data.savedRun)) {
        throw new Error("Invalid format");
      }
      if (data.achievements && typeof data.achievements === "object") {
        config.achievements = data.achievements;
      }
      if (data.seenFoes && typeof data.seenFoes === "object") {
        config.seenFoes = data.seenFoes;
      }
      if (data.stats && typeof data.stats === "object") {
        config.stats = {
          kills: Number(data.stats.kills) || 0,
          flawless: Number(data.stats.flawless) || 0,
          maxStreak: Number(data.stats.maxStreak) || 0,
          summons: Number(data.stats.summons) || 0
        };
      }
      if (data.records && typeof data.records === "object") {
        config.records = data.records;
      }
      if (typeof data.instMode === "string") config.instMode = data.instMode;
      if (typeof data.customInst === "string") config.customInst = data.customInst;
      if (typeof data.lang === "string" && I18N[data.lang]) config.lang = data.lang;

      persistConfig();
      persistProgress();

      if (data.savedRun && typeof data.savedRun === "object" && data.savedRun.active && KANKEN_DATA[data.savedRun.depthId]) {
        Object.assign(state, newRunState(), data.savedRun);
        if (typeof isPureKanjiCard === "function" && Array.isArray(state.deck)) {
          state.deck = state.deck.filter(k => isPureKanjiCard(k));
        }
        saveRunToStorage();
      } else if ("savedRun" in data && !data.savedRun) {
        state.active = false;
        clearSavedRun();
      }

      syncSettingsUI();
      applyLocalization();
      updateSavedRunBanner();
      renderDepthSpine();
      if (currentView === "battle") {
        if (state.active) updateBattleHUD(false);
        else transitionToView("title");
      }
      if (typeof playHealSfx === "function") playHealSfx();
      showToast(t("toastImported"));
    } catch (_e) {
      showToast(t("toastImportErr"));
    }
  };
  reader.readAsText(file);
}

