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
  const targetDepth = depthId || state.depthId;
  const maxD = depthNumber(targetDepth);
  const allFoesInDepth = typeof allRosterKanji === "function" ? allRosterKanji(targetDepth) : [];
  const info = STAGE_SIGNS[sign] || STAGE_SIGNS.田;
  const rawThemed = (info.cards || ["火", "水", "木", "石", "土"])
    .filter(k => k !== sign && !allFoesInDepth.includes(k) && getKanjiDepthNum(k) <= maxD);
  const themed = sample(rawThemed.length ? rawThemed : ["火", "水", "土", "風", "光"], 5);
  const pool = depthPool().filter(k => k !== sign && !themed.includes(k) && !allFoesInDepth.includes(k));
  const localGradeCards = sample(pool, 5);
  return shuffle([...themed, ...localGradeCards]);
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
    recordSeenEnemyHands();
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
    recordSeenEnemyHands();
    return;
  }

  state.enemyHand = sample(gradePool, 2);
  recordSeenEnemyHands();
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
