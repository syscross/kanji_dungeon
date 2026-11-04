/*
 * Effect interpreter shared by spoils and events (spec format: see js/data/events.js).
 * runEffects() works through a queue; a card pick pauses it (persisted in state.pending so a
 * reload can resume), a battle effect hands control to the fight. When the queue empties,
 * the run advances to the next fork.
 */

function runEffects(list) {
  const queue = [...list];
  while (queue.length) {
    if (!state.active) return;
    const fx = queue.shift();

    if (fx.chance !== undefined) {
      const win = Math.random() < fx.chance;
      logMd(win ? t("fxLuckWin") : t("fxLuckLose"), "fx-log");
      queue.unshift(...(win ? fx.win : fx.lose));
    } else if (fx.say) {
      logMd(`*${pickLang(fx.say)}*`, "fx-log");
    } else if (fx.hp !== undefined) {
      changeHp(fx.hp);
    } else if (fx.healPct !== undefined) {
      changeHp(Math.round(state.maxHp * fx.healPct / 100));
    } else if (fx.maxHp !== undefined) {
      changeMaxHp(fx.maxHp);
    } else if (fx.summonReset) {
      state.summonCost = 10;
      logMd(t("fxSummonReset"), "fx-log");
    } else if (fx.tokens !== undefined) {
      state.rerollTokens += fx.tokens;
      logMd(t("fxTokens")(fx.tokens), "fx-log");
    } else if (fx.reveal) {
      state.revealNext = true;
      logMd(t("fxReveal"), "fx-log");
    } else if (fx.addCard) {
      if (fx.addCard === "pick") return beginPick("add", cardChoices(fx.choices || 3), queue);
      const k = fx.addCard === "random" ? cardChoices(1)[0] : fx.addCard;
      addCardToDeck(k);
      logMd(t("fxCardAdd")(k), "fx-log");
    } else if (fx.burn) {
      if (fx.burn === "pick") return beginPick("burn", [...new Set(state.deck)], queue);
      const k = state.deck[Math.floor(Math.random() * state.deck.length)];
      removeCardFromDeck(k);
      logMd(t("fxCardBurn")(k), "fx-log");
    } else if (fx.dup) {
      return beginPick("dup", [...new Set(state.deck)], queue);
    } else if (fx.battle) {
      const rank = fx.battle === "elite" ? "elite" : "normal";
      const forced = ["normal", "elite"].includes(fx.battle) ? null : fx.battle;
      updateBattleHUD(false);
      return startBattle(rank, forced);
    }
  }
  updateBattleHUD(false);
  advance();
}

function changeHp(delta) {
  if (delta >= 0) {
    const before = state.playerHp;
    state.playerHp = Math.min(state.maxHp, state.playerHp + delta);
    logMd(t("fxHeal")(state.playerHp - before), "fx-log");
    if (state.playerHp > before) triggerCombatFX(0, 0, state.playerHp - before);
  } else {
    const before = state.playerHp;
    state.playerHp = Math.max(1, state.playerHp + delta); // events wound, they never kill
    logMd(t("fxDamage")(before - state.playerHp), "fx-log");
    triggerCombatFX(0, before - state.playerHp);
  }
}

function changeMaxHp(delta) {
  state.maxHp = Math.max(20, state.maxHp + delta);
  if (delta > 0) state.playerHp += delta;
  state.playerHp = Math.min(state.playerHp, state.maxHp);
  logMd(delta >= 0 ? t("fxMaxHp")(delta) : t("fxMaxHpDown")(-delta), "fx-log");
}

/* ---- Card picks (pause the queue) ---- */

const PICK_PROMPTS = { add: "pickAddPrompt", burn: "pickBurnPrompt", dup: "pickDupPrompt" };

function beginPick(mode, choices, rest) {
  state.pending = { mode, choices, rest };
  saveRunToStorage();
  updateBattleHUD(false);
  openPendingPick();
}

function openPendingPick() {
  const p = state.pending;
  if (!p) return;
  openPicker({
    title: t(PICK_PROMPTS[p.mode]),
    cards: p.choices,
    locked: true,
    onCard: (k) => resolvePick(k),
    actions: [{ label: t("skipBtn"), onClick: () => resolvePick(null) }]
  });
}

function resolvePick(k) {
  const { mode, rest } = state.pending;
  state.pending = null;
  closePicker();
  if (k) {
    if (mode === "add") { addCardToDeck(k); logMd(t("fxCardAdd")(k), "fx-log"); }
    if (mode === "burn") { removeCardFromDeck(k); logMd(t("fxCardBurn")(k), "fx-log"); }
    if (mode === "dup") { addCardToDeck(k); logMd(t("fxCardDup")(k), "fx-log"); }
  } else {
    logMd(t("fxNothing"), "fx-log");
  }
  runEffects(rest);
}
