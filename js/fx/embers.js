/* Floating ember particles on the background canvas. */
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

  const particles = Array.from({ length: 34 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 2.1 + 0.6,
    vy: -(Math.random() * 0.45 + 0.15),
    vx: (Math.random() - 0.5) * 0.3,
    alpha: Math.random() * 0.55 + 0.15,
    gold: Math.random() > 0.65
  }));

  function step() {
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -10) {
        p.y = h + 10;
        p.x = Math.random() * w;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.gold
        ? `rgba(229, 192, 123, ${p.alpha})`
        : `rgba(215, 58, 73, ${p.alpha})`;
      ctx.fill();
    }
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
