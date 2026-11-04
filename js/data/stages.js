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
    cards: ["土", "水", "草", "虫", "石", "雨", "日", "車", "竹"],
    foes: ["虫", "犬", "人", "男", "女", "車"],
    outcomes: [["battle", 65], ["event:quiz", 20], ["event:*", 15]]
  },
  村: {
    omen: STG_L("empty village ruins", "인적 끊긴 폐촌", "人影なき廃村", "荒废村落", "荒廢村落"),
    cards: ["火", "木", "土", "車", "糸", "金", "石", "手", "足"],
    foes: ["犬", "人", "男", "女", "子", "車"],
    outcomes: [["battle", 55], ["event:*", 30], ["treasure", 15]]
  },
  山: {
    omen: STG_L("steep crags and timber", "험준한 바위산", "険しい岩山", "险峻岩山", "險峻岩山"),
    cards: ["石", "木", "火", "土", "山", "空", "雨", "草", "력" in {} ? "力" : "竹"],
    foes: ["石", "犬", "虫", "森", "男"],
    outcomes: [["battle", 50], ["elite", 35], ["treasure", 15]],
    risky: true
  },
  川: {
    omen: STG_L("rushing dark water", "검게 흐르는 강가", "黒く流れる川辺", "黑水河畔", "黑水河畔"),
    cards: ["水", "石", "雨", "貝", "青", "竹", "糸", "草", "玉"],
    foes: ["虫", "犬", "자" in {} ? "子" : "女", "石"],
    outcomes: [["battle", 65], ["event:well", 20], ["event:*", 15]]
  },
  森: {
    omen: STG_L("tangled ancient woods", "울창한 고목의 숲", "鬱蒼たる森", "幽暗森林", "幽暗森林"),
    cards: ["木", "林", "草", "火", "花", "雨", "竹", "石", "糸"],
    foes: ["森", "虫", "犬", "女", "子"],
    outcomes: [["battle", 60], ["event:flower", 25], ["elite", 15]]
  },
  林: {
    omen: STG_L("whispering thicket", "바람 스치는 수풀", "ざわめく林", "低语树林", "低語樹林"),
    cards: ["木", "草", "竹", "花", "火", "土", "石", "糸", "音"],
    foes: ["虫", "森", "犬", "人"],
    outcomes: [["battle", 65], ["event:quiz", 20], ["event:*", 15]]
  },
  町: {
    omen: STG_L("silent town streets", "적막한 읍내 골목", "静まり返った町", "死寂街町", "死寂街町"),
    cards: ["石", "火", "金", "車", "手", "足", "力", "円", "百"],
    foes: ["人", "男", "女", "車", "犬"],
    outcomes: [["battle", 60], ["event:quiz", 20], ["treasure", 20]]
  },
  校: {
    omen: STG_L("charred schoolhouse", "종소리 멈춘 폐교", "鐘の止まった廃校", "荒废学堂", "荒廢學堂"),
    cards: ["本", "文", "字", "学", "音", "休", "火", "木", "一", "二", "三"],
    foes: ["先", "子", "人", "男", "女"],
    outcomes: [["battle", 55], ["elite", 25], ["event:quiz", 20]],
    risky: true
  },

  /* ---- Depth 2 (Kanken 9 + 10) ---- */
  道: {
    omen: STG_L("a beaten path", "다져진 길", "踏み固められた道", "踩实的路", "踩實的路"),
    cards: ["土", "石", "風", "足", "走", "車", "刀", "弓", "矢"],
    foes: ["馬", "牛", "兄", "姉", "父"],
    outcomes: [["battle", 70], ["event:*", 30]]
  },
  海: {
    omen: STG_L("pitch-black sea", "칠흑 같은 바다", "漆黒の海", "漆黑之海", "漆黑之海"),
    cards: ["水", "風", "船", "雨", "雲", "貝", "石", "夜", "光"],
    foes: ["魚", "鳥", "黒", "電", "夜"],
    outcomes: [["battle", 60], ["elite", 25], ["event:*", 15]],
    risky: true
  },
  池: {
    omen: STG_L("stagnant dark pond", "검게 고인 연못", "澱んだ古池", "死水池塘", "死水池塘"),
    cards: ["水", "雨", "石", "草", "木", "丸", "弱", "夜", "糸"],
    foes: ["魚", "鳥", "牛", "母", "姉"],
    outcomes: [["battle", 60], ["event:well", 25], ["event:quiz", 15]]
  },
  谷: {
    omen: STG_L("howling wind gorge", "칼바람 부는 계곡", "風唸る谷", "呼啸风谷", "呼嘯風谷"),
    cards: ["風", "岩", "石", "弓", "矢", "木", "雲", "雪", "高"],
    foes: ["鳥", "岩", "馬", "兄", "電"],
    outcomes: [["battle", 55], ["elite", 30], ["treasure", 15]],
    risky: true
  },
  野: {
    omen: STG_L("windswept plains", "황량한 들판", "吹きっ晒しの野", "荒野平原", "荒野平原"),
    cards: ["草", "風", "土", "火", "刀", "弓", "矢", "走", "角"],
    foes: ["馬", "牛", "鳥", "父", "兄"],
    outcomes: [["battle", 70], ["event:*", 30]]
  },
  寺: {
    omen: STG_L("incense and cold ash", "향 연기 남은 고찰", "香の煙る古寺", "残香古寺", "殘香古寺"),
    cards: ["火", "心", "光", "声", "言", "書", "紙", "茶", "木"],
    foes: ["父", "母", "黒", "夜", "親"],
    outcomes: [["event:rest", 70], ["event:shrine", 30]]
  },
  社: {
    omen: STG_L("mossy wayside shrine", "이끼 낀 신사", "苔むした社", "荒芜神社", "荒蕪神社"),
    cards: ["木", "石", "火", "光", "心", "紙", "刀", "夜", "星"],
    foes: ["姉", "母", "黒", "鳥", "夜"],
    outcomes: [["event:shrine", 45], ["battle", 40], ["event:quiz", 15]]
  },
  市: {
    omen: STG_L("abandoned market", "버려진 저잣거리", "捨てられた市", "荒废集市", "荒廢集市"),
    cards: ["肉", "米", "麦", "茶", "刀", "金", "火", "紙", "売"],
    foes: ["馬", "牛", "兄", "父", "黒"],
    outcomes: [["battle", 50], ["treasure", 30], ["event:quiz", 20]]
  },
  室: {
    omen: STG_L("sealed stone chamber", "봉인된 밀실", "封じられた室", "封闭密室", "封閉密室"),
    cards: ["石", "戸", "刀", "切", "火", "黒", "夜", "光", "糸"],
    foes: ["黒", "岩", "父", "母", "親"],
    outcomes: [["elite", 45], ["treasure", 35], ["battle", 20]],
    risky: true
  },

  /* ---- Depth 3 (Kanken 8) ---- */
  湖: {
    omen: STG_L("blood-tinted lake", "핏빛으로 물든 호수", "血に染まる湖", "血色湖泊", "血色湖泊"),
    cards: ["水", "血", "氷", "波", "深", "流", "寒", "石", "暗"],
    foes: ["氷", "血", "羊", "童", "死"],
    outcomes: [["battle", 60], ["elite", 25], ["event:well", 15]],
    risky: true
  },
  港: {
    omen: STG_L("fog-choked harbor", "안개 낀 폐항구", "霧に沈む港", "迷雾废港", "迷霧廢港"),
    cards: ["水", "波", "船", "鉄", "荷", "箱", "油", "火", "風"],
    foes: ["客", "者", "氷", "悪"],
    outcomes: [["battle", 65], ["treasure", 20], ["event:*", 15]]
  },
  島: {
    omen: STG_L("isolated isle of bones", "고립된 외딴섬", "孤立した島", "孤立荒岛", "孤立荒島"),
    cards: ["水", "波", "石", "木", "火", "氷", "風", "薬", "打"],
    foes: ["氷", "者", "悪", "神", "死"],
    outcomes: [["elite", 45], ["battle", 40], ["treasure", 15]],
    risky: true
  },
  坂: {
    omen: STG_L("muddy uphill slope", "진흙탕 오르막길", "ぬかるむ坂", "泥泞坡道", "泥濘坡道"),
    cards: ["土", "石", "重", "落", "転", "足", "風", "打", "投"],
    foes: ["羊", "童", "客", "者"],
    outcomes: [["battle", 70], ["event:quiz", 15], ["event:*", 15]]
  },
  畑: {
    omen: STG_L("scorched dry field", "검게 탄 화전(畑)", "焼け焦げた畑", "焦黑旱田", "焦黑旱田"),
    cards: ["火", "土", "炭", "油", "豆", "葉", "根", "草", "放"],
    foes: ["羊", "童", "病", "者"],
    outcomes: [["battle", 65], ["event:flower", 20], ["event:quiz", 15]]
  },
  屋: {
    omen: STG_L("creaking blood-stained house", "삐걱이는 폐옥", "軋む廃屋", "吱呀废屋", "吱呀廢屋"),
    cards: ["木", "火", "油", "炭", "血", "皿", "箱", "柱", "板"],
    foes: ["客", "童", "血", "悪", "主"],
    outcomes: [["battle", 55], ["elite", 25], ["event:*", 20]]
  },
  院: {
    omen: STG_L("plague infirmary", "역병 도는 폐병동", "疫病の廃院", "疫病废院", "疫病廢院"),
    cards: ["血", "病", "薬", "医", "湯", "酒", "火", "身", "皮", "歯"],
    foes: ["医", "病", "血", "死", "悪"],
    outcomes: [["battle", 55], ["elite", 25], ["event:quiz", 20]],
    risky: true
  },
  庫: {
    omen: STG_L("rusted armory vault", "녹슨 철창고", "錆びた武器庫", "锈蚀武库", "鏽蝕武庫"),
    cards: ["鉄", "銀", "油", "炭", "火", "刀", "箱", "具", "打", "投"],
    foes: ["者", "客", "悪", "主"],
    outcomes: [["treasure", 45], ["battle", 40], ["elite", 15]]
  },

  /* ---- Depth 4 (Kanken 7: Prefectures & Old Battlefield) ---- */
  茨: {
    omen: STG_L("Ibaraki briar wasteland", "가시나무 들판 (이바라키)", "茨の荒野 (いばらき)", "荆棘荒原", "荊棘荒原"),
    cards: ["茨", "木", "草", "火", "焼", "松", "芽", "縄", "風", "折"],
    foes: ["熊", "鹿", "兵", "徒", "民"],
    outcomes: [["battle", 55], ["event:quiz", 25], ["event:flower", 20]]
  },
  潟: {
    omen: STG_L("Niigata black mudflats", "검은 개펄과 석호 (니가타)", "黒い干潟 (にいがた)", "黑泥泻湖", "黑泥潟湖"),
    cards: ["潟", "水", "塩", "浅", "冷", "漁", "氷", "土", "石", "県"],
    foes: ["兵", "熊", "徒", "老", "官"],
    outcomes: [["battle", 55], ["event:quiz", 25], ["event:well", 20]]
  },
  栃: {
    omen: STG_L("Tochigi horse-chestnut woods", "상수리 고목림 (토치기)", "栃の古木林 (とちぎ)", "七叶树林", "七葉樹林"),
    cards: ["栃", "木", "松", "梅", "梨", "巣", "材", "火", "焼", "風"],
    foes: ["熊", "鹿", "児", "老", "民"],
    outcomes: [["battle", 60], ["event:quiz", 20], ["elite", 20]]
  },
  阪: {
    omen: STG_L("Osaka blood-soaked embankment", "피로 물든 비탈길 (오사카)", "血塗られた阪 (おおさか)", "染血坡道", "染血坡道"),
    cards: ["阪", "石", "土", "戦", "刀", "火", "熱", "旗", "輪", "囲"],
    foes: ["兵", "徒", "官", "臣", "軍"],
    outcomes: [["battle", 55], ["elite", 30], ["event:quiz", 15]],
    risky: true
  },
  岐: {
    omen: STG_L("Gifu mountain crossroads", "험한 갈림 산길 (기후)", "険しき岐路 (ぎふ)", "险峻岐路", "險峻岐路"),
    cards: ["岐", "山", "石", "木", "風", "縄", "灯", "鏡", "刀", "飛"],
    foes: ["鹿", "熊", "兵", "老", "夫"],
    outcomes: [["battle", 50], ["event:quiz", 30], ["event:*", 20]]
  },
  城: {
    omen: STG_L("sieged fortress ruins", "불타는 고성(古城)", "燃える古城", "燃烧古城", "燃燒古城"),
    cards: ["城", "石", "火", "焼", "戦", "械", "刀", "鉄", "旗", "固"],
    foes: ["兵", "官", "臣", "司", "軍"],
    outcomes: [["elite", 50], ["battle", 35], ["treasure", 15]],
    risky: true
  },
  街: {
    omen: STG_L("ruined garrison street", "폐허가 된 병영 거리", "廃墟の街", "废墟街道", "廢墟街道"),
    cards: ["街", "火", "灯", "鏡", "器", "衣", "飯", "塩", "鉄", "械"],
    foes: ["民", "徒", "児", "老", "官"],
    outcomes: [["battle", 55], ["treasure", 25], ["event:quiz", 20]]
  },

  /* ---- Depth 5 (Kanken 6: Sinners' Mound) ---- */
  墓: {
    omen: STG_L("freshly dug graves", "죄인들의 무덤가", "罪人の墓場", "罪人墓地", "罪人墓地"),
    cards: ["墓", "土", "石", "死", "血", "毒", "火", "殺", "破", "迷"],
    foes: ["祖", "犯", "罪", "武", "災"],
    outcomes: [["battle", 50], ["event:corpse", 35], ["elite", 15]],
    risky: true
  },
  堂: {
    omen: STG_L("heretic ritual hall", "이단의 법당", "異端の堂", "异端佛堂", "異端佛堂"),
    cards: ["仏", "火", "燃", "夢", "術", "像", "布", "光", "罪", "眼"],
    foes: ["像", "婦", "妻", "仏", "師"],
    outcomes: [["event:rest", 55], ["event:shrine", 25], ["battle", 20]]
  },
  河: {
    omen: STG_L("river of acid and ash", "잿빛 강물", "灰色の河", "灰暗大河", "灰暗大河"),
    cards: ["水", "液", "酸", "毒", "河", "氷", "石", "風", "暴", "破"],
    foes: ["士", "犯", "婦", "武", "災"],
    outcomes: [["battle", 65], ["event:well", 20], ["event:quiz", 15]]
  },
  鉱: {
    omen: STG_L("collapsed toxic mine", "독가스가 새는 폐광", "毒ガスの廃鉱", "毒气废矿", "毒氣廢礦"),
    cards: ["鉱", "銅", "鉄", "石", "火", "燃", "破", "圧", "粉", "酸"],
    foes: ["犯", "像", "士", "武", "罪"],
    outcomes: [["battle", 55], ["treasure", 30], ["elite", 15]]
  },
  境: {
    omen: STG_L("border of the living", "생사의 경계선", "生死の境", "生死边界", "生死邊界"),
    cards: ["境", "迷", "夢", "逆", "殺", "武", "術", "防", "護", "刀"],
    foes: ["士", "祖", "武", "罪", "師"],
    outcomes: [["elite", 45], ["battle", 40], ["event:quiz", 15]],
    risky: true
  },

  /* ---- Depth 6 (Kanken 5: Hall of Bones) ---- */
  蔵: {
    omen: STG_L("locked ossuary vault", "잠긴 백골 비고", "閉ざされた骨蔵", "上锁骨藏", "上鎖骨藏"),
    cards: ["骨", "臓", "血", "鉄", "鋼", "宝", "銭", "刀", "火", "灰"],
    foes: ["骨", "亡", "敵", "将", "皇"],
    outcomes: [["treasure", 55], ["battle", 30], ["elite", 15]]
  },
  穴: {
    omen: STG_L("bottomless bone pit", "해골이 쌓인 굴", "白骨の穴", "白骨洞穴", "白骨洞穴"),
    cards: ["穴", "骨", "脳", "傷", "痛", "石", "土", "吸", "針", "暗"],
    foes: ["骨", "亡", "幼", "蚕", "異"],
    outcomes: [["battle", 60], ["event:corpse", 25], ["elite", 15]],
    risky: true
  },
  泉: {
    omen: STG_L("steaming blood spring", "김이 피어오르는 피의 샘", "湯気立つ血の泉", "沸血之泉", "沸血之泉"),
    cards: ["水", "泉", "蒸", "潮", "血", "洗", "氷", "液", "紅", "吸"],
    foes: ["幼", "俳", "衆", "異", "聖"],
    outcomes: [["event:well", 45], ["battle", 40], ["event:rest", 15]]
  },
  砂: {
    omen: STG_L("ashen bone desert", "뼛가루 날리는 사막", "骨灰の砂漠", "骨灰沙漠", "骨灰沙漠"),
    cards: ["砂", "灰", "干", "風", "火", "骨", "石", "射", "棒", "熱"],
    foes: ["骨", "亡", "衆", "敵", "将"],
    outcomes: [["battle", 65], ["event:quiz", 20], ["elite", 15]]
  },
  樹: {
    omen: STG_L("flesh-bearing great tree", "살점이 열린 거목", "肉実る大樹", "血肉巨树", "血肉巨樹"),
    cards: ["樹", "木", "紅", "血", "臓", "脳", "舌", "枝", "針", "卵"],
    foes: ["蚕", "幼", "俳", "異", "敵"],
    outcomes: [["battle", 55], ["event:flower", 25], ["elite", 20]]
  },
  閣: {
    omen: STG_L("imperial bone pavilion", "백골의 누각", "白骨の閣", "白骨楼阁", "白骨樓閣"),
    cards: ["鋼", "刀", "射", "刻", "磁", "鏡", "火", "断", "処", "針"],
    foes: ["敵", "衆", "将", "聖", "皇"],
    outcomes: [["elite", 50], ["battle", 35], ["treasure", 15]],
    risky: true
  },

  /* ---- Depth 7 (Kanken 4: Valley of Wailing) ---- */
  殿: {
    omen: STG_L("echoing demon hall", "곡성이 울리는 전당", "鬼哭の殿", "鬼哭大殿", "鬼哭大殿"),
    cards: ["剣", "撃", "突", "刺", "盾", "矛", "鎖", "火", "血", "壊"],
    foes: ["郎", "奴", "隷", "巨", "鬼"],
    outcomes: [["elite", 50], ["battle", 40], ["treasure", 10]],
    risky: true
  },
  塔: {
    omen: STG_L("lightning-struck spire", "벼락 치는 첨탑", "雷落ちる塔", "雷击高塔", "雷擊高塔"),
    cards: ["雷", "爆", "砲", "弾", "煙", "風", "火", "鉄", "剣", "撃"],
    foes: ["僧", "娘", "狂", "雷", "雄"],
    outcomes: [["battle", 55], ["elite", 30], ["event:quiz", 15]],
    risky: true
  },
  沼: {
    omen: STG_L("rotting poison swamp", "썩어가는 독늪", "腐敗の沼", "腐败毒沼", "腐敗毒沼"),
    cards: ["沼", "水", "腐", "毒", "霧", "煙", "土", "沈", "刺", "鎖"],
    foes: ["獣", "奴", "隷", "狂", "鬼"],
    outcomes: [["battle", 60], ["event:well", 20], ["event:*", 20]]
  },
  峰: {
    omen: STG_L("jagged beast peak", "짐승 울부짖는 봉우리", "獣咆える峰", "群兽险峰", "群獸險峰"),
    cards: ["石", "岩", "風", "雷", "襲", "駆", "跳", "剣", "火", "鋭"],
    foes: ["獣", "郎", "巨", "狂", "雷"],
    outcomes: [["battle", 60], ["elite", 25], ["event:*", 15]]
  },
  陣: {
    omen: STG_L("abandoned siege camp", "피로 그려진 진영", "血の陣営", "血之阵营", "血之陣營"),
    cards: ["剣", "矛", "盾", "砲", "弾", "爆", "鎖", "火", "薪", "攻"],
    foes: ["郎", "奴", "僧", "巨", "雄"],
    outcomes: [["battle", 55], ["treasure", 25], ["elite", 20]]
  },

  /* ---- Depth 8 (Kanken 3: Demon Wilds) ---- */
  獄: {
    omen: STG_L("iron torture gaol", "절규하는 지하 감옥", "絶叫の牢獄", "绝叫牢狱", "絕叫牢獄"),
    cards: ["獄", "縛", "絞", "鎖", "鉄", "刑", "炎", "血", "魂", "奪"],
    foes: ["賊", "婆", "邪", "侍", "魔"],
    outcomes: [["elite", 50], ["battle", 40], ["event:quiz", 10]],
    risky: true
  },
  炉: {
    omen: STG_L("hellfire smelting furnace", "영혼을 녹이는 용광로", "魂溶かす炉", "炼魂熔炉", "煉魂熔爐"),
    cards: ["炎", "火", "焦", "鍛", "鋳", "鉄", "煙", "滅", "爆", "塊"],
    foes: ["怪", "豚", "賊", "侍", "魔"],
    outcomes: [["battle", 55], ["treasure", 25], ["elite", 20]]
  },
  壇: {
    omen: STG_L("sacrificial blood altar", "산제물의 제단", "生贄の祭壇", "活祭祭坛", "活祭祭壇"),
    cards: ["霊", "魂", "邪", "祈", "血", "炎", "犠", "牲", "封", "鐘"],
    foes: ["霊", "嬢", "姫", "幽", "帝"],
    outcomes: [["event:shrine", 40], ["battle", 40], ["elite", 20]]
  },
  墳: {
    omen: STG_L("ancient imperial barrow", "도굴된 고분", "暴かれた古墳", "被盗古坟", "被盜古墳"),
    cards: ["葬", "埋", "魂", "霊", "幽", "骨", "土", "石", "凍", "幻"],
    foes: ["霊", "幽", "婆", "侍", "帝"],
    outcomes: [["battle", 55], ["event:corpse", 30], ["treasure", 15]]
  },
  峡: {
    omen: STG_L("phantom-haunted gorge", "원귀가 떠도는 협곡", "亡霊の峡谷", "亡灵峡谷", "亡靈峽谷"),
    cards: ["風", "凍", "零", "氷", "崩", "裂", "岩", "貫", "殴", "幻"],
    foes: ["怪", "賊", "豚", "騎", "魔"],
    outcomes: [["battle", 65], ["event:*", 20], ["elite", 15]]
  },

  /* ---- Depth 9 (Kanken 2.5: Road of Tyrants) ---- */
  洞: {
    omen: STG_L("wyrm's cavern", "화룡이 잠든 동굴", "竜眠る洞", "恶龙洞窟", "惡龍洞窟"),
    cards: ["火", "炎", "岩", "砕", "剛", "珠", "硝", "硫", "煙", "渦"],
    foes: ["蛇", "猿", "仙", "竜", "覇"],
    outcomes: [["elite", 50], ["battle", 35], ["treasure", 15]],
    risky: true
  },
  廃: {
    omen: STG_L("blighted ruin sector", "역병 도는 폐허", "疫病の廃墟", "疫病废墟", "疫病廢墟"),
    cards: ["廃", "銃", "刃", "硝", "鉄", "泥", "疫", "菌", "毒", "火"],
    foes: ["忍", "猫", "蚊", "囚", "虜"],
    outcomes: [["battle", 60], ["event:quiz", 20], ["event:*", 20]]
  },
  塚: {
    omen: STG_L("mound of executed blades", "처형당한 칼들의 무덤", "処刑刀の塚", "刑刀之冢", "刑刀之塚"),
    cards: ["刃", "刀", "剣", "棺", "弔", "骨", "血", "漆", "縛", "拷"],
    foes: ["忍", "囚", "虜", "翁", "帥"],
    outcomes: [["battle", 55], ["event:corpse", 25], ["elite", 20]]
  },
  堀: {
    omen: STG_L("black moat of warships", "철갑선이 가라앉은 해자", "鉄艦沈む堀", "沉舰护城河", "沉艦護城河"),
    cards: ["水", "渦", "泥", "泡", "銃", "艦", "鉄", "氷", "雷", "津"],
    foes: ["蛇", "蚊", "虜", "帥", "竜"],
    outcomes: [["battle", 60], ["elite", 25], ["treasure", 15]]
  },
  窯: {
    omen: STG_L("ash-choked kiln", "인골을 굽는 가마", "人骨を焼く窯", "焚骨窑炉", "焚骨窯爐"),
    cards: ["火", "炎", "沸", "融", "硝", "硫", "灰", "炭", "瓶", "癒"],
    foes: ["猫", "猿", "囚", "仙", "翁"],
    outcomes: [["event:rest", 45], ["battle", 40], ["event:quiz", 15]]
  },

  /* ---- Depth 10 (Kanken 2: The Underworld) ---- */
  闇: {
    omen: STG_L("lightless abyssal dark", "빛 한 줄기 없는 칠흑", "光なき闇", "无光之暗", "無光之闇"),
    cards: ["闇", "呪", "斬", "妖", "怨", "冥", "火", "光", "血", "刃"],
    foes: ["妖", "乞", "骸", "怨", "闇"],
    outcomes: [["battle", 45], ["elite", 35], ["event:*", 20]],
    risky: true
  },
  窟: {
    omen: STG_L("den of fangs and claws", "어금니와 발톱의 마굴", "牙と爪の魔窟", "牙爪魔窟", "牙爪魔窟"),
    cards: ["牙", "爪", "拳", "蹴", "潰", "骨", "骸", "血", "肉", "剥"],
    foes: ["虎", "亀", "蜂", "駒", "骸"],
    outcomes: [["battle", 60], ["elite", 25], ["event:corpse", 15]]
  },
  崖: {
    omen: STG_L("storm-lashed cliff", "폭풍 몰아치는 절벽", "嵐吹き荒れる崖", "风暴断崖", "風暴斷崖"),
    cards: ["嵐", "風", "雷", "崖", "石", "蹴", "落", "鎌", "斬", "氷"],
    foes: ["鶴", "虎", "蜂", "怨", "鬱"],
    outcomes: [["battle", 55], ["elite", 30], ["event:quiz", 15]],
    risky: true
  },
  冥: {
    omen: STG_L("threshold of the dead", "저승의 문턱", "冥府の敷居", "冥府门槛", "冥府門檻"),
    cards: ["冥", "呪", "怨", "骸", "死", "魂", "鎌", "闇", "炎", "氷"],
    foes: ["骸", "怨", "妖", "乞", "冥"],
    outcomes: [["elite", 50], ["battle", 35], ["event:shrine", 15]],
    risky: true
  },
  釜: {
    omen: STG_L("boiling hell cauldron", "죄인을 삶는 가마솥", "罪人煮る地獄釜", "烹罪地狱釜", "烹罪地獄釜"),
    cards: ["釜", "火", "炎", "煎", "湯", "水", "油", "血", "毒", "蜜"],
    foes: ["妖", "亀", "蜂", "乞", "骸"],
    outcomes: [["battle", 55], ["event:rest", 25], ["event:quiz", 20]]
  },

  /* ---- Depth 11 (Kanken Jun-1: Beast King's Tomb) ---- */
  牢: {
    omen: STG_L("blood-soaked beast cage", "맹수들의 피투성이 뇌옥", "獣の血牢", "猛兽血牢", "猛獸血牢"),
    cards: ["牢", "槍", "斧", "鎧", "薙", "鎖", "鉄", "血", "火", "噛"],
    foes: ["狼", "豹", "猪", "獅", "兇"],
    outcomes: [["battle", 55], ["elite", 30], ["treasure", 15]],
    risky: true
  },
  砦: {
    omen: STG_L("dragonfire bastion", "화염에 휩싸인 요새", "劫火の砦", "劫火壁垒", "劫火砦壘"),
    cards: ["焔", "火", "炎", "槍", "斧", "鎧", "薙", "轟", "閃", "穿"],
    foes: ["鷲", "狼", "獅", "兇", "龍"],
    outcomes: [["elite", 50], ["battle", 35], ["event:quiz", 15]],
    risky: true
  },
  祠: {
    omen: STG_L("hungry beast shrine", "살점을 탐하는 사당", "肉を喰らう祠", "噬肉古祠", "噬肉古祠"),
    cards: ["屍", "呑", "噛", "喰", "血", "骨", "火", "呪", "杖", "焚"],
    foes: ["狐", "屍", "鰐", "鮫", "鳳"],
    outcomes: [["event:shrine", 45], ["battle", 40], ["event:quiz", 15]]
  },
  洲: {
    omen: STG_L("blood-stained sandbar", "아귀들이 득실대는 물가", "顎門うごめく洲", "恶鳄沙洲", "惡鱷沙洲"),
    cards: ["水", "濡", "溢", "雫", "氷", "雷", "槍", "血", "噛", "呑"],
    foes: ["鰐", "鮫", "屍", "鷲", "鷹"],
    outcomes: [["battle", 65], ["event:well", 20], ["elite", 15]]
  },

  /* ---- Depth 12 (Kanken 1: The Abyss 奈落) ---- */
  罠: {
    omen: STG_L("flesh-rending abyssal trap", "살가죽을 찢는 나락의 함정", "肉裂く奈落の罠", "裂肉深渊陷阱", "裂肉深淵陷阱"),
    cards: ["罠", "蟲", "蠱", "毒", "針", "斬", "血", "火", "焔", "礫"],
    foes: ["蟲", "蠱", "蝮", "傀儡", "饕餮"],
    outcomes: [["battle", 50], ["elite", 35], ["event:quiz", 15]],
    risky: true
  },
  尸: {
    omen: STG_L("mountain of twitching corpses", "꿈틀거리는 시체 산", "蠢く尸の山", "蠢动尸山", "蠢動尸山"),
    cards: ["尸", "屍", "骨", "髑", "髏", "血", "咒", "祟", "詛", "火"],
    foes: ["巫", "魑", "魍", "髑髏", "饕餮"],
    outcomes: [["elite", 50], ["battle", 35], ["event:corpse", 15]],
    risky: true
  },
  峙: {
    omen: STG_L("monolith of the glutton god", "괴신이 도사린 절벽", "怪神聳える峙", "怪神耸立之巅", "怪神聳立之峙"),
    cards: ["礫", "石", "岩", "雷", "焔", "殲", "咆", "睨", "噬", "抉"],
    foes: ["魃", "蛟", "魑", "傀儡", "饕餮"],
    outcomes: [["elite", 55], ["battle", 35], ["treasure", 10]],
    risky: true
  },
  澪: {
    omen: STG_L("vein of black venom", "검은 독혈이 흐르는 수맥", "黒毒流れる澪", "黑毒水脉", "黑毒水脈"),
    cards: ["水", "淹", "滲", "毒", "蠱", "蟲", "氷", "血", "咒", "噬"],
    foes: ["蟲", "蠱", "巫", "魍", "蛟"],
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
  depth_1:  ["田", "村", "山", "川", "森", "林", "町", "校"],
  depth_2:  ["海", "池", "谷", "野", "寺", "社", "市", "室", "道"],
  depth_3:  ["湖", "港", "島", "坂", "畑", "屋", "院", "庫"],
  depth_4:  ["茨", "潟", "栃", "阪", "岐", "城", "街"],
  depth_5:  ["墓", "堂", "河", "鉱", "境", "寺"],
  depth_6:  ["蔵", "穴", "泉", "砂", "樹", "閣"],
  depth_7:  ["殿", "塔", "沼", "峰", "陣", "谷"],
  depth_8:  ["獄", "炉", "壇", "墳", "峡", "寺"],
  depth_9:  ["洞", "廃", "塚", "堀", "窯", "獄"],
  depth_10: ["闇", "窟", "崖", "冥", "釜", "塚"],
  depth_11: ["牢", "砦", "祠", "洲", "窟", "闇"],
  depth_12: ["罠", "尸", "峙", "澪", "冥", "牢"]
};

