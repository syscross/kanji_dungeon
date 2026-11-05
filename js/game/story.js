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
      KO: "잿빛 눈의 노인【老】이 건네준 흑요석 부적. 매 출정마다 무료 고신(古神) 소환 +1 및 무료 조율(리롤) +1을 부여합니다. (영구 귀속 · 전투 중 손패로 드로우되지 않음)",
      JA: "灰色の目の老人【老】から授かった黒曜石の護符。毎回の出陣時に無料古神召喚+1・無料調律（リロール）+1を付与する。（永久帰属・戦闘中の手札には引かれない）",
      ZH_CN: "灰眸老人【老】赐予的黑曜石护符。每次出征时赋予免费古神召唤+1与免费调律（重掷）+1。（永久归属）",
      ZH_TW: "灰眸老人【老】賜予的黑曜石護符。每次出征時賦予免費古神召唤+1與免費調律（重擲）+1。（永久歸屬）"
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
      "Ash-veiled hometown.",
      "검은 재와 안개에 잠긴 고향 갈림길.",
      "灰と霧に沈んだ故郷の辻。"
    )),
    deck: keptDeck,
    encounteredEnemies: [...(st.encounteredFoes || [])],
    defeatedEnemies: [...new Set([...(st.defeatedFoes || []), ...(st.defeatedBosses || [])])]
  });

  resetBattleChrome();
  const titleName = pickLang(ST_L("Village of the Lantern", "등불의 마을", "灯の里"));
  logMd(`── 🏮 00 【里】 ${titleName} · 故郷 ──`, "sep-log");

  const nPhase = getStoryNarrativePhase();
  if (st.introStage === 0) {
    logMd(pickLang(ST_L(
      "🏚 Broken roofs lie buried in black ash, and the characters on the signposts have been gouged out.",
      "🏚 오랜만에 돌아온 고향은 검은 재에 파묻혀 있고, 이정표의 글자들마저 흉측하게 파여 있다.",
      "🏚 久方ぶりに戻った故郷は黒い灰に埋もれ、道標の文字すら抉り取られている。"
    )), "event-log");
  } else if (nPhase === "shura_12") {
    logMd(pickLang(ST_L(
      "🩸 At your footsteps, the village lanterns turn blood-red and every breath hides in dread.",
      "🩸 당신의 발소리에 등불이 핏빛으로 일렁이며 마을의 모든 기척이 숨을 죽인다.",
      "🩸 お前の足音に灯が血の色へ揺らぎ、里のすべての気配が息を潜めた。"
    )), "event-log");
  } else if (nPhase === "peace_10") {
    logMd(pickLang(ST_L(
      "🌸 Sunlight filters through the clouds over the village, though a deep pulse lingers below.",
      "🌸 먹구름 사이로 햇살이 비쳐 들지만, 땅 밑 깊은 곳의 맥동은 아직 멈추지 않았다.",
      "🌸 暗雲の隙間から陽差しが差し込むが、地の底の脈動はまだ止んでいない。"
    )), "event-log");
  } else {
    logMd(pickLang(ST_L(
      "🏮 Cold ash drifts across the silent alleys.",
      "🏮 차가운 재가 고요한 골목 위로 흩날린다.",
      "🏮 冷たい灰が静かな路地に舞っている。"
    )), "sys-log");
  }

  enterVillageCinematic(() => renderPhase());
}

