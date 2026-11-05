/*
 * Story Mode (스토리 모드):
 * - Hometown Stage Exploration (【里】 등불의 마을 — depth_0): Entered and explored inside #view-battle just like a Gaol.
 * - Permanent Story Relics (특수 소지): Never consumed; woven organically into conversations & story milestones.
 * - Sequential Gaol Unlocks: Starts at unlockedDepth 0 (even 10급 is hidden/locked until you return home, speak with Sensei 【先】, receive 【生】 생환의 부적, and learn the location of 01 獄門).
 * - Mortal World Happy Ending (Depth 10) & Sekiro-style Shura Branch (Depths 11 & 12).
 */

const STORY_SPECIAL_ITEMS = {
  talisman_life: {
    id: "talisman_life",
    kanji: "生",
    tier: "edu",
    name: {
      EN: "Talisman of Return to Life",
      KO: "생환의 부적",
      JA: "生還の護符",
      ZH_CN: "生还护符",
      ZH_TW: "生還護符"
    },
    desc: {
      EN: "Heirloom tethered to the village lantern. Pulls your soul and memories back to the Village even in death, and once per expedition withstands a fatal blow at 20% HP.",
      KO: "등불의 마을과 영혼을 잇는 고향의 성물. 옥문에서 스러져도 영혼과 기억을 마을로 되불러들이며, 원정마다 1회 치명상을 버텨내고 체력 20%로 일어섭니다. (영구 귀속)",
      JA: "灯の里と魂を繋ぐ故郷の聖物。獄門で倒れても魂と記憶を里へ呼び戻し、遠征ごとに1回だけ致命傷を耐えてHP20%で踏みとどまる。（永久帰属）",
      ZH_CN: "将灵魂与灯之里相连的故乡圣物。即便在狱门倒下也会将灵魂与记忆唤回村里，且每次远征可抵挡1次致命伤并以20%体力屹立不倒。（永久归属）",
      ZH_TW: "將靈魂與燈之里相連的故鄉聖物。即便在獄門倒下也會將靈魂與記憶喚回村裡，且每次遠征可抵擋1次致命傷並以20%體力屹立不倒。（永久歸屬）"
    }
  },
  talisman_keep: {
    id: "talisman_keep",
    kanji: "持",
    tier: "edu",
    consumable: false,
    name: {
      EN: "Cord of Retention",
      KO: "소지의 부적",
      JA: "所持の護符",
      ZH_CN: "所持护符",
      ZH_TW: "所持護符"
    },
    desc: {
      EN: "Ash-woven cord bound to your satchel by Sensei 【先】. When dragged back from death or retreat, it clutches onto up to 5 random Kanji cards in your bag.",
      KO: "스승【先】이 등불의 재로 엮어 가방에 매어 준 부적. 옥문에서 쓰러지거나 중도에 물러날 때 일반 소지 한자 중 무작위 최대 5장을 놓치지 않고 지켜냅니다. (영구 귀속 · 전투 중 손패로 드로우되지 않음)",
      JA: "先生【先】が灯の灰で編み上げた護符。獄門で倒れるか撤退した際、一般所持の漢字からランダムで最大5枚を守り抜く。（永久帰属・戦闘中の手札には引かれない）",
      ZH_CN: "老师【先】以灯灰编织并系在行囊上的护符。在狱门倒下或撤退时，随机护住最多5张普通所持汉字。（永久归属）",
      ZH_TW: "老師【先】以燈灰編織並繫在行囊上的護符。在獄門倒下或撤退時，隨機護住最多5張普通所持漢字。（永久歸屬）"
    }
  },
  talisman_return: {
    id: "talisman_return",
    kanji: "帰",
    tier: "common",
    consumable: true,
    name: {
      EN: "Bell of Unbroken Return",
      KO: "귀환의 방울",
      JA: "帰還の鈴",
      ZH_CN: "归还之铃",
      ZH_TW: "歸還之鈴"
    },
    desc: {
      EN: "Ancient bronze bell from beneath the study altar. When struck down or forced to retreat, it rings out and shatters to preserve 100% of your bag's Kanji once. (1-Time Consumable)",
      KO: "서당 제단 아래 보관되어 있던 고동색 방울. 옥문에서 쓰러지거나 중도에 물러날 때 스스로 울리며 부서져, 일반 소지 한자를 단 한 장도 잃지 않고 100% 보전합니다. (1회용 소모품 · 발동 시 소멸)",
      JA: "書堂の祭壇の下に眠っていた古銅の鈴。獄門で倒れるか撤退した際、自ら鳴り響いて砕け散り、一般所持の漢字を100%保全する。（1回使い切り消耗品・発動時消滅）",
      ZH_CN: "沉睡在书堂祭坛下的古铜铃。在狱门倒下或撤退时鸣响碎裂，保全100%普通所持汉字。（一次性消耗品）",
      ZH_TW: "沉睡在書堂祭壇下的古銅鈴。在獄門倒下或撤退時鳴響碎裂，保全100%普通所持漢字。（一次性消耗品）"
    }
  },
  talisman_wealth: {
    id: "talisman_wealth",
    kanji: "富",
    tier: "common",
    consumable: false,
    name: {
      EN: "Knot of Residual Echoes",
      KO: "잔향의 매듭",
      JA: "残響の結び",
      ZH_CN: "残响绳结",
      ZH_TW: "殘響繩結"
    },
    desc: {
      EN: "Cord given by your old friend 【友】. Draws +50% more residual Yen (円) from slain foes.",
      KO: "옛 벗【友】이 건네준 매듭. 옥문에서 원령을 베었을 때 수거하는 잔향(円)이 영구적으로 50% 증가합니다. (영구 귀속 · 전투 중 손패로 드로우되지 않음)",
      JA: "旧友【友】から託された結び紐。獄門で怨霊を斬った際に得る残響（円）が恒久的に50%増加する。（永久帰属・戦闘中の手札には引かれない）",
      ZH_CN: "旧友【友】托付的绳结。在狱门斩杀怨灵时获得的残响（円）永久增加50%。（永久归属）",
      ZH_TW: "舊友【友】託付的繩結。在獄門斬殺怨靈時獲得的殘響（円）永久增加50%。（永久歸屬）"
    }
  },
  talisman_god: {
    id: "talisman_god",
    kanji: "眼",
    tier: "abyss",
    consumable: false,
    name: {
      EN: "Bead of the Mind's Eye",
      KO: "심안의 부적",
      JA: "心眼の護符",
      ZH_CN: "心眼护符",
      ZH_TW: "心眼護符"
    },
    desc: {
      EN: "Obsidian bead bestowed by the blind Elder 【老】. Grants +1 free Ancient God summon and +1 free Reroll at the start of every expedition.",
      KO: "잿빛 눈의 노인【老】이 건네준 흑요석 부적. 매 출정마다 무료 고신 소환 +1 및 무료 리롤 +1을 부여합니다.",
      JA: "灰色の目の老人【老】から授かった黒曜石の護符。毎回の出陣時に無料古神召喚+1・無料リロール+1を付与する。",
      ZH_CN: "灰眸老人【老】赐予的黑曜石护符。每次出征时赋予免费古神召唤+1与免费重掷+1。",
      ZH_TW: "灰眸老人【老】賜予的黑曜石護符。每次出征時賦予免費古神召唤+1與免費重擲+1。"
    }
  }
};

function ST_L(EN, KO, JA, ZH_CN = KO, ZH_TW = JA) {
  return { EN, KO, JA, ZH_CN, ZH_TW };
}

function ensureStoryConfig() {
  if (!config.story || config.story.v !== STORY_STATE_VERSION) {
    config.story = createDefaultStoryState();
  }
  const def = createDefaultStoryState();
  for (const k of Object.keys(def)) {
    if (config.story[k] === undefined) config.story[k] = def[k];
  }
  if (Array.isArray(config.story.specialItems)) {
    config.story.specialItems = config.story.specialItems.filter(
      it => it && STORY_SPECIAL_ITEMS[it.id] && it.count > 0
    );
  } else {
    config.story.specialItems = [];
  }
  return config.story;
}

function isVillageStage() {
  return Boolean(state && state.active && state.depthId === "depth_0");
}

function countSpecialItem(itemId) {
  const st = ensureStoryConfig();
  const found = (st.specialItems || []).find(it => it.id === itemId);
  return found ? (found.count || 0) : 0;
}

function addSpecialItem(itemId, delta = 1) {
  if (!STORY_SPECIAL_ITEMS[itemId]) return 0;
  const st = ensureStoryConfig();
  if (!Array.isArray(st.specialItems)) st.specialItems = [];
  let entry = st.specialItems.find(it => it.id === itemId);
  if (!entry) {
    if (delta <= 0) return 0;
    entry = { id: itemId, count: 0 };
    st.specialItems.push(entry);
  }
  entry.count = Math.min(1, Math.max(0, (entry.count || 0) + delta));
  if (entry.count <= 0) {
    st.specialItems = st.specialItems.filter(it => it.id !== itemId);
  }
  persistStoryState();
  return entry.count;
}

function addStoryYen(delta) {
  const st = ensureStoryConfig();
  st.yen = Math.max(0, Math.round((st.yen || 0) + delta));
  persistStoryState();
  return st.yen;
}

function awardStoryYenForKill(rank = "normal") {
  if (!isStoryMode()) return 0;
  const base = rank === "boss" ? 180 : rank === "elite" ? 75 : 35;
  const wealthBonus = countSpecialItem("talisman_wealth") > 0 ? 1.5 : 1;
  const gained = Math.round(base * wealthBonus);
  addStoryYen(gained);
  return gained;
}

function getStoryNarrativePhase() {
  const st = ensureStoryConfig();
  if (st.visitedDepth12 || st.shuraEndingSeen) return "shura_12";
  if (st.visitedDepth11) return "abyss_11";
  if (st.humanEndingSeen || (st.unlockedDepth >= 11)) return "peace_10";
  if (st.unlockedDepth >= 7) return "late";
  if (st.unlockedDepth >= 4) return "mid";
  return "early";
}

/* Ominous final words spoken by the Depth 10 Boss (冥 / 闇 / 鬱) upon defeat */
function getDepth10BossLastWords(bossKanji) {
  return pickLang(ST_L(
    `💀 **【${bossKanji}】's Dying Curse**: *"…Hah… hahaha… Foolish mortal. You severed the mere fence of 'Common Kanji' and think it ends here? Beyond this floor lies the Beast-King's Sanctum (第11獄) that humans excised from their language in terror… and it has already caught the scent of your blood…"*`,
    `💀 **【${bossKanji}】의 단말마**: *"…크크크… 어리석은 인간이여. 고작 '상용(常用)'의 울타리 안을 베어냈다고… 여기서 끝일 거라 생각하나? 인간들이 두려워 문자 밖으로 도려낸 심연의 문(第11獄 獣王廟)이… 이미 네 피 냄새를 맡았다…"*`,
    `💀 **【${bossKanji}】の断末魔**: *「……ククク……愚かな人間よ。たかだか『常用』の檻の中を斬り伏せた程度で……これで終わりだと思うか？ 人が恐れて文字の外へ切り捨てた深淵の門（第十一獄・獣王廟）は……すでにお前の血の匂いを嗅ぎつけたぞ……」*`
  ));
}

function getHumanWorldHappyEndingLines() {
  return [
    pickLang(ST_L(
      "With the fall of the 10th Gaol (冥府), the black fog choking the mortal realm dissolves into warm sunlight.",
      "제10옥(冥府)의 주인이 쓰러지자 고향을 뒤덮었던 잿빛 안개가 걷히고, 마침내 등불의 마을 위로 따뜻한 햇살이 내려앉습니다.",
      "第十獄（冥府）の主が倒れると、故郷を覆っていた灰色の霧が晴れ、ついに灯の里へ暖かい陽差しが降り注いだ。"
    )),
    pickLang(ST_L(
      "🌸 **Mortal World Restored (Happy Ending)** — The 2,136 Common Kanji have returned to human speech. In the Village, Sensei 【先】 and your Friend 【友】 await the hero's return.",
      "🌸 **【인간계 평정 — 해피엔딩 달성】** — 인간 세상의 문자(상용한자 2,136자)가 모두 제자리를 되찾았습니다. 등불의 마을에서 옛 스승【先】과 벗【友】이 영웅의 귀환을 기다립니다.",
      "🌸 **【人間界平定 — ハッピーエンド達成】** — 人の世の文字（常用漢字2,136字）はすべて取り戻された。灯の里で先生【先】と友【友】が英雄の帰還を待っている。"
    )),
    pickLang(ST_L(
      "…Yet beneath the floor of the Underworld, the forbidden seal of the 11th Gaol (獣王廟) begins to pulse.",
      "…허나 저승의 바닥 너머에서, 결코 열려서는 안 될 제11옥 수왕묘(獣王廟 · 漢検準1級)의 금제가 불길하게 맥동하기 시작합니다.",
      "……だが冥府の底のさらに奥で、決して開けてはならぬ第十一獄・獣王廟（漢検準1級）の禁制が不気味に脈動し始めていた。"
    ))
  ];
}

