/*
 * Stage signs, per-depth stage pools, and grade-accurate Enemy Intent Kanji.
 * Every stage sign, stage card, and enemy intent kanji strictly respects the Kanken grade
 * progression in kanken_data.json (Depth 1 = Kanken 10 up to Depth 12 = Kanken 1).
 */

const STG_L = (EN, KO, JA, ZH_CN = EN, ZH_TW = JA) => ({ EN, KO, JA, ZH_CN, ZH_TW });

const STAGE_SIGNS = {
  /* ---- Depth 1 (Kanken 10: 80 basic kanji ONLY) ---- */
  田: {
    omen: STG_L("abandoned paddies", "버려진 논밭", "荒れ果てた田", "荒芜农田", "荒蕪農田"),
    cards: ["土", "水", "草", "雨", "日", "竹", "糸", "火", "力"],
    foes: ["虫", "犬", "人", "貝", "目"],
    outcomes: [["battle", 65], ["event:quiz", 20], ["event:*", 15]]
  },
  村: {
    omen: STG_L("empty village ruins", "인적 끊긴 폐촌", "人影なき廃村", "荒废村落", "荒廢村落"),
    cards: ["火", "土", "糸", "金", "手", "足", "竹", "水", "音"],
    foes: ["犬", "人", "目", "車", "石"],
    outcomes: [["battle", 55], ["event:*", 30], ["treasure", 15]]
  },
  山: {
    omen: STG_L("steep crags and timber", "험준한 바위산", "険しい岩山", "险峻岩山", "險峻岩山"),
    cards: ["火", "土", "空", "雨", "草", "竹", "力", "日", "気"],
    foes: ["石", "木", "森", "犬", "虫"],
    outcomes: [["battle", 50], ["elite", 35], ["treasure", 15]],
    risky: true
  },
  川: {
    omen: STG_L("rushing dark water", "검게 흐르는 강가", "黒く流れる川辺", "黑水河畔", "黑水河畔"),
    cards: ["水", "雨", "気", "青", "竹", "糸", "草", "玉", "白"],
    foes: ["貝", "虫", "犬", "石", "目"],
    outcomes: [["battle", 65], ["event:well", 20], ["event:*", 15]]
  },
  林: {
    omen: STG_L("whispering thicket", "바람 스치는 수풀", "ざわめく林", "低语树林", "低語樹林"),
    cards: ["草", "竹", "花", "火", "土", "糸", "音", "雨", "空"],
    foes: ["森", "木", "虫", "犬", "目"],
    outcomes: [["battle", 55], ["elite", 20], ["event:flower", 15], ["event:quiz", 10]]
  },
  町: {
    omen: STG_L("silent town streets", "적막한 골목길", "静まり返った町", "死寂街町", "死寂街町"),
    cards: ["火", "金", "手", "足", "力", "円", "百", "糸", "音"],
    foes: ["人", "車", "犬", "目", "石"],
    outcomes: [["battle", 60], ["event:quiz", 20], ["treasure", 20]]
  },
  校: {
    omen: STG_L("charred schoolhouse", "종 멈춘 폐교", "鐘の止まった廃校", "荒废学堂", "荒廢學堂"),
    cards: ["本", "文", "字", "学", "音", "休", "火", "一", "二", "三"],
    foes: ["目", "人", "虫", "車", "月"],
    outcomes: [["battle", 55], ["elite", 25], ["event:quiz", 20]],
    risky: true
  },

  /* ---- Depth 2 (Kanken 9 + 10) ---- */
  道: {
    omen: STG_L("a beaten path", "다져진 옛길", "踏み固められた道", "踩实的路", "踩實的路"),
    cards: ["土", "石", "風", "足", "走", "車", "刀", "弓", "矢"],
    foes: ["馬", "牛", "頭", "鳥", "黒"],
    outcomes: [["battle", 70], ["event:*", 30]]
  },
  海: {
    omen: STG_L("pitch-black sea", "칠흑 같은 바다", "漆黒の海", "漆黑之海", "漆黑之海"),
    cards: ["水", "風", "船", "雨", "刀", "弓", "石", "強", "光"],
    foes: ["魚", "鳥", "雲", "黒", "電", "夜"],
    outcomes: [["battle", 60], ["elite", 25], ["event:*", 15]],
    risky: true
  },
  池: {
    omen: STG_L("stagnant dark pond", "검게 고인 연못", "澱んだ古池", "死水池塘", "死水池塘"),
    cards: ["水", "雨", "石", "草", "木", "丸", "弱", "光", "糸"],
    foes: ["魚", "鳥", "頭", "牛", "雪"],
    outcomes: [["battle", 60], ["event:well", 25], ["event:quiz", 15]]
  },
  谷: {
    omen: STG_L("howling wind gorge", "칼바람 계곡", "風唸る谷", "呼啸风谷", "呼嘯風谷"),
    cards: ["風", "刀", "石", "弓", "矢", "木", "走", "強", "高"],
    foes: ["鳥", "岩", "雪", "雲", "電"],
    outcomes: [["battle", 55], ["elite", 30], ["treasure", 15]],
    risky: true
  },
  野: {
    omen: STG_L("windswept plains", "황량한 들판", "吹きっ晒しの野", "荒野平原", "荒野平原"),
    cards: ["草", "風", "土", "火", "刀", "弓", "矢", "走", "角"],
    foes: ["馬", "牛", "鳥", "雲", "雪"],
    outcomes: [["battle", 70], ["event:*", 30]]
  },
  寺: {
    omen: STG_L("incense and cold ash", "향 연기 남은 고찰", "香の煙る古寺", "残香古寺", "殘香古寺"),
    cards: ["火", "心", "光", "声", "言", "書", "紙", "茶", "木"],
    foes: ["頭", "黒", "雲", "夜", "星"],
    outcomes: [["event:rest", 70], ["event:shrine", 30]]
  },
  社: {
    omen: STG_L("mossy wayside shrine", "이끼 낀 신사", "苔むした社", "荒芜神社", "荒蕪神社"),
    cards: ["木", "石", "火", "光", "心", "紙", "刀", "弓", "矢"],
    foes: ["頭", "雪", "黒", "鳥", "夜", "星"],
    outcomes: [["event:shrine", 45], ["battle", 40], ["event:quiz", 15]]
  },
  市: {
    omen: STG_L("abandoned market", "버려진 저잣거리", "捨てられた市", "荒废集市", "荒廢集市"),
    cards: ["肉", "米", "麦", "茶", "刀", "金", "火", "紙", "売"],
    foes: ["馬", "牛", "頭", "鳥", "黒"],
    outcomes: [["battle", 50], ["treasure", 30], ["event:quiz", 20]]
  },
  室: {
    omen: STG_L("sealed stone chamber", "봉인된 밀실", "封じられた室", "封闭密室", "封閉密室"),
    cards: ["石", "戸", "刀", "切", "火", "弓", "強", "光", "糸"],
    foes: ["黒", "岩", "頭", "雪", "夜", "星"],
    outcomes: [["elite", 45], ["treasure", 35], ["battle", 20]],
    risky: true
  },

  /* ---- Depth 3 (Kanken 8) ---- */
  湖: {
    omen: STG_L("blood-tinted lake", "핏빛에 잠긴 호수", "血に染まる湖", "血色湖泊", "血色湖泊"),
    cards: ["水", "波", "深", "流", "寒", "石", "鉄", "風", "打"],
    foes: ["氷", "血", "羊", "暗", "死"],
    outcomes: [["battle", 60], ["elite", 25], ["event:well", 15]],
    risky: true
  },
  港: {
    omen: STG_L("fog-choked harbor", "안개 낀 폐항구", "霧に沈む港", "迷雾废港", "迷霧廢港"),
    cards: ["水", "波", "船", "鉄", "荷", "箱", "油", "火", "風"],
    foes: ["客", "者", "氷", "暗", "悪"],
    outcomes: [["battle", 65], ["treasure", 20], ["event:*", 15]]
  },
  島: {
    omen: STG_L("isolated isle of bones", "고립된 외딴섬", "孤立した島", "孤立荒岛", "孤立荒島"),
    cards: ["水", "波", "石", "木", "火", "寒", "風", "薬", "打"],
    foes: ["氷", "者", "暗", "悪", "神", "死"],
    outcomes: [["elite", 45], ["battle", 40], ["treasure", 15]],
    risky: true
  },
  坂: {
    omen: STG_L("muddy uphill slope", "진흙탕 비탈길", "ぬかるむ坂", "泥泞坡道", "泥濘坡道"),
    cards: ["土", "石", "重", "落", "転", "足", "風", "打", "投"],
    foes: ["羊", "暗", "客", "者"],
    outcomes: [["battle", 70], ["event:quiz", 15], ["event:*", 15]]
  },
  畑: {
    omen: STG_L("scorched dry field", "검게 탄 화전", "焼け焦げた畑", "焦黑旱田", "焦黑旱田"),
    cards: ["火", "土", "炭", "油", "豆", "葉", "根", "草", "放"],
    foes: ["羊", "病", "暗", "者"],
    outcomes: [["battle", 65], ["event:flower", 20], ["event:quiz", 15]]
  },
  屋: {
    omen: STG_L("creaking blood-stained house", "삐걱이는 폐옥", "軋む廃屋", "吱呀废屋", "吱呀廢屋"),
    cards: ["木", "火", "油", "炭", "鉄", "皿", "箱", "柱", "板"],
    foes: ["客", "暗", "血", "悪", "主"],
    outcomes: [["battle", 55], ["elite", 25], ["event:*", 20]]
  },
  院: {
    omen: STG_L("plague infirmary", "역병 도는 폐병동", "疫病の廃院", "疫病废院", "疫病廢院"),
    cards: ["薬", "湯", "酒", "火", "身", "皮", "歯", "鉄", "刀"],
    foes: ["医", "病", "血", "死", "悪"],
    outcomes: [["battle", 55], ["elite", 25], ["event:quiz", 20]],
    risky: true
  },
  庫: {
    omen: STG_L("rusted armory vault", "녹슨 철창고", "錆びた武器庫", "锈蚀武库", "鏽蝕武庫"),
    cards: ["鉄", "銀", "油", "炭", "火", "刀", "箱", "具", "打", "投"],
    foes: ["者", "客", "暗", "悪", "主"],
    outcomes: [["treasure", 45], ["battle", 40], ["elite", 15]]
  },

  /* ---- Depth 4 (Kanken 7: Prefectures & Old Battlefield) ---- */
  茨: {
    omen: STG_L("briar wasteland", "가시나무 들판", "茨の荒野", "荆棘荒原", "荊棘荒原"),
    cards: ["茨", "木", "草", "火", "焼", "松", "芽", "縄", "風", "折"],
    foes: ["熊", "鹿", "兵", "徒", "卒"],
    outcomes: [["battle", 55], ["event:quiz", 25], ["event:flower", 20]]
  },
  潟: {
    omen: STG_L("black mudflats", "검은 개펄 석호", "黒い干潟", "黑泥泻湖", "黑泥潟湖"),
    cards: ["潟", "水", "塩", "浅", "冷", "漁", "氷", "土", "石", "県"],
    foes: ["兵", "熊", "徒", "隊", "官"],
    outcomes: [["battle", 55], ["event:quiz", 25], ["event:well", 20]]
  },
  栃: {
    omen: STG_L("ancient chestnut woods", "상수리 고목림", "栃の古木林", "七叶树林", "七葉樹林"),
    cards: ["栃", "木", "松", "梅", "梨", "巣", "材", "火", "焼", "風"],
    foes: ["熊", "鹿", "卒", "隊", "徒"],
    outcomes: [["battle", 60], ["event:quiz", 20], ["elite", 20]]
  },
  阪: {
    omen: STG_L("blood-soaked embankment", "피로 물든 언덕", "血塗られた坂", "染血坡道", "染血坡道"),
    cards: ["阪", "石", "土", "戦", "刀", "火", "熱", "旗", "輪", "囲"],
    foes: ["兵", "隊", "官", "臣", "軍", "勇"],
    outcomes: [["battle", 55], ["elite", 30], ["event:quiz", 15]],
    risky: true
  },
  岐: {
    omen: STG_L("steep mountain crossroads", "험한 갈림 산길", "険しき岐路", "险峻岐路", "險峻岐路"),
    cards: ["岐", "山", "石", "木", "風", "縄", "灯", "鏡", "刀", "飛"],
    foes: ["鹿", "熊", "兵", "卒", "勇"],
    outcomes: [["battle", 50], ["event:quiz", 30], ["event:*", 20]]
  },
  城: {
    omen: STG_L("burning fortress ruins", "불타는 고성", "燃える古城", "燃烧古城", "燃燒古城"),
    cards: ["城", "石", "火", "焼", "戦", "械", "刀", "鉄", "旗", "固"],
    foes: ["兵", "機", "官", "臣", "司", "軍"],
    outcomes: [["elite", 50], ["battle", 35], ["treasure", 15]],
    risky: true
  },
  街: {
    omen: STG_L("ruined garrison street", "무너진 병영 거리", "廃墟の街", "废墟街道", "廢墟街道"),
    cards: ["街", "火", "灯", "鏡", "器", "衣", "飯", "塩", "鉄", "械"],
    foes: ["卒", "徒", "隊", "機", "官"],
    outcomes: [["battle", 55], ["treasure", 25], ["event:quiz", 20]]
  },

  /* ---- Depth 5 (Kanken 6: Sinners' Mound) ---- */
  墓: {
    omen: STG_L("freshly dug graves", "죄인들의 무덤", "罪人の墓場", "罪人墓地", "罪人墓地"),
    cards: ["墓", "土", "石", "死", "血", "燃", "火", "殺", "破", "術"],
    foes: ["迷", "犯", "毒", "罪", "武", "災"],
    outcomes: [["battle", 50], ["event:corpse", 35], ["elite", 15]],
    risky: true
  },
  堂: {
    omen: STG_L("heretic ritual hall", "이단의 법당", "異端の堂", "异端佛堂", "異端佛堂"),
    cards: ["火", "燃", "夢", "術", "布", "光", "眼", "護", "防"],
    foes: ["像", "象", "迷", "仏", "師"],
    outcomes: [["event:rest", 55], ["event:shrine", 25], ["battle", 20]]
  },
  河: {
    omen: STG_L("river of acid and ash", "잿빛 강물", "灰色の河", "灰暗大河", "灰暗大河"),
    cards: ["水", "液", "酸", "燃", "河", "氷", "石", "風", "暴", "破"],
    foes: ["士", "犯", "毒", "象", "武", "災"],
    outcomes: [["battle", 65], ["event:well", 20], ["event:quiz", 15]]
  },
  鉱: {
    omen: STG_L("collapsed toxic mine", "독가스 폐광", "毒ガスの廃鉱", "毒气废矿", "毒氣廢礦"),
    cards: ["鉱", "銅", "鉄", "石", "火", "燃", "破", "圧", "粉", "酸"],
    foes: ["犯", "像", "毒", "士", "武", "罪"],
    outcomes: [["battle", 55], ["treasure", 30], ["elite", 15]]
  },
  境: {
    omen: STG_L("border of the living", "생사의 경계선", "生死の境", "生死边界", "生死邊界"),
    cards: ["境", "燃", "夢", "逆", "殺", "破", "術", "防", "護", "刀"],
    foes: ["士", "迷", "象", "武", "罪", "師"],
    outcomes: [["elite", 45], ["battle", 40], ["event:quiz", 15]],
    risky: true
  },

  /* ---- Depth 6 (Kanken 5: Hall of Bones) ---- */
  蔵: {
    omen: STG_L("locked ossuary vault", "잠긴 백골 비고", "閉ざされた骨蔵", "上锁骨藏", "上鎖骨藏"),
    cards: ["臓", "血", "鉄", "鋼", "宝", "銭", "刀", "火", "灰"],
    foes: ["骨", "亡", "警", "敵", "将", "皇"],
    outcomes: [["treasure", 55], ["battle", 30], ["elite", 15]]
  },
  穴: {
    omen: STG_L("bottomless bone pit", "해골 쌓인 굴", "白骨の穴", "白骨洞穴", "白骨洞穴"),
    cards: ["穴", "脳", "傷", "痛", "石", "土", "吸", "針", "暗"],
    foes: ["骨", "亡", "従", "蚕", "異"],
    outcomes: [["battle", 60], ["event:corpse", 25], ["elite", 15]],
    risky: true
  },
  泉: {
    omen: STG_L("steaming blood spring", "끓어오르는 혈천", "湯気立つ血の泉", "沸血之泉", "沸血之泉"),
    cards: ["水", "泉", "蒸", "潮", "血", "洗", "氷", "液", "紅", "吸"],
    foes: ["従", "警", "衆", "異", "聖"],
    outcomes: [["event:well", 45], ["battle", 40], ["event:rest", 15]]
  },
  砂: {
    omen: STG_L("ashen bone desert", "뼛가루 사막", "骨灰の砂漠", "骨灰沙漠", "骨灰沙漠"),
    cards: ["砂", "灰", "干", "風", "火", "石", "射", "棒", "熱"],
    foes: ["骨", "亡", "衆", "警", "敵", "将"],
    outcomes: [["battle", 65], ["event:quiz", 20], ["elite", 15]]
  },
  樹: {
    omen: STG_L("flesh-bearing great tree", "살점 열린 거목", "肉実る大樹", "血肉巨树", "血肉巨樹"),
    cards: ["樹", "木", "紅", "血", "臓", "脳", "舌", "枝", "針", "卵"],
    foes: ["蚕", "従", "亡", "異", "敵"],
    outcomes: [["battle", 55], ["event:flower", 25], ["elite", 20]]
  },
  閣: {
    omen: STG_L("imperial bone pavilion", "백골의 누각", "白骨の閣", "白骨楼阁", "白骨樓閣"),
    cards: ["鋼", "刀", "射", "刻", "磁", "鏡", "火", "断", "処", "針"],
    foes: ["敵", "警", "衆", "将", "聖", "皇"],
    outcomes: [["elite", 50], ["battle", 35], ["treasure", 15]],
    risky: true
  },

  /* ---- Depth 7 (Kanken 4: Valley of Wailing) ---- */
  殿: {
    omen: STG_L("echoing demon hall", "곡성 울리는 전당", "鬼哭の殿", "鬼哭大殿", "鬼哭大殿"),
    cards: ["剣", "撃", "突", "刺", "盾", "矛", "鎖", "火", "血", "壊"],
    foes: ["影盗", "黒影", "凶鳥", "巨兵", "百鬼"],
    outcomes: [["elite", 50], ["battle", 40], ["treasure", 10]],
    risky: true
  },
  塔: {
    omen: STG_L("lightning-struck spire", "벼락 치는 첨탑", "雷落ちる塔", "雷击高塔", "雷擊高塔"),
    cards: ["爆", "砲", "弾", "煙", "風", "火", "鉄", "剣", "撃"],
    foes: ["悪僧", "黒影", "凶鳥", "狂鬼", "雷神", "鬼雄"],
    outcomes: [["battle", 55], ["elite", 30], ["event:quiz", 15]],
    risky: true
  },
  沼: {
    omen: STG_L("rotting poison swamp", "썩어가는 독늪", "腐敗の沼", "腐败毒沼", "腐敗毒沼"),
    cards: ["沼", "水", "腐", "毒", "霧", "煙", "土", "沈", "刺", "鎖"],
    foes: ["狂獣", "影盗", "黒影", "狂鬼", "百鬼"],
    outcomes: [["battle", 60], ["event:well", 20], ["event:*", 20]]
  },
  峰: {
    omen: STG_L("jagged beast peak", "짐승 우는 봉우리", "獣咆える峰", "群兽险峰", "群獸險峰"),
    cards: ["石", "岩", "風", "襲", "駆", "跳", "剣", "火", "鋭"],
    foes: ["狂獣", "人狩", "凶鳥", "巨兵", "狂鬼", "雷神"],
    outcomes: [["battle", 60], ["elite", 25], ["event:*", 15]]
  },
  陣: {
    omen: STG_L("abandoned siege camp", "피로 물든 진영", "血の陣営", "血之阵营", "血之陣營"),
    cards: ["剣", "矛", "盾", "砲", "弾", "爆", "鎖", "火", "薪", "攻"],
    foes: ["人狩", "影盗", "悪僧", "巨兵", "鬼雄"],
    outcomes: [["battle", 55], ["treasure", 25], ["elite", 20]]
  },

  /* ---- Depth 8 (Kanken 3: Demon Wilds) ---- */
  獄: {
    omen: STG_L("iron torture gaol", "절규하는 뇌옥", "絶叫の牢獄", "绝叫牢狱", "絕叫牢獄"),
    cards: ["獄", "縛", "絞", "鎖", "鉄", "刑", "炎", "血", "魂", "奪"],
    foes: ["山賊", "木偶", "邪霊", "亡侍", "魔王"],
    outcomes: [["elite", 50], ["battle", 40], ["event:quiz", 10]],
    risky: true
  },
  炉: {
    omen: STG_L("hellfire smelting furnace", "영혼 태우는 화로", "魂溶かす炉", "炼魂熔炉", "煉魂熔爐"),
    cards: ["炎", "火", "焦", "鍛", "鋳", "鉄", "煙", "滅", "爆", "塊"],
    foes: ["怪異", "蛮族", "山賊", "亡侍", "魔王"],
    outcomes: [["battle", 55], ["treasure", 25], ["elite", 20]]
  },
  壇: {
    omen: STG_L("sacrificial blood altar", "산제물의 제단", "生贄の祭壇", "活祭祭坛", "活祭祭壇"),
    cards: ["魂", "祈", "血", "炎", "犠", "牲", "封", "鐘", "刃"],
    foes: ["悪霊", "木偶", "邪霊", "幽鬼", "魔帝"],
    outcomes: [["event:shrine", 40], ["battle", 40], ["elite", 20]]
  },
  墳: {
    omen: STG_L("ancient imperial barrow", "도굴된 고분", "暴かれた古墳", "被盗古坟", "被盜古墳"),
    cards: ["葬", "埋", "魂", "骨", "土", "石", "凍", "幻", "封"],
    foes: ["悪霊", "幽鬼", "木偶", "亡侍", "魔帝"],
    outcomes: [["battle", 55], ["event:corpse", 30], ["treasure", 15]]
  },
  峡: {
    omen: STG_L("phantom-haunted gorge", "원귀 서린 협곡", "亡霊の峡谷", "亡灵峡谷", "亡靈峽谷"),
    cards: ["風", "凍", "零", "氷", "崩", "裂", "岩", "貫", "殴", "幻"],
    foes: ["怪異", "血猟", "蛮族", "亡鯨", "黒騎", "魔王"],
    outcomes: [["battle", 65], ["event:*", 20], ["elite", 15]]
  },

  /* ---- Depth 9 (Kanken 2.5: Road of Tyrants) ---- */
  洞: {
    omen: STG_L("wyrm's cavern", "화룡 잠든 동굴", "竜眠る洞", "恶龙洞窟", "惡龍洞窟"),
    cards: ["火", "炎", "岩", "砕", "剛", "珠", "硝", "硫", "煙", "渦"],
    foes: ["毒蛇", "血猿", "怪仙", "火竜", "覇王"],
    outcomes: [["elite", 50], ["battle", 35], ["treasure", 15]],
    risky: true
  },
  廃: {
    omen: STG_L("blighted ruin sector", "역병 도는 폐허", "疫病の廃墟", "疫病废墟", "疫病廢墟"),
    cards: ["廃", "銃", "刃", "硝", "鉄", "泥", "疫", "菌", "毒", "火"],
    foes: ["影忍", "怪猫", "疫蚊", "凶偵", "獄曹"],
    outcomes: [["battle", 60], ["event:quiz", 20], ["event:*", 20]]
  },
  塚: {
    omen: STG_L("mound of executed blades", "처형된 칼의 무덤", "処刑刀の塚", "刑刀之冢", "刑刀之塚"),
    cards: ["刃", "刀", "剣", "棺", "弔", "骨", "血", "漆", "縛", "拷"],
    foes: ["影忍", "凶偵", "獄曹", "血傑", "元帥", "覇王"],
    outcomes: [["battle", 55], ["event:corpse", 25], ["elite", 20]]
  },
  堀: {
    omen: STG_L("black moat of warships", "가라앉은 검은 해자", "鉄艦沈む堀", "沉舰护城河", "沉艦護城河"),
    cards: ["水", "渦", "泥", "泡", "銃", "艦", "鉄", "氷", "雷", "津"],
    foes: ["毒蛇", "疫蚊", "凶偵", "獄曹", "元帥", "火竜"],
    outcomes: [["battle", 60], ["elite", 25], ["treasure", 15]]
  },
  窯: {
    omen: STG_L("ash-choked kiln", "인골 굽는 가마", "人骨を焼く窯", "焚骨窑炉", "焚骨窯爐"),
    cards: ["火", "炎", "沸", "融", "硝", "硫", "灰", "炭", "瓶", "癒"],
    foes: ["怪猫", "血猿", "獄曹", "怪仙", "血傑"],
    outcomes: [["event:rest", 45], ["battle", 40], ["event:quiz", 15]]
  },

  /* ---- Depth 10 (Kanken 2: The Underworld) ---- */
  麓: {
    omen: STG_L("lightless netherworld foothills", "어둠 잠긴 산기슭", "闇に沈む冥府の麓", "暗黑山麓", "闇黑山麓"),
    cards: ["呪", "斬", "火", "光", "血", "刃", "風", "石", "氷"],
    foes: ["妖魔", "大顎", "骸骨", "怨鬼", "常闇"],
    outcomes: [["battle", 45], ["elite", 35], ["event:*", 20]],
    risky: true
  },
  窟: {
    omen: STG_L("den of fangs and claws", "발톱과 어금니 마굴", "牙と爪の魔窟", "牙爪魔窟", "牙爪魔窟"),
    cards: ["牙", "爪", "拳", "蹴", "潰", "骨", "血", "肉", "剥"],
    foes: ["猛虎", "怪亀", "毒蜂", "暴駒", "大顎", "骸骨"],
    outcomes: [["battle", 60], ["elite", 25], ["event:corpse", 15]]
  },
  崖: {
    omen: STG_L("storm-lashed cliff", "폭풍 치는 절벽", "嵐吹き荒れる崖", "风暴断崖", "風暴斷崖"),
    cards: ["嵐", "風", "雷", "石", "蹴", "落", "鎌", "斬", "氷"],
    foes: ["凶鶴", "猛虎", "毒蜂", "怨鬼", "鬱鬼"],
    outcomes: [["battle", 55], ["elite", 30], ["event:quiz", 15]],
    risky: true
  },
  柵: {
    omen: STG_L("palisade of the dead", "망자를 가둔 철책", "亡者を阻む骸の柵", "亡者木栅", "亡者木柵"),
    cards: ["呪", "死", "魂", "鎌", "炎", "氷", "鎖", "縛", "骨"],
    foes: ["骸骨", "怨鬼", "妖魔", "大顎", "冥王"],
    outcomes: [["elite", 50], ["battle", 35], ["event:shrine", 15]],
    risky: true
  },
  釜: {
    omen: STG_L("boiling hell cauldron", "죄인 삶는 가마솥", "罪人煮る地獄釜", "烹罪地狱釜", "烹罪地獄釜"),
    cards: ["火", "炎", "煎", "湯", "水", "油", "血", "毒", "蜜"],
    foes: ["妖魔", "怪亀", "毒蜂", "大顎", "骸骨"],
    outcomes: [["battle", 55], ["event:rest", 25], ["event:quiz", 20]]
  },

  /* ---- Depth 11 (Kanken Jun-1: Beast King's Tomb) ---- */
  牢: {
    omen: STG_L("blood-soaked beast cage", "피투성이 짐승 뇌옥", "獣の血牢", "猛兽血牢", "猛獸血牢"),
    cards: ["牢", "槍", "斧", "鎧", "薙", "鎖", "鉄", "血", "火", "噛"],
    foes: ["血餓狼", "黒影豹", "大牙猪", "焔獅子", "屠殺兇"],
    outcomes: [["battle", 55], ["elite", 30], ["treasure", 15]],
    risky: true
  },
  砦: {
    omen: STG_L("dragonfire bastion", "화염 휩싸인 요새", "劫火の砦", "劫火壁垒", "劫火砦壘"),
    cards: ["焔", "火", "炎", "槍", "斧", "鎧", "薙", "轟", "閃", "穿"],
    foes: ["鋼爪鷲", "血餓狼", "焔獅子", "屠殺兇", "古神龍"],
    outcomes: [["elite", 50], ["battle", 35], ["event:quiz", 15]],
    risky: true
  },
  祠: {
    omen: STG_L("hungry beast shrine", "살점 탐하는 사당", "肉を喰らう祠", "噬肉古祠", "噬肉古祠"),
    cards: ["呑", "噛", "喰", "血", "骨", "火", "呪", "杖", "焚"],
    foes: ["九尾狐", "人喰屍", "血沼鰐", "深海鮫", "紅焔鳳"],
    outcomes: [["event:shrine", 45], ["battle", 40], ["event:quiz", 15]]
  },
  洲: {
    omen: STG_L("blood-stained sandbar", "아귀 들끓는 물가", "顎門うごめく洲", "恶鳄沙洲", "惡鱷沙洲"),
    cards: ["水", "濡", "溢", "雫", "氷", "雷", "槍", "血", "噛", "呑"],
    foes: ["血沼鰐", "深海鮫", "人喰屍", "鋼爪鷲", "天帝鷹"],
    outcomes: [["battle", 65], ["event:well", 20], ["elite", 15]]
  },

  /* ---- Depth 12 (Kanken 1: The Abyss 奈落) ---- */
  罠: {
    omen: STG_L("flesh-rending abyssal trap", "나락의 핏빛 함정", "肉裂く奈落の罠", "裂肉深渊陷阱", "裂肉深淵陷阱"),
    cards: ["罠", "毒", "針", "斬", "血", "火", "焔", "礫", "噬"],
    foes: ["百足蠱蟲", "漆黒毒蝮", "呪糸傀儡", "魔神饕餮"],
    outcomes: [["battle", 50], ["elite", 35], ["event:quiz", 15]],
    risky: true
  },
  尸: {
    omen: STG_L("mountain of twitching corpses", "꿈틀거리는 시체 산", "蠢く尸の山", "蠢动尸山", "蠢動尸山"),
    cards: ["尸", "屍", "骨", "髑", "髏", "血", "咒", "祟", "詛", "火"],
    foes: ["血咒巫女", "魑魅魍魎", "白骨髑髏", "魔神饕餮"],
    outcomes: [["elite", 50], ["battle", 35], ["event:corpse", 15]],
    risky: true
  },
  峙: {
    omen: STG_L("monolith of the glutton god", "괴신 도사린 절벽", "怪神聳える峙", "怪神耸立之巅", "怪神聳立之峙"),
    cards: ["礫", "石", "岩", "雷", "焔", "殲", "咆", "睨", "噬", "抉"],
    foes: ["旱魃凶鬼", "深淵毒蛟", "魑魅魍魎", "呪糸傀儡", "魔神饕餮"],
    outcomes: [["elite", 55], ["battle", 35], ["treasure", 10]],
    risky: true
  },
  澪: {
    omen: STG_L("vein of black venom", "독혈 흐르는 수맥", "黒毒流れる澪", "黑毒水脉", "黑毒水脈"),
    cards: ["水", "淹", "滲", "毒", "氷", "血", "咒", "噬", "詛"],
    foes: ["百足蠱蟲", "血咒巫女", "魑魅魍魎", "深淵毒蛟"],
    outcomes: [["battle", 55], ["event:quiz", 25], ["event:well", 20]]
  },

  /* ---- Mystery fallback ---- */
  謎: {
    omen: STG_L("something strange awaits", "정체불명의 기척", "得体の知れぬ気配", "诡异气息", "詭異氣息"),
    cards: ["火", "水", "木", "石", "土", "金", "手", "目"],
    foes: [],
    outcomes: [["event:quiz", 45], ["event:*", 55]]
  }
};

