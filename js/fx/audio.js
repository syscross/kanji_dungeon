/*
 * Procedural Dark Eastern Ritual / Sekiro-inspired Web Audio Synthesizer (zero external audio files).
 * Features:
 *  - Pre-warmed ConvolverNode + continuous silent keep-alive so the first attack after an AI wait NEVER pops or cuts off.
 *  - Master DynamicsCompressorNode limiter + 14ms lookahead scheduling + micro-attack ramps on all oscillators.
 *  - Global interactive element sound delegation so no button, modal, or navigation action is ever silent.
 */
let audioCtx = null;
let noiseBuf = null;
let reverbNode = null;
let masterBus = null;
let lastSfxStamp = 0;
let soundEnabled = localStorage.getItem("kd_sound") !== "off";

function markSfxPlayed() {
  lastSfxStamp = performance.now();
}

function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    audioCtx = new AudioContext();

    // Master brickwall compressor/limiter so overlapping hits or reverb never clip or pop
    const limiter = audioCtx.createDynamicsCompressor();
    limiter.threshold.value = -5;
    limiter.knee.value = 6;
    limiter.ratio.value = 14;
    limiter.attack.value = 0.002;
    limiter.release.value = 0.12;
    limiter.connect(audioCtx.destination);

    masterBus = audioCtx.createGain();
    masterBus.gain.value = 0.88;
    masterBus.connect(limiter);

    // Pre-generate 2 seconds of organic pink/brown-tinted noise for blade wind, paper, wood & breath
    const sr = audioCtx.sampleRate;
    noiseBuf = audioCtx.createBuffer(1, sr * 2, sr);
    const data = noiseBuf.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.997 * b0 + white * 0.029;
      b1 = 0.985 * b1 + white * 0.032;
      b2 = 0.950 * b2 + white * 0.048;
      data[i] = (b0 + b1 + b2 + white * 0.18) * 0.55;
    }

    // Subterranean stone shrine impulse response (1.5s dark tail, smoothly tapered at start & end)
    try {
      const len = Math.floor(sr * 1.5);
      const imp = audioCtx.createBuffer(2, len, sr);
      for (let ch = 0; ch < 2; ch++) {
        const c = imp.getChannelData(ch);
        for (let i = 0; i < len; i++) {
          const fadeIn = Math.min(1, i / (sr * 0.008));
          const env = Math.pow(1 - i / len, 2.8) * fadeIn;
          c[i] = (Math.random() * 2 - 1) * env * 0.32;
        }
      }
      reverbNode = audioCtx.createConvolver();
      reverbNode.buffer = imp;
      const revFilter = audioCtx.createBiquadFilter();
      revFilter.type = "lowpass";
      revFilter.frequency.value = 1400;
      const revGain = audioCtx.createGain();
      revGain.gain.value = 0.25;
      reverbNode.connect(revFilter);
      revFilter.connect(revGain);
      revGain.connect(masterBus);
    } catch (_) {
      reverbNode = null;
    }

    // Continuous ultra-quiet keep-alive through reverb & masterBus so mobile/desktop DACs
    // and the ConvolverNode FFT buffers never cold-stall after waiting for AI network calls!
    try {
      const keepAlive = audioCtx.createOscillator();
      const kaGain = audioCtx.createGain();
      keepAlive.type = "sine";
      keepAlive.frequency.value = 30;
      kaGain.gain.value = 0.000015;
      keepAlive.connect(kaGain);
      kaGain.connect(masterBus);
      if (reverbNode) kaGain.connect(reverbNode);
      keepAlive.start();
    } catch (_) {}
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
}

function nowTime() {
  // 14ms lookahead prevents main-thread jitter from cutting off the attack transient
  return audioCtx ? audioCtx.currentTime + 0.014 : 0;
}

function connectOut(node, wet = 0.2) {
  if (!masterBus) return;
  node.connect(masterBus);
  if (reverbNode && wet > 0) {
    const send = audioCtx.createGain();
    send.gain.value = wet;
    node.connect(send);
    send.connect(reverbNode);
  }
}

