/*
 * Procedural Dark Eastern Ritual / Sekiro-inspired Web Audio Synthesizer (zero external audio files).
 * Performance-hardened architecture:
 *  - Every temporary OscillatorNode / AudioBufferSourceNode automatically disconnects its entire
 *    downstream filter/gain chain on completion (`onended`), preventing Web Audio graph leaks
 *    and audio crackling over long runs.
 *  - Pre-allocated shared reverb send buses (zero GainNode allocations in `connectOut`).
 *  - Active voice limiter so rapid overlapping SFX never overload the audio render thread.
 */
let audioCtx = null;
let noiseBuf = null;
let reverbNode = null;
let reverbSendLow = null;
let reverbSendMid = null;
let reverbSendHigh = null;
let masterBus = null;
let lastSfxStamp = 0;
let activeVoices = 0;
const MAX_ACTIVE_VOICES = 18;
let soundEnabled = localStorage.getItem("kd_sound") !== "off";

function markSfxPlayed() {
  lastSfxStamp = performance.now();
}

function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    audioCtx = new AudioContext();

    // Master brickwall compressor/limiter so overlapping hits never clip or pop
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

    // Pre-generate 1.5 seconds of organic pink/brown-tinted noise
    const sr = audioCtx.sampleRate;
    const noiseLen = Math.floor(sr * 1.5);
    noiseBuf = audioCtx.createBuffer(1, noiseLen, sr);
    const data = noiseBuf.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.997 * b0 + white * 0.029;
      b1 = 0.985 * b1 + white * 0.032;
      b2 = 0.950 * b2 + white * 0.048;
      data[i] = (b0 + b1 + b2 + white * 0.18) * 0.55;
    }

    // Lightweight mono shrine impulse response (0.55s tail) + 3 shared send buses (zero per-SFX GainNode allocation)
    try {
      const len = Math.floor(sr * 0.55);
      const imp = audioCtx.createBuffer(1, len, sr);
      const c = imp.getChannelData(0);
      for (let i = 0; i < len; i++) {
        const fadeIn = Math.min(1, i / (sr * 0.006));
        const env = Math.pow(1 - i / len, 2.8) * fadeIn;
        c[i] = (Math.random() * 2 - 1) * env * 0.3;
      }
      reverbNode = audioCtx.createConvolver();
      reverbNode.buffer = imp;
      const revFilter = audioCtx.createBiquadFilter();
      revFilter.type = "lowpass";
      revFilter.frequency.value = 1400;
      const revGain = audioCtx.createGain();
      revGain.gain.value = 0.24;
      reverbNode.connect(revFilter);
      revFilter.connect(revGain);
      revGain.connect(masterBus);

      reverbSendLow = audioCtx.createGain();
      reverbSendLow.gain.value = 0.12;
      reverbSendLow.connect(reverbNode);

      reverbSendMid = audioCtx.createGain();
      reverbSendMid.gain.value = 0.28;
      reverbSendMid.connect(reverbNode);

      reverbSendHigh = audioCtx.createGain();
      reverbSendHigh.gain.value = 0.48;
      reverbSendHigh.connect(reverbNode);
    } catch (_) {
      reverbNode = null;
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
}

function nowTime() {
  return audioCtx ? audioCtx.currentTime + 0.012 : 0;
}

/* Connect a voice's final GainNode to masterBus and a shared reverb bus without allocating extra GainNodes. */
function connectOut(node, wet = 0.2) {
  if (!masterBus) return;
  node.connect(masterBus);
  if (reverbNode && wet > 0) {
    if (wet <= 0.16 && reverbSendLow) node.connect(reverbSendLow);
    else if (wet <= 0.36 && reverbSendMid) node.connect(reverbSendMid);
    else if (reverbSendHigh) node.connect(reverbSendHigh);
  }
}

/*
 * Register a one-shot source (OscillatorNode or AudioBufferSourceNode) and its downstream nodes
 * so every node is deterministically disconnected from the audio graph as soon as the sound ends.
 */
