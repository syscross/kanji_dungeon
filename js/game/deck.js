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
  return playableDepthPool(state.depthId);
}

/* Build the 10 environment cards present in the current stage, prioritizing the current Kanken grade pool. */
function buildStageCards(depthId, sign) {
  const targetDepth = depthId || state.depthId;
  const maxD = depthNumber(targetDepth);
  const allFoesInDepth = typeof allRosterKanji === "function" ? allRosterKanji(targetDepth) : [];
  const info = STAGE_SIGNS[sign] || STAGE_SIGNS.田;
  const validThemed = (info.cards || ["火", "水", "木", "石", "土"])
    .filter(k => k !== sign && !allFoesInDepth.includes(k) && getKanjiDepthNum(k) <= maxD && isPlayableKanji(k));
  const exactThemed = validThemed.filter(k => getKanjiDepthNum(k) === maxD);
  const fallbackThemed = validThemed.filter(k => getKanjiDepthNum(k) < maxD);
  const themedPicks = [
    ...sample(exactThemed, 5),
    ...sample(fallbackThemed, Math.max(0, 5 - exactThemed.length))
  ].slice(0, 5);
  const themed = themedPicks.length ? themedPicks : sample(depthPool().filter(k => k !== sign && !allFoesInDepth.includes(k)), 5);
  const pool = depthPool().filter(k => k !== sign && !themed.includes(k) && !allFoesInDepth.includes(k));
  const localGradeCards = sample(pool, Math.max(5, 10 - themed.length));
  return shuffle([...themed, ...localGradeCards]).slice(0, 10);
}

function resetPilesForFight() {
  if (!state.stageCards || !state.stageCards.length) {
    state.stageCards = buildStageCards(state.depthId, state.sign);
  }
  const combined = [
    ...state.stageCards.map(kanji => ({ kanji, source: "stage" })),
    ...state.deck.map(kanji => ({ kanji, source: "bag" }))
  ];
  state.drawPile = shuffle(combined);
  state.discard = [];
  state.playerHand = [];
  state.playerHandSources = [];
}

/* Discard the current hand into Left 使用 (`state.discard`) and draw 5 fresh cards from Right 所持 (`state.drawPile`).
 * Whenever Right 所持 runs out, Left 使用 is shuffled back into Right 所持 (Slay the Spire cycle). */
function drawHand() {
  state._reshuffledThisDraw = false;
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
      state._reshuffledThisDraw = true;
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
 * - Prioritizes kanji from the current Kanken grade pool (`getKanjiDepthNum(k) === maxD`).
 * - Computes and locks `state.enemyIntentType` and `state.enemyIntentDesc` so the AI GM never interprets enemy intentions arbitrarily.
 */
function recordSeenEnemyHands() {
  if (!Array.isArray(state.enemyIntentsSeen)) state.enemyIntentsSeen = [];
  (state.enemyHand || []).forEach(k => {
    if (k && !state.enemyIntentsSeen.includes(k)) state.enemyIntentsSeen.push(k);
  });
  if (typeof buildEnemyIntentDetail === "function") {
    const info = buildEnemyIntentDetail(state.enemyKanji, state.enemyHand, state.enemyRank, Boolean(state.enemyEscapeIntent));
    state.enemyIntentType = info.type || "normal_attack";
    state.enemyIntentDesc = info.detail || "";
  }
}

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
    recordSeenEnemyHands();
    return;
  }

  const rawGradePool = (DEPTH_INTENT_POOLS[did] || ["口", "足", "手", "目"]).filter(k => getKanjiDepthNum(k) <= maxD);
  const exactGradePool = rawGradePool.filter(k => getKanjiDepthNum(k) === maxD);
  const gradePool = exactGradePool.length ? exactGradePool : rawGradePool;

  if (prof && prof.countdown && prof.countdown.length) {
    const exactSeq = prof.countdown.filter(k => getKanjiDepthNum(k) === maxD);
    const seq = exactSeq.length ? exactSeq : prof.countdown.filter(k => getKanjiDepthNum(k) <= maxD);
    const activeSeq = seq.length ? seq : prof.countdown;
    const idx = (Math.max(1, state.turn) - 1) % activeSeq.length;
    const primary = activeSeq[idx];
    const allSub = [...new Set([...(prof.normal || []), ...gradePool])].filter(k => k !== primary && getKanjiDepthNum(k) <= maxD);
    const exactSub = allSub.filter(k => getKanjiDepthNum(k) === maxD);
    const subCandidates = exactSub.length ? exactSub : allSub;
    const secondary = subCandidates.length ? subCandidates[Math.floor(Math.random() * subCandidates.length)] : null;
    state.enemyHand = secondary ? [primary, secondary] : [primary];
    recordSeenEnemyHands();
    return;
  }

  if (prof && prof.normal && prof.normal.length) {
    const exactNormal = prof.normal.filter(k => getKanjiDepthNum(k) === maxD);
    const validNormal = exactNormal.length ? exactNormal : prof.normal.filter(k => getKanjiDepthNum(k) <= maxD);
    const primaryPool = validNormal.length ? validNormal : gradePool;
    const first = primaryPool[Math.floor(Math.random() * primaryPool.length)];
    // Mix 1 foe-specific intent + 1 depth intent pool kanji from the current grade
    const allSecond = [...new Set([...validNormal, ...gradePool])].filter(k => k !== first);
    const exactSecond = allSecond.filter(k => getKanjiDepthNum(k) === maxD);
    const secondPool = exactSecond.length ? exactSecond : allSecond;
    const second = secondPool.length ? secondPool[Math.floor(Math.random() * secondPool.length)] : null;
    state.enemyHand = second ? [first, second] : [first];
    recordSeenEnemyHands();
    return;
  }

  state.enemyHand = sample(gradePool, 2);
  recordSeenEnemyHands();
}