/*
 * Grade-matched Escape Intent Kanji when an enemy is at low HP (<= 35%) and tries to flee!
 * Each depth uses escape/movement kanji from its own Kanken grade.
 */
const DEPTH_ESCAPE_INTENTS = {
  depth_1:  ["出", "足"],
  depth_2:  ["走", "帰"],
  depth_3:  ["去", "速"],
  depth_4:  ["飛", "散"],
  depth_5:  ["迷", "往"],
  depth_6:  ["退", "裏"],
  depth_7:  ["逃", "避"],
  depth_8:  ["潜", "匿"],
  depth_9:  ["逸", "奔"],
  depth_10: ["隙", "踪"],
  depth_11: ["遁", "馳"],
  depth_12: ["遁", "逍"]
};

/*
 * Grade-matched fallback intent pools per depth so every depth uses its own Kanken pool!
 * Notice how similar concepts evolve with grade:
 *  - Gaze/Watch: 目/見(10급) -> 顔/声(9급) -> 向/相(8급) -> 察/望(7급) -> 眼/査(6급) -> 視/看/探(5급) -> 伺/尋/監(4급) -> 潜/幻(3급) -> 眺/偵(준2) -> 瞳/狙(2급) -> 覗/窺(준1) -> 睨/覘(1급)
 *  - Bite/Strike: 口/足/手/力(10급) -> 刀/切/弓/矢/角(9급) -> 打/投/歯/血(8급) -> 戦/折/焼/束(7급) -> 殺/破/暴/毒/囲(6급) -> 傷/痛/断/射/針(5급) -> 撃/突/剣/刺/爆(4급) -> 縛/絞/殴/貫/滅(3급) -> 砕/銃/刃/拷(준2) -> 斬/牙/爪/拳/蹴(2급) -> 噛/喰/呑/薙(준1) -> 噬/抉/蹂/殲(1급)
 */
