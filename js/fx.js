let audioCtx = null;
let soundEnabled = localStorage.getItem("kd_sound") !== "off";

function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
  if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  localStorage.setItem("kd_sound", soundEnabled ? "on" : "off");
  document.getElementById("sound-btn").textContent = soundEnabled ? "🔊" : "🔇";
  if (soundEnabled) playClickSfx();
}

function playClickSfx() {
  if (!soundEnabled) return;
  initAudio();
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(520, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(180, audioCtx.currentTime + 0.045);
  gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.045);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.05);
}

function playCardDealSfx(delayMs = 0) {
  if (!soundEnabled) return;
  initAudio();
  if (!audioCtx) return;
  setTimeout(() => {
    const t0 = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(240, t0);
    osc.frequency.exponentialRampToValueAtTime(680, t0 + 0.065);
    gain.gain.setValueAtTime(0.06, t0);
    gain.gain.linearRampToValueAtTime(0.001, t0 + 0.07);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(t0 + 0.075);
  }, delayMs);
}

function playSlashSfx() {
  if (!soundEnabled) return;
  initAudio();
  if (!audioCtx) return;
  const t0 = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(880, t0);
  osc.frequency.exponentialRampToValueAtTime(95, t0 + 0.18);
  gain.gain.setValueAtTime(0.16, t0);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.19);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(t0 + 0.2);
}

function playDamageSfx() {
  if (!soundEnabled) return;
  initAudio();
  if (!audioCtx) return;
  const t0 = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(130, t0);
  osc.frequency.exponentialRampToValueAtTime(42, t0 + 0.24);
  gain.gain.setValueAtTime(0.18, t0);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.25);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(t0 + 0.26);
}

function playGongSfx() {
  if (!soundEnabled) return;
  initAudio();
  if (!audioCtx) return;
  const t0 = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(110, t0);
  osc.frequency.exponentialRampToValueAtTime(82, t0 + 0.9);
  gain.gain.setValueAtTime(0.2, t0);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.95);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(t0 + 1.0);
}

/* Floating Crimson/Gold Ash Particle System */
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
