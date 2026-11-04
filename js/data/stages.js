/*
 * Stage signs and per-depth stage pools.
 * Each depth features stages drawn from its Kanken grade's place/environment kanji.
 * Entering a stage supplies `stageCards` (thematic environment cards + lower-grade fundamentals
 * + local pool clutter) that merge with the player's bag (`state.deck`) for that battle.
 */

const STG_L = (EN, KO, JA, ZH_CN = EN, ZH_TW = JA) => ({ EN, KO, JA, ZH_CN, ZH_TW });

const STAGE_SIGNS = {
  /* ---- Common / Classic Signs ---- */
  道: {
    omen: STG_L("a beaten path", "다져진 길", "踏み固められた道", "踩实的路", "踩實的路"),
    cards: ["土", "石", "風", "足", "車", "人", "木", "草"],
    foes: ["犬", "車", "人", "馬", "兵"],
    outcomes: [["battle", 70], ["event:*", 30]]
  },
  山: {
    omen: STG_L("steep crags and timber", "험준한 바위산", "険しい岩山", "险峻岩山", "險峻岩山"),
    cards: ["石", "木", "火", "風", "土", "山", "空", "雨", "草"],
    foes: ["石", "山", "犬", "熊", "鹿", "岩"],
    outcomes: [["battle", 50], ["elite", 35], ["treasure", 15]],
    risky: true
  },
  川: {
    omen: STG_L("rushing dark water", "검게 흐르는 강가", "黒く流れる川辺", "黑水河畔", "黑水河畔"),
    cards: ["水", "石", "雨", "貝", "青", "竹", "糸", "風", "草"],
    foes: ["虫", "魚", "水", "波", "氷"],
    outcomes: [["battle", 65], ["event:well", 20], ["event:*", 15]]
  },
  森: {
    omen: STG_L("tangled ancient woods", "울창한 고목의 숲", "鬱蒼たる森", "幽暗森林", "幽暗森林"),
    cards: ["木", "林", "草", "火", "虫", "花", "雨", "風", "竹"],
    foes: ["森", "虫", "犬", "熊", "鹿"],
    outcomes: [["battle", 60], ["event:flower", 25], ["elite", 15]]
  },
  林: {
    omen: STG_L("whispering thicket", "바람 스치는 수풀", "ざわめく林", "低语树林", "低語樹林"),
    cards: ["木", "草", "竹", "花", "火", "風", "土", "虫", "石"],
    foes: ["虫", "森", "犬", "鳥"],
    outcomes: [["battle", 65], ["event:quiz", 20], ["event:*", 15]]
  },
  田: {
    omen: STG_L("abandoned paddies", "버려진 논밭", "荒れ果てた田", "荒芜农田", "荒蕪農田"),
    cards: ["土", "水", "草", "虫", "石", "雨", "日", "車", "竹"],
    foes: ["虫", "犬", "석" in {} ? "石" : "人", "車"],
    outcomes: [["battle", 65], ["event:quiz", 20], ["event:*", 15]]
  },
  村: {
    omen: STG_L("empty village ruins", "인적 끊긴 폐촌", "人影なき廃村", "荒废村落", "荒廢村落"),
    cards: ["火", "木", "土", "車", "糸", "금" in {} ? "金" : "石", "犬", "人", "字"],
    foes: ["犬", "人", "車", "火"],
    outcomes: [["battle", 55], ["event:*", 30], ["treasure", 15]]
  },
  町: {
    omen: STG_L("silent town streets", "적막한 읍내 골목", "静まり返った町", "死寂街町", "死寂街町"),
    cards: ["石", "火", "金", "車", "人", "手", "足", "円", "百"],
    foes: ["人", "車", "犬", "火"],
    outcomes: [["battle", 60], ["event:quiz", 20], ["treasure", 20]]
  },
  校: {
    omen: STG_L("charred schoolhouse", "종소리 멈춘 폐교", "鐘の止まった廃校", "荒废学堂", "荒廢學堂"),
    cards: ["本", "文", "字", "学", "音", "休", "火", "木", "一", "二", "三"],
    foes: ["先", "人", "虫", "火"],
    outcomes: [["battle", 55], ["elite", 25], ["event:quiz", 20]],
    risky: true
  },

  /* ---- Depth 2 (Kanken 9) ---- */
  海: {
    omen: STG_L("pitch-black sea", "칠흑 같은 바다", "漆黒の海", "漆黑之海", "漆黑之海"),
    cards: ["水", "風", "魚", "船", "雨", "雲", "貝", "石", "夜"],
    foes: ["魚", "風", "雲", "電", "夜"],
    outcomes: [["battle", 60], ["elite", 25], ["event:*", 15]],
    risky: true
  },
  池: {
    omen: STG_L("stagnant dark pond", "검게 고인 연못", "澱んだ古池", "死水池塘", "死水池塘"),
    cards: ["水", "魚", "雨", "石", "草", "木", "丸", "弱", "夜"],
    foes: ["魚", "鳥", "牛", "雪"],
    outcomes: [["battle", 60], ["event:well", 25], ["event:quiz", 15]]
  },
  谷: {
    omen: STG_L("howling wind gorge", "칼바람 부는 계곡", "風唸る谷", "呼啸风谷", "呼嘯風谷"),
    cards: ["風", "岩", "石", "弓", "矢", "木", "雲", "雪", "高"],
    foes: ["風", "岩", "鳥", "雪", "電"],
    outcomes: [["battle", 55], ["elite", 30], ["treasure", 15]],
    risky: true
  },
  野: {
    omen: STG_L("windswept plains", "황량한 들판", "吹きっ晒しの野", "荒野平原", "荒野平原"),
    cards: ["草", "風", "土", "火", "馬", "牛", "弓", "矢", "走"],
    foes: ["馬", "牛", "鳥", "風"],
    outcomes: [["battle", 70], ["event:*", 30]]
  },
  寺: {
    omen: STG_L("incense and cold ash", "향 연기 남은 고찰", "香の煙る古寺", "残香古寺", "殘香古寺"),
    cards: ["火", "心", "光", "声", "言", "書", "紙", "茶", "木"],
    foes: ["夜", "黒", "刀", "神", "仏"],
    outcomes: [["event:rest", 70], ["event:shrine", 30]]
  },
  社: {
    omen: STG_L("mossy wayside shrine", "이끼 낀 신사", "苔むした社", "荒芜神社", "荒蕪神社"),
    cards: ["木", "石", "火", "光", "心", "紙", "刀", "夜", "星"],
    foes: ["夜", "刀", "黒", "鳥"],
    outcomes: [["event:shrine", 45], ["battle", 40], ["event:quiz", 15]]
  },
  市: {
    omen: STG_L("abandoned market", "버려진 저잣거리", "捨てられた市", "荒废集市", "荒廢集市"),
    cards: ["肉", "米", "麦", "茶", "刀", "金", "火", "紙", "점" in {} ? "店" : "売"],
    foes: ["馬", "牛", "刀", "黒"],
    outcomes: [["battle", 50], ["treasure", 30], ["event:quiz", 20]]
  },
  室: {
    omen: STG_L("sealed stone chamber", "봉인된 밀실", "封じられた室", "封闭密室", "封閉密室"),
    cards: ["石", "戸", "刀", "火", "黒", "夜", "光", "紙", "糸"],
    foes: ["刀", "黒", "夜", "岩"],
    outcomes: [["elite", 45], ["treasure", 35], ["battle", 20]],
    risky: true
  },

  /* ---- Depth 3 (Kanken 8) ---- */
  湖: {
    omen: STG_L("blood-tinted lake", "핏빛으로 물든 호수", "血に染まる湖", "血色湖泊", "血色湖泊"),
    cards: ["水", "血", "氷", "波", "深", "流", "寒", "魚", "石"],
    foes: ["血", "氷", "波", "死"],
    outcomes: [["battle", 60], ["elite", 25], ["event:well", 15]],
    risky: true
  },
  港: {
    omen: STG_L("fog-choked harbor", "안개 낀 폐항구", "霧に沈む港", "迷雾废港", "迷霧廢港"),
    cards: ["水", "波", "船", "鉄", "荷", "箱", "油", "火", "風"],
    foes: ["波", "鉄", "酒", "氷"],
    outcomes: [["battle", 65], ["treasure", 20], ["event:*", 15]]
  },
  島: {
    omen: STG_L("isolated isle of bones", "고립된 외딴섬", "孤立した島", "孤立荒岛", "孤立荒島"),
    cards: ["水", "波", "石", "木", "火", "氷", "風", "鳥", "薬"],
    foes: ["波", "氷", "悪", "神", "死"],
    outcomes: [["elite", 45], ["battle", 40], ["treasure", 15]],
    risky: true
  },
  坂: {
    omen: STG_L("muddy uphill slope", "진흙탕 오르막길", "ぬかるむ坂", "泥泞坡道", "泥濘坡道"),
    cards: ["土", "石", "重", "落", "転", "足", "風", "雨", "木"],
    foes: ["鉄", "銀", "血", "병" in {} ? "病" : "波"],
    outcomes: [["battle", 70], ["event:quiz", 15], ["event:*", 15]]
  },
  畑: {
    omen: STG_L("scorched dry field", "검게 탄 화전(畑)", "焼け焦げた畑", "焦黑旱田", "焦黑旱田"),
    cards: ["火", "土", "炭", "油", "豆", "葉", "根", "수" in {} ? "水" : "草", "放"],
    foes: ["血", "病", "酒", "鉄"],
    outcomes: [["battle", 65], ["event:flower", 20], ["event:quiz", 15]]
  },
  屋: {
    omen: STG_L("creaking blood-stained house", "삐걱이는 폐옥", "軋む廃屋", "吱呀废屋", "吱呀廢屋"),
    cards: ["木", "火", "油", "炭", "血", "皿", "箱", "柱", "板"],
    foes: ["血", "病", "酒", "悪", "主"],
    outcomes: [["battle", 55], ["elite", 25], ["event:*", 20]]
  },
  院: {
    omen: STG_L("plague infirmary", "역병 도는 폐병동", "疫病の廃院", "疫病废院", "疫病廢院"),
    cards: ["血", "病", "薬", "医", "湯", "酒", "火", "水", "身", "皮", "歯"],
    foes: ["病", "血", "死", "悪", "皮"],
    outcomes: [["battle", 55], ["elite", 25], ["event:quiz", 20]],
    risky: true
  },
  庫: {
    omen: STG_L("rusted armory vault", "녹슨 철창고", "錆びた武器庫", "锈蚀武库", "鏽蝕武庫"),
    cards: ["鉄", "銀", "油", "炭", "火", "刀", "箱", "荷", "具", "打", "投"],
    foes: ["鉄", "銀", "悪", "主"],
    outcomes: [["treasure", 45], ["battle", 40], ["elite", 15]]
  },

  /* ---- Depth 4 (Kanken 7: Prefectures & Old Battlefield) ---- */
  茨: {
    omen: STG_L("Ibaraki briar wasteland", "가시나무 들판 (이바라키)", "茨の荒野 (いばらき)", "荆棘荒原", "荊棘荒原"),
    cards: ["茨", "木", "草", "火", "焼", "松", "芽", "縄", "風", "課", "郡"],
    foes: ["茨", "熊", "鹿", "焼", "兵"],
    outcomes: [["battle", 55], ["event:quiz", 25], ["event:flower", 20]]
  },
  潟: {
    omen: STG_L("Niigata black mudflats", "검은 개펄과 석호 (니가타)", "黒い干潟 (にいがた)", "黑泥泻湖", "黑泥潟湖"),
    cards: ["潟", "水", "塩", "浅", "冷", "漁", "氷", "泥" in {} ? "泥" : "土", "石", "埼", "県"],
    foes: ["兵", "熊", "械", "官"],
    outcomes: [["battle", 55], ["event:quiz", 25], ["event:well", 20]]
  },
  栃: {
    omen: STG_L("Tochigi horse-chestnut woods", "상수리 고목림 (토치기)", "栃の古木林 (とちぎ)", "七叶树林", "七葉樹林"),
    cards: ["栃", "木", "松", "梅", "梨", "巣", "材", "火", "焼", "風", "阜"],
    foes: ["熊", "鹿", "茨", "焼"],
    outcomes: [["battle", 60], ["event:quiz", 20], ["elite", 20]]
  },
  阪: {
    omen: STG_L("Osaka blood-soaked embankment", "피로 물든 비탈길 (오사카)", "血塗られた阪 (おおさか)", "染血坡道", "染血坡道"),
    cards: ["阪", "石", "土", "兵", "戦", "刀", "火", "熱", "旗", "輪", "府"],
    foes: ["兵", "戦", "官", "軍"],
    outcomes: [["battle", 55], ["elite", 30], ["event:quiz", 15]],
    risky: true
  },
  岐: {
    omen: STG_L("Gifu mountain crossroads", "험한 갈림 산길 (기후)", "険しき岐路 (ぎふ)", "险峻岐路", "險峻岐路"),
    cards: ["岐", "山", "石", "木", "風", "縄", "灯", "鏡", "刀", "媛", "奈"],
    foes: ["鹿", "熊", "兵", "鏡"],
    outcomes: [["battle", 50], ["event:quiz", 30], ["event:*", 20]]
  },
  城: {
    omen: STG_L("sieged fortress ruins", "불타는 고성(古城)", "燃える古城", "燃烧古城", "燃燒古城"),
    cards: ["城", "石", "火", "焼", "兵", "軍", "戦", "械", "刀", "鉄", "旗"],
    foes: ["兵", "械", "城", "戦", "軍"],
    outcomes: [["elite", 50], ["battle", 35], ["treasure", 15]],
    risky: true
  },
  街: {
    omen: STG_L("ruined garrison street", "폐허가 된 병영 거리", "廃墟の街", "废墟街道", "廢墟街道"),
    cards: ["街", "火", "灯", "鏡", "器", "衣", "飯", "塩", "鉄", "票", "省"],
    foes: ["兵", "械", "官", "焼"],
    outcomes: [["battle", 55], ["treasure", 25], ["event:quiz", 20]]
  },

  /* ---- Depth 5 (Kanken 6: Sinners' Mound) ---- */
  墓: {
    omen: STG_L("freshly dug graves", "죄인들의 무덤가", "罪人の墓場", "罪人墓地", "罪人墓地"),
    cards: ["墓", "土", "石", "死", "血", "毒", "骨" in {} ? "骨" : "火", "殺", "破", "迷"],
    foes: ["墓", "毒", "殺", "罪", "災"],
    outcomes: [["battle", 50], ["event:corpse", 35], ["elite", 15]],
    risky: true
  },
  堂: {
    omen: STG_L("heretic ritual hall", "이단의 법당", "異端の堂", "异端佛堂", "異端佛堂"),
    cards: ["仏", "火", "燃", "夢", "術", "像", "布", "香" in {} ? "香" : "光", "罪", "謝"],
    foes: ["迷", "罪", "仏", "師"],
    outcomes: [["event:rest", 55], ["event:shrine", 25], ["battle", 20]]
  },
  河: {
    omen: STG_L("river of acid and ash", "잿빛 강물", "灰色の河", "灰暗大河", "灰暗大河"),
    cards: ["水", "液", "酸", "毒", "河", "氷", "石", "風", "航"],
    foes: ["毒", "暴", "破", "災"],
    outcomes: [["battle", 65], ["event:well", 20], ["event:quiz", 15]]
  },
  鉱: {
    omen: STG_L("collapsed toxic mine", "독가스가 새는 폐광", "毒ガスの廃鉱", "毒气废矿", "毒氣廢礦"),
    cards: ["鉱", "銅", "鉄", "石", "火", "燃", "破", "圧", "粉", "酸"],
    foes: ["破", "毒", "武", "暴"],
    outcomes: [["battle", 55], ["treasure", 30], ["elite", 15]]
  },
  境: {
    omen: STG_L("border of the living", "생사의 경계선", "生死の境", "生死边界", "生死邊界"),
    cards: ["境", "迷", "夢", "逆", "殺", "武", "術", "防", "護", "刀"],
    foes: ["武", "迷", "殺", "罪", "師"],
    outcomes: [["elite", 45], ["battle", 40], ["event:quiz", 15]],
    risky: true
  },

  /* ---- Depth 6 (Kanken 5: Hall of Bones) ---- */
  蔵: {
    omen: STG_L("locked ossuary vault", "잠긴 백골 비고", "閉ざされた骨蔵", "上锁骨藏", "上鎖骨藏"),
    cards: ["骨", "臓", "血", "鉄", "鋼", "宝", "銭", "권" in {} ? "権" : "刀", "火", "灰"],
    foes: ["骨", "臓", "敵", "皇"],
    outcomes: [["treasure", 55], ["battle", 30], ["elite", 15]]
  },
  穴: {
    omen: STG_L("bottomless bone pit", "해골이 쌓인 굴", "白骨の穴", "白骨洞穴", "白骨洞穴"),
    cards: ["穴", "骨", "脳", "傷", "痛", "石", "土", "흡" in {} ? "吸" : "血", "針", "暗"],
    foes: ["骨", "脳", "傷", "亡"],
    outcomes: [["battle", 60], ["event:corpse", 25], ["elite", 15]],
    risky: true
  },
  泉: {
    omen: STG_L("steaming blood spring", "김이 피어오르는 피의 샘", "湯気立つ血の泉", "沸血之泉", "沸血之泉"),
    cards: ["水", "泉", "蒸", "潮", "血", "洗", "氷", "액" in {} ? "液" : "火", "紅"],
    foes: ["傷", "臓", "乱", "聖"],
    outcomes: [["event:well", 45], ["battle", 40], ["event:rest", 15]]
  },
  砂: {
    omen: STG_L("ashen bone desert", "뼛가루 날리는 사막", "骨灰の砂漠", "骨灰沙漠", "骨灰沙漠"),
    cards: ["砂", "灰", "干", "風", "火", "骨", "石", "射", "棒", "열" in {} ? "熱" : "日"],
    foes: ["骨", "乱", "亡", "将"],
    outcomes: [["battle", 65], ["event:quiz", 20], ["elite", 15]]
  },
  樹: {
    omen: STG_L("flesh-bearing great tree", "살점이 열린 거목", "肉実る大樹", "血肉巨树", "血肉巨樹"),
    cards: ["樹", "木", "紅", "血", "臓", "脳", "舌", "枝", "火", "針", "卵"],
    foes: ["脳", "臓", "傷", "異"],
    outcomes: [["battle", 55], ["event:flower", 25], ["elite", 20]]
  },
  閣: {
    omen: STG_L("imperial bone pavilion", "백골의 누각", "白骨の閣", "白骨楼阁", "白骨樓閣"),
    cards: ["皇", "聖", "将", "鋼", "刀", "射", "刻", "磁", "鏡", "火"],
    foes: ["敵", "将", "聖", "皇"],
    outcomes: [["elite", 50], ["battle", 35], ["treasure", 15]],
    risky: true
  },

  /* ---- Depth 7 (Kanken 4: Valley of Wailing) ---- */
  殿: {
    omen: STG_L("echoing demon hall", "곡성이 울리는 전당", "鬼哭の殿", "鬼哭大殿", "鬼哭大殿"),
    cards: ["剣", "撃", "突", "刺", "盾", "矛", "鎖", "火", "血", "鬼"],
    foes: ["剣", "刺", "鎖", "巨", "鬼"],
    outcomes: [["elite", 50], ["battle", 40], ["treasure", 10]],
    risky: true
  },
  塔: {
    omen: STG_L("lightning-struck spire", "벼락 치는 첨탑", "雷落ちる塔", "雷击高塔", "雷擊高塔"),
    cards: ["雷", "爆", "砲", "弾", "煙", "風", "火", "鉄", "剣", "撃"],
    foes: ["爆", "砲", "雷", "狂"],
    outcomes: [["battle", 55], ["elite", 30], ["event:quiz", 15]],
    risky: true
  },
  沼: {
    omen: STG_L("rotting poison swamp", "썩어가는 독늪", "腐敗の沼", "腐败毒沼", "腐敗毒沼"),
    cards: ["沼", "水", "腐", "毒", "霧", "煙", "泥" in {} ? "泥" : "土", "沈", "獣", "爪" in {} ? "爪" : "刺"],
    foes: ["獣", "刺", "狂", "鬼"],
    outcomes: [["battle", 60], ["event:well", 20], ["event:*", 20]]
  },
  峰: {
    omen: STG_L("jagged beast peak", "짐승 울부짖는 봉우리", "獣咆える峰", "群兽险峰", "群獸險峰"),
    cards: ["石", "岩", "風", "雷", "獣", "襲", "駆", "跳", "剣", "火"],
    foes: ["獣", "巨", "狂", "雷"],
    outcomes: [["battle", 60], ["elite", 25], ["event:*", 15]]
  },
  陣: {
    omen: STG_L("abandoned siege camp", "피로 그려진 진영", "血の陣営", "血之阵营", "血之陣營"),
    cards: ["剣", "矛", "盾", "砲", "弾", "爆", "鎖", "火", "薪", "攻"],
    foes: ["剣", "爆", "砲", "鎖", "巨"],
    outcomes: [["battle", 55], ["treasure", 25], ["elite", 20]]
  },

  /* ---- Depth 8 (Kanken 3: Demon Wilds) ---- */
  獄: {
    omen: STG_L("iron torture gaol", "절규하는 지하 감옥", "絶叫の牢獄", "绝叫牢狱", "絕叫牢獄"),
    cards: ["獄", "縛", "絞", "鎖", "鉄", "刑", "炎", "血", "魂", "奪"],
    foes: ["縛", "賊", "邪", "獄", "魔"],
    outcomes: [["elite", 50], ["battle", 40], ["event:quiz", 10]],
    risky: true
  },
  炉: {
    omen: STG_L("hellfire smelting furnace", "영혼을 녹이는 용광로", "魂溶かす炉", "炼魂熔炉", "煉魂熔爐"),
    cards: ["炎", "火", "焦", "鍛", "鋳", "鉄", "煙", "滅", "爆", "塊"],
    foes: ["炎", "怪", "侍", "魔"],
    outcomes: [["battle", 55], ["treasure", 25], ["elite", 20]]
  },
  壇: {
    omen: STG_L("sacrificial blood altar", "산제물의 제단", "生贄の祭壇", "活祭祭坛", "活祭祭壇"),
    cards: ["霊", "魂", "邪", "呪" in {} ? "呪" : "祈", "血", "炎", "犠", "牲", "封", "鐘"],
    foes: ["霊", "邪", "魂", "幽", "帝"],
    outcomes: [["event:shrine", 40], ["battle", 40], ["elite", 20]]
  },
  墳: {
    omen: STG_L("ancient imperial barrow", "도굴된 고분", "暴かれた古墳", "被盗古坟", "被盜古墳"),
    cards: ["葬", "埋", "魂", "霊", "幽", "骨", "土", "石", "凍", "幻"],
    foes: ["霊", "幽", "怪", "侍", "帝"],
    outcomes: [["battle", 55], ["event:corpse", 30], ["treasure", 15]]
  },
  峡: {
    omen: STG_L("phantom-haunted gorge", "원귀가 떠도는 협곡", "亡霊の峡谷", "亡灵峡谷", "亡靈峽谷"),
    cards: ["風", "凍", "零", "氷", "崩", "裂", "岩", "貫", "殴", "幻"],
    foes: ["怪", "賊", "侍", "魔"],
    outcomes: [["battle", 65], ["event:*", 20], ["elite", 15]]
  },

  /* ---- Depth 9 (Kanken 2.5: Road of Tyrants) ---- */
  洞: {
    omen: STG_L("wyrm's cavern", "화룡이 잠든 동굴", "竜眠る洞", "恶龙洞窟", "惡龍洞窟"),
    cards: ["竜", "火", "炎", "岩", "砕", "剛", "珠", "硝", "硫", "煙"],
    foes: ["竜", "蛇", "猿", "覇"],
    outcomes: [["elite", 50], ["battle", 35], ["treasure", 15]],
    risky: true
  },
  廃: {
    omen: STG_L("blighted ruin sector", "역병 도는 폐허", "疫病の廃墟", "疫病废墟", "疫病廢墟"),
    cards: ["廃", "銃", "刃", "硝", "鉄", "泥", "疫", "菌", "毒", "火"],
    foes: ["忍", "銃", "刃", "猫", "囚"],
    outcomes: [["battle", 60], ["event:quiz", 20], ["event:*", 20]]
  },
  塚: {
    omen: STG_L("mound of executed blades", "처형당한 칼들의 무덤", "処刑刀の塚", "刑刀之冢", "刑刀之塚"),
    cards: ["刃", "刀", "剣", "棺", "弔", "骨", "血", "漆", "縛", "拷"],
    foes: ["刃", "棺", "忍", "囚", "帥"],
    outcomes: [["battle", 55], ["event:corpse", 25], ["elite", 20]]
  },
  堀: {
    omen: STG_L("black moat of warships", "철갑선이 가라앉은 해자", "鉄艦沈む堀", "沉舰护城河", "沉艦護城河"),
    cards: ["水", "渦", "泥", "泡", "銃", "艦", "鉄", "氷", "雷", "津"],
    foes: ["蛇", "艦", "銃", "竜"],
    outcomes: [["battle", 60], ["elite", 25], ["treasure", 15]]
  },
  窯: {
    omen: STG_L("ash-choked kiln", "인골을 굽는 가마", "人骨を焼く窯", "焚骨窑炉", "焚骨窯爐"),
    cards: ["火", "炎", "沸", "融", "硝", "硫", "灰", "炭", "瓶", "癒"],
    foes: ["猫", "猿", "棺", "忍"],
    outcomes: [["event:rest", 45], ["battle", 40], ["event:quiz", 15]]
  },

  /* ---- Depth 10 (Kanken 2: The Underworld) ---- */
  闇: {
    omen: STG_L("lightless abyssal dark", "빛 한 줄기 없는 칠흑", "光なき闇", "无光之暗", "無光之闇"),
    cards: ["闇", "呪", "斬", "妖", "怨", "冥", "火", "光", "血", "刃"],
    foes: ["呪", "妖", "怨", "闇", "冥"],
    outcomes: [["battle", 45], ["elite", 35], ["event:*", 20]],
    risky: true
  },
  窟: {
    omen: STG_L("den of fangs and claws", "어금니와 발톱의 마굴", "牙と爪の魔窟", "牙爪魔窟", "牙爪魔窟"),
    cards: ["牙", "爪", "虎", "拳", "蹴", "潰", "骨", "骸", "血", "肉"],
    foes: ["虎", "牙", "骸", "妖", "蜂"],
    outcomes: [["battle", 60], ["elite", 25], ["event:corpse", 15]]
  },
  崖: {
    omen: STG_L("storm-lashed cliff", "폭풍 몰아치는 절벽", "嵐吹き荒れる崖", "风暴断崖", "風暴斷崖"),
    cards: ["嵐", "風", "雷", "崖", "石", "蹴", "落", "鎌", "斬", "氷"],
    foes: ["嵐", "鎌", "斬", "虎"],
    outcomes: [["battle", 55], ["elite", 30], ["event:quiz", 15]],
    risky: true
  },
  冥: {
    omen: STG_L("threshold of the dead", "저승의 문턱", "冥府の敷居", "冥府门槛", "冥府門檻"),
    cards: ["冥", "呪", "怨", "骸", "死", "魂", "鎌", "闇", "炎", "氷"],
    foes: ["骸", "鎌", "怨", "呪", "冥"],
    outcomes: [["elite", 50], ["battle", 35], ["event:shrine", 15]],
    risky: true
  },
  釜: {
    omen: STG_L("boiling hell cauldron", "죄인을 삶는 가마솥", "罪人煮る地獄釜", "烹罪地狱釜", "烹罪地獄釜"),
    cards: ["釜", "火", "炎", "煎", "湯", "水", "油", "血", "毒", "蜜"],
    foes: ["妖", "呪", "蜂", "骸"],
    outcomes: [["battle", 55], ["event:rest", 25], ["event:quiz", 20]]
  },

  /* ---- Depth 11 (Kanken Jun-1: Beast King's Tomb) ---- */
  牢: {
    omen: STG_L("blood-soaked beast cage", "맹수들의 피투성이 뇌옥", "獣の血牢", "猛兽血牢", "猛獸血牢"),
    cards: ["牢", "槍", "斧", "鎧", "薙", "鎖", "鉄", "血", "火", "肉"],
    foes: ["狼", "豹", "猪", "兇", "鎧"],
    outcomes: [["battle", 55], ["elite", 30], ["treasure", 15]],
    risky: true
  },
  砦: {
    omen: STG_L("dragonfire bastion", "화염에 휩싸인 요새", "劫火の砦", "劫火壁垒", "劫火砦壘"),
    cards: ["焔", "火", "炎", "槍", "斧", "鎧", "薙", "轟", "閃", "石"],
    foes: ["鷲", "狼", "焔", "兇", "龍"],
    outcomes: [["elite", 50], ["battle", 35], ["event:quiz", 15]],
    risky: true
  },
  祠: {
    omen: STG_L("hungry beast shrine", "살점을 탐하는 사당", "肉を喰らう祠", "噬肉古祠", "噬肉古祠"),
    cards: ["屍", "呑", "噛", "喰", "血", "骨", "火", "呪", "狐", "杖"],
    foes: ["狐", "屍", "鰐", "鮫", "龍"],
    outcomes: [["event:shrine", 45], ["battle", 40], ["event:quiz", 15]]
  },
  洲: {
    omen: STG_L("blood-stained sandbar", "아귀들이 득실대는 물가", "顎門うごめく洲", "恶鳄沙洲", "惡鱷沙洲"),
    cards: ["水", "濡", "溢", "雫", "氷", "雷", "鰐", "鮫", "槍", "血"],
    foes: ["鰐", "鮫", "屍", "鷲"],
    outcomes: [["battle", 65], ["event:well", 20], ["elite", 15]]
  },

  /* ---- Depth 12 (Kanken 1: The Abyss 奈落) ---- */
  罠: {
    omen: STG_L("flesh-rending abyssal trap", "살가죽을 찢는 나락의 함정", "肉裂く奈落の罠", "裂肉深渊陷阱", "裂肉深淵陷阱"),
    cards: ["罠", "蟲", "蠱", "毒", "針", "斬", "血", "火", "焔", "礫"],
    foes: ["蟲", "蠱", "獰", "傀儡", "殲"],
    outcomes: [["battle", 50], ["elite", 35], ["event:quiz", 15]],
    risky: true
  },
  尸: {
    omen: STG_L("mountain of twitching corpses", "꿈틀거리는 시체 산", "蠢く尸の山", "蠢动尸山", "蠢動尸山"),
    cards: ["尸", "屍", "骨", "髑", "髏", "血", "巫", "咒", "祟", "火"],
    foes: ["巫", "祟", "詛", "髑髏", "饕餮"],
    outcomes: [["elite", 50], ["battle", 35], ["event:corpse", 15]],
    risky: true
  },
  峙: {
    omen: STG_L("monolith of the glutton god", "괴신이 도사린 절벽", "怪神聳える峙", "怪神耸立之巅", "怪神聳立之峙"),
    cards: ["礫", "石", "岩", "雷", "焔", "殲", "咆", "睨", "剣", "斬"],
    foes: ["獰", "詛", "傀儡", "殲", "饕餮"],
    outcomes: [["elite", 55], ["battle", 35], ["treasure", 10]],
    risky: true
  },
  澪: {
    omen: STG_L("vein of black venom", "검은 독혈이 흐르는 수맥", "黒毒流れる澪", "黑毒水脉", "黑毒水脈"),
    cards: ["水", "淹", "滲", "毒", "蠱", "蟲", "氷", "血", "咒", "巫"],
    foes: ["蟲", "蠱", "巫", "祟", "詛"],
    outcomes: [["battle", 55], ["event:quiz", 25], ["event:well", 20]]
  },

  /* ---- Mystery fallback ---- */
  謎: {
    omen: STG_L("something strange awaits", "정체불명의 기척", "得体の知れぬ気配", "诡异气息", "詭異氣息"),
    cards: ["火", "水", "木", "石", "風", "血", "刀", "心"],
    foes: [],
    outcomes: [["event:quiz", 45], ["event:*", 55]]
  }
};