const DEPTH_INTENT_POOLS = {
  depth_1:  ["口", "足", "手", "力", "目", "見", "石", "火"],
  depth_2:  ["刀", "切", "角", "走", "弓", "矢", "強", "声"],
  depth_3:  ["打", "投", "歯", "血", "重", "落", "向", "死"],
  depth_4:  ["戦", "折", "焼", "束", "察", "望", "縄", "害"],
  depth_5:  ["殺", "破", "暴", "毒", "眼", "囲", "圧", "絶"],
  depth_6:  ["傷", "痛", "断", "射", "針", "吸", "視", "看"],
  depth_7:  ["撃", "突", "剣", "刺", "爆", "砲", "伺", "狂"],
  depth_8:  ["縛", "絞", "殴", "貫", "奪", "裂", "滅", "刑"],
  depth_9:  ["砕", "銃", "刃", "拷", "撲", "渦", "眺", "嚇"],
  depth_10: ["斬", "牙", "爪", "拳", "蹴", "潰", "狙", "呪"],
  depth_11: ["噛", "喰", "呑", "薙", "槍", "斧", "覗", "轟"],
  depth_12: ["噬", "抉", "蹂", "殲", "詛", "祟", "睨", "咆"]
};

/*
 * Enemy Intent Kanji (Slay the Spire-style telegraphed moves via Kanji).
 * Strictly uses kanji from that enemy's Kanken grade or lower!
 */
