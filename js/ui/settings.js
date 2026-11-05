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

function onProviderChange(preferredModel = null) {
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
  const customOpt = document.createElement("option");
  customOpt.value = "__custom__";
  customOpt.textContent = "✍ 직접 입력 (Custom Model ID below)…";
  presetSel.appendChild(customOpt);

  const defaultModelId = pInfo.models[0].id;
  const targetModel = (typeof preferredModel === "string" && preferredModel.trim())
    ? preferredModel.trim()
    : defaultModelId;

  $("s-model-custom").value = targetModel;
  const hasPreset = pInfo.models.some(m => m.id === targetModel);
  presetSel.value = hasPreset ? targetModel : "__custom__";
}

function onModelPresetChange() {
  const presetSel = $("s-model-preset");
  const customInp = $("s-model-custom");
  if (!presetSel || !customInp) return;
  if (presetSel.value === "__custom__") {
    customInp.focus();
    customInp.select();
    return;
  }
  customInp.value = presetSel.value;
  // Also persist immediately if provider matches so closing the modal never loses the dropdown choice
  if ($("s-provider").value === config.provider) {
    config.model = presetSel.value;
    persistConfig();
    if (currentView === "battle") updateBattleHUD(false);
  }
}

function onCustomModelInput() {
  const p = $("s-provider").value;
  const pInfo = PROVIDERS[p] || PROVIDERS.free_keyless;
  const presetSel = $("s-model-preset");
  const customInp = $("s-model-custom");
  if (!presetSel || !customInp) return;
  const val = customInp.value.trim();
  const matched = pInfo.models.find(m => m.id === val);
  // Switching presetSel to __custom__ whenever the text differs means clicking ANY preset (even the previously selected one) will always fire onchange!
  presetSel.value = matched ? matched.id : "__custom__";
}

function onInstModeChange() {
  const m = $("s-inst-mode").value;
  $("s-custom-group").style.display = m === "Default" ? "none" : "flex";
}

function syncSettingsUI() {
  $("s-default-inst").value = DEFAULT_GM_RULES;
  $("s-provider").value = config.provider;
  onProviderChange(config.model);
  $("s-apikey").value = savedKeys[config.provider] || "";
  $("s-endpoint").value = config.customEndpoint;
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
  const presetVal = $("s-model-preset") && $("s-model-preset").value !== "__custom__"
    ? $("s-model-preset").value
    : "";
  config.model = $("s-model-custom").value.trim() || presetVal || PROVIDERS[config.provider].models[0].id;
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
    version: 2,
    exportedAt: new Date().toISOString(),
    achievements: config.achievements || {},
    seenFoes: config.seenFoes || {},
    stats: config.stats || { kills: 0, flawless: 0, maxStreak: 0, summons: 0 },
    records: config.records || {},
    story: config.story || createDefaultStoryState(),
    instMode: config.instMode || "Default",
    customInst: config.customInst || "",
    lang: config.lang || "KO",
    savedRun: readJson(STORAGE.savedRun, null),
    savedStoryRun: readJson(STORAGE.savedStoryRun, null)
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
      if (!data || typeof data !== "object" || (data.app && data.app !== "KANJI_DUNGEON" && !data.achievements && !data.records && !data.savedRun && !data.story)) {
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
      if (data.story && typeof data.story === "object") {
        config.story = { ...createDefaultStoryState(), ...data.story };
      }
      if (typeof data.instMode === "string") config.instMode = data.instMode;
      if (typeof data.customInst === "string") config.customInst = data.customInst;
      if (typeof data.lang === "string" && I18N[data.lang]) config.lang = data.lang;

      persistConfig();
      persistAchievements();
      persistSeenFoes();
      persistStats();
      persistRecords();
      persistStoryState();

      if (data.savedStoryRun && typeof data.savedStoryRun === "object") {
        localStorage.setItem(STORAGE.savedStoryRun, JSON.stringify(data.savedStoryRun));
      } else if ("savedStoryRun" in data && !data.savedStoryRun) {
        localStorage.removeItem(STORAGE.savedStoryRun);
      }

      if (data.savedRun && typeof data.savedRun === "object" && data.savedRun.active && KANKEN_DATA[data.savedRun.depthId]) {
        localStorage.setItem(STORAGE.savedRun, JSON.stringify(data.savedRun));
      } else if ("savedRun" in data && !data.savedRun) {
        localStorage.removeItem(STORAGE.savedRun);
      }

      loadSavedRunFromStorage();
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


function promptWipeAllSaveData() {
  playClickSfx();
  const title = "⚠️ 【세이브 데이터 영구 삭제】";
  const desc = "스토리 모드 진행도, 보유 엔화, 영구 특수 성물, 도감 기록, 아케이드 진행 상황이 모두 영구 삭제됩니다.\n정말로 모든 세이브 데이터를 초기화하시겠습니까?";
  if (typeof openConfirmModal === "function") {
    openConfirmModal(title, desc, () => {
      wipeAllSaveData();
    });
  } else if (confirm(desc)) {
    wipeAllSaveData();
  }
}

function wipeAllSaveData() {
  playSealStampSfx();
  Object.values(STORAGE).forEach(k => {
    // Keep API keys and provider so user doesn't have to re-enter their key unless they want to
    if (k !== STORAGE.keys && k !== STORAGE.legacyKey && k !== STORAGE.provider && k !== STORAGE.endpoint) {
      localStorage.removeItem(k);
    }
  });

  config.achievements = {};
  config.seenFoes = {};
  config.stats = { kills: 0, runs: 0 };
  config.records = {};
  config.story = createDefaultStoryState();

  state = createRunState();
  state.active = false;

  loadSavedRunFromStorage();
  updateSavedRunBanner();
  renderDepthSpine();

  if (currentView === "battle") {
    transitionToView("title");
  }

  showToast("🗑️ 모든 세이브 데이터가 완전히 초기화되었습니다.");
}
