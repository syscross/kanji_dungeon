/* Paginated in-game guide. Languages without an entry fall back to EN. */

const GUIDE_PAGES = {
  KO: [
    {
      title: "1/5 — 한자 카드 전투",
      body: "• 매 턴 **5장의 한자 카드**가 지급됩니다.\n• 손패 한자의 **진짜 뜻**을 살려 공격·방어·회복 행동을 묘사하면 AI GM이 판정합니다.\n• 글자를 꼭 적지 않아도 됩니다. 패에 水가 있을 때 \"물줄기로 공격\"이라고 쓰면 水를 쓴 것으로 인정됩니다.\n• 반대로 한자만 나열하고 행동이 없으면 주문이 **불발**합니다."
    },
    {
      title: "2/5 — 판정 등급",
      body: "• **不発 FIZZLE** — 카드를 의미 있게 쓰지 않음 / 한자 나열 / 규칙 밖 요구\n• **凡 WEAK** — 카드 1장을 평범하게 사용\n• **良 SOLID** — 뜻에 맞게 일관된 행동\n• **妙 CLEVER** — 여러 카드를 연계하거나 보스·적 패에 정확히 대응\n• **絶 MASTERFUL** — 실제 숙어(熟語) 조합, 절묘한 카운터 등 탁월한 한 수\n• 같은 전술을 반복하면 등급이 한 단계 내려갑니다. 회복·방어도 등급에 따라 강해집니다."
    },
    {
      title: "3/5 — 적의 패와 카운터",
      body: "• 보스 옆에 **적이 이번 턴에 쥔 패**가 공개됩니다. 적은 이 패로 반격합니다.\n• 적이 火를 쥐었다면 내 水·雨로 막는 식의 **방어·카운터 묘사**를 하면 반격 피해가 줄거나 사라집니다.\n• 카드의 `🔍`를 누르면 사전(Jisho)이 열립니다."
    },
    {
      title: "4/5 — 보조 명령",
      body: "• **💡 힌트 (/hint)** : 턴 소모 없이 패의 뜻과 조합 아이디어를 받습니다.\n• **🎲 리롤 (/reroll)** : 5 HP를 내고 패를 새로 뽑습니다.\n• **❓ 질문 (/prompt 질문)** : 한자나 전술을 턴 소모 없이 묻습니다.\n• **🐉 소환 (/summon 지시)** : HP를 바쳐 소환수를 부릅니다. 비용은 10 → 20 → 30…으로 오르고 다음 적에서 초기화됩니다."
    },
    {
      title: "5/5 — 조작 · 세이브 · AI 설정",
      body: "• **PC**: 방향키/WASD + Enter로 메뉴·카드 선택, **Alt+1~5**로 입력 중 카드 삽입, ESC로 창 닫기.\n• **모바일**: 카드를 탭하면 키보드를 띄우지 않고 입력창에 한자가 추가됩니다.\n• 전투 중 나가거나 새로고침해도 자동 저장되며, `🏳️ 원정 포기`만 기록을 지웁니다.\n• 기본은 키 없이 하는 **Free Keyless** 모드입니다. 더 정교한 판정을 원하면 `⚙ 설정`에서 Gemini·Claude·DeepSeek 등 개인 키를 등록하세요."
    }
  ],
  EN: [
    {
      title: "1/5 — Kanji Card Combat",
      body: "• Each turn you hold **5 Kanji cards**.\n• Describe an attack, defense or heal that uses the cards' **real meanings** — the AI GM judges it.\n• You don't have to type the Kanji itself: with 水 in hand, \"I blast it with a torrent of water\" counts as using 水.\n• Merely listing Kanji with no action makes the spell **fizzle**."
    },
    {
      title: "2/5 — Verdicts",
      body: "• **不発 FIZZLE** — no card meaningfully used / bare Kanji list / out-of-game requests\n• **凡 WEAK** — one card used plainly\n• **良 SOLID** — coherent action with correct meanings\n• **妙 CLEVER** — cards combined, or a precise counter to the boss or enemy hand\n• **絶 MASTERFUL** — a real compound word (熟語), a perfect counter, an exceptional move\n• Repeating the same tactic drops the verdict one level. Heals and defenses scale with the verdict too."
    },
    {
      title: "3/5 — Enemy Hand & Counters",
      body: "• The **enemy's current hand** is shown next to the boss; it counterattacks with these cards.\n• If the enemy holds 火, defending with your 水 or 雨 reduces or nullifies its counterattack.\n• Tap `🔍` on a card to open the dictionary (Jisho)."
    },
    {
      title: "4/5 — Commands",
      body: "• **💡 Hint (/hint)** : meanings and combo ideas, no turn spent.\n• **🎲 Reroll (/reroll)** : pay 5 HP to redraw your hand.\n• **❓ Ask (/prompt question)** : ask about a Kanji or tactic, no turn spent.\n• **🐉 Summon (/summon direction)** : pay HP to call a summon. Cost rises 10 → 20 → 30… and resets on the next enemy."
    },
    {
      title: "5/5 — Controls · Saves · AI",
      body: "• **Desktop**: Arrows/WASD + Enter to navigate, **Alt+1~5** to insert cards while typing, ESC closes popups.\n• **Mobile**: tapping a card adds it to the input without popping the keyboard.\n• Runs auto-save when you leave or refresh; only `🏳️ Abandon run` erases them.\n• **Free Keyless** mode is the default. For sharper judging, add your own Gemini / Claude / DeepSeek key in `⚙ Settings`."
    }
  ],
  JA: [
    {
      title: "1/5 — 漢字カード戦闘",
      body: "• 毎ターン **5枚の漢字カード**が配られます。\n• 手札の漢字の**本当の意味**を活かした攻撃・防御・回復を描写すると、AI GMが裁定します。\n• 漢字そのものを書かなくても構いません。手札に水があれば「激流で攻撃」で水を使ったと認められます。\n• 漢字を並べるだけで行動がなければ、呪文は**不発**します。"
    },
    {
      title: "2/5 — 裁定ランク",
      body: "• **不発 FIZZLE** — カードを意味のある形で使っていない / 漢字の羅列 / ゲーム外の要求\n• **凡 WEAK** — カード1枚を平凡に使用\n• **良 SOLID** — 意味に沿った一貫した行動\n• **妙 CLEVER** — 複数カードの連携、またはボス・敵手札への的確な対処\n• **絶 MASTERFUL** — 実在の熟語、完璧なカウンターなど卓越した一手\n• 同じ戦術の繰り返しはランクが一段下がります。回復・防御もランクに応じて強くなります。"
    },
    {
      title: "3/5 — 敵の手札とカウンター",
      body: "• ボスの横に**敵の今の手札**が公開され、敵はこれで反撃します。\n• 敵が火を持っていれば、水・雨で防ぐ描写で反撃ダメージを減らせます。\n• カードの `🔍` で辞書(Jisho)を開けます。"
    },
    {
      title: "4/5 — コマンド",
      body: "• **💡 解説 (/hint)** : ターンを消費せず意味と組み合わせ案を確認。\n• **🎲 引き直し (/reroll)** : 5 HPで手札を引き直す。\n• **❓ 質問 (/prompt 質問)** : 漢字や戦術をターン消費なしで質問。\n• **🐉 召喚 (/summon 指示)** : HPを捧げて召喚。コストは10 → 20 → 30…と上がり、次の敵でリセット。"
    },
    {
      title: "5/5 — 操作 · セーブ · AI",
      body: "• **PC**: 矢印/WASD + Enterで選択、入力中は **Alt+1~5** でカード挿入、ESCで閉じる。\n• **モバイル**: カードをタップするとキーボードを出さずに入力欄へ追加されます。\n• 中断や再読み込みでも自動保存。`🏳️ 探索を放棄` のみ記録が消えます。\n• 既定は **無料キーレス** モード。より精密な裁定には `⚙ 設定` で各社のAPIキーを登録してください。"
    }
  ]
};

function getGuidePages() {
  return GUIDE_PAGES[config.lang] || GUIDE_PAGES.EN;
}
