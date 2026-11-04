/*
 * Procedural Dark Eastern Ritual / Sekiro-inspired Web Audio Synthesizer (zero external audio files).
 * Replaces arcade pitch-sweeps with layered noise transients, wooden talisman clacks,
 * parchment whispers, cold katana steel overtones, taiko drums, and bronze temple bells (Bonsho).
 */
let audioCtx = null;
let noiseBuf = null;
let reverbNode = null;
let masterBus = null;
let soundEnabled = localStorage.getItem("kd_sound") !== "off";

function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    audioCtx = new AudioContext();

    // Master output bus with gentle limiter curve
    masterBus = audioCtx.createGain();
    masterBus.gain.value = 0.92;
    masterBus.connect(audioCtx.destination);

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

    // Subterranean stone shrine impulse response (1.6s dark tail)
    try {
      const len = Math.floor(sr * 1.6);
      const imp = audioCtx.createBuffer(2, len, sr);
      for (let ch = 0; ch < 2; ch++) {
        const c = imp.getChannelData(ch);
        for (let i = 0; i < len; i++) {
          const env = Math.pow(1 - i / len, 2.8);
          c[i] = (Math.random() * 2 - 1) * env * 0.35;
        }
      }
      reverbNode = audioCtx.createConvolver();
      reverbNode.buffer = imp;
      const revFilter = audioCtx.createBiquadFilter();
      revFilter.type = "lowpass";
      revFilter.frequency.value = 1400;
      const revGain = audioCtx.createGain();
      revGain.gain.value = 0.28;
      reverbNode.connect(revFilter);
      revFilter.connect(revGain);
      revGain.connect(masterBus);
    } catch (_) {
      reverbNode = null;
    }
  }
  if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
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

/* Dry wooden fuda / stone seal tap — no cartoon pitch-sweep "bloop" */
function playClickSfx() {
  if (!soundEnabled) return;
  initAudio();
  if (!audioCtx || !noiseBuf) return;
  const t0 = audioCtx.currentTime;

  // 1. Crisp wooden/bone talisman transient
  const src = audioCtx.createBufferSource();
  src.buffer = noiseBuf;
  const bp = audioCtx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.setValueAtTime(1650, t0);
  bp.Q.value = 3.2;
  const nGain = audioCtx.createGain();
  nGain.gain.setValueAtTime(0.14, t0);
  nGain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.022);
  src.connect(bp);
  bp.connect(nGain);
  connectOut(nGain, 0.08);
  src.start(t0, Math.random() * 0.5, 0.03);

  // 2. Muted dark wood body thud
  const osc = audioCtx.createOscillator();
  const oGain = audioCtx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(118, t0);
  osc.frequency.exponentialRampToValueAtTime(52, t0 + 0.028);
  oGain.gain.setValueAtTime(0.09, t0);
  oGain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.032);
  osc.connect(oGain);
  connectOut(oGain, 0.05);
  osc.start(t0);
  osc.stop(t0 + 0.035);
}

/* Ofuda paper talisman slide / calligraphy brush whisper */
function playCardDealSfx(delayMs = 0) {
  if (!soundEnabled) return;
  initAudio();
  if (!audioCtx || !noiseBuf) return;
  setTimeout(() => {
    if (!soundEnabled || !audioCtx) return;
    const t0 = audioCtx.currentTime;

    // Paper slide whisper
    const src = audioCtx.createBufferSource();
    src.buffer = noiseBuf;
    const bp = audioCtx.createBiquadFilter();
    bp.type = "bandpass";
    const baseFreq = 920 + (Math.random() * 180 - 90);
    bp.frequency.setValueAtTime(baseFreq, t0);
    bp.frequency.exponentialRampToValueAtTime(380, t0 + 0.065);
    bp.Q.value = 2.4;

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.001, t0);
    gain.gain.linearRampToValueAtTime(0.09, t0 + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.07);

    src.connect(bp);
    bp.connect(gain);
    connectOut(gain, 0.12);
    src.start(t0, Math.random() * 0.8, 0.08);

    // Subtle low parchment settle
    const sub = audioCtx.createOscillator();
    const sGain = audioCtx.createGain();
    sub.type = "sine";
    sub.frequency.setValueAtTime(88, t0 + 0.015);
    sub.frequency.exponentialRampToValueAtTime(44, t0 + 0.055);
    sGain.gain.setValueAtTime(0.035, t0 + 0.015);
    sGain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.06);
    sub.connect(sGain);
    connectOut(sGain, 0);
    sub.start(t0 + 0.015);
    sub.stop(t0 + 0.065);
  }, delayMs);
}