function getShuraEndingLines() {
  return [
    pickLang(ST_L(
      "🩸 **【SHURA APOTHEOSIS — THE ABYSS ITSELF】** — Even the unreadable curses of the 12th Gaol (奈落) have been devoured by your blade.",
      "🩸 **【수라등극(修羅登極) — 나락의 지배자】** — 인간은 읽을 수조차 없는 제12옥 나락(奈落)의 태고신마저 당신의 칼끝에 도륙났습니다.",
      "🩸 **【修羅登極 — 奈落の支配者】** — 人には読めるはずもない第十二獄・奈落の太古神すら、お前の刃に喰らい尽くされた。"
    )),
    pickLang(ST_L(
      "No kanji in heaven, earth, or hell can judge you now. When you walk back toward your hometown, the very air trembles in terror.",
      "이제 천지와 지옥 어디에도 당신을 심판할 수 있는 문자(漢字)는 남아 있지 않습니다. 당신이 고향 마을로 발걸음을 옮기자 대기가 공포로 비명을 지릅니다.",
      "もはや天地にも地獄にも、お前を裁ける文字（漢字）は存在しない。お前が故郷の里へ歩みを戻すと、大気そのものが恐怖に悲鳴を上げた。"
    ))
  ];
}

/* Sync combat kills & boss clear into persistent Story state */
function syncStoryKillProgress(kanji, isBoss, depthId) {
  if (!isStoryMode()) return;
  const st = ensureStoryConfig();
  if (kanji && !st.defeatedFoes.includes(kanji)) {
    st.defeatedFoes.push(kanji);
  }
  if (isBoss) {
    if (kanji && !st.defeatedBosses.includes(kanji)) {
      st.defeatedBosses.push(kanji);
    }
    const dNum = depthNumber(depthId);
    if (dNum >= st.unlockedDepth && dNum < 12) {
      st.unlockedDepth = dNum + 1;
    }
    if (dNum === 10) {
      st.humanEndingSeen = true;
      if (st.unlockedDepth < 11) st.unlockedDepth = 11;
    }
    if (dNum === 11 && st.unlockedDepth < 12) {
      st.unlockedDepth = 12;
    }
    if (dNum === 12) {
      st.shuraEndingSeen = true;
    }
  }
  persistStoryState();
}

/* Rescue the cat (returns home to 【家】; never placed inside the inventory bag) */
function rescueStoryCat() {
  const st = ensureStoryConfig();
  if (st.catRescued) return false;
  st.catRescued = true;
  persistStoryState();
  return true;
}

/* Handle player death or abandon in Story Mode:
 * - Permanent relics (생, 지, 부, 안) remain in your bag.
 * - 【帰】 귀환의 방울 is a 1-time consumable: if held, it rings out and shatters (-1) to preserve 100% of normal Kanji cards once.
 * - Otherwise, 【持】 소지의 부적 preserves up to 5 RANDOM Kanji cards from your bag, and the rest scatter into the fog. */
function resolveStoryDeathOrAbandonBag() {
  const st = ensureStoryConfig();
  const currentBag = Array.isArray(state.deck) ? [...state.deck] : [];
  const hasLife = countSpecialItem("talisman_life") > 0;

  if (currentBag.length === 0) {
    st.deck = [];
    persistStoryState();
    return {
      kept: [],
      lostCount: 0,
      reason: hasLife
        ? pickLang(ST_L(
            "🕯 **【生】 Talisman of Return to Life** pulls your fading soul back to the lantern of your hometown.",
            "🕯 **【生】 생환의 부적**이 꺼져가는 의식을 붙들고, 당신의 영혼을 등불의 마을로 끌어당깁니다.",
            "🕯 **【生】 生還の護符**が薄れゆく意識を繋ぎ止め、お前の魂を灯の里へと引き戻した。"
          ))
        : null
    };
  }

  if (countSpecialItem("talisman_return") > 0) {
    addSpecialItem("talisman_return", -1);
    st.deck = [...currentBag];
    persistStoryState();
    return {
      kept: st.deck,
      lostCount: 0,
      reason: pickLang(ST_L(
        `🔔 **【帰】 Bell of Unbroken Return** rings out through the fog and shatters into bronze shards (Consumed) — all **${currentBag.length}** Kanji in your bag are preserved intact!`,
        `🔔 **【帰】 귀환의 방울**이 안개 속에서 처절하게 울려 퍼진 뒤 산산조각 났습니다 (1회용 소멸) — 대신 일반 소지 한자 **${currentBag.length}장**을 단 한 장도 잃지 않고 보전했습니다!`,
        `🔔 **【帰】 帰還の鈴**が霧の中で澄んだ音を響かせて砕け散った（消滅） — 代わりに一般所持の漢字 **${currentBag.length}枚**を1枚も失わず保全した！`
      ))
    };
  }

  if (countSpecialItem("talisman_keep") > 0) {
    const keepCap = 5;
    const kept = sample(currentBag, Math.min(keepCap, currentBag.length));
    const lostCount = Math.max(0, currentBag.length - kept.length);
    st.deck = kept;
    persistStoryState();
    return {
      kept,
      lostCount,
      reason: pickLang(ST_L(
        `📿 **【持】 Cord of Retention** clutches onto **${kept.length}** random Kanji (${kept.join(" · ")}) as ${lostCount} scattered into the fog!`,
        `📿 **【持】 소지의 부적**이 팽팽하게 조여들며 무작위 **${kept.length}장**(${kept.join(" · ")})을 끝까지 지켜냈습니다! (나머지 ${lostCount}장 소실)`,
        `📿 **【持】 所持の護符**が強く締まり、ランダムな **${kept.length}枚**（${kept.join("・")}）を守り抜いた！（残り${lostCount}枚喪失）`
      ))
    };
  }

  st.deck = [];
  persistStoryState();
  return {
    kept: [],
    lostCount: currentBag.length,
    reason: pickLang(ST_L(
      `🕯 **【生】 Talisman of Return to Life** pulled your soul back to the Village, and your Special Relics remain intact, but **${currentBag.length}** normal Kanji scattered into the fog.`,
      `🕯 **【生】 생환의 부적**의 인도로 영혼과 영구 성물은 무사히 마을로 생환했으나, 일반 소지 한자 **${currentBag.length}장**은 옥문의 안개 속으로 흩어졌습니다.`,
      `🕯 **【生】 生還の護符**の導きで魂と聖物は無事に里へ生還したが、一般所持の漢字 **${currentBag.length}枚**は獄門の霧へと散った。`
    ))
  };
}

/* ============================================================================
 * 【里】 등불의 마을 (DEPTH 0) — STAGE EXPLORATION INSIDE #view-battle
 * ============================================================================ */

const VILLAGE_SPOTS = {
  塾: {
    sign: "塾",
    npcKanji: "先",
    title: ST_L("Dying Study", "꺼져가는 서당", "消えかけの書堂"),
    omen: ST_L(
      "A paper lantern flickers beneath broken rafters.",
      "무너진 서까래 아래 희미한 등불이 흔들린다.",
      "崩れた垂木の下で仄かな灯が揺れている。"
    )
  },
  炉: {
    sign: "炉",
    npcKanji: "老",
    title: ST_L("Ash Brazier", "잿빛 화로터", "灰の火炉跡"),
    omen: ST_L(
      "Pale smoke rises from a cracked bronze brazier.",
      "금 간 청동 화로에서 타다 남은 연기가 피어오른다.",
      "ひび割れた青銅の火炉から煙が立ち昇る。"
    )
  },
  橋: {
    sign: "橋",
    npcKanji: "友",
    title: ST_L("Stone Bridge", "안개 낀 돌다리", "霧の石橋"),
    omen: ST_L(
      "Black mist coils around the broken stone parapet.",
      "절벽 안개가 끊어진 돌난간을 휘감고 있다.",
      "崖下の霧が崩れた欄干に絡みついている。"
    )
  },
  家: {
    sign: "家",
    npcKanji: null,
    title: ST_L("Ruined Home", "무너진 본가", "崩れた生家"),
    omen: ST_L(
      "Ash-covered courtyard and a cold hearth.",
      "검은 재가 내려앉은 옛 마당과 낡은 아궁이.",
      "黒い灰が積もった庭と古いかまど。"
    )
  },
  井: {
    sign: "井",
    npcKanji: "女",
    title: ST_L("Dry Well", "마른 우물가", "涸れ井戸"),
    omen: ST_L(
      "Cold night dew gathers on the stone rim.",
      "바닥이 보이지 않는 서늘한 돌우물.",
      "底の見えない冷たい石井戸。"
    )
  },
  鍛: {
    sign: "鍛",
    npcKanji: "男",
    title: ST_L("Shattered Smithy", "무너진 대장간", "崩れた鍛冶場"),
    omen: ST_L(
      "Cold iron scent lingers over a cracked anvil.",
      "불 꺼진 화덕과 금 간 모루.",
      "火の消えた炉とひび割れた金床。"
    )
  },
  祠: {
    sign: "祠",
    npcKanji: null,
    title: ST_L("Roadside Shrine", "이끼 낀 사당", "苔むす祠"),
    omen: ST_L(
      "Weathered stone shrine bound in crimson rope.",
      "붉은 금줄이 감긴 고요한 돌사당.",
      "注連縄が巻かれた古い石祠。"
    )
  },
  墓: {
    sign: "墓",
    npcKanji: null,
    title: ST_L("Nameless Graves", "무명 묘지", "名もなき墓所"),
    omen: ST_L(
      "Crooked headstones with gouged-out names.",
      "글자가 파여 나간 비석들이 기울어 서 있다.",
      "文字の削られた墓石が傾いている。"
    )
  }
};

function recordVillageNpcMet(npcKanji) {
  if (!npcKanji) return;
  const validNpcs = ["先", "老", "友", "猫", "女", "男"];
  if (!validNpcs.includes(npcKanji)) return;
  const st = ensureStoryConfig();
  if (!Array.isArray(st.metNpcs)) st.metNpcs = [];
  if (!st.metNpcs.includes(npcKanji)) {
    st.metNpcs.push(npcKanji);
    persistStoryState();
  }
}

