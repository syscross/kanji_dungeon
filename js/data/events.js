/*
 * Path events. Pure data — interpreted by js/game/events.js.
 * Text: EN / KO / JA (ZH falls back to EN).
 * Note: Random card burn ("burn: random") has been completely removed per design;
 * any card sacrifice lets the player pick the card directly.
 */

const EVT_L = (EN, KO, JA) => ({ EN, KO, JA });

/* Bank for the AI-free "How do you read this Kanji?" (이 한자는 뭐라 읽을까용?) event */
const QUIZ_BANK = [
  { kanji: "茨", depth: 4, ans: EVT_L("Ibaraki (Briar)?", "이바라키 (가시나무 자)?", "いばらき (茨)?"), prize: ["茨", "県"] },
  { kanji: "潟", depth: 4, ans: EVT_L("Niigata (Lagoon)?", "니가타 (개펄 석)?", "にいがた (潟)?"), prize: ["潟", "塩"] },
  { kanji: "栃", depth: 4, ans: EVT_L("Tochigi (Horse-chestnut)?", "토치기 (상수리나무)?", "とちぎ (栃)?"), prize: ["栃", "木"] },
  { kanji: "阪", depth: 4, ans: EVT_L("Osaka (Slope)?", "오사카 (비탈 판)?", "おおさか (阪)?"), prize: ["阪", "府"] },
  { kanji: "埼", depth: 4, ans: EVT_L("Saitama (Promontory)?", "사이타마 (갑 기)?", "さいたま (埼)?"), prize: ["埼", "玉"] },
  { kanji: "媛", depth: 4, ans: EVT_L("Ehime (Princess)?", "에히메 (아씨 원)?", "えひめ (媛)?"), prize: ["媛", "花"] },
  { kanji: "阜", depth: 4, ans: EVT_L("Gifu (Mound)?", "기후 (언덕 부)?", "ぎふ (阜)?"), prize: ["阜", "岐"] },
  { kanji: "校", depth: 1, ans: EVT_L("Gakkou (School)?", "학교 교 (がっこう)?", "がっこう (学校)?"), prize: ["校", "休"] },
  { kanji: "村", depth: 1, ans: EVT_L("Mura (Village)?", "마을 촌 (むら)?", "むら (村)?"), prize: ["村", "田"] },
  { kanji: "社", depth: 2, ans: EVT_L("Yashiro (Shrine / Company)?", "신사·회사 사 (やしろ)?", "やしろ・しゃ (社)?"), prize: ["社", "紙"] },
  { kanji: "畑", depth: 3, ans: EVT_L("Hatake (Dry field)?", "화전·밭 전 (はたけ)?", "はたけ (畑)?"), prize: ["畑", "豆"] },
  { kanji: "墓", depth: 5, ans: EVT_L("Haka (Grave)?", "무덤 묘 (はか)?", "はか (墓)?"), prize: ["墓", "骨"] },
  { kanji: "臓", depth: 6, ans: EVT_L("Zou (Viscera / Organs)?", "오장육부 장 (ぞう)?", "ぞう (臓)?"), prize: ["臓", "血"] },
  { kanji: "峠", depth: 7, ans: EVT_L("Touge (Mountain pass)?", "고개 상 (とうげ)?", "とうげ (峠)?"), prize: ["峠", "風"] },
  { kanji: "獄", depth: 8, ans: EVT_L("Goku (Prison / Hell)?", "감옥·지옥 옥 (ごく)?", "ごく (獄)?"), prize: ["獄", "鎖"] },
  { kanji: "棺", depth: 9, ans: EVT_L("Hitsugi (Coffin)?", "관 관 (ひつぎ)?", "ひつぎ (棺)?"), prize: ["棺", "釘" in {} ? "釘" : "木"] },
  { kanji: "顎", depth: 10, ans: EVT_L("Ago (Jaw / Chin)?", "턱 악 (あご)?", "あご (顎)?"), prize: ["顎", "歯"] },
  { kanji: "鰐", depth: 11, ans: EVT_L("Wani (Crocodile)?", "악어 악 (わに)?", "わに (鰐)?"), prize: ["鰐", "水"] },
  { kanji: "髑髏", depth: 12, ans: EVT_L("Dokuro (Weather-beaten skull)?", "도쿠로 (해골 독루)?", "どくろ (髑髏)?"), prize: ["髑髏", "骨"] },
  { kanji: "饕餮", depth: 12, ans: EVT_L("Toutetsu (Gluttonous fiend)?", "도철 (탐욕스러운 괴수)?", "とうてつ (饕餮)?"), prize: ["饕餮", "喰"] }
];