/* Which stage signs appear in each depth so stages match the grade's kanji and theme! */
const DEPTH_STAGE_POOLS = {
  depth_1:  ["田", "村", "山", "川", "林", "町", "校"],
  depth_2:  ["海", "池", "谷", "野", "寺", "社", "市", "室", "道"],
  depth_3:  ["湖", "港", "島", "坂", "畑", "屋", "院", "庫"],
  depth_4:  ["茨", "潟", "栃", "阪", "岐", "城", "街"],
  depth_5:  ["墓", "堂", "河", "鉱", "境", "寺"],
  depth_6:  ["蔵", "穴", "泉", "砂", "樹", "閣"],
  depth_7:  ["殿", "塔", "沼", "峰", "陣", "谷"],
  depth_8:  ["獄", "炉", "壇", "墳", "峡", "寺"],
  depth_9:  ["洞", "廃", "塚", "堀", "窯", "獄"],
  depth_10: ["麓", "窟", "崖", "柵", "釜", "塚"],
  depth_11: ["牢", "砦", "祠", "洲", "窟", "崖"],
  depth_12: ["罠", "尸", "峙", "澪", "牢", "窟"]
};

/*
 * Grade-matched Escape Intent Kanji when an enemy is at low HP (<= 38%) and tries to flee!
 *  - Depths 1..6 (Education): 1-char escape intents
 *  - Depths 7..10 (Common): 2-char escape intents
 *  - Depth 11 (Jun-1): 3-char escape intents
 *  - Depth 12 (Grade 1): 4-char escape intents
 */
const DEPTH_ESCAPE_INTENTS = {
  depth_1:  ["出", "足"],
  depth_2:  ["走", "帰"],
  depth_3:  ["去", "速"],
  depth_4:  ["飛", "散"],
  depth_5:  ["迷", "往"],
  depth_6:  ["退", "裏"],
  depth_7:  ["逃走", "退避"],
  depth_8:  ["潜伏", "隠匿"],
  depth_9:  ["逸走", "疾奔"],
  depth_10: ["失踪", "闇逃"],
  depth_11: ["血霧遁", "闇疾馳"],
  depth_12: ["奈落逍遥", "虚空遁走"]
};

/*
 * Grade-matched intent pools per depth:
 *  - Depths 1..6 (Education): 1-char intents
 *  - Depths 7..10 (Common): 2-char intents (dangerous compound threats)
 *  - Depth 11 (Jun-1): up to 3-char intents (out-of-spec beastly onslaught)
 *  - Depth 12 (Grade 1): up to 4-char intents (abyssal horror incantations)
 */
const DEPTH_INTENT_POOLS = {
  depth_1:  ["口", "足", "手", "力", "目", "見", "石", "火"],
  depth_2:  ["刀", "切", "角", "走", "弓", "矢", "強", "声"],
  depth_3:  ["打", "投", "歯", "血", "重", "落", "向", "死"],
  depth_4:  ["戦", "折", "焼", "束", "察", "望", "縄", "害"],
  depth_5:  ["殺", "破", "暴", "毒", "眼", "囲", "圧", "絶"],
  depth_6:  ["傷", "痛", "断", "射", "針", "吸", "視", "看"],
  depth_7:  ["急襲", "刺殺", "爆撃", "乱撃", "鉄鎖", "狂乱", "突撃", "剣撃"],
  depth_8:  ["処刑", "魂奪", "封縛", "絞殺", "虐殺", "黒炎", "貫通", "破滅"],
  depth_9:  ["銃撃", "拷問", "粉砕", "吸血", "疫病", "凶刃", "撲殺", "威嚇"],
  depth_10: ["斬首", "呪殺", "圧潰", "毒針", "牙爪", "怨呪", "死鎌", "闇討"],
  depth_11: ["生肉喰", "骨噛砕", "皆薙殺", "黒焔焚", "雷轟穿", "八裂屠", "死角覗", "血槍突"],
  depth_12: ["魂魄呑噬", "五臓抉出", "森羅殲滅", "万死咒詛", "百鬼夜祟", "深淵凝睨", "天地咆哮", "肉骨蹂躙"]
};

/*
 * Enemy Intent Kanji (Slay the Spire-style telegraphed moves via Kanji).
 *  - 01-06: 1-char intents
 *  - 07-10: 2-char compound intents
 *  - 11: 3-char out-of-spec intents
 *  - 12: 4-char abyssal intents
 */
