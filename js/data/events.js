/*
 * Path events. Pure data — interpreted by js/game/events.js.
 * Text: EN / KO / JA (ZH falls back to EN). Every option should cost something or risk
 * something; "leave" is always safe and always empty.
 *
 * Effect specs (applied in order):
 *   { hp: n }                 heal (+) or hurt (−); event damage never drops HP below 1
 *   { healPct: n }            heal n% of max HP
 *   { maxHp: n }              raise/lower max HP (current HP follows when raised)
 *   { summonReset: true }     summon cost back to 10
 *   { tokens: n }             free rerolls
 *   { addCard: "pick", choices: n } | { addCard: "random" } | { addCard: "<kanji>" }
 *   { burn: "pick" | "random" }
 *   { dup: "pick" }
 *   { reveal: true }          reveal the outcomes of the next fork
 *   { battle: "normal" | "elite" | "<kanji>" }   fight; spoils follow as usual
 *   { chance: p, win: [...], lose: [...] }
 *   { say: { EN, KO, JA } }   narrative line
 */

const EVT_L = (EN, KO, JA) => ({ EN, KO, JA });

const EVENTS = {
  rest: {
    kanji: "寺",
    title: EVT_L("The Abandoned Temple", "버려진 절", "打ち捨てられた寺"),
    text: EVT_L("A cold altar. The incense burned out long ago, but the silence still holds.",
            "차가운 제단. 향은 오래전에 꺼졌지만 정적만은 아직 남아 있다.",
            "冷えた祭壇。香はとうに燃え尽きたが、静けさだけが残っている。"),
    options: [
      { label: EVT_L("Rest — recover 30% of max HP", "쉰다 — 최대 HP의 30% 회복", "休む — 最大HPの30%回復"), effects: [{ healPct: 30 }] },
      { label: EVT_L("Feed the brazier — burn a kanji", "화로에 넣는다 — 글자 하나를 태운다", "火鉢にくべる — 字を一つ焼く"), effects: [{ burn: "pick" }], when: s => s.deck.length > 5 },
      { label: EVT_L("Pray — summon cost back to 10, 1 free reroll", "기도한다 — 소환 비용 10, 무료 리롤 1", "祈る — 召喚コスト10、無料引き直し1"), effects: [{ summonReset: true }, { tokens: 1 }] }
    ]
  },
  shrine: {
    kanji: "祠",
    title: EVT_L("The Hungry Shrine", "굶주린 사당", "飢えた祠"),
    text: EVT_L("A small shrine. The stone face on it is smiling, and its mouth is wet.",
            "작은 사당. 돌로 된 얼굴이 웃고 있다. 입가가 젖어 있다.",
            "小さな祠。石の顔が笑っている。口元が濡れている。"),
    options: [
      { label: EVT_L("Offer blood (−10 HP) — receive a kanji", "피를 바친다 (−10 HP) — 글자를 받는다", "血を捧げる (−10 HP) — 字を授かる"), effects: [{ hp: -10 }, { addCard: "pick", choices: 4 }] },
      { label: EVT_L("Pray — it may bless you, or bite", "기도한다 — 축복일 수도, 저주일 수도", "祈る — 祝福か、祟りか"),
        effects: [{ chance: 0.5, win: [{ maxHp: 6 }], lose: [{ hp: -8 }] }] },
      { label: EVT_L("Leave", "지나간다", "立ち去る"), effects: [] }
    ]
  },
  well: {
    kanji: "井",
    title: EVT_L("The Old Well", "오래된 우물", "古井戸"),
    text: EVT_L("Something glints far below. The water smells almost sweet.",
            "저 아래에서 무언가 반짝인다. 물에서 묘하게 단 냄새가 난다.",
            "底で何かが光る。水はどこか甘い匂いがする。"),
    options: [
      { label: EVT_L("Drink", "마신다", "飲む"),
        effects: [{ chance: 0.6, win: [{ hp: 20 }], lose: [{ say: EVT_L("The water is foul.", "썩은 물이었다.", "腐った水だった。") }, { hp: -10 }] }] },
      { label: EVT_L("Throw a kanji in — Max HP +5", "글자 하나를 던진다 — 최대 HP +5", "字を一つ投げ込む — 最大HP +5"), effects: [{ burn: "pick" }, { maxHp: 5 }], when: s => s.deck.length > 5 },
      { label: EVT_L("Leave", "지나간다", "立ち去る"), effects: [] }
    ]
  },
  flower: {
    kanji: "花",
    title: EVT_L("The Crimson Flower", "붉은 꽃", "紅い花"),
    text: EVT_L("A flower blooms where nothing should grow. It turns to face you.",
            "아무것도 자랄 수 없는 곳에 꽃이 피어 있다. 꽃이 이쪽으로 고개를 돌린다.",
            "何も育たぬはずの場所に花が咲いている。花がこちらを向いた。"),
    options: [
      { label: EVT_L("Breathe it in", "향을 들이마신다", "香りを吸い込む"),
        effects: [{ chance: 0.5, win: [{ hp: 25 }], lose: [{ say: EVT_L("It was a mouth.", "그건 입이었다.", "それは口だった。") }, { battle: "花" }] }] },
      { label: EVT_L("Pluck it — add 花 to your deck", "꺾는다 — 덱에 花를 넣는다", "摘む — 花をデッキに加える"), effects: [{ hp: -5 }, { addCard: "花" }] },
      { label: EVT_L("Leave", "지나간다", "立ち去る"), effects: [] }
    ]
  },
  corpse: {
    kanji: "屍",
    title: EVT_L("The Clutching Corpse", "무언가를 쥔 시체", "何かを握る屍"),
    text: EVT_L("A body, fingers locked around something small.",
            "시체 하나. 손가락이 작은 무언가를 꽉 움켜쥐고 있다.",
            "屍がひとつ。指が小さな何かを固く握っている。"),
    options: [
      { label: EVT_L("Pry its fingers open", "손가락을 벌린다", "指をこじ開ける"),
        effects: [{ chance: 0.6, win: [{ addCard: "random" }], lose: [{ say: EVT_L("It was not dead.", "죽은 게 아니었다.", "死んではいなかった。") }, { battle: "屍" }] }] },
      { label: EVT_L("Leave", "지나간다", "立ち去る"), effects: [] }
    ]
  },
  swarm: {
    kanji: "蟲",
    title: EVT_L("The Swarm", "벌레떼", "蟲の群れ"),
    text: EVT_L("The floor chitters. Thousands of legs, all moving toward you.",
            "바닥이 사각거린다. 수천 개의 다리가 일제히 이쪽으로 온다.",
            "床がざわめく。無数の脚が一斉にこちらへ来る。"),
    options: [
      { label: EVT_L("Fight", "싸운다", "戦う"), effects: [{ battle: "蟲" }] },
      { label: EVT_L("Run through it (−12 HP)", "뚫고 달린다 (−12 HP)", "突っ切る (−12 HP)"), effects: [{ hp: -12 }] },
      { label: EVT_L("Throw them a kanji (random burn)", "글자 하나를 미끼로 던진다 (무작위 소각)", "字を一つ囮にする (ランダム焼却)"), effects: [{ burn: "random" }], when: s => s.deck.length > 5 }
    ]
  },
  dice: {
    kanji: "賽",
    title: EVT_L("The Bone Gambler", "뼈 주사위 노름꾼", "骨賽の博徒"),
    text: EVT_L("A grinning figure rattles bone dice. \"Your blood for my luck?\"",
            "히죽 웃는 자가 뼈 주사위를 흔든다. \"네 피와 내 운을 바꾸지 않겠나?\"",
            "にやつく者が骨の賽を鳴らす。「お前の血と俺の運、賭けないか?」"),
    options: [
      { label: EVT_L("Bet 15 HP — win: Max HP +12", "15 HP를 건다 — 이기면 최대 HP +12", "15 HPを賭ける — 勝てば最大HP +12"),
        effects: [{ hp: -15 }, { chance: 0.5, win: [{ maxHp: 12 }, { hp: 12 }], lose: [] }] },
      { label: EVT_L("Bet a kanji — win: 3 free rerolls", "글자를 건다 — 이기면 무료 리롤 3", "字を賭ける — 勝てば無料引き直し3"),
        effects: [{ chance: 0.5, win: [{ tokens: 3 }], lose: [{ burn: "random" }] }], when: s => s.deck.length > 5 },
      { label: EVT_L("Leave", "지나간다", "立ち去る"), effects: [] }
    ]
  },
  mirror: {
    kanji: "鏡",
    title: EVT_L("The Other Mirror", "다른 거울", "もう一つの鏡"),
    text: EVT_L("Your reflection is a moment late, and it is holding a kanji.",
            "거울 속의 내가 한 박자 늦게 움직인다. 손에 글자를 쥐고 있다.",
            "鏡の自分が一拍遅れて動く。手に字を握っている。"),
    options: [
      { label: EVT_L("Reach in (Max HP −6) — copy a kanji", "손을 넣는다 (최대 HP −6) — 글자 복제", "手を入れる (最大HP −6) — 字を写す"), effects: [{ maxHp: -6 }, { dup: "pick" }] },
      { label: EVT_L("Shatter it (−8 HP) — summon cost back to 10", "깨뜨린다 (−8 HP) — 소환 비용 10으로", "割る (−8 HP) — 召喚コストを10に"), effects: [{ hp: -8 }, { summonReset: true }] },
      { label: EVT_L("Leave", "지나간다", "立ち去る"), effects: [] }
    ]
  },
  lantern: {
    kanji: "灯",
    title: EVT_L("The Unlit Lantern", "꺼진 등롱", "消えた提灯"),
    text: EVT_L("A paper lantern. The oil inside smells of blood.",
            "종이 등롱 하나. 안에 든 기름에서 피 냄새가 난다.",
            "紙の提灯。中の油は血の匂いがする。"),
    options: [
      { label: EVT_L("Light it with blood (−6 HP) — see the next fork", "피로 불을 켠다 (−6 HP) — 다음 갈림길을 본다", "血で灯す (−6 HP) — 次の分かれ道を見る"), effects: [{ hp: -6 }, { reveal: true }] },
      { label: EVT_L("Take the oil — 1 free reroll", "기름만 챙긴다 — 무료 리롤 1", "油だけ取る — 無料引き直し1"), effects: [{ tokens: 1 }] },
      { label: EVT_L("Leave", "지나간다", "立ち去る"), effects: [] }
    ]
  }
};