function trackVoice(sourceNode, downstreamNodes, stopTime) {
  activeVoices += 1;
  let cleaned = false;
  const cleanup = () => {
    if (cleaned) return;
    cleaned = true;
    activeVoices = Math.max(0, activeVoices - 1);
    try { sourceNode.disconnect(); } catch (_) {}
    if ( Array.isArray(downstreamNodes)) {
      for (let i = 0; i < downstreamNodes.length; i++) {
        try { downstreamNodes[i].disconnect(); } catch (_) {}
      }
    }
  };
  sourceNode.onended = cleanup;
  if (audioCtx && stopTime) {
    const durMs = Math.max(60, Math.ceil((stopTime - audioCtx.currentTime) * 1000) + 120);
    setTimeout(cleanup, durMs);
  } else {
    setTimeout(cleanup, 1800);
  }
}

function canPlayVoice(needed = 1) {
  return activeVoices + needed <= MAX_ACTIVE_VOICES;
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
  if (!soundEnabled || !canPlayVoice(2)) return;
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
  trackVoice(src, [bp, nGain], t0 + 0.04);
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
  trackVoice(osc, [oGain], t0 + 0.045);
  osc.start(t0);
  osc.stop(t0 + 0.04);
}

/* Heavy wooden shrine gate / sliding door resonance (used on Title/Select view transitions & modals) */
function playGateSlideSfx() {
  if (!soundEnabled || !canPlayVoice(2)) return;
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
  trackVoice(slide, [bp, sGain], t0 + 0.26);
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
  trackVoice(latch, [lGain], t0 + 0.23);
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
    if (!soundEnabled || !audioCtx || !canPlayVoice(1)) return;
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
    trackVoice(src, [bp, gain], t0 + 0.09);
    src.start(t0, Math.random() * 0.8, 0.085);
  }, delayMs);
}

/* Talisman Cast / Incantation Release when pressing Cast (⚔ 시전) */
function playCastIncantationSfx() {
  if (!soundEnabled || !canPlayVoice(3)) return;
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
  trackVoice(whoosh, [bp, wGain], t0 + 0.19);
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
    trackVoice(osc, [g], t0 + 0.31);
    osc.start(t0 + idx * 0.02);
    osc.stop(t0 + 0.3);
  });
}

/* Eerie shrine spirit whisper / wind chime (used on Hint, Ask, Events) */
function playWhisperSfx() {
  if (!soundEnabled || !canPlayVoice(2)) return;
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
  trackVoice(breath, [bp, bGain], t0 + 0.33);
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
  trackVoice(chime, [cGain], t0 + 0.47);
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
      if (!soundEnabled || !audioCtx || !canPlayVoice(2)) return;
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
      trackVoice(step, [lp, g], t0 + 0.09);
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
      trackVoice(thud, [tGain], t0 + 0.08);
      thud.start(t0);
      thud.stop(t0 + 0.07);
    }, delay);
  });
}

/* Ancient God Summon invocation rumble */
function playSummonGodSfx() {
  if (!soundEnabled || !canPlayVoice(3)) return;
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
  trackVoice(rumble, [lp, rGain], t0 + 0.62);
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
    trackVoice(osc, [g], t0 + 0.62);
    osc.start(t0 + 0.02);
    osc.stop(t0 + 0.6);
  });
}

/* Singing bowl / vitality resonance when recovering HP */
function playHealSfx() {
  if (!soundEnabled || !canPlayVoice(3)) return;
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
    trackVoice(osc, [g], t0 + 0.64);
    osc.start(t0 + i * 0.035);
    osc.stop(t0 + 0.62);
  });
}

/* Sekiro-style Katana Deflect / Parry Ring (챙—!) when full defense nullifies enemy attack */
function playParrySfx() {
  if (!soundEnabled || !canPlayVoice(3)) return;
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
  trackVoice(spark, [hp, sGain], t0 + 0.1);
  spark.start(t0, Math.random() * 0.5, 0.09);

  // Resonant steel parry ring
  const ringFreqs = [
    { f1: 1760, f2: 1735, g: 0.07, d: 0.35 },
    { f1: 2790, f2: 2740, g: 0.05, d: 0.28 }
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
    connectOut(pGain, 0.45);
    trackVoice(osc, [pGain], t0 + d + 0.03);
    osc.start(t0);
    osc.stop(t0 + d + 0.02);
  });
}