function addCardToDeck(k) {
  if (!k) return;
  const clean = String(k).replace(/[^\u4e00-\u9faf\u3400-\u4dbf]/g, "");
  if (clean && isPlayableKanji(clean)) state.deck.push(clean);   // place-name / radical kanji never enter the bag
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

/* Enemy-defeat harvest: strictly offers the slain enemy's kanji + its telegraphed/profile intent kanji! */
function foeScavengeChoices(maxCount = 5) {
  const foe = (state.lastKill && state.lastKill.kanji) || state.enemyKanji;
  const did = state.depthId || "depth_1";
  const maxD = depthNumber(did);
  const candidates = [];

  if (foe && !candidates.includes(foe)) {
    candidates.push(foe);
  }

  // 1. Exact intents the enemy telegraphed during this battle
  const seenIntents = Array.isArray(state.enemyIntentsSeen) ? state.enemyIntentsSeen : (state.enemyHand || []);
  seenIntents.forEach(k => {
    if (k && !candidates.includes(k)) candidates.push(k);
  });

  // 2. Signature intent kanji from this enemy's profile (FOE_INTENT_PROFILES)
  const prof = foe ? FOE_INTENT_PROFILES[foe] : null;
  if (prof) {
    const profCards = [...(prof.normal || []), ...(prof.countdown || [])]
      .filter(k => k && getKanjiDepthNum(k) <= maxD && !candidates.includes(k));
    sample(profCards, Math.max(0, maxCount - candidates.length)).forEach(k => candidates.push(k));
  }

  // 3. Fallback: depth intent pool if still under maxCount
  if (candidates.length < maxCount) {
    const intentPool = (DEPTH_INTENT_POOLS[did] || ["口", "足", "手", "目"])
      .filter(k => k && getKanjiDepthNum(k) <= maxD && !candidates.includes(k));
    sample(intentPool, maxCount - candidates.length).forEach(k => candidates.push(k));
  }

  return candidates.slice(0, maxCount);
}

/* Stage exploration scavenge: strictly offers current stage environment cards (for peaceful stages, caches, or extra exploration). */
function scavengeChoices(maxCount = 5) {
  if (!state.stageCards || !state.stageCards.length) {
    state.stageCards = buildStageCards(state.depthId, state.sign);
  }
  const signDef = STAGE_SIGNS[state.sign] || STAGE_SIGNS.田;
  const maxD = depthNumber(state.depthId);
  const themed = (signDef.cards || []).filter(k => getKanjiDepthNum(k) <= maxD);
  const stagePool = [...new Set([...(state.stageCards || []), ...themed, ...sample(depthPool(), 4)])];
  return sample(stagePool, maxCount);
}