function syncSoundBtn() {
  const topBtn = document.getElementById("sound-btn");
  if (topBtn) topBtn.textContent = soundEnabled ? "🔊" : "🔇";
  const modalBtn = document.getElementById("sound-toggle-btn");
  if (modalBtn) modalBtn.textContent = soundEnabled ? "🔊 ON" : "🔇 OFF";
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  localStorage.setItem("kd_sound", soundEnabled ? "on" : "off");
  syncSoundBtn();
  if (soundEnabled) playClickSfx();
}

/* Dry wooden fuda / stone seal tap */
function playClickSfx() {
  if (!soundEnabled) return;
  initAudio();
  if (!audioCtx || !noiseBuf) return;
  markSfxPlayed();
  const t0 = nowTime();

  // 1. Crisp wooden/bone talisman transient
  const src = audioCtx.createBufferSource();
  src.buffer = noiseBuf;
  const bp = audioCtx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.setValueAtTime(1620, t0);
  bp.Q.value = 3.0;
  const nGain = audioCtx.createGain();
  nGain.gain.setValueAtTime(0.0001, t0);
  nGain.gain.linearRampToValueAtTime(0.14, t0 + 0.003);
  nGain.gain.exponentialRampToValueAtTime(0.0008, t0 + 0.026);
  src.connect(bp);
  bp.connect(nGain);
  connectOut(nGain, 0.08);
  src.start(t0, Math.random() * 0.5, 0.035);

  // 2. Muted dark wood body thud
  const osc = audioCtx.createOscillator();
  const oGain = audioCtx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(124, t0);
  osc.frequency.exponentialRampToValueAtTime(52, t0 + 0.032);
  oGain.gain.setValueAtTime(0.0001, t0);
  oGain.gain.linearRampToValueAtTime(0.095, t0 + 0.003);
  oGain.gain.exponentialRampToValueAtTime(0.0008, t0 + 0.036);
  osc.connect(oGain);
  connectOut(oGain, 0.05);
  osc.start(t0);
  osc.stop(t0 + 0.04);
}

/* Heavy wooden shrine gate / sliding door resonance (used on Title/Select view transitions & modals) */
function playGateSlideSfx() {
  if (!soundEnabled) return;
  initAudio();
  if (!audioCtx || !noiseBuf) return;
  markSfxPlayed();
  const t0 = nowTime();

  // 1. Wooden sliding friction noise
  const slide = audioCtx.createBufferSource();
  slide.buffer = noiseBuf;
  const bp = audioCtx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.setValueAtTime(420, t0);
  bp.frequency.exponentialRampToValueAtTime(210, t0 + 0.22);
  bp.Q.value = 2.6;
  const sGain = audioCtx.createGain();
  sGain.gain.setValueAtTime(0.0001, t0);
  sGain.gain.linearRampToValueAtTime(0.14, t0 + 0.025);
  sGain.gain.exponentialRampToValueAtTime(0.0008, t0 + 0.24);
  slide.connect(bp);
  bp.connect(sGain);
  connectOut(sGain, 0.28);
  slide.start(t0, Math.random() * 0.6, 0.26);

  // 2. Low wooden latch thud
  const latch = audioCtx.createOscillator();
  const lGain = audioCtx.createGain();
  latch.type = "triangle";
  latch.frequency.setValueAtTime(92, t0 + 0.02);
  latch.frequency.exponentialRampToValueAtTime(38, t0 + 0.18);
  lGain.gain.setValueAtTime(0.0001, t0 + 0.02);
  lGain.gain.linearRampToValueAtTime(0.14, t0 + 0.03);
  lGain.gain.exponentialRampToValueAtTime(0.0008, t0 + 0.2);
  latch.connect(lGain);
  connectOut(lGain, 0.22);
  latch.start(t0 + 0.02);
  latch.stop(t0 + 0.22);
}