/* Sekiro-inspired Katana Slash & Spirit Severance */
function playSlashSfx() {
  if (!soundEnabled || !canPlayVoice(4)) return;
  initAudio();
  if (!audioCtx || !noiseBuf) return;
  markSfxPlayed();
  const t0 = nowTime();

  // 1. High-velocity blade wind cut
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
  trackVoice(wind, [bp, wGain], t0 + 0.22);
  wind.start(t0, Math.random() * 0.5, 0.21);

  // 2. Cold steel katana ring
  const partials = [
    { f1: 1420, f2: 1380, g: 0.048, d: 0.26 },
    { f1: 2290, f2: 2210, g: 0.036, d: 0.20 }
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
    trackVoice(osc, [pGain], t0 + d + 0.03);
    osc.start(t0);
    osc.stop(t0 + d + 0.02);
  });

  // 3. Heavy flesh/posture impact sub-thud
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
  trackVoice(sub, [sGain], t0 + 0.23);
  sub.start(t0 + 0.008);
  sub.stop(t0 + 0.22);
}

/* Heavy posture/blood hit taken by player — visceral low thud & dark dissonance */
function playDamageSfx() {
  if (!soundEnabled || !canPlayVoice(3)) return;
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
  trackVoice(sub, [sGain], t0 + 0.33);
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
  trackVoice(crunch, [lp, cGain], t0 + 0.21);
  crunch.start(t0, Math.random() * 0.5, 0.2);

  // 3. Eerie minor-second dark tremor
  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(102, t0);
  osc.frequency.exponentialRampToValueAtTime(72, t0 + 0.32);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.linearRampToValueAtTime(0.085, t0 + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0008, t0 + 0.34);
  osc.connect(g);
  connectOut(g, 0.32);
  trackVoice(osc, [g], t0 + 0.36);
  osc.start(t0);
  osc.stop(t0 + 0.35);
}

/* Subterranean Temple Bell (Bonsho) & Taiko Drum — Boss encounter / Curtain transition */
function playGongSfx() {
  if (!soundEnabled || !canPlayVoice(4)) return;
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
  trackVoice(taiko, [tGain], t0 + 0.6);
  taiko.start(t0);
  taiko.stop(t0 + 0.58);

  // 2. Bronze Bonsho bell partials (streamlined to 3 core partials)
  const bellPartials = [
    { f: 110.0, g: 0.13, d: 1.35 },
    { f: 221.5, g: 0.065, d: 1.05 },
    { f: 318.0, g: 0.042, d: 0.85 }
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
    trackVoice(osc, [pGain], t0 + d + 0.05);
    osc.start(t0);
    osc.stop(t0 + d + 0.04);
  });
}

/* Sekiro Deathblow / Execution Seal Stamp (斬) */
function playSealStampSfx() {
  if (!soundEnabled || !canPlayVoice(4)) return;
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
  trackVoice(clack, [hp, cGain], t0 + 0.09);
  clack.start(t0, Math.random() * 0.4, 0.08);

  // 2. Deep execution sub-boom
  const boom = audioCtx.createOscillator();
  const bGain = audioCtx.createGain();
  boom.type = "sine";
  boom.frequency.setValueAtTime(96, t0);
  boom.frequency.exponentialRampToValueAtTime(27, t0 + 0.52);
  bGain.gain.setValueAtTime(0.0001, t0);
  bGain.gain.linearRampToValueAtTime(0.28, t0 + 0.006);
  bGain.gain.exponentialRampToValueAtTime(0.0008, t0 + 0.56);
  boom.connect(bGain);
  connectOut(bGain, 0.45);
  trackVoice(boom, [bGain], t0 + 0.6);
  boom.start(t0);
  boom.stop(t0 + 0.58);

  // 3. Haunting ritual chime ring
  [528, 792].forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, t0 + 0.01);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.99, t0 + 0.85);
    g.gain.setValueAtTime(0.0001, t0 + 0.01);
    g.gain.linearRampToValueAtTime(0.05 / (i + 1), t0 + 0.018);
    g.gain.exponentialRampToValueAtTime(0.0006, t0 + 0.88);
    osc.connect(g);
    connectOut(g, 0.55);
    trackVoice(osc, [g], t0 + 0.92);
    osc.start(t0 + 0.01);
    osc.stop(t0 + 0.9);
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
    if (performance.now() - lastSfxStamp > 55) {
      playClickSfx();
    }
  }, true);
}