function startVillageStage() {
  activeGameMode = "story";
  const st = ensureStoryConfig();
  st.started = true;
  st.villageVisits = (st.villageVisits || 0) + 1;
  persistStoryState();

  const keptDeck = Array.isArray(st.deck)
    ? st.deck.map(k => String(k).replace(/[^\u4e00-\u9faf\u3400-\u4dbf]/g, "")).filter(Boolean)
    : [];
  const catBonusHp = (st.catRescued ? 15 : 0) + (st.catBlessedNextRun ? 15 : 0);
  const senseiBonusHp = st.senseiBlessedNextRun ? 15 : 0;
  const godStacks = countSpecialItem("talisman_god");
  const startMaxHp = STARTING_MAX_HP + catBonusHp + senseiBonusHp;
  const startRerolls = 1 + godStacks + (st.catBlessedNextRun ? 1 : 0) + (st.senseiBlessedNextRun ? 1 : 0);

  state = createRunState();
  Object.assign(state, {
    gameMode: "story",
    active: true,
    depthId: "depth_0",
    runNo: config.stats.runs || 1,
    maxHp: startMaxHp,
    playerHp: startMaxHp,
    rerollTokens: startRerolls,
    freeSummons: godStacks,
    phase: "village_path",
    step: 1,
    sign: "里",
    enemyKanji: "",
    fieldState: pickLang(ST_L(
      "Ash-veiled hometown crossroads.",
      "검은 재와 안개에 잠긴 고향 갈림길.",
      "灰と霧に沈んだ故郷の辻。"
    )),
    deck: keptDeck,
    encounteredEnemies: [...(st.encounteredFoes || [])],
    defeatedEnemies: [...new Set([...(st.defeatedFoes || []), ...(st.defeatedBosses || [])])]
  });

  resetBattleChrome();
  const titleName = pickLang(ST_L("Village of the Lantern", "등불의 마을", "灯の里"));
  logMd(`── 🏮 【里】 ${titleName} ──`, "sep-log");

  const nPhase = getStoryNarrativePhase();
  if (st.introStage === 0) {
    logMd(pickLang(ST_L(
      "🏚 Broken roofs lie buried beneath black ash, and the characters on the village signposts have been gouged out as if clawed by unseen beasts. Through the suffocating fog, only a faint paper lantern sways in the distance.",
      "🏚 오랜만에 돌아온 고향의 처마들은 검은 재에 파묻혀 있고, 어귀의 이정표와 현판은 누군가 손톱으로 후벼 판 듯 글자가 흉측하게 파여 나갔다. 숨 막히는 잿빛 안개 너머로 오직 꺼져가는 종이 등불 하나만이 희미하게 흔들리고 있다.",
      "🏚 久方ぶりに戻った故郷の軒並みは黒い灰に埋もれ、道標や扁額は爪で抉られたように文字が削り取られていた。息詰まる灰色の霧の向こうで、ただ一つ消えかけの紙提灯だけが揺れている。"
    )), "event-log");
  } else if (nPhase === "shura_12") {
    logMd(pickLang(ST_L(
      "🩸 At your footsteps, the village lanterns turn the color of clotted blood and the ash on the ground trembles. Behind shuttered doors, the survivors hold their breath in terror of what you have become.",
      "🩸 당신의 발소리가 울리자 골목의 등불들이 일제히 핏빛으로 일렁이며 바닥의 검은 재가 잘게 떨린다. 굳게 닫힌 문짝 너머에서 살아남은 이들이 숨소리마저 삼킨 채 공포에 떨고 있다.",
      "🩸 お前の足音が響くと路地の灯が一斉に血の色へ揺らぎ、地の黒い灰が小刻みに震えた。固く閉ざされた戸の向こうで、生き残った者たちが息を殺して怯えている。"
    )), "event-log");
  } else if (nPhase === "peace_10") {
    logMd(pickLang(ST_L(
      "🌸 Warm sunlight filters through the parting clouds over the village roofs, and human voices can be heard along the alleyways again. Yet deep beneath the northern cliff, an ancient pulse still refuses to sleep.",
      "🌸 갈라진 먹구름 사이로 마침내 따스한 햇살이 처마 끝에 내려앉고, 골목마다 잃어버렸던 사람들의 말소리가 조금씩 피어난다. 허나 북쪽 절벽 깊은 땅 밑에서는 여전히 불길한 맥동이 가라앉지 않은 채 울리고 있다.",
      "🌸 割れた暗雲の隙間からついに暖かい陽差しが軒先に降り注ぎ、路地には失われていた人々の話し声が戻りつつある。だが北の崖の深い地の底では、なおも不気味な脈動が鳴り止まずにいた。"
    )), "event-log");
  } else {
    logMd(pickLang(ST_L(
      "🏮 Cold ash drifts across the silent crossroads while the paper lantern guards your returning soul. Before descending into the Gaols again, you can tends to your gear or speak with those who remain.",
      "🏮 차가운 재가 내려앉은 고향 갈림길 위로 희미한 등불이 돌아온 당신의 그림자를 비춘다. 다시 북쪽 절벽의 옥문으로 내려가기 전, 마을에 남은 이들과 이야기를 나누거나 행장을 추스를 수 있다.",
      "🏮 冷たい灰が積もる故郷の辻で、仄かな提灯が戻ったお前の影を照らしている。再び北の崖の獄門へ降りる前に、里に残る者たちと語り合い支度を整えることができる。"
    )), "sys-log");
  }

  enterVillageCinematic(() => renderPhase());
}

function enterVillageCinematic(onReady) {
  const titleName = pickLang(ST_L("Village of the Lantern", "등불의 마을", "灯の里"));
  const titleGloss = pickLang(ST_L("Ruined Hometown", "안개에 잠긴 고향", "霧に沈んだ故郷"));
  transitionToView("battle", titleName, titleGloss);
  const seal = $("seal-overlay");
  if (!seal) {
    if (onReady) onReady();
    return;
  }
  $("seal-num").textContent = "00";
  $("seal-kanji").textContent = "里";
  $("seal-gloss").textContent = titleName;
  seal.classList.remove("active");
  void seal.offsetWidth;
  seal.classList.add("active");
  playGongSfx();
  if (onReady) onReady();
  setTimeout(() => seal.classList.remove("active"), 1350);
}

function renderVillagePhase() {
  if (state.phase === "village_spot") {
    renderVillageSpotChoices(state.villageSpot || "塾");
  } else {
    state.phase = "village_path";
    state.sign = "里";
    state.enemyKanji = "";
    updateBattleHUD(false);
    renderVillageFork();
  }
}

function renderVillageFork() {
  const st = ensureStoryConfig();
  const allSpotKeys = Object.keys(VILLAGE_SPOTS);
  let spotKeys = [];
  if (st.unlockedDepth < 1 || st.introStage < 2) {
    const others = allSpotKeys.filter(k => k !== "塾");
    spotKeys = ["塾", ...sample(others, 3)];
  } else {
    spotKeys = sample(allSpotKeys, 4);
    if (!spotKeys.includes("塾") && Math.random() < 0.55) {
      spotKeys[0] = "塾";
    }
  }
  const tiles = spotKeys.map((k) => {
    const def = VILLAGE_SPOTS[k];
    const displayKanji = k;
    return {
      html: `<span class="fork-kanji tier-${getKanjiTier(displayKanji)}">${escapeHtml(displayKanji)}</span>` +
        `<span class="fork-omen">${escapeHtml(pickLang(def.title))}</span>`,
      onClick: () => enterVillageSpot(k),
      cls: "fork-tile"
    };
  });

  // Always allow returning to the Gaol Select screen without any artificial fog roadblock
  tiles.push({
    label: pickLang(ST_L(
      "⛩ Leave Village",
      "⛩ 마을 어귀를 나선다",
      "⛩ 里の外れへ出る"
    )),
    onClick: () => leaveVillageToSelect(),
    gold: st.unlockedDepth >= 1,
    cls: "fork-return-btn"
  });

  setDockActions(tiles);
}

function leaveVillageToSelect() {
  playClickSfx();
  state.active = false;
  persistStoryState();
  transitionToView("select");
}

function enterVillageSpot(spotKey) {
  if (typeof playFootstepSfx === "function") playFootstepSfx();
  else playClickSfx();

  const st = ensureStoryConfig();
  const def = VILLAGE_SPOTS[spotKey] || VILLAGE_SPOTS.塾;
  state.phase = "village_spot";
  state.villageSpot = spotKey;
  // Stage sign remains strictly the place/building kanji (塾, 炉, 橋, 家, etc.)
  state.sign = spotKey;
  state.enemyKanji = "";
  state.fieldState = pickLang(def.title);

  // Record met NPC in st.metNpcs (never place kanji!)
  if (def.npcKanji) {
    recordVillageNpcMet(def.npcKanji);
  } else if (spotKey === "家" && st.catRescued) {
    recordVillageNpcMet("猫");
  }

  logMd(`→ 【${spotKey}】 *${pickLang(def.title)}*`, "choice-log");

  if (spotKey === "塾") {
    logSenseiArrival();
  } else if (spotKey === "炉") {
    logElderArrival();
  } else if (spotKey === "橋") {
    logFriendArrival();
  } else if (spotKey === "家") {
    logHomeArrival();
  } else if (spotKey === "井") {
    logMd(pickLang(ST_L(
      "💧 **【女】** — Beside the bone-dry stone well, a gaunt woman rinses bloodstained linen in a wooden basin. Her lips move in silent repetition, trying not to forget her missing family's names.",
      "💧 **【女】** — 바닥이 갈라진 돌우물 곁에서 야윈 여인이 핏물 배인 무명천을 나무 대야에 담가 조용히 헹구고 있다. 행방불명된 가족의 이름이라도 잊지 않으려는 듯, 갈라진 입술로 같은 음절만 끝없이 되뇌고 있다.",
      "💧 **【女】** — 底のひび割れた石井戸の傍らで、痩せ細った女が血の滲んだ木綿布を盥で静かに濯いでいる。行方知れずの家族の名だけでも忘れまいと、乾いた唇で同じ音を繰り返していた。"
    )), "event-log");
  } else if (spotKey === "鍛") {
    logMd(pickLang(ST_L(
      "⚒ **【男】** — Next to a cold furnace, a one-armed smith hammers a notched blade against a cracked anvil. Every strike scatters faint sparks of ink and iron across the ash.",
      "⚒ **【男】** — 불씨가 식어가는 화덕 곁에서 애꾸눈 대장장이가 이 빠진 검신을 갈라진 모루 위에 놓고 묵묵히 두드리고 있다. 망치가 내려앉을 때마다 쇳가루와 먹물이 섞인 서늘한 불꽃이 잿더미 위로 튄다.",
      "⚒ **【男】** — 火の消えかけた炉の傍らで、隻眼の鍛冶屋が刃こぼれした刀身をひび割れた金床に置いて黙々と打っている。槌が振り下ろされるたび、鉄粉と墨の混じった火花が灰の上に散った。"
    )), "event-log");
  } else if (spotKey === "祠") {
    logMd(pickLang(ST_L(
      "⛩ Beneath a withered sacred tree stands a moss-covered shrine bound in frayed crimson rope. A cool breeze seeps from the stone crack, momentarily clearing the fog in your mind.",
      "⛩ 말라비틀어진 당산나무 아래, 해진 붉은 금줄이 감긴 돌사당이 안개를 마주 보고 서 있다. 이끼 낀 바위 틈새로 서늘한 바람이 흘러나와 흐려진 정신을 잠시 맑게 깨운다.",
      "⛩ 枯れ果てた御神木の下、擦り切れた朱の注連縄が巻かれた石祠が霧に向き合って立っている。苔むした岩の隙間から涼やかな風が流れ出し、濁った意識をひととき澄ませてくれた。"
    )), "event-log");
  } else if (spotKey === "墓") {
    logMd(pickLang(ST_L(
      "🪦 Rows of tilted gravestones stand in the mist, every carved name chiseled away into blank stone. Residual echoes of those who died nameless still cling to the damp earth.",
      "🪦 비스듬히 기울어진 돌비석들이 안개 속에 줄지어 서 있으나, 비문마다 새겨져 있던 이름은 모두 깎여 나가 텅 비어 있다. 이름조차 남기지 못하고 스러진 망자들의 잔향만이 축축한 흙더미 위에 맴돈다.",
      "🪦 斜めに傾いた墓石が霧の中に並んでいるが、刻まれていたはずの名はすべて削り取られ空白となっている。名すら残せず散った亡者たちの残響だけが湿った土の上に漂っていた。"
    )), "event-log");
  }

  updateBattleHUD(false);
  renderVillageSpotChoices(spotKey);
}

function returnToVillageCrossroads() {
  if (typeof playFootstepSfx === "function") playFootstepSfx();
  else playClickSfx();
  state.phase = "village_path";
  state.villageSpot = "";
  state.sign = "里";
  state.enemyKanji = "";
  state.fieldState = pickLang(ST_L(
    "Ash-veiled hometown crossroads.",
    "검은 재와 안개에 잠긴 고향 갈림길.",
    "灰と霧に沈んだ故郷の辻。"
  ));
  updateBattleHUD(false);
  renderVillageFork();
}

/* ---- 1. 【塾】 꺼져가는 서당 — 옛 스승 【先】 ---- */