/* Ofuda paper talisman slide / calligraphy brush whisper */
function playCardDealSfx(delayMs = 0) {
  if (!soundEnabled) return;
  initAudio();
  if (!audioCtx || !noiseBuf) return;
  markSfxPlayed();
  setTimeout(() => {
    if (!soundEnabled || !audioCtx) return;
    const t0 = nowTime();

    const src = audioCtx.createBufferSource();
    src.buffer = noiseBuf;
    const bp = audioCtx.createBiquadFilter();
    bp.type = "bandpass";
    const baseFreq = 920 + (Math.random() * 180 - 90);
    bp.frequency.setValueAtTime(baseFreq, t0);
    bp.frequency.exponentialRampToValueAtTime(380, t0 + 0.068);
    bp.Q.value = 2.4;

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.linearRampToValueAtTime(0.095, t0 + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0008, t0 + 0.075);

    src.connect(bp);
    bp.connect(gain);
    connectOut(gain, 0.12);
    src.start(t0, Math.random() * 0.8, 0.085);

    const sub = audioCtx.createOscillator();
    const sGain = audioCtx.createGain();
    sub.type = "sine";
    sub.frequency.setValueAtTime(88, t0 + 0.012);
    sub.frequency.exponentialRampToValueAtTime(44, t0 + 0.058);
    sGain.gain.setValueAtTime(0.0001, t0 + 0.012);
    sGain.gain.linearRampToValueAtTime(0.038, t0 + 0.018);
    sGain.gain.exponentialRampToValueAtTime(0.0008, t0 + 0.065);
    sub.connect(sGain);
    connectOut(sGain, 0);
    sub.start(t0 + 0.012);
    sub.stop(t0 + 0.07);
  }, delayMs);
}

/* Talisman Cast / Incantation Release when pressing Cast (⚔ 시전) */
function playCastIncantationSfx() {
  if (!soundEnabled) return;
  initAudio();
  if (!audioCtx || !noiseBuf) return;
  markSfxPlayed();
  const t0 = nowTime();

  // 1. Swift calligraphy brush / talisman paper ignite whoosh
  const whoosh = audioCtx.createBufferSource();
  whoosh.buffer = noiseBuf;
  const bp = audioCtx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.setValueAtTime(640, t0);
  bp.frequency.exponentialRampToValueAtTime(1950, t0 + 0.14);
  bp.Q.value = 2.2;
  const wGain = audioCtx.createGain();
  wGain.gain.setValueAtTime(0.0001, t0);
  wGain.gain.linearRampToValueAtTime(0.16, t0 + 0.025);
  wGain.gain.exponentialRampToValueAtTime(0.0008, t0 + 0.16);
  whoosh.connect(bp);
  bp.connect(wGain);
  connectOut(wGain, 0.3);
  whoosh.start(t0, Math.random() * 0.6, 0.18);

  // 2. Subtle ritual kagura suzu (shrine bell) shimmer
  [587.3, 880.0].forEach((freq, idx) => {
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, t0 + idx * 0.02);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.992, t0 + 0.26);
    g.gain.setValueAtTime(0.0001, t0 + idx * 0.02);
    g.gain.linearRampToValueAtTime(0.035 / (idx + 1), t0 + idx * 0.02 + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0008, t0 + 0.28);
    osc.connect(g);
    connectOut(g, 0.4);
    osc.start(t0 + idx * 0.02);
    osc.stop(t0 + 0.3);
  });
}

/* Eerie shrine spirit whisper / wind chime (used on Hint, Ask, Events) */
function playWhisperSfx() {
  if (!soundEnabled) return;
  initAudio();
  if (!audioCtx || !noiseBuf) return;
  markSfxPlayed();
  const t0 = nowTime();

  const breath = audioCtx.createBufferSource();
  breath.buffer = noiseBuf;
  const bp = audioCtx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.setValueAtTime(1180, t0);
  bp.frequency.exponentialRampToValueAtTime(620, t0 + 0.28);
  bp.Q.value = 4.2;
  const bGain = audioCtx.createGain();
  bGain.gain.setValueAtTime(0.0001, t0);
  bGain.gain.linearRampToValueAtTime(0.11, t0 + 0.04);
  bGain.gain.exponentialRampToValueAtTime(0.0008, t0 + 0.3);
  breath.connect(bp);
  bp.connect(bGain);
  connectOut(bGain, 0.45);
  breath.start(t0, Math.random() * 0.5, 0.32);

  const chime = audioCtx.createOscillator();
  const cGain = audioCtx.createGain();
  chime.type = "sine";
  chime.frequency.setValueAtTime(659.25, t0 + 0.01);
  chime.frequency.exponentialRampToValueAtTime(652.0, t0 + 0.42);
  cGain.gain.setValueAtTime(0.0001, t0 + 0.01);
  cGain.gain.linearRampToValueAtTime(0.032, t0 + 0.02);
  cGain.gain.exponentialRampToValueAtTime(0.0006, t0 + 0.44);
  chime.connect(cGain);
  connectOut(cGain, 0.55);
  chime.start(t0 + 0.01);
  chime.stop(t0 + 0.46);
}