const FOE_INTENT_PROFILES = {
  // Depth 1 (Kanken 10 ONLY)
  犬: { normal: ["口", "足", "目", "耳"] },
  虫: { normal: ["口", "目", "糸", "草"] },
  人: { normal: ["手", "足", "石", "火"] },
  木: { normal: ["木", "林", "草", "力"] },
  石: { normal: ["足", "力", "山", "土"] },
  貝: { normal: ["口", "水", "石", "力"] },
  目: { normal: ["目", "見", "火", "音"] },
  森: { normal: ["木", "林", "草", "休"] },
  車: { normal: ["足", "力", "金", "火"] },
  王: { countdown: ["三", "二", "一", "力"], normal: ["金", "火", "上", "下"] },
  天: { countdown: ["三", "二", "一", "雨"], normal: ["空", "日", "月", "火"] },
  月: { countdown: ["三", "二", "一", "下"], normal: ["月", "空", "水", "音"] },

  // Depth 2 (Kanken 9 + 10)
  馬: { normal: ["走", "足", "強", "風"] },
  牛: { normal: ["角", "力", "頭", "走"] },
  鳥: { normal: ["羽", "風", "鳴", "目"] },
  魚: { normal: ["水", "海", "池", "口"] },
  頭: { normal: ["頭", "口", "目", "声"] },
  雪: { normal: ["雪", "風", "冬", "白"] },
  雲: { normal: ["雲", "雨", "風", "空"] },
  岩: { normal: ["力", "強", "山", "石"] },
  黒: { normal: ["黒", "夜", "刀", "切"] },
  電: { countdown: ["雲", "風", "電"], normal: ["光", "音", "強", "矢"] },
  夜: { countdown: ["夕", "夜", "黒"], normal: ["星", "月", "風", "切"] },
  星: { countdown: ["三", "二", "一", "光"], normal: ["星", "夜", "空", "矢"] },

  // Depth 3 (Kanken 8)
  羊: { normal: ["角", "走", "歯", "重"] },
  客: { normal: ["刀", "打", "投", "暗"] },
  医: { normal: ["薬", "血", "歯", "切"] },
  者: { normal: ["打", "投", "刀", "追"] },
  氷: { normal: ["氷", "寒", "落", "重"] },
  病: { normal: ["病", "血", "苦", "息"] },
  暗: { normal: ["暗", "夜", "消", "寒"] },
  血: { normal: ["血", "流", "歯", "飲"] },
  悪: { normal: ["悪", "打", "血", "暗"] },
  死: { countdown: ["三", "二", "一", "死"], normal: ["血", "寒", "消", "暗"] },
  神: { countdown: ["三", "二", "一", "落"], normal: ["光", "命", "決", "重"] },
  主: { countdown: ["三", "二", "一", "重"], normal: ["鉄", "打", "命", "守"] },

  // Depth 4 (Kanken 7)
  熊: { normal: ["歯", "力", "重", "折"] },
  鹿: { normal: ["角", "走", "飛", "察"] },
  兵: { normal: ["戦", "刀", "弓", "束"] },
  徒: { normal: ["群", "打", "投", "縄"] },
  卒: { normal: ["戦", "打", "突", "刀"] },
  隊: { normal: ["連", "囲", "弓", "矢"] },
  機: { normal: ["械", "矢", "輪", "折"] },
  官: { normal: ["令", "束", "縄", "察"] },
  臣: { normal: ["戦", "守", "固", "刀"] },
  軍: { countdown: ["号", "連", "戦"], normal: ["焼", "矢", "折", "械"] },
  司: { countdown: ["案", "察", "敗"], normal: ["令", "縄", "鏡", "害"] },
  勇: { countdown: ["三", "二", "一", "折"], normal: ["勇", "戦", "力", "焼"] },

  // Depth 5 (Kanken 6)
  士: { normal: ["武", "殺", "刀", "破"] },
  犯: { normal: ["殺", "暴", "破", "毒"] },
  像: { normal: ["圧", "破", "眼", "防"] },
  象: { normal: ["圧", "暴", "破", "重"] },
  毒: { normal: ["毒", "酸", "液", "痛"] },
  迷: { normal: ["迷", "夢", "眼", "逆"] },
  武: { normal: ["武", "殺", "破", "暴"] },
  罪: { normal: ["罪", "毒", "燃", "絶"] },
  災: { countdown: ["燃", "暴", "災"], normal: ["破", "毒", "圧", "絶"] },
  師: { countdown: ["眼", "判", "絶"], normal: ["術", "破", "禁", "圧"] },
  仏: { countdown: ["三", "二", "一", "絶"], normal: ["眼", "光", "圧", "護"] },

  // Depth 6 (Kanken 5)
  骨: { normal: ["骨", "傷", "折", "断"] },
  亡: { normal: ["亡", "吸", "冷", "暗"] },
  蚕: { normal: ["糸", "吸", "毒", "閉"] },
  衆: { normal: ["乱", "囲", "暴", "圧"] },
  従: { normal: ["針", "傷", "密", "視"] },
  警: { normal: ["看", "視", "射", "断"] },
  敵: { normal: ["傷", "断", "射", "激"] },
  異: { normal: ["異", "脳", "臓", "吸"] },
  皇: { countdown: ["臨", "裁", "処"], normal: ["権", "圧", "断", "射"] },
  将: { countdown: ["揮", "討", "断"], normal: ["鋼", "射", "傷", "激"] },
  聖: { countdown: ["三", "二", "一", "処"], normal: ["光", "裁", "断", "針"] },

  // Depth 7 (Kanken 4 — 2-char intents)
  狂獣: { normal: ["急襲", "噛裂", "狂乱", "咆哮"] },
  悪僧: { normal: ["破戒", "天罰", "鉄杖", "重圧"] },
  影盗: { normal: ["暗刺", "潜伏", "鉄鎖", "急襲"] },
  人狩: { normal: ["狙射", "連矢", "急襲", "刺殺"] },
  黒影: { normal: ["暗伺", "影刺", "幻惑", "闇襲"] },
  凶鳥: { normal: ["急襲", "刺殺", "乱撃", "狂乱"] },
  巨兵: { normal: ["破壊", "踏潰", "重圧", "強撃"] },
  狂鬼: { normal: ["狂乱", "急襲", "暴撃", "鬼叫"] },
  百鬼: { countdown: ["鬼怒", "狂乱", "壊滅"], normal: ["乱撃", "突撃", "鉄鎖", "急襲"] },
  雷神: { countdown: ["黒雲", "閃光", "落雷"], normal: ["雷撃", "爆撃", "震撃", "焼尽"] },
  鬼雄: { countdown: ["雄叫", "疾駆", "撃滅"], normal: ["剣撃", "突撃", "強矛", "鉄盾"] },
  獣: { normal: ["急襲", "狂乱", "刺殺", "乱撃"] },
  僧: { normal: ["破戒", "天罰", "重圧", "乱撃"] },
  盗: { normal: ["暗刺", "鉄鎖", "急襲", "刺殺"] },
  狩: { normal: ["連矢", "急襲", "刺殺", "乱撃"] },
  影: { normal: ["影刺", "幻惑", "急襲", "暗刺"] },
  凶: { normal: ["刺殺", "乱撃", "狂乱", "急襲"] },
  巨: { normal: ["破壊", "踏潰", "重圧", "乱撃"] },
  狂: { normal: ["狂乱", "急襲", "暴撃", "乱撃"] },
  鬼: { countdown: ["鬼怒", "狂乱", "壊滅"], normal: ["乱撃", "突撃", "鉄鎖", "急襲"] },
  雷: { countdown: ["黒雲", "閃光", "落雷"], normal: ["雷撃", "爆撃", "震撃", "焼尽"] },
  雄: { countdown: ["雄叫", "疾駆", "撃滅"], normal: ["剣撃", "突撃", "強矛", "鉄盾"] },

  // Depth 8 (Kanken 3 — 2-char intents)
  悪霊: { normal: ["魂奪", "氷凍", "怨恨", "封縛"] },
  怪異: { normal: ["殴打", "裂傷", "貫通", "脅迫"] },
  山賊: { normal: ["強奪", "潜伏", "刺殺", "封縛"] },
  木偶: { normal: ["封縛", "絞殺", "裂傷", "幻惑"] },
  血猟: { normal: ["貫通", "裂傷", "魂奪", "潜伏"] },
  蛮族: { normal: ["殴打", "崩壊", "突撃", "裂傷"] },
  亡鯨: { normal: ["丸呑", "濁流", "崩壊", "重圧"] },
  亡侍: { normal: ["一閃", "貫通", "裂傷", "斬伐"] },
  幽鬼: { normal: ["幻惑", "潜伏", "氷凍", "魂奪"] },
  邪霊: { normal: ["邪炎", "黒炎", "封縛", "虐殺"] },
  魔王: { countdown: ["魔封", "黒炎", "破滅"], normal: ["封縛", "魂奪", "裂傷", "幻惑"] },
  魔帝: { countdown: ["審判", "処刑", "破滅"], normal: ["封縛", "貫通", "重圧", "黒炎"] },
  黒騎: { countdown: ["疾駆", "突撃", "貫通"], normal: ["剣撃", "裂傷", "崩壊", "殴打"] },
  霊: { normal: ["魂奪", "氷凍", "怨恨", "封縛"] },
  怪: { normal: ["殴打", "裂傷", "貫通", "脅迫"] },
  賊: { normal: ["強奪", "潜伏", "刺殺", "封縛"] },
  偶: { normal: ["封縛", "絞殺", "裂傷", "幻惑"] },
  猟: { normal: ["貫通", "裂傷", "魂奪", "潜伏"] },
  蛮: { normal: ["殴打", "崩壊", "突撃", "裂傷"] },
  鯨: { normal: ["丸呑", "濁流", "崩壊", "重圧"] },
  侍: { normal: ["一閃", "貫通", "裂傷", "斬伐"] },
  幽: { normal: ["幻惑", "潜伏", "氷凍", "魂奪"] },
  邪: { normal: ["邪炎", "黒炎", "封縛", "虐殺"] },
  魔: { countdown: ["魔封", "黒炎", "破滅"], normal: ["封縛", "魂奪", "裂傷", "幻惑"] },
  帝: { countdown: ["審判", "処刑", "破滅"], normal: ["封縛", "貫通", "重圧", "黒炎"] },
  騎: { countdown: ["疾駆", "突撃", "貫通"], normal: ["剣撃", "裂傷", "崩壊", "殴打"] },

  // Depth 9 (Kanken 2.5 — 2-char intents)
  怪猫: { normal: ["疾走", "凝眺", "裂傷", "奇襲"] },
  毒蛇: { normal: ["猛毒", "絞殺", "潜伏", "黒渦"] },
  血猿: { normal: ["跳躍", "投石", "強奪", "侮辱"] },
  疫蚊: { normal: ["吸血", "血毒", "疫病", "毒菌"] },
  影忍: { normal: ["凶刃", "潜伏", "猛毒", "煙幕"] },
  凶偵: { normal: ["偵察", "凝眺", "銃撃", "凶刃"] },
  獄曹: { normal: ["鉄鎖", "拷問", "撲殺", "封縛"] },
  怪仙: { normal: ["幻術", "黒渦", "落雷", "呪癒"] },
  血傑: { normal: ["凶刃", "剛撃", "粉砕", "一喝"] },
  火竜: { countdown: ["黒渦", "竜炎", "粉砕"], normal: ["業火", "剛撃", "落雷", "威嚇"] },
  覇王: { countdown: ["覇威", "重圧", "粉砕"], normal: ["凶刃", "剛撃", "撲殺", "破滅"] },
  元帥: { countdown: ["号令", "斉射", "砲撃"], normal: ["凶刃", "銃撃", "貫通", "包囲"] },
  猫: { normal: ["疾走", "凝眺", "裂傷", "奇襲"] },
  蛇: { normal: ["猛毒", "絞殺", "潜伏", "黒渦"] },
  猿: { normal: ["跳躍", "投石", "強奪", "侮辱"] },
  蚊: { normal: ["吸血", "血毒", "疫病", "毒菌"] },
  忍: { normal: ["凶刃", "潜伏", "猛毒", "煙幕"] },
  偵: { normal: ["偵察", "凝眺", "銃撃", "凶刃"] },
  曹: { normal: ["鉄鎖", "拷問", "撲殺", "破滅"] },
  仙: { normal: ["幻術", "黒渦", "落雷", "呪癒"] },
  傑: { normal: ["凶刃", "剛撃", "粉砕", "一喝"] },
  竜: { countdown: ["黒渦", "竜炎", "粉砕"], normal: ["業火", "剛撃", "落雷", "威嚇"] },
  覇: { countdown: ["覇威", "重圧", "粉砕"], normal: ["凶刃", "剛撃", "撲殺", "破滅"] },
  帥: { countdown: ["号令", "斉射", "砲撃"], normal: ["凶刃", "銃撃", "貫通", "包囲"] },

  // Depth 10 (Kanken 2 — 2-char intents)
  猛虎: { normal: ["牙爪", "急襲", "強蹴", "噛裂"] },
  怪亀: { normal: ["鉄殻", "重圧", "圧潰", "固守"] },
  毒蜂: { normal: ["毒針", "猛毒", "刺殺", "群襲"] },
  凶鶴: { normal: ["強蹴", "狙撃", "貫通", "烈風"] },
  暴駒: { normal: ["強蹴", "突撃", "疾走", "圧潰"] },
  妖魔: { normal: ["妖術", "呪殺", "幻惑", "常闇"] },
  大顎: { normal: ["牙爪", "噛砕", "圧潰", "裂傷"] },
  骸骨: { normal: ["死鎌", "斬首", "圧潰", "骨槍"] },
  怨鬼: { normal: ["怨呪", "呪殺", "闇討", "絞殺"] },
  冥王: { countdown: ["死兆", "冥罰", "斬首"], normal: ["死鎌", "斬首", "呪殺", "常闇"] },
  常闇: { countdown: ["常闇", "呪殺", "圧潰"], normal: ["魂奪", "氷闇", "怨呪", "斬首"] },
  鬱鬼: { countdown: ["閉塞", "常闇", "圧潰"], normal: ["呪殺", "怨呪", "封縛", "溺死"] },
  虎: { normal: ["牙爪", "急襲", "強蹴", "噛裂"] },
  亀: { normal: ["鉄殻", "重圧", "圧潰", "固守"] },
  蜂: { normal: ["毒針", "猛毒", "刺殺", "群襲"] },
  鶴: { normal: ["強蹴", "狙撃", "貫通", "烈風"] },
  駒: { normal: ["強蹴", "突撃", "疾走", "圧潰"] },
  妖: { normal: ["妖術", "呪殺", "幻惑", "常闇"] },
  顎: { normal: ["牙爪", "噛砕", "圧潰", "裂傷"] },
  骸: { normal: ["死鎌", "斬首", "圧潰", "骨槍"] },
  怨: { normal: ["怨呪", "呪殺", "闇討", "絞殺"] },
  冥: { countdown: ["死兆", "冥罰", "斬首"], normal: ["死鎌", "斬首", "呪殺", "常闇"] },
  闇: { countdown: ["常闇", "呪殺", "圧潰"], normal: ["魂奪", "氷闇", "怨呪", "斬首"] },
  鬱: { countdown: ["閉塞", "常闇", "圧潰"], normal: ["呪殺", "怨呪", "封縛", "溺死"] },

  // Depth 11 (Kanken Jun-1 — up to 3-char intents)
  血餓狼: { normal: ["血牙噛", "生肉喰", "鋭爪裂", "狂遠吠"] },
  九尾狐: { normal: ["狐焔焚", "九尾幻", "死角覗", "魂惑乱"] },
  黒影豹: { normal: ["死角覗", "喉笛噛", "黒閃襲", "鋭爪裂"] },
  大牙猪: { normal: ["巨牙突", "岩盤砕", "雷轟穿", "全身潰"] },
  血沼鰐: { normal: ["骨噛砕", "丸呑喰", "血沼潜", "大顎裂"] },
  深海鮫: { normal: ["血臭追", "骨噛砕", "黒渦呑", "八裂屠"] },
  鋼爪鷲: { normal: ["鋼爪穿", "急降閃", "暴風裂", "死角覗"] },
  焔獅子: { normal: ["劫火吠", "骨噛砕", "黒焔焚", "雷轟穿"] },
  人喰屍: { normal: ["生肉喰", "腐毒噛", "骨噛砕", "屍群襲"] },
  屠殺兇: { normal: ["皆薙殺", "血斧断", "血槍突", "八裂屠"] },
  古神龍: { countdown: ["深淵覗", "黒焔焚", "天地呑"], normal: ["雷轟穿", "生肉喰", "骨噛砕", "皆薙殺"] },
  紅焔鳳: { countdown: ["紅閃光", "黒焔焚", "万象焚"], normal: ["劫火嵐", "雷轟穿", "皆薙殺", "黒焔焚"] },
  天帝鷹: { countdown: ["死角覗", "紅閃光", "心臓穿"], normal: ["鋼爪穿", "暴風裂", "八裂屠", "急降閃"] },
  狼: { normal: ["血牙噛", "生肉喰", "鋭爪裂", "狂遠吠"] },
  狐: { normal: ["狐焔焚", "九尾幻", "死角覗", "魂惑乱"] },
  豹: { normal: ["死角覗", "喉笛噛", "黒閃襲", "鋭爪裂"] },
  猪: { normal: ["巨牙突", "岩盤砕", "雷轟穿", "全身潰"] },
  鰐: { normal: ["骨噛砕", "丸呑喰", "血沼潜", "大顎裂"] },
  鮫: { normal: ["血臭追", "骨噛砕", "黒渦呑", "八裂屠"] },
  鷲: { normal: ["鋼爪穿", "急降閃", "暴風裂", "死角覗"] },
  獅: { normal: ["劫火吠", "骨噛砕", "黒焔焚", "雷轟穿"] },
  屍: { normal: ["生肉喰", "腐毒噛", "骨噛砕", "屍群襲"] },
  兇: { normal: ["皆薙殺", "血斧断", "血槍突", "八裂屠"] },
  龍: { countdown: ["深淵覗", "黒焔焚", "天地呑"], normal: ["雷轟穿", "生肉喰", "骨噛砕", "皆薙殺"] },
  鳳: { countdown: ["紅閃光", "黒焔焚", "万象焚"], normal: ["劫火嵐", "雷轟穿", "皆薙殺", "黒焔焚"] },
  鷹: { countdown: ["死角覗", "紅閃光", "心臓穿"], normal: ["鋼爪穿", "暴風裂", "八裂屠", "急降閃"] },

  // Depth 12 (Kanken 1 — up to 4-char abyssal intents)
  魑魅魍魎: { countdown: ["百鬼夜祟", "深淵凝睨", "森羅殲滅"], normal: ["魂魄呑噬", "五臓抉出", "万死咒詛", "肉骨蹂躙"] },
  百足蠱蟲: { normal: ["百足毒噬", "五臓蝕毒", "万死咒詛", "肉骨蹂躙"] },
  血咒巫女: { normal: ["万死咒詛", "百鬼夜祟", "血咒怨祟", "魂魄呑噬"] },
  旱魃凶鬼: { normal: ["旱魃劫火", "血肉焚尽", "万死咒詛", "天地咆哮"] },
  深淵毒蛟: { normal: ["深淵毒渦", "魂魄呑噬", "黒雷轟撃", "肉骨蹂躙"] },
  漆黒毒蝮: { normal: ["即死猛毒", "五臓抉出", "魂魄呑噬", "暗闇潜伏"] },
  呪糸傀儡: { countdown: ["呪糸緊縛", "四肢切断", "森羅殲滅"], normal: ["傀儡操刃", "五臓抉出", "万死咒詛", "肉骨蹂躙"] },
  白骨髑髏: { countdown: ["血咒怨祟", "百鬼夜祟", "森羅殲滅"], normal: ["魂魄呑噬", "白骨砕撃", "万死咒詛", "五臓抉出"] },
  魔神饕餮: { countdown: ["深淵凝睨", "天地咆哮", "万象呑噬"], normal: ["魂魄呑噬", "五臓抉出", "肉骨蹂躙", "森羅殲滅"] },
  巫: { normal: ["万死咒詛", "百鬼夜祟", "血咒怨祟", "魂魄呑噬"] },
  蟲: { normal: ["百足毒噬", "五臓蝕毒", "万死咒詛", "肉骨蹂躙"] },
  蠱: { normal: ["百足毒噬", "万死咒詛", "百鬼夜祟", "五臓蝕毒"] },
  魑: { normal: ["深淵凝睨", "天地咆哮", "五臓抉出", "百鬼夜祟"] },
  魍: { normal: ["深淵毒渦", "万死咒詛", "魂魄呑噬", "百鬼夜祟"] },
  魃: { normal: ["旱魃劫火", "血肉焚尽", "万死咒詛", "天地咆哮"] },
  蛟: { normal: ["深淵毒渦", "魂魄呑噬", "黒雷轟撃", "肉骨蹂躙"] },
  蝮: { normal: ["即死猛毒", "五臓抉出", "魂魄呑噬", "暗闇潜伏"] },
  傀儡: { countdown: ["呪糸緊縛", "四肢切断", "森羅殲滅"], normal: ["傀儡操刃", "五臓抉出", "万死咒詛", "肉骨蹂躙"] },
  髑髏: { countdown: ["血咒怨祟", "百鬼夜祟", "森羅殲滅"], normal: ["魂魄呑噬", "白骨砕撃", "万死咒詛", "五臓抉出"] },
  饕餮: { countdown: ["深淵凝睨", "天地咆哮", "万象呑噬"], normal: ["魂魄呑噬", "五臓抉出", "肉骨蹂躙", "森羅殲滅"] }
};

/*
 * Atmospheric encounter flavor lines for every enemy & boss across all 12 Depths.
 * Displayed when a battle starts so encounters feel vivid rather than bare.
 */