const FOE_INTENT_PROFILES = {
  // Depth 1 (Kanken 10 ONLY)
  犬: { normal: ["口", "足", "目", "耳"] },
  虫: { normal: ["口", "目", "糸", "草"] },
  人: { normal: ["手", "足", "石", "火"] },
  男: { normal: ["力", "手", "足", "石"] },
  女: { normal: ["目", "手", "火", "糸"] },
  子: { normal: ["音", "手", "足", "石"] },
  石: { normal: ["足", "力", "山", "土"] },
  森: { normal: ["木", "林", "草", "休"] },
  車: { normal: ["足", "力", "金", "火"] },
  王: { countdown: ["三", "二", "一", "力"], normal: ["金", "火", "上", "下"] },
  天: { countdown: ["三", "二", "一", "雨"], normal: ["空", "日", "月", "火"] },
  先: { countdown: ["三", "二", "一", "下"], normal: ["本", "文", "字", "目"] },

  // Depth 2 (Kanken 9 + 10)
  馬: { normal: ["走", "足", "強", "風"] },
  牛: { normal: ["角", "力", "頭", "走"] },
  鳥: { normal: ["羽", "風", "鳴", "目"] },
  魚: { normal: ["水", "海", "池", "口"] },
  兄: { normal: ["刀", "切", "力", "走"] },
  姉: { normal: ["弓", "矢", "風", "目"] },
  父: { normal: ["刀", "強", "声", "力"] },
  母: { normal: ["火", "心", "声", "止"] },
  岩: { normal: ["力", "強", "山", "石"] },
  黒: { normal: ["黒", "夜", "刀", "切"] },
  電: { countdown: ["雲", "風", "電"], normal: ["光", "音", "強", "矢"] },
  夜: { countdown: ["夕", "夜", "黒"], normal: ["星", "月", "風", "切"] },
  親: { countdown: ["三", "二", "一", "切"], normal: ["刀", "声", "言", "強"] },

  // Depth 3 (Kanken 8)
  羊: { normal: ["角", "走", "歯", "重"] },
  童: { normal: ["投", "石", "遊", "速"] },
  客: { normal: ["刀", "打", "投", "暗"] },
  医: { normal: ["薬", "血", "歯", "切"] },
  者: { normal: ["打", "投", "刀", "追"] },
  氷: { normal: ["氷", "寒", "落", "重"] },
  病: { normal: ["病", "血", "苦", "息"] },
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
  民: { normal: ["火", "焼", "石", "争"] },
  老: { normal: ["察", "固", "鏡", "説"] },
  児: { normal: ["泣", "笑", "投", "速"] },
  官: { normal: ["令", "束", "縄", "察"] },
  臣: { normal: ["戦", "守", "固", "刀"] },
  軍: { countdown: ["号", "連", "戦"], normal: ["焼", "矢", "折", "械"] },
  司: { countdown: ["案", "察", "敗"], normal: ["令", "縄", "鏡", "害"] },
  夫: { countdown: ["三", "二", "一", "折"], normal: ["力", "戦", "焼", "固"] },

  // Depth 5 (Kanken 6)
  士: { normal: ["武", "殺", "刀", "破"] },
  婦: { normal: ["毒", "糸", "眼", "迷"] },
  妻: { normal: ["毒", "燃", "眼", "査"] },
  祖: { normal: ["墓", "圧", "絶", "術"] },
  犯: { normal: ["殺", "暴", "破", "毒"] },
  像: { normal: ["圧", "破", "眼", "防"] },
  武: { normal: ["武", "殺", "破", "暴"] },
  罪: { normal: ["罪", "毒", "燃", "絶"] },
  災: { countdown: ["燃", "暴", "災"], normal: ["破", "毒", "圧", "絶"] },
  師: { countdown: ["眼", "判", "絶"], normal: ["術", "破", "禁", "圧"] },
  仏: { countdown: ["三", "二", "一", "絶"], normal: ["眼", "光", "圧", "護"] },

  // Depth 6 (Kanken 5)
  骨: { normal: ["骨", "傷", "折", "断"] },
  亡: { normal: ["亡", "吸", "冷", "暗"] },
  幼: { normal: ["泣", "針", "吸", "密"] },
  衆: { normal: ["乱", "囲", "暴", "圧"] },
  俳: { normal: ["迷", "映", "針", "視"] },
  蚕: { normal: ["糸", "吸", "毒", "閉"] },
  敵: { normal: ["傷", "断", "射", "激"] },
  異: { normal: ["異", "脳", "臓", "吸"] },
  皇: { countdown: ["臨", "裁", "処"], normal: ["権", "圧", "断", "射"] },
  将: { countdown: ["揮", "討", "断"], normal: ["鋼", "射", "傷", "激"] },
  聖: { countdown: ["三", "二", "一", "処"], normal: ["光", "裁", "断", "針"] },

  // Depth 7 (Kanken 4)
  獣: { normal: ["襲", "歯", "狂", "叫"] },
  奴: { normal: ["鎖", "刺", "撃", "逃"] },
  娘: { normal: ["惑", "刺", "涙", "針"] },
  郎: { normal: ["剣", "突", "撃", "鋭"] },
  僧: { normal: ["戒", "罰", "音", "圧"] },
  隷: { normal: ["鎖", "壊", "怒", "突"] },
  巨: { normal: ["壊", "踏", "圧", "撃"] },
  狂: { normal: ["狂", "襲", "暴", "叫"] },
  鬼: { countdown: ["怒", "狂", "壊"], normal: ["撃", "突", "鎖", "襲"] },
  雷: { countdown: ["雲", "光", "雷"], normal: ["撃", "爆", "震", "焼"] },
  雄: { countdown: ["叫", "駆", "撃"], normal: ["剣", "突", "矛", "盾"] },

  // Depth 8 (Kanken 3)
  霊: { normal: ["魂", "凍", "恨", "封"] },
  怪: { normal: ["殴", "裂", "貫", "脅"] },
  賊: { normal: ["奪", "潜", "刺", "縛"] },
  婆: { normal: ["恨", "毒", "絞", "欺"] },
  嬢: { normal: ["魅", "幻", "絞", "奪"] },
  姫: { normal: ["氷", "凍", "魅", "封"] },
  豚: { normal: ["突", "餓", "殴", "崩"] },
  侍: { normal: ["剣", "貫", "裂", "伐"] },
  幽: { normal: ["幻", "潜", "凍", "魂"] },
  邪: { normal: ["邪", "炎", "縛", "虐"] },
  魔: { countdown: ["封", "炎", "滅"], normal: ["縛", "奪", "裂", "幻"] },
  帝: { countdown: ["審", "刑", "滅"], normal: ["縛", "貫", "圧", "炎"] },
  騎: { countdown: ["駆", "突", "貫"], normal: ["剣", "裂", "崩", "殴"] },

  // Depth 9 (Kanken 2.5)
  猫: { normal: ["疾", "眺", "裂", "奇"] },
  蛇: { normal: ["毒", "絞", "潜", "渦"] },
  猿: { normal: ["跳", "投", "奪", "侮"] },
  蚊: { normal: ["吸", "血", "疫", "菌"] },
  忍: { normal: ["刃", "潜", "毒", "煙"] },
  囚: { normal: ["鎖", "拷", "撲", "狂"] },
  虜: { normal: ["縛", "恨", "撲", "砕"] },
  仙: { normal: ["幻", "渦", "雷", "癒"] },
  翁: { normal: ["眺", "剛", "砕", "喝"] },
  竜: { countdown: ["渦", "炎", "砕"], normal: ["火", "剛", "雷", "嚇"] },
  覇: { countdown: ["威", "圧", "砕"], normal: ["刃", "剛", "撲", "滅"] },
  帥: { countdown: ["斉", "銃", "砲"], normal: ["刃", "撃", "貫", "囲"] },

  // Depth 10 (Kanken 2)
  虎: { normal: ["牙", "爪", "襲", "蹴"] },
  亀: { normal: ["錮", "殻", "重", "潰"] },
  蜂: { normal: ["針", "毒", "刺", "群"] },
  鶴: { normal: ["蹴", "狙", "貫", "風"] },
  駒: { normal: ["蹴", "突", "走", "潰"] },
  妖: { normal: ["妖", "呪", "惑", "闇"] },
  乞: { normal: ["呪", "怨", "奪", "唾"] },
  骸: { normal: ["骨", "鎌", "斬", "潰"] },
  怨: { normal: ["怨", "呪", "闇", "絞"] },
  冥: { countdown: ["三", "二", "一", "冥"], normal: ["鎌", "斬", "呪", "闇"] },
  闇: { countdown: ["闇", "呪", "潰"], normal: ["奪", "冷", "怨", "斬"] },
  鬱: { countdown: ["塞", "闇", "潰"], normal: ["呪", "怨", "縛", "溺"] },

  // Depth 11 (Kanken Jun-1)
  狼: { normal: ["牙", "噛", "爪", "吠"] },
  狐: { normal: ["焔", "幻", "嘘", "惑"] },
  豹: { normal: ["爪", "噛", "閃", "襲"] },
  猪: { normal: ["突", "牙", "轟", "潰"] },
  鰐: { normal: ["噛", "呑", "水", "潜"] },
  鮫: { normal: ["血", "噛", "渦", "裂"] },
  鷲: { normal: ["爪", "穿", "閃", "空"] },
  獅: { normal: ["吠", "噛", "爪", "轟"] },
  屍: { normal: ["噛", "喰", "毒", "腐"] },
  兇: { normal: ["薙", "斧", "槍", "屠"] },
  龍: { countdown: ["覗", "焔", "呑"], normal: ["轟", "雷", "噛", "喰"] },
  鳳: { countdown: ["閃", "焔", "焚"], normal: ["火", "嵐", "穿", "薙"] },
  鷹: { countdown: ["覗", "閃", "穿"], normal: ["爪", "空", "裂", "襲"] },

  // Depth 12 (Kanken 1)
  巫: { normal: ["咒", "祟", "詛", "蠱"] },
  蟲: { normal: ["蠱", "毒", "噬", "蝕"] },
  蠱: { normal: ["蠱", "詛", "祟", "毒"] },
  魑: { normal: ["睨", "咆", "抉", "祟"] },
  魍: { normal: ["溺", "呪", "噬", "闇"] },
  魃: { normal: ["焔", "焚", "渇", "詛"] },
  蛟: { normal: ["渦", "呑", "噬", "雷"] },
  蝮: { normal: ["毒", "噛", "噬", "潜"] },
  傀儡: { countdown: ["糸", "縛", "殲"], normal: ["操", "刺", "斬", "抉"] },
  髑髏: { countdown: ["咒", "祟", "殲"], normal: ["噬", "骨", "詛", "抉"] },
  饕餮: { countdown: ["睨", "咆", "呑"], normal: ["噬", "喰", "抉", "蹂"] }
};

