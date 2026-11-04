/* Path events (definitions: js/data/events.js). */

function buildQuizEvent(q) {
  const ansText = pickLang(q.ans).replace(/\?$/, "");
  const [c1, c2] = q.prize || [q.kanji, "木"];

  const rightOpt = {
    label: q.ans,
    effects: [
      {
        say: EVT_L(
          `"Ooh, bingo! '${ansText}' is right! Here's a special card as your prize~"`,
          `「오~ 정답! ‘${ansText}’ 맞았어용! 상으로 특산품 카드를 드릴게용~」`,
          `「おぉ〜正解！『${ansText}』ぴったし！ご褒美に名物カードをあげようねぇ〜」`
        )
      },
      { addCard: c1 },
      ...(c2 && c2 !== c1 ? [{ addCard: c2 }] : [])
    ]
  };

  const wrongOpt = q.wrong ? {
    label: q.wrong,
    effects: [
      {
        say: EVT_L(
          `"Pfft, wrong! The right reading is '${ansText}'! Take a bonk on the head~"`,
          `「풉, 틀렸지롱~ 정답은 ‘${ansText}’였답니다! 딱밤 한 대 맞아라~」`,
          `「ぷっ、ハズレ〜！正解は『${ansText}』でしたぁ！デコピン一発〜」`
        )
      },
      { hp: -6 }
    ]
  } : null;

  const idkOpt = {
    label: EVT_L("How the hell should I know?", "내가 어떻게 알아", "知るわけないだろ"),
    effects: [
      {
        say: EVT_L(
          `"Too bad~ The answer was '${ansText}'! Make sure to remember it next time~"`,
          `「저런저런~ 정답은 ‘${ansText}’였답니다! 다음엔 꼭 외워두도록 해용~」`,
          `「あらら〜正解は『${ansText}』でしたぁ！次は絶対覚えておいてねぇ〜」`
        )
      }
    ]
  };

  const choices = wrongOpt
    ? (state.quizSwap ? [wrongOpt, rightOpt, idkOpt] : [rightOpt, wrongOpt, idkOpt])
    : [rightOpt, idkOpt];

  return {
    kanji: q.kanji,
    title: EVT_L(`Signpost Quiz 【${q.kanji}】`, `수수께끼 이정표 【${q.kanji}】`, `謎掛けの立札 【${q.kanji}】`),
    text: EVT_L(
      `A grinning signpost points at 【${q.kanji}】:\n"How do you read this kanji?!"`,
      `히죽거리는 이정표가 【${q.kanji}】 글자를 가리키며 묻는다:\n"이 한자는 뭐라 읽을까용?"`,
      `ニヤつく立札が【${q.kanji}】を指差して問う:\n「この漢字はなんと読むでしょうかぁ？」`
    ),
    options: choices
  };
}

/* Pick a grade-matched NPC kanji for the current depth WITHOUT marking it as an encountered enemy!
 * If the NPC turns out to be a disguised foe (`ambushNpc`), that exact kanji transforms into the enemy portrait. */
function pickEventNpcKanji(depthId) {
  const pool = (typeof DEPTH_NPC_POOLS !== "undefined" && DEPTH_NPC_POOLS[depthId]) || ["人"];
  const defeated = state.defeatedEnemies || [];
  const encountered = state.encounteredEnemies || [];
  const alivePool = pool.filter(k => !defeated.includes(k));
  if (alivePool.length) {
    const unseenAlive = alivePool.filter(k => !encountered.includes(k));
    const candidates = unseenAlive.length ? unseenAlive : alivePool;
    return candidates[Math.floor(Math.random() * candidates.length)];
  }
  const roster = depthRoster(depthId);
  const aliveNormal = (roster.normal || []).filter(k => !defeated.includes(k));
  if (aliveNormal.length) {
    return aliveNormal[Math.floor(Math.random() * aliveNormal.length)];
  }
  return pool[0] || "人";
}

function getActiveEventDef() {
  if (state.eventId === "quiz") {
    const q = QUIZ_BANK.find(item => item.kanji === state.quizKanji) || QUIZ_BANK[0];
    return buildQuizEvent(q);
  }
  const base = EVENTS[state.eventId] || EVENTS.rest;
  if (base.isNpc && state.eventNpcKanji) {
    return {
      ...base,
      kanji: state.eventNpcKanji
    };
  }
  return base;
}

function startEvent(id) {
  if (id === "*") {
    const pool = RANDOM_EVENT_POOL.filter(e => e !== state.lastEventId);
    id = pool[Math.floor(Math.random() * pool.length)];
  }
  state.eventId = id;
  state.lastEventId = id;
  state.phase = "event";

  const baseDef = EVENTS[id];
  if (baseDef && baseDef.isNpc) {
    state.eventNpcKanji = pickEventNpcKanji(state.depthId);
  } else {
    state.eventNpcKanji = "";
  }

  if (id === "quiz") {
    const dNum = depthNumber(state.depthId);
    const bySign = QUIZ_BANK.find(q => q.kanji === state.sign && q.depth <= dNum);
    const byDepth = QUIZ_BANK.filter(q => q.depth === dNum);
    const upToDepth = QUIZ_BANK.filter(q => q.depth <= dNum);
    const pool = byDepth.length ? byDepth : (upToDepth.length ? upToDepth : QUIZ_BANK);
    const picked = bySign || pool[Math.floor(Math.random() * pool.length)];
    state.quizKanji = picked.kanji;
    state.quizSwap = Math.random() < 0.5;
  }

  const ev = getActiveEventDef();
  if (typeof playWhisperSfx === "function") playWhisperSfx();
  logBeat("event-log", `【${ev.kanji}】 ${pickLang(ev.title)}`, [pickLang(ev.text)]);
  saveRunToStorage();
  renderPhase();
}

function availableEventOptions() {
  const ev = getActiveEventDef();
  return ev.options.map((o, i) => ({ o, i })).filter(({ o }) => !o.when || o.when(state));
}

function renderEventOptions() {
  const opts = availableEventOptions();
  const hasLeaveOpt = opts.some(({ o }) => !o.effects || o.effects.length === 0);
  const buttons = opts.map(({ o, i }) => {
    const isLeave = !o.effects || o.effects.length === 0;
    if (isLeave) {
      return {
        label: pickLang(o.label),
        onClick: () => chooseEventOption(i),
        cls: "opt-skip"
      };
    }
    return {
      html: `<span class="opt-text">${escapeHtml(pickLang(o.label))}</span>`,
      onClick: () => chooseEventOption(i),
      cls: "opt-btn"
    };
  });
  if (!hasLeaveOpt && state.eventId !== "swarm" && state.eventId !== "quiz") {
    buttons.push({
      label: t("skipBtn"),
      onClick: skipEvent,
      cls: "opt-skip"
    });
  }
  setDockActions(buttons);
}

function skipEvent() {
  playClickSfx();
  setDockActions([]);
  logMd(`→ ${t("skipBtn")}`, "choice-log");
  advance();
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
