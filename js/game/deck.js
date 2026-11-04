/*
 * Stage cards, player bag (`state.deck`), combined battle draw pile, and Enemy Intent Kanji.
 * Every fight merges `[Current Stage Cards] + [Player's Bag Cards]` into one draw pile
 * and draws 5 cards completely at random without artificial slot forcing.
 */

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function depthPool() {
  return (KANKEN_DATA[state.depthId] && KANKEN_DATA[state.depthId].kanji) || [];
}

/* Build the 8-10 environment cards present in the current stage. */
function buildStageCards(depthId, sign) {
  const info = STAGE_SIGNS[sign] || STAGE_SIGNS.道;
  const themed = info.cards ? sample(info.cards, 6) : ["火", "水", "木", "石", "土", "風"];
  const localClutter = sample(depthPool().filter(k => !themed.includes(k)), 4);
  return shuffle([...themed, ...localClutter]);
}

function resetPilesForFight() {
  state.stageCards = buildStageCards(state.depthId, state.sign);
  const combined = [
    ...state.stageCards.map(kanji => ({ kanji, source: "stage" })),
    ...state.deck.map(kanji => ({ kanji, source: "bag" }))
  ];
  state.drawPile = shuffle(combined);
  state.discard = [];
  state.playerHand = [];
  state.playerHandSources = [];
}

/* Discard the current hand and draw 5 fresh cards purely at random from the combined pile. */
function drawHand() {
  for (let i = 0; i < state.playerHand.length; i++) {
    state.discard.push({
      kanji: state.playerHand[i],
      source: state.playerHandSources[i] || (state.deck.includes(state.playerHand[i]) ? "bag" : "stage")
    });
  }
  state.playerHand = [];
  state.playerHandSources = [];

  while (state.playerHand.length < HAND_SIZE) {
    if (!state.drawPile.length) {
      if (!state.discard.length) break;
      state.drawPile = shuffle(state.discard);
      state.discard = [];
    }
    const drawn = state.drawPile.pop();
    if (!drawn) break;
    const kanji = typeof drawn === "string" ? drawn : drawn.kanji;
    const source = typeof drawn === "string" ? (state.deck.includes(kanji) ? "bag" : "stage") : drawn.source;
    state.playerHand.push(kanji);
    state.playerHandSources.push(source);
  }
}

/*
 * Generate the enemy's telegraphed Intent Kanji (1-2 kanji shown on the enemy bar).
 * Bosses and countdown foes (like 先 with 三 -> 二 -> 一 -> 落) follow ominous patterns.
 */
function dealEnemyHand() {
  const foe = state.enemyKanji;
  const prof = FOE_INTENT_PROFILES[foe];
  const dNum = depthNumber(state.depthId);

  if (prof && prof.countdown && prof.countdown.length) {
    const seq = prof.countdown;
    const idx = (Math.max(1, state.turn) - 1) % seq.length;
    const primary = seq[idx];
    const subPool = (prof.normal || []).filter(k => k !== primary);
    const secondary = subPool.length ? subPool[Math.floor(Math.random() * subPool.length)] : null;
    state.enemyHand = secondary ? [primary, secondary] : [primary];
    return;
  }

  if (prof && prof.normal && prof.normal.length) {
    state.enemyHand = sample(prof.normal, Math.min(2, prof.normal.length));
    return;
  }

  // Fallback by depth tier so deep abyss enemies telegraph horrifying kanji
  const fallbackPool = dNum >= 11
    ? ["噬", "抉", "蹂", "呪", "祟", "裂", "呑", "睨"]
    : dNum >= 7
      ? ["斬", "突", "撃", "呪", "縛", "狂", "刺", "闇"]
      : ["足", "目", "咬", "固", "突", "毒", "打", "落"];
  state.enemyHand = sample(fallbackPool, 2);
}

function addCardToDeck(k) {
  if (k) state.deck.push(k);
}

function removeCardFromDeck(k) {
  const i = state.deck.indexOf(k);
  if (i >= 0) state.deck.splice(i, 1);
}

/* Kanji offered by "add a card" effects: mix stage cards and depth pool. */
function cardChoices(n) {
  const pool = [...new Set([...(state.stageCards || []), ...depthPool()])];
  const fresh = pool.filter(k => !state.deck.includes(k));
  return sample(fresh.length >= n ? fresh : pool, n);
}

/* Up to 5 cards offered after clearing a stage/fight (enemy kanji + stage cards). */
function scavengeChoices(maxCount = 5) {
  const candidates = [];
  if (state.enemyKanji && !state.deck.includes(state.enemyKanji)) {
    candidates.push(state.enemyKanji);
  }
  const stagePool = [...new Set([...(state.stageCards || []), ...sample(depthPool(), 3)])]
    .filter(k => k !== state.enemyKanji);
  const pickedStage = sample(stagePool, maxCount - candidates.length);
  return [...candidates, ...pickedStage].slice(0, maxCount);
}