/* Classify what kind of threat an intent kanji represents for rules.js & GM */
const LETHAL_INTENTS = new Set(["落", "滅", "殲", "爆", "砲", "呑", "噬", "抉", "蹂", "処", "刑", "死", "殺", "断", "絶", "潰", "砕", "冥"]);
const EVADE_DEFEND_INTENTS = new Set(["目", "見", "固", "守", "避", "潜", "防", "隠", "霧", "幻", "映", "反", "錮", "盾"]);
const CURSE_DEBUFF_INTENTS = new Set(["毒", "呪", "祟", "詛", "縛", "絞", "惑", "病", "迷", "怨", "糸", "封", "縄"]);
const ESCAPE_INTENTS = new Set(["出", "走", "帰", "去", "速", "飛", "散", "往", "退", "裏", "逃", "避", "潜", "匿", "逸", "奔", "隙", "踪", "遁", "馳", "逍"]);

/* Events that "event:*" can roll (rest is reserved for 寺/shrines, quiz and forge are included!). */
const RANDOM_EVENT_POOL = ["quiz", "forge", "swarm", "dice", "mirror", "lantern", "shrine", "well", "corpse", "flower"];

/* Run shape: 9 steps. */
const PATH_STEPS = 9;
const FORK_WIDTH = 3;

/* Icons shown when a fork's outcome is revealed. */
const OUTCOME_ICONS = { battle: "⚔", elite: "💀", treasure: "🎁", event: "❔", rest: "🕯" };