function logSenseiArrival() {
  const st = ensureStoryConfig();
  const phase = getStoryNarrativePhase();

  if (st.introStage < 2 || st.unlockedDepth < 1) {
    logMd(pickLang(ST_L(
      "🕯 **【先】** — Inside the half-collapsed study hall, your old Sensei guards a single paper lantern against the creeping mist.\n*\"You returned to this ruined hometown after all… Take this talisman before the fog devours your name too.\"*",
      "🕯 **【先】** — 반쯤 무너진 서당 안에서 백발의 옛 스승이 흩어진 목간을 모아 등불의 심지를 돋우고 있다.\n*\"하필 고향이 이 지경이 된 때에 돌아왔구나… 절벽의 안개에 네 이름마저 먹히기 전에 어서 이 부적을 받아 두거라.\"*",
      "🕯 **【先】** — 半ば崩れた書堂の中で、白髪の師が散らばった木簡を集めて提灯の芯をかき立てている。\n*「よりによって故郷がこのような時に戻ったか……崖の霧にお前の名まで喰われる前に、この護符を受け取れ。」*"
    )), "event-log");
    return;
  }

  if (phase === "shura_12") {
    logMd(pickLang(ST_L(
      "🕯 **【先】** — As you step across the threshold, the lantern flame shrinks back and Sensei's hand trembles on his cane.\n*\"Stay back…! The stench of the 12th Abyss clings to your blade. In trying to slay the curses, you have become a Shura yourself…\"*",
      "🕯 **【先】** — 당신이 문턱을 넘자 서당의 등불이 파르르 오그라들고, 스승은 지팡이를 쥔 손을 떨며 뒷걸음질 친다.\n*\"다가오지 마라…! 네 칼끝에서 제12옥 나락의 역겨운 묵향이 진동하는구나. 괴물을 베려다 스스로 수라가 되었어…\"*",
      "🕯 **【先】** — お前が敷居を跨ぐと書堂の灯が縮こまり、師は杖を握る手を震わせて後ずさった。\n*「近づくな……！ お前の刃から第十二獄・奈落の悍ましい墨香が漂っている。怪物を斬ろうとして自ら修羅と化したか……」*"
    )), "event-log");
  } else if (phase === "abyss_11") {
    logMd(pickLang(ST_L(
      "🕯 **【先】** — Sensei stares in disbelief at the ancient ink scars seeping through your sleeves.\n*\"Why did you unseal the 11th Gate?! Those primeval characters were banished from human speech because no mortal mind can bear them!\"*",
      "🕯 **【先】** — 스승은 당신의 소매 끝에 배어든 기괴한 고대 문자의 낙인을 보며 경악을 금치 못한다.\n*\"어째서 제11옥 수왕묘의 금제를 찢은 게냐! 그 너머의 글자들은 인간의 정신으로 감당할 수 없어 옛 성현들이 도려낸 저주란 말이다!\"*",
      "🕯 **【先】** — 師はお前の袖に染みついた奇怪な古代文字の烙印を見て愕然と目を見開いた。\n*「なぜ第十一獄・獣王廟の禁制を破った！ あの先の文字は人の精神では耐えきれず、古の聖賢が切り捨てた呪いだというのに！」*"
    )), "event-log");
  } else if (phase === "peace_10") {
    logMd(pickLang(ST_L(
      "🕯 **【先】** — Warm light fills the study hall as Sensei looks over the restored wooden tablets with quiet relief.\n*\"You felled the lord of the 10th Gaol… The 2,136 Common Kanji have returned to the villagers' lips. Do not look beneath the floor—rest now.\"*",
      "🕯 **【先】** — 서당 창살 너머로 맑은 볕이 스며들고, 스승은 글자가 되돌아온 서책들을 어루만지며 깊은 안도의 한숨을 내쉰다.\n*\"기어이 제10옥의 주인을 베었구나… 마을 사람들의 입술에 상용의 말들이 돌아오고 있다. 이제 바닥 너머의 기척은 잊고 칼을 놓아라.\"*",
      "🕯 **【先】** — 書堂の格子から澄んだ陽差しが差し込み、師は文字の戻った書物を撫でながら深い安堵の息をついた。\n*「ついに第十獄の主を斬り伏せたか……里人の唇に常用の言葉が戻ってきている。もう底の気配など忘れて刃を置け。」*"
    )), "event-log");
  } else {
    logMd(pickLang(ST_L(
      `🕯 **【先】** — Sensei trims the lantern wick and nods as you step out of the cold mist.\n*"So long as you carry **【生】**, this lantern will guide your soul home even in death. Up to the **${st.unlockedDepth}th Gaol** is unsealed—prepare well."*`,
      `🕯 **【先】** — 스승이 등불의 심지를 곧추세우며 안개를 헤치고 돌아온 당신을 맞이한다.\n*"품에 **【生】**을 지닌 한, 설령 옥문에서 쓰러져도 이 등불이 네 혼을 불러들일 것이다. 현재 **제${st.unlockedDepth}옥**까지 봉인이 풀렸으니 단단히 대비하거라."*`,
      `🕯 **【先】** — 師は提灯の芯を整え、霧を抜けて戻ったお前を迎えた。\n*「懐に**【生】**がある限り、たとえ獄門で倒れてもこの灯が魂を呼び戻す。今は**第${st.unlockedDepth}獄**まで封印が解けているゆえ、抜かりなく備えよ。」*`
    )), "event-log");
  }
}

/* ---- 2. 【炉】 잿빛 화로터 — 눈먼 노인 【老】 ---- */

function logElderArrival() {
  const phase = getStoryNarrativePhase();
  if (phase === "shura_12") {
    logMd(pickLang(ST_L(
      "🔥 **【老】** — The blind Elder inhales the dark miasma trailing behind you and lets out a dry, rasping laugh.\n*\"Heh… you swallowed even the 12th Abyss. No need to read characters anymore—you are the living lexicon of nightmares itself.\"*",
      "🔥 **【老】** — 눈먼 노인이 당신의 뒤를 따르는 검붉은 마기를 들이마시더니 갈라진 목소리로 껄껄 웃는다.\n*\"허허… 기어이 제12옥 나락의 글자들까지 남김없이 삼켰구먼. 이제 자네는 글자를 읽는 자가 아니라, 걸어 다니는 심연의 자전 그 자체야.\"*",
      "🔥 **【老】** — 盲目の老人はお前の背後に漂う黒き瘴気を吸い込み、乾いた声でくっくと笑った。\n*「ふふ……ついに第十二獄・奈落の文字まで呑み込んだか。もはや貴様は文字を読む者ではなく、歩く深淵の字典そのものよ。」*"
    )), "event-log");
  } else if (phase === "abyss_11") {
    logMd(pickLang(ST_L(
      "🔥 **【老】** — Greenish flames dance in the ash brazier as the Elder turns his milky eyes toward you.\n*\"Once a swordsman tastes the primeval strokes beyond the Common fence, lukewarm mortal words never satisfy the blade again.\"*",
      "🔥 **【老】** — 화로 속에서 푸르스름한 불길이 일렁이고, 노인이 희뿌연 눈동자를 들어 당신을 바라본다.\n*\"상용의 울타리 너머에 잠든 태고의 획 맛을 본 자는, 다시는 미지근한 인간 세상의 말로 만족하지 못하는 법이지.\"*",
      "🔥 **【老】** — 火炉の中で青白い炎が揺らめき、老人は白濁した瞳を向けて呟いた。\n*「常用の垣根を越えた太古の画の味を知った者は、二度と生ぬるい人の世の言葉などでは満たされぬものよ。」*"
    )), "event-log");
  } else {
    logMd(pickLang(ST_L(
      "🔥 **【老】** — Sitting cross-legged before an iron brazier of glowing ash, a blind old man warms his withered hands.\n*\"Every Kanji is a cage binding an ancient spirit inside its strokes. If you carry spare characters, cast them into my flames.\"*",
      "🔥 **【老】** — 불씨만 남은 무쇠 화로 앞에서 백내장 낀 눈의 노인이 마른 손바닥을 쬐며 중얼거린다.\n*\"한자란 본디 태고의 악귀와 사념을 획이라는 창살 안에 가둔 감옥이지. 남는 글자가 있거든 내 화로에 던져 넣어 보게.\"*",
      "🔥 **【老】** — 熾火の残る鉄火炉の前で、白濁した目の老人が枯れ枝のような手をかざして呟いている。\n*「漢字とは本来、太古の悪鬼や思念を画という格子に閉じ込めた牢獄よ。余った文字があるならわしの火炉へ投げ入れてみよ。」*"
    )), "event-log");
  }
}

/* ---- 3. 【橋】 안개 낀 돌다리 — 옛 벗 【友】 ---- */

function logFriendArrival() {
  const st = ensureStoryConfig();
  const phase = getStoryNarrativePhase();

  if (phase === "shura_12") {
    logMd(pickLang(ST_L(
      "🗡 **【友】** — Your old friend instinctively grips his broken hilt, cold sweat running down his pale jaw.\n*\"…For a heartbeat just now, I didn't see my childhood friend walking across the bridge. I saw a towering blood-red 【殺】.\"*",
      "🗡 **【友】** — 돌다리 난간에 기대어 있던 옛 벗이 무의식중에 부러진 칼자루를 움켜쥐며 창백하게 굳는다.\n*\"…방금 안개 속에서 네가 걸어오는데, 내 어릴 적 친구가 아니라 피로 휘갈겨 쓴 거대한 살 자가 걸어오는 줄 알았어.\"*",
      "🗡 **【友】** — 石橋の欄干に凭れていた旧友は無意識に折れた柄を握りしめ、青ざめて凍りついた。\n*「……今、霧の中からお前が歩いてきた時、幼馴染ではなく血で殴り書きされた巨大な『殺』の字が迫ってくるのかと思ったよ。」*"
    )), "event-log");
  } else if (!st.friendGiftClaimed) {
    logMd(pickLang(ST_L(
      "🗡 **【友】** — Leaning against the broken bridge parapet with his arm in bloodstained bandages, your childhood friend's eyes widen.\n*\"You're alive! When the cliff split open, living characters crawled out of the abyss—my blade shattered just holding the bridge…\"*",
      "🗡 **【友】** — 무너진 돌다리 난간에 기대어 피 묻은 붕대로 한쪽 팔을 동여맨 옛 벗이 당신을 발견하고 눈을 크게 뜬다.\n*\"살아 돌아왔구나! 북쪽 절벽이 갈라지며 기어 나온 괴이한 글자들을 막아내다 칼은 두 동강이 나고 팔만 이 꼴이 됐어…\"*",
      "🗡 **【友】** — 崩れた石橋の欄干に凭れ、血の滲む包帯で片腕を吊った旧友がお前に気づいて目を見開いた。\n*「生きて戻ったか！ 北の崖が割れて這い出てきた怪異な文字どもを食い止めようとして、刀は折れ腕もこのざまだ……」*"
    )), "event-log");
  } else {
    const line = st.catRescued
      ? pickLang(ST_L(
          "🗡 **【友】** — Your friend smiles faintly as he watches the mist beneath the bridge.\n*\"That little black cat 【猫】 you pulled out of the Gaol ran straight toward your ruined home 【家】. At least one life was saved.\"*",
          "🗡 **【友】** — 옛 벗이 다리 아래 안개를 내려다보며 희미하게 웃어 보인다.\n*\"네가 옥문 안개 속에서 구해 온 그 작은 검은 고양이【猫】 말야, 네 옛 본가【家】 아궁이 쪽으로 달려가던데. 가서 한번 봐 줘.\"*",
          "🗡 **【友】** — 旧友は橋の下の霧を見下ろしながら微かに笑みを浮かべた。\n*「お前が獄門の霧から救い出したあの小さな黒猫【猫】なら、崩れた生家【家】のかまどの方へ駆けていったぞ。見に行ってやれよ。」*"
        ))
      : pickLang(ST_L(
          "🗡 **【友】** — Your friend adjusts his sling and gazes toward the northern cliff.\n*\"Right before I retreated from the lower Gaols, I heard a small black cat 【猫】 crying somewhere inside the mist. Keep an ear out if you go deeper.\"*",
          "🗡 **【友】** — 옛 벗이 붕대 감긴 팔을 고쳐 매며 북쪽 절벽 쪽을 돌아본다.\n*\"다쳐서 후퇴하기 직전에 옥문 안개 너머에서 어린 검은 고양이【猫】 울음소리를 들었어. 혹시 아래층을 탐색하다 마주치면 구해 주라.\"*",
          "🗡 **【友】** — 旧友は包帯の腕をさすりながら北の崖の方を振り返った。\n*「怪我をして退く直前、獄門の霧の奥で小さな黒猫【猫】の鳴き声を聞いたんだ。もし下層で出くわしたら助けてやってくれ。」*"
        ));
    logMd(line, "event-log");
  }
}

/* ---- 4. 【家】 무너진 본가 — 옛집과 고양이 【猫】 ---- */

function logHomeArrival() {
  const st = ensureStoryConfig();
  if (st.catRescued) {
    logMd(pickLang(ST_L(
      "🐱 **【猫】** — Beneath the collapsed beams of your childhood home, the rescued black cat curls up beside the warm hearthstone and purrs softly. Having a living soul waiting at home steadies your breathing.",
      "🐱 **【猫】** — 무너진 본가 처마 아래, 옥문에서 구출한 검은 고양이가 아궁이의 온기 곁에 몸을 말고 앉아 반갑게 골골거린다. 돌아올 집에 살아 숨 쉬는 생명이 기다리고 있다는 사실만으로도 마음이 한결 놓인다.",
      "🐱 **【猫】** — 崩れた生家の軒下で、獄門から救い出した黒猫がかまどの温もりの傍らで丸くなり喉を鳴らしている。帰るべき家に生きる命が待っているというだけで、荒れた呼吸が静かに整っていく。"
    )), "event-log");
  } else {
    logMd(pickLang(ST_L(
      "🏚 Half the roof of your childhood home has caved in, and cold ash piles inside the empty hearth. Only the wooden nameplate by the gate—stripped of its characters—reminds you of the family that once lived here.",
      "🏚 어린 시절 자라난 본가의 지붕은 반쯤 내려앉아 있고, 불 꺼진 아궁이 안에는 차가운 재만 수북이 쌓여 있다. 글자가 감쪽같이 파여 나간 문패만이 이곳에 한때 따뜻한 삶이 있었음을 희미하게 증언한다.",
      "🏚 幼き日を過ごした生家の屋根は半ば崩れ落ち、火の消えたかまどには冷たい灰だけが積もっている。文字の削り取られた表札だけが、かつてここにあった暮らしを微かに物語っていた。"
    )), "event-log");
  }
}

