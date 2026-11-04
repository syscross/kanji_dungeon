/*
 * One modal for every "choose a kanji" moment:
 *  - Stage card scavenge (multi-select up to 5 cards in a single centered row)
 *  - Spoils / event picks (add / burn / copy)
 *  - Read-only bag (deck) viewer
 */

let pickerOnClose = null;

function openPicker({ title, desc = "", cards, onCard = null, multiSelect = false, selectedIndices = [], showOrderBadge = false, actions = [], locked = false, onClose = null }) {
  const modal = $("pick-modal");
  pickerOnClose = onClose;
  modal.dataset.locked = locked ? "1" : "";
  $("pick-title").textContent = title;
  $("pick-desc").textContent = desc;
  $("pick-desc").style.display = desc ? "" : "none";
  $("pick-close").style.display = locked ? "none" : "";

  const grid = $("pick-grid");
  grid.innerHTML = "";
  grid.classList.toggle("readonly", !onCard && !multiSelect);

  cards.forEach((k, i) => {
    const tile = document.createElement("button");
    const tier = typeof getKanjiTier === "function" ? getKanjiTier(k) : "edu";
    const orderIdx = selectedIndices.indexOf(i);
    const isSel = orderIdx >= 0;
    const charLen = [...String(k)].length;
    tile.className = `pick-tile tier-${tier}${isSel ? " selected" : ""}${charLen > 1 ? " multi" : ""}${charLen >= 3 ? " multi-long" : ""}`;
    if (isSel && showOrderBadge) {
      tile.dataset.order = String(orderIdx + 1);
    }
    tile.textContent = k;
    if (onCard) {
      tile.onclick = () => { playClickSfx(); onCard(k, i, tile); };
    } else {
      tile.disabled = true;
    }
    grid.appendChild(tile);
  });

  const bar = $("pick-actions");
  bar.innerHTML = "";
  actions.forEach(({ label, onClick, gold }) => {
    const b = document.createElement("button");
    b.className = `btn${gold ? " btn-gold" : ""}`;
    b.textContent = label;
    b.onclick = () => { playClickSfx(); onClick(); };
    bar.appendChild(b);
  });
  openModal("pick-modal");
}

/* Programmatic close (after a choice) — does not fire onClose. */
function closePicker() {
  pickerOnClose = null;
  closeModal("pick-modal");
}

/* Player dismissed the picker (✕ / ESC / back). */
function dismissPicker() {
  const cb = pickerOnClose;
  closePicker();
  if (cb) cb();
}

/* ---- Bag (Deck) viewer ---- */

function openDeckViewer() {
  playClickSfx();
  closeDropdowns();
  const sorted = [...state.deck].sort((a, b) => a.localeCompare(b, "ja"));
  const stagePreview = (state.stageCards || []).join(" · ");
  const desc = state.deck.length === 0
    ? t("bagEmptyDesc")(stagePreview)
    : t("bagDesc")(stagePreview);
  openPicker({
    title: t("deckTitle")(state.deck.length),
    desc,
    cards: sorted
  });
}
