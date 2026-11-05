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
    } else if (fx.freeSummons !== undefined || fx.summonReset) {
      const n = typeof fx.freeSummons === "number" ? fx.freeSummons : 1;
      state.freeSummons = (state.freeSummons || 0) + n;
      logMd(t("fxFreeSummons")(n), "fx-log");
    } else if (fx.tokens !== undefined) {
      state.rerollTokens += fx.tokens;
      logMd(t("fxTokens")(fx.tokens), "fx-log");
    } else if (fx.yen !== undefined) {
      if (typeof isStoryMode === "function" && isStoryMode()) {
        const st = ensureStoryConfig();
        st.yen = Math.max(0, (st.yen || 0) + fx.yen);
        persistStoryState();
        logMd(`🪙 ${fx.yen >= 0 ? `+${fx.yen}` : fx.yen} 円`, "fx-log");
      }
    } else if (fx.rescueCat) {
      if (typeof rescueStoryCat === "function") rescueStoryCat();
      logMd(`🐱 **${t("fxCatRescued")}**`, "fx-log");
    } else if (fx.reveal) {
      state.revealNext = true;
      logMd(t("fxReveal"), "fx-log");
    } else if (fx.foeScavenge) {
      const count = typeof fx.foeScavenge === "number" ? fx.foeScavenge : 5;
      return beginPick("foeScavenge", foeScavengeChoices(count), queue);
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
    } else if (fx.fuse) {
      if (state.deck.length < 2) {
        logMd(t("fxNothing"), "fx-log");
        continue;
      }
      return beginPick("fuse", [...state.deck], queue);
    } else if (fx.offerSpoils) {
      updateBattleHUD(false);
      return offerRewards(fx.offerSpoils);
    } else if (fx.bossClear) {
      updateBattleHUD(false);
      return runCleared();
    } else if (fx.returnGaol) {
      updateBattleHUD(false);
      return triggerFormalReturn();
    } else if (fx.ambushNpc) {
      const npcFoe = state.eventNpcKanji || null;
      updateBattleHUD(false);
      return startBattle("normal", npcFoe, { ambush: true });
    } else if (fx.battle) {
      const rank = fx.battle === "elite" ? "elite" : "normal";
      const forced = ["normal", "elite"].includes(fx.battle) ? null : fx.battle;
      const fromEvent = state.phase === "event";
      updateBattleHUD(false);
      return startBattle(rank, forced, { ambush: fromEvent });
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
  fuse: "pickFusePrompt",
  scavenge: "pickScavengePrompt",
  foeScavenge: "pickFoeScavengePrompt"
};

