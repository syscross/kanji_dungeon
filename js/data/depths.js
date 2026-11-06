/*
 * The twelve gaols. kanken_data.json supplies each depth's kanji pool (kept 100% intact);
 * this file supplies each depth's name, readable gloss, narrative lore, and enemy/boss pools.
 *
 * Every enemy in `roster` is strictly selected from that depth's Kanken grade in kanken_data.json
 * and represents an entity, creature, person, spirit, or living horror (never pure tools/verbs like 刀 or 破,
 * which belong in cards and enemy intents).
 * Names are single kanji by default; a few compounds per deep gaol (狂鬼 邪霊 血傑 怨鬼 九尾狐 傀儡 髑髏 饕餮 魑魅魍魎)
 * are the exception that makes them uncanny — see GUIDELINE §4 before adding more.
 */

const DEPTHS = {
  depth_1: {
    name: "獄門",
    gloss: { EN: "The Prison Gate", KO: "지옥의 문턱", JA: "地獄の入口", ZH_CN: "地狱之门", ZH_TW: "地獄之門" },
    lore: {
      KO: "벼가 자라던 논밭과 아이들의 목소리가 울리던 배움터, 평화롭던 마을 어귀가 하룻밤 새 핏빛 안개에 잠겼다.\n가장 기초적인 사물의 이름조차 뒤틀린 변방에서, 주인을 잃고 굶주린 들짐승과 기괴하게 일어난 자연물들이 산 자의 숨결을 쫓아 배회한다.",
      EN: "Overnight, crimson mist swallowed the rice paddies, the quiet village streets, and the old schoolhouse.\nEven the simplest words have twisted here, as starving hounds, restless stones, and hollow-eyed wanderers prowl the fog in search of the living.",
      JA: "稲穂の揺れていた田も、子供の声が響いた学び舎も、穏やかだった村も、一夜にして血霧に沈んだ。\n最も基本的な言葉すら歪んだ辺境で、飢えた野犬や蠢く古木、虚空を彷徨う亡者が生者の息遣いを追っている。"
    },
    roster: {
      normal: ["犬", "虫", "人", "木", "石", "貝", "目", "九"],
      elite: ["森", "車"],
      boss: "王",
      bossPool: ["王", "天", "月"]
    }
  },
  depth_2: {
    name: "風穴",
    gloss: { EN: "The Wind Hollow", KO: "바람의 굴", JA: "風の洞", ZH_CN: "风之洞", ZH_TW: "風之洞" },
    lore: {
      KO: "마을을 덮친 재앙을 피해 가도를 따라 도망치던 발길이 끊긴 곳으로, 버려진 저잣거리와 칠흑 같은 바닷가 위로 살을 에듯 날카로운 칼바람이 분다.\n부서진 고찰과 신사 너머로 미쳐 날뛰는 짐승들과 눈보라의 원령들이 밤마다 깊은 골짜기에서 울부짖는다.",
      EN: "Along the beaten road toward the abandoned market and the pitch-black sea, howling blades of wind cut down all who fled.\nBeyond shattered temples and mossy shrines, maddened beasts and frost wraiths howl through the gorge every night.",
      JA: "災厄から逃れようと街道を走った足跡が途絶えた地。捨てられた市と漆黒の海に刃のような風が吹き荒れる。\n砕けた古寺や社の向こうで、狂い走る獣と吹雪の怨霊が夜ごとに谷で咆哮している。"
    },
    roster: {
      normal: ["馬", "牛", "鳥", "魚", "頭", "雪", "雲"],
      elite: ["岩", "黒"],
      boss: "電",
      bossPool: ["電", "夜", "星"]
    }
  },
  depth_3: {
    name: "血池",
    gloss: { EN: "The Blood Pond", KO: "피의 못", JA: "血の池", ZH_CN: "血池", ZH_TW: "血池" },
    lore: {
      KO: "원인 모를 역병이 항구와 외딴섬까지 번지자, 의원들은 병동을 걸어 잠그고 시신을 차가운 호수에 수장하기 시작했다.\n그러나 바닥에 고인 피와 얼어붙은 물결 속에서 죽음의 원념이 형체를 얻어 기어 나왔고, 버려진 폐옥마다 미쳐버린 그림자들이 도사린다.",
      EN: "When an unnamed plague swept the harbor and outer island, physicians bolted the infirmaries and sank the dead into the freezing lake.\nFrom that stagnant blood and black ice, deathly malice crawled ashore to haunt the creaking houses and rusted vaults.",
      JA: "得体の知れぬ疫病が港や孤島にまで広がり、医者たちは病棟を封鎖して骸を湖へと沈めた。\nだが澱んだ血と凍てつく氷の底から死の怨念が這い上がり、軋む廃屋には狂い果てた影が潜んでいる。"
    },
    roster: {
      normal: ["羊", "客", "医", "者", "氷", "病", "暗"],
      elite: ["血", "悪"],
      boss: "死",
      bossPool: ["死", "神", "主"]
    }
  },
  depth_4: {
    name: "古戦場",
    gloss: { EN: "The Old Battlefield", KO: "번국의 옛 싸움터", JA: "古き戦場", ZH_CN: "古战场", ZH_TW: "古戰場" },
    lore: {
      KO: "역병과 기근 끝에 각 지방의 번국들이 서로의 목을 겨누며 벌인 대전란의 흔적으로, 이바라키의 들판과 니가타의 검은 개펄부터 기후의 산길까지 거대한 무덤이 되었다.\n전쟁은 진작 끝났건만, 이름만 남은 옛 번국의 땅마다 자신이 죽은 줄도 모르는 망령의 군세가 여전히 진군 북을 울리고 있다.",
      EN: "In the wake of plague and famine, the provinces tore each other apart until briar wastes, black mudflats, and mountain passes became one vast grave.\nThough the war is long over, dead soldiers and phantom armies still march across the old domains.",
      JA: "疫病と飢饉の果てに諸藩が刃を交えた大戦乱の跡。茨の荒野から黒い干潟、険しい山道に至るまでが巨大な墓標と化した。\n戦はとうに終わったはずが、名ばかり残る古き藩の地では、己の死すら知らぬ亡霊の軍勢が今なお進軍の太鼓を鳴らしている。"
    },
    roster: {
      normal: ["熊", "鹿", "兵", "徒", "卒", "隊", "機"],
      elite: ["官", "臣"],
      boss: "軍",
      bossPool: ["軍", "司", "勇"]
    }
  },
  depth_5: {
    name: "罪人塚",
    gloss: { EN: "The Sinners' Mound", KO: "죄인의 무덤", JA: "罪人の塚", ZH_CN: "罪人冢", ZH_TW: "罪人塚" },
    lore: {
      KO: "전란의 패잔병과 대역죄인들을 산 채로 수장하고 파묻은 금단의 유배지다.\n독가스가 새어 나오는 폐광과 잿빛 강물 너머 이단의 법당에서는, 타락한 승려들이 원통하게 죽은 망령들을 일으켜 세우며 산 자와 죽은 자의 경계를 허물고 있다.",
      EN: "A forbidden penal ground where war criminals and heretics were buried alive after the great war.\nBeyond toxic collapsed mines and rivers of ash, fallen priests chant inside heretic halls, raising lost spirits to blur the border between life and death.",
      JA: "戦乱の落武者や大罪人が生き埋めにされた禁断の流刑地。\n毒ガスが漏れる廃鉱と灰色の河の向こう、異端の堂では堕ちた法師が迷える亡霊を操り、生死の境を塗り潰している。"
    },
    roster: {
      normal: ["士", "犯", "像", "象", "毒", "迷"],
      elite: ["武", "罪"],
      boss: "災",
      bossPool: ["災", "師", "仏"]
    }
  },
  depth_6: {
    name: "白骨殿",
    gloss: { EN: "The Hall of Bones", KO: "백골의 전당", JA: "白骨の殿", ZH_CN: "白骨殿", ZH_TW: "白骨殿" },
    lore: {
      KO: "인간이 살던 속세의 마지막 끝자락으로, 수만 구의 백골과 망자의 유해를 아교처럼 다져 쌓아 올린 거대한 지하 누각이다.\n뼛가루가 모래처럼 날리는 사막과 기괴한 거목 아래, 스스로를 제왕이라 칭하는 백골의 지배자들이 끓어오르는 피의 샘을 지키고 있다.",
      EN: "The final edge of the mortal world—a subterranean pavilion built from tens of thousands of bleached bones.\nBeneath flesh-bearing trees and deserts of bone-ash, skeletal rulers guard the locked ossuaries and boiling springs of blood.",
      JA: "人の世の果て。幾万もの白骨と亡者の骸を積み上げて築かれた巨大な地下楼閣。\n骨灰が砂のように舞う砂漠と大樹の下で、白骨の支配者たちが煮え立つ血の泉と骨蔵を守っている。"
    },
    roster: {
      normal: ["骨", "亡", "蚕", "衆", "従", "警"],
      elite: ["敵", "異"],
      boss: "皇",
      bossPool: ["皇", "将", "聖"]
    }
  },
  depth_7: {
    name: "鬼哭谷",
    gloss: { EN: "The Valley of Wailing", KO: "귀신이 우는 골짜기", JA: "鬼の哭く谷", ZH_CN: "鬼哭谷", ZH_TW: "鬼哭谷" },
    lore: {
      KO: "민간인이 휩쓸리던 변방은 끝나고, 마를 베기 위해 스스로 칼을 쥔 토벌대의 영역이 시작된다.\n인간의 목소리를 흉내 내는 식인귀와 흉포한 마수들이 벼락 치는 첨탑과 독늪에 도사리고 있어, 오직 귀신의 목을 베기로 맹세한 자만이 이 곡성 속으로 검을 뽑아 든다.",
      EN: "The mortal borderlands end here; beyond this line lies the domain of demon-slayers who draw steel by choice.\nMan-eating fiends and rabid beasts stalk the lightning-struck spires and poison swamps, waiting behind the blood-stained camps of fallen vanguards.",
      JA: "民草が巻き込まれた辺境はここで終わり、鬼を斬るために自ら刃を握った討伐隊の領域が始まる。\n人の声を真似る食人鬼と狂暴な魔獣が雷落ちる塔や腐敗の沼に巣食い、覚悟を決めた者だけがこの哭き声の谷へ踏み込める。"
    },
    roster: {
      normal: ["獣", "僧", "盗", "狩", "影", "凶"],
      elite: ["巨", "狂鬼"],
      boss: "鬼",
      bossPool: ["鬼", "雷", "雄"]
    }
  },
  depth_8: {
    name: "魔境",
    gloss: { EN: "The Demon Wilds", KO: "마의 경계", JA: "魔の境", ZH_CN: "魔境", ZH_TW: "魔境" },
    lore: {
      KO: "단련된 무사조차 홀로 들어섰다가 원귀에게 육신을 빼앗겨 돌아온다는 본격적인 마경이다.\n영혼을 녹여 요도를 벼리는 용광로와 산제물의 피가 마르지 않는 제단, 도굴된 고분과 지하 감옥이 어둠 속에서 산 자의 발걸음을 기다린다.",
      EN: "Even seasoned warriors who enter these Demon Wilds alone return as hollow vessels possessed by wraiths.\nSoul-smelting furnaces, sacrificial blood altars, desecrated barrows, and iron torture gaols await in the suffocating dark.",
      JA: "熟練の武人ですら単独で踏み込めば怨霊に肉体を乗っ取られて帰るという魔境。\n魂を溶かして妖刀を鍛える炉、生贄の血が乾かぬ祭壇、暴かれた古墳、絶叫の牢獄が闇に口を開けている。"
    },
    roster: {
      normal: ["霊", "怪", "賊", "偶", "猟", "蛮", "鯨"],
      elite: ["侍", "幽", "邪霊"],
      boss: "魔",
      bossPool: ["魔", "帝", "騎"]
    }
  },
  depth_9: {
    name: "覇道",
    gloss: { EN: "The Road of Tyrants", KO: "패왕의 길", JA: "覇者の道", ZH_CN: "霸道", ZH_TW: "霸道" },
    lore: {
      KO: "한 시대를 피로 호령하던 패왕과 대원수, 그리고 인간을 초월하려다 괴물이 된 이들이 패권을 다투는 수라장이다.\n처형당한 명검들이 꽂힌 칼무덤과 철갑선이 가라앉은 검은 해자, 화룡이 잠든 동굴을 돌파하려면 적의 살기를 읽고 정면으로 받아치는 경지에 이르러야 한다.",
      EN: "A carnage-strewn highway where blood-soaked tyrants, grand marshals, and twisted immortals clash for supremacy.\nTo cross the mound of executed blades, the warship-sunken moat, and the wyrm's cavern, you must read killing intent and counter it head-on.",
      JA: "一時代を血で統べた覇王や大元帥、人を超えようとして怪異に堕ちた者たちが覇権を争う修羅道。\n処刑刀の塚や鉄艦沈む堀、竜眠る洞を突破するには、敵の殺気を見切り真っ向から斬り伏せる境地が求められる。"
    },
    roster: {
      normal: ["猫", "蛇", "猿", "蚊", "忍", "偵", "曹"],
      elite: ["仙", "傑"],
      boss: "覇",
      bossPool: ["覇", "竜", "帥"]
    }
  },
  depth_10: {
    name: "冥府",
    gloss: { EN: "The Underworld", KO: "저승의 문턱", JA: "冥府", ZH_CN: "冥府", ZH_TW: "冥府" },
    lore: {
      KO: "인간의 언어와 상식이 닿을 수 있는 가장 깊고 어두운 극한의 경계다.\n빛 한 줄기 들지 않는 산기슭과 폭풍 치는 절벽 너머, 죄인을 삶는 지옥 가마솥이 끓어오르고 천 년 묵은 원념이 저승의 철책을 가로막는다.",
      EN: "The deepest limit where human language and common reason still hold sway.\nBeyond lightless foothills and storm-lashed cliffs, hell cauldrons boil and ancient grudges bar the palisade of the Underworld.",
      JA: "人の言葉と常識が届く最も深く暗い極限の境界。\n光なき山麓と嵐の断崖の向こうで地獄釜が煮え立ち、千年の怨念が冥府の柵を塞いでいる。"
    },
    roster: {
      normal: ["虎", "亀", "蜂", "鶴", "駒", "妖", "顎"],
      elite: ["骸", "怨"],
      boss: "冥",
      bossPool: ["冥", "闇", "鬱"]
    }
  },
  depth_11: {
    name: "獣王廟",
    gloss: { EN: "The Beast King's Tomb", KO: "짐승왕의 사당", JA: "獣王の廟", ZH_CN: "兽王庙", ZH_TW: "獸王廟" },
    lore: {
      KO: "저승의 문턱을 넘어선 시점에서 그대의 실력은 이미 증명되었으나, 이 봉인 너머는 인간 세상의 울타리 바깥에 버려진 흉수와 아귀들의 영역이다.\n사람의 말을 하는 존재조차 사라지고 오직 물어뜯고 삼키며 살점을 탐하는 고대의 맹수와 재앙 같은 거룡만이 피투성이 뇌옥을 배회한다.",
      EN: "Beyond the Underworld lies the forbidden realm outside human speech—a den of grotesque fiends and starving beasts.\nNothing human remains here: only ancient predators and calamity dragons prowling blood-soaked cages and shrines.",
      JA: "冥府を越えたこの封印の先は、人の世の枠外に棄てられた妖魔と餓鬼の領域だ。\n人語を解する存在すら消え失せ、ただ噛み砕き肉を喰らう凶獣と災厄の古龍だけが血塗られた牢や祠を徘徊している。"
    },
    abyssWarnTitle: {
      KO: "【경고 · 상용 외 금역】",
      EN: "【WARNING · FORBIDDEN REALM】",
      JA: "【警告 · 常用外禁域】"
    },
    abyssWarnDesc: {
      KO: "제10옥까지의 제패만으로도 그대는 이미 정점에 달한 실력자입니다.\n이 너머부터는 상식을 벗어난 흉수들이 스치는 일격마다 살점을 뜯어냅니다.\n\n굳이 이곳까지 발을 들이시겠습니까?",
      EN: "Conquering up to the 10th Gaol already marks you as a master.\nBeyond this seal, grotesque beasts outside the common lexicon tear flesh with every grazing blow.\n\nDo you truly insist on entering?",
      JA: "第十獄までの踏破で、お前の腕前はすでに達人の域にある。\nこの先は常用の理を外れた凶獣が掠めるだけで肉を喰いちぎる魔窟だ。\n\nそれでも本当に足を踏み入れるか？"
    },
    abyssConfirmBtn: {
      KO: "🩸 무시하고 입장",
      EN: "🩸 Enter anyway",
      JA: "🩸 無視して入獄"
    },
    roster: {
      normal: ["狼", "狐", "豹", "猪", "鰐", "鮫", "鷲", "獅"],
      elite: ["屍", "兇"],
      boss: "龍",
      bossPool: ["龍", "鳳", "鷹"]
    }
  },
  depth_12: {
    name: "奈落",
    gloss: { EN: "The Abyss", KO: "나락", JA: "奈落の底", ZH_CN: "无底深渊", ZH_TW: "無底深淵" },
    lore: {
      KO: "이 문 앞에 서서도 물러서지 않는 자는 영웅이 아니라, 살아 돌아갈 생각을 버린 광인뿐이다.\n인간은 읽을 수조차 없는 태고의 저주와 독충, 꿈틀거리는 시체 산과 검은 독수맥 위에서 산 자의 영혼까지 씹어 삼키는 이형의 괴신들이 득실거린다.",
      EN: "Anyone who stands before this gate and does not turn back is no hero—only a madman who has forsaken returning alive.\nUnreadable primordial curses, mountains of twitching corpses, and veins of black venom feed monstrous gods that devour your very soul.",
      JA: "この門の前に立ってなお退かぬ者は英雄ではなく、生きて帰ることを諦めた狂人だけだ。\n人には読めるはずもない太古の呪詛と蠢く尸の山、黒毒の水脈の上で、生者の魂まで喰らう異形の怪神がひしめいている。"
    },
    abyssWarnTitle: {
      KO: "【최종 경고 · 광인의 나락】",
      EN: "【FINAL WARNING · THE ABYSS】",
      JA: "【最終警告 · 狂人の奈落】"
    },
    abyssWarnDesc: {
      KO: "경고했습니다. 이곳은 인간의 언어와 이성이 완전히 붕괴된 최심부 나락입니다.\n스치는 기척 하나에 육신이 도륙 나며, 정상적인 인간이라면 결코 들어오지 않습니다.\n\n미친 짓임을 알고도 정말 입장하시겠습니까?",
      EN: "You have been warned. This is the deepest Abyss where human language and reason collapse completely.\nA single grazing blow will butcher you, and no sane mortal ever steps inside.\n\nKnowing it is sheer madness, do you still enter?",
      JA: "忠告はした。ここは人の言葉と理性が完全に崩壊した最深部の奈落だ。\n掠める気配ひとつで肉体が八つ裂きにされる。まともな人間なら決して入らない。\n\n狂気の沙汰と知りながら、本当に入獄するか？"
    },
    abyssConfirmBtn: {
      KO: "💀 나락으로 입장",
      EN: "💀 Enter the Abyss",
      JA: "💀 奈落へ入獄"
    },
    roster: {
      normal: ["巫", "蟲", "蠱", "魃", "蛟", "蝮"],
      elite: ["傀儡", "髑髏"],
      boss: "饕餮",
      bossPool: ["饕餮", "魑魅魍魎", "髑髏"]
    }
  }
};