/* ---- Interactive Choices at Each Village Spot (#choice-panel) ---- */

function renderVillageSpotChoices(spotKey) {
  const st = ensureStoryConfig();
  const actions = [];

  if (spotKey === "塾") {
    // 1. Always show the Talisman of Life / Gaol 1 unlock button first if not yet claimed
    if (st.introStage < 2 || st.unlockedDepth < 1 || countSpecialItem("talisman_life") === 0) {
      actions.push({
        label: pickLang(ST_L(
          "🕯 Receive 【生】 Talisman of Return to Life",
          "🕯 【生】 생환의 부적을 받는다",
          "🕯 【生】生還の護符を受け取る"
        )),
        gold: true,
        onClick: () => {
          playSealStampSfx();
          st.introStage = 2;
          if (st.unlockedDepth < 1) st.unlockedDepth = 1;
          addSpecialItem("talisman_life", 1);
          persistStoryState();
          logMd(pickLang(ST_L(
            "🕯 **【先】** — *\"Fasten this **【生】 Talisman** to your chest. Even if the wraiths tear your body apart, my lantern will pull your soul back to this village. The path to the **1st Gaol** lies beneath the northern cliff.\"*",
            "🕯 **【先】** — *\"이 **【生】 생환의 부적**을 가슴 깊이 품어라. 설령 옥문 아래에서 몸이 부서지더라도 이 등불이 네 혼백과 기억을 마을로 되불러들일 것이다. 북쪽 절벽 아래 **제1옥**으로 내려가는 길이 열렸으니 조심하거라.\"*",
            "🕯 **【先】** — *「この**【生】生還の護符**を懐深くに収めよ。たとえ獄門の底で身が砕けようとも、この灯がお前の魂と記憶を里へ呼び戻す。北の崖下に**第一獄**への道が開いたゆえ、気をつけて行け。」*"
          )), "event-log");
          logMd(pickLang(ST_L(
            "🕯 Received **【生】 Talisman of Return to Life** — **【01 獄門】** is now unlocked!",
            "🕯 **【특수 소지: 【生】 생환의 부적】** 획득 — 북쪽 절벽 아래 **【01 獄門】**이 해금되었습니다!",
            "🕯 **【特殊所持：【生】生還の護符】** 獲得 — 北の崖下 **【01 獄門】** が解禁された！"
          )), "fx-log");
          updateBattleHUD(false);
          renderVillageSpotChoices("塾");
        }
      });
    }

    // 2. Natural cycling conversation with Sensei 【先】 (no (1/4) counters)
    actions.push({
      label: pickLang(ST_L(
        "💬 Speak with Sensei 【先】",
        "💬 스승【先】과 이야기를 나눈다",
        "💬 師【先】と語り合う"
      )),
      onClick: () => {
        playClickSfx();
        const cur = (st.senseiTalkStep || 0) % 4;
        st.senseiTalkStep = (st.senseiTalkStep || 0) + 1;
        persistStoryState();
        if (cur === 0) {
          logMd(pickLang(ST_L(
            "🕯 **【先】** — *\"Three moons ago, the northern cliff split open and black ink-mist poured over our roofs. Every character carved on signs and scrolls rose up as a hungry wraith, and villagers who lost their names forgot even how to speak.\"*",
            "🕯 **【先】** — *\"석 달 전 북쪽 절벽이 갈라지더니 먹물 같은 안개가 마을을 덮쳤단다. 현판과 서책에 적혀 있던 글자들이 일제히 아귀처럼 일어나 사람들을 덮쳤고, 이름을 빼앗긴 마을 사람들은 말하는 법조차 잊은 채 껍데기만 남았지.\"*",
            "🕯 **【先】** — *「三月前、北の崖が割れて墨のような霧が里を覆ったのだ。扁額や書物に記されていた文字が一斉に餓鬼となって人々を襲い、名を奪われた里人は話すことすら忘れて抜け殻となってしまった。」*"
          )), "event-log");
        } else if (cur === 1) {
          logMd(pickLang(ST_L(
            "🕯 **【先】** — *\"This lantern burns oil pressed from ancient sutra ashes. So long as you carry 【生】, death in the Gaol is not the end—though the wraiths will strip the loose Kanji from your satchel unless you bind them with protective talismans.\"*",
            "🕯 **【先】** — *\"이 등불은 옛 경전을 태운 재와 기름으로 타오르고 있다. 네가 【生】을 지닌 한 옥문에서 목숨을 잃어도 혼백은 이곳으로 돌아오지만, 품에 지닌 일반 한자들은 안개에 흩어지니 소지의 부적이나 방울로 대비해야 할 것이다.\"*",
            "🕯 **【先】** — *「この提灯は古の経典を焼いた灰と油で灯っている。お前が【生】を持つ限り獄門で果てても魂はここへ戻るが、袋の一般漢字は霧に散ってしまうゆえ、護符や鈴で備えるがよい。」*"
          )), "event-log");
        } else if (cur === 2) {
          logMd(pickLang(ST_L(
            "🕯 **【先】** — *\"From the 1st Gaol to the 6th Gaol are the fundamental Education Kanji we taught children in this very hall. From the 7th to the 10th Gaol lie the rest of the 2,136 Common Kanji—slay each Gaol's master to break the seal to the next depth.\"*",
            "🕯 **【先】** — *\"제1옥부터 제6옥까지는 바로 이 서당에서 아이들에게 가르치던 교육한자들이고, 제7옥부터 제10옥까지가 인간 세상의 상용한자 2,136자이니라. 각 옥문의 우두머리를 베어야만 다음 층으로 내려가는 봉인이 풀린다.\"*",
            "🕯 **【先】** — *「第一獄から第六獄まではこの書堂で童たちに教えていた教育漢字であり、第七獄から第十獄までが人の世の常用漢字2,136字だ。各獄門の主を斬り伏せねば次の階層への封印は解かれぬ。」*"
          )), "event-log");
        } else {
          logMd(pickLang(ST_L(
            "🕯 **【先】** — *\"Listen closely… If you ever defeat the lord of the 10th Gaol, our village will be saved. Never pry open the seal beneath the 10th floor—the 11th and 12th depths hold primeval curses that turn men into Shura.\"*",
            "🕯 **【先】** — *\"명심하거라… 제10옥 저승의 주인까지만 베어내면 고향의 안개는 걷히고 사람들의 말도 모두 돌아온다. 부디 제10옥 바닥 너머, 인간이 감당할 수 없어 도려낸 제11옥과 제12옥의 금제에는 절대 손을 대지 마라.\"*",
            "🕯 **【先】** — *「よく聞け……第十獄・冥府の主さえ討てば故郷の霧は晴れ、人々の言葉もすべて戻る。ゆえに第十獄の底のさらに奥、人が耐えきれず切り捨てた第十一獄と第十二獄の禁制には決して触れるでないぞ。」*"
          )), "event-log");
        }
        renderVillageSpotChoices("塾");
      }
    });

    // 3. Offerings & Tea (available once intro is done)
    if (st.introStage >= 2 && st.unlockedDepth >= 1) {
      if (st.senseiOfferingStage === 0 && countSpecialItem("talisman_keep") === 0) {
        const cost = 80;
        actions.push({
          label: pickLang(ST_L(
            `📿 Lantern Offering · 【持】 Cord of Retention · ${cost} 円`,
            `📿 등불 공양 · 【持】 소지의 부적 · ${cost} 円`,
            `📿 灯への供養 · 【持】所持の護符 · ${cost} 円`
          )),
          gold: st.yen >= cost,
          onClick: () => {
            if (st.yen < cost) {
              playClickSfx();
              logMd(`🕯 잔향이 부족합니다 (**${cost} 円** 필요).`, "hint-log");
              return;
            }
            playSealStampSfx();
            addStoryYen(-cost);
            st.senseiOfferingStage = 1;
            addSpecialItem("talisman_keep", 1);
            persistStoryState();
            logMd(pickLang(ST_L(
              "📿 Acquired **【持】 Cord of Retention** — Preserves up to **5 random Kanji** on death or retreat.",
              "📿 **【특수 소지: 【持】 소지의 부적】** 획득 — 사망·후퇴 시 일반 소지 한자 중 **무작위 최대 5장**을 지켜냅니다.",
              "📿 **【特殊所持：【持】所持の護符】** 獲得 — 死亡・撤退時に一般所持から**ランダム最大5枚**を保全する。"
            )), "fx-log");
            updateBattleHUD(false);
            renderVillageSpotChoices("塾");
          }
        });
      } else if (st.senseiOfferingStage >= 1 && countSpecialItem("talisman_return") === 0) {
        const cost = 160;
        actions.push({
          label: pickLang(ST_L(
            `🔔 Altar Offering · 【帰】 Bell of Return · ${cost} 円`,
            `🔔 제단 공양 · 【帰】 귀환의 방울 · ${cost} 円`,
            `🔔 祭壇供養 · 【帰】帰還の鈴 · ${cost} 円`
          )),
          gold: st.yen >= cost,
          onClick: () => {
            if (st.yen < cost) {
              playClickSfx();
              logMd(`🕯 잔향이 부족합니다 (**${cost} 円** 필요).`, "hint-log");
              return;
            }
            playSealStampSfx();
            addStoryYen(-cost);
            st.senseiOfferingStage = 2;
            addSpecialItem("talisman_return", 1);
            persistStoryState();
            logMd(pickLang(ST_L(
              "🔔 Acquired **【帰】 Bell of Unbroken Return** — Shatters on death or retreat to preserve 100% of your bag once.",
              "🔔 **【특수 소지: 【帰】 귀환의 방울】** 획득 — 사망·후퇴 시 방울이 부서지며 가방 한자를 **100% 보전**합니다.",
              "🔔 **【特殊所持：【帰】帰還の鈴】** 獲得 — 死亡・撤退時に砕け散り、袋の漢字を**100%保全**する。"
            )), "fx-log");
            updateBattleHUD(false);
            renderVillageSpotChoices("塾");
          }
        });
      }

      if (!st.senseiBlessedNextRun) {
        const cost = 50;
        actions.push({
          label: pickLang(ST_L(
            `🍵 Medicinal Tea · ${cost} 円`,
            `🍵 쓴 약차 마시기 · ${cost} 円`,
            `🍵 薬茶を飲む · ${cost} 円`
          )),
          onClick: () => {
            if (st.yen < cost) {
              playClickSfx();
              logMd(`🕯 잔향이 부족합니다 (**${cost} 円** 필요).`, "hint-log");
              return;
            }
            playHealSfx();
            addStoryYen(-cost);
            st.senseiBlessedNextRun = true;
            state.maxHp += 15;
            state.playerHp = state.maxHp;
            state.rerollTokens += 1;
            persistStoryState();
            logMd("🍵 스승이 달여 준 쓴 약차를 마시자 단전에 따뜻한 기운이 돕니다 (**다음 출정 최대 HP +15 · 무료 리롤 +1**).", "fx-log");
            updateBattleHUD(false);
            renderVillageSpotChoices("塾");
          }
        });
      }
    }
  } else if (spotKey === "炉") {
    actions.push({
      label: pickLang(ST_L(
        "💬 Speak with the blind Elder 【老】",
        "💬 화로 너머 노인【老】과 이야기를 나눈다",
        "💬 火炉の老人【老】と語り合う"
      )),
      gold: !st.elderRelicClaimed,
      onClick: () => {
        if (!st.elderRelicClaimed) {
          st.elderRelicClaimed = true;
          addSpecialItem("talisman_god", 1);
          state.freeSummons = countSpecialItem("talisman_god");
          state.rerollTokens += 1;
          persistStoryState();
          playSealStampSfx();
          logMd(pickLang(ST_L(
            "🔥 **【老】** — *\"Mortals think characters are mere marks of ink, yet every stroke is an iron bar caging an ancient spirit. Take this obsidian bead—it will let you call upon a slumbering god once without shedding your own blood.\"*",
            "🔥 **【老】** — *\"범인들은 글자를 그저 종이 위의 먹물 자국으로 여기지만, 본디 한자의 획 하나하나는 태고의 사념을 가둔 쇠창살일세. 자, 내 옛 눈동자 대신 지니고 있던 이 흑요석을 가져가게. 피를 흘리지 않고도 잠든 고신을 한 번 불러낼 수 있을 거야.\"*",
            "🔥 **【老】** — *「凡人は文字をただの墨の跡と思うが、本来一画一画は太古の思念を閉じ込めた鉄格子よ。ほれ、わしの目の代わりに持っていたこの黒曜石を持っていけ。血を流さずとも眠れる古神を一度だけ呼び出せるはずじゃ。」*"
          )), "event-log");
          logMd(pickLang(ST_L(
            "👁 Acquired **【眼】 Bead of the Mind's Eye** — Every run starts with **Free Summon +1 & Free Reroll +1**!",
            "👁 **【특수 소지: 【眼】 심안의 부적】** 획득 — 매 출정마다 **무료 고신 소환 +1 · 무료 리롤 +1**이 부여됩니다!",
            "👁 **【特殊所持：【眼】心眼の護符】** 獲得 — 毎回の出陣時に**無料古神召喚+1・無料リロール+1**が付与される！"
          )), "fx-log");
          updateBattleHUD(false);
        } else {
          playClickSfx();
          const cur = (st.elderTalkStep || 0) % 4;
          st.elderTalkStep = (st.elderTalkStep || 0) + 1;
          persistStoryState();
          if (cur === 0) {
            logMd(pickLang(ST_L(
              "🔥 **【老】** — *\"In the beginning, shaman-kings carved tortoise shells with red-hot bronze to bind rampaging calamities into shapes. When you combine two Kanji in battle, you are clashing two cages together to unleash their trapped fury.\"*",
              "🔥 **【老】** — *\"태초에 무왕들이 달군 청동 송곳으로 거북 등딱지를 지져, 날뛰는 재앙을 모양 속에 가둔 것이 한자의 시작이었지. 전장에서 두 글자를 합쳐 내리치는 건 두 감옥을 충돌시켜 그 안의 원념을 폭발시키는 주술일세.\"*",
              "🔥 **【老】** — *「太古の昔、巫王たちが焼いた青銅の錐で亀甲を穿ち、荒ぶる災厄を形の中に封じたのが漢字の始まりよ。戦場で二字を合わせて叩き込むのは、二つの牢獄をぶつけて中の怨念を爆発させる呪術なのじゃ。」*"
            )), "event-log");
          } else if (cur === 1) {
            logMd(pickLang(ST_L(
              "🔥 **【老】** — *\"Cast any two characters into my ash brazier with 80 Yen of echoes, and the fire will bind them side by side into a single compound card. Or if your satchel is cluttered, burn unwanted script into pure Yen.\"*",
              "🔥 **【老】** — *\"가방의 글자 두 장에 잔향 80엔을 얹어 내 화로에 던져 넣으면, 불길이 두 글자를 그대로 이어 붙여 한 장의 합자 카드로 묶어 주지. 쓸모없는 패가 넘치거든 불에 태워 잔향으로 환원해도 좋고.\"*",
              "🔥 **【老】** — *「袋の文字二枚に残響80円を添えてわしの火炉へ投げ入れれば、炎が二字をそのまま繋ぎ合わせて一枚の合字札に束ねてくれる。不要な札が溢れているなら、焼いて残響に還すがよい。」*"
            )), "event-log");
          } else if (cur === 2) {
            logMd(pickLang(ST_L(
              "🔥 **【老】** — *\"When your hand lacks the right element in combat, calling an Ancient God forces a high-tier character into your palm. My 【眼】 bead covers the first toll, but further summons will drink your own lifeblood.\"*",
              "🔥 **【老】** — *\"전투 중에 적의 약점을 찌를 마땅한 패가 없을 땐 고신을 불러내어 강력한 글자를 강제로 쥐는 수밖에 없지. 내가 준 【眼】 부적이 첫 대가를 대신 치러 주겠지만, 그다음부턴 자네의 생혈을 갉아먹을 걸세.\"*",
              "🔥 **【老】** — *「戦いの最中に敵の弱点を突く札がない時は、古神を呼び出して強い文字を強引に握るほかない。わしがやった【眼】の護符が最初の代償を肩代わりするが、次からは貴様の生血を啜ることになるぞ。」*"
            )), "event-log");
          } else {
            logMd(pickLang(ST_L(
              "🔥 **【老】** — *\"Your Sensei fears the 11th and 12th depths because humans trimmed their language down to 2,136 tame characters. Yet the 4,000 abandoned characters below the 10th floor hold the rawest power in existence… heh.\"*",
              "🔥 **【老】** — *\"서당의 스승은 제11옥과 제12옥을 두려워하지만, 본디 상용한자 2,136자란 인간들이 다루기 쉬운 글자만 남기고 나머지를 도려낸 울타리에 불과해. 진짜배기 태고의 힘은 버려진 사천 글자가 잠든 심연 밑바닥에 있지… 허허.\"*",
              "🔥 **【老】** — *「書堂の師は第十一獄と第十二獄を恐れておるが、常用漢字2,136字など人間が扱いやすい文字だけを残した檻にすぎぬ。本物の太古の力は、捨てられた四千の文字が眠る深淵の底にあるのよ……ふふ。」*"
            )), "event-log");
          }
        }
        renderVillageSpotChoices("炉");
      }
    });

    actions.push({
      label: pickLang(ST_L(
        "🔥 Kanji Fusion · 80 円",
        "🔥 합자 연성 · 80 円",
        "🔥 合字錬成 · 80 円"
      )),
      onClick: () => openVillageBrazierFuse()
    });

    actions.push({
      label: pickLang(ST_L(
        "🕯 Burn Kanji · +35 円",
        "🕯 한자 소각 · +35 円",
        "🕯 漢字焼却 · +35 円"
      )),
      onClick: () => openVillageBrazierBurn()
    });

    if ((st.defeatedFoes || []).length > 0) {
      actions.push({
        label: pickLang(ST_L(
          "💀 Re-summon Slain Wraiths · 60 円",
          "💀 토벌한 원령 재소환 · 60 円",
          "💀 討伐した怨霊の再召喚 · 60 円"
        )),
        onClick: () => {
          if (st.yen < 60) {
            playClickSfx();
            logMd("🔥 잔향이 부족합니다 (**60 円** 필요).", "hint-log");
            return;
          }
          playGongSfx();
          addStoryYen(-60);
          st.defeatedFoes = [];
          state.defeatedEnemies = [...(st.defeatedBosses || [])];
          persistStoryState();
          logMd("💀 화로에서 검은 연기가 치솟으며 옥문의 일반·정예 원령들이 다시 깨어났습니다.", "fx-log");
          updateBattleHUD(false);
          renderVillageSpotChoices("炉");
        }
      });
    }
  } else if (spotKey === "橋") {
    actions.push({
      label: pickLang(ST_L(
        "💬 Speak with your old friend 【友】",
        "💬 옛 벗【友】과 이야기를 나눈다",
        "💬 旧友【友】と語り合う"
      )),
      gold: !st.friendGiftClaimed,
      onClick: () => {
        if (!st.friendGiftClaimed) {
          playSealStampSfx();
          st.friendGiftClaimed = true;
          addStoryYen(80);
          addSpecialItem("talisman_wealth", 1);
          const cap = typeof MAX_DECK_SIZE !== "undefined" ? MAX_DECK_SIZE : 40;
          ["火", "水", "刀"].forEach(k => {
            if (st.deck.length < cap) st.deck.push(k);
          });
          state.deck = [...st.deck];
          persistStoryState();
          logMd(pickLang(ST_L(
            "🗡 **【友】** — *\"My right arm is ruined, so I can't swing a blade anymore. Take the Kanji and Yen I gathered before my sword snapped—and tie this 【富】 knot to your hilt so the slain wraiths leave more echoes behind.\"*",
            "🗡 **【友】** — *\"난 오른팔이 으스러져서 더는 칼을 쥘 수가 없어. 내 칼이 부러지기 전에 건져 둔 글자들과 잔향을 네게 넘길게. 그리고 이 【富】 매듭을 칼자루에 매어 두면 원령을 베었을 때 더 많은 잔향을 거둘 수 있을 거야.\"*",
            "🗡 **【友】** — *「俺は右腕が砕けてもう刀を握れそうにない。刀が折れる前に集めた文字と残響をお前に託すよ。それと、この【富】の結び紐を柄に結んでおけば、怨霊を斬った時により多くの残響が集まるはずだ。」*"
          )), "event-log");
          logMd(pickLang(ST_L(
            "🎁 Received **+80 円**, **【火 · 水 · 刀】**, and **【富】 Knot of Residual Echoes**!",
            "🎁 옛 벗에게서 **+80 円**, 한자 **【火 · 水 · 刀】**, **【특수 소지: 【富】 잔향의 매듭】**을 받았습니다!",
            "🎁 旧友から **+80 円**、**【火・水・刀】**、**【特殊所持：【富】残響の結び】** を受け取った！"
          )), "fx-log");
          updateBattleHUD(false);
        } else {
          playClickSfx();
          const cur = (st.friendTalkStep || 0) % 3;
          st.friendTalkStep = (st.friendTalkStep || 0) + 1;
          persistStoryState();
          if (cur === 0) {
            logMd(pickLang(ST_L(
              "🗡 **【友】** — *\"When the fog rolled down from the cliff, ordinary steel passed right through those monsters. Only when I pressed a carved Kanji talisman against my blade did the strike actually bite into their flesh.\"*",
              "🗡 **【友】** — *\"절벽 아래서 안개가 쏟아져 나오던 날, 평범한 쇠칼은 그 괴물들의 몸을 그냥 허공처럼 스쳐 지나갔어. 품에 있던 한자 조각 두 개를 칼날에 겹쳐 쥐고 내리쳤을 때야 비로소 놈들의 살점이 베어지더군.\"*",
              "🗡 **【友】** — *「崖下から霧が溢れ出した日、ただの鉄刀はあいつらの体を空を切るようにすり抜けたんだ。懐にあった漢字の欠片を二つ刀身に重ねて打ち込んだ時、初めて奴らの肉に刃が通ったんだよ。」*"
            )), "event-log");
          } else if (cur === 1) {
            if (st.catRescued) {
              logMd(pickLang(ST_L(
                "🗡 **【友】** — *\"Seeing that black cat 【猫】 curled up by your old hearth makes this dead village feel alive again. Drop by your home 【家】 whenever you return from the Gaols—it waits for your footsteps.\"*",
                "🗡 **【友】** — *\"네가 옥문에서 구해 온 검은 고양이【猫】가 네 옛 본가【家】 아궁이에 자리 잡은 걸 보니, 죽은 듯하던 마을에 비로소 온기가 도는 것 같아. 원정을 마치고 돌아올 때마다 들러서 쓰다듬어 줘.\"*",
                "🗡 **【友】** — *「お前が獄門から救い出した黒猫【猫】が生家【家】のかまどに居着いたのを見ると、死んだようだった里に温もりが戻った気がするよ。遠征から戻るたびに立ち寄って撫でてやれよ。」*"
              )), "event-log");
            } else {
              logMd(pickLang(ST_L(
                "🗡 **【友】** — *\"Before I was dragged back up from the 1st Gaol, I heard a tiny black cat 【猫】 mewing inside the fog. It used to nap under your porch—if you hear it in the dungeon, don't pass it by.\"*",
                "🗡 **【友】** — *\"제1옥 어귀에서 다쳐 기어 올라오기 직전에, 짙은 안개 너머에서 어린 검은 고양이【猫】가 애처롭게 우는 소리를 들었어. 예전에 네 본가 마루 밑에서 낮잠 자던 녀석 같던데… 옥문에서 마주치면 꼭 구해 줘.\"*",
                "🗡 **【友】** — *「第一獄の入り口で傷ついて這い上がる直前、濃い霧の奥で小さな黒猫【猫】が鳴く声を聞いたんだ。昔お前の生家の縁の下で昼寝していた奴だと思う……獄門で見かけたら必ず助けてやってくれ。」*"
              )), "event-log");
            }
          } else {
            logMd(pickLang(ST_L(
              "🗡 **【友】** — *\"Remember how Sensei 【先】 used to rap our knuckles whenever we miswrote a single stroke? Who would've thought our lives would depend on those very strokes… Come back alive, my friend.\"*",
              "🗡 **【友】** — *\"어릴 적 서당에서 획 하나만 잘못 그어도 스승님【先】께 회초리를 맞곤 했잖아. 그때 억지로 외우던 글자들에 이제 우리 목숨이 달리게 될 줄 누가 알았겠어… 부디 죽지 말고 살아 돌아와라, 친구야.\"*",
              "🗡 **【友】** — *「昔、書堂で一画でも書き損じると先生【先】に竹箆で叩かれたよな。あの頃必死に覚えた文字に、今や俺たちの命が懸かることになるとは……頼むから生きて戻ってこいよ、友よ。」*"
            )), "event-log");
          }
        }
        renderVillageSpotChoices("橋");
      }
    });
  } else if (spotKey === "家") {
    if (st.catRescued) {
      if (!st.catBlessedNextRun) {
        actions.push({
          label: pickLang(ST_L(
            "🐾 Stroke 【猫】",
            "🐾 고양이 【猫】를 쓰다듬는다",
            "🐾 黒猫【猫】を撫でる"
          )),
          gold: true,
          onClick: () => {
            playHealSfx();
            st.catBlessedNextRun = true;
            state.maxHp += 15;
            state.playerHp = state.maxHp;
            state.rerollTokens += 1;
            persistStoryState();
            logMd(pickLang(ST_L(
              "🐱 **【猫】** rubs its warm head against your palm and purrs loudly, banishing the chill of the abyss (**Next run Max HP +15 · Free Reroll +1**).",
              "🐱 **【猫】**가 따뜻한 머리를 당신의 손바닥에 비비며 기분 좋게 골골거립니다. 심연의 한기가 가시고 생기가 차오릅니다 (**다음 출정 최대 HP +15 · 무료 리롤 +1**).",
              "🐱 **【猫】**が温かい頭をお前の手のひらに擦りつけて心地よさそうに喉を鳴らし、深淵の冷気が拭い去られた（**次回出陣 最大HP+15・無料リロール+1**）。"
            )), "fx-log");
            updateBattleHUD(false);
            renderVillageSpotChoices("家");
          }
        });
      } else {
        actions.push({
          label: pickLang(ST_L(
            "🐾 Watch 【猫】 nap by the hearth",
            "🐾 아궁이 곁에서 졸고 있는 【猫】를 바라본다",
            "🐾 かまどの傍らで眠る【猫】を見る"
          )),
          onClick: () => {
            playClickSfx();
            logMd(pickLang(ST_L(
              "🐱 **【猫】** twitches its ears in its sleep beside the warm embers, trusting that you will return.",
              "🐱 **【猫】**가 잔열이 남은 아궁이 곁에서 귀를 쫑긋거리며 평화롭게 잠들어 있다. 당신이 반드시 돌아올 것이라 믿는 듯하다.",
              "🐱 **【猫】**は温もりの残るかまどの傍らで耳をぴくりと動かしながら安らかに眠っている。お前が必ず戻ると信じているようだ。"
            )), "sys-log");
            renderVillageSpotChoices("家");
          }
        });
      }
    } else {
      actions.push({
        label: pickLang(ST_L(
          "🏚 Examine the cold hearth and empty porch",
          "🏚 식어버린 아궁이와 빈 마루를 살핀다",
          "🏚 冷えたかまどと空の縁側を調べる"
        )),
        onClick: () => {
          playClickSfx();
          logMd(pickLang(ST_L(
            "🏚 Small pawprints lie half-buried in the ash under the porch, leading north toward the Gaol mist.",
            "🏚 무너진 마루 밑 잿더미 위에 작은 고양이 발자국이 어지럽게 찍힌 채 북쪽 옥문 안개 쪽으로 이어져 있다.",
            "🏚 崩れた縁の下の灰の上に小さな猫の足跡が乱れて残っており、北の獄門の霧へと続いていた。"
          )), "sys-log");
          renderVillageSpotChoices("家");
        }
      });
    }
  } else if (spotKey === "井") {
    actions.push({
      label: pickLang(ST_L(
        "💧 Speak with the woman 【女】 by the well",
        "💧 우물가 여인【女】과 이야기를 나눈다",
        "💧 井戸端の女【女】と語り合う"
      )),
      gold: !state.wellVisited,
      onClick: () => {
        playClickSfx();
        if (!state.wellVisited) {
          state.wellVisited = true;
          const cap = typeof MAX_DECK_SIZE !== "undefined" ? MAX_DECK_SIZE : 40;
          if (st.deck.length < cap) {
            st.deck.push("水");
            state.deck = [...st.deck];
            persistStoryState();
          }
          logMd(pickLang(ST_L(
            "💧 **【女】** looks up with hollow eyes and presses a cold character shard **【水】** into your hand.\n*\"I drew this from the bottom of the well before it dried up… Please use it to quench the flames below.\"*",
            "💧 **【女】**이 퀭한 눈을 들어 당신을 바라보더니, 물기 어린 손으로 차가운 한자 조각 **【水】** 하나를 건넨다.\n*\"우물이 완전히 마르기 전에 바닥에서 건져 올린 글자예요… 옥문 아래의 타오르는 원념을 잠재우는 데 써 주세요.\"*",
            "💧 **【女】**は虚ろな目を上げてお前を見つめると、濡れた手で冷たい漢字の欠片 **【水】** を差し出した。\n*「井戸が涸れ果てる前に底から掬い上げた文字です……獄門の底で燃え盛る怨念を鎮めるのに使ってください。」*"
          )), "fx-log");
        } else {
          const cur = (st.womanTalkStep || 0) % 3;
          st.womanTalkStep = (st.womanTalkStep || 0) + 1;
          persistStoryState();
          if (cur === 0) {
            logMd(pickLang(ST_L(
              "💧 **【女】** — *\"My husband ran toward the northern cliff when the characters attacked. Only this bloodied sleeve came back… and now I cannot even recall the Kanji of his name.\"*",
              "💧 **【女】** — *\"안개가 덮치던 밤에 남편이 식구들을 지키겠다며 절벽 쪽으로 달려 나갔어요. 돌아온 건 이 피 묻은 옷소매뿐인데… 이제는 그이 이름에 어떤 한자가 들어갔는지조차 떠오르지 않아요.\"*",
              "💧 **【女】** — *「霧が襲った夜、夫は家族を守ると言って崖の方へ駆けていきました。戻ってきたのはこの血塗れの袖だけで……今ではあの人の名にどんな字を書いていたかすら思い出せないのです。」*"
            )), "event-log");
          } else if (cur === 1) {
            logMd(pickLang(ST_L(
              "💧 **【女】** — *\"Each time you slay a Gaol master below, a few forgotten words return to our tongues. Yesterday, the children finally remembered the word for 'water' and 'mother.'\"*",
              "💧 **【女】** — *\"당신이 옥문 아래에서 우두머리 원령을 하나씩 베어낼 때마다, 마을 사람들의 혀끝에 잊혔던 단어가 조금씩 돌아오고 있어요. 어제는 아이들이 마침내 '물'과 '어머니'라는 말을 다시 발음했답니다.\"*",
              "💧 **【女】** — *「あなたが獄門の底で主を討つたび、里人たちの舌に忘れられていた言葉が少しずつ戻ってきています。昨日は子供たちがようやく『水』と『母』という言葉を思い出しました。」*"
            )), "event-log");
          } else {
            logMd(pickLang(ST_L(
              "💧 **【女】** — *\"In the deep Gaols, neither pity nor hesitation will spare you. Wash the black ink from your blade and come back to the lantern light alive.\"*",
              "💧 **【女】** — *\"옥문 깊은 곳의 원령들에게는 동정도 주저함도 통하지 않아요. 부디 검은 먹물에 마음이 물들지 않도록 조심하고, 살아 돌아오세요.\"*",
              "💧 **【女】** — *「獄門の奥深くに巣食う怨霊には、情けもためらいも通じません。どうか黒い墨に心を染められぬよう、生きて灯のもとへ戻ってきてください。」*"
            )), "event-log");
          }
        }
        updateBattleHUD(false);
        renderVillageSpotChoices("井");
      }
    });
  } else if (spotKey === "鍛") {
    actions.push({
      label: pickLang(ST_L(
        "⚒ Speak with the Smith 【男】",
        "⚒ 대장장이【男】와 이야기를 나눈다",
        "⚒ 鍛冶屋【男】と語り合う"
      )),
      gold: !state.smithVisited,
      onClick: () => {
        playClickSfx();
        if (!state.smithVisited) {
          state.smithVisited = true;
          const cap = typeof MAX_DECK_SIZE !== "undefined" ? MAX_DECK_SIZE : 40;
          if (st.deck.length < cap) {
            st.deck.push("鉄");
            state.deck = [...st.deck];
            persistStoryState();
          }
          logMd(pickLang(ST_L(
            "⚒ **【男】** inspects the nicks on your steel, grunts, and tosses a heavy iron character **【鉄】** into your satchel.\n*\"Your edge is dull from cutting ghosts. Pair this iron character with your strikes to crush their bones.\"*",
            "⚒ **【男】**가 당신의 이 빠진 칼날을 묵묵히 살피더니, 모루 위에서 벼려낸 묵직한 쇠 글자 **【鉄】** 하나를 가방에 던져 준다.\n*\"원령들의 단단한 외피를 베느라 날이 많이 상했군. 이 쇠 글자를 다른 패와 겹쳐 내리치면 뼈째로 부술 수 있을 거다.\"*",
            "⚒ **【男】**はお前の刃こぼれした刀身を黙って検めると、金床の上で鍛え上げた重厚な鉄の文字 **【鉄】** を袋へ放り投げた。\n*「怨霊どもの硬い外皮を斬って刃が荒れているな。この鉄の字を他の札と重ねて叩き込めば、骨ごと砕けるはずだ。」*"
          )), "fx-log");
        } else {
          const cur = (st.smithTalkStep || 0) % 3;
          st.smithTalkStep = (st.smithTalkStep || 0) + 1;
          persistStoryState();
          if (cur === 0) {
            logMd(pickLang(ST_L(
              "⚒ **【男】** — *\"Brute force alone won't fell a Gaol Lord. Read the meaning of the enemy's character—strike Fire with Water, Darkness with Light, and Armor with Piercing steel.\"*",
              "⚒ **【男】** — *\"무작정 획수만 높은 글자를 휘두른다고 능사가 아니다. 적의 한자가 품은 뜻을 읽고 그 상성을 찌르는 두 글자를 조합해 내리쳐 봐라—약점이 제대로 맞물리면 단 일격에 갑절의 치명상을 입힐 수 있다.\"*",
              "⚒ **【男】** — *「ただ画数の多い文字を振り回せばいいというものではない。敵の漢字が持つ意味を読み、その相性を突く二字を組み合わせて打ち込め——弱点が噛み合えば一撃で倍の致命傷を与えられる。」*"
            )), "event-log");
          } else if (cur === 1) {
            logMd(pickLang(ST_L(
              "⚒ **【男】** — *\"The deeper you descend past the 6th Gaol, the thicker the wraiths' hides become. Don't hoard 10th-kyu pebbles forever—claim the heavy Kanji dropped by elites.\"*",
              "⚒ **【男】** — *\"제6옥을 넘어 상용한자 영역으로 내려갈수록 원령들의 가죽은 무쇠보다 단단해진다. 초반에 주운 낮은 급수의 자갈 같은 글자만 고집하지 말고, 정예 원령을 베어 묵직한 상위 한자를 수거해라.\"*",
              "⚒ **【男】** — *「第六獄を越えて常用漢字の領域へ降りるほど、怨霊どもの皮は鋼よりも硬くなる。序盤に拾った小石のような低い級の文字ばかりに頼らず、精鋭を斬って重みのある上位漢字を奪い取れ。」*"
            )), "event-log");
          } else {
            logMd(pickLang(ST_L(
              "⚒ **【男】** — *\"A bloated bag draws a clumsy hand. Take your weak leftovers to the blind Elder 【老】 at the brazier and melt them down into stronger script.\"*",
              "⚒ **【男】** — *\"가방에 잡다한 글자가 너무 많으면 정작 급할 때 원하는 패가 손에 잡히지 않는 법이지. 안 쓰는 잔패들은 화로터의 눈먼 노인【老】에게 가져가 합자 연성으로 녹이거나 소각해서 정예로 추려 두어라.\"*",
              "⚒ **【男】** — *「袋に雑多な文字が多すぎると、いざという時に狙った札が手に入らぬものだ。使わぬ端札は火炉の盲目の老人【老】のところへ持っていき、合字錬成で溶かすか焼却して精鋭に絞っておけ。」*"
            )), "event-log");
          }
        }
        updateBattleHUD(false);
        renderVillageSpotChoices("鍛");
      }
    });
  } else if (spotKey === "祠") {
    if (!state.shrinePrayed) {
      actions.push({
        label: pickLang(ST_L("⛩ Bow before the shrine", "⛩ 당산 사당 앞에 묵념한다", "⛩ 石祠の前で黙祷する")),
        gold: true,
        onClick: () => {
          playGongSfx();
          state.shrinePrayed = true;
          state.rerollTokens += 1;
          updateBattleHUD(false);
          logMd(pickLang(ST_L(
            "⛩ As you bow before the moss-covered altar, a clear mountain breeze brushes your forehead and sharpens your focus (**Free Reroll +1**).",
            "⛩ 이끼 낀 돌제단 앞에 고개를 숙이자, 서늘한 산바람이 이마를 스치며 어지럽던 호흡과 정신이 맑게 가다듬어집니다 (**무료 리롤 +1**).",
            "⛩ 苔むした石祭壇の前に頭を垂れると、涼やかな山風が額を撫で、乱れていた呼吸と意識が澄み渡った（**無料リロール +1**）。"
          )), "fx-log");
          renderVillageSpotChoices("祠");
        }
      });
    } else {
      actions.push({
        label: pickLang(ST_L("⛩ Examine the crimson rope altar", "⛩ 붉은 금줄이 감긴 돌제단을 살핀다", "⛩ 朱の注連縄が巻かれた石祭壇を調べる")),
        onClick: () => {
          playClickSfx();
          logMd(pickLang(ST_L(
            "⛩ Beneath the frayed rope, ancient protective strokes are faintly visible on the stone, holding the village fog at bay.",
            "⛩ 해진 금줄 아래로 옛 사람들이 새겨 놓은 비호의 획들이 희미하게 남아, 절벽에서 밀려오는 안개를 가까스로 밀어내고 있다.",
            "⛩ 擦り切れた注連縄の下に古の人が刻んだ加護の画が微かに残り、崖から押し寄せる霧を辛うじて押し留めている。"
          )), "sys-log");
          renderVillageSpotChoices("祠");
        }
      });
    }
  } else if (spotKey === "墓") {
    actions.push({
      label: pickLang(ST_L("🪦 Touch the nameless gravestones", "🪦 이름이 깎여 나간 무명 비석을 어루만진다", "🪦 名の削られた無名墓石に触れる")),
      gold: !state.graveSearched,
      onClick: () => {
        playClickSfx();
        if (!state.graveSearched) {
          state.graveSearched = true;
          addStoryYen(25);
          persistStoryState();
          logMd(pickLang(ST_L(
            "🪦 As you brush the ash from a fallen headstone, faint golden echoes left by the departed gather into your palm (**+25 円**).",
            "🪦 쓰러진 비석 위의 검은 재를 쓸어내리자, 이름을 잃은 망자가 미처 거두지 못한 금빛 잔향이 손끝으로 모여들었습니다 (**+25 円**).",
            "🪦 倒れた墓石の上の黒い灰を払うと、名を失った亡者が遺した金色の残響が指先へと集まった（**+25 円**）。"
          )), "fx-log");
        } else {
          logMd(pickLang(ST_L(
            "🪦 Cold mist coils around the blank stones. Only when the Gaols are conquered will their names rest in peace.",
            "🪦 비어 있는 비문 위로 차가운 안개만이 감돈다. 옥문의 원령들을 모두 잠재워야만 이 이름들도 제자리를 되찾을 것이다.",
            "🪦 空白の碑文の上に冷たい霧だけが渦巻いている。獄門の怨霊をすべて鎮めてこそ、これらの名も安らぎを取り戻すだろう。"
          )), "sys-log");
        }
        updateBattleHUD(false);
        renderVillageSpotChoices("墓");
      }
    });
  }

  actions.push({
    label: pickLang(ST_L(
      "↩ Back to Village Crossroads",
      "↩ 마을 갈림길로",
      "↩ 里の辻へ"
    )),
    onClick: () => returnToVillageCrossroads()
  });

  setDockActions(actions);
}