/* Which stage signs appear in each depth so stages match the grade's kanji and theme! */
const DEPTH_STAGE_POOLS = {
  depth_1:  ["田", "村", "山", "川", "森", "林", "町", "校"],
  depth_2:  ["海", "池", "谷", "野", "寺", "社", "市", "室"],
  depth_3:  ["湖", "港", "島", "坂", "畑", "屋", "院", "庫"],
  depth_4:  ["茨", "潟", "栃", "阪", "岐", "城", "街", "山"],
  depth_5:  ["墓", "堂", "河", "鉱", "境", "寺", "謎"],
  depth_6:  ["蔵", "穴", "泉", "砂", "樹", "閣", "墓"],
  depth_7:  ["殿", "塔", "沼", "峰", "陣", "谷", "謎"],
  depth_8:  ["獄", "炉", "壇", "墳", "峡", "祠", "謎"],
  depth_9:  ["洞", "廃", "塚", "堀", "窯", "獄", "謎"],
  depth_10: ["闇", "窟", "崖", "冥", "釜", "塚", "謎"],
  depth_11: ["牢", "砦", "祠", "洲", "窟", "闇", "謎"],
  depth_12: ["罠", "尸", "峙", "澪", "冥", "牢", "謎"]
};

/*
 * Enemy Intent Kanji (Slay the Spire-style telegraphed moves via Kanji).
 * Instead of dealing 5 random pool cards to the enemy ("attacking with Village 村"),
 * the enemy displays 1-2 ominous Intent Kanji hinting at its upcoming move.
 */
