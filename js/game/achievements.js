/*
 * Achievement catalog, unlock logic, game-event hooks, and the achievements modal.
 * Unlock timestamps live in config.achievements ({ id: epochMs }).
 */

let ACHIEVEMENT_CATALOG = [];
let ACHIEVEMENT_INDEX = {};
let achTab = "common";

function buildAchievementCatalog() {
  const list = COMMON_ACHIEVEMENTS.map(a => ({
    id: a.id, cat: "common", icon: a.icon, name: a.name, desc: () => pickLang(a.desc)
  }));

  Object.keys(KANKEN_DATA).forEach(did => {
    const n = depthNumber(did);
    DEPTH_ACHIEVEMENT_TEMPLATES.forEach(tpl => {
      list.push({
        id: `d${n}_${tpl.key}`, cat: "depth", depthId: did, icon: tpl.icon,
        name: `${depthNumStr(did)} ${depthShortName(did)} · ${tpl.name}`,
        desc: () => t(tpl.descKey)(`${depthNumStr(did)} ${depthShortName(did)}`)
      });
    });
  });

  Object.keys(KANKEN_DATA).forEach(did => {
    KANKEN_DATA[did].enemies.forEach(k => {
      list.push({
        id: `boss_${k}`, cat: "boss", depthId: did, kanji: k, icon: "📕",
        name: `【${k}】`, desc: () => KANKEN_DATA[did].title
      });
    });
  });

  ACHIEVEMENT_CATALOG = list;
  ACHIEVEMENT_INDEX = Object.fromEntries(list.map(a => [a.id, a]));
}

function findAchievement(id) {
  return ACHIEVEMENT_INDEX[id] || null;
}

function migrateLegacyAchievements() {
  let changed = false;
  Object.entries(LEGACY_ACHIEVEMENT_MAP).forEach(([oldId, newIds]) => {
    const ts = config.achievements[oldId];
    if (!ts) return;
    newIds.forEach(id => {
      if (!config.achievements[id]) config.achievements[id] = ts;
    });
    delete config.achievements[oldId];
    changed = true;
  });
  if (changed) persistAchievements();
}

/* Unlocks that happen in the same tick (e.g. a kill) are merged into one toast. */
const achToastQueue = [];
let achToastBusy = false;

function queueAchToast(text) {
  achToastQueue.push(text);
  if (!achToastBusy) {
    achToastBusy = true;
    setTimeout(drainAchToasts, 0);
  }
}

function drainAchToasts() {
  if (!achToastQueue.length) {
    achToastBusy = false;
    return;
  }
  const batch = achToastQueue.splice(0);
  const shown = batch.slice(0, 3).join("\n");
  const toast = $("ach-toast");
  toast.textContent = batch.length > 3 ? `${shown}\n+${batch.length - 3}` : shown;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(drainAchToasts, 350);
  }, 2400 + Math.min(batch.length, 3) * 400);
}

function unlockAchievement(id) {
  const ach = findAchievement(id);
  if (!ach) return false;
  if (!state.runAchievements.includes(id)) state.runAchievements.push(id);
  if (config.achievements[id]) return false;

  config.achievements[id] = Date.now();
  persistAchievements();
  updateAchCounter();
  queueAchToast(ach.cat === "boss"
    ? `📕 ${t("bossRecorded")}: ${ach.name}`
    : `🏆 ${t("achUnlocked")}: ${ach.icon} ${ach.name}`);
  return true;
}

function countUnlocked(cat = null) {
  return ACHIEVEMENT_CATALOG.filter(a => (!cat || a.cat === cat) && config.achievements[a.id]).length;
}

function updateAchCounter() {
  const badge = $("ach-count");
  if (badge) badge.textContent = countUnlocked();
}

/* ---- Game event hooks ---- */

function achOnRunStart(depthId) {
  if (depthId === "depth_12") unlockAchievement("abyss_12");
}

function achOnCommand(type) {
  if (type === "HINT" || type === "PROMPT") unlockAchievement("scholar");
  if (type === "REROLL") unlockAchievement("gambler");
  if (type === "SUMMON") unlockAchievement("summoner");
}

function achOnTurnJudged(j) {
  if (j.verdict === "FIZZLE") unlockAchievement("fizzle");
  if (j.verdict === "CLEVER" || j.verdict === "MASTERFUL") unlockAchievement("clever");
  if (j.verdict === "MASTERFUL") unlockAchievement("masterful");
  const goodVerdict = ["SOLID", "CLEVER", "MASTERFUL"].includes(j.verdict);
  if (goodVerdict && state.playerHand.length === 5 && state.playerHand.every(k => j.used.includes(k))) {
    unlockAchievement("full_hand");
  }
  if (j.playerHeal >= 30) unlockAchievement("healer");
}