/* ---- Elder's Brazier Card Picker Actions (using native #pick-modal) ---- */

function openVillageBrazierFuse() {
  const st = ensureStoryConfig();
  if (st.yen < 80) {
    playClickSfx();
    logMd(pickLang(ST_L(
      "🔥 The Elder shakes his head: *\"You need **80 円** of echoes to stoke the brazier for fusion.\"*",
      "🔥 노인이 고개를 젓습니다: *\"합자 연성을 위해 화로의 불길을 돋우려면 **80 円**이 필요하네.\"*",
      "🔥 老人は首を振った：*「合字錬成のために火炉の炎を高めるには **80 円** が必要だ。」*"
    )), "hint-log");
    return;
  }
  if (!Array.isArray(st.deck) || st.deck.length < 2) {
    playClickSfx();
    logMd(pickLang(ST_L(
      "🔥 You need at least **2 Kanji cards** in your bag to cast into the brazier.",
      "🔥 화로에 던져 넣으려면 일반 소지 가방에 최소 **2장**의 한자 카드가 있어야 합니다.",
      "🔥 火炉へ投げ入れるには、一般所持の袋に少なくとも**2枚**の漢字カードが必要だ。"
    )), "hint-log");
    return;
  }

  let selectedIndices = [];
  const renderFuseModal = () => {
    let desc = t("fuseDescEmpty");
    if (selectedIndices.length === 1) {
      desc = t("fuseDescOne")(st.deck[selectedIndices[0]]);
    } else if (selectedIndices.length === 2) {
      const k1 = st.deck[selectedIndices[0]];
      const k2 = st.deck[selectedIndices[1]];
      desc = t("fuseDescTwo")(k1, k2, k1 + k2);
    }

    const actions = [];
    if (selectedIndices.length === 2) {
      const previewFused = st.deck[selectedIndices[0]] + st.deck[selectedIndices[1]];
      actions.push({
        label: t("fuseConfirmBtn")(previewFused),
        gold: true,
        onClick: () => {
          if (selectedIndices.length < 2) return;
          const k1 = st.deck[selectedIndices[0]];
          const k2 = st.deck[selectedIndices[1]];
          const fused = k1 + k2;
          const sortedIdx = [...selectedIndices].sort((a, b) => b - a);
          sortedIdx.forEach(idx => st.deck.splice(idx, 1));
          st.deck.push(fused);
          state.deck = [...st.deck];
          addStoryYen(-80);
          persistStoryState();
          closePicker();
          playSealStampSfx();
          logMd(pickLang(ST_L(
            `🔥 Cast **【${k1}】 + 【${k2}】** into the Elder's brazier (-80 円) → Combined into **【${fused}】**!`,
            `🔥 노인의 화로에 **【${k1}】 + 【${k2}】** 두 장을 던져 넣어 합자 카드 **【${fused}】**로 묶어냈습니다! (-80 円)`,
            `🔥 老人の火炉に **【${k1}】 + 【${k2}】** を投げ入れ、合字カード **【${fused}】** を錬成した！（-80 円）`
          )), "fx-log");
          updateBattleHUD(false);
          renderVillageSpotChoices("炉");
        }
      });
    }
    actions.push({
      label: pickLang(ST_L("Cancel", "취소", "キャンセル")),
      onClick: () => closePicker()
    });

    openPicker({
      title: pickLang(ST_L("🔥 Kanji Fusion · 80 円", "🔥 화로 합자 연성 · 80 円", "🔥 火炉の合字錬成 · 80 円")),
      desc,
      cards: st.deck,
      multiSelect: true,
      selectedIndices,
      showOrderBadge: true,
      onCard: (_k, idx) => {
        const pos = selectedIndices.indexOf(idx);
        if (pos >= 0) {
          selectedIndices.splice(pos, 1);
        } else if (selectedIndices.length < 2) {
          selectedIndices.push(idx);
        } else {
          selectedIndices = [selectedIndices[0], idx];
        }
        renderFuseModal();
      },
      actions
    });
  };
  renderFuseModal();
}

