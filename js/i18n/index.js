/*
 * i18n core. UI strings live in one file per language (js/i18n/<lang>.js) and register
 * themselves on I18N. Game content (depths, events, rewards, achievements, guide) keeps
 * its translations inline in js/data/* as { EN, KO, JA, ZH_CN, ZH_TW } maps — read with pickLang().
 */

const I18N = {};

const LANG_NAMES = {
  EN: "English",
  KO: "Korean (한국어)",
  JA: "Japanese (日本語)",
  ZH_CN: "Simplified Chinese (简体中文)",
  ZH_TW: "Traditional Chinese (繁體中文)"
};

function t(key) {
  const pack = I18N[config.lang] || I18N.EN;
  return pack[key] !== undefined ? pack[key] : (I18N.EN[key] !== undefined ? I18N.EN[key] : key);
}

/* Pick a value from a { EN, KO, ... } map with EN fallback. */
function pickLang(map) {
  if (!map || typeof map !== "object") return map;
  return map[config.lang] || map.EN || Object.values(map)[0];
}

function applyLocalization() {
  document.documentElement.lang = { KO: "ko", JA: "ja", ZH_CN: "zh-CN", ZH_TW: "zh-TW" }[config.lang] || "en";
  document.getElementById("lang-current-label").textContent = `🌐 ${config.lang.replace("_", "-")}`;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const val = t(el.getAttribute("data-i18n"));
    if (typeof val === "string") el.textContent = val;
  });
  document.querySelectorAll("[data-i18n-title]").forEach(el => {
    const val = t(el.getAttribute("data-i18n-title"));
    if (typeof val === "string") {
      el.title = val;
      el.setAttribute("aria-label", val);
    }
  });
  const inp = document.getElementById("b-input");
  if (inp) inp.placeholder = t("inputPlaceholder");
  const modeBadge = document.getElementById("mode-badge");
  if (modeBadge) modeBadge.textContent = `${t("mode")}: ${config.instMode}`;
  // Screens that render dynamic text re-render here (each checks it exists).
  ["updateSavedRunBanner", "updateAchCounter", "updateTrialUI", "updateInstallUI", "updateRerollChip"].forEach(fn => {
    if (typeof window[fn] === "function") window[fn]();
  });
  if (typeof renderDepthSpine === "function" && Object.keys(KANKEN_DATA).length) renderDepthSpine();
}
