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

  function pickGhostKanji() {
    if (typeof state !== "undefined" && state && state.active && typeof KANKEN_DATA !== "undefined" && KANKEN_DATA[state.depthId]) {
      const pool = KANKEN_DATA[state.depthId].kanji;
      if (pool && pool.length) return pool[Math.floor(Math.random() * pool.length)];
    }
    return AMBIENT_KANJI[Math.floor(Math.random() * AMBIENT_KANJI.length)];
  }

  const embers = Array.from({ length: 44 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 2.2 + 0.5,
    vy: -(Math.random() * 0.42 + 0.12),
    vx: (Math.random() - 0.5) * 0.25,
    phase: Math.random() * Math.PI * 2,
    swaySpeed: Math.random() * 0.018 + 0.006,
    alpha: Math.random() * 0.5 + 0.12,
    tone: Math.random() > 0.72 ? "gold" : Math.random() > 0.35 ? "crimson" : "ash"
  }));

  const ghosts = Array.from({ length: 7 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vy: -(Math.random() * 0.18 + 0.06),
    size: Math.floor(Math.random() * 54 + 44),
    alpha: Math.random() * 0.032 + 0.012,
    char: pickGhostKanji()
  }));

  function step() {
    ctx.clearRect(0, 0, w, h);

    // 1. Faint ghostly kanji watermarks drifting in the abyss
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (const g of ghosts) {
      g.y += g.vy;
      if (g.y < -80) {
        g.y = h + 80;
        g.x = Math.random() * w;
        g.char = pickGhostKanji();
      }
      ctx.font = `900 ${g.size}px "Noto Serif JP", serif`;
      ctx.fillStyle = `rgba(215, 58, 73, ${g.alpha})`;
      ctx.fillText(g.char, g.x, g.y);
    }

    // 2. Smoldering embers and drifting ash
    for (const p of embers) {
      p.phase += p.swaySpeed;
      p.x += p.vx + Math.sin(p.phase) * 0.22;
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
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