const FOE_ENCOUNTER_LINES = {
  // Depth 1 (10級)
  犬: STG_L("A starved hound catches the scent of blood and bares its fangs in the dark.", "피 냄새를 맡은 들개가 어둠 속에서 시뻘건 안광을 번뜩이며 으르렁거린다.", "血の匂いを嗅ぎつけた野犬が闇の中で赤い眼を光らせ唸る。"),
  虫: STG_L("The ground writhes black as a chittering swarm of venomous insects crawls forth.", "바닥이 시커멓게 꿈틀거리며 사각거리는 벌레 떼가 기어오른다.", "地面が黒く蠢き、ざわめく蟲の群れが這い上がってくる。"),
  人: STG_L("A hollow-eyed wanderer snaps their head toward the talismans in your bag.", "넋을 잃고 헤매던 그림자가 부적 기운을 감지하고 기괴하게 고개를 꺾는다.", "虚ろな目で彷徨う人影が札の気配に気づき、不気味に首を傾げる。"),
  木: STG_L("A withered deadwood creaks aloud, twisting its jagged branches to block the path.", "말라비틀어진 고목이 삐걱거리며 살아 있는 가지로 앞길을 가로막는다.", "枯れ果てた古木が軋み、生きた枝を絡ませて行く手を阻む。"),
  石: STG_L("A moss-crusted boulder shudders to life and rumbles forward, shaking the earth.", "이끼 낀 거대한 바위가 둔중한 지축을 울리며 살의를 품고 굴러들어온다.", "苔むした巨石が地響きを立てて動き出し、敵意を帯びて迫る。"),
  貝: STG_L("A giant shell snaps open with a hollow crack, revealing pallid, hungry flesh.", "단단한 껍데기가 딱딱 소리를 내며 벌어지고 굶주린 살점이 드러난다.", "硬い殻が不気味な音を立てて開き、飢えた肉が覗く。"),
  目: STG_L("The darkness splits vertically as a colossal, bloodshot eye fixes its gaze on you.", "어둠 한복판이 세로로 갈라지더니 충혈된 거대한 눈동자가 그대를 노려본다.", "闇の真ん中が縦に裂け、充血した巨大な目玉がこちらを睨みつける。"),
  森: STG_L("The entire thicket inhales at once like a single, sprawling maw.", "빽빽한 수풀 전체가 하나의 거대한 아가리처럼 숨을 들이쉰다.", "鬱蒼とした森全体が、一つの巨大な顎門のように息を吸い込む。"),
  車: STG_L("Burning wheels shriek through the night air as a runaway war-cart charges.", "불타는 바퀴가 밤공기를 찢으며 폭주하는 수레가 맹렬히 돌진해 온다.", "燃える車輪が夜気を裂き、暴走する車が猛然と突進してくる。"),
  王: STG_L("A ruined monarch in a shattered crown raises a heavy hand in royal decree.", "부서진 왕관을 쓴 폐허의 군왕이 땅을 울리며 어명을 내리듯 손을 든다.", "砕けた冠を戴く廃墟の王が大地を揺らし、勅命を下すように手を挙げる。"),
  天: STG_L("The heavens above churn pitch-black as crushing celestial wrath descends.", "머리 위 하늘이 시커멓게 소용돌이치며 천벌의 기운이 내려앉는다.", "頭上の天が黒く渦巻き、逃れられぬ天罰の気配が降り注ぐ。"),
  月: STG_L("The pale moonlight turns deep crimson, pressing down with suffocating weight.", "창백하던 달빛이 순식간에 검붉게 물들며 대지를 숨 막히게 짓누른다.", "青白き月光が瞬く間にどす黒く染まり、大地を重く押し潰す。"),

  // Depth 2 (9級)
  馬: STG_L("A foaming black steed snorts wildly, trampling the stones beneath its hooves.", "거품을 문 흑마가 거친 숨을 뿜으며 성난 말굽으로 땅을 짓이긴다.", "泡を吹く黒馬が荒い息を吐き、猛る蹄で大地を踏み砕く。"),
  牛: STG_L("A blood-horned bull lowers its massive skull and exhales a cloud of steam.", "피 묻은 뿔을 낮게 깔고 콧김을 뿜으며 거대한 황소가 돌격 자세를 취한다.", "血塗られた角を低く構え、荒い鼻息とともに巨牛が突撃の機を窺う。"),
  鳥: STG_L("Ash-colored feathers scatter as a razor-beaked bird of prey dives from above.", "잿빛 깃털을 흩날리며 날카로운 부리를 지닌 괴조가 머리 위에서 급강하한다.", "灰色の羽を散らし、鋭い嘴を持つ怪鳥が頭上から急降下する。"),
  魚: STG_L("From the black water, a scaled maw erupts in a spray of freezing foam.", "검은 물속에서 비늘 돋친 아가리가 차가운 물보라를 일으키며 튀어오른다.", "黒い水面から鱗に覆われた大口が飛沫を上げて飛び出す。"),
  頭: STG_L("A bodiless giant head floats in midair, gnashing its teeth with a hollow clatter.", "몸통 없는 거대한 수급이 허공에 떠서 기괴하게 이빨을 부딪친다.", "胴体のない巨大な首が空中に浮かび、不気味に歯を打ち鳴らす。"),
  雪: STG_L("Flesh-cutting blizzard winds congeal into a pale figure exhaling lethal frost.", "살을 에는 눈보라가 창백한 형상으로 엉기며 치명적인 냉기를 뿜어낸다.", "肌を裂く吹雪が青白い影へと凝り固まり、死の冷気を吐き出す。"),
  雲: STG_L("Ominous black clouds sink low, coiling into a suffocating bank of living mist.", "시커먼 먹구름이 낮게 깔리며 숨통을 조이는 살아있는 안개로 변한다.", "不吉な黒雲が低く垂れ込め、息の根を止める生きた霧へと変わる。"),
  岩: STG_L("A towering crag tears itself from the cliffside, blocking the gorge.", "절벽 자체가 뜯겨 나온 듯한 바위 거인이 계곡을 틀어막는다.", "断崖そのものが剥がれ落ちたかのような岩の巨人が谷を塞ぐ。"),
  黒: STG_L("Pitch-black shadow swallows the light and rises in the shape of a blade.", "빛조차 삼키는 칠흑의 그림자가 칼날 같은 형상으로 일어난다.", "光すら呑み込む漆黒の影が、刃のような形となって立ち上がる。"),
  電: STG_L("Violet lightning rips through the air as deafening thunder shakes the ground.", "자줏빛 번개가 대기를 찢으며 귀를 찢는 뇌성이 작렬한다.", "紫電が大気を裂き、耳を劈く雷鳴が轟く。"),
  夜: STG_L("Every lantern snuffs out at once as endless, sovereign night claims the realm.", "사방의 등불이 일제히 꺼지고 끝없는 칠흑의 밤이 군림한다.", "四方の灯が一斉に消え、果てしなき漆黒の夜が君臨する。"),
  星: STG_L("A fallen omen-star pulses in the crater, radiating cold, murderous light.", "불길한 궤적을 그리며 추락한 흉성이 차갑고 강렬한 살기를 뿜는다.", "不吉な軌跡を描いて堕ちた凶星が、冷たく強烈な殺気を放つ。"),

  // Depth 3 (8級)
  羊: STG_L("A ram with spiraled black horns lets out a warped, almost human bleat.", "나선형으로 뒤틀린 검은 뿔을 번뜩이며 숫양이 기괴한 울음소리를 낸다.", "螺旋に歪んだ黒い角を光らせ、牡羊が不気味な鳴き声を上げる。"),
  客: STG_L("Dragging a blood-soaked hem, an uninvited guest draws cold steel from their robe.", "피 묻은 도포 자락을 끌며 낯선 불청객이 품속에서 시퍼런 칼날을 뽑아 든다.", "血濡れの裾を引きずり、招かれざる客が懐から白刃を抜く。"),
  医: STG_L("A beak-masked physician steps forward, clutching foul vials and bloodied needles.", "부리 가면을 쓴 역병 의사가 썩은 약병과 피 묻은 침을 들고 다가온다.", "嘴仮面を被った疫病医が、腐った薬瓶と血塗れの針を手に歩み寄る。"),
  者: STG_L("A face-wrapped figure lunges silently from the shadows toward your throat.", "얼굴을 천으로 감싼 정체불명의 자가 그림자 속에서 소리 없이 숨통을 노린다.", "布で顔を覆った何者かが、影の中から音もなく喉元を狙う。"),
  氷: STG_L("Jagged icicles erupt from the frozen floor like a forest of spears.", "서슬 퍼런 얼음 결정이 날카로운 창수풀처럼 사방에서 솟구친다.", "鋭い氷柱が槍の林のように四方から突き上がる。"),
  病: STG_L("Dark miasma and wet coughing spread like fog, seeping into skin and bone.", "검붉은 독기와 기침 소리가 안개처럼 퍼지며 살갗을 파고든다.", "どす黒い瘴気と咳き込む音が霧のように広がり、肌へと染み込む。"),
  暗: STG_L("The darkness beneath your feet churns and rises to swallow everything whole.", "발밑의 암흑이 꿀렁거리며 모든 것을 집어삼키려 솟아오른다.", "足元の暗黒がうねり、全てを呑み込もうと湧き上がる。"),
  血: STG_L("Pools of spilled blood flow backward on their own, rising into a crimson fiend.", "바닥에 흥건하던 선혈이 스스로 역류하며 검붉은 형체를 이룬다.", "床に溜まった鮮血が逆流し、どす黒い形を成して立ち上がる。"),
  悪: STG_L("Pure, unfiltered malice warps the rafters and takes physical form.", "서까래가 비틀릴 만큼 노골적인 악의가 형상화되어 앞을 가로막는다.", "梁が歪むほど露骨な悪意が形を成して立ち塞がる。"),
  死: STG_L("In a silence so cold even breath freezes, Death itself steps into view.", "숨소리조차 얼어붙는 정적 속에서 죽음 그 자체가 모습을 드러낸다.", "吐く息すら凍りつく静寂の中、死そのものが姿を現す。"),
  神: STG_L("An ancient, forsaken deity unfolds a warped halo atop the bloodied altar.", "제단 위에 웅크리던 해묵은 토착신이 일그러진 후광을 펼친다.", "祭壇に蹲っていた古き土着の神が、歪んだ後光を広げる。"),
  主: STG_L("The former master of this cursed domain drags heavy iron chains across the floor.", "이 저주받은 구역의 옛 주인이 무거운 쇠사슬을 끌며 걸어 나온다.", "この呪われた領域の旧き主が、重い鉄鎖を引きずりながら現れる。"),

  // Depth 4 (7級)
  熊: STG_L("Bristling with broken arrows, a monstrous bear rears up with a deafening roar.", "부러진 화살이 박힌 채 성난 거대 곰이 포효하며 앞발을 치켜든다.", "折れた矢を突き立てた巨熊が咆哮し、巨大な前足を振り上げる。"),
  鹿: STG_L("A great stag with blood-stained antlers lowers its head and charges.", "나뭇가지 같은 거대한 뿔에 핏자국을 매단 수사슴이 돌진해 온다.", "枝のような巨角を血に染めた大鹿が突進してくる。"),
  兵: STG_L("Gripping a notched blade, a fallen soldier refuses to leave the battlefield.", "부러진 창칼을 쥔 패잔병의 망령이 죽어서도 전장을 떠나지 못하고 덤벼든다.", "欠けた刀を握る敗残兵の亡霊が、死してなお戦場を離れず襲いかかる。"),
  徒: STG_L("A bloodthirsty band of marauders surrounds you with torches and clubs.", "피에 굶주린 약탈자 무리가 횃불과 몽둥이를 들고 사방을 포위한다.", "血に飢えた徒党が松明と棍棒を手に四方を包囲する。"),
  卒: STG_L("A hollow-eyed foot soldier in rusted armor thrusts a spear with mechanical fury.", "녹슨 갑주를 걸친 보졸이 공허한 눈으로 집요하게 창을 찔러온다.", "錆びた鎧の兵卒が虚ろな目で執拗に槍を繰り出す。"),
  隊: STG_L("Marching in eerie unison, a phantom squad levels their weapons through the mist.", "발소리를 맞춘 망자의 부대가 안개 속에서 일제히 무기를 겨눈다.", "足音を揃えた亡者の部隊が、霧の中から一斉に武器を構える。"),
  機: STG_L("Rusted gears and iron bowstrings groan to life, locking onto you automatically.", "녹슨 톱니와 강철 활시위가 삐걱거리며 침입자를 향해 저절로 조준을 마친다.", "錆びた歯車と鋼の弦が軋み、侵入者へ向けてひとりでに照準を合わせる。"),
  官: STG_L("Holding blood-stained bamboo slips, a ruthless magistrate pronounces execution.", "피 묻은 죽간을 든 집행관이 죄인을 처단하듯 서늘하게 처형령을 내린다.", "血塗られた竹簡を手にした執行官が、冷酷に処刑を言い渡す。"),
  臣: STG_L("Weeping tears of blood for a fallen lord, an armored retainer raises a greatsword.", "주군을 잃은 중갑의 무신이 피눈물을 흘리며 대검을 고쳐 쥔다.", "主君を失った重装の武臣が血の涙を流しながら大剣を構え直す。"),
  軍: STG_L("War drums thunder as thousands of slain warriors surge forward as a single host.", "북소리와 함께 수천의 전사자들이 하나의 거대한 군세로 몰려온다.", "陣太鼓の轟きとともに、幾千の戦死者が一つの巨大な軍勢となって押し寄せる。"),
  司: STG_L("Cold, judging eyes weigh the value of your life upon unseen scales.", "생사를 재단하는 판관의 서늘한 눈빛이 그대의 목숨값을 저울질한다.", "生死を裁く司の冷たい眼差しが、こちらの命の重さを秤にかける。"),
  勇: STG_L("Armor shattered, a berserk champion shakes the very air with sheer fighting spirit.", "갑옷이 부서진 채 투기만으로 대기를 진동시키는 맹장이 포효한다.", "砕けた鎧のまま、闘気だけで大気を震わせる猛将が咆哮する。"),

  // Depth 5 (6級)
  士: STG_L("A fallen warrior consumed by bloodlust grips the hilt of a cursed blade.", "도를 잃고 살육에 미친 타락 무사가 요기를 품은 칼자루를 쥔다.", "道を失い殺戮に狂った堕ちた武士が、妖気を帯びた柄を握る。"),
  犯: STG_L("Dragging broken shackles at the ankles, a condemned criminal bursts into mad laughter.", "끊어진 족쇄를 발목에 찬 탈옥수가 광기 어린 웃음을 터뜨린다.", "千切れた足枷を引きずる脱獄犯が狂気の笑みを浮かべる。"),
  像: STG_L("Weeping blood from cracked stone eyes, a temple statue swings its crushing arm.", "금이 간 눈에서 피눈물을 흘리는 석상이 무거운 돌팔을 휘두른다.", "ひび割れた目から血の涙を流す石像が、重い石の腕を振るう。"),
  象: STG_L("Bound in heavy chains, an armored war-elephant charges with earth-shattering force.", "땅을 뒤흔드는 발소리와 함께 쇠사슬을 두른 갑주 거상이 돌진한다.", "大地を揺るがす足音とともに、鉄鎖を巻いた装甲の巨象が突進する。"),
  毒: STG_L("Purple venom-smoke condenses into a fiend whose very breath sears the lungs.", "보랏빛 독연기가 뭉쳐 숨만 쉬어도 폐부가 타들어 가는 괴물이 된다.", "紫の毒煙が凝り固まり、息をするだけで肺を焼く怪物となる。"),
  迷: STG_L("From disorienting mist that steals all sense of direction, a phantom lunges.", "방향 감각을 앗아가는 미망의 안개 속에서 기묘한 환영이 실체를 드러낸다.", "方向感覚を奪う迷いの霧の中から、奇妙な幻影が実体を現す。"),
  武: STG_L("Forged solely to cleave and crush, an avatar of martial wrath unleashes its aura.", "오직 베고 부수기 위해 벼려진 무력의 화신이 살기를 폭발시킨다.", "ただ斬り砕くためだけに鍛えられた武の権化が殺気を爆発させる。"),
  罪: STG_L("Countless grudges of the damned fuse together, rattling the chains of karma.", "수많은 죄인의 원한이 엉겨 붙은 흉물이 무거운 죄업의 사슬을 흔든다.", "無数の罪人の怨念が絡み合った凶物が、業の鎖を鳴らす。"),
  災: STG_L("Scorching wind and ruinous storm converge into a living calamity.", "천지가 뒤집히는 듯한 열기와 폭풍이 살아있는 재앙으로 강림한다.", "天地を覆すほどの熱気と暴風が、生ける災厄となって降り立つ。"),
  師: STG_L("Chanting forbidden hexes, a heretic master fans out blood-inked talismans in midair.", "금기된 주술을 읊는 이단의 도사가 허공에 핏빛 부적을 펼쳐 놓는다.", "禁じられた呪術を唱える異端の師が、空中に血文字の札を広げる。"),
  仏: STG_L("Harboring ruin instead of mercy, a colossal dark Buddha gazes down with a twisted smile.", "자비 대신 파멸을 품은 거대한 마불이 일그러진 미소로 내려다본다.", "慈悲ではなく破滅を宿した巨大な魔仏が、歪んだ笑みで見下ろす。"),

  // Depth 6 (5級)
  骨: STG_L("Scattered bones clatter together on their own, rising with a rusted blade.", "흩어져 있던 백골들이 달그락거리며 스스로 맞춰져 칼을 든다.", "散らばっていた白骨がカラカラと組み上がり、錆びた刀を構える。"),
  亡: STG_L("An unresting revenant reaches out with ice-cold fingers for the warmth of the living.", "성불하지 못한 망자가 시린 손끝으로 산 자의 온기를 탐하며 다가온다.", "成仏できぬ亡者が凍える指先で生者の温もりを求めて迫る。"),
  蚕: STG_L("Fed on human flesh, a bloated pale silkworm spits blood-soaked threads.", "살점을 먹고 자란 창백한 거대 누에가 피 묻은 고치실을 토해낸다.", "人肉を喰らって肥え太った青白い巨蚕が、血濡れの糸を吐き出す。"),
  衆: STG_L("A tangled multitude of limbs and screaming mouths surges forward as one.", "수많은 팔다리가 뒤엉킨 아귀의 군중이 아우성치며 한꺼번에 덮쳐온다.", "無数の手足が絡み合う亡者の群衆が、喚きながら一斉に襲いかかる。"),
  従: STG_L("A soul-bound thrall draws a dagger in eerie, puppet-like obedience.", "영혼을 저당 잡힌 꼭두각시 시종이 주인의 명에 따라 단검을 뽑는다.", "魂を縛られた傀儡の従者が、主の命に従って短剣を抜く。"),
  警: STG_L("Detecting an intruder, a skeletal sentry rings a shrill alarm bell and charges.", "침입자를 감지한 백골 파수병이 날카로운 경종을 울리며 달려든다.", "侵入者を察知した白骨の警衛が、甲高い警鐘を鳴らして斬りかかる。"),
  敵: STG_L("A battle-scarred nemesis steps into lethal range with suffocating precision.", "수많은 사선을 넘어온 숙적이 숨 막히는 간합으로 다가선다.", "幾多の死線を越えた宿敵が、息詰まる間合いで歩み寄る。"),
  異: STG_L("A grotesque aberration beyond human form twists its bones and tentacles.", "사람의 형태를 벗어난 이형의 괴물이 뼈와 촉수를 뒤틀며 기어 나온다.", "人の形を逸脱した異形の怪物が、骨と触手を捩じりながら這い出る。"),
  皇: STG_L("Rising from a throne of skulls, an ancient emperor radiates absolute dominion.", "해골 옥좌에서 일어난 백골 황제가 거역할 수 없는 위압감을 뿜어낸다.", "骸の玉座から立ち上がった白骨の皇帝が、絶対の威圧感を放つ。"),
  将: STG_L("An undefeated skeletal general raises a blood-tempered halberd to command the dead.", "천군만마를 호령하던 백골 대장군이 피 묻은 대도를 치켜든다.", "千軍万馬を号令した白骨の将軍が、血塗られた大刀を掲げる。"),
  聖: STG_L("Wrapped in a tarnished halo, a fallen saint awakens to purge all living breath.", "빛바랜 후광을 두른 타락 성자가 모든 산 자를 지우려 눈을 뜬다.", "色褪せた後光を纏う堕ちた聖者が、全ての生者を浄化すべく目を開く。"),

  // Depth 7 (4級)
  獣: STG_L("Draped in matted fur, a ravenous beast drools crimson and leaps.", "피 엉킨 털가죽을 뒤집어쓴 굶주린 마수가 침을 흘리며 도약한다.", "血の固まった毛皮を纏う飢えた魔獣が、涎を垂らして跳躍する。"),
  僧: STG_L("Wearing a rosary of skulls, a renegade monk slams an iron staff into the stone.", "염주 대신 해골 목걸이를 걸친 파계승이 쇠석장을 땅에 내리꽂는다.", "髑髏の数珠を首にかけた破戒僧が、鉄の錫杖を地に突き立てる。"),
  盗: STG_L("Riding the shadows behind your back, a cutthroat levels a poisoned blade.", "소리 없이 등 뒤의 어둠을 타고 그림자 도적이 독단도를 겨눈다.", "音もなく背後の闇を滑り、影の盗賊が毒短刀を突きつける。"),
  狩: STG_L("A man-hunting tracker steps from the brush with bloodied traps and drawn bow.", "짐승 대신 사람을 사냥하는 추적자가 피 묻은 덫과 활을 든다.", "獣ではなく人を狩る追跡者が、血塗れの罠と弓を構える。"),
  影: STG_L("Your own shadow betrays the light, rising like a black spear from the floor.", "발밑의 그림자가 주인을 배신하듯 검은 창처럼 솟구쳐 오른다.", "足元の影が主を裏切るように黒い槍となって突き上がる。"),
  凶: STG_L("Condensed ill omen takes shape, letting out a shriek that curdles the blood.", "불길한 흉조가 응축된 괴물이 피가 식는 비명을 지르며 달려든다.", "不吉な凶兆が凝縮した怪物が、血の凍る悲鳴を上げて襲いかかる。"),
  巨: STG_L("Scraping the ceiling with its shoulders, a titan raises a boulder-sized fist.", "천장에 어깨가 닿을 듯한 거인이 바위 같은 주먹을 치켜든다.", "天井に肩が届くほどの巨人が、岩のような拳を振り上げる。"),
  狂: STG_L("Completely bereft of reason, a frenzied berserker tears at their own flesh and charges.", "이성을 완전히 상실한 광인이 자기 살을 찢으며 미친 듯이 폭주한다.", "理性を完全に失った狂人が、自らの肉を裂きながら暴走する。"),
  鬼: STG_L("The man-eating Oni that mimicked human cries hefts its spiked iron club.", "사람의 목소리를 흉내 내던 식인 악귀가 거대한 쇠방망이를 들어 올린다.", "人の声を真似ていた食人鬼が、巨大な金棒を持ち上げる。"),
  雷: STG_L("Cloaked in stormclouds, the thunder beast roars as the floor chars black.", "먹구름을 두른 뇌신수가 포효할 때마다 바닥이 새까맣게 불타오른다.", "黒雲を纏う雷獣が咆哮するたび、床が黒焦げに焼き尽くされる。"),
  雄: STG_L("The warlord spirit ruling this valley unleashes an overwhelming wave of valor.", "골짜기를 지배하는 괴력의 영웅신이 압도적인 투기를 내뿜는다.", "谷を支配する怪力の英雄神が、圧倒的な闘気を解き放つ。"),

  // Depth 8 (3級)
  霊: STG_L("With a bone-chilling wail, a pale vengeful spirit lunges from the void.", "서늘한 한기와 함께 허공에서 창백한 원령이 통곡하며 덮쳐온다.", "骨まで凍る冷気とともに、虚空から青白い怨霊が慟哭して襲いかかる。"),
  怪: STG_L("A grotesque yokai of shifting eyes and snapping jaws emerges from the gloom.", "어둠 속에서 눈알과 아가리가 뒤섞인 기괴한 요괴가 모습을 드러낸다.", "闇の中から目玉と顎が入り混じる奇怪な物の怪が姿を現す。"),
  賊: STG_L("Hefting a blood-rusted greataxe, a ruthless brigand bares jagged teeth.", "피비린내 나는 도끼를 걸친 산적이 사악하게 이빨을 드러낸다.", "血錆びた大斧を担いだ山賊が、獰猛に歯を剥き出す。"),
  偶: STG_L("Dangling from severed strings, a life-sized wooden puppet jerks forward with blades drawn.", "끊어진 줄에 매달린 저주받은 목각인형이 관절을 꺾으며 기괴하게 걸어온다.", "切れた糸を垂らした呪いの木偶人形が、関節を鳴らして不気味に歩み寄る。"),
  猟: STG_L("Having tracked your blood scent, a feral huntsman locks on with hound-like eyes.", "피 냄새를 추적해 온 엽사가 사냥개 같은 눈빛으로 무기를 겨눈다.", "血の匂いを追跡してきた猟師が、猟犬のような眼差しで獲物を捉える。"),
  蛮: STG_L("Crowned in beast bones, a savage warrior charges with an earth-shaking war cry.", "뼈 투구를 쓴 황야의 야만전사가 지축을 흔드는 함성과 함께 돌격한다.", "骨の兜を被った蛮族の戦士が、地軸を揺らす雄叫びとともに突撃する。"),
  鯨: STG_L("Swimming through a sea of black fog, a colossal phantom whale opens its abyssal maw.", "검은 안개의 바다를 유영하던 거대한 고래의 망령이 심연 같은 아가리를 벌린다.", "黒霧の海を泳ぐ巨大な鯨の亡霊が、深淵のような大口を開く。"),
  侍: STG_L("Drawing a blood-starved katana, an undead samurai takes a stance of instant severance.", "피에 굶주린 요도를 뽑아 든 사무라이가 일섬의 자세를 취한다.", "血に飢えた妖刀を抜いた侍が、一閃の構えを取る。"),
  幽: STG_L("Faint enough for steel to pass right through, a nether-phantom reaches for your soul.", "칼날조차 스쳐 지나갈 듯 흐릿한 유령이 영혼을 직접 노리고 스며든다.", "刃すらすり抜けるほど霞んだ幽鬼が、魂を直接刈り取ろうと忍び寄る。"),
  邪: STG_L("Crystallized curses and vile intent scatter black flames in every direction.", "사념과 저주가 응결된 흉물이 검은 불꽃을 사방에 흩뿌린다.", "邪念と呪いが凝結した凶物が、黒い炎を四方に撒き散らす。"),
  魔: STG_L("Mocking mortal laws, an archfiend descends in a pillar of hellfire.", "인간계의 법칙을 비웃는 대마(大魔)가 지옥불 기둥 속에서 강림한다.", "人の世の理を嘲笑う大魔が、業火の柱の中から顕現する。"),
  帝: STG_L("Having devoured an empire's grudges, the Demon Emperor lowers the gavel of doom.", "옛 제국의 원한을 모두 집어삼킨 마제가 멸망의 철퇴를 내린다.", "旧き帝国の怨念を呑み込んだ魔帝が、滅びの鉄槌を下す。"),
  騎: STG_L("Astride a skeletal warhorse, a black knight levels a lance that pierces space itself.", "해골 군마에 올라탄 지옥의 흑기사가 공간마저 꿰뚫을 기세로 창을 겨눈다.", "骸の軍馬に跨る黒騎士が、空間すら貫く勢いで槍を構える。"),

  // Depth 9 (準2級)
  猫: STG_L("Swaying its forked tail, a giant bakeneko gleams with golden eyes in the dark.", "두 갈래로 갈라진 꼬리를 흔들며 거대한 고양이 요괴가 어둠 속에서 눈을 빛낸다.", "二股の尾を揺らし、巨大な化け猫が闇の中で金色の眼を光らせる。"),
  蛇: STG_L("Thick as a tree trunk, a venomous serpent slithers out and flicks its crimson tongue.", "성인 몸통만 한 구렁이 요물이 스르륵 기어 나오며 핏빛 혀를 날름거린다.", "大木の幹ほどもある大蛇が這い出し、紅い舌をチロチロと覗かせる。"),
  猿: STG_L("With unnaturally long arms, a blood-furred ape demon leaps with a cruel grin.", "기괴하게 긴 팔을 가진 괴원숭이가 잔혹한 웃음과 함께 도약한다.", "不気味に長い腕を持つ怪猿が、残酷な笑みを浮かべて跳びかかる。"),
  蚊: STG_L("Swollen with stolen blood, a plague-mosquito buzzes with an ear-splitting whine.", "피를 빨아 부풀어 오른 흡혈 독충이 귀를 찌르는 날갯짓으로 다가온다.", "血を吸って膨れ上がった疫病蚊が、耳を刺す羽音とともに迫る。"),
  忍: STG_L("From a veil of smoke, a shadow assassin strikes toward your vitals with poisoned steel.", "연막 속에서 수리검과 독칼을 쥔 어둠의 자객이 숨통을 노린다.", "煙幕の中から、毒刃を握る闇の忍びが急所を狙う。"),
  偵: STG_L("Having read your every move, a doom-scout springs a lethal ambush formation.", "일거수일투족을 꿰뚫어 본 척후병이 살수의 포위망을 펼친다.", "こちらの動きを全て見切った斥候が、必殺の包囲網を敷く。"),
  曹: STG_L("Draped in torture irons, a hell-warder sergeant rattles heavy chains.", "고문 도구를 주렁주렁 매단 지옥의 옥졸장이 쇠사슬을 철컥이며 다가온다.", "拷問具をぶら下げた獄卒長が、重い鎖を鳴らして歩み寄る。"),
  仙: STG_L("Warped into a monster by the lust for immortality, a fallen hermit weaves eerie arts.", "불로장생을 탐하다 괴물이 된 타락 선인이 기이한 도술을 부린다.", "不老不死を貪り怪物と化した堕仙が、妖しき仙術を操る。"),
  傑: STG_L("A blood-drenched warlord who slaughtered whole armies alone rests a greatsword on his shoulder.", "수많은 전장을 홀로 도륙한 피에 젖은 호걸이 대검을 어깨에 걸친다.", "幾多の戦場を単身で屠った血塗れの怪傑が、大剣を肩に担ぐ。"),
  竜: STG_L("Venting magma-hot breath between its scales, an ancient wyrm lets out a sky-splitting roar.", "비늘 사이로 용암 같은 열기를 뿜어내는 고대 화룡이 포효한다.", "鱗の間から溶岩の熱気を噴き出す古竜が、天を裂く咆哮を上げる。"),
  覇: STG_L("Absolute, tyrannical覇気 crushes the room, demanding total submission.", "모든 것을 힘으로 굴복시키는 폭군의 절대적인 패기가 공간을 짓누른다.", "全てを力でねじ伏せる覇王の絶対的な覇気が空間を押し潰す。"),
  帥: STG_L("Commanding phantom artillery and blade-formations, the Grand Marshal orders a full volley.", "망자의 포병과 검진을 지휘하는 대원수가 일제 사격을 명한다.", "亡者の砲兵と剣陣を統べる大元帥が、一斉射撃を命じる。"),

  // Depth 10 (2級)
  虎: STG_L("With a roar that rips the dark, a man-eating tiger bares blood-dripping fangs.", "어둠을 가르는 포효와 함께 식인 대호가 피 묻은 송곳니를 드러낸다.", "闇を裂く咆哮とともに、人喰い大虎が血塗られた牙を剥く。"),
  亀: STG_L("Encased in basalt-hard shell, a monstrous tortoise crushes the earth beneath its weight.", "강철보다 단단한 등껍질을 두른 현무암 괴거북이 대지를 짓뭉갠다.", "鋼より硬い甲羅を纏う怪亀が、圧倒的な重みで大地を踏み潰す。"),
  蜂: STG_L("Dripping lethal venom from an arm-length stinger, a queen hornet hovers in the gloom.", "팔뚝만 한 독침을 번뜩이는 여왕벌 괴충이 맹독을 뚝뚝 흘리며 비행한다.", "腕ほどもある毒針を光らせ、猛毒を滴らせる女王蜂が宙を舞う。"),
  鶴: STG_L("With razor-edged feathers and a spear-like beak, a phantom crane slices the wind.", "면도날 같은 깃털과 창 같은 부리를 지닌 괴조 학이 바람을 가른다.", "剃刀の羽と槍の嘴を持つ怪鶴が、風を切り裂く。"),
  駒: STG_L("Clad in cursed barding, a runaway war-colt paws the ground and charges.", "저주받은 갑주를 두른 폭주 망아지가 앞발을 구르며 돌격해 온다.", "呪われた馬鎧を纏う暴れ駒が、前足を掻いて突撃してくる。"),
  妖: STG_L("Wrapped in bewitching whispers and illusion, a wicked apparition blooms from the dark.", "홀리는 목소리와 환각을 두른 요마가 그림자 속에서 피어난다.", "惑わす声と幻覚を纏った妖魔が、影の中から咲き出る。"),
  顎: STG_L("In the pitch dark, a colossal jawbone of jagged teeth clatters open to chew you whole.", "어둠 속에서 오직 거대한 턱뼈와 이빨만이 덜컥거리며 씹어 삼키려 든다.", "暗闇の中で巨大な顎骨と歯だけがガチガチと鳴り、丸ごと噛み砕こうと迫る。"),
  骸: STG_L("Fused from hundreds of skeletons, a towering bone-colossus swings a reaper's scythe.", "수백 구의 유골이 융합된 거대 해골괴가 사신의 낫을 휘두른다.", "幾百の遺骨が融合した巨大骸骨が、死神の大鎌を振るう。"),
  怨: STG_L("A thousand years of unredeemed spite coils into black hands around your throat.", "구원받지 못한 천년의 원념이 검은 손길이 되어 목을 조여 온다.", "救われぬ千年の怨念が黒い手となって喉元を絞めつける。"),
  冥: STG_L("Ruling the threshold of life and death, the Lord of the Underworld raises his scythe.", "산 자와 죽은 자의 경계를 다스리는 명부의 군주가 사신의 낫을 치켜든다.", "生と死の境を統べる冥府の主が、死の大鎌を高く掲げる。"),
  闇: STG_L("Primordial darkness that devours the very concept of light closes in from all sides.", "빛이라는 개념조차 집어삼키는 태초의 암흑이 사방에서 조여 온다.", "光という概念すら呑み込む原初の闇が、四方から迫り来る。"),
  鬱: STG_L("Suffocating despair thickens into black mire, crushing the heart just to breathe.", "숨조차 쉴 수 없는 질식할 듯한 절망의 안개가 심장을 짓누르며 형체를 이룬다.", "息すらできぬ絶望の澱みが心臓を押し潰しながら形を成す。"),

  // Depth 11 (準1級)
  狼: STG_L("Silver fur matted with blood, a dire wolf lets out a low, bone-shaking growl.", "은빛 털에 피를 적신 굶주린 마랑이 송곳니를 드러내며 낮게 포효한다.", "銀の毛並みを血で濡らした魔狼が、牙を剥いて低く唸る。"),
  狐: STG_L("Nine tails of foxfire flicker in midair as a bewitching kitsune smiles.", "아홉 갈래의 여우불이 허공에 일렁이며 요사스러운 여우 요괴가 웃는다.", "九つの狐火が空中に揺らめき、妖艶な妖狐が笑みを浮かべる。"),
  豹: STG_L("Faster than shadow, a black panther erases its presence and pounces for the jugular.", "그림자보다 빠르게 기척을 지운 흑표범이 단숨에 목덜미를 노리고 덮친다.", "影より速く気配を消した黒豹が、一瞬で頸動脈を狙い飛びかかる。"),
  猪: STG_L("Bearing tusks that shatter boulders, a colossal boar shakes the cavern floor.", "바위도 박살 내는 어금니를 치켜든 거대 산돼지가 지면을 뒤흔든다.", "岩をも砕く牙を振り上げ、大猪が地面を揺るがす。"),
  鰐: STG_L("From the blood-red mire, a prehistoric crocodile explodes upward with jaws agape.", "핏빛 늪지대에서 거대한 악어가 물보라와 함께 아가리를 벌린다.", "血色の沼地から巨大な鰐が水飛沫とともに大顎を開く。"),
  鮫: STG_L("Drawn by the scent of blood, an abyssal shark cleaves through the dark air.", "피 냄새를 맡은 심해의 식인상어가 날카로운 이빨을 번뜩이며 허공을 가른다.", "血の匂いを嗅ぎつけた深海の鮫が、鋭い歯を光らせ空間を裂く。"),
  鷲: STG_L("With talons like forged steel, a storm-eagle dives with hurricane force.", "강철 같은 발톱을 지닌 창공의 괴수리가 폭풍을 일으키며 급강하한다.", "鋼の鉤爪を持つ大鷲が、暴風を巻き起こして急降下する。"),
  獅: STG_L("Manes ablaze with hellfire, a lion-fiend unleashes a thunderous roar.", "불타는 갈기를 휘날리는 화염의 사자 괴수가 우레 같은 포효를 터뜨린다.", "燃え盛る鬣をなびかせ、焔の獅子が雷鳴のごとき咆哮を放つ。"),
  屍: STG_L("Animated by ancient curses, a rotting corpse rises to feast on living flesh.", "고대의 저주로 되살아난 주검이 산 자의 살점을 탐하며 일어난다.", "古の呪いで蘇った腐乱の屍が、生者の肉を求めて立ち上がる。"),
  兇: STG_L("Armed with blood-caked axe and spear, a brutal executioner blocks the way.", "피 엉킨 도끼와 창으로 무장한 흉폭한 도살자가 앞길을 막아선다.", "血塗られた斧と槍で武装した兇漢が、行く手を阻む。"),
  龍: STG_L("Commanding clouds and lightning, a true Dragon fills the heavens and gazes down.", "구름과 벼락을 거느린 신룡이 하늘을 뒤덮으며 아래를 굽어본다.", "雲と雷を従えた真龍が天を覆い尽くし、眼下を見下ろす。"),
  鳳: STG_L("Wreathed in undying crimson flame, the Phoenix spreads its wings to incinerate the world.", "꺼지지 않는 홍련의 불꽃을 두른 봉황이 날개를 펼쳐 세상을 태운다.", "消えぬ紅蓮の焔を纏う鳳凰が翼を広げ、世界を焼き尽くす。"),
  鷹: STG_L("Piercing eyes that miss not a single breath lock onto your heart from the sky.", "모든 움직임을 꿰뚫어 보는 천공의 제왕매가 사냥감의 심장을 정조준한다.", "全ての動きを見抜く天空の鷹が、獲物の心臓を正確に射抜く。"),

  // Depth 12 (1級)
  巫: STG_L("Murmuring blood-written incantations, an abyssal shaman weaves a soul-rotting hex.", "피로 쓴 주문을 읊조리는 나락의 무녀가 혼을 갉아먹는 저주를 건다.", "血文字の呪文を呟く奈落の巫女が、魂を蝕む呪詛を紡ぐ。"),
  蟲: STG_L("Writhing with countless legs, a primordial centipede-horror crawls from the pit.", "셀 수 없이 많은 다리를 꿈틀거리는 나락의 백족 고충이 기어 나온다.", "無数の脚を蠢かせる奈落の百足蟲が、穴の底から這い出てくる。"),
  蠱: STG_L("The last surviving venom-fiend of a cannibalistic jar oozes forth in black miasma.", "독충들이 서로를 잡아먹고 마지막에 살아남은 고독(蠱毒)의 화신이 스며 나온다.", "毒蟲が共食いして最後に生き残った蠱毒の権化が、黒き瘴気とともに滲み出る。"),
  魑: STG_L("A twisted mountain demon glares from the crags with eerie, blue-burning eyes.", "기괴하게 일그러진 얼굴의 산도깨비 치(魑)가 시퍼런 안광을 번뜩인다.", "歪んだ顔の山の怪・魑が、青白い眼光でこちらを睨みつける。"),
  魍: STG_L("From the damp abyssal dark, a water-fiend clutches at your ankles to drag you under.", "축축한 어둠 속에서 물가의 망량(魍)이 발목을 잡아 심연으로 끌고 가려 한다.", "湿った暗闇から水の怪・魍が足首を掴み、深淵へと引きずり込もうとする。"),
  魃: STG_L("A drought-demon radiates scorching heat that parches blood and moisture alike.", "주변의 모든 수분과 피를 말려버리는 가뭄의 귀신 발(魃)이 모습을 드러낸다.", "周囲の水分と血を干上がらせる旱魃の鬼が、灼熱とともに姿を現す。"),
  蛟: STG_L("Churning toxic fog and whirlpools, an abyssal flood-dragon coils its massive body.", "독안개와 소용돌이를 일으키는 심연의 교룡이 거대한 몸통을 틀며 솟구친다.", "毒霧と渦潮を巻き起こす深淵の蛟が、巨体をくねらせて湧き上がる。"),
  蝮: STG_L("A pitch-black pit viper whose single drop of venom kills instantly coils in silence.", "한 방울로도 목숨을 앗아가는 칠흑의 살무사가 소리 없이 똬리를 튼다.", "一滴で命を奪う漆黒の蝮が、音もなくとぐろを巻く。"),
  傀儡: STG_L("Pulled by unseen threads of fate, a cursed marionette dances forward with flashing blades.", "보이지 않는 실에 조종당하는 저주의 꼭두각시 괴뢰가 칼날을 춤추듯 휘두른다.", "見えぬ糸に操られた呪いの傀儡が、刃を舞うように振るう。"),
  髑髏: STG_L("A weather-beaten tower of skulls spews pale ghost-fire from its hollow sockets.", "비바람에 바랜 거대한 해골 독루가 안와에서 푸른 귀화를 뿜어낸다.", "風雨に晒された巨大な髑髏が、眼窩から青い鬼火を噴き出す。"),
  饕餮: STG_L("The supreme glutton of the Abyss opens its maw to devour both flesh and Kanji alike.", "세상 모든 것과 한자마저 집어삼키는 나락의 마신 도철(饕餮)이 아가리를 벌린다.", "万象と漢字すら喰らい尽くす奈落の魔神・饕餮が、巨大な顎門を開く。")
};

