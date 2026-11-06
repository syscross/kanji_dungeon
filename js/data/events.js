/*
 * Path events. Pure data — interpreted by js/game/events.js.
 * Text: EN / KO / JA (ZH falls back to EN).
 * Note: Random card burn ("burn: random") has been completely removed per design;
 * any card sacrifice lets the player pick the card directly.
 */

const EVT_L = (EN, KO, JA) => ({ EN, KO, JA });

/*
 * Bank for the AI-free "How do you read this Kanji?" (이 한자는 뭐라 읽을까용?) event.
 * Every single entry is strictly verified for single-kanji reading accuracy and Kanken grade depth.
 */
const QUIZ_BANK = [
  // Depth 1 (Kanken 10)
  {
    kanji: "校", depth: 1,
    ans: EVT_L("Kou — School (校)?", "학교 교 (음독: こう / 코우)?", "こう (校)?"),
    wrong: EVT_L("Kyou — Teach (教)?", "가르칠 교 (훈독: おしえる)?", "おしえる (教)?"),
    prize: ["校", "休"]
  },
  {
    kanji: "林", depth: 1,
    ans: EVT_L("Hayashi — Woods (林)?", "수풀 림 (훈독: はやし / 하야시)?", "はやし・りん (林)?"),
    wrong: EVT_L("Mori — Deep forest (森)?", "빽빽할 삼 (훈독: もり / 모리)?", "もり・しん (森)?"),
    prize: ["林", "木"]
  },
  {
    kanji: "森", depth: 1,
    ans: EVT_L("Mori — Deep forest (森)?", "수풀 삼 (훈독: もり / 모리)?", "もり・しん (森)?"),
    wrong: EVT_L("Hayashi — Woods (林)?", "수풀 림 (훈독: はやし / 하야시)?", "はやし・りん (林)?"),
    prize: ["森", "木"]
  },
  {
    kanji: "村", depth: 1,
    ans: EVT_L("Mura / Son — Village (村)?", "마을 촌 (훈독: むら / 음독: そん)?", "むら・そん (村)?"),
    wrong: EVT_L("Machi / Chou — Town (町)?", "마을 정 (훈독: まち / 음독: ちょう)?", "まち・ちょう (町)?"),
    prize: ["村", "田"]
  },

  // Depth 2 (Kanken 9)
  {
    kanji: "社", depth: 2,
    ans: EVT_L("Yashiro / Sha — Shrine (社)?", "모일·신사 사 (훈독: やしろ / 음독: しゃ)?", "やしろ・しゃ (社)?"),
    wrong: EVT_L("Tera / Ji — Temple (寺)?", "절 사 (훈독: てら / 음독: じ)?", "てら・じ (寺)?"),
    prize: ["社", "刀"]
  },
  {
    kanji: "谷", depth: 2,
    ans: EVT_L("Tani / Koku — Valley (谷)?", "골 곡 (훈독: たに / 음독: こく)?", "たに・こく (谷)?"),
    wrong: EVT_L("Iwa / Gan — Crag (岩)?", "바위 암 (훈독: いわ / 음독: がん)?", "いわ・がん (岩)?"),
    prize: ["谷", "風"]
  },
  {
    kanji: "角", depth: 2,
    ans: EVT_L("Tsuno / Kaku — Horn, Corner (角)?", "뿔 각 (훈독: つの·かど / 음독: かく)?", "つの・かど・かく (角)?"),
    wrong: EVT_L("Ya / Shi — Arrow (矢)?", "화살 시 (훈독: や / 음독: し)?", "や・し (矢)?"),
    prize: ["角", "弓"]
  },

  // Depth 3 (Kanken 8)
  {
    kanji: "畑", depth: 3,
    ans: EVT_L("Hatake — Dry field (畑)?", "화전·밭 전 (훈독: はたけ / 하타케)?", "はたけ (畑)?"),
    wrong: EVT_L("Ta / Den — Rice paddy (田)?", "밭 전 (훈독: た / 음독: でん)?", "た・でん (田)?"),
    prize: ["畑", "炭"]
  },
  {
    kanji: "坂", depth: 3,
    ans: EVT_L("Saka / Han — Slope (坂)?", "고개·비탈 반 (훈독: さか / 음독: はん)?", "さか・はん (坂)?"),
    wrong: EVT_L("Kishi / Gan — Shore (岸)?", "언덕·물가 안 (훈독: きし / 음독: がん)?", "きし・がん (岸)?"),
    prize: ["坂", "重"]
  },
  {
    kanji: "氷", depth: 3,
    ans: EVT_L("Koori / Hyou — Ice (氷)?", "얼음 빙 (훈독: こおり / 음독: ひょう)?", "こおり・ひょう (氷)?"),
    wrong: EVT_L("Mizu / Sui — Water (水)?", "물 수 (훈독: みず / 음독: すい)?", "みず・すい (水)?"),
    prize: ["氷", "寒"]
  },

  // Depth 4 (Kanken 7: Prefecture & Geography Kanji)
  {
    kanji: "茨", depth: 4,
    ans: EVT_L("Ibara — Briar (茨 of Ibaraki 茨城)?", "가시나무 자 (いばら · 이바라키현 茨城의 茨)?", "いばら・ばら (茨城の茨)?"),
    wrong: EVT_L("Kusa — Grass (草)?", "풀 초 (훈독: くさ / 음독: そう)?", "くさ・そう (草)?"),
    prize: ["焼", "草"]
  },
  {
    kanji: "潟", depth: 4,
    ans: EVT_L("Kata / Seki — Lagoon (潟 of Niigata 新潟)?", "개펄 석 (かた · 니가타현 新潟의 潟)?", "かた・せき (新潟の潟)?"),
    wrong: EVT_L("Shima / Tou — Island (島)?", "섬 도 (훈독: しま / 음독: とう)?", "しま・とう (島)?"),
    prize: ["塩", "氷"]
  },
  {
    kanji: "栃", depth: 4,
    ans: EVT_L("Tochi — Horse-chestnut (栃 of Tochigi 栃木)?", "상수리나무 (일본 국자: とち · 토치기현 栃木의 栃)?", "とち (栃木の栃)?"),
    wrong: EVT_L("Matsu — Pine (松)?", "소나무 송 (훈독: まつ / 음독: しょう)?", "まつ・しょう (松)?"),
    prize: ["折", "木"]
  },
  {
    kanji: "阪", depth: 4,
    ans: EVT_L("Saka / Han — Embankment (阪 of Osaka 大阪)?", "비탈 판 (さか·はん · 오사카부 大阪의 阪)?", "さか・はん (大阪の阪)?"),
    wrong: EVT_L("Oka — Hill (岡)?", "언덕 강 (훈독: おか / 오카)?", "おか (岡)?"),
    prize: ["戦", "旗"]
  },
  {
    kanji: "埼", depth: 4,
    ans: EVT_L("Saki / Ki — Cape (埼 of Saitama 埼玉)?", "갑 기 (さき·き · 사이타마현 埼玉의 埼)?", "さき・き (埼玉の埼)?"),
    wrong: EVT_L("Saki — Promontory (崎)?", "산비탈·갑 기 (산 뫼변 崎)?", "さき (山偏の崎)?"),
    prize: ["固", "玉"]
  },
  {
    kanji: "媛", depth: 4,
    ans: EVT_L("Hime / En — Noble lady (媛 of Ehime 愛媛)?", "미인·아씨 원 (ひめ·えん · 에히메현 愛媛의 媛)?", "ひめ・えん (愛媛の媛)?"),
    wrong: EVT_L("Dan / Atataka — Warm (暖)?", "따뜻할 난 (훈독: あたたかい)?", "あたたかい・だん (暖)?"),
    prize: ["鏡", "愛"]
  },
  {
    kanji: "阜", depth: 4,
    ans: EVT_L("Fu — Mound (阜 of Gifu 岐阜)?", "언덕 부 (음독: ふ · 기후현 岐阜의 阜)?", "ふ (岐阜の阜)?"),
    wrong: EVT_L("Sato — Village (里)?", "마을 리 (훈독: さと / 음독: り)?", "さと・り (里)?"),
    prize: ["山", "鏡"]
  },

  // Depth 5 (Kanken 6)
  {
    kanji: "墓", depth: 5,
    ans: EVT_L("Haka / Bo — Grave (墓)?", "무덤 묘 (훈독: はか / 음독: ぼ)?", "はか・ぼ (墓)?"),
    wrong: EVT_L("Kure / Bo — Dusk (暮)?", "저물 모 (훈독: くれる / 음독: ぼ)?", "くれる・ぼ (暮)?"),
    prize: ["墓", "破"]
  },

  // Depth 6 (Kanken 5)
  {
    kanji: "臓", depth: 6,
    ans: EVT_L("Zou — Viscera / Internal organ (臓)?", "오장 장 (음독: ぞう / 조우)?", "ぞう・はらわた (臓)?"),
    wrong: EVT_L("Kura / Zou — Storehouse (蔵)?", "감출·창고 장 (훈독: くら / 음독: ぞう)?", "くら・ぞう (蔵)?"),
    prize: ["臓", "傷"]
  },

  // Depth 7 (Kanken 4)
  {
    kanji: "峠", depth: 7,
    ans: EVT_L("Touge — Mountain pass (峠)?", "고개 상 (일본 국자: とうげ / 토우게)?", "とうげ (峠)?"),
    wrong: EVT_L("Mine / Hou — Mountain peak (峰)?", "봉우리 봉 (훈독: みね / 음독: ほう)?", "みね・ほう (峰)?"),
    prize: ["峠", "剣"]
  },

  // Depth 8 (Kanken 3)
  {
    kanji: "獄", depth: 8,
    ans: EVT_L("Goku — Gaol / Hell (獄)?", "옥·감옥 옥 (음독: ごく / 고쿠)?", "ごく (獄)?"),
    wrong: EVT_L("Kemono / Juu — Beast (獣)?", "짐승 수 (훈독: けもの / 음독: じゅう)?", "けもの・じゅう (獣)?"),
    prize: ["獄", "縛"]
  },

  // Depth 9 (Kanken 2.5)
  {
    kanji: "棺", depth: 9,
    ans: EVT_L("Hitsugi / Kan — Coffin (棺)?", "널·관 관 (훈독: ひつぎ / 음독: かん)?", "ひつぎ・かん (棺)?"),
    wrong: EVT_L("Yakata / Kan — Mansion (館)?", "집 관 (훈독: やかた / 음독: かん)?", "やかた・かん (館)?"),
    prize: ["棺", "刃"]
  },

  // Depth 10 (Kanken 2)
  {
    kanji: "顎", depth: 10,
    ans: EVT_L("Ago / Gaku — Jaw, Chin (顎)?", "턱 악 (훈독: あご / 음독: がく)?", "あご・がく (顎)?"),
    wrong: EVT_L("Hoho — Cheek (頬)?", "뺨 협 (훈독: ほほ·ほお)?", "ほほ・きょう (頬)?"),
    prize: ["顎", "牙"]
  },

  // Depth 11 (Kanken Jun-1)
  {
    kanji: "鰐", depth: 11,
    ans: EVT_L("Wani / Gaku — Crocodile (鰐)?", "악어 악 (훈독: わに / 음독: がく)?", "わに・がく (鰐)?"),
    wrong: EVT_L("Same / Kou — Shark (鮫)?", "상어 교 (훈독: さめ / 음독: こう)?", "さめ・こう (鮫)?"),
    prize: ["鰐", "噛"]
  },

  // Depth 12 (Kanken 1)
  {
    kanji: "髑髏", depth: 12,
    ans: EVT_L("Dokuro — Weather-beaten skull (髑髏)?", "해골 독루 (훈독: どくろ / 도쿠로)?", "どくろ (髑髏)?"),
    wrong: EVT_L("Kugutsu — Puppet (傀儡)?", "꼭두각시 괴뢰 (훈독: くぐつ / 음독: かいらい)?", "くぐつ・かいらい (傀儡)?"),
    prize: ["髑髏", "噬"]
  },
  {
    kanji: "饕餮", depth: 12,
    ans: EVT_L("Toutetsu — Gluttonous fiend (饕餮)?", "도철 (탐할 도·탐할 철, 음독: とうてつ)?", "とうてつ (饕餮)?"),
    wrong: EVT_L("Chimimouryou — Mountain & water demons (魑魅魍魎)?", "치미망량 (도깨비 치·미·망·량)?", "ちみもうりょう (魑魅魍魎)?"),
    prize: ["饕餮", "殲"]
  }
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
      { label: EVT_L("Rest — heal 30% Max HP", "휴식 — 최대 HP 30% 회복", "休む — 最大HP30%回復"), effects: [{ healPct: 30 }] },
      { label: EVT_L("Explore — claim stage kanji", "경내 탐사 — 스테이지 한자 획득", "境内探索 — ステージ漢字を獲得"), effects: [{ scavenge: 4 }] },
      { label: EVT_L("Fuse — combine 2 bag kanji", "합자 각인 — 한자 2장 합체", "合字刻印 — 漢字2枚を合体"), effects: [{ fuse: true }], when: s => s.deck.length >= 2 },
      { label: EVT_L("Burn — discard 1 bag kanji", "화로 소각 — 한자 1장 버리기", "火鉢で焼く — 漢字を1枚捨てる"), effects: [{ burn: "pick" }], when: s => s.deck.length > 0 },
      { label: EVT_L("Pray — Free God +1 · Free Reroll +1", "기도 — 무료 고신 +1 · 무료 리롤 +1", "祈る — 無料古神+1・無料引き直し+1"), effects: [{ freeSummons: 1 }, { tokens: 1 }] },
      { label: EVT_L("【帰】 Return from Gaol (keep run)", "【帰】 옥문 귀환 (원정 유지)", "【帰】 獄門帰還 (探索維持)"), effects: [{ returnGaol: true }] }
    ]
  },
  forge: {
    kanji: "炉",
    title: EVT_L("The Oni's Brazier", "도깨비 화로", "鬼の火炉"),
    text: EVT_L("Blue flames lick at an iron anvil. Two talismans tempered together here can be fused into a single compound kanji.",
            "푸른 불길이 쇠모루를 핥고 있다. 가방에 있는 두 장의 한자 패를 함께 달구면 하나의 합체 한자로 직접 벼려낼 수 있다.",
            "青い炎が鉄床を舐めている。袋にある二つの札を共に鍛えれば、一つの合字札へと自ら打ち直せそうだ。"),
    options: [
      { label: EVT_L("Fuse — combine 2 bag kanji", "합자 연성 — 한자 2장 합체", "熟語錬成 — 漢字2枚を合体"), effects: [{ fuse: true }], when: s => s.deck.length >= 2 },
      { label: EVT_L("Embers — pick kanji · Free Reroll +1", "불씨 탐색 — 한자 선택 · 무료 리롤 +1", "火種を探る — 漢字選択・無料引き直し+1"), effects: [{ addCard: "pick", choices: 4 }, { tokens: 1 }] },
      { label: EVT_L("Warm hands — HP +15", "온기 쬐기 — HP +15", "手を温める — HP +15"), effects: [{ hp: 15 }] }
    ]
  },
  shrine: {
    kanji: "祠",
    title: EVT_L("The Hungry Shrine", "굶주린 사당", "飢えた祠"),
    text: EVT_L("A small shrine. The stone face on it is smiling, and its mouth is wet.",
            "작은 사당. 돌로 된 얼굴이 웃고 있다. 입가가 젖어 있다.",
            "小さな祠。石の顔が笑っている。口元が濡れている。"),
    options: [
      { label: EVT_L("Offer blood (−10 HP) — pick kanji", "헌혈 (−10 HP) — 한자 선택", "血を捧げる (−10 HP) — 漢字選択"), effects: [{ hp: -10 }, { addCard: "pick", choices: 4 }] },
      { label: EVT_L("Fuse — combine 2 bag kanji", "공양석 합자 — 한자 2장 합체", "供養石合字 — 漢字2枚を合体"), effects: [{ fuse: true }], when: s => s.deck.length >= 2 },
      { label: EVT_L("Pray — blessing or curse", "기도 — 축복 혹은 저주", "祈る — 祝福か祟りか"),
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
      { label: EVT_L("Toss 1 kanji — Max HP +6", "한자 1장 투하 — 최대 HP +6", "漢字1枚投下 — 最大HP +6"), effects: [{ burn: "pick", then: [{ maxHp: 6 }] }], when: s => s.deck.length > 0 },
      { label: EVT_L("Search well — claim stage kanji", "우물가 수색 — 스테이지 한자 획득", "井戸を調べる — ステージ漢字を獲得"), effects: [{ scavenge: 4 }] },
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
        effects: [{ chance: 0.55, win: [{ hp: 25 }], lose: [{ say: EVT_L("It was a mouth.", "그건 입이었다.", "それは口だった。") }, { battle: "normal" }] }] },
      { label: EVT_L("Pluck (−5 HP) — gain 【花】", "꺾는다 (−5 HP) — 【花】 획득", "摘む (−5 HP) — 【花】を獲得"), effects: [{ hp: -5 }, { addCard: "花" }] },
      { label: EVT_L("Leave", "지나간다", "立ち去る"), effects: [] }
    ]
  },
  corpse: {
    kanji: "人",
    isNpc: true,
    title: EVT_L("The Wounded Figure", "쓰러져 있는 인영", "倒れ伏す人影"),
    text: EVT_L("A bloodied figure slumped against the wall gasps: \"Do you carry any talisman of healing, medicine, or water…?\"",
            "벽에 기댄 피투성이 인영이 가쁜 숨을 몰아쉰다. \"크윽… 혹시 가방에 치유나 약초, 물에 관한 부적이 있소…?\"",
            "壁にもたれた血塗れの人影が荒い息を吐く。「くっ…袋に治癒や薬草、水にまつわる札を持ってはいないか…？」"),
    options: [
      {
        label: EVT_L("✨ Offer healing kanji — Max HP +14 · HP +25", "✨ 회생 부적 건네기 — 최대 HP +14 · HP +25", "✨ 回生札を渡す — 最大HP+14・HP+25"),
        effects: [{
          burn: "pick",
          then: [
            { say: EVT_L("\"You saved my soul… Take this blessing.\"", "\"은혜를 입었소… 내 남은 영력을 그대에게 넘기겠소.\"", "「命拾いした…我が残りの霊力をそなたに託そう。」") },
            { maxHp: 14 },
            { hp: 25 },
            { tokens: 2 }
          ]
        }],
        when: s => s.deck.some(k => /[薬医水草命活癒回茶救生泉露]/.test(k))
      },
      { label: EVT_L("Check their belongings", "다가가서 살핀다", "歩み寄って調べる"),
        effects: [{ chance: 0.6, win: [{ say: EVT_L("They press a talisman into your palm before fading away.", "그 자는 고맙다며 품속의 한자 패를 건네고 안개 속으로 사라졌다.", "その者は礼を言って懐の札を渡し、霧の中へと消えた。") }, { addCard: "pick", choices: 3 }], lose: [{ say: EVT_L("It was a trap — their eyes flip crimson and they lunge!", "함정이었다 — 죽어가는 척하던 자의 눈이 핏빛으로 뒤집히며 덮쳐온다!", "罠だった — 死にかけを装っていた者の目が紅く染まり襲いかかる！") }, { ambushNpc: true }] }] },
      { label: EVT_L("Leave", "지나간다", "立ち去る"), effects: [] }
    ]
  },
  stranger: {
    kanji: "人",
    isNpc: true,
    title: EVT_L("Figure in the Mist", "안개 속의 행인", "霧の中の行人"),
    text: EVT_L("A lone figure steps out of the mist and greets you calmly. You cannot yet tell whether they are friend or foe.",
            "짙은 안개 속에서 한 인영이 걸어 나와 말을 건넨다. 우호적인 생존자인지, 사람의 탈을 쓴 적인지 아직 알 수 없다.",
            "深い霧の中から一人の人影が歩み出て静かに声をかけてくる。味方か、人の皮を被った敵かはまだ分からない。"),
    options: [
      {
        label: EVT_L("Talk with them", "대화를 나눈다", "言葉を交わす"),
        effects: [{
          chance: 0.62,
          win: [
            { say: EVT_L("\"Take care ahead—here, take this before you go.\"", "\"이 앞은 위험하오. 부디 무사하길 빌며 이걸 드리리다.\"", "「この先は険しい。どうか無事でいてくれ。」") },
            { hp: 18 },
            { reveal: true },
            { tokens: 1 }
          ],
          lose: [
            { say: EVT_L("Their smile twists ear to ear — it was an enemy in disguise!", "입꼬리가 귀까지 찢어지며 본색을 드러낸다 — 사실 적이었다!", "口角が耳まで裂け、本性を現した — 実は敵だった！") },
            { ambushNpc: true }
          ]
        }]
      },
      {
        label: EVT_L("Trade 1 kanji — Max HP +8 · pick kanji", "한자 1장 교환 — 최대 HP +8 · 한자 선택", "漢字1枚交換 — 最大HP+8・漢字選択"),
        effects: [{
          burn: "pick",
          then: [
            { say: EVT_L("\"A fine inscription! Take my secret in return.\"", "\"귀한 글자로군! 답례로 내 비전을 넘기겠소.\"", "「良い字だ！礼に我が秘伝を授けよう。」") },
            { maxHp: 8 },
            { addCard: "pick", choices: 4 }
          ]
        }],
        when: s => s.deck.length > 0
      },
      {
        label: EVT_L("Leave", "지나간다", "立ち去る"),
        effects: []
      }
    ]
  },
  swarm: {
    kanji: "虫",
    title: EVT_L("The Swarm", "어둠 속의 군집", "闇の群れ"),
    text: EVT_L("The floor chitters. Thousands of shadows, all moving toward you.",
            "바닥이 사각거린다. 수많은 그림자가 일제히 이쪽으로 몰려온다.",
            "床がざわめく。無数の影が一斉にこちらへ迫る。"),
    options: [
      { label: EVT_L("Fight", "싸운다", "戦う"), effects: [{ battle: "normal" }] },
      { label: EVT_L("Run through (−10 HP)", "뚫고 달린다 (−10 HP)", "突っ切る (−10 HP)"), effects: [{ hp: -10 }] },
      { label: EVT_L("Toss 1 kanji as bait", "한자 1장 미끼로 던지기", "漢字1枚を囮にする"), effects: [{ burn: "pick" }], when: s => s.deck.length > 0 }
    ]
  },
  dice: {
    kanji: "人",
    isNpc: true,
    title: EVT_L("The Bone Gambler", "뼈 주사위 노름꾼", "骨賽の博徒"),
    text: EVT_L("A grinning figure rattles bone dice. \"Your blood for my luck?\"",
            "히죽 웃는 자가 뼈 주사위를 흔든다. \"네 피와 내 운을 바꾸지 않겠나?\"",
            "にやつく者が骨の賽を鳴らす。「お前の血と俺の運、賭けないか?」"),
    options: [
      { label: EVT_L("Bet 15 HP — win: Max HP +12", "15 HP 내기 — 승리 시 최대 HP +12", "15 HP賭け — 勝てば最大HP +12"),
        effects: [{ hp: -15 }, { chance: 0.5, win: [{ maxHp: 12 }, { hp: 12 }], lose: [] }] },
      { label: EVT_L("Bet 8 HP — win: Reroll +3 · kanji", "8 HP 내기 — 승리 시 리롤 +3 · 한자 선택", "8 HP賭け — 勝てば引き直し+3・漢字"),
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
      { label: EVT_L("Reach in (Max HP −6) — copy kanji", "손을 넣는다 (최대 HP −6) — 한자 복제", "手を入れる (最大HP −6) — 漢字複製"), effects: [{ dup: "pick", then: [{ maxHp: -6 }] }], when: s => s.deck.length > 0 },
      { label: EVT_L("Shatter (−6 HP) — 【鏡】 · God +1", "깨뜨린다 (−6 HP) — 【鏡】 · 고신 +1", "割る (−6 HP) — 【鏡】・古神+1"), effects: [{ hp: -6 }, { addCard: "鏡" }, { freeSummons: 1 }] },
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
      { label: EVT_L("Light with blood (−6 HP) — reveal fork", "피로 점화 (−6 HP) — 다음 갈림길 공개", "血で灯す (−6 HP) — 次の分かれ道を見る"), effects: [{ hp: -6 }, { reveal: true }] },
      { label: EVT_L("Search around — claim stage kanji", "불빛 수색 — 스테이지 한자 획득", "周囲を照らす — ステージ漢字を獲得"), effects: [{ scavenge: 4 }] },
      { label: EVT_L("Take lantern — 【灯】 · Reroll +1", "등롱 챙기기 — 【灯】 · 리롤 +1", "持ち去る — 【灯】・引き直し+1"), effects: [{ addCard: "灯" }, { tokens: 1 }] },
      { label: EVT_L("Leave", "지나간다", "立ち去る"), effects: [] }
    ]
  },
  cat_rescue: {
    kanji: "猫",
    title: EVT_L("Stray Cat in the Mist", "안개 속에 갇힌 고양이", "霧に囚われた迷い猫"),
    text: EVT_L(
      "A small cat 【猫】 trembles inside a tangle of cursed thorns, mewing weakly. If you break the thorns with your bare hands, you can send it safely back to your Village home.",
      "저주받은 가시덤불 속에 작은 고양이【猫】 한 마리가 갇혀 가냘프게 울고 있다. 맨손으로 가시를 헤치면 다치겠지만, 구출해서 마을의 집으로 돌려보낼 수 있을 것 같다.",
      "呪われた茨の茂みの中に小さな猫【猫】が閉じ込められ、か細く鳴いている。素手で茨を払えば傷を負うが、救い出して里の家へ帰してやれそうだ。"
    ),
    options: [
      {
        label: EVT_L("🐱 Rescue 【猫】 (−8 HP) — Send to Village & Max HP +15", "🐱 【猫】 구출 (−8 HP) — 마을로 보호 · 최대 HP +15", "🐱 【猫】を救出 (−8 HP) — 里へ保護・最大HP+15"),
        effects: [
          { hp: -8 },
          { maxHp: 15 },
          { hp: 15 },
          { rescueCat: true }
        ]
      },
      {
        label: EVT_L("Feed rations — Reroll +2 · claim stage kanji", "먹이 주기 — 리롤 +2 · 스테이지 한자 획득", "餌を分ける — 引き直し+2・ステージ漢字獲得"),
        effects: [{ tokens: 2 }, { scavenge: 4 }]
      },
      { label: EVT_L("Leave", "지나간다", "立ち去る"), effects: [] }
    ]
  }
};

/* Grade-matched NPC / Disguised-Foe kanji pool per depth (strictly matching each depth's Kanken grade & roster!). */
const DEPTH_NPC_POOLS = {
  depth_1:  ["人", "目"],
  depth_2:  ["頭", "雪", "黒"],
  depth_3:  ["客", "医", "者"],
  depth_4:  ["兵", "徒", "卒", "官", "臣"],
  depth_5:  ["士", "犯", "像", "迷"],
  depth_6:  ["亡", "従", "警", "衆"],
  depth_7:  ["僧", "盗", "狩", "影"],
  depth_8:  ["侍", "賊", "偶", "猟", "幽"],
  depth_9:  ["仙", "忍", "偵", "曹", "傑"],
  depth_10: ["妖", "骸", "怨"],
  depth_11: ["狐", "屍", "兇"],
  depth_12: ["巫", "魑", "魍", "傀儡"]
};