function enterVillageCinematic(onReady) {
  const titleName = pickLang(ST_L("Village of the Lantern", "등불의 마을", "灯の里"));
  const titleGloss = pickLang(ST_L("Ruined Hometown · 故郷", "안개에 잠긴 고향 · 故郷", "霧に沈んだ故郷 · 故郷"));
  transitionToView("battle", titleName, titleGloss);
  const seal = $("seal-overlay");
  if (!seal) {
    if (onReady) onReady();
    return;
  }
  $("seal-num").textContent = "故郷 · 00";
  $("seal-kanji").textContent = "燈火之里";
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
        `<span class="fork-omen">${escapeHtml(pickLang(def.title))} — ${escapeHtml(pickLang(def.omen))}</span>`,
      onClick: () => enterVillageSpot(k),
      cls: "fork-tile"
    };
  });

  // Always allow returning to the Gaol Select screen without any artificial fog roadblock
  tiles.push({
    label: pickLang(ST_L(
      "⛩ Leave Village (Gaol Select)",
      "⛩ 마을 어귀를 나선다 (옥문 선택으로)",
      "⛩ 里の外れへ出る（獄門選択へ）"
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
  state.fieldState = `${pickLang(def.title)} — ${pickLang(def.omen)}`;

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
    logMd("💧 **【女】** — 마른 우물가에서 한 여인이 핏물 배인 무명천을 조용히 헹구고 있다.", "event-log");
  } else if (spotKey === "鍛") {
    logMd("⚒ **【男】** — 식어버린 화덕 곁에서 사내가 이 빠진 칼날을 모루에 내리치고 있다.", "event-log");
  } else if (spotKey === "祠") {
    logMd("⛩ 고목 아래 붉은 금줄이 감긴 돌사당. 이끼 낀 틈새로 서늘한 바람이 스친다.", "event-log");
  } else if (spotKey === "墓") {
    logMd("🪦 이름이 깎여 나간 돌비석들이 안개 속에 기울어 서 있다.", "event-log");
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
    "Ash-veiled hometown.",
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
      "🕯 **【先】** — *\"You returned to this ruined village… Take this talisman before the fog claims your name too.\"*",
      "🕯 **【先】** — *\"하필 고향이 이 지경이 된 때에 돌아왔구나… 안개에 이름마저 먹히기 전에 이 부적을 받거라.\"*",
      "🕯 **【先】** — *「よりによって故郷がこのような時に戻ったか……霧に名まで喰われる前にこの護符を受け取れ。」*"
    )), "event-log");
    return;
  }

  if (phase === "shura_12") {
    logMd(pickLang(ST_L(
      "🕯 **【先】** — *\"Stay back…! The stench of the 12th Abyss clings to your blade. You have become a Shura…\"*",
      "🕯 **【先】** — *\"다가오지 마라…! 네 칼끝에서 나락의 악취가 진동하는구나. 문자를 삼킨 수라(修羅)가 되었어…\"*",
      "🕯 **【先】** — *「近づくな……！ お前の刃から奈落の瘴気が漂っている。文字を喰らう修羅と化したか……」*"
    )), "event-log");
  } else if (phase === "abyss_11") {
    logMd(pickLang(ST_L(
      "🕯 **【先】** — *\"Why did you unseal the 11th Gate?! Those characters were banished from human speech for a reason!\"*",
      "🕯 **【先】** — *\"어째서 제11옥의 금제를 찢은 게냐! 그 너머는 인간이 감당할 수 없어 도려낸 저주란 말이다!\"*",
      "🕯 **【先】** — *「なぜ第十一獄の禁制を破った！ あの先は人が耐えきれず切り捨てた呪いだというのに！」*"
    )), "event-log");
  } else if (phase === "peace_10") {
    logMd(pickLang(ST_L(
      "🕯 **【先】** — *\"You felled the 10th Gaol's lord… The villagers' words are returning. Lay down your blade and rest.\"*",
      "🕯 **【先】** — *\"기어이 제10옥의 주인을 베었구나… 사람들의 말이 돌아오고 있다. 이제 칼을 놓고 쉬어라.\"*",
      "🕯 **【先】** — *「ついに第十獄の主を斬り伏せたか……里人の言葉が戻ってきている。もう刃を置いて休め。」*"
    )), "event-log");
  } else {
    logMd(pickLang(ST_L(
      `🕯 **【先】** — *"So long as you hold **【生】**, this lantern will call your soul back. Up to the **${st.unlockedDepth}th Gaol** is open."*`,
      `🕯 **【先】** — *"품에 **【生】**이 있는 한 이 등불이 네 혼을 불러들일 것이다. 현재 **제${st.unlockedDepth}옥**까지 열려 있구나."*`,
      `🕯 **【先】** — *「懐に**【生】**がある限り、この灯が魂を呼び戻す。今は**第${st.unlockedDepth}獄**まで開いているぞ。」*`
    )), "event-log");
  }
}