function getEnemyEncounterLine(kanji, rank = "normal", isWounded = false, isAmbush = false) {
  let entry = FOE_ENCOUNTER_LINES[kanji];
  if (!entry && kanji && kanji.length > 1) {
    const chars = Array.from(String(kanji));
    for (let i = chars.length - 1; i >= 0; i--) {
      if (FOE_ENCOUNTER_LINES[chars[i]]) {
        entry = FOE_ENCOUNTER_LINES[chars[i]];
        break;
      }
    }
  }
  const baseLine = entry ? pickLang(entry) : "";
  if (isAmbush) {
    const ambushPrefix = pickLang(STG_L(
      "Tearing off its benign mask, it bares its true nature!",
      "우호적인 가면을 찢어발기며 흉포한 본색을 드러낸다!",
      "友好的な仮面をかなぐり捨て、凶暴な本性を現す！"
    ));
    return baseLine ? `${ambushPrefix} ${baseLine}` : ambushPrefix;
  }
  if (isWounded) {
    const woundedPrefix = pickLang(STG_L(
      "Nursing its fresh wounds, it glares at you with deeper malice.",
      "아물지 않은 상처에서 피를 흘리며 한층 더 지독한 살의를 품고 노려본다.",
      "癒えぬ傷から血を流しながら、いっそう深い殺意を宿して睨みつける。"
    ));
    return baseLine ? `${baseLine} (${woundedPrefix})` : woundedPrefix;
  }
  return baseLine;
}

