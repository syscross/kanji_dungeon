/* Desktop keyboard navigation: Arrows/WASD + Enter, Alt+1~5 card insert, ESC. */

let kbIndex = 0;

function setupKeyboardNavigation() {
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (document.querySelector(".dropdown.open")) {
        closeDropdowns();
        return;
      }
      if (anyModalOpen()) {
        closeAllModals();
        return;
      }
      if (isTextEntryFocused()) {
        document.activeElement.blur();
        return;
      }
    }

    // Alt + 1~5 inserts a hand card even while typing.
    if (e.altKey && currentView === "battle" && ["1", "2", "3", "4", "5"].includes(e.key)) {
      e.preventDefault();
      const k = state.playerHand[parseInt(e.key, 10) - 1];
      if (k) {
        playClickSfx();
        insertKanji(k);
      }
      return;
    }

    if (anyModalOpen()) return;
    if (currentView === "battle" && state.awaitingNext && e.key === "Enter") {
      e.preventDefault();
      proceedToNextEnemy();
      return;
    }
    if (document.activeElement && ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) return;

    const selector = currentView === "title"
      ? "#view-title .menu-btn"
      : currentView === "select"
      ? "#view-select .abyss-node"
      : "#b-player-hand .kanji-card";
    const items = Array.from(document.querySelectorAll(selector));
    if (!items.length) return;

    if (["ArrowDown", "ArrowRight", "s", "S", "d", "D"].includes(e.key)) {
      e.preventDefault();
      kbIndex = (kbIndex + 1) % items.length;
      highlightKbItem(items);
    } else if (["ArrowUp", "ArrowLeft", "w", "W", "a", "A"].includes(e.key)) {
      e.preventDefault();
      kbIndex = (kbIndex - 1 + items.length) % items.length;
      highlightKbItem(items);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const target = items[kbIndex] || items[0];
      if (target) target.click();
    }
  });
}

function highlightKbItem(items) {
  playClickSfx();
  document.querySelectorAll(".kb-focus").forEach(el => el.classList.remove("kb-focus"));
  const target = items[kbIndex];
  if (target) {
    target.classList.add("kb-focus");
    target.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }
}