const FOE_INTENT_PROFILES = {
  // Countdown / Exam / Doomsday bosses & foes
  先: { countdown: ["三", "二", "一", "落"], normal: ["問", "視", "指", "罰"] },
  死: { countdown: ["三", "二", "一", "滅"], normal: ["鎌", "冷", "奪", "闇"] },
  軍: { countdown: ["号", "斉", "撃"], normal: ["囲", "矢", "突", "砲"] },
  災: { countdown: ["兆", "燃", "滅"], normal: ["暴", "毒", "破", "圧"] },
  殲: { countdown: ["三", "二", "一", "殲"], normal: ["斬", "穿", "砕", "滅"] },
  饕餮: { countdown: ["睨", "咆", "呑"], normal: ["噬", "喰", "抉", "蹂"] },
  髑髏: { countdown: ["呪", "祟", "死"], normal: ["噛", "骨", "怨", "抉"] },
  傀儡: { countdown: ["糸", "縛", "断"], normal: ["操", "刺", "奇", "襲"] },

  // Beasts / Insects / Nature
  犬: { normal: ["咬", "足", "走", "鳴"] },
  虫: { normal: ["目", "毒", "群", "刺"] },
  森: { normal: ["木", "根", "縛", "休"] },
  馬: { normal: ["走", "足", "突", "蹴"] },
  牛: { normal: ["角", "突", "重", "踏"] },
  鳥: { normal: ["羽", "空", "目", "爪"] },
  魚: { normal: ["水", "泳", "波", "潜"] },
  熊: { normal: ["爪", "咬", "圧", "怒"] },
  鹿: { normal: ["角", "跳", "走", "숲" in {} ? "森" : "目"] },
  獣: { normal: ["襲", "爪", "咬", "狂"] },
  蛇: { normal: ["毒", "絞", "潜", "牙"] },
  猫: { normal: ["目", "爪", "奇", "避"] },
  猿: { normal: ["跳", "投", "奪", "嘲"] },
  虎: { normal: ["牙", "爪", "襲", "咆"] },
  狼: { normal: ["群", "噛", "疾", "爪"] },
  狐: { normal: ["幻", "惑", "火", "嘘"] },
  鷲: { normal: ["空", "爪", "急", "抉"] },
  豹: { normal: ["瞬", "爪", "噛", "襲"] },
  猪: { normal: ["突", "猛", "牙", "蹂"] },
  鰐: { normal: ["潜", "噛", "水", "呑"] },
  鮫: { normal: ["血", "噛", "渦", "裂"] },
  蟲: { normal: ["群", "毒", "喰", "蠢"] },
  蠱: { normal: ["毒", "呪", "蝕", "蠢"] },

  // Golems / Minerals / Constructs / Weapons
  石: { normal: ["足", "固", "落", "重"] },
  車: { normal: ["転", "突", "속" in {} ? "速" : "走", "圧"] },
  山: { normal: ["落", "重", "固", "圧"] },
  岩: { normal: ["固", "落", "砕", "重"] },
  刀: { normal: ["切", "斬", "閃", "刺"] },
  鉄: { normal: ["固", "重", "打", "圧"] },
  銀: { normal: ["光", "射", "冷", "切"] },
  械: { normal: ["돌" in {} ? "回" : "輪", "射", "圧", "固"] },
  城: { normal: ["固", "守", "矢", "落"] },
  鏡: { normal: ["映", "反", "光", "惑"] },
  剣: { normal: ["斬", "突", "閃", "撃"] },
  爆: { countdown: ["열" in {} ? "熱" : "火", "膨", "爆"], normal: ["火", "煙", "破"] },
  砲: { countdown: ["조" in {} ? "照" : "狙", "装", "砲"], normal: ["撃", "弾", "煙"] },
  鎖: { normal: ["縛", "絞", "引", "封"] },
  銃: { normal: ["狙", "撃", "弾", "貫"] },
  刃: { normal: ["斬", "刺", "裂", "血"] },
  艦: { normal: ["砲", "鉄", "波", "圧"] },
  鎌: { normal: ["斬", "刈", "首", "死"] },
  鎧: { normal: ["固", "防", "重", "撃"] }
};

/* Classify what kind of threat an intent kanji represents for rules.js & GM */
const LETHAL_INTENTS = new Set(["落", "滅", "殲", "爆", "砲", "呑", "噬", "抉", "蹂", "処", "刑", "死", "殺", "断"]);
const EVADE_DEFEND_INTENTS = new Set(["目", "固", "守", "避", "潜", "防", "隠", "霧", "幻", "映", "反"]);
const CURSE_DEBUFF_INTENTS = new Set(["毒", "呪", "祟", "詛", "縛", "絞", "惑", "病", "迷", "怨", "糸", "封"]);

/* Events that "event:*" can roll (rest is reserved for 寺/shrines, quiz is added!). */
const RANDOM_EVENT_POOL = ["quiz", "swarm", "dice", "mirror", "lantern", "shrine", "well", "corpse", "flower"];

/* Run shape: 9 steps. */
const PATH_STEPS = 9;
const FORK_WIDTH = 3;

/* Icons shown when a fork's outcome is revealed. */
const OUTCOME_ICONS = { battle: "⚔", elite: "💀", treasure: "🎁", event: "❔", rest: "🕯" };