/* ---- 2. 【炉】 잿빛 화로터 — 눈먼 노인 【老】 ---- */

function logElderArrival() {
  const phase = getStoryNarrativePhase();
  if (phase === "shura_12") {
    logMd(pickLang(ST_L(
      "🔥 **【老】** — *\"Heh… you swallowed even the 12th Abyss. You are the living lexicon itself now.\"*",
      "🔥 **【老】** — *\"허허… 제12옥 나락까지 삼켰구먼. 이제 자네가 곧 걸어 다니는 심연이야.\"*",
      "🔥 **【老】** — *「ふふ……第十二獄・奈落まで呑み込んだか。もはや貴様自身が歩く深淵よ。」*"
    )), "event-log");
  } else if (phase === "abyss_11") {
    logMd(pickLang(ST_L(
      "🔥 **【老】** — *\"Once you taste the strokes beyond the Common fence, mortal words never satisfy again.\"*",
      "🔥 **【老】** — *\"상용(常用) 너머 태고의 획 맛을 본 자는 미지근한 인간의 말로 돌아가지 못하지.\"*",
      "🔥 **【老】** — *「常用の垣根を越えた画の味を知れば、人の世の言葉には戻れぬものよ。」*"
    )), "event-log");
  } else {
    logMd(pickLang(ST_L(
      "🔥 **【老】** — *\"Every character is a cage binding a primeval spirit. Cast your kanji into my brazier.\"*",
      "🔥 **【老】** — *\"한자란 태고의 악귀를 획(画)에 가둔 감옥이지. 쓸 글자가 있거든 화로에 던져 보게.\"*",
      "🔥 **【老】** — *「漢字とは太古の悪鬼を画に閉じ込めた牢獄よ。文字があるなら火炉へ投げ入れよ。」*"
    )), "event-log");
  }
}

/* ---- 3. 【橋】 안개 낀 돌다리 — 옛 벗 【友】 ---- */

function logFriendArrival() {
  const st = ensureStoryConfig();
  const phase = getStoryNarrativePhase();

  if (phase === "shura_12") {
    logMd(pickLang(ST_L(
      "🗡 **【友】** — *\"…I didn't see my friend just now. I saw a giant blood-red 【殺】 walking toward me.\"*",
      "🗡 **【友】** — *\"…방금 네가 걸어오는데 옛 친구가 아니라 피로 쓴 거대한 살(殺) 자가 오는 줄 알았어.\"*",
      "🗡 **【友】** — *「……今お前が歩いてきた時、血で書かれた巨大な『殺』の字に見えたよ。」*"
    )), "event-log");
  } else if (!st.friendGiftClaimed) {
    logMd(pickLang(ST_L(
      "🗡 **【友】** — *\"You're alive! The wraiths from the cliff shattered my blade and tore up my arm…\"*",
      "🗡 **【友】** — *\"살아 돌아왔구나! 절벽 밑에서 기어 나온 글자들을 막다가 칼은 부러지고 팔만 이 꼴이 됐어.\"*",
      "🗡 **【友】** — *「生きて戻ったか！ 崖下から這い出た文字どもを食い止めようとして刀は折れ、腕もこのざまだ。」*"
    )), "event-log");
  } else {
    const line = st.catRescued
      ? pickLang(ST_L(
          "🗡 **【友】** — *\"That black cat 【猫】 you saved ran toward your old home 【家】.\"*",
          "🗡 **【友】** — *\"네가 구해 온 고양이【猫】, 네 옛 본가【家】 아궁이 쪽으로 가던데.\"*",
          "🗡 **【友】** — *「お前が救った黒猫【猫】なら、崩れた生家【家】のかまどの方へ駆けていったぞ。」*"
        ))
      : pickLang(ST_L(
          "🗡 **【友】** — *\"I heard a small cat 【猫】 crying inside the Gaol mist before I retreated.\"*",
          "🗡 **【友】** — *\"다치기 전에 옥문 안개 속에서 어린 고양이【猫】 울음소리를 들었어.\"*",
          "🗡 **【友】** — *「怪我をする前、獄門の霧の中で小さな猫【猫】の鳴き声を聞いたんだ。」*"
        ));
    logMd(line, "event-log");
  }
}