/* Stone corridor footsteps (used when choosing a stage path or attempting to flee) */
function playFootstepSfx() {
  if (!soundEnabled) return;
  initAudio();
  if (!audioCtx || !noiseBuf) return;
  markSfxPlayed();

  [0, 135].forEach((delay, stepIdx) => {
    setTimeout(() => {
      if (!soundEnabled || !audioCtx) return;
      const t0 = nowTime();
      const step = audioCtx.createBufferSource();
      step.buffer = noiseBuf;
      const lp = audioCtx.createBiquadFilter();
      lp.type = "bandpass";
      lp.frequency.setValueAtTime(stepIdx === 0 ? 520 : 610, t0);
      lp.Q.value = 2.2;
      const g = audioCtx.createGain();
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.linearRampToValueAtTime(0.13, t0 + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0008, t0 + 0.065);
      step.connect(lp);
      lp.connect(g);
      connectOut(g, 0.25);
      step.start(t0, Math.random() * 0.5, 0.08);

      const thud = audioCtx.createOscillator();
      const tGain = audioCtx.createGain();
      thud.type = "sine";
      thud.frequency.setValueAtTime(stepIdx === 0 ? 90 : 98, t0);
      thud.frequency.exponentialRampToValueAtTime(38, t0 + 0.06);
      tGain.gain.setValueAtTime(0.0001, t0);
      tGain.gain.linearRampToValueAtTime(0.09, t0 + 0.004);
      tGain.gain.exponentialRampToValueAtTime(0.0008, t0 + 0.065);
      thud.connect(tGain);
      connectOut(tGain, 0.15);
      thud.start(t0);
      thud.stop(t0 + 0.07);
    }, delay);
  });
}

/* Ancient God Summon invocation rumble */
function playSummonGodSfx() {
  if (!soundEnabled) return;
  initAudio();
  if (!audioCtx || !noiseBuf) return;
  markSfxPlayed();
  const t0 = nowTime();

  const rumble = audioCtx.createOscillator();
  const rGain = audioCtx.createGain();
  rumble.type = "sawtooth";
  const lp = audioCtx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.setValueAtTime(190, t0);
  lp.frequency.exponentialRampToValueAtTime(65, t0 + 0.55);
  rumble.frequency.setValueAtTime(55, t0);
  rumble.frequency.exponentialRampToValueAtTime(36, t0 + 0.55);
  rGain.gain.setValueAtTime(0.0001, t0);
  rGain.gain.linearRampToValueAtTime(0.18, t0 + 0.03);
  rGain.gain.exponentialRampToValueAtTime(0.0008, t0 + 0.58);
  rumble.connect(lp);
  lp.connect(rGain);
  connectOut(rGain, 0.5);
  rumble.start(t0);
  rumble.stop(t0 + 0.6);

  [220, 330].forEach((f, i) => {
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(f, t0 + 0.02);
    osc.frequency.exponentialRampToValueAtTime(f * 0.98, t0 + 0.55);
    g.gain.setValueAtTime(0.0001, t0 + 0.02);
    g.gain.linearRampToValueAtTime(0.055 / (i + 1), t0 + 0.04);
    g.gain.exponentialRampToValueAtTime(0.0008, t0 + 0.58);
    osc.connect(g);
    connectOut(g, 0.55);
    osc.start(t0 + 0.02);
    osc.stop(t0 + 0.6);
  });
}

/* Singing bowl / vitality resonance when recovering HP */
function playHealSfx() {
  if (!soundEnabled) return;
  initAudio();
  if (!audioCtx) return;
  markSfxPlayed();
  const t0 = nowTime();

  [396, 594, 792].forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, t0 + i * 0.035);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.003, t0 + 0.55);
    g.gain.setValueAtTime(0.0001, t0 + i * 0.035);
    g.gain.linearRampToValueAtTime(0.055 / (i + 1), t0 + i * 0.035 + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0006, t0 + 0.58);
    osc.connect(g);
    connectOut(g, 0.55);
    osc.start(t0 + i * 0.035);
    osc.stop(t0 + 0.62);
  });
}

