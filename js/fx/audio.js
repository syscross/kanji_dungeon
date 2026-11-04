/* Procedural Web Audio sound effects (no audio files). */
let audioCtx = null;
let soundEnabled = localStorage.getItem("kd_sound") !== "off";

function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
  if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
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
