/* Spoils after a won fight or in a treasure room (definitions: js/data/rewards.js). */

function offerRewards(tier) {
  const ids = Object.keys(REWARDS).filter(id => !REWARDS[id].when || REWARDS[id].when(state));
  state.offer = sample(ids, REWARD_OFFER_COUNT).map(id => ({ id, tier, params: REWARDS[id].params[tier] }));
  state.phase = "reward";
  logMd(`🏺 ${t("rewardPrompt")}`, "sys-log");
  saveRunToStorage();
  renderPhase();
}

function rewardLabel(o) {
  const r = REWARDS[o.id];
  return `<span class="opt-kanji">${r.kanji}</span><span class="opt-text">${escapeHtml(pickLang(r.label)(o.params))}</span>`;
}

function renderRewardOffer() {
  if (!state.offer.length) {
    offerRewards(state.enemyRank === "elite" ? "elite" : "normal");
    return;
  }
  setDockActions([
    ...state.offer.map((o, i) => ({ html: rewardLabel(o), onClick: () => chooseReward(i), cls: "opt-btn" })),
    { label: t("skipBtn"), onClick: skipReward, cls: "opt-skip" }
  ]);
}

function rewardEffects(o) {
  const p = o.params;
  switch (o.id) {
    case "heal": return [{ hp: randInt(p.min, p.max) }];
    case "maxhp": return [{ maxHp: p.n }];
    case "summon": return [{ freeSummons: p.n || 1 }];
    case "tokens": return [{ tokens: p.n }];
    case "card": return [{ scavenge: p.choices || 5 }];
    case "burn": return [{ burn: "pick" }];
    case "fuse": return [{ fuse: true }];
    default: return [];
  }
}

function chooseReward(i) {
  playClickSfx();
  const o = state.offer[i];
  if (!o) return;
  state._lastRewardOffer = [...state.offer];
  state.offer = [];
  setDockActions([]);
  logMd(`→ ${REWARDS[o.id].kanji} ${pickLang(REWARDS[o.id].label)(o.params)}`, "choice-log");
  runEffects(rewardEffects(o));
}

function skipReward() {
  playClickSfx();
  state.offer = [];
  logMd(`→ ${t("skipBtn")}`, "choice-log");
  advance();
}
