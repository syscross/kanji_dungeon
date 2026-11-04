/* Deck, draw pile and discard. A fight starts from a fresh shuffle of the whole deck. */

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function depthPool() {
  return KANKEN_DATA[state.depthId].kanji;
}

function rollDraftOffer() {
  return sample(depthPool(), STARTING_DECK_SIZE);
}

/* Replace one drafted kanji with a pool kanji not already offered. */
function rerollDraftSlot(i) {
  const pool = depthPool().filter(k => !state.draftOffer.includes(k));
  if (pool.length) state.draftOffer[i] = pool[Math.floor(Math.random() * pool.length)];
}

function resetPilesForFight() {
  state.drawPile = shuffle(state.deck);
  state.discard = [];
  state.playerHand = [];
}

/* Discard the current hand and draw a fresh one (reshuffling the discard when needed). */
function drawHand() {
  state.discard.push(...state.playerHand);
  state.playerHand = [];
  while (state.playerHand.length < HAND_SIZE) {
    if (!state.drawPile.length) {
      if (!state.discard.length) break;
      state.drawPile = shuffle(state.discard);
      state.discard = [];
    }
    state.playerHand.push(state.drawPile.pop());
  }
}

function dealEnemyHand() {
  state.enemyHand = sample(depthPool(), HAND_SIZE);
}

function addCardToDeck(k) {
  state.deck.push(k);
}

function removeCardFromDeck(k) {
  const i = state.deck.indexOf(k);
  if (i >= 0) state.deck.splice(i, 1);
}

/* Kanji offered by "add a card" effects: pool kanji, avoiding ones already in the deck when possible. */
function cardChoices(n) {
  const fresh = depthPool().filter(k => !state.deck.includes(k));
  return sample(fresh.length >= n ? fresh : depthPool(), n);
}