/* Sekiro-style Katana Deflect / Parry Ring (챙—!) when full defense nullifies enemy attack */
function playParrySfx() {
  if (!soundEnabled) return;
  initAudio();
  if (!audioCtx || !noiseBuf) return;
  markSfxPlayed();
  const t0 = nowTime();

  // Sharp metallic spark transient
  const spark = audioCtx.createBufferSource();
  spark.buffer = noiseBuf;
  const hp = audioCtx.createBiquadFilter();
  hp.type = "bandpass";
  hp.frequency.setValueAtTime(3400, t0);
  hp.Q.value = 3.8;
  const sGain = audioCtx.createGain();
  sGain.gain.setValueAtTime(0.0001, t0);
  sGain.gain.linearRampToValueAtTime(0.22, t0 + 0.004);
  sGain.gain.exponentialRampToValueAtTime(0.0008, t0 + 0.075);
  spark.connect(hp);
  hp.connect(sGain);
  connectOut(sGain, 0.35);
  spark.start(t0, Math.random() * 0.5, 0.09);

  // Resonant steel parry ring
  const ringFreqs = [
    { f1: 1760, f2: 1735, g: 0.07, d: 0.38 },
    { f1: 2790, f2: 2740, g: 0.05, d: 0.30 },
    { f1: 4180, f2: 4110, g: 0.03, d: 0.22 }
  ];
  ringFreqs.forEach(({ f1, f2, g, d }) => {
    const osc = audioCtx.createOscillator();
    const pGain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(f1, t0);
    osc.frequency.exponentialRampToValueAtTime(f2, t0 + d);
    pGain.gain.setValueAtTime(0.0001, t0);
    pGain.gain.linearRampToValueAtTime(g, t0 + 0.004);
    pGain.gain.exponentialRampToValueAtTime(0.0006, t0 + d);
    osc.connect(pGain);
    connectOut(pGain, 0.5);
    osc.start(t0);
    osc.stop(t0 + d + 0.02);
  });
}

/* Sekiro-inspired Katana Slash & Spirit Severance (zero-pop micro-ramp envelope) */
function playSlashSfx() {
  if (!soundEnabled) return;
  initAudio();
  if (!audioCtx || !noiseBuf) return;
  markSfxPlayed();
  const t0 = nowTime();

  // 1. High-velocity blade wind cut (filtered noise sweep)
  const wind = audioCtx.createBufferSource();
  wind.buffer = noiseBuf;
  const bp = audioCtx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.setValueAtTime(2650, t0);
  bp.frequency.exponentialRampToValueAtTime(420, t0 + 0.17);
  bp.Q.value = 1.8;
  const wGain = audioCtx.createGain();
  wGain.gain.setValueAtTime(0.0001, t0);
  wGain.gain.linearRampToValueAtTime(0.26, t0 + 0.012);
  wGain.gain.exponentialRampToValueAtTime(0.0008, t0 + 0.19);
  wind.connect(bp);
  bp.connect(wGain);
  connectOut(wGain, 0.28);
  wind.start(t0, Math.random() * 0.5, 0.21);

  // 2. Cold steel katana ring (inharmonic metallic partials with smooth 5ms attack ramp)
  const partials = [
    { f1: 1420, f2: 1380, g: 0.048, d: 0.28 },
    { f1: 2290, f2: 2210, g: 0.036, d: 0.22 },
    { f1: 3480, f2: 3320, g: 0.022, d: 0.16 }
  ];
  partials.forEach(({ f1, f2, g, d }) => {
    const osc = audioCtx.createOscillator();
    const pGain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(f1, t0);
    osc.frequency.exponentialRampToValueAtTime(f2, t0 + d);
    pGain.gain.setValueAtTime(0.0001, t0);
    pGain.gain.linearRampToValueAtTime(g, t0 + 0.005);
    pGain.gain.exponentialRampToValueAtTime(0.0006, t0 + d);
    osc.connect(pGain);
    connectOut(pGain, 0.35);
    osc.start(t0);
    osc.stop(t0 + d + 0.02);
  });

  // 3. Heavy flesh/posture impact sub-thud (smooth 6ms attack ramp so it never clicks/pops)
  const sub = audioCtx.createOscillator();
  const sGain = audioCtx.createGain();
  sub.type = "triangle";
  sub.frequency.setValueAtTime(110, t0 + 0.008);
  sub.frequency.exponentialRampToValueAtTime(32, t0 + 0.19);
  sGain.gain.setValueAtTime(0.0001, t0 + 0.008);
  sGain.gain.linearRampToValueAtTime(0.20, t0 + 0.015);
  sGain.gain.exponentialRampToValueAtTime(0.0008, t0 + 0.21);
  sub.connect(sGain);
  connectOut(sGain, 0.18);
  sub.start(t0 + 0.008);
  sub.stop(t0 + 0.22);
}

