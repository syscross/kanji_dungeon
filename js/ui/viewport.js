/*
 * Keeps the app sized to the *visible* viewport so the on-screen keyboard shrinks the
 * layout instead of covering it. Works for:
 *  - Android Chrome (also with `interactive-widget=resizes-content` in the viewport meta),
 *  - iOS Safari (ignores interactive-widget; visualViewport is the only signal),
 *  - mobile "desktop site" mode (fixed 980px layout viewport).
 * Exposes --app-h / --app-top CSS variables and a `kb-open` body class.
 */

function isTextEntryFocused() {
  const el = document.activeElement;
  if (!el) return false;
  if (el.tagName === "TEXTAREA") return true;
  return el.tagName === "INPUT" && !["checkbox", "radio", "button", "submit", "range"].includes(el.type);
}

function setupViewport() {
  const vv = window.visualViewport;
  const root = document.documentElement;
  let raf = 0;

  const update = () => {
    raf = 0;
    const vvShrunk = Boolean(vv && (window.innerHeight - vv.height > 60));
    const kbOpen = (isCoarsePointer() && isTextEntryFocused()) || (vvShrunk && isTextEntryFocused());
    const useVv = Boolean(vv && (kbOpen || vvShrunk));
    const h = useVv ? vv.height : window.innerHeight;
    const top = useVv ? vv.offsetTop : 0;
    root.style.setProperty("--app-h", `${Math.round(h)}px`);
    root.style.setProperty("--app-top", `${Math.round(top)}px`);
    const changed = document.body.classList.contains("kb-open") !== kbOpen;
    document.body.classList.toggle("kb-open", kbOpen);
    if (changed && currentView === "battle") scrollLogToBottom();
  };
  const schedule = () => {
    if (!raf) raf = requestAnimationFrame(update);
  };

  if (vv) {
    vv.addEventListener("resize", schedule);
    vv.addEventListener("scroll", schedule);
  }
  window.addEventListener("resize", schedule);
  window.addEventListener("orientationchange", schedule);
  // Keyboard animation finishes after focus events; re-measure a few times.
  const settle = () => [0, 120, 320, 600].forEach(ms => setTimeout(schedule, ms));
  document.addEventListener("focusin", settle);
  document.addEventListener("focusout", settle);
  update();
}