/* Sekiro-inspired Katana Slash & Spirit Severance */
function playSlashSfx() {
  if (!soundEnabled) return;
  initAudio();
  if (!audioCtx || !noiseBuf) return;
  const t0 = audioCtx.currentTime;

  // 1. High-velocity blade wind cut (filtered noise sweep)
  const wind = audioCtx.createBufferSource();
  wind.buffer = noiseBuf;
  const bp = audioCtx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.setValueAtTime(2800, t0);
  bp.frequency.exponentialRampToValueAtTime(420, t0 + 0.16);
  bp.Q.value = 1.8;
  const wGain = audioCtx.createGain();
  wGain.gain.setValueAtTime(0.001, t0);
  wGain.gain.linearRampToValueAtTime(0.32, t0 + 0.015);
  wGain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.18);
  wind.connect(bp);
  bp.connect(wGain);
  connectOut(wGain, 0.35);
  wind.start(t0, Math.random() * 0.5, 0.2);

  // 2. Cold steel katana ring (inharmonic metallic partials)
  const partials = [
    { f1: 1420, f2: 1380, g: 0.055, d: 0.28 },
    { f1: 2290, f2: 2210, g: 0.042, d: 0.22 },
    { f1: 3480, f2: 3320, g: 0.025, d: 0.16 }
  ];
  partials.forEach(({ f1, f2, g, d }) => {
    const osc = audioCtx.createOscillator();
    const pGain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(f1, t0);
    osc.frequency.exponentialRampToValueAtTime(f2, t0 + d);
    pGain.gain.setValueAtTime(g, t0);
    pGain.gain.exponentialRampToValueAtTime(0.0008, t0 + d);
    osc.connect(pGain);
    connectOut(pGain, 0.45);
    osc.start(t0);
    osc.stop(t0 + d + 0.02);
  });

  // 3. Heavy flesh/posture impact sub-thud
  const sub = audioCtx.createOscillator();
  const sGain = audioCtx.createGain();
  sub.type = "triangle";
  sub.frequency.setValueAtTime(112, t0 + 0.01);
  sub.frequency.exponentialRampToValueAtTime(31, t0 + 0.19);
  sGain.gain.setValueAtTime(0.24, t0 + 0.01);
  sGain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.21);
  sub.connect(sGain);
  connectOut(sGain, 0.2);
  sub.start(t0 + 0.01);
  sub.stop(t0 + 0.22);
}

/* Heavy posture/blood hit taken by player — visceral low thud & dark dissonance */
function playDamageSfx() {
  if (!soundEnabled) return;
  initAudio();
  if (!audioCtx || !noiseBuf) return;
  const t0 = audioCtx.currentTime;

  // 1. Crushing sub-bass blow
  const sub = audioCtx.createOscillator();
  const sGain = audioCtx.createGain();
  sub.type = "sine";
  sub.frequency.setValueAtTime(86, t0);
  sub.frequency.exponentialRampToValueAtTime(26, t0 + 0.28);
  sGain.gain.setValueAtTime(0.32, t0);
  sGain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.3);
  sub.connect(sGain);
  connectOut(sGain, 0.25);
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
  cGain.gain.setValueAtTime(0.26, t0);
  cGain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.19);
  crunch.connect(lp);
  lp.connect(cGain);
  connectOut(cGain, 0.2);
  crunch.start(t0, Math.random() * 0.5, 0.2);

  // 3. Eerie minor-second dark tremor
  [98, 104.5].forEach((freq) => {
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, t0);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.72, t0 + 0.34);
    g.gain.setValueAtTime(0.07, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.36);
    osc.connect(g);
    connectOut(g, 0.4);
    osc.start(t0);
    osc.stop(t0 + 0.38);
  });
}