/* Enemy short names for full-screen encounter reveal (적/강적/주인 조우 -> 한자 -> 적 이름) */
const FOE_NAMES = {
  // Depth 1 (10級)
  犬: STG_L("Stray Hound", "길 잃은 들개", "迷い野犬"),
  虫: STG_L("Venomous Swarm", "사각거리는 벌레 떼", "蠢く蟲の群れ"),
  人: STG_L("Hollow Wanderer", "넋 잃은 헤매는 자", "虚ろな彷徨い人"),
  木: STG_L("Withered Deadwood", "뒤틀린 고목", "歪んだ古木"),
  石: STG_L("Living Boulder", "살의를 품은 거석", "殺意宿す巨石"),
  貝: STG_L("Starved Shell", "굶주린 귀조개", "飢えた怪貝"),
  目: STG_L("Bloodshot Gaze", "충혈된 거대 눈동자", "充血した大目玉"),
  森: STG_L("Devouring Thicket", "숨 쉬는 검은 숲", "息づく黒森"),
  車: STG_L("Runaway War-Cart", "폭주하는 불수레", "暴走する火車"),
  王: STG_L("Ruined Monarch", "폐허의 군왕", "廃墟の王"),
  天: STG_L("Wrathful Firmament", "천벌의 하늘", "天罰の蒼穹"),
  月: STG_L("Blood-Soaked Moon", "검붉게 물든 달", "血染めの凶月"),

  // Depth 2 (9級)
  馬: STG_L("Frenzied Black Steed", "거품 무는 흑마", "泡吹く黒馬"),
  牛: STG_L("Blood-Horned Bull", "피 묻은 뿔 황소", "血角の巨牛"),
  鳥: STG_L("Ash-Feathered Raptor", "잿빛 깃털 괴조", "灰羽の怪鳥"),
  魚: STG_L("Abyssal Maw-Fish", "검은 물속 괴어", "黒水の怪魚"),
  頭: STG_L("Floating Severed Head", "떠도는 거대 수급", "彷徨う大首"),
  雪: STG_L("Flesh-Cutting Frost", "살을 에는 설녀", "肌裂く雪影"),
  雲: STG_L("Suffocating Black Cloud", "숨통 조이는 먹구름", "息塞ぐ黒雲"),
  岩: STG_L("Crag Colossus", "절벽 바위 거인", "断崖の岩巨人"),
  黒: STG_L("Blade of Pitch Shadow", "빛 삼키는 검은 그림자", "光呑む黒影"),
  電: STG_L("Roaring Violet Thunder", "자줏빛 뇌전", "轟く紫電"),
  夜: STG_L("Sovereign Endless Night", "끝없는 칠흑의 밤", "果てなき常夜"),
  星: STG_L("Fallen Omen-Star", "추락한 흉성", "堕ちた凶星"),

  // Depth 3 (8級)
  羊: STG_L("Spiral-Horned Ram", "뒤틀린 뿔 숫양", "歪み角の牡羊"),
  客: STG_L("Blood-Robed Guest", "피 묻은 불청객", "血濡れの招かれざる客"),
  医: STG_L("Beak-Masked Physician", "부리 가면 역병의", "嘴仮面の疫病医"),
  者: STG_L("Shrouded Stalker", "얼굴 가린 괴한", "顔隠す何者か"),
  氷: STG_L("Spear-Frost Fiend", "서슬 퍼런 빙결체", "鋭き氷柱の怪"),
  病: STG_L("Festering Plague-Mist", "검붉은 역병 안개", "どす黒い病魔"),
  暗: STG_L("Swallowing Gloom", "집어삼키는 암흑", "呑み込む暗黒"),
  血: STG_L("Backflowing Gore", "역류하는 선혈", "逆流する鮮血"),
  悪: STG_L("Incarnate Malice", "형상화된 악의", "形を成す悪意"),
  死: STG_L("Pale Death Itself", "얼어붙은 죽음", "凍てつく死神"),
  神: STG_L("Forsaken Local Deity", "일그러진 토착신", "歪んだ土着神"),
  主: STG_L("Chained Old Master", "사슬 끄는 옛 주인", "鎖引く旧き主"),

  // Depth 4 (7級)
  熊: STG_L("Arrow-Bristling Bear", "화살 박힌 성난 곰", "矢負いの巨熊"),
  鹿: STG_L("Blood-Antlered Stag", "핏빛 뿔 수사슴", "血角の大鹿"),
  兵: STG_L("Undying Fallen Soldier", "전장을 떠도는 패잔병", "彷徨う敗残兵"),
  徒: STG_L("Bloodthirsty Marauders", "피에 굶주린 약탈자", "血に飢えた徒党"),
  卒: STG_L("Hollow Armor Footman", "녹슨 갑주 보졸", "錆鎧の兵卒"),
  隊: STG_L("Phantom Marching Squad", "망자의 행군 부대", "亡者の行軍隊"),
  機: STG_L("Rusted Killing Engine", "녹슨 살상 기관", "錆びた殺戮機"),
  官: STG_L("Ruthless Magistrate", "처형령 내리는 집행관", "冷酷なる執行官"),
  臣: STG_L("Blood-Weeping Retainer", "피눈물 흘리는 무신", "血涙の武臣"),
  軍: STG_L("Legion of the Slain", "수천 전사자의 군세", "戦死者の大軍"),
  司: STG_L("Arbiter of Life and Death", "생사를 재단하는 판관", "生死を裁く司"),
  勇: STG_L("Shattered-Armor Champion", "투기에 미친 맹장", "闘気狂う猛将"),

  // Depth 5 (6級)
  士: STG_L("Blood-Crazed Warrior", "살육에 미친 타락 무사", "殺戮の堕武士"),
  犯: STG_L("Shackle-Dragging Convict", "족쇄 끌고 웃는 탈옥수", "足枷引く脱獄犯"),
  像: STG_L("Blood-Weeping Statue", "피눈물 흘리는 석상", "血涙の石像"),
  象: STG_L("Chained War-Elephant", "쇠사슬 두른 갑주 거상", "鉄鎖の装甲巨象"),
  毒: STG_L("Lung-Searing Venom Fiend", "폐부를 태우는 독괴", "肺を焼く毒怪"),
  迷: STG_L("Phantom of Lost Fog", "길 잃게 하는 미망", "迷い霧の幻影"),
  武: STG_L("Avatar of Martial Wrath", "베고 부수는 무력의 화신", "武力の権化"),
  罪: STG_L("Tangled Karma Fiend", "엉겨 붙은 죄업의 흉물", "罪業の凶物"),
  災: STG_L("Living Calamity", "살아 움직이는 재앙", "生ける災厄"),
  師: STG_L("Blood-Talisman Heretic", "금기 주술의 이단 도사", "血札の異端師"),
  仏: STG_L("Twisted Dark Buddha", "파멸을 품은 마불", "破滅宿す魔仏"),

  // Depth 6 (5級)
  骨: STG_L("Clattering Bone-Swordsman", "스스로 맞춰진 백골", "組み上がる白骨"),
  亡: STG_L("Warmth-Craving Revenant", "산 자를 탐하는 망자", "温もり求める亡者"),
  蚕: STG_L("Flesh-Fed Giant Silkworm", "살점 먹고 자란 거대 누에", "人肉喰らいの巨蚕"),
  衆: STG_L("Writhing Mob of Limbs", "뒤엉킨 아귀의 군중", "絡み合う亡者衆"),
  従: STG_L("Soul-Bound Puppet Thrall", "영혼 묶인 꼭두각시 시종", "魂縛りの従者"),
  警: STG_L("Bell-Ringing Bone Sentry", "경종 울리는 백골 파수병", "警鐘の白骨衛"),
  敵: STG_L("Battle-Scarred Nemesis", "사선을 넘어온 숙적", "死線越えの宿敵"),
  異: STG_L("Twisted Bone Aberration", "형태 무너진 이형 괴물", "異形の怪物"),
  皇: STG_L("Emperor of the Skull Throne", "해골 옥좌의 백골 황제", "骸玉座の白骨皇"),
  将: STG_L("Undefeated Bone General", "천군만마의 백골 대장군", "白骨の大将軍"),
  聖: STG_L("Tarnished-Halo Fallen Saint", "빛바랜 후광의 타락 성자", "堕ちた聖者"),

  // Depth 7 (4級 — 2-char & 1-char)
  狂獣: STG_L("Matted-Fur Ravenous Beast", "피 엉킨 굶주린 광수", "血塗れの狂獣"),
  悪僧: STG_L("Skull-Rosary Renegade Monk", "해골 염주의 파계 악승", "髑髏数珠の悪僧"),
  影盗: STG_L("Shadow-Step Cutthroat", "등 뒤를 노리는 그림자 도적", "背後の影盗賊"),
  人狩: STG_L("Man-Hunting Tracker", "사람을 사냥하는 추격자", "人狩りの追跡者"),
  黒影: STG_L("Betraying Black Shadow", "주인을 배신한 검은 그림자", "裏切りの黒影"),
  凶鳥: STG_L("Omen-Shriek Raptor", "피가 식는 비명의 흉조", "凶兆の怪鳥"),
  巨兵: STG_L("Ceiling-Scraping Titan Soldier", "천장을 찌르는 거대 갑주병", "天井突く巨兵"),
  狂鬼: STG_L("Flesh-Tearing Berserk Oni", "이성 잃고 폭주하는 광귀", "暴走する狂鬼"),
  百鬼: STG_L("Night-Parade Hundred Oni", "밤을 삼키는 백귀야행의 우두머리", "百鬼夜行の頭領"),
  雷神: STG_L("Storm-Cloaked Thunder God", "먹구름 두른 뇌신", "黒雲纏う雷神"),
  鬼雄: STG_L("Warlord Oni of the Valley", "골짜기를 지배하는 귀웅", "谷統べる鬼雄"),
  獣: STG_L("Matted-Fur Ravenous Beast", "피 엉킨 굶주린 마수", "飢えた魔獣"),
  僧: STG_L("Skull-Rosary Renegade Monk", "해골 염주의 파계승", "髑髏数珠の破戒僧"),
  盗: STG_L("Shadow-Step Cutthroat", "등 뒤를 노리는 그림자 도적", "背後の影盗賊"),
  狩: STG_L("Man-Hunting Tracker", "사람 사냥하는 추적자", "人狩りの追跡者"),
  影: STG_L("Betraying Black Shadow", "주인을 배신한 검은 그림자", "裏切りの黒影"),
  凶: STG_L("Condensed Omen-Fiend", "응축된 흉조의 괴물", "凶兆の怪物"),
  巨: STG_L("Ceiling-Scraping Titan", "천장을 찌르는 거인", "天井突く巨人"),
  狂: STG_L("Flesh-Tearing Berserker", "이성 잃고 폭주하는 광인", "暴走する狂人"),
  鬼: STG_L("Voice-Mimicking Man-Eater Oni", "목소리 흉내 내는 식인 악귀", "声真似の食人鬼"),
  雷: STG_L("Storm-Cloaked Thunder Beast", "먹구름 두른 뇌신수", "黒雲纏う雷獣"),
  雄: STG_L("Warlord Spirit of the Valley", "골짜기를 지배하는 영웅신", "谷統べる英雄神"),

  // Depth 8 (3級 — 2-char & 1-char)
  悪霊: STG_L("Wailing Vengeful Spirit", "통곡하는 창백한 악령", "慟哭の悪霊"),
  怪異: STG_L("Shifting-Eye Grotesque Yokai", "눈알과 아가리의 기괴 요괴", "異形の怪異"),
  山賊: STG_L("Blood-Axe Mountain Brigand", "피비린내 나는 도끼 산적", "血斧の山賊"),
  木偶: STG_L("Severed-String Cursed Puppet", "줄 끊어진 저주 목각인형", "糸切れの呪木偶"),
  血猟: STG_L("Blood-Scent Feral Huntsman", "피 냄새 쫓는 광기의 엽사", "血追いの猟師"),
  蛮族: STG_L("Bone-Crowned Savage Warrior", "뼈 투구 쓴 야만전사", "骨兜の蛮族"),
  亡鯨: STG_L("Black-Fog Phantom Whale", "검은 안개 바다의 망령 고래", "黒霧の亡鯨"),
  亡侍: STG_L("Blood-Starved Undead Samurai", "요도를 뽑아 든 망령 무사", "妖刀の亡侍"),
  幽鬼: STG_L("Soul-Reaping Nether Ghost", "영혼을 베는 흐릿한 유귀", "魂刈る幽鬼"),
  邪霊: STG_L("Black-Flame Curse Spirit", "검은 불꽃 흩뿌리는 사령", "黒炎の邪霊"),
  魔王: STG_L("Hellfire Archfiend King", "지옥불 기둥의 마왕", "業火の魔王"),
  魔帝: STG_L("Grudge-Devouring Demon Emperor", "원한을 집어삼킨 마제", "怨念呑む魔帝"),
  黒騎: STG_L("Space-Piercing Black Knight", "해골 군마의 지옥 흑기사", "骸馬の黒騎士"),
  霊: STG_L("Wailing Pale Spirit", "통곡하는 창백한 원령", "慟哭の怨霊"),
  怪: STG_L("Shifting-Eye Grotesque Yokai", "눈알과 아가리의 기괴 요괴", "異形の物の怪"),
  賊: STG_L("Blood-Axe Mountain Brigand", "피비린내 나는 산적", "血斧の山賊"),
  偶: STG_L("Severed-String Cursed Puppet", "줄 끊어진 저주 목각인형", "糸切れの呪木偶"),
  猟: STG_L("Blood-Scent Feral Huntsman", "피 냄새 쫓는 광기 엽사", "血追いの猟師"),
  蛮: STG_L("Bone-Crowned Savage Warrior", "뼈 투구 쓴 야만전사", "骨兜の蛮族戦士"),
  鯨: STG_L("Black-Fog Phantom Whale", "검은 안개 바다의 망령 고래", "黒霧の大鯨"),
  侍: STG_L("Blood-Starved Undead Samurai", "요도를 뽑아 든 망령 무사", "妖刀の亡霊侍"),
  幽: STG_L("Soul-Reaping Nether Phantom", "영혼을 베는 흐릿한 유령", "魂刈る幽鬼"),
  邪: STG_L("Black-Flame Curse Fiend", "검은 불꽃 흩뿌리는 사념체", "黒炎の邪念体"),
  魔: STG_L("Hellfire Archfiend", "지옥불 기둥의 대마", "業火の大魔"),
  帝: STG_L("Grudge-Devouring Demon Emperor", "원한을 집어삼킨 마제", "怨念呑む魔帝"),
  騎: STG_L("Space-Piercing Black Knight", "해골 군마의 지옥 흑기사", "骸馬の黒騎士"),

  // Depth 9 (準2級 — 2-char & 1-char)
  怪猫: STG_L("Fork-Tailed Giant Bakeneko", "두 갈래 꼬리 고양이 요괴", "二股尾の怪猫"),
  毒蛇: STG_L("Crimson-Tongued Great Viper", "핏빛 혀 날름대는 거대 독사", "紅舌の大毒蛇"),
  血猿: STG_L("Long-Armed Blood Ape", "기괴하게 팔 긴 피원숭이", "長腕の血猿"),
  疫蚊: STG_L("Blood-Swollen Plague Mosquito", "피 빨아 부푼 역병 모기", "血膨れの疫蚊"),
  影忍: STG_L("Smoke-Veiled Shadow Shinobi", "연막 속 어둠의 그림자 자객", "煙幕の影忍"),
  凶偵: STG_L("All-Seeing Doom Scout", "살수의 포위망 펼치는 척후병", "必殺の凶偵"),
  獄曹: STG_L("Torture-Iron Hell Sergeant", "고문 도구 매단 지옥 옥졸장", "拷問具の獄曹"),
  怪仙: STG_L("Immortality-Warped Fallen Hermit", "괴물이 된 타락 괴선인", "怪物化した怪仙"),
  血傑: STG_L("Army-Slaughtering Blood Warlord", "전장을 도륙한 피의 호걸", "血塗れの怪傑"),
  火竜: STG_L("Magma-Breathing Ancient Wyrm", "용암 숨결 뿜는 고대 화룡", "溶岩吐く火竜"),
  覇王: STG_L("Room-Crushing Tyrant Overlord", "절대 패기의 폭군 패왕", "絶対覇気の覇王"),
  元帥: STG_L("Phantom-Artillery Grand Marshal", "망자 군세를 통솔하는 대원수", "亡者統べる元帥"),
  猫: STG_L("Fork-Tailed Giant Bakeneko", "두 갈래 꼬리 고양이 요괴", "二股尾の化け猫"),
  蛇: STG_L("Crimson-Tongued Great Serpent", "핏빛 혀 날름대는 대사", "紅舌の大蛇"),
  猿: STG_L("Long-Armed Blood Ape", "기괴하게 팔 긴 괴원숭이", "長腕の怪猿"),
  蚊: STG_L("Blood-Swollen Plague Mosquito", "피 빨아 부푼 흡혈 독충", "血膨れの疫病蚊"),
  忍: STG_L("Smoke-Veiled Shadow Assassin", "연막 속 어둠의 자객", "煙幕の闇忍"),
  偵: STG_L("All-Seeing Doom Scout", "포위망 펼치는 살수 척후병", "必殺の斥候"),
  曹: STG_L("Torture-Iron Hell Sergeant", "고문 도구 매단 지옥 옥졸장", "拷問具の獄卒長"),
  仙: STG_L("Immortality-Warped Fallen Hermit", "괴물이 된 타락 선인", "怪物と化した堕仙"),
  傑: STG_L("Army-Slaughtering Blood Warlord", "전장을 도륙한 피의 호걸", "血塗れの怪傑"),
  竜: STG_L("Magma-Breathing Ancient Wyrm", "용암 숨결 뿜는 고대 화룡", "溶岩吐く古竜"),
  覇: STG_L("Room-Crushing Tyrant Lord", "절대 패기의 폭군 패왕", "絶対覇気の覇王"),
  帥: STG_L("Phantom-Artillery Grand Marshal", "망자 군세를 통솔하는 대원수", "亡者統べる大元帥"),

  // Depth 10 (2級 — 2-char & 1-char)
  猛虎: STG_L("Man-Eating Great Tiger", "피 묻은 송곳니 식인 맹호", "人喰い猛虎"),
  怪亀: STG_L("Basalt-Shell Monster Tortoise", "강철 등껍질 현무 괴거북", "鋼甲羅の怪亀"),
  毒蜂: STG_L("Venom-Dripping Queen Hornet", "맹독 침 흘리는 여왕 독벌", "猛毒針の毒蜂"),
  凶鶴: STG_L("Razor-Plumed Phantom Crane", "면도날 깃털의 살수 괴학", "剃刀羽の凶鶴"),
  暴駒: STG_L("Cursed-Barding Runaway Colt", "저주 갑주 두른 폭주 망아지", "呪馬鎧の暴駒"),
  妖魔: STG_L("Illusion-Weaving Wicked Fiend", "환각과 요술을 피우는 요마", "幻惑の妖魔"),
  大顎: STG_L("Clattering Giant Jawbone", "어둠 속 거대 턱뼈 괴물", "暗闇の大顎"),
  骸骨: STG_L("Scythe-Swinging Bone Colossus", "사신의 낫 든 거대 해골괴", "大鎌の巨大骸骨"),
  怨鬼: STG_L("Thousand-Year Spite Demon", "천년 원념의 검은 원귀", "千年怨念の怨鬼"),
  冥王: STG_L("Scythe-Bearing Underworld King", "생사 경계의 명부 군주 명왕", "冥府の主・冥王"),
  常闇: STG_L("Light-Devouring Eternal Dark", "빛을 삼키는 태초의 상암", "光呑む常闇"),
  鬱鬼: STG_L("Heart-Crushing Despair Demon", "심장을 짓누르는 절망의 울귀", "絶望の鬱鬼"),
  虎: STG_L("Man-Eating Great Tiger", "피 묻은 송곳니 식인 대호", "人喰い大虎"),
  亀: STG_L("Basalt-Shell Monster Tortoise", "강철 등껍질 현무 괴거북", "鋼甲羅の怪亀"),
  蜂: STG_L("Venom-Dripping Queen Hornet", "맹독 침 흘리는 여왕벌 괴충", "猛毒針の女王蜂"),
  鶴: STG_L("Razor-Plumed Phantom Crane", "면도날 깃털의 괴조 학", "剃刀羽の怪鶴"),
  駒: STG_L("Cursed-Barding Runaway Colt", "저주 갑주 두른 폭주 망아지", "呪馬鎧の暴れ駒"),
  妖: STG_L("Illusion-Weaving Wicked Apparition", "환각을 피우는 요마", "幻惑の妖魔"),
  顎: STG_L("Clattering Giant Jawbone", "어둠 속 거대 턱뼈 괴물", "暗闇の巨大顎"),
  骸: STG_L("Scythe-Swinging Bone Colossus", "사신의 낫 든 거대 해골괴", "大鎌の巨大骸骨"),
  怨: STG_L("Thousand-Year Spite Hands", "천년 원념의 검은 손길", "千年怨念の黒手"),
  冥: STG_L("Scythe-Bearing Underworld Lord", "생사 경계의 명부 군주", "冥府の主"),
  闇: STG_L("Light-Devouring Primordial Dark", "빛을 삼키는 태초의 암흑", "原初の闇"),
  鬱: STG_L("Heart-Crushing Despair Mire", "심장을 짓누르는 절망의 늪", "絶望の澱み"),

  // Depth 11 (準1級 — 3-char & 1-char)
  血餓狼: STG_L("Blood-Starved Silver Dire Wolf", "선혈에 굶주린 은빛 아랑", "血に飢えた餓狼"),
  九尾狐: STG_L("Nine-Tailed Foxfire Kitsune", "아홉 꼬리 여우불 구미호", "九尾狐火の妖狐"),
  黒影豹: STG_L("Presence-Erasing Shadow Panther", "기척 지운 암살 흑영표", "気配消す黒影豹"),
  大牙猪: STG_L("Boulder-Shattering Great Tusk Boar", "바위 부수는 거대 어금니 산돼지", "岩砕く大牙猪"),
  血沼鰐: STG_L("Blood-Mire Prehistoric Crocodile", "핏빛 늪의 식인 거대 악어", "血沼の大鰐"),
  深海鮫: STG_L("Air-Cleaving Abyssal Shark", "허공을 가르는 심해 식인상어", "空間裂く深海鮫"),
  鋼爪鷲: STG_L("Steel-Talon Storm Eagle", "폭풍 일으키는 강철 발톱 괴수리", "鋼爪の大鷲"),
  焔獅子: STG_L("Hellfire-Maned Lion Fiend", "지옥불 갈기의 화염 사자", "焔鬣の獅子"),
  人喰屍: STG_L("Flesh-Devouring Cursed Corpse", "산 자의 살점을 탐하는 식인 주검", "生肉漁る人喰屍"),
  屠殺兇: STG_L("Blood-Axe Brutal Executioner", "도끼와 창 든 도살의 흉한", "血斧の屠殺兇"),
  古神龍: STG_L("Cloud-Commanding Ancient True Dragon", "구름과 벼락 거느린 태고의 신룡", "雲雷従える古神龍"),
  紅焔鳳: STG_L("World-Burning Crimson Phoenix", "홍련의 불꽃 두른 불사조 봉황", "紅蓮焔の鳳凰"),
  天帝鷹: STG_L("Heart-Locking Sky Sovereign Hawk", "심장을 꿰뚫는 천공의 제왕매", "天空の天帝鷹"),
  狼: STG_L("Blood-Matted Silver Dire Wolf", "은빛 털 적신 굶주린 마랑", "血濡れ銀毛の魔狼"),
  狐: STG_L("Nine-Tailed Foxfire Kitsune", "아홉 꼬리 여우불 요호", "九尾狐火の妖狐"),
  豹: STG_L("Presence-Erasing Black Panther", "기척 지운 암살 흑표범", "気配消す黒豹"),
  猪: STG_L("Boulder-Shattering Tusk Boar", "바위 부수는 거대 산돼지", "岩砕く大猪"),
  鰐: STG_L("Blood-Mire Prehistoric Crocodile", "핏빛 늪의 거대 악어", "血沼の大鰐"),
  鮫: STG_L("Air-Cleaving Abyssal Shark", "허공을 가르는 심해 식인상어", "空間裂く深海鮫"),
  鷲: STG_L("Steel-Talon Storm Eagle", "폭풍 일으키는 강철 발톱 괴수리", "鋼爪の大鷲"),
  獅: STG_L("Hellfire-Maned Lion Fiend", "불타는 갈기의 화염 사자", "焔鬣の獅子"),
  屍: STG_L("Flesh-Hungry Cursed Corpse", "살점 탐하는 저주받은 주검", "肉漁る腐乱屍"),
  兇: STG_L("Blood-Axe Brutal Executioner", "도끼와 창 든 흉폭한 도살자", "血斧の兇漢"),
  龍: STG_L("Cloud-Commanding True Dragon", "구름과 벼락 거느린 신룡", "雲雷従える真龍"),
  鳳: STG_L("World-Burning Crimson Phoenix", "홍련의 불꽃 두른 봉황", "紅蓮焔の鳳凰"),
  鷹: STG_L("Heart-Locking Sky Sovereign Hawk", "심장을 꿰뚫는 천공의 제왕매", "天空の帝王鷹"),

  // Depth 12 (1級 — 4-char & 1/2-char)
  魑魅魍魎: STG_L("Myriad Mountain & River Fiends", "산천과 심연의 온갖 도깨비 치미망량", "山川の百鬼・魑魅魍魎"),
  百足蠱蟲: STG_L("Cannibal-Jar Centipede Horror", "고독 항아리에서 살아남은 백족 고충", "蠱毒の百足蠱蟲"),
  血咒巫女: STG_L("Blood-Hex Abyssal Shamaness", "피의 주문을 읊는 나락의 혈주 무녀", "血呪文の奈落巫女"),
  旱魃凶鬼: STG_L("Blood-Parching Drought Fiend", "피와 수분을 말려 죽이는 한발 흉귀", "灼熱の旱魃凶鬼"),
  深淵毒蛟: STG_L("Venom-Maelstrom Abyssal Dragon", "독안개 소용돌이의 심연 독교룡", "毒渦の深淵毒蛟"),
  漆黒毒蝮: STG_L("Instant-Death Pitch Pit Viper", "한 방울로 숨통 끊는 칠흑 독살무사", "漆黒の猛毒蝮"),
  呪糸傀儡: STG_L("Fate-Stringed Blade Marionette", "보이지 않는 저주 실의 살육 괴뢰", "呪糸の殺戮傀儡"),
  白骨髑髏: STG_L("Ghost-Fire Towering Skull Colossus", "푸른 귀화 뿜는 거대 백골 독루", "青鬼火の白骨髑髏"),
  魔神饕餮: STG_L("All-Devouring Abyss Fiend God", "만물과 한자마저 집어삼키는 마신 도철", "万象喰らう魔神饕餮"),
  巫: STG_L("Soul-Rotting Abyssal Shaman", "피의 주문을 읊는 나락 무녀", "血呪文の奈落巫女"),
  蟲: STG_L("Countless-Legged Centipede Horror", "나락의 백족 고충", "奈落の百足蟲"),
  蠱: STG_L("Last-Surviving Jar Venom Fiend", "서로 잡아먹고 남은 고독의 화신", "蠱毒の権化"),
  魑: STG_L("Blue-Eyed Mountain Demon", "시퍼런 안광의 산도깨비 치", "青眼の山の怪・魑"),
  魍: STG_L("Ankle-Clutching Water Fiend", "심연으로 끌고 가는 물귀신 망량", "深淵へ引く水の怪・魍"),
  魃: STG_L("Blood-Parching Drought Demon", "피와 수분을 말리는 가뭄 귀신 발", "灼熱の旱魃鬼"),
  蛟: STG_L("Venom-Whirlpool Flood Dragon", "독안개 소용돌이의 심연 교룡", "毒渦の深淵蛟"),
  蝮: STG_L("Instant-Death Black Pit Viper", "소리 없이 똬리 튼 칠흑 살무사", "漆黒の猛毒蝮"),
  傀儡: STG_L("Fate-Stringed Blade Marionette", "보이지 않는 실의 저주 꼭두각시", "呪糸の傀儡"),
  髑髏: STG_L("Ghost-Fire Skull Tower", "푸른 귀화 뿜는 거대 해골 독루", "青鬼火の巨大髑髏"),
  饕餮: STG_L("Kanji-Devouring Abyss Glutton", "만물과 한자를 집어삼키는 마신 도철", "万象喰らう魔神・饕餮")
};

