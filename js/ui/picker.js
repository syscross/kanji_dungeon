/*
 * One modal for every "choose a kanji" moment: the starting-deck draft, spoils/event picks
 * (add / burn / copy), and the read-only deck viewer.
 *
 * openPicker({ title, desc, cards, onCard, actions, locked, onClose })
 *   cards   — kanji strings (duplicates allowed)
 *   onCard  — (kanji, index) => void; omit for read-only
 *   actions — [{ label, onClick, gold }]
 *   locked  — true: ✕ / ESC / back cannot close it (a choice is required)
 *   onClose — called when the player dismisses it with ✕ / ESC / back
 */

let pickerOnClose = null;

function openPicker({ title, desc = "", cards, onCard = null, actions = [], locked = false, onClose = null }) {
  const modal = $("pick-modal");
  pickerOnClose = onClose;
  modal.dataset.locked = locked ? "1" : "";
  $("pick-title").textContent = title;
  $("pick-desc").textContent = desc;
  $("pick-desc").style.display = desc ? "" : "none";
  $("pick-close").style.display = locked ? "none" : "";

  const grid = $("pick-grid");
  grid.innerHTML = "";
  grid.classList.toggle("readonly", !onCard);
  cards.forEach((k, i) => {
    const tile = document.createElement("button");
    tile.className = "pick-tile";
    tile.textContent = k;
    tile.classList.toggle("multi", [...k].length > 1);
    if (onCard) tile.onclick = () => { playClickSfx(); onCard(k, i); };
    else tile.disabled = true;
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

/* ---- Starting deck draft ---- */

function openDraftPicker() {
  openPicker({
    title: t("draftTitle"),
    desc: t("draftDesc"),
    cards: state.draftOffer,
    onClose: cancelDraft,
    actions: [
      { label: t("draftReroll"), onClick: () => { state.draftOffer = rollDraftOffer(); saveRunToStorage(); openDraftPicker(); } },
      { label: t("draftConfirm"), gold: true, onClick: confirmDraft }
    ]
  });
}

/* ---- Deck viewer ---- */

function openDeckViewer() {
  playClickSfx();
  closeDropdowns();
  const sorted = [...state.deck].sort((a, b) => a.localeCompare(b, "ja"));
  openPicker({ title: t("deckTitle")(state.deck.length), cards: sorted });
}