/* Runtime reverse lookup: kanji -> depth number (1..12) built from kanken_data.json */
let KANJI_DEPTH_MAP = {};

function buildKanjiDepthMap() {
  KANJI_DEPTH_MAP = {};
  if (!KANKEN_DATA) return;
  Object.keys(KANKEN_DATA).forEach(did => {
    const n = parseInt(String(did).replace("depth_", ""), 10) || 1;
    const list = (KANKEN_DATA[did] && KANKEN_DATA[did].kanji) || [];
    list.forEach(k => {
      if (!KANJI_DEPTH_MAP[k]) KANJI_DEPTH_MAP[k] = n;
      [...String(k)].forEach(ch => {
        if (!KANJI_DEPTH_MAP[ch]) KANJI_DEPTH_MAP[ch] = n;
      });
    });
  });
}

function getKanjiDepthNum(k) {
  if (!k) return 1;
  if (KANJI_DEPTH_MAP[k]) return KANJI_DEPTH_MAP[k];
  const chars = [...String(k)];
  if (chars.length > 1) {
    return Math.max(...chars.map(c => KANJI_DEPTH_MAP[c] || 10));
  }
  return 1;
}

/*
 * Color tier by Kanken grade:
 *  - Depths 1..6  (Kanken 10..5, Education kanji): "edu" (green)
 *  - Depths 7..10 (Kanken 4..2, Common kanji):     "common" (orange)
 *  - Depths 11..12 (Kanken Jun-1..1, Abyss kanji): "abyss" (red)
 */
