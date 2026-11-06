/* In-game guide pages. KO / EN / JA; other languages fall back to EN. */

const GUIDE_PAGES = {
  KO: [
    { title: "1/5 — 원정",
      body: "• 열두 개의 옥(獄) 중 하나를 고른다. 깊을수록 글자가 어렵다.\n• 시작하면 **시작 덱 10장**이 주어진다. 마음에 들 때까지 다시 뽑을 수 있다.\n• 갈림길마다 **글자 하나**를 고른다. 山은 험하고, 花는 달콤하고, 寺에서는 쉴 수 있다. 다만 글자는 암시일 뿐, 약속이 아니다.\n• 마지막 문 너머의 **옥주(獄主)**를 쓰러뜨리면 그 옥을 빠져나간다." },
    { title: "2/5 — 글자로 싸우기",
      body: "• 매 턴 덱에서 다섯 글자를 쥔다. 글자의 **진짜 뜻**을 살려 행동을 묘사하면 GM이 판정한다.\n• 예: 火로 불꽃을 날린다 · 水로 상처를 씻어낸다 · 石을 쌓아 막는다 · 刀로 벤다.\n• **글자만 써도 된다.** 火車, 火山처럼 진짜 숙어나 뜻이 통하는 조합이면 그 자체로 강한 영창이다. 아무렇게나 늘어놓은 글자는 불발한다.\n• 등급: 不発 · 凡 · 良 · 妙 · 絶. 같은 수를 되풀이하면 한 단계 내려간다." },
    { title: "3/5 — 적의 패",
      body: "• 보스 옆에 **적이 이번 턴에 쥔 글자**가 보인다. 적은 이 글자로 반격한다.\n• 적의 火에 水로 맞서는 식으로 **막거나 받아치면** 반격이 줄거나 사라진다.\n• 로그에는 적의 패와 실제로 쓴 글자가 함께 남는다." },
    { title: "4/5 — 보조 수단",
      body: "• **❓ 질문 (/ask [질문])** — 턴을 쓰지 않고 패의 뜻·조합 힌트를 듣거나, 입력창에 적은 질문을 GM에게 묻는다.\n• **🎲 리롤** — 리롤 횟수(또는 5 HP)로 패를 새로 쥔다.\n• **💬 대화 (/talk [대화])** — 적 원령에게 직접 말을 건넨다. 손패의 한자 뜻을 대화에 실어 설득·위압·공양하면 적의 공격 의도를 흔들거나 무혈로 굴복시킬 수도 있다.\n• **🐉 고신 소환 (/summon)** — 고신 소환 횟수(또는 10 HP)로 고대의 신을 부른다. 그냥 부르면 신이 알아서 싸우고, `/summon 방어 위주로`처럼 쓰면 방향만 정해준다." },
    { title: "5/5 — 전리품 · 기록 · 조작",
      body: "• 이긴 뒤에는 **전리품 하나**를 고른다. 회복, 최대 HP, 글자 추가, 소각, 리롤·고신 횟수 등.\n• 옥을 빠져나가면 **시간 · 턴 · 판관(사용한 AI 모델)**이 기록된다. 판관에 따라 판정의 엄격함이 다르니, 기록에 함께 남긴다.\n• PC: 방향키/WASD + Enter, **Alt+1~5**로 카드 삽입, ESC로 창 닫기.\n• 진행은 자동 저장된다. 새로고침해도 이어진다." }
  ],
  EN: [
    { title: "1/5 — The Descent",
      body: "• Pick one of twelve gaols. The deeper, the harder the kanji.\n• You start with a **10-kanji deck** — redraw it as often as you like.\n• At each fork, choose **a sign kanji**. 山 is steep, 花 smells sweet, 寺 may let you rest. A sign is a hint, never a promise.\n• Defeat the **master of the gaol** behind the last door to walk out." },
    { title: "2/5 — Fighting With Words",
      body: "• Each turn you hold five kanji from your deck. Describe a move that uses their **real meanings**; the GM judges it.\n• e.g. 火 hurls flame · 水 washes a wound clean · 石 stacks into a wall · 刀 cuts.\n• **Kanji alone are enough.** A real compound (火車, 火山) or a combination that makes sense is a strong incantation on its own. A random string of kanji fizzles.\n• Verdicts: 不発 · 凡 · 良 · 妙 · 絶. Repeating the same move drops it one level." },
    { title: "3/5 — The Enemy's Hand",
      body: "• Next to the boss you see **the kanji it holds this turn** — it counterattacks with them.\n• **Block or counter** them (water against its fire) and the counterattack shrinks or vanishes.\n• The log records the enemy's hand and the kanji it actually used." },
    { title: "4/5 — Tools",
      body: "• **❓ Ask (/ask [question])** — no turn spent. Click with an empty box for a full tactical hint, or type a question first to ask the GM.\n• **🎲 Reroll** — spend a Reroll charge (or 5 HP) for a new hand.\n• **💬 Talk (/talk [words])** — speak directly to the enemy. Weave hand kanji into your speech to shake its intent, bargain, or pacify it.\n• **🐉 Ancient god (/summon)** — spend a Summon charge (or 10 HP) to call an old god. Alone it fights for you; `/summon defend` gives it a direction." },
    { title: "5/5 — Spoils · Records · Controls",
      body: "• After a win, **take one spoil**: healing, max HP, a new kanji, a burn, reroll/summon charges…\n• Walking out records **time · turns · judge (the AI model used)** — judges differ in strictness, so the record says who judged.\n• Desktop: Arrows/WASD + Enter, **Alt+1~5** inserts cards, ESC closes popups.\n• Progress saves automatically and survives a refresh." }
  ],
  JA: [
    { title: "1/5 — 探索",
      body: "• 十二の獄から一つを選ぶ。深いほど字は難しい。\n• **初期デッキ10枚**が配られる。気に入るまで何度でも引き直せる。\n• 分かれ道では**字を一つ**選ぶ。山は険しく、花は甘く、寺では休めるかもしれない。字は暗示であって約束ではない。\n• 最後の扉の先の**獄主**を倒せば、その獄を抜けられる。" },
    { title: "2/5 — 字で戦う",
      body: "• 毎ターン、デッキから五字を手にする。字の**本当の意味**を活かした行動を描写すると、GMが裁定する。\n• 例: 火で炎を放つ · 水で傷を洗う · 石を積んで防ぐ · 刀で斬る。\n• **字だけでもよい。** 火車・火山のような実在の熟語や意味の通る組み合わせは、それだけで強い詠唱になる。でたらめな羅列は不発する。\n• 裁定: 不発 · 凡 · 良 · 妙 · 絶。同じ手の繰り返しは一段下がる。" },
    { title: "3/5 — 敵の手札",
      body: "• ボスの横に**敵がこのターン持つ字**が見える。敵はこの字で反撃する。\n• 敵の火に水で応じるように**防ぐ・返す**と、反撃は弱まるか消える。\n• ログには敵の手札と実際に使った字が残る。" },
    { title: "4/5 — 補助",
      body: "• **❓ 質問 (/ask [質問])** — ターンを使わず手札の解説と戦術案を聞くか、入力欄の問いをGMに尋ねる。\n• **🎲 引き直し** — 引き直し回数(または5 HP)で手札を引き直す。\n• **💬 対話 (/talk [言葉])** — 敵の怨霊に直接語りかける。手札の漢字の意味を言葉に込めれば、敵の攻撃意図を鈍らせたり和解できることもある。\n• **🐉 古神召喚 (/summon)** — 古神回数(または10 HP)で古の神を呼ぶ。そのまま呼べば神が勝手に戦い、`/summon 守り重視`のように書けば方針だけ伝える。" },
    { title: "5/5 — 戦利品 · 記録 · 操作",
      body: "• 勝利後は**戦利品を一つ**選ぶ。回復、最大HP、字の追加、焼却、引き直し・古神回数など。\n• 獄を抜けると**時間 · ターン · 裁定者(使用AIモデル)**が記録される。裁定者によって厳しさが違うため、記録に残す。\n• PC: 矢印/WASD + Enter、**Alt+1~5**でカード挿入、ESCで閉じる。\n• 進行は自動保存され、再読み込みしても続く。" }
  ]
};

function getGuidePages() {
  return GUIDE_PAGES[config.lang] || GUIDE_PAGES.EN;
}