function beginPick(mode, choices, rest, thenEffects = []) {
  if ((mode === "scavenge" || mode === "foeScavenge") && (state.phase === "battle" || state.phase === "path")) {
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
  const isFoe = p.mode === "foeScavenge";
  head.textContent = isFoe
    ? `🩸 ${t("pickFoeScavengePrompt")}`
    : `🎴 ${t("pickScavengePrompt")}`;
  wrap.appendChild(head);

  const grid = document.createElement("div");
  grid.className = "pick-grid scavenge-inline";
  const sel = p.selected || [];

  p.choices.forEach((k, idx) => {
    const tile = document.createElement("button");
    const tier = typeof getKanjiTier === "function" ? getKanjiTier(k) : "edu";
    const isSel = sel.includes(idx);
    const charLen = [...String(k)].length;
    tile.className = `pick-tile tier-${tier}${isSel ? " selected" : ""}${charLen > 1 ? " multi" : ""}${charLen >= 3 ? " multi-long" : ""}`;
    tile.dataset.len = String(Math.min(5, Math.max(1, charLen)));
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

/* Interactive 2-card fusion picker: player selects 1st and 2nd card from their bag to combine into 1 horizontal compound card. */
function renderFusePicker(p) {
  const sel = p.selected || [];
  let desc = t("fuseDescEmpty");
  if (sel.length === 1) {
    desc = t("fuseDescOne")(p.choices[sel[0]]);
  } else if (sel.length === 2) {
    const k1 = p.choices[sel[0]];
    const k2 = p.choices[sel[1]];
    desc = t("fuseDescTwo")(k1, k2, k1 + k2);
  }

  const actions = [];
  if (sel.length === 2) {
    const fused = p.choices[sel[0]] + p.choices[sel[1]];
    actions.push({
      label: t("fuseConfirmBtn")(fused),
      gold: true,
      onClick: () => resolveFusePick(sel)
    });
  }
  actions.push({
    label: t("fuseCancelBtn"),
    onClick: () => cancelPendingPick()
  });

  openPicker({
    title: t("pickFusePrompt"),
    desc,
    cards: p.choices,
    locked: true,
    selectedIndices: sel,
    showOrderBadge: true,
    onCard: (_k, idx) => {
      const cur = p.selected || [];
      if (cur.includes(idx)) {
        p.selected = cur.filter(x => x !== idx);
      } else if (cur.length < 2) {
        p.selected = [...cur, idx];
      } else {
        p.selected = [cur[0], idx];
      }
      saveRunToStorage();
      renderFusePicker(p);
    },
    actions
  });
}

function resolveFusePick(selectedIndices) {
  const { choices, rest } = state.pending;
  state.pending = null;
  closePicker();

  if (Array.isArray(selectedIndices) && selectedIndices.length === 2) {
    const [i1, i2] = selectedIndices;
    const k1 = choices[i1];
    const k2 = choices[i2];
    if (k1 && k2 && i1 !== i2) {
      const fused = k1 + k2;
      // Remove the two chosen cards from state.deck (higher index first so indices don't shift)
      const [hi, lo] = i1 > i2 ? [i1, i2] : [i2, i1];
      if (hi >= 0 && hi < state.deck.length) state.deck.splice(hi, 1);
      if (lo >= 0 && lo < state.deck.length) state.deck.splice(lo, 1);
      addCardToDeck(fused);
      if (typeof playCardDealSfx === "function") playCardDealSfx(0);
      logMd(t("fxCardFuse")(k1, k2, fused), "fx-log");
    } else {
      logMd(t("fxNothing"), "fx-log");
    }
  } else {
    logMd(t("fxNothing"), "fx-log");
  }
  updateBattleHUD(false);
  runEffects(rest);
}

function openPendingPick() {
  const p = state.pending;
  if (!p) return;

  if (p.mode === "scavenge" || p.mode === "foeScavenge") {
    renderInlineScavenge(p);
    return;
  }
  if (p.mode === "fuse") {
    renderFusePicker(p);
    return;
  }

  // Allow backing out to the current Event/Spoil choice list BEFORE picking a card to burn/dup!
  const actions = p.mode === "add"
    ? [{ label: t("skipBtn"), onClick: () => resolvePick(null) }]
    : (p.mode === "burn" || p.mode === "dup")
      ? [{ label: t("fuseCancelBtn"), onClick: () => cancelPendingPick() }]
      : [];

  openPicker({
    title: t(PICK_PROMPTS[p.mode]),
    cards: p.choices,
    locked: true,
    onCard: (k) => resolvePick(k),
    actions
  });
}

function cancelPendingPick() {
  state.pending = null;
  saveRunToStorage();
  closePicker();
  if (state.phase === "event") {
    renderEventOptions();
    return;
  }
  if (state.phase === "reward" && state._lastRewardOffer && state._lastRewardOffer.length) {
    state.offer = [...state._lastRewardOffer];
    saveRunToStorage();
    renderRewardOffer();
    return;
  }
  updateBattleHUD(false);
  advance();
}

function resolveScavengePick(pickedList) {
  const { rest } = state.pending;
  state.pending = null;
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
    if (mode === "dup") {
      addCardToDeck(k);
      logMd(t("fxCardDup")(k), "fx-log");
      if (thenEffects && thenEffects.length) {
        runEffects([...thenEffects, ...rest]);
        return;
      }
    }
  } else {
    logMd(t("fxNothing"), "fx-log");
  }
  updateBattleHUD(false);
  runEffects(rest);
}

