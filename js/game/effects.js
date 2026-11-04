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
    } else if (fx.scavenge) {
      const count = typeof fx.scavenge === "number" ? fx.scavenge : 5;
      return beginPick("scavenge", scavengeChoices(count), queue);
    } else if (fx.addCard) {
      if (fx.addCard === "pick") return beginPick("add", cardChoices(Math.min(5, fx.choices || 4)), queue);
      const k = fx.addCard === "random" ? cardChoices(1)[0] : fx.addCard;
      addCardToDeck(k);
      logMd(t("fxCardAdd")(k), "fx-log");
    } else if (fx.burn) {
      if (!state.deck.length) {
        logMd(t("fxNothing"), "fx-log");
        continue;
      }
      return beginPick("burn", [...new Set(state.deck)], queue, fx.then || []);
    } else if (fx.dup) {
      if (!state.deck.length) {
        logMd(t("fxNothing"), "fx-log");
        continue;
      }
      return beginPick("dup", [...new Set(state.deck)], queue);
    } else if (fx.offerSpoils) {
      updateBattleHUD(false);
      return offerRewards(fx.offerSpoils);
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

const PICK_PROMPTS = {
  add: "pickAddPrompt",
  burn: "pickBurnPrompt",
  dup: "pickDupPrompt",
  scavenge: "pickScavengePrompt"
};

function beginPick(mode, choices, rest, thenEffects = []) {
  if (mode === "scavenge" && (state.phase === "battle" || state.phase === "path")) {
    state.phase = "reward";
  }
  state.pending = { mode, choices, selected: [], rest, thenEffects };
  saveRunToStorage();
  const view = $("view-battle");
  if (view) view.classList.add("intermission");
  updateBattleHUD(false);
  openPendingPick();
}

/* Render post-battle / peaceful stage scavenging directly in the bottom dock (#b-dock-action) so the GM log stays visible! */
function renderInlineScavenge(p) {
  closePicker();
  const box = $("b-dock-action");
  if (!box) return;
  box.innerHTML = "";

  const wrap = document.createElement("div");
  wrap.className = "scavenge-dock";

  const head = document.createElement("div");
  head.className = "scavenge-dock-head";
  head.textContent = `🎴 ${t("pickScavengePrompt")} — ${t("pickScavengeDesc")}`;
  wrap.appendChild(head);

  const grid = document.createElement("div");
  grid.className = "pick-grid scavenge-inline";
  const sel = p.selected || [];

  p.choices.forEach((k, idx) => {
    const tile = document.createElement("button");
    const tier = typeof getKanjiTier === "function" ? getKanjiTier(k) : "edu";
    const isSel = sel.includes(idx);
    tile.className = `pick-tile tier-${tier}${isSel ? " selected" : ""}${[...k].length > 1 ? " multi" : ""}`;
    tile.textContent = k;
    tile.onclick = () => {
      playClickSfx();
      const cur = p.selected || [];
      if (cur.includes(idx)) p.selected = cur.filter(x => x !== idx);
      else p.selected = [...cur, idx];
      saveRunToStorage();
      renderInlineScavenge(p);
    };
    grid.appendChild(tile);
  });
  wrap.appendChild(grid);

  const btnRow = document.createElement("div");
  btnRow.className = "scavenge-dock-btns";

  if (sel.length > 0) {
    const takeBtn = document.createElement("button");
    takeBtn.className = "btn btn-gold";
    takeBtn.textContent = t("scavengeTakeBtn")(sel.length);
    takeBtn.onclick = () => {
      playClickSfx();
      resolveScavengePick(sel.map(i => p.choices[i]));
    };
    btnRow.appendChild(takeBtn);
  } else {
    const takeAllBtn = document.createElement("button");
    takeAllBtn.className = "btn btn-gold";
    takeAllBtn.textContent = t("scavengeTakeAllBtn")(p.choices.length);
    takeAllBtn.onclick = () => {
      playClickSfx();
      resolveScavengePick([...p.choices]);
    };
    btnRow.appendChild(takeAllBtn);
  }

  const skipBtn = document.createElement("button");
  skipBtn.className = "btn";
  skipBtn.textContent = t("scavengeLeaveBtn");
  skipBtn.onclick = () => {
    playClickSfx();
    resolveScavengePick([]);
  };
  btnRow.appendChild(skipBtn);

  wrap.appendChild(btnRow);
  box.appendChild(wrap);
  scrollLogToBottom();
}

function openPendingPick() {
  const p = state.pending;
  if (!p) return;

  if (p.mode === "scavenge") {
    renderInlineScavenge(p);
    return;
  }

  // Note: "burn" and "dup" do NOT show a free Skip button that bypasses the cost!
  const actions = p.mode === "add"
    ? [{ label: t("skipBtn"), onClick: () => resolvePick(null) }]
    : [];

  openPicker({
    title: t(PICK_PROMPTS[p.mode]),
    cards: p.choices,
    locked: true,
    onCard: (k) => resolvePick(k),
    actions
  });
}

function resolveScavengePick(pickedList) {
  const { rest } = state.pending;
  state.pending = null;
  state.lastComboKanji = null;
  setDockActions([]);
  if (pickedList && pickedList.length) {
    pickedList.forEach(k => addCardToDeck(k));
    logMd(t("fxCardAdd")(pickedList.join(" · ")), "fx-log");
  } else {
    logMd(t("fxNothing"), "fx-log");
  }
  updateBattleHUD(false);
  runEffects(rest);
}

function resolvePick(k) {
  const { mode, rest, thenEffects } = state.pending;
  state.pending = null;
  closePicker();
  if (k) {
    if (mode === "add") { addCardToDeck(k); logMd(t("fxCardAdd")(k), "fx-log"); }
    if (mode === "burn") {
      removeCardFromDeck(k);
      logMd(t("fxCardBurn")(k), "fx-log");
      if (thenEffects && thenEffects.length) {
        runEffects([...thenEffects, ...rest]);
        return;
      }
    }
    if (mode === "dup") { addCardToDeck(k); logMd(t("fxCardDup")(k), "fx-log"); }
  } else {
    logMd(t("fxNothing"), "fx-log");
  }
  updateBattleHUD(false);
  runEffects(rest);
}