function getKanjiTier(k) {
  const d = getKanjiDepthNum(k);
  if (d >= 11) return "abyss";
  if (d >= 7) return "common";
  return "edu";
}

function depthTier(depthId) {
  const n = depthNumber(depthId);
  if (n >= 11) return "abyss";
  if (n >= 7) return "common";
  return "edu";
}

/* Kanken grade from the pool title, e.g. "(Kanken 2.5)" -> "漢検準2級". */
function kankenLabel(depthId) {
  const d = KANKEN_DATA[depthId];
  const m = d && d.title.match(/Kanken\s*([\d.]+)/i);
  if (!m) return "";
  const n = parseFloat(m[1]);
  return Number.isInteger(n) ? `漢検${n}級` : `漢検準${Math.floor(n)}級`;
}

function depthName(depthId) {
  return (DEPTHS[depthId] || {}).name || depthId;
}

function depthGloss(depthId) {
  return pickLang((DEPTHS[depthId] || {}).gloss) || "";
}

function depthLore(depthId) {
  return pickLang((DEPTHS[depthId] || {}).lore) || "";
}

function depthRoster(depthId) {
  return (DEPTHS[depthId] || DEPTHS.depth_1).roster;
}

function allRosterKanji(depthId) {
  const r = depthRoster(depthId);
  const bosses = r.bossPool || [r.boss];
  return [...new Set([...r.normal, ...r.elite, ...bosses])];
}