function openVillageBrazierBurn() {
  const st = ensureStoryConfig();
  if (!Array.isArray(st.deck) || st.deck.length < 1) {
    playClickSfx();
    logMd(pickLang(ST_L(
      "🕯 Your bag has no Kanji cards to burn.",
      "🕯 일반 소지 가방에 태울 수 있는 한자 카드가 없습니다.",
      "🕯 一般所持の袋に焼べる漢字カードがない。"
    )), "hint-log");
    return;
  }

  openPicker({
    title: pickLang(ST_L("🕯 Burn Kanji Into Echoes · +35 円", "🕯 화로 한자 소각 · +35 円", "🕯 火炉の漢字焼却 · +35 円")),
    desc: pickLang(ST_L(
      "Click 1 Kanji from your bag to burn in the brazier for +35 円.",
      "화로에 태워 +35 円의 잔향으로 환원할 한자 1장을 클릭하세요.",
      "火炉で焼べて+35円の残響へ還元する漢字を1枚選べ。"
    )),
    cards: st.deck,
    onCard: (k, idx) => {
      st.deck.splice(idx, 1);
      state.deck = [...st.deck];
      addStoryYen(35);
      persistStoryState();
      closePicker();
      playClickSfx();
      logMd(pickLang(ST_L(
        `🕯 Burned **【${k}】** in the Elder's brazier → Recovered **+35 円**!`,
        `🕯 가방의 **【${k}】** 한 장을 노인의 화로에 태워 **+35 円**의 잔향을 거두었습니다.`,
        `🕯 袋の **【${k}】** を老人の火炉で焼き、**+35 円** の残響を回収した。`
      )), "fx-log");
      updateBattleHUD(false);
      renderVillageSpotChoices("炉");
    },
    actions: [
      {
        label: pickLang(ST_L("Cancel", "취소", "キャンセル")),
        onClick: () => closePicker()
      }
    ]
  });
}

