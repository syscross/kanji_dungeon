/*
 * Atmospheric background canvas:
 *  - Drifting ash & smoldering cinder embers with organic wind sway
 *  - Faint, ghostly calligraphic kanji silhouettes rising through the dark mist
 */
function startEmberCanvas() {
  const canvas = document.getElementById("ember-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w = (canvas.width = window.innerWidth);
  let h = (canvas.height = window.innerHeight);
  window.addEventListener("resize", () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });

  const AMBIENT_KANJI = ["獄", "斬", "鬼", "魂", "影", "血", "呪", "封", "闇", "骨", "滅", "業", "淵", "夜", "刃"];
  const GHOST_FONTS = [
    '900 48px "Noto Serif JP", serif',
    '900 64px "Noto Serif JP", serif',
    '900 80px "Noto Serif JP", serif'
  ];

  function pickGhostKanji() {
    return AMBIENT_KANJI[Math.floor(Math.random() * AMBIENT_KANJI.length)];
  }

  const embers = Array.from({ length: 28 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 2.1 + 0.5,
    vy: -(Math.random() * 0.55 + 0.18),
    vx: (Math.random() - 0.5) * 0.3,
    phase: Math.random() * Math.PI * 2,
    swaySpeed: Math.random() * 0.025 + 0.01,
    alpha: Math.random() * 0.48 + 0.12,
    tone: Math.random() > 0.72 ? "gold" : Math.random() > 0.35 ? "crimson" : "ash"
  }));

  const ghosts = Array.from({ length: 5 }, (_, i) => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vy: -(Math.random() * 0.25 + 0.1),
    font: GHOST_FONTS[i % GHOST_FONTS.length],
    alpha: (Math.random() * 0.028 + 0.012).toFixed(3),
    char: pickGhostKanji()
  }));

  let lastFrame = 0;
  const FRAME_INTERVAL = 42; // ~24 fps atmospheric cadence

  function step(now) {
    requestAnimationFrame(step);
    if (document.hidden) return;
    if (now - lastFrame < FRAME_INTERVAL) return;
    lastFrame = now;

    ctx.clearRect(0, 0, w, h);

    // 1. Faint ghostly kanji watermarks (only on Title / Records views; Battle view covers the background)
    const inBattle = typeof currentView !== "undefined" && currentView === "battle";
    if (!inBattle) {
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (const g of ghosts) {
        g.y += g.vy;
        if (g.y < -80) {
          g.y = h + 80;
          g.x = Math.random() * w;
          g.char = pickGhostKanji();
        }
        ctx.font = g.font;
        ctx.fillStyle = `rgba(215, 58, 73, ${g.alpha})`;
        ctx.fillText(g.char, g.x, g.y);
      }
    }

    // 2. Smoldering embers and drifting ash
    const emberLimit = inBattle ? 14 : embers.length;
    for (let i = 0; i < emberLimit; i++) {
      const p = embers[i];
      p.phase += p.swaySpeed;
      p.x += p.vx + Math.sin(p.phase) * 0.28;
      p.y += p.vy;
      if (p.y < -12) {
        p.y = h + 12;
        p.x = Math.random() * w;
      }
      const flicker = p.alpha * (0.75 + 0.25 * Math.sin(p.phase * 2.3));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      if (p.tone === "gold") {
        ctx.fillStyle = `rgba(229, 192, 123, ${flicker})`;
      } else if (p.tone === "crimson") {
        ctx.fillStyle = `rgba(215, 58, 73, ${flicker})`;
      } else {
        ctx.fillStyle = `rgba(160, 155, 165, ${flicker * 0.65})`;
      }
      ctx.fill();
    }
  }
  requestAnimationFrame(step);
}