/* ---- 4. 【家】 무너진 본가 — 옛집과 고양이 【猫】 ---- */

function logHomeArrival() {
  const st = ensureStoryConfig();
  if (st.catRescued) {
    logMd(pickLang(ST_L(
      "🐱 **【猫】** — The rescued black cat curls up beside the hearthstone and purrs. (Home bonus: Max HP +15)",
      "🐱 **【猫】** — 구출한 검은 고양이가 본가 아궁이 잔열 곁에서 골골거린다. (본가 정착: 최대 체력 +15 상시 적용)",
      "🐱 **【猫】** — 救い出した黒猫が生家のかまどの傍らで喉を鳴らしている。（生家定着：最大HP+15常時適用）"
    )), "event-log");
  } else {
    logMd(pickLang(ST_L(
      "🏚 Cold ash covers the empty hearth of your childhood home.",
      "🏚 어린 시절의 본가 마당. 식어버린 아궁이에 찬 재만 흩날린다.",
      "🏚 幼き日の生家の庭。冷え切ったかまどに灰だけが舞う。"
    )), "event-log");
  }
}

/* ---- Interactive Choices at Each Village Spot (#choice-panel) ---- */

function renderVillageSpotChoices(spotKey) {
  const st = ensureStoryConfig();
  const actions = [];

  if (spotKey === "塾") {
    if (st.introStage < 2 || st.unlockedDepth < 1 || countSpecialItem("talisman_life") === 0) {
      actions.push({
        label: pickLang(ST_L(
          "🕯 Receive 【生】 Talisman of Return to Life (Unlocks 01 獄門 · 10級)",
          "🕯 【生】 생환의 부적을 받고 제1옥(10급) 위치를 듣는다",
          "🕯 【生】生還の護符を受け取り、第一獄（10級）のありかを聞く"
        )),
        gold: true,
        onClick: () => {
          playSealStampSfx();
          st.introStage = 2;
          if (st.unlockedDepth < 1) st.unlockedDepth = 1;
          addSpecialItem("talisman_life", 1);
          persistStoryState();
          logMd(pickLang(ST_L(
            "🕯 Received **【生】 Talisman of Return to Life** — **【01 獄門 (漢検10級)】** is now unlocked!",
            "🕯 **【특수 소지: 【生】 생환의 부적】** 획득 — 북쪽 절벽 아래 **【01 獄門 (漢検10級)】**이 해금되었습니다!",
            "🕯 **【特殊所持：【生】生還の護符】** 獲得 — 北の崖下 **【01 獄門（漢検10級）】** が解禁された！"
          )), "fx-log");
          updateBattleHUD(false);
          renderVillageSpotChoices("塾");
        }
      });
    } else {
      actions.push({
        label: pickLang(ST_L(
          "💬 Ask about the Gaols",
          "💬 옥문과 상용(常用)의 결계에 대해 묻는다",
          "💬 獄門と常用の結界について聞く"
        )),
        onClick: () => {
          playClickSfx();
          logMd(pickLang(ST_L(
            "🕯 **【先】** — *\"Slay the master of each Gaol to unseal the next depth. Up to the 10th Gaol are the 2,136 Common Kanji.\"*",
            "🕯 **【先】** — *\"각 옥문의 주인을 베어야 다음 층의 봉인이 풀린다. 제10옥까지가 인간 세상의 상용한자 2,136자이니라.\"*",
            "🕯 **【先】** — *「各獄門の主を斬れば次の封印が解かれる。第十獄までが人の世の常用漢字2,136字だ。」*"
          )), "event-log");
          renderVillageSpotChoices("塾");
        }
      });

      if (st.senseiOfferingStage === 0 && countSpecialItem("talisman_keep") === 0) {
        const cost = 80;
        actions.push({
          label: pickLang(ST_L(
            `📿 Lantern Offering (${cost} 円) — 【持】 Cord of Retention (Random 5 kept on death)`,
            `📿 등불 공양 (${cost} 円) — 【持】 소지의 부적 (사망 시 무작위 5장 보존)`,
            `📿 灯への供養（${cost} 円） — 【持】所持の護符（死亡時ランダム5枚保全）`
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
              "📿 Acquired **【持】 Cord of Retention (Permanent)** — Preserves up to **5 random Kanji** on death/retreat.",
              "📿 **【특수 소지: 【持】 소지의 부적 (영구)】** 획득 — 사망·후퇴 시 일반 소지 한자 중 **무작위 최대 5장**을 지켜냅니다.",
              "📿 **【特殊所持：【持】所持の護符（永久）】** 獲得 — 死亡・撤退時に一般所持から**ランダム最大5枚**を保全する。"
            )), "fx-log");
            updateBattleHUD(false);
            renderVillageSpotChoices("塾");
          }
        });
      } else if (st.senseiOfferingStage >= 1 && countSpecialItem("talisman_return") === 0) {
        const cost = 160;
        actions.push({
          label: pickLang(ST_L(
            `🔔 Altar Offering (${cost} 円) — 【帰】 Bell of Return (1-Time: keeps 100% of bag once)`,
            `🔔 제단 공양 (${cost} 円) — 【帰】 귀환의 방울 (1회용: 사망 시 전량 보존 후 소멸)`,
            `🔔 祭壇供養（${cost} 円） — 【帰】帰還の鈴（1回使い切り：死亡時全量保全）`
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
              "🔔 Acquired **【帰】 Bell of Unbroken Return (1-Time Consumable)** — Shatters on death/retreat to preserve 100% of your bag.",
              "🔔 **【특수 소지: 【帰】 귀환의 방울 (1회용 소모품)】** 획득 — 사망·후퇴 시 방울이 부서지며 가방 한자를 **100% 보전**합니다.",
              "🔔 **【特殊所持：【帰】帰還の鈴（1回使い切り）】** 獲得 — 死亡・撤退時に砕け散り、袋の漢字を**100%保全**する。"
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
            `🍵 Medicinal Tea (${cost} 円 · Next run Max HP +15 & Reroll +1)`,
            `🍵 쓴 약차 마시기 (${cost} 円 · 다음 출정 최대 HP +15 · 리롤 +1)`,
            `🍵 薬茶を飲む（${cost} 円・次回出陣 最大HP+15・リロール+1）`
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
            logMd("🍵 약차의 온기가 번집니다 (**다음 출정 최대 HP +15 · 무료 리롤 +1**).", "fx-log");
            updateBattleHUD(false);
            renderVillageSpotChoices("塾");
          }
        });
      }
    }
  } else if (spotKey === "炉") {
    actions.push({
      label: pickLang(ST_L(
        "💬 Listen to the blind Elder 【老】",
        "💬 노인 【老】의 통찰에 귀를 기울인다",
        "💬 老人【老】の言葉に耳を傾ける"
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
            "👁 Acquired **【眼】 Bead of the Mind's Eye (Permanent)** — Every run starts with **Free Summon +1 & Free Reroll +1**!",
            "👁 **【특수 소지: 【眼】 심안의 부적 (영구)】** 획득 — 매 출정마다 **무료 고신 소환 +1 · 무료 리롤 +1**이 부여됩니다!",
            "👁 **【特殊所持：【眼】心眼の護符（永久）】** 獲得 — 毎回の出陣時に**無料古神召喚+1・無料リロール+1**が付与される！"
          )), "fx-log");
          updateBattleHUD(false);
        } else {
          playClickSfx();
          logMd(pickLang(ST_L(
            "🔥 **【老】** — *\"Fuse two kanji in the flames to birth a denser curse, or burn one into echoes.\"*",
            "🔥 **【老】** — *\"두 글자를 불에 던지면 더 짙은 글자로 합쳐지고, 한 장을 태우면 잔향(円)만 남지.\"*",
            "🔥 **【老】** — *「二字を火に投げればより濃い文字へ合さり、一字を焼けば残響（円）が残る。」*"
          )), "event-log");
        }
        renderVillageSpotChoices("炉");
      }
    });

    actions.push({
      label: pickLang(ST_L(
        `🔥 Kanji Fusion (2 cards · 80 円 · Bag: ${st.deck.length})`,
        `🔥 합자 연성 (2장 합성 · 80 円 · 소지 ${st.deck.length}장)`,
        `🔥 合字錬成（2枚合成・80 円・所持 ${st.deck.length}枚）`
      )),
      onClick: () => openVillageBrazierFuse()
    });

    actions.push({
      label: pickLang(ST_L(
        `🕯 Burn Kanji (+35 円 · Bag: ${st.deck.length})`,
        `🕯 한자 소각 (+35 円 · 소지 ${st.deck.length}장)`,
        `🕯 漢字焼却（+35 円・所持 ${st.deck.length}枚）`
      )),
      onClick: () => openVillageBrazierBurn()
    });

    if ((st.defeatedFoes || []).length > 0) {
      actions.push({
        label: pickLang(ST_L(
          `💀 Re-summon Slain Wraiths (${st.defeatedFoes.length} foes · 60 円)`,
          `💀 토벌한 일반·정예 원령 재소환 (${st.defeatedFoes.length}종 · 60 円)`,
          `💀 討伐した通常・精鋭怨霊の再召喚（${st.defeatedFoes.length}種・60 円）`
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
        "💬 Talk with your friend 【友】",
        "💬 옛 벗 【友】과 이야기를 나눈다",
        "💬 旧友【友】と話す"
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
            "🎁 Received **+80 円**, **【火 · 水 · 刀】**, and **【富】 Knot of Residual Echoes (+50% 円 gain)**!",
            "🎁 옛 벗에게서 **+80 円**, 한자 **【火 · 水 · 刀】**, **【특수 소지: 【富】 잔향의 매듭 (円 획득 +50%)】**을 받았습니다!",
            "🎁 旧友から **+80 円**、**【火・水・刀】**、**【特殊所持：【富】残響の結び（円+50%）】** を受け取った！"
          )), "fx-log");
          updateBattleHUD(false);
        } else {
          playClickSfx();
          logFriendArrival();
        }
        renderVillageSpotChoices("橋");
      }
    });
  } else if (spotKey === "家") {
    if (st.catRescued) {
      if (!st.catBlessedNextRun) {
        actions.push({
          label: pickLang(ST_L(
            "🐾 Stroke 【猫】 (Next run Max HP +15 & Reroll +1)",
            "🐾 고양이 【猫】 쓰다듬기 (다음 출정 최대 HP +15 · 리롤 +1)",
            "🐾 黒猫【猫】を撫でる（次回出陣 最大HP+15・リロール+1）"
          )),
          gold: true,
          onClick: () => {
            playHealSfx();
            st.catBlessedNextRun = true;
            state.maxHp += 15;
            state.playerHp = state.maxHp;
            state.rerollTokens += 1;
            persistStoryState();
            logMd("🐱 **【猫】**가 골골거립니다 (**다음 출정 최대 HP +15 · 무료 리롤 +1**).", "fx-log");
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
            logMd("🐱 **【猫】**가 잔열 속에서 평화롭게 꼬리를 흔든다.", "sys-log");
            renderVillageSpotChoices("家");
          }
        });
      }
    } else {
      actions.push({
        label: pickLang(ST_L(
          "🏚 Examine the cold hearth",
          "🏚 식어버린 아궁이 주변을 살핀다",
          "🏚 冷えたかまどを調べる"
        )),
        onClick: () => {
          playClickSfx();
          logMd("🏚 무너진 지붕 아래 차가운 재만 흩날린다.", "sys-log");
          renderVillageSpotChoices("家");
        }
      });
    }
  } else if (spotKey === "井") {
    actions.push({
      label: "💧 우물가 여인【女】에게 다가간다",
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
          logMd("💧 여인【女】이 젖은 손으로 차가운 한자 조각 **【水】** 하나를 건넨다.", "fx-log");
        } else {
          logMd("💧 **【女】** — *\"옥문 깊은 곳에선 자비도 통하지 않아요. 부디 무사히 돌아오시길…\"*", "event-log");
        }
        updateBattleHUD(false);
        renderVillageSpotChoices("井");
      }
    });
  } else if (spotKey === "鍛") {
    actions.push({
      label: "⚒ 대장장이【男】에게 칼날을 내보인다",
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
          logMd("⚒ 사내【男】가 모루 위에서 벼려낸 묵직한 쇠 글자 **【鉄】** 하나를 던져 준다.", "fx-log");
        } else {
          logMd("⚒ **【男】** — *\"급수가 높아질수록 원령들의 가죽은 무쇠보다 단단해진다.\"*", "event-log");
        }
        updateBattleHUD(false);
        renderVillageSpotChoices("鍛");
      }
    });
  } else if (spotKey === "祠") {
    if (!state.shrinePrayed) {
      actions.push({
        label: "⛩ 당산 사당 앞에 묵념한다 (조율/리롤 +1)",
        gold: true,
        onClick: () => {
          playGongSfx();
          state.shrinePrayed = true;
          state.rerollTokens += 1;
          updateBattleHUD(false);
          logMd("⛩ 서늘한 바람이 이마를 스치며 정신이 맑아집니다 (**조율/리롤 +1**).", "fx-log");
          renderVillageSpotChoices("祠");
        }
      });
    } else {
      actions.push({
        label: "⛩ 돌제단을 살핀다",
        onClick: () => {
          playClickSfx();
          logMd("⛩ 붉은 금줄이 바람에 흔들릴 뿐 사당은 침묵에 잠겨 있다.", "sys-log");
          renderVillageSpotChoices("祠");
        }
      });
    }
  } else if (spotKey === "墓") {
    actions.push({
      label: "🪦 무명 비석을 어루만진다",
      gold: !state.graveSearched,
      onClick: () => {
        playClickSfx();
        if (!state.graveSearched) {
          state.graveSearched = true;
          addStoryYen(25);
          persistStoryState();
          logMd("🪦 무너진 흙더미 사이에서 망자가 남긴 **+25 円**의 잔향을 거두었습니다.", "fx-log");
        } else {
          logMd("🪦 이름을 빼앗긴 자들의 묘지. 차가운 한기만이 손끝을 스친다.", "sys-log");
        }
        updateBattleHUD(false);
        renderVillageSpotChoices("墓");
      }
    });
  }

  actions.push({
    label: pickLang(ST_L(
      "↩ Back to Village Crossroads (【里】)",
      "↩ 마을 갈림길(【里】)로",
      "↩ 里の辻（【里】）へ"
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
    openPicker({
      title: pickLang(ST_L("🔥 Cast 2 Kanji Into the Brazier (80 円)", "🔥 화로 합자 연성 (2장 선택 · 80 円)", "🔥 火炉の合字錬成（2枚選択・80 円）")),
      desc: pickLang(ST_L(
        "Choose 2 Kanji from your bag to fuse in the Elder's ash brazier.",
        "노인의 화로에 던져 넣어 하나로 합칠 한자 2장을 고르세요.",
        "老人の火炉に投げ入れて一つに掛け合わせる漢字を2枚選べ。"
      )),
      cards: st.deck,
      multiSelect: true,
      selectedIndices,
      showOrderBadge: true,
      onCard: (_k, idx) => {
        const pos = selectedIndices.indexOf(idx);
        if (pos >= 0) selectedIndices.splice(pos, 1);
        else if (selectedIndices.length < 2) selectedIndices.push(idx);
        renderFuseModal();
      },
      actions: [
        {
          label: `${pickLang(ST_L("Fuse in Brazier", "화로에 던져 연성", "火炉で錬成"))} (${selectedIndices.length}/2)`,
          gold: selectedIndices.length === 2,
          onClick: () => {
            if (selectedIndices.length < 2) return;
            const sortedIdx = [...selectedIndices].sort((a, b) => b - a);
            const k1 = st.deck[selectedIndices[0]];
            const k2 = st.deck[selectedIndices[1]];
            sortedIdx.forEach(idx => st.deck.splice(idx, 1));
            closePicker();

            const maxD = Math.min(12, Math.max(2, (st.unlockedDepth || 1) + 1));
            const dKey = `depth_${maxD}`;
            const pool = (KANKEN_DATA[dKey] && KANKEN_DATA[dKey].kanji) ? KANKEN_DATA[dKey].kanji : ["炎", "雷", "斬", "魂", "龍"];
            const fused = pool[Math.floor(Math.random() * pool.length)] || "炎";
            st.deck.push(fused);
            state.deck = [...st.deck];
            addStoryYen(-80);
            persistStoryState();
            playSealStampSfx();
            logMd(pickLang(ST_L(
              `🔥 Cast **【${k1}】 + 【${k2}】** into the Elder's brazier (-80 円) → Forged **【${fused}】**!`,
              `🔥 노인의 화로에 **【${k1}】 + 【${k2}】** 두 장을 던져 넣었습니다 (-80 円) → 불길 속에서 새로운 한자 **【${fused}】** 연성!`,
              `🔥 老人の火炉に **【${k1}】 + 【${k2}】** を投げ入れた（-80 円） → 炎の中から新たな漢字 **【${fused}】** が錬成された！`
            )), "fx-log");
            updateBattleHUD(false);
            renderVillageSpotChoices("炉");
          }
        },
        {
          label: pickLang(ST_L("Cancel", "취소", "キャンセル")),
          onClick: () => closePicker()
        }
      ]
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
    title: pickLang(ST_L("🕯 Burn Kanji Into Echoes (+35 円)", "🕯 화로 한자 소각 환원 (+35 円)", "🕯 火炉の漢字焼却還元（+35 円）")),
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
    `📿 Special Possessions (Not drawn in combat · Click a card to inspect) · 🪙 ${(st.yen || 0).toLocaleString()} 円`,
    `📿 특수 소지 (전투 중 드로우 제외 · 카드를 눌러 상세 확인) · 🪙 ${(st.yen || 0).toLocaleString()} 円`,
    `📿 特殊所持（戦闘中はドロー対象外・カードを押して詳細確認） · 🪙 ${(st.yen || 0).toLocaleString()} 円`
  ));

  if (!owned.length) {
    const emptyTxt = pickLang(ST_L(
      "No Special Possessions yet — explore the Village of the Lantern (【里】) and speak with its survivors.",
      "보유한 특수 소지 카드가 없습니다 — 등불의 마을(【里】)을 탐방하며 주민들과 대화를 나눠 보세요.",
      "特殊所持カードなし — 灯の里（【里】）を巡り、里人たちと語り合ってみよう。"
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

