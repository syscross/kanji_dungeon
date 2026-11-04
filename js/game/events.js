/* Path events (definitions: js/data/events.js). */

function startEvent(id) {
  if (id === "*") {
    const pool = RANDOM_EVENT_POOL.filter(e => e !== state.lastEventId);
    id = pool[Math.floor(Math.random() * pool.length)];
  }
  const ev = EVENTS[id];
  state.eventId = id;
  state.lastEventId = id;
  state.phase = "event";
  logBeat("event-log", `【${ev.kanji}】 ${pickLang(ev.title)}`, [pickLang(ev.text)]);
  saveRunToStorage();
  renderPhase();
}

function availableEventOptions() {
  const ev = EVENTS[state.eventId];
  return ev.options.map((o, i) => ({ o, i })).filter(({ o }) => !o.when || o.when(state));
}

function renderEventOptions() {
  setDockActions(availableEventOptions().map(({ o, i }) => ({
    html: `<span class="opt-text">${escapeHtml(pickLang(o.label))}</span>`,
    onClick: () => chooseEventOption(i),
    cls: "opt-btn"
  })));
}

function chooseEventOption(i) {
  playClickSfx();
  const o = EVENTS[state.eventId].options[i];
  setDockActions([]);
  logMd(`→ ${pickLang(o.label)}`, "choice-log");
  runEffects(o.effects);
}