/* Subterranean Temple Bell (Bonsho) & Taiko Drum — Boss encounter / Curtain transition */
function playGongSfx() {
  if (!soundEnabled) return;
  initAudio();
  if (!audioCtx || !noiseBuf) return;
  const t0 = audioCtx.currentTime;

  // 1. Deep Taiko drum strike
  const taiko = audioCtx.createOscillator();
  const tGain = audioCtx.createGain();
  taiko.type = "sine";
  taiko.frequency.setValueAtTime(74, t0);
  taiko.frequency.exponentialRampToValueAtTime(33, t0 + 0.45);
  tGain.gain.setValueAtTime(0.28, t0);
  tGain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.55);
  taiko.connect(tGain);
  connectOut(tGain, 0.45);
  taiko.start(t0);
  taiko.stop(t0 + 0.58);

  // 2. Bronze Bonsho bell partials (with slow beating between 110Hz and 111.4Hz)
  const bellPartials = [
    { f: 110.0, g: 0.12, d: 1.9 },
    { f: 111.4, g: 0.10, d: 1.85 },
    { f: 221.5, g: 0.065, d: 1.45 },
    { f: 318.0, g: 0.045, d: 1.15 },
    { f: 476.0, g: 0.028, d: 0.85 },
    { f: 712.0, g: 0.015, d: 0.55 }
  ];
  bellPartials.forEach(({ f, g, d }) => {
    const osc = audioCtx.createOscillator();
    const pGain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(f, t0);
    osc.frequency.exponentialRampToValueAtTime(f * 0.985, t0 + d);
    pGain.gain.setValueAtTime(0.001, t0);
    pGain.gain.linearRampToValueAtTime(g, t0 + 0.018);
    pGain.gain.exponentialRampToValueAtTime(0.0006, t0 + d);
    osc.connect(pGain);
    connectOut(pGain, 0.65);
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
  bGain.gain.setValueAtTime(0.001, t0);
  bGain.gain.linearRampToValueAtTime(0.06, t0 + 0.15);
  bGain.gain.exponentialRampToValueAtTime(0.001, t0 + 1.2);
  breath.connect(bp);
  bp.connect(bGain);
  connectOut(bGain, 0.5);
  breath.start(t0, 0, 1.3);
}

/* Sekiro Deathblow / Execution Seal Stamp (斬) — sharp metallic clack + tectonic drop + eerie ring */
function playSealStampSfx() {
  if (!soundEnabled) return;
  initAudio();
  if (!audioCtx || !noiseBuf) return;
  const t0 = audioCtx.currentTime;

  // 1. Sharp hyoshigi / tsuba clack
  const clack = audioCtx.createBufferSource();
  clack.buffer = noiseBuf;
  const hp = audioCtx.createBiquadFilter();
  hp.type = "bandpass";
  hp.frequency.setValueAtTime(2150, t0);
  hp.Q.value = 4.0;
  const cGain = audioCtx.createGain();
  cGain.gain.setValueAtTime(0.26, t0);
  cGain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.065);
  clack.connect(hp);
  hp.connect(cGain);
  connectOut(cGain, 0.45);
  clack.start(t0, Math.random() * 0.4, 0.08);

  // 2. Deep execution sub-boom
  const boom = audioCtx.createOscillator();
  const bGain = audioCtx.createGain();
  boom.type = "sine";
  boom.frequency.setValueAtTime(96, t0);
  boom.frequency.exponentialRampToValueAtTime(27, t0 + 0.55);
  bGain.gain.setValueAtTime(0.34, t0);
  bGain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.6);
  boom.connect(bGain);
  connectOut(bGain, 0.5);
  boom.start(t0);
  boom.stop(t0 + 0.65);

  // 3. Haunting ritual chime ring (fifth + tritone shimmer)
  [528, 792, 1188].forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, t0 + 0.01);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.99, t0 + 1.1);
    g.gain.setValueAtTime(0.055 / (i + 1), t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0008, t0 + 1.15);
    osc.connect(g);
    connectOut(g, 0.65);
    osc.start(t0 + 0.01);
    osc.stop(t0 + 1.2);
  });
}