function achOnEnemyDefeated({ kanji, depthId, turn, dmgTaken, playerHp, streak }) {
  const n = depthNumber(depthId);
  config.stats.kills = (config.stats.kills || 0) + 1;
  persistStats();

  unlockAchievement("first_blood");
  unlockAchievement(`boss_${kanji}`);
  unlockAchievement(`d${n}_kill`);

  if (dmgTaken === 0) {
    unlockAchievement("flawless");
    unlockAchievement(`d${n}_flawless`);
  }
  if (turn === 1) unlockAchievement("one_turn");
  if (playerHp <= 15) unlockAchievement("comeback");
  if (streak >= 5) {
    unlockAchievement("streak_5");
    unlockAchievement(`d${n}_streak`);
  }
  if (streak >= 10) unlockAchievement("streak_10");
  if (streak >= 20) unlockAchievement("streak_20");
  if (config.stats.kills >= 100) unlockAchievement("kills_100");
  if (countUnlocked("boss") >= 50) unlockAchievement("bestiary_50");

  if (KANKEN_DATA[depthId].enemies.every(k => config.achievements[`boss_${k}`])) {
    unlockAchievement(`d${n}_purge`);
  }
  if (Object.keys(KANKEN_DATA).every(did => config.achievements[`d${depthNumber(did)}_kill`])) {
    unlockAchievement("all_depths");
  }
}

/* ---- Modal ---- */

function openAchievementsModal() {
  playClickSfx();
  renderAchievementsModal();
  openModal("ach-modal");
}

function setAchTab(tab) {
  playClickSfx();
  achTab = tab;
  renderAchievementsModal();
}

function achItemHtml(a) {
  const unlocked = Boolean(config.achievements[a.id]);
  return `<div class="ach-item${unlocked ? " unlocked" : ""}">
    <div class="ach-name">${a.icon} ${escapeHtml(a.name)} ${unlocked ? "✓" : "🔒"}</div>
    <div class="ach-desc">${escapeHtml(a.desc())}</div>
  </div>`;
}

function renderAchievementsModal() {
  const cats = [
    { key: "common", label: t("achTabCommon") },
    { key: "depth", label: t("achTabDepth") },
    { key: "boss", label: t("achTabBoss") }
  ];
  $("ach-tabs").innerHTML = cats.map(c => {
    const total = ACHIEVEMENT_CATALOG.filter(a => a.cat === c.key).length;
    return `<button class="tab-btn${achTab === c.key ? " active" : ""}" onclick="setAchTab('${c.key}')">
      ${escapeHtml(c.label)} <small>${countUnlocked(c.key)}/${total}</small></button>`;
  }).join("");

  const body = $("ach-body");
  const items = ACHIEVEMENT_CATALOG.filter(a => a.cat === achTab);

  if (achTab === "common") {
    body.innerHTML = `<div class="ach-grid">${items.map(achItemHtml).join("")}</div>`;
  } else if (achTab === "depth") {
    body.innerHTML = Object.keys(KANKEN_DATA).map(did => `
      <div class="ach-group">
        <div class="ach-group-title">${escapeHtml(KANKEN_DATA[did].title)}</div>
        <div class="ach-grid compact">${items.filter(a => a.depthId === did).map(achItemHtml).join("")}</div>
      </div>`).join("");
  } else {
    body.innerHTML = `<p class="ach-hint">${escapeHtml(t("bestiaryHint"))}</p>` +
      Object.keys(KANKEN_DATA).map(did => {
        const tiles = items.filter(a => a.depthId === did).map(a => {
          const ts = config.achievements[a.id];
          const date = ts ? new Date(ts).toLocaleDateString() : "";
          return `<div class="boss-tile${ts ? " seen" : ""}" title="${escapeHtml(date)}">${escapeHtml(a.kanji)}</div>`;
        }).join("");
        const seen = items.filter(a => a.depthId === did && config.achievements[a.id]).length;
        const total = items.filter(a => a.depthId === did).length;
        return `<div class="ach-group">
          <div class="ach-group-title">${escapeHtml(KANKEN_DATA[did].title)} <small>${seen}/${total}</small></div>
          <div class="boss-grid">${tiles}</div>
        </div>`;
      }).join("");
  }
  body.scrollTop = 0;
}
