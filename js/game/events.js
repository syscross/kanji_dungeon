/* Path events (definitions: js/data/events.js). */

function buildQuizEvent(q) {
  const ansText = pickLang(q.ans).replace(/\?$/, "");
  const [c1, c2] = q.prize || [q.kanji, "校"];
  return {
    kanji: q.kanji,
    title: EVT_L(`Signpost Quiz 【${q.kanji}】`, `수수께끼 이정표 【${q.kanji}】`, `謎掛けの立札 【${q.kanji}】`),
    text: EVT_L(
      `A grinning signpost points at 【${q.kanji}】:\n"How do you read this kanji?!"`,
      `히죽거리는 이정표가 【${q.kanji}】 글자를 가리키며 묻는다:\n"이 한자는 뭐라 읽을까용?"`,
      `ニヤつく立札が【${q.kanji}】を指差して問う:\n「この漢字はなんと読むでしょうかぁ？」`
    ),
    options: [
      {
        label: q.ans,
        effects: [
          {
            say: EVT_L(
              `"Ooh, bingo! Here's a special card as your prize~"`,
              `「오~ 정답! 상으로 특산품 카드를 드릴게용~」`,
              `「おぉ〜正解！ご褒美に名物カードをあげようねぇ〜」`
            )
          },
          { addCard: c1 },
          ...(c2 && c2 !== c1 ? [{ addCard: c2 }] : [])
        ]
      },
      {
        label: EVT_L("How the hell should I know?", "내가 어떻게 알아", "知るわけないだろ"),
        effects: [
          {
            say: EVT_L(
              `"Too bad~ The answer was '${ansText}'! Make sure to get it next time~ (You got nothing...)"`,
              `「저런저런~ 정답은 ‘${ansText}’였답니다! 다음엔 꼭 맞추도록 해용~」 (아무것도 얻지 못했다…)`,
              `「あらら〜正解は『${ansText}』でしたぁ！次は絶対当ててねぇ〜」 (何も得られなかった…)`
            )
          }
        ]
      }
    ]
  };
}

function getActiveEventDef() {
  if (state.eventId === "quiz") {
    const q = QUIZ_BANK.find(item => item.kanji === state.quizKanji) || QUIZ_BANK[0];
    return buildQuizEvent(q);
  }
  return EVENTS[state.eventId] || EVENTS.rest;
}

function startEvent(id) {
  if (id === "*") {
    const pool = RANDOM_EVENT_POOL.filter(e => e !== state.lastEventId);
    id = pool[Math.floor(Math.random() * pool.length)];
  }
  state.eventId = id;
  state.lastEventId = id;
  state.phase = "event";

  if (id === "quiz") {
    const dNum = depthNumber(state.depthId);
    const bySign = QUIZ_BANK.find(q => q.kanji === state.sign);
    const byDepth = QUIZ_BANK.filter(q => q.depth === dNum);
    const picked = bySign || (byDepth.length ? byDepth[Math.floor(Math.random() * byDepth.length)] : QUIZ_BANK[Math.floor(Math.random() * QUIZ_BANK.length)]);
    state.quizKanji = picked.kanji;
  }

  const ev = getActiveEventDef();
  logBeat("event-log", `【${ev.kanji}】 ${pickLang(ev.title)}`, [pickLang(ev.text)]);
  saveRunToStorage();
  renderPhase();
}

function availableEventOptions() {
  const ev = getActiveEventDef();
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
  const ev = getActiveEventDef();
  const o = ev.options[i];
  if (!o) return;
  setDockActions([]);
  logMd(`→ ${pickLang(o.label)}`, "choice-log");
  runEffects(o.effects);
}