function getEnemyShortName(kanji) {
  let entry = FOE_NAMES[kanji];
  if (!entry && kanji && kanji.length > 1) {
    const chars = Array.from(String(kanji));
    for (let i = chars.length - 1; i >= 0; i--) {
      if (FOE_NAMES[chars[i]]) {
        entry = FOE_NAMES[chars[i]];
        break;
      }
    }
  }
  if (entry) return pickLang(entry);
  return pickLang(STG_L(`Aberrant Spirit`, `이형의 원령`, `異形の怨霊`));
}

/* Classify what kind of threat an intent kanji represents for rules.js & GM */
const LETHAL_INTENTS = new Set(["落", "滅", "殲", "爆", "砲", "呑", "噬", "抉", "蹂", "処", "刑", "死", "殺", "断", "絶", "潰", "砕", "冥", "屠"]);
const EVADE_DEFEND_INTENTS = new Set(["目", "見", "固", "守", "避", "潜", "防", "隠", "霧", "幻", "映", "反", "錮", "盾", "覗", "睨", "眺", "偵"]);
const CURSE_DEBUFF_INTENTS = new Set(["毒", "呪", "咒", "祟", "詛", "縛", "絞", "惑", "病", "疫", "菌", "迷", "怨", "糸", "封", "縄", "鎖"]);
const ESCAPE_INTENTS = new Set(["出", "走", "帰", "去", "速", "飛", "散", "往", "退", "裏", "逃", "避", "潜", "匿", "逸", "奔", "隙", "踪", "遁", "馳", "逍"]);
const COUNTDOWN_PREP_INTENTS = new Set(["三", "二", "兆", "号", "黒雲", "閃光", "鬼怒", "雄叫", "魔封", "審判", "疾駆", "黒渦", "覇威", "号令", "斉射", "死兆", "冥罰", "閉塞", "深淵覗", "紅閃光", "死角覗", "百鬼夜祟", "深淵凝睨", "呪糸緊縛", "血咒怨祟", "天地咆哮"]);