/* Heavy posture/blood hit taken by player — visceral low thud & dark dissonance */
function playDamageSfx() {
  if (!soundEnabled) return;
  initAudio();
  if (!audioCtx || !noiseBuf) return;
  markSfxPlayed();
  const t0 = nowTime();

  // 1. Crushing sub-bass blow
  const sub = audioCtx.createOscillator();
  const sGain = audioCtx.createGain();
  sub.type = "sine";
  sub.frequency.setValueAtTime(86, t0);
  sub.frequency.exponentialRampToValueAtTime(26, t0 + 0.28);
  sGain.gain.setValueAtTime(0.0001, t0);
  sGain.gain.linearRampToValueAtTime(0.26, t0 + 0.006);
  sGain.gain.exponentialRampToValueAtTime(0.0008, t0 + 0.3);
  sub.connect(sGain);
  connectOut(sGain, 0.22);
  sub.start(t0);
  sub.stop(t0 + 0.32);

  // 2. Low-passed crunch transient
  const crunch = audioCtx.createBufferSource();
  crunch.buffer = noiseBuf;
  const lp = audioCtx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.setValueAtTime(520, t0);
  lp.frequency.exponentialRampToValueAtTime(120, t0 + 0.18);
  const cGain = audioCtx.createGain();
  cGain.gain.setValueAtTime(0.0001, t0);
  cGain.gain.linearRampToValueAtTime(0.22, t0 + 0.006);
  cGain.gain.exponentialRampToValueAtTime(0.0008, t0 + 0.19);
  crunch.connect(lp);
  lp.connect(cGain);
  connectOut(cGain, 0.18);
  crunch.start(t0, Math.random() * 0.5, 0.2);

  // 3. Eerie minor-second dark tremor
  [98, 104.5].forEach((freq) => {
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, t0);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.72, t0 + 0.34);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(0.058, t0 + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0008, t0 + 0.36);
    osc.connect(g);
    connectOut(g, 0.32);
    osc.start(t0);
    osc.stop(t0 + 0.38);
  });
}

/* Subterranean Temple Bell (Bonsho) & Taiko Drum — Boss encounter / Curtain transition */
function playGongSfx() {
  if (!soundEnabled) return;
  initAudio();
  if (!audioCtx || !noiseBuf) return;
  markSfxPlayed();
  const t0 = nowTime();

  // 1. Deep Taiko drum strike
  const taiko = audioCtx.createOscillator();
  const tGain = audioCtx.createGain();
  taiko.type = "sine";
  taiko.frequency.setValueAtTime(74, t0);
  taiko.frequency.exponentialRampToValueAtTime(33, t0 + 0.45);
  tGain.gain.setValueAtTime(0.0001, t0);
  tGain.gain.linearRampToValueAtTime(0.24, t0 + 0.008);
  tGain.gain.exponentialRampToValueAtTime(0.0008, t0 + 0.55);
  taiko.connect(tGain);
  connectOut(tGain, 0.4);
  taiko.start(t0);
  taiko.stop(t0 + 0.58);

  // 2. Bronze Bonsho bell partials
  const bellPartials = [
    { f: 110.0, g: 0.11, d: 1.9 },
    { f: 111.4, g: 0.09, d: 1.85 },
    { f: 221.5, g: 0.058, d: 1.45 },
    { f: 318.0, g: 0.04, d: 1.15 },
    { f: 476.0, g: 0.024, d: 0.85 },
    { f: 712.0, g: 0.013, d: 0.55 }
  ];
  bellPartials.forEach(({ f, g, d }) => {
    const osc = audioCtx.createOscillator();
    const pGain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(f, t0);
    osc.frequency.exponentialRampToValueAtTime(f * 0.985, t0 + d);
    pGain.gain.setValueAtTime(0.0001, t0);
    pGain.gain.linearRampToValueAtTime(g, t0 + 0.018);
    pGain.gain.exponentialRampToValueAtTime(0.0006, t0 + d);
    osc.connect(pGain);
    connectOut(pGain, 0.55);
    osc.start(t0);
    osc.stop(t0 + d + 0.04);
  });

  // 3. Eerie crypt wind swell
  const breath = audioCtx.createBufferSource();
  breath.buffer = noiseBuf;
  const bp = audioCtx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.setValueAtTime(280, t0);
  bp.Q.value = 3.5;
  const bGain = audioCtx.createGain();
  bGain.gain.setValueAtTime(0.0001, t0);
  bGain.gain.linearRampToValueAtTime(0.055, t0 + 0.15);
  bGain.gain.exponentialRampToValueAtTime(0.0008, t0 + 1.2);
  breath.connect(bp);
  bp.connect(bGain);
  connectOut(bGain, 0.45);
  breath.start(t0, 0, 1.3);
}

