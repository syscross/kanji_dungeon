/*
 * The twelve gaols. kanken_data.json supplies each depth's kanji pool (kept 100% intact);
 * this file supplies each depth's name, readable gloss, narrative lore, and enemy/boss pools.
 *
 * Every enemy in `roster` is strictly selected from that depth's Kanken grade in kanken_data.json
 * and represents an entity, creature, person, spirit, or living horror (never pure tools/verbs like 刀 or 破,
 * which belong in cards and enemy intents).
 */

const DEPTHS = {
  depth_1: {
    name: "獄門",
    gloss: { EN: "The Prison Gate", KO: "지옥의 문턱", JA: "地獄の入口", ZH_CN: "地狱之门", ZH_TW: "地獄之門" },
    lore: {
      KO: "벼가 자라던 논밭(田)과 아이들의 목소리가 울리던 학교(校), 평화롭던 마을(村·町)이 하룻밤 새 핏빛 안개에 잠겼다.\n가장 기초적인 사물의 이름조차 뒤틀린 변방. 어제까지 이웃이었던 사내(男)와 여인(女), 주인을 따르던 개(犬)마저 눈이 뒤집힌 채 산 자의 숨결을 쫓아 배회한다.",
      EN: "Overnight, crimson mist swallowed the rice paddies (田), the village streets (村·町), and the old schoolhouse (校).\nEven the simplest words have twisted here. Men (男), women (女), and stray hounds (犬) that were neighbors yesterday now prowl the fog, drawn to the scent of the living.",
      JA: "稲穂の揺れていた田(田)も、子供の声が響いた学び舎(校)も、穏やかだった村(村・町)も、一夜にして血霧に沈んだ。\n最も基本的な言葉すら歪んだ辺境。昨日まで隣人だった男女(男・女)や飼い犬(犬)までもが目を血走らせ、生者の息遣いを追って彷徨っている。"
    },
    roster: {
      normal: ["犬", "虫", "人", "男", "女", "子", "石"],
      elite: ["森", "車"],
      boss: "王",
      bossPool: ["王", "天", "先"]
    }
  },
  depth_2: {
    name: "風穴",
    gloss: { EN: "The Wind Hollow", KO: "바람의 굴", JA: "風の洞", ZH_CN: "风之洞", ZH_TW: "風之洞" },
    lore: {
      KO: "마을을 덮친 재앙을 피해 가도(道)를 따라 도망치던 피난민들의 발길이 끊긴 곳. 저잣거리(市)와 칠흑 같은 바닷가(海) 위로 살을 에듯 날카로운 칼바람이 분다.\n구원을 빌며 숨어든 고찰(寺)과 신사(社)의 문짝은 부서졌고, 돌아오지 못한 부모(父·母)와 형제(兄·姉)의 형상을 한 그림자들이 밤(夜)마다 골짜기(谷)에서 산 자의 이름을 부른다.",
      EN: "Refugees fled along the beaten road (道) toward the market (市) and the black sea (海), only to be overtaken by howling blades of wind.\nThe wayside shrines (社) and temples (寺) lie shattered. Every night (夜), shadows wearing the faces of lost parents (父·母) and siblings (兄·姉) call out from the gorge (谷).",
      JA: "災厄から逃れようと街道(道)を走った避難民の足跡が途絶えた地。捨てられた市(市)と漆黒の海(海)に刃のような風が吹き荒れる。\n救いを求めた古寺(寺)や社(社)の扉は砕け、帰らぬ父母(父・母)や兄姉(兄・姉)の姿をした影が、夜(夜)ごとに谷(谷)から生者の名を呼んでいる。"
    },
    roster: {
      normal: ["馬", "牛", "鳥", "魚", "兄", "姉", "父", "母"],
      elite: ["岩", "黒"],
      boss: "電",
      bossPool: ["電", "夜", "親"]
    }
  },
  depth_3: {
    name: "血池",
    gloss: { EN: "The Blood Pond", KO: "피의 못", JA: "血の池", ZH_CN: "血池", ZH_TW: "血池" },
    lore: {
      KO: "원인 모를 역병(病)이 항구(港)와 외딴섬(島)까지 번지자, 의원(医)들은 병동(院)을 걸어 잠그고 시신을 호수(湖)에 수장하기 시작했다.\n그러나 바닥에 고인 피(血)와 원한이 얼어붙은 물결(氷) 속에서 죽음(死) 그 자체가 형체를 얻어 기어 나왔고, 버려진 폐옥(屋)과 무기고(庫)마다 미쳐버린 객(客)들의 비명이 메아리친다.",
      EN: "When an unnamed plague (病) swept the harbor (港) and outer island (島), physicians (医) bolted the infirmaries (院) and dumped the dead into the lake (湖).\nFrom that stagnant blood (血) and black ice (氷), Death (死) itself crawled ashore. Now mad guests (客) shriek endlessly inside the creaking houses (屋) and rusted vaults (庫).",
      JA: "得体の知れぬ疫病(病)が港(港)や孤島(島)にまで広がり、医者(医)たちは病棟(院)を封鎖して骸を湖(湖)へと沈めた。\nだが澱んだ血(血)と凍てつく氷(氷)の底から死(死)そのものが這い上がり、軋む廃屋(屋)や武器庫(庫)には狂い果てた客(客)の悲鳴が木霊している。"
    },
    roster: {
      normal: ["羊", "童", "客", "医", "者", "氷", "病"],
      elite: ["血", "悪"],
      boss: "死",
      bossPool: ["死", "神", "主"]
    }
  },
  depth_4: {
    name: "古戦場",
    gloss: { EN: "The Old Battlefield", KO: "번국의 옛 싸움터", JA: "古き戦場", ZH_CN: "古战场", ZH_TW: "古戰場" },
    lore: {
      KO: "역병과 기근 끝에 각 지방 번국(藩國)이 서로의 목을 겨누며 벌인 대전란의 흔적. 이바라키의 가시나무 들판(茨)과 니가타의 검은 개펄(潟), 토치기의 고목림(栃)과 오사카의 핏빛 비탈길(阪), 기후의 험준한 갈림길(岐)까지 열도 곳곳이 거대한 무덤이 되었다.\n전쟁은 진작 끝났건만, 불타는 고성(城)과 병영 거리(街)에는 자신이 죽은 줄도 모르는 병졸(兵)과 관리(官), 망령이 된 군세(軍)가 여전히 진군 북을 울리고 있다.",
      EN: "In the wake of plague and famine, the provinces tore each other apart. From the briar wastes of Ibaraki (茨) and black mudflats of Niigata (潟) to the woods of Tochigi (栃), the bloodied slopes of Osaka (阪), and the mountain crossroads of Gifu (岐), the land became one vast grave.\nThough the war is long over, dead soldiers (兵), magistrates (官), and phantom armies (軍) still march through the burning fortress (城) and garrison streets (街).",
      JA: "疫病と飢饉の果てに諸藩が刃を交えた大戦乱の跡。茨城の茨野(茨)、新潟の黒い干潟(潟)、栃木の古木林(栃)、大阪の血塗られた坂(阪)、岐阜の険しい岐路(岐)に至るまで、各地が巨大な墓標と化した。\n戦はとうに終わったはずが、燃える古城(城)や廃墟の街(街)では、己の死すら知らぬ兵(兵)や官吏(官)、亡霊の軍勢(軍)が今なお進軍の太鼓を鳴らしている。"
    },
    roster: {
      normal: ["熊", "鹿", "兵", "徒", "民", "老", "児"],
      elite: ["官", "臣"],
      boss: "軍",
      bossPool: ["軍", "司", "夫"]
    }
  },
  depth_5: {
    name: "罪人塚",
    gloss: { EN: "The Sinners' Mound", KO: "죄인의 무덤", JA: "罪人の塚", ZH_CN: "罪人冢", ZH_TW: "罪人塚" },
    lore: {
      KO: "전란의 패잔병과 대역죄인(犯·罪)들을 산 채로 수장하고 파묻은 금단의 유배지.\n독가스가 새어 나오는 폐광(鉱)과 잿빛 강물(河) 너머, 이단의 법당(堂)에서는 기괴한 불상(像)과 타락한 법사(師)들이 죽은 조상(祖)의 유해를 일으켜 세우며 산 자와 죽은 자의 경계(境)를 허물고 있다.",
      EN: "A forbidden penal ground where war criminals and heretics (犯·罪) were buried alive.\nBeyond the toxic collapsed mines (鉱) and rivers of ash (河), defiled statues (像) and fallen priests (師) chant inside heretic halls (堂), raising the bones of ancestors (祖) to erase the border (境) between life and death.",
      JA: "戦乱の落武者や大罪人(犯・罪)が生き埋めにされた禁断の流刑地。\n毒ガスが漏れる廃鉱(鉱)と灰色の河(河)の向こう、異端の堂(堂)では歪んだ仏像(像)と堕ちた法師(師)が祖先の骸(祖)を操り、生死の境(境)を塗り潰している。"
    },
    roster: {
      normal: ["士", "婦", "妻", "祖", "犯", "像"],
      elite: ["武", "罪"],
      boss: "災",
      bossPool: ["災", "師", "仏"]
    }
  },
  depth_6: {
    name: "白骨殿",
    gloss: { EN: "The Hall of Bones", KO: "백골의 전당", JA: "白骨の殿", ZH_CN: "白骨殿", ZH_TW: "白骨殿" },
    lore: {
      KO: "인간이 살던 속세의 마지막 끝자락. 수만 구의 백골(骨)과 망자(亡)의 유해를 아교처럼 다져 쌓아 올린 거대한 지하 누각(閣)이다.\n뼛가루가 모래(砂)처럼 날리고 살점이 열매처럼 매달린 거목(樹) 아래, 스스로를 황제(皇)와 성인(聖)이라 칭하는 백골의 지배자들이 생자의 피가 끓어오르는 샘(泉)과 비고(蔵)를 지키고 있다.",
      EN: "The final edge of the mortal world—a subterranean pavilion (閣) mortar-built from tens of thousands of bleached bones (骨) and the dead (亡).\nBeneath great trees (樹) heavy with flesh and deserts of bone-ash (砂), skeletal rulers calling themselves Emperor (皇) and Saint (聖) guard the locked ossuaries (蔵) and boiling blood springs (泉).",
      JA: "人の世の果て。幾万もの白骨(骨)と亡者(亡)の骸を積み上げて築かれた巨大な地下楼閣(閣)。\n骨灰が砂(砂)のように舞い、肉が実る大樹(樹)の下で、自らを皇(皇)や聖(聖)と称する白骨の支配者たちが、煮え立つ血の泉(泉)と骨蔵(蔵)を守っている。"
    },
    roster: {
      normal: ["骨", "亡", "幼", "衆", "俳", "蚕"],
      elite: ["敵", "異"],
      boss: "皇",
      bossPool: ["皇", "将", "聖"]
    }
  },
  depth_7: {
    name: "鬼哭谷",
    gloss: { EN: "The Valley of Wailing", KO: "귀신이 우는 골짜기", JA: "鬼の哭く谷", ZH_CN: "鬼哭谷", ZH_TW: "鬼哭谷" },
    lore: {
      KO: "민간인이 휩쓸리던 변방은 끝났다. 여기서부터는 마(魔)를 베기 위해 스스로 칼을 쥔 토벌대와 귀살(鬼殺)의 영역이다.\n인간의 목소리를 흉내 내는 식인귀(鬼)와 흉포한 마수(獣)들이 벼락 치는 첨탑(塔)과 썩어가는 독늪(沼)에 도사리고 있다. 앞선 토벌대가 피로 그려 남긴 진영(陣)을 넘어, 오직 귀신의 목을 베기로 맹세한 자만이 이 골짜기의 곡성(哭聲) 속으로 검을 뽑아 든다.",
      EN: "The mortal borderlands end here. Beyond this line lies the domain of demon-slayers and exorcists who draw steel by choice.\nMan-eating demons (鬼) and rabid beasts (獣) stalk the lightning-struck spires (塔) and poison swamps (沼). Stepping past the blood-drawn camps (陣) of fallen vanguard squads, only those sworn to sever demon necks may advance.",
      JA: "民草が巻き込まれた辺境はここで終わる。これより先は、鬼を斬るために自ら刃を握った討伐隊・鬼殺の領域だ。\n人の声を真似る食人鬼(鬼)と狂暴な魔獣(獣)が、雷落ちる塔(塔)や腐敗の沼(沼)に巣食っている。先遣隊が血で描いた陣(陣)を越え、鬼を討つと誓った者だけがこの哭き声の谷へ踏み込める。"
    },
    roster: {
      normal: ["獣", "奴", "娘", "郎", "僧", "隷"],
      elite: ["巨", "狂"],
      boss: "鬼",
      bossPool: ["鬼", "雷", "雄"]
    }
  },
  depth_8: {
    name: "魔境",
    gloss: { EN: "The Demon Wilds", KO: "마의 경계", JA: "魔の境", ZH_CN: "魔境", ZH_TW: "魔境" },
    lore: {
      KO: "단련된 무사(侍)조차 홀로 들어섰다가 원귀(霊·幽)에게 육신을 빼앗겨 돌아온다는 본격적인 마경(魔境).\n영혼을 녹여 요도를 벼리는 용광로(炉)와 산제물의 피가 마르지 않는 제단(壇), 도굴된 고분(墳)과 지하 감옥(獄)이 어둠 속에 도사리고 있다. 어설픈 각오로는 단 한 걸음도 내디딜 수 없는 숙련자들의 사지(死地).",
      EN: "Even seasoned samurai (侍) who enter these Demon Wilds alone return as hollow vessels possessed by wraiths (霊·幽).\nSoul-smelting furnaces (炉), sacrificial blood altars (壇), desecrated barrows (墳), and iron torture gaols (獄) await in the dark. Half-hearted resolve will not survive a single step.",
      JA: "熟練の侍(侍)ですら単独で踏み込めば怨霊(霊・幽)に肉体を乗っ取られて帰るという魔境。\n魂を溶かして妖刀を鍛える炉(炉)、生贄の血が乾かぬ祭壇(壇)、暴かれた古墳(墳)、絶叫の牢獄(獄)が闇に口を開けている。生半可な覚悟では一歩も進めぬ手練れの死地。"
    },
    roster: {
      normal: ["霊", "怪", "賊", "婆", "嬢", "姫", "豚"],
      elite: ["侍", "幽", "邪"],
      boss: "魔",
      bossPool: ["魔", "帝", "騎"]
    }
  },
  depth_9: {
    name: "覇道",
    gloss: { EN: "The Road of Tyrants", KO: "패왕의 길", JA: "覇者の道", ZH_CN: "霸道", ZH_TW: "霸道" },
    lore: {
      KO: "한 시대를 피로 호령하던 패왕(覇)과 대원수(帥), 그리고 인간을 초월하려다 괴물이 된 선인(仙)과 화룡(竜)이 패권을 다투는 수라장.\n처형당한 명검들이 꽂힌 칼무덤(塚)과 철갑선이 가라앉은 검은 해자(堀), 인골을 굽는 가마(窯)와 화룡의 동굴(洞)을 돌파하려면, 적의 살기를 읽고 정면으로 받아치는 일류 퇴마사의 경지에 이르러야 한다.",
      EN: "A carnage-strewn highway where blood-soaked tyrants (覇), grand marshals (帥), twisted immortals (仙), and fire wyrms (竜) clash for supremacy.\nTo cross the mound of executed blades (塚), the warship-sunken moat (堀), the bone kilns (窯), and the wyrm's cavern (洞), you must read killing intent and counter it with absolute mastery.",
      JA: "一時代を血で統べた覇王(覇)や大元帥(帥)、人を超えようとして怪異に堕ちた仙人(仙)と火竜(竜)が覇権を争う修羅道。\n処刑刀の塚(塚)や鉄艦沈む堀(堀)、人骨を焼く窯(窯)、竜眠る洞(洞)を突破するには、敵の殺気を見切り真っ向から斬り伏せる達人の境地が求められる。"
    },
    roster: {
      normal: ["猫", "蛇", "猿", "蚊", "忍", "囚", "虜"],
      elite: ["仙", "翁"],
      boss: "覇",
      bossPool: ["覇", "竜", "帥"]
    }
  },
  depth_10: {
    name: "冥府",
    gloss: { EN: "The Underworld", KO: "저승의 문턱", JA: "冥府", ZH_CN: "冥府", ZH_TW: "冥府" },
    lore: {
      KO: "인간의 언어와 상식(상용한자)이 닿을 수 있는 가장 깊고 어두운 극한.\n빛 한 줄기 들지 않는 칠흑(闇)의 절벽(崖) 너머, 죄인을 삶는 지옥 가마솥(釜)이 끓어오르고 천 년 묵은 원념(怨)과 해골(骸)이 저승(冥)의 문턱을 가로막는다. 여기까지 살아서 도달한 자라면, 인간으로서 도달할 수 있는 무예와 지략의 정점에 섰다고 부르기에 부족함이 없다.",
      EN: "The deepest limit where human language and common reason (Jōyō kanji) still hold sway.\nBeyond storm-lashed cliffs (崖) of lightless dark (闇), hell cauldrons (釜) boil and ancient grudges (怨) and skeletons (骸) bar the threshold of the Underworld (冥). Anyone who reaches this gate has already proven the pinnacle of human skill.",
      JA: "人の言葉と常識(常用漢字)が届く最も深く暗い極限。\n光なき闇(闇)の断崖(崖)の向こうで地獄釜(釜)が煮え立ち、千年の怨念(怨)と骸(骸)が冥府(冥)の敷居を塞いでいる。ここまで辿り着いた者ならば、人の身で到達し得る武と知の頂に立ったと言っていい。"
    },
    roster: {
      normal: ["虎", "亀", "蜂", "鶴", "駒", "妖", "乞"],
      elite: ["骸", "怨"],
      boss: "冥",
      bossPool: ["冥", "闇", "鬱"]
    }
  },
  depth_11: {
    name: "獣王廟",
    gloss: { EN: "The Beast King's Tomb", KO: "짐승왕의 사당", JA: "獣王の廟", ZH_CN: "兽王庙", ZH_TW: "獸王廟" },
    lore: {
      KO: "…잠깐. 저승의 문턱(제10옥)을 넘어선 시점에서 그대의 실력은 이미 충분히 증명되었다. 그런데 굳이 저 봉인 너머까지 발을 들이겠다고?\n이곳부터는 상용(常用)의 경계 바깥에 버려진 기괴한 요괴와 아귀들의 영역이다. 사람의 말을 하는 존재조차 사라지고, 오직 물어뜯고(噛), 통째로 삼키고(呑), 살점을 게걸스럽게 탐하는(喰) 흉수(狼·豹·鰐·獅)와 썩어가는 시체(屍), 재앙 같은 고룡(龍)만이 피투성이 뇌옥(牢)과 사당(祠)을 배회한다.\n정신을 온전히 유지하고 싶은 자라면, 굳이 이곳에 발을 들여서는 안 된다.",
      EN: "...Wait. By conquering the Underworld (Depth 10), you have already proven your worth beyond doubt. Yet you still mean to step past this seal?\nBeyond this line lies the forbidden realm outside Common Kanji—a den of grotesque fiends and starving beasts. Nothing human remains here: only ancient predators (狼·豹·鰐·獅), rotting corpses (屍), and calamity dragons (龍) that gnaw (噛), swallow whole (呑), and devour flesh (喰) inside blood-soaked cages (牢) and shrines (祠).\nAnyone who wishes to keep their sanity intact has no business stepping inside.",
      JA: "……待て。冥府(第十獄)を制した時点で、お前の実力はもう十分に証明されたはずだ。だというのに、わざわざあの封印の先へ足を踏み入れるというのか？\nここから先は常用漢字の枠外に棄てられた妖魔と餓鬼の領域だ。人語を解する存在すら消え失せ、ただ噛み砕き(噛)、丸呑みにし(呑)、肉を喰らう(喰)凶獣(狼・豹・鰐・獅)と腐乱死体(屍)、災厄の古龍(龍)だけが血塗られた牢(牢)や祠(祠)を徘徊している。\n正気を保ちたい者なら、決して足を踏み入れてはならない。"
    },
    abyssWarnTitle: {
      KO: "【경고 — 상용(常用) 바깥의 금역】",
      EN: "【WARNING — BEYOND THE COMMON REALM】",
      JA: "【警告 — 常用の外なる禁域】"
    },
    abyssWarnDesc: {
      KO: "제10옥까지의 제패만으로도 그대는 이미 정점에 달한 실력자입니다.\n이 너머(漢検準1級)부터는 일반적인 상식의 한자를 벗어난 흉수들이 스치는 일격마다 살점을 뜯어냅니다.\n\n굳이 이곳까지 발을 들이시겠습니까?",
      EN: "Conquering up to the 10th Gaol already marks you as a master.\nBeyond this seal (Kanken Pre-1), grotesque beasts outside the common lexicon tear flesh with every grazing blow.\n\nDo you truly insist on entering?",
      JA: "第十獄までの踏破で、お前の腕前はすでに達人の域にある。\nこの先(漢検準1級)は常用の理を外れた凶獣が掠めるだけで肉を喰いちぎる魔窟だ。\n\nそれでも本当に足を踏み入れるか？"
    },
    abyssConfirmBtn: {
      KO: "🩸 경고를 무시하고 입장",
      EN: "🩸 Ignore warning & enter",
      JA: "🩸 警告を無視して入獄"
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
      KO: "이 문 앞에 서서도 도망치지 않는 자는 영웅이 아니다. 그저 살아 돌아갈 생각을 완전히 버린 미치광이일 뿐이다.\n완전히 정신이 나가버린 태고의 악귀들과 괴신들이 출몰하는 문자 그대로의 나락(奈落). 인간은 읽을 수조차 없는 고대의 저주(咒·祟·詛)와 독충을 서로 먹여 키운 고독(蠱), 꿈틀거리는 시체 산(尸)과 검은 독수맥(澪) 위에서 산 자의 영혼까지 씹어 삼키는(噬·抉) 이형의 괴물(魑·魍·魃·饕餮)들이 득실거린다.\n단 한 번이라도 발을 들인다면, 제정신으로든 온전한 육신으로든 살아 돌아갈 생각은 하지 않는 것이 좋다.",
      EN: "Anyone who stands before this gate and does not run is no hero—only a lunatic who has completely abandoned the thought of returning alive.\nThis is the literal Abyss (奈落), crawling with utterly deranged primordial fiends and monstrous gods. Unreadable ancient curses (咒·祟·詛), venomous gu-worms (蠱), mountains of twitching corpses (尸), and veins of black venom (澪) feed horrors (魑·魍·魃·饕餮) that gouge (抉) and devour (噬) your very soul.\nTake even a single step inside, and abandon all hope of ever walking out alive.",
      JA: "この門の前に立ってなお逃げ出さぬ者は英雄ではない。ただ生きて帰ることを完全に諦めた狂人だ。\n完全に常軌を逸した太古の悪鬼と怪神が跋扈する文字通りの奈落(奈落)。人には読めるはずもない古代の呪詛(咒・祟・詛)と蠱毒(蠱)、蠢く尸の山(尸)と黒毒の澪(澪)の上で、生者の魂まで抉り喰らう(噬・抉)異形の怪異(魑・魍・魃・饕餮)がひしめいている。\n一度でも足を踏み入れれば、五体満足はおろか生きて帰れるなどと思わない方がいい。"
    },
    abyssWarnTitle: {
      KO: "【최종 경고 — 광인의 나락(奈落 · 漢検1級)】",
      EN: "【FINAL WARNING — THE LUNATIC ABYSS (KANKEN 1)】",
      JA: "【最終警告 — 狂人の奈落 (漢検1級)】"
    },
    abyssWarnDesc: {
      KO: "경고했습니다. 이곳은 인간의 언어와 이성이 완전히 붕괴된 1급 나락입니다.\n스치는 기척 하나에 육신이 도륙 나며, 정상적인 인간이라면 결코 들어오지 않습니다.\n\n미친 짓임을 알고도 정말 입장하시겠습니까?",
      EN: "You have been warned. This is the Grade-1 Abyss where human language and reason collapse completely.\nA single grazing blow will butcher you, and no sane mortal ever steps inside.\n\nKnowing it is sheer madness, do you still enter?",
      JA: "忠告はした。ここは人の言葉と理性が完全に崩壊した一級の奈落だ。\n掠める気配ひとつで肉体が八つ裂きにされる。まともな人間なら決して入らない。\n\n狂気の沙汰と知りながら、本当に入獄するか？"
    },
    abyssConfirmBtn: {
      KO: "💀 생사를 버리고 나락으로",
      EN: "💀 Forsake life & descend",
      JA: "💀 生死を捨てて奈落へ"
    },
    roster: {
      normal: ["巫", "蟲", "蠱", "魑", "魍", "魃", "蛟", "蝮"],
      elite: ["傀儡", "髑髏"],
      boss: "饕餮",
      bossPool: ["饕餮", "髑髏", "傀儡"]
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
