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

/* Build the 10 environment cards present in the current stage, strictly within the current Kanken grade or lower. */
function buildStageCards(depthId, sign) {
  const maxD = depthNumber(depthId || state.depthId);
  const info = STAGE_SIGNS[sign] || STAGE_SIGNS.田;
  const rawThemed = (info.cards || ["火", "水", "木", "石", "土"]).filter(k => getKanjiDepthNum(k) <= maxD);
  const themed = sample(rawThemed.length ? rawThemed : ["火", "水", "木", "石", "土"], 5);
  const pool = depthPool().filter(k => !themed.includes(k));
  const localGradeCards = sample(pool, 5);
  return shuffle([...themed, ...localGradeCards]);
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
 * - Strictly uses kanji from the current Kanken grade or lower.
 * - When a non-final enemy drops to <= 38% HP, it can telegraph an Escape Intent (e.g. 出/足, 走/帰, 逃/避)!
 */
function dealEnemyHand() {
  const foe = state.enemyKanji;
  const prof = FOE_INTENT_PROFILES[foe];
  const did = state.depthId || "depth_1";
  const maxD = depthNumber(did);

  state.enemyEscapeIntent = false;

  // Low-HP enemy escape intent (triggers once per fight when HP <= 38%, except final step boss)
  const isFinalStepBoss = state.step >= PATH_STEPS && state.enemyRank === "boss";
  if (
    !isFinalStepBoss &&
    state.turn > 1 &&
    state.enemyHp > 0 &&
    state.enemyHp <= Math.ceil(state.enemyMaxHp * 0.38) &&
    !state.enemyEscapeTried &&
    Math.random() < 0.75
  ) {
    state.enemyEscapeTried = true;
    state.enemyEscapeIntent = true;
    const escPool = DEPTH_ESCAPE_INTENTS[did] || ["出", "足"];
    state.enemyHand = [...escPool];
    state.enemyState = t("enemyFleeIntentState");
    return;
  }

  const gradePool = (DEPTH_INTENT_POOLS[did] || ["口", "足", "手", "目"]).filter(k => getKanjiDepthNum(k) <= maxD);

  if (prof && prof.countdown && prof.countdown.length) {
    const seq = prof.countdown.filter(k => getKanjiDepthNum(k) <= maxD);
    const activeSeq = seq.length ? seq : prof.countdown;
    const idx = (Math.max(1, state.turn) - 1) % activeSeq.length;
    const primary = activeSeq[idx];
    const subCandidates = [...new Set([...(prof.normal || []), ...gradePool])]
      .filter(k => k !== primary && getKanjiDepthNum(k) <= maxD);
    const secondary = subCandidates.length ? subCandidates[Math.floor(Math.random() * subCandidates.length)] : null;
    state.enemyHand = secondary ? [primary, secondary] : [primary];
    return;
  }

  if (prof && prof.normal && prof.normal.length) {
    const validNormal = prof.normal.filter(k => getKanjiDepthNum(k) <= maxD);
    const primaryPool = validNormal.length ? validNormal : gradePool;
    const first = primaryPool[Math.floor(Math.random() * primaryPool.length)];
    // Mix 1 foe-specific intent + 1 depth intent pool kanji for variety within the grade
    const secondPool = [...new Set([...validNormal, ...gradePool])].filter(k => k !== first);
    const second = secondPool.length ? secondPool[Math.floor(Math.random() * secondPool.length)] : null;
    state.enemyHand = second ? [first, second] : [first];
    return;
  }

  state.enemyHand = sample(gradePool, 2);
}

function addCardToDeck(k) {
  if (!k) return;
  const clean = String(k).replace(/[^\u4e00-\u9faf\u3400-\u4dbf]/g, "");
  if (clean) state.deck.push(clean);
}

function removeCardFromDeck(k) {
  const i = state.deck.indexOf(k);
  if (i >= 0) state.deck.splice(i, 1);
}

/* Kanji offered by "add a card" effects: mix stage cards and current depth's Kanken grade pool. */
function cardChoices(n) {
  const pool = [...new Set([...(state.stageCards || []), ...depthPool()])];
  const fresh = pool.filter(k => !state.deck.includes(k));
  return sample(fresh.length >= n ? fresh : pool, n);
}

/* Up to 5 cards offered after clearing a stage/fight (enemy kanji + stage cards + depth grade pool, no auto-compounds). */
function scavengeChoices(maxCount = 5) {
  const candidates = [];
  if (state.enemyKanji && !state.deck.includes(state.enemyKanji) && !candidates.includes(state.enemyKanji)) {
    candidates.push(state.enemyKanji);
  }
  const stagePool = [...new Set([...(state.stageCards || []), ...sample(depthPool(), 5)])]
    .filter(k => !candidates.includes(k));
  const pickedStage = sample(stagePool, Math.max(0, maxCount - candidates.length));
  return [...candidates, ...pickedStage].slice(0, maxCount);
}
