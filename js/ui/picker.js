/*
 * One modal for every "choose a kanji" moment: the starting-deck draft, spoils/event picks
 * (add / burn / copy), and the read-only deck viewer.
 *
 * openPicker({ title, desc, cards, onCard, actions, locked })
 *   cards   — kanji strings (duplicates allowed)
 *   onCard  — (kanji, index) => void; omit for read-only
 *   actions — [{ label, onClick, gold }]
 *   locked  — true: ✕ / ESC / back cannot close it (a choice is required)
 */

function openPicker({ title, desc = "", cards, onCard = null, actions = [], locked = false }) {
  const modal = $("pick-modal");
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

function closePicker() {
  closeModal("pick-modal");
}

/* ---- Starting deck draft ---- */

function openDraftPicker() {
  openPicker({
    title: t("draftTitle"),
    desc: t("draftDesc"),
    cards: state.draftOffer,
    locked: true,
    onCard: (_, i) => {
      rerollDraftSlot(i);
      saveRunToStorage();
      openDraftPicker();
    },
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