/* Sekiro Deathblow / Execution Seal Stamp (斬) */
function playSealStampSfx() {
  if (!soundEnabled) return;
  initAudio();
  if (!audioCtx || !noiseBuf) return;
  markSfxPlayed();
  const t0 = nowTime();

  // 1. Sharp hyoshigi / tsuba clack
  const clack = audioCtx.createBufferSource();
  clack.buffer = noiseBuf;
  const hp = audioCtx.createBiquadFilter();
  hp.type = "bandpass";
  hp.frequency.setValueAtTime(2150, t0);
  hp.Q.value = 4.0;
  const cGain = audioCtx.createGain();
  cGain.gain.setValueAtTime(0.0001, t0);
  cGain.gain.linearRampToValueAtTime(0.24, t0 + 0.005);
  cGain.gain.exponentialRampToValueAtTime(0.0008, t0 + 0.068);
  clack.connect(hp);
  hp.connect(cGain);
  connectOut(cGain, 0.4);
  clack.start(t0, Math.random() * 0.4, 0.08);

  // 2. Deep execution sub-boom
  const boom = audioCtx.createOscillator();
  const bGain = audioCtx.createGain();
  boom.type = "sine";
  boom.frequency.setValueAtTime(96, t0);
  boom.frequency.exponentialRampToValueAtTime(27, t0 + 0.55);
  bGain.gain.setValueAtTime(0.0001, t0);
  bGain.gain.linearRampToValueAtTime(0.28, t0 + 0.006);
  bGain.gain.exponentialRampToValueAtTime(0.0008, t0 + 0.6);
  boom.connect(bGain);
  connectOut(bGain, 0.45);
  boom.start(t0);
  boom.stop(t0 + 0.65);

  // 3. Haunting ritual chime ring
  [528, 792, 1188].forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, t0 + 0.01);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.99, t0 + 1.1);
    g.gain.setValueAtTime(0.0001, t0 + 0.01);
    g.gain.linearRampToValueAtTime(0.048 / (i + 1), t0 + 0.018);
    g.gain.exponentialRampToValueAtTime(0.0006, t0 + 1.15);
    osc.connect(g);
    connectOut(g, 0.55);
    osc.start(t0 + 0.01);
    osc.stop(t0 + 1.2);
  });
}

/*
 * Global interactive sound delegation:
 * Ensures every button, tab, modal close, or interactive card produces immediate audio feedback
 * even if its inline onclick handler didn't explicitly call playClickSfx().
 */
if (typeof document !== "undefined") {
  document.addEventListener("click", (e) => {
    const el = e.target && e.target.closest
      ? e.target.closest("button, .btn, .menu-btn, .chip, .corner-btn, .tab-btn, .menu-item, .abyss-node, .boss-card, .saved-run-banner, .trial-line")
      : null;
    if (!el || el.disabled) return;
    if (el.id === "sound-btn" || el.id === "sound-toggle-btn") return;
    if (performance.now() - lastSfxStamp > 45) {
      playClickSfx();
    }
  }, true);
}