/* Open a clean inspection modal (#info-modal) when a Special Item card tile is clicked inside the Bag Viewer */
function inspectSpecialItem(itemId) {
  const def = STORY_SPECIAL_ITEMS[itemId];
  if (!def) return;
  playClickSfx();
  const kindBadge = def.consumable
    ? pickLang(ST_L("1-Time Consumable", "1회용 소모품", "1回使い切り消耗品"))
    : pickLang(ST_L("Permanent Relic", "영구 귀속 성물", "永久帰属の聖物"));
  $("info-title").textContent = `【${def.kanji}】 ${pickLang(def.name)} · ${kindBadge}`;
  $("info-desc").textContent = pickLang(def.desc);
  openModal("info-modal");
}

/* Render Special Possessions as Kanji Card tiles inside the Deck Viewer (#pick-modal) when in Story Mode */
function renderSpecialItemsBannerHtml() {
  if (!isStoryMode()) return "";
  const st = ensureStoryConfig();
  const owned = (st.specialItems || []).filter(it => it.count > 0 && STORY_SPECIAL_ITEMS[it.id]);

  const title = pickLang(ST_L(
    `📿 Special Possessions · 🪙 ${(st.yen || 0).toLocaleString()} 円`,
    `📿 특수 소지 · 🪙 ${(st.yen || 0).toLocaleString()} 円`,
    `📿 特殊所持 · 🪙 ${(st.yen || 0).toLocaleString()} 円`
  ));

  if (!owned.length) {
    const emptyTxt = pickLang(ST_L(
      "No Special Possessions yet — explore the Village of the Lantern and speak with its survivors.",
      "보유한 특수 소지 카드가 없습니다 — 등불의 마을을 탐방하며 주민들과 대화를 나눠 보세요.",
      "特殊所持カードなし — 灯の里を巡り、里人たちと語り合ってみよう。"
    ));
    return `<div class="special-bag-box"><div class="special-bag-title">${escapeHtml(title)}</div><div class="special-bag-empty">${escapeHtml(emptyTxt)}</div></div>`;
  }

  const cardsHtml = owned.map(it => {
    const def = STORY_SPECIAL_ITEMS[it.id];
    const badgeTxt = def.consumable
      ? pickLang(ST_L("1x", "1회용", "1回"))
      : pickLang(ST_L("RELIC", "영구", "永久"));
    const badgeCls = def.consumable ? "sp-card-badge consumable" : "sp-card-badge relic";
    return `<button type="button" class="pick-tile special-card-tile tier-${def.tier}" onclick="inspectSpecialItem('${escapeHtml(def.id)}')">
      <span class="${badgeCls}">${escapeHtml(badgeTxt)}</span>
      <span class="sp-card-kanji">${escapeHtml(def.kanji)}</span>
      <span class="sp-card-label">${escapeHtml(pickLang(def.name))}</span>
    </button>`;
  }).join("");

  return `<div class="special-bag-box">
    <div class="special-bag-title">${escapeHtml(title)}</div>
    <div class="pick-grid special-card-grid">${cardsHtml}</div>
  </div>`;
}