const EVENTS = {
  quiz: {
    kanji: "謎",
    title: EVT_L("The Grinning Signpost", "히죽거리는 이정표", "ニヤつく立札"),
    text: EVT_L("A warped wooden sign leans out of the dark: \"Hey traveler~ Do you know how to read this kanji?\"",
            "어둠 속에서 뒤틀린 나무 표지판이 불쑥 고개를 내민다. 「이봐 나그네~ 이 한자는 뭐라 읽을까용?」",
            "闇から歪んだ立札がぬっと顔を出す。「おい旅人〜、この漢字はなんと読むか知ってるかぁ？」"),
    options: [] // dynamically populated in js/game/events.js
  },
  rest: {
    kanji: "寺",
    title: EVT_L("The Abandoned Temple", "버려진 절", "打ち捨てられた寺"),
    text: EVT_L("A cold altar. The incense burned out long ago, but the silence still holds.",
            "차가운 제단. 향은 오래전에 꺼졌지만 정적만은 아직 남아 있다.",
            "冷えた祭壇。香はとうに燃え尽きたが、静けさだけが残っている。"),
    options: [
      { label: EVT_L("Rest — recover 30% of max HP", "쉰다 — 최대 HP의 30% 회복", "休む — 最大HPの30%回復"), effects: [{ healPct: 30 }] },
      { label: EVT_L("Feed the brazier — burn a kanji from your bag", "화로에 넣는다 — 챙긴 글자 하나를 태운다", "火鉢にくべる — 袋の字を一つ焼く"), effects: [{ burn: "pick" }], when: s => s.deck.length > 0 },
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
      { label: EVT_L("Throw a kanji in — Max HP +6", "챙긴 글자 하나를 던진다 — 최대 HP +6", "字を一つ投げ込む — 最大HP +6"), effects: [{ burn: "pick", then: [{ maxHp: 6 }] }], when: s => s.deck.length > 0 },
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
        effects: [{ chance: 0.55, win: [{ hp: 25 }], lose: [{ say: EVT_L("It was a mouth.", "그건 입이었다.", "それは口だった。") }, { battle: "花" }] }] },
      { label: EVT_L("Pluck it — add 花 to your bag", "꺾는다 — 가방에 花를 챙긴다", "摘む — 花を袋に加える"), effects: [{ hp: -5 }, { addCard: "花" }] },
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
        effects: [{ chance: 0.65, win: [{ addCard: "pick", choices: 3 }], lose: [{ say: EVT_L("It was not dead.", "죽은 게 아니었다.", "死んではいなかった。") }, { battle: "屍" }] }] },
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
      { label: EVT_L("Run through it (−10 HP)", "뚫고 달린다 (−10 HP)", "突っ切る (−10 HP)"), effects: [{ hp: -10 }] },
      { label: EVT_L("Toss a chosen kanji as bait", "글자 하나를 골라 미끼로 던진다", "字を選んで囮にする"), effects: [{ burn: "pick" }], when: s => s.deck.length > 0 }
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
      { label: EVT_L("Wager 8 HP — win: 3 free rerolls & a kanji", "8 HP를 건다 — 이기면 무료 리롤 3 + 글자 획득", "8 HPを賭ける — 勝てば無料引き直し3 + 字を獲得"),
        effects: [{ hp: -8 }, { chance: 0.55, win: [{ tokens: 3 }, { addCard: "pick", choices: 3 }], lose: [] }] },
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
      { label: EVT_L("Reach in (Max HP −6) — copy a kanji", "손을 넣는다 (최대 HP −6) — 글자 복제", "手を入れる (最大HP −6) — 字を写す"), effects: [{ maxHp: -6 }, { dup: "pick" }], when: s => s.deck.length > 0 },
      { label: EVT_L("Shatter it (−6 HP) — take a shard (鏡) & reset summon", "깨뜨린다 (−6 HP) — 거울 조각(鏡)을 챙기고 소환 비용 10으로", "割る (−6 HP) — 鏡の欠片を拾い召喚コスト10に"), effects: [{ hp: -6 }, { addCard: "鏡" }, { summonReset: true }] },
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
      { label: EVT_L("Take the lantern — add 灯 & 1 free reroll", "등롱을 챙긴다 — 灯 획득 + 무료 리롤 1", "提灯を持ち去る — 灯を獲得 + 無料引き直し1"), effects: [{ addCard: "灯" }, { tokens: 1 }] },
      { label: EVT_L("Leave", "지나간다", "立ち去る"), effects: [] }
    ]
  }
};