/* Concrete action meaning for individual intent kanji so the AI never interprets enemy intentions arbitrarily. */
const INTENT_KANJI_MEANINGS = {
  // Bite / Maw / Devour
  口: "입과 아가리를 크게 벌려 물어뜯기",
  歯: "날카로운 이빨로 강하게 물어뜯기",
  牙: "송곳니를 박아 넣고 찢어발기기",
  噛: "턱뼈가 부서져라 악물어 으깨기",
  喰: "산 채로 살점을 뜯어 삼키기",
  呑: "통째로 집어삼키는 포식 공격",
  噬: "뼈와 살을 남김없이 씹어 삼키기",
  吸: "피와 생기를 빨아들이는 흡혈·흡수",
  飲: "선혈과 기운을 들이켜기",

  // Rush / Trample / Movement / Escape
  足: "빠른 발걸음으로 쇄도해 짓밟기",
  走: "맹렬한 질주로 거리 좁혀 들이받기",
  疾: "질풍 같은 속도로 단숨에 파고들기",
  駆: "전속력으로 질주하며 몰아붙이기",
  跳: "높이 도약해 머리 위에서 덮치기",
  躍: "공중으로 솟구쳐 기습 낙하하기",
  蹴: "강력한 발차기로 걷어차 무너뜨리기",
  踏: "거대한 무게로 위에서 짓밟아 뭉개기",
  蹂: "무자비하게 짓밟아 초토화하기",
  躙: "육신을 발밑에 깔고 짓이겨 유린하기",
  追: "도망치지 못하게 끝까지 추격해 타격하기",

  // Claw / Hand / Blunt / Crush
  手: "손과 앞발을 뻗어 할퀴고 붙잡기",
  爪: "예리한 발톱으로 할퀴어 찢기",
  拳: "묵직한 주먹으로 정면 강타하기",
  力: "괴력을 실어 정면에서 힘껏 내려치기",
  強: "강인한 완력으로 거세게 몰아치기",
  剛: "금강석 같은 강맹한 힘으로 부수기",
  打: "둔중한 타격으로 후려치기",
  撃: "강력한 타격을 정면으로 내리꽂기",
  殴: "무차별적으로 두들겨 패기",
  撲: "전신을 실어 매섭게 후려치기",
  投: "바위나 흉기를 강하게 집어던지기",
  重: "육중한 무게로 짓눌러 압살하기",
  圧: "숨 막히는 중압감과 물리력으로 찍어 누르기",
  折: "뼈와 무기를 꺾어 부러뜨리기",
  壊: "방어 태세를 통째로 부숴버리기",
  破: "보호막과 방어선을 정면 돌파해 깨뜨리기",
  砕: "단숨에 가루가 되도록 박살 내기",
  粉: "뼈가 가루가 되도록 분쇄하기",
  潰: "형체가 남지 않게 짓이겨 으깨기",
  崩: "지반과 방어를 한꺼번에 무너뜨리기",
  落: "머리 위에서 낙하·추락시켜 치명타 입히기",

  // Blade / Pierce / Ranged
  刀: "시퍼런 칼날로 매섭게 베기",
  切: "예리하게 살갗과 급소를 베어내기",
  剣: "검을 휘둘러 정면에서 베어 넘기기",
  刃: "날 선 칼날로 치명상을 입히기",
  斬: "일격에 두 동강 내듯 참격 가하기",
  首: "목덜미와 수급을 노려 베어내기",
  断: "퇴로와 숨통을 단칼에 끊어내기",
  伐: "거침없이 베어 쓰러뜨리기",
  裂: "살갗과 방어를 갈가리 찢어발기기",
  傷: "깊은 자상과 출혈 상처 입히기",
  薙: "주변을 휩쓸듯 가로로 넓게 베어내기",
  屠: "도살하듯 무자비하게 난도질하기",
  刺: "예리한 끝으로 급소를 깊숙이 찌르기",
  突: "창과 뿔을 세워 일직선으로 꿰뚫기",
  貫: "방어를 뚫고 몸통을 관통하기",
  通: "방어막 너머까지 빈틈없이 꿰뚫기",
  穿: "단단한 갑주와 살갗을 꿰뚫어 구멍 내기",
  抉: "상처와 오장육부를 깊숙이 도려내기",
  角: "단단한 뿔을 세워 들이받기",
  針: "독침이나 바늘로 급소를 찌르기",
  弓: "활시위를 당겨 조준 사격하기",
  矢: "날카로운 화살을 연속으로 쏘아 보내기",
  射: "정확히 조준해 관통 사격 가하기",
  銃: "총포를 겨누어 탄환 발사하기",
  砲: "대포 같은 파괴력의 포격 퍼붓기",
  弾: "빠른 탄환을 쏘아 타격하기",
  矛: "날카로운 창끝으로 찌르기",
  槍: "긴 창을 휘둘러 찌르고 후려치기",
  斧: "무거운 도끼로 내려찍기",
  杖: "무거운 석장으로 내려찍기",
  鎌: "사신의 낫으로 목과 영혼을 베어내기",
  械: "기계 장치와 톱니 함정 작동시키기",

  // Elements / Nature
  火: "타오르는 불길로 태우기",
  炎: "맹렬한 화염을 뿜어 불사르기",
  焔: "꺼지지 않는 지옥 불꽃으로 집어삼키기",
  業: "업화의 불길로 죄업을 태우기",
  劫: "영겁의 화염과 재앙으로 불사르기",
  焼: "고열로 살갗과 주변을 태워버리기",
  燃: "불씨를 옮겨붙여 거세게 연소시키기",
  焚: "모든 것을 잿더미로 태워버리기",
  尽: "남김없이 끝까지 태워 소진시키기",
  熱: "숨 막히는 열기로 기력을 앗아가기",
  旱: "모든 수분과 피를 바짝 말려버리기",
  魃: "가뭄의 열기로 생명력을 말려 죽이기",
  水: "거센 물줄기와 냉기로 몰아치기",
  海: "바다 같은 수압으로 덮쳐 익사시키기",
  池: "검은 연못의 수렁으로 끌어들이기",
  沼: "피와 진흙의 늪으로 발목을 잡아 끌어당기기",
  波: "거친 파도로 휩쓸어 넘어뜨리기",
  流: "급류에 휘말리게 해 중심 무너뜨리기",
  濁: "혼탁한 격류로 시야와 호흡을 막기",
  渦: "거대한 소용돌이로 빨아들여 찢기",
  濡: "축축한 수기와 피로 적셔 둔화시키기",
  溺: "검은 물과 절망 속에 빠뜨려 숨통 조이기",
  氷: "날카로운 얼음 결정으로 얼리고 찌르기",
  寒: "뼈가 시린 한기로 몸을 굳게 만들기",
  凍: "움직임을 얼려버리는 빙결 공격",
  雪: "시야를 가리는 눈보라와 냉기 몰아치기",
  冬: "혹한의 기운으로 생기를 얼리기",
  風: "칼날 같은 돌풍으로 베고 밀쳐내기",
  烈: "맹렬한 기세의 폭풍으로 몰아붙이기",
  嵐: "사방을 휩쓰는 폭풍우 일으키기",
  雲: "먹구름과 안개로 시야를 가리고 압박하기",
  雨: "차갑고 불길한 비를 퍼부어 압박하기",
  雷: "하늘에서 벼락을 내리꽂아 감전시키기",
  電: "빠른 뇌전 충격으로 마비시키고 타격하기",
  震: "대지와 공기를 진동시켜 중심 무너뜨리기",
  光: "눈부신 섬광으로 시야를 앗고 꿰뚫기",
  閃: "눈 깜짝할 사이의 섬광 일격 가하기",
  石: "단단한 돌덩이로 부딪쳐 타격하기",
  岩: "거대한 바위로 찍어 누르기",
  盤: "단단한 암반째로 뒤흔들어 부수기",
  山: "산처럼 거대한 덩치로 압도하기",
  土: "흙먼지와 지면 진동으로 발밑 흔들기",
  木: "억센 나뭇가지로 휘감고 후려치기",
  林: "수풀의 가지를 사방에서 뻗어 조이기",
  草: "풀줄기로 발목을 휘감아 넘어뜨리기",
  金: "차가운 금속성 타격 가하기",
  鉄: "강철 같은 경도로 정면 충돌하기",
  鋼: "강철 무기로 빈틈없이 몰아치기",
  煙: "자욱한 연기로 시야와 호흡 차단하기",
  幕: "장막을 펼쳐 시야를 차단하고 기습하기",
  爆: "맹렬한 폭발을 일으켜 산산조각 내기",
  轟: "귀를 찢는 굉음과 충격파 터뜨리기",

  // Gaze / Guard / Stealth
  目: "충혈된 눈으로 일거수일투족을 주시하며 빈틈 노리기",
  見: "움직임을 꿰뚫어 보며 반격 각 재기",
  眼: "살기 어린 안광으로 위압하며 약점 포착하기",
  視: "차갑게 응시하며 행동을 간파하기",
  看: "방어 태세를 갖추고 침입자의 움직임 감시하기",
  察: "주변 기척을 살피며 기습과 반격 준비하기",
  望: "멀리서 노려보며 공격 궤적 계산하기",
  伺: "어둠 속에서 틈을 엿보며 암습 노리기",
  凝: "시선과 살기를 한 점에 응축해 노려보기",
  眺: "높은 곳에서 내려다보며 빈틈 포착하기",
  狙: "급소를 정밀하게 조준해 일격 노리기",
  覗: "심연과 사각에서 엿보며 허점 찌르기",
  睨: "몸이 굳을 만큼 흉포한 안광으로 노려보기",
  偵: "전력을 탐색하며 포위 공격 유도하기",
  守: "단단히 방어 자세를 굳히고 반격 준비하기",
  固: "몸과 갑주를 단단히 굳혀 피해 흘려내기",
  防: "전면을 막아선 채 카운터 노리기",
  護: "수호 장막을 펼쳐 공격을 막아내기",
  盾: "방패를 세워 정면 공격을 막고 밀쳐내기",
  錮: "철벽처럼 껍질과 방어를 잠그고 버티기",
  殻: "단단한 껍데기 속에 숨어 충격 흡수하기",
  潜: "어둠이나 수면 아래로 몸을 숨겨 기습 노리기",
  伏: "낮게 매복해 있다가 급소를 노려 튀어나오기",
  隠: "자취를 감추고 사각에서 공격 준비하기",
  幻: "환영을 피워올려 감각과 조준 흐트러뜨리기",
  惑: "정신을 홀려 공격 방향을 어지럽히기",
  妖: "요사스러운 술법으로 감각을 현혹하기",
  術: "주술과 기이한 도술을 펼쳐 압박하기",

  // Bind / Curse / Poison / Mental
  糸: "질긴 실을 뿜어 손발을 휘감아 묶기",
  縄: "오랏줄을 던져 몸을 포박하기",
  束: "움직이지 못하게 강제로 속박하기",
  縛: "사슬과 주박으로 전신을 꽁꽁 묶어 봉쇄하기",
  緊: "숨조차 쉴 수 없게 팽팽히 조여 묶기",
  絞: "목과 숨통을 강하게 조여 질식시키기",
  鎖: "무거운 쇠사슬로 휘감아 후려치고 구속하기",
  囲: "사방에서 포위해 도주로와 회피 공간 차단하기",
  包: "전후좌우를 에워싸 퇴로를 차단하기",
  封: "부적과 주술로 행동과 힘을 봉인하기",
  塞: "숨통과 퇴로를 틀어막아 고립시키기",
  閉: "공간을 닫아걸어 가두어 압박하기",
  毒: "치명적인 맹독을 퍼뜨려 중독시키기",
  猛: "맹렬한 독성과 흉포한 기세로 덮치기",
  蝕: "살과 영혼을 서서히 좀먹어 들어가기",
  酸: "살과 무기를 녹이는 강산성 액체 뿌리기",
  病: "병마와 독기를 불어넣어 기력 갉아먹기",
  疫: "역병 균을 퍼뜨려 전신을 쇠약하게 하기",
  菌: "부패한 포자와 균을 퍼뜨려 감염시키기",
  腐: "살점을 썩게 만드는 부패 기운 퍼뜨리기",
  蠱: "고독의 독충과 저주로 내부부터 갉아먹기",
  呪: "사악한 저주를 걸어 생명력을 깎아내리기",
  咒: "피의 주문을 외워 영혼을 짓누르기",
  祟: "재앙과 살을 내려 몸과 마음을 갉아먹기",
  詛: "죽음에 이르는 저주로 숨통을 조이기",
  怨: "깊은 원한과 원념으로 정신과 육체 할퀴기",
  恨: "사무친 한으로 집요하게 물고 늘어지기",
  脅: "살기 어린 협박으로 판단력을 흔들기",
  迫: "숨 막히게 거리를 좁혀 압박하기",
  侮: "조롱과 모욕으로 평정심을 무너뜨리기",
  辱: "굴욕적인 기습으로 빈틈을 후벼파기",
  拷: "고문 도구로 살점을 찢으며 고통 주기",
  問: "죄를 추궁하듯 몰아붙여 압박하기",
  悪: "순수한 악의로 정신을 뒤흔들고 타격하기",
  邪: "사악한 요기로 방어를 무너뜨리기",
  凶: "불길한 흉조로 치명적인 급소 노리기",
  狂: "이성을 잃은 광기로 무차별 난타하기",
  暴: "폭주하며 사방을 거칠게 휘젓기",
  乱: "어지러운 난격으로 방어 틈 무너뜨리기",
  迷: "방향 감각을 잃게 하는 안개로 교란하기",
  夢: "악몽과 환각 속에 가두어 빈틈 만들기",

  // Sound / Command / Execution / Death
  音: "불길한 공명음으로 고막과 신경 흔들기",
  声: "기괴한 괴성으로 얼어붙게 만들기",
  鳴: "날카로운 울음소리로 기세를 꺾고 급습하기",
  叫: "귀를 찢는 비명과 포효로 정신을 뒤흔들기",
  吠: "맹수의 포효로 위압하며 덮치기",
  咆: "천지를 뒤흔드는 포효와 함께 돌진하기",
  哮: "사나운 포효로 공기를 찢으며 위압하기",
  嚇: "살기 어린 위협으로 움직임을 움츠러들게 하기",
  喝: "벼락같은 일갈로 기선을 제압하기",
  命: "거역할 수 없는 어명으로 압박하기",
  令: "차갑게 처형 명령을 내리며 공격 개시하기",
  号: "돌격 신호를 울리며 일제 공격 준비하기",
  連: "연속 공격 진형을 갖추어 몰아치기",
  群: "무리를 지어 사방에서 동시에 덮치기",
  斉: "일제 사격과 합동 타격 준비하기",
  揮: "무기를 지휘하며 맹공 퍼붓기",
  操: "꼭두각시 실로 무기와 시체를 조종해 공격하기",
  討: "인정사정없이 토벌 타격 가하기",
  戦: "전장의 살기를 끌어올려 정면 승부 걸기",
  武: "무예의 기세로 빈틈없이 베고 찌르기",
  急: "대응할 틈도 없이 급작스럽게 덮치기",
  奇: "예상치 못한 기책과 사각에서 기습하기",
  襲: "예상치 못한 타이밍에 맹렬히 습격하기",
  奪: "가진 힘과 기운을 강제로 빼앗으며 타격하기",
  虐: "무자비하고 잔혹하게 유린해 죽이기",
  殺: "오직 숨통을 끊기 위한 살수 펼치기",
  死: "죽음의 기운을 직접 내리꽂는 치명타",
  絶: "모든 희망과 퇴로를 끊는 절멸의 일격",
  滅: "흔적도 없이 지워버리는 파멸의 대공격",
  殲: "일대를 남김없이 몰살하는 섬멸 필살기",
  処: "가차 없는 처단과 단죄의 일격",
  刑: "잔혹한 형벌로 육신을 베고 부수기",
  罰: "거역할 수 없는 징벌의 일격 내리꽂기",
  審: "죄업을 심판하며 처형 각 재기",
  裁: "심판의 칼날로 내려치기",
  判: "유죄 판결과 함께 처형 공격 개시하기",
  臨: "압도적인 위엄으로 군림하며 짓누르기",
  威: "제왕의 위압감으로 숨통을 조이기",
  覇: "패왕의 기세로 모든 방어를 찍어 누르기",
  冥: "명부의 어둠으로 산 자의 영혼을 거두기",
  深: "심연의 깊은 어둠으로 끌어당기기",
  淵: "나락의 심연 속에서 집어삼키기",
  闇: "칠흑의 어둠으로 시야와 공간을 집어삼키기",
  暗: "어둠 속에 숨어 급소를 노리기",
  夜: "깊은 밤의 어둠 속에서 급습하기",
  黒: "검은 그림자 칼날로 베어내기",
  紅: "검붉은 선혈과 홍련의 기운으로 베고 태우기",
  白: "창백한 백골의 한기로 짓누르기",
  血: "피보라를 일으키며 흉포하게 할퀴고 베기",
  肉: "살점을 직접 뜯어내고 짓이기기",
  臓: "오장육부와 치명적인 내장을 노려 도려내기",
  喉: "숨통과 목구멍을 정확히 노려 물어뜯기",
  骨: "날카로운 뼈 창과 해골로 타격하기",
  骸: "유골 더미를 몰아쳐 짓누르기",
  屍: "썩어가는 주검의 몸으로 덮쳐 물어뜯기",
  鬼: "악귀의 괴력과 살기로 후려치기",
  魔: "마계의 사악한 마력으로 짓누르기",
  魂: "영혼을 직접 타격해 생명력 깎아내리기",
  魄: "혼백을 흔들어 의식과 생기를 앗아가기",
  霊: "원령의 냉기로 몸을 통과하며 할퀴기"
};

function describeSingleIntentKanji(k) {
  const str = String(k || "").trim();
  if (!str) return "";
  if (INTENT_KANJI_MEANINGS[str]) return `${str}(${INTENT_KANJI_MEANINGS[str]})`;
  const chars = Array.from(str);
  if (chars.length > 1) {
    const subMeanings = chars
      .map(c => INTENT_KANJI_MEANINGS[c] ? `${c}:${INTENT_KANJI_MEANINGS[c]}` : c)
      .join(" + ");
    return `${str}[${subMeanings}]`;
  }
  return `${str}(【${str}】의 한자 뜻을 실은 공격)`;
}

/*
 * Build a deterministic, concrete intention object (`{ type, summary, detail }`)
 * stored on `state.enemyIntentType` and `state.enemyIntentDesc` every turn.
 * Passed directly into the AI judge prompt so the AI never interprets enemy intent arbitrarily.
 */
function buildEnemyIntentDetail(foe, hand, rank = "normal", isEscape = false) {
  const safeHand = Array.isArray(hand) && hand.length ? hand : ["力"];
  const foeName = getEnemyShortName(foe);
  const handStr = safeHand.map(k => `【${k}】`).join("·");
  const actionParts = safeHand.map(describeSingleIntentKanji).join(" + ");

  if (isEscape) {
    return {
      type: "escape",
      summary: `도주 시도 (${handStr})`,
      detail: `[도주 시도] 체력이 크게 줄어든 ${foeName}【${foe}】이(가) ${handStr} 인텐션을 띄우며 전장에서 도망치려 합니다 (${actionParts}). 플레이어가 이동 차단·속박·추격하거나 이번 턴에 적을 처치하지 못하면 적이 그대로 도주합니다.`
    };
  }

  const primary = safeHand[0] || "";
  const allChars = safeHand.flatMap(k => Array.from(String(k || "")));
  const isCountdownPrep = COUNTDOWN_PREP_INTENTS.has(primary) || primary === "三" || primary === "二" || primary === "兆" || primary === "号";
  const hasLethal = safeHand.some(k => LETHAL_INTENTS.has(k)) || allChars.some(c => LETHAL_INTENTS.has(c));
  const hasEvadeDefend = safeHand.some(k => EVADE_DEFEND_INTENTS.has(k)) || allChars.some(c => EVADE_DEFEND_INTENTS.has(c));
  const hasCurseDebuff = safeHand.some(k => CURSE_DEBUFF_INTENTS.has(k)) || allChars.some(c => CURSE_DEBUFF_INTENTS.has(c));

  if (isCountdownPrep && !hasLethal) {
    return {
      type: "countdown_prep",
      summary: `필살 전조 / 기운 응축 (${handStr})`,
      detail: `[필살기 카운트다운 전조] ${foeName}【${foe}】이(가) ${handStr} 인텐션을 띄우며 대공격을 앞두고 불길한 기운을 응축합니다 (${actionParts}). 이번 턴의 반격 피해는 낮지만 다음 턴의 치명타를 준비하는 단계입니다.`
    };
  }

  if (hasLethal || primary === "一") {
    return {
      type: "lethal_attack",
      summary: `치명타 / 필살 공격 (${handStr})`,
      detail: `[치명타/필살 공격] ${foeName}【${foe}】이(가) ${handStr} 인텐션으로 ${actionParts} 방식의 치명적인 대공격을 가합니다. 플레이어가 이 구체적인 공격 방식을 직접 상쇄·차단·회피하지 못하면 큰 피해를 입습니다.`
    };
  }

  if (hasEvadeDefend && !hasCurseDebuff) {
    return {
      type: "guard_counter",
      summary: `경계·방어 및 반격 (${handStr})`,
      detail: `[경계/방어 및 반격] ${foeName}【${foe}】이(가) ${handStr} 인텐션으로 ${actionParts} 태세를 취하며 플레이어의 움직임을 살피고 날카롭게 반격합니다. 시야를 가리거나 방어를 깨뜨리는 행동으로 파훼해야 합니다.`
    };
  }

  if (hasCurseDebuff) {
    return {
      type: "curse_bind",
      summary: `저주·속박·상태이상 공격 (${handStr})`,
      detail: `[저주/속박/교란 공격] ${foeName}【${foe}】이(가) ${handStr} 인텐션으로 ${actionParts} 방식의 저주·독·속박 공격을 가합니다. 묶이거나 침식당하지 않도록 끊어내거나 정화·차단하는 대응이 필요합니다.`
    };
  }

  return {
    type: "normal_attack",
    summary: `직접 타격 (${handStr})`,
    detail: `[직접 공격] ${foeName}【${foe}】이(가) ${handStr} 인텐션으로 ${actionParts} 공격을 가합니다. 해당 공격 수단을 막아내거나 받아치는 행동으로 방어할 수 있습니다.`
  };
}

/* Events that "event:*" can roll (rest is reserved for 寺/shrines, quiz, stranger, and forge are included!). */
const RANDOM_EVENT_POOL = ["quiz", "stranger", "forge", "swarm", "dice", "mirror", "lantern", "shrine", "well", "corpse", "flower"];

/* Run shape: 9 steps. */
const PATH_STEPS = 9;
const FORK_WIDTH = 3;

/* Icons shown when a fork's outcome is revealed. */
const OUTCOME_ICONS = { battle: "⚔", elite: "💀", treasure: "🎁", event: "❔", rest: "🕯" };

