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
    name: {
      EN: "Cord of Retention",
      KO: "소지의 부적",
      JA: "所持の護符",
      ZH_CN: "所持护符",
      ZH_TW: "所持護符"
    },
    desc: {
      EN: "Ash-woven cord bound to your satchel by Sensei 【先】. Even when dragged back from death or defeat, it clutches onto 5 Kanji cards in your bag.",
      KO: "스승【先】이 등불의 재로 엮어 가방에 매어 준 부적. 옥문에서 쓰러져 생환할 때에도 일반 소지 한자 중 최대 5장을 놓치지 않고 지켜냅니다. (영구 귀속)",
      JA: "先生【先】が灯の灰で編み上げた護符。獄門で倒れて生還する際も、一般所持の漢字を最大5枚まで守り抜く。（永久帰属）",
      ZH_CN: "老师【先】以灯灰编织并系在行囊上的护符。即使在狱门倒下生还时，也能护住最多5张普通所持汉字。（永久归属）",
      ZH_TW: "老師【先】以燈灰編織並繫在行囊上的護符。即使在獄門倒下生還時，也能護住最多5張普通所持漢字。（永久歸屬）"
    }
  },
  talisman_return: {
    id: "talisman_return",
    kanji: "帰",
    tier: "common",
    name: {
      EN: "Bell of Unbroken Return",
      KO: "귀환의 방울",
      JA: "帰還の鈴",
      ZH_CN: "归还之铃",
      ZH_TW: "歸還之鈴"
    },
    desc: {
      EN: "Ancient bronze bell from beneath the study altar. Even if struck down or forced to abandon an expedition, 100% of your bag's Kanji return with you.",
      KO: "서당 제단 아래 보관되어 있던 고동색 방울. 옥문에서 쓰러지거나 중도에 물러날 때에도 일반 소지 한자를 단 한 장도 잃지 않고 온전히 보전합니다. (영구 귀속)",
      JA: "書堂の祭壇の下に眠っていた古銅の鈴。獄門で倒れるか撤退した際も、一般所持の漢字を1枚も失わず完全に保全する。（永久帰属）",
      ZH_CN: "沉睡在书堂祭坛下的古铜铃。即使在狱门倒下或中途撤退，也能分毫不损地保全所有普通所持汉字。（永久归属）",
      ZH_TW: "沉睡在書堂祭壇下的古銅鈴。即使在獄門倒下或中途撤退，也能分毫不損地保全所有普通所持漢字。（永久歸屬）"
    }
  },
  talisman_wealth: {
    id: "talisman_wealth",
    kanji: "富",
    tier: "common",
    name: {
      EN: "Knot of Residual Echoes",
      KO: "잔향의 매듭",
      JA: "残響の結び",
      ZH_CN: "残响绳结",
      ZH_TW: "殘響繩結"
    },
    desc: {
      EN: "Cord given by your old friend 【友】. Draws +50% more residual Yen (円) from slain foes.",
      KO: "옛 벗【友】이 건네준 매듭. 옥문에서 원령을 베었을 때 수거하는 잔향(円)이 영구적으로 50% 증가합니다. (영구 귀속)",
      JA: "旧友【友】から託された結び紐。獄門で怨霊を斬った際に得る残響（円）が恒久的に50%増加する。（永久帰属）",
      ZH_CN: "旧友【友】托付的绳结。在狱门斩杀怨灵时获得的残响（円）永久增加50%。（永久归属）",
      ZH_TW: "舊友【友】託付的繩結。在獄門斬殺怨靈時獲得的殘響（円）永久增加50%。（永久歸屬）"
    }
  },
  talisman_god: {
    id: "talisman_god",
    kanji: "眼",
    tier: "abyss",
    name: {
      EN: "Bead of the Mind's Eye",
      KO: "심안의 부적",
      JA: "心眼の護符",
      ZH_CN: "心眼护符",
      ZH_TW: "心眼護符"
    },
    desc: {
      EN: "Obsidian bead bestowed by the blind Elder 【老】. Grants +1 free Ancient God summon and +1 free Reroll at the start of every expedition.",
      KO: "잿빛 눈의 노인【老】이 건네준 흑요석 부적. 매 출정마다 무료 고신(古神) 소환 +1 및 무료 조율(리롤) +1을 부여합니다. (영구 귀속)",
      JA: "灰色の目の老人【老】から授かった黒曜石の護符。毎回の出陣時に無料古神召喚+1・無料調律（リロール）+1を付与する。（永久帰属）",
      ZH_CN: "灰眸老人【老】赐予的黑曜石护符。每次出征时赋予免费古神召唤+1与免费调律（重掷）+1。（永久归属）",
      ZH_TW: "灰眸老人【老】賜予的黑曜石護符。每次出征時賦予免費古神召喚+1與免費調律（重擲）+1。（永久歸屬）"
    }
  },
  cat_companion: {
    id: "cat_companion",
    kanji: "猫",
    tier: "common",
    name: {
      EN: "Rescued Black Cat",
      KO: "구출한 고양이",
      JA: "救出した黒猫",
      ZH_CN: "获救的黑猫",
      ZH_TW: "獲救的黑貓"
    },
    desc: {
      EN: "A small cat rescued from the Gaol mist. Now curls up by the hearth of your ruined home (【家】) and permanently grants +15 Max HP.",
      KO: "옥문의 안개 속에서 구출한 고양이. 이제 무너진 본가【家】의 아궁이 곁을 지키며, 영구적으로 최대 체력 +15를 부여합니다. (영구 귀속)",
      JA: "獄門の霧から救い出した猫。今は崩れた実家【家】のかまどの傍らで丸くなり、恒久的に最大HP+15を付与する。（永久帰属）",
      ZH_CN: "从狱门迷雾中救出的小猫。如今蜷缩在破败老家【家】的灶旁，永久赋予最大体力+15。（永久归属）",
      ZH_TW: "從獄門迷霧中救出的小貓。如今蜷縮在破敗老家【家】的灶旁，永久賦予最大體力+15。（永久歸屬）"
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
  const st = ensureStoryConfig();
  if (!Array.isArray(st.specialItems)) st.specialItems = [];
  let entry = st.specialItems.find(it => it.id === itemId);
  if (!entry) {
    if (delta <= 0) return 0;
    entry = { id: itemId, count: 0 };
    st.specialItems.push(entry);
  }
  // Story relics are unique permanent heirlooms (capped at 1)
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

/* Rescue the cat (either via event or by encountering/subduing 猫 in Depth 9) */
function rescueStoryCat() {
  const st = ensureStoryConfig();
  if (st.catRescued) return false;
  st.catRescued = true;
  addSpecialItem("cat_companion", 1);
  persistStoryState();
  return true;
}

/* Handle player death or abandon in Story Mode:
 * - Special items (특수 소지) are permanent relics and are NEVER lost!
 * - 【生】 생환의 부적 pulls the player's soul back to the Village.
 * - Normal bag (일반 소지) is lost UNLESS protected by 【帰】 귀환의 방울 (100% kept) or 【持】 소지의 부적 (up to 5 cards kept). */
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
    st.deck = [...currentBag];
    persistStoryState();
    return {
      kept: st.deck,
      lostCount: 0,
      reason: pickLang(ST_L(
        `🔔 **【帰】 Bell of Unbroken Return** rings through the fog — all **${currentBag.length}** Kanji in your bag are preserved intact!`,
        `🔔 **【帰】 귀환의 방울**이 안개 속에서 맑게 울려 퍼집니다 — 일반 소지 한자 **${currentBag.length}장**을 단 한 장도 잃지 않고 보전했습니다!`,
        `🔔 **【帰】 帰還の鈴**が霧の中で澄んだ音を響かせた — 一般所持の漢字 **${currentBag.length}枚**を1枚も失わず保全した！`
      ))
    };
  }

  if (countSpecialItem("talisman_keep") > 0) {
    const keepCap = 5;
    const kept = currentBag.slice(0, keepCap);
    const lostCount = Math.max(0, currentBag.length - kept.length);
    st.deck = kept;
    persistStoryState();
    return {
      kept,
      lostCount,
      reason: pickLang(ST_L(
        `📿 **【持】 Cord of Retention** holds fast — preserved **${kept.length}** Kanji (${kept.join(" · ")}) as your soul was pulled back!`,
        `📿 **【持】 소지의 부적**이 팽팽하게 조여들며 일반 소지 한자 **${kept.length}장**(${kept.join(" · ")})을 끝까지 지켜냈습니다!`,
        `📿 **【持】 所持の護符**が強く締まり、一般所持の漢字 **${kept.length}枚**（${kept.join("・")}）を守り抜いた！`
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
      `🕯 **【生】 생환의 부적**의 인도로 영혼과 특수 소지는 무사히 마을로 생환했으나, 일반 소지 한자 **${currentBag.length}장**은 옥문의 안개 속으로 흩어졌습니다.`,
      `🕯 **【生】 生還の護符**の導きで魂と特殊所持は無事に里へ生還したが、一般所持の漢字 **${currentBag.length}枚**は獄門の霧へと散った。`
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
      "A solitary paper lantern flickers inside the broken study where Sensei 【先】 waits.",
      "반쯤 무너진 서당 안에서 옛 스승 【先】이 희미한 등불을 지키고 있다.",
      "半ば崩れた書堂の中で、旧師【先】が仄かな灯を守っている。"
    ),
    preview: "先 · 生 · 持 · 帰"
  },
  炉: {
    sign: "炉",
    npcKanji: "老",
    title: ST_L("Ash Brazier Ruin", "잿빛 화로터", "灰の火炉跡"),
    omen: ST_L(
      "A blind elder 【老】 stirs the ashes of burnt characters before a bronze brazier.",
      "금 간 청동 화로 앞에서 잿빛 눈의 노인 【老】이 문자의 재를 뒤적이고 있다.",
      "ひび割れた火炉の前で、灰眸の老人【老】が文字の灰をかき混ぜている。"
    ),
    preview: "老 · 炉 · 眼 · 合"
  },
  橋: {
    sign: "橋",
    npcKanji: "友",
    title: ST_L("Fog-Bound Stone Bridge", "안개 낀 돌다리", "霧の石橋"),
    omen: ST_L(
      "Your old friend 【友】 leans against the broken parapet with a bandaged arm.",
      "끊어진 돌다리 난간에 부상당한 옛 벗 【友】이 칼집을 짚고 서 있다.",
      "崩れた石橋の欄干に、傷を負った旧友【友】が鞘を突いて立っている。"
    ),
    preview: "友 · 刀 · 火 · 富"
  },
  家: {
    sign: "家",
    npcKanji: "家",
    title: ST_L("Ruined Family Home", "무너진 본가", "崩れた生家"),
    omen: ST_L(
      "Ash-covered courtyard of your childhood home where the hearthstone rests.",
      "잿더미에 덮인 본가 마당 처마 밑, 낡은 아궁이가 남아 있다.",
      "灰に覆われた生家の庭、軒下に古いかまどが残っている。"
    ),
    preview: "家 · 休 · 温"
  },
  井: {
    sign: "井",
    npcKanji: "女",
    title: ST_L("Dried Village Well", "마른 우물가", "涸れ井戸"),
    omen: ST_L(
      "A quiet village woman 【女】 sits by the stone well, washing linen in drawn dew.",
      "마른 우물가 돌턱에 단정한 여인 【女】이 앉아 밤이슬로 천을 닦아내고 있다.",
      "涸れ井戸の縁に静かな女【女】が腰掛け、夜露で布を拭っている。"
    ),
    preview: "女 · 水 · 薬 · 糸"
  },
  鍛: {
    sign: "鍛",
    npcKanji: "男",
    title: ST_L("Shattered Smithy", "무너진 대장간", "崩れた鍛冶場"),
    omen: ST_L(
      "A burly swordsmith 【男】 hammers bent iron cold against a cracked anvil.",
      "금 간 모루 위에서 거친 체구의 대장장이 【男】이 묵묵히 쇠를 두드리고 있다.",
      "ひび割れた金床の上で、屈強な男【男】が黙々と鉄を叩いている。"
    ),
    preview: "男 · 鉄 · 刀 · 金"
  },
  祠: {
    sign: "祠",
    npcKanji: "神",
    title: ST_L("Mossy Roadside Shrine", "이끼 낀 당산 사당", "苔むす祠"),
    omen: ST_L(
      "Weathered stone shrine smothered in thick red prayer ropes beneath a dead pine.",
      "고목 아래 붉은 금줄이 칭칭 감긴 채 비바람에 바랜 고요한 사당.",
      "枯れ松の下、注連縄が幾重にも巻かれ風雨に晒された古い祠。"
    ),
    preview: "祠 · 祈 · 護 · 霊"
  },
  墓: {
    sign: "墓",
    npcKanji: "石",
    title: ST_L("Nameless Headstones", "무명 묘지", "名もなき墓所"),
    omen: ST_L(
      "Stones etched with lost characters stand crooked under swirling black fog.",
      "안개 속에 비스듬히 기울어진 비석들. 글자가 깎여 나간 묵직한 묘비.",
      "霧の中に傾く無数の墓石。文字の削り取られた重い碑。"
    ),
    preview: "墓 · 骨 · 灰 · 冥"
  }
};

function startVillageStage() {
  activeGameMode = "story";
  const st = ensureStoryConfig();
  st.started = true;
  st.villageVisits = (st.villageVisits || 0) + 1;
  persistStoryState();

  const keptDeck = Array.isArray(st.deck)
    ? st.deck.map(k => String(k).replace(/[^\u4e00-\u9faf\u3400-\u4dbf]/g, "")).filter(Boolean)
    : [];
  const catBonusHp = (countSpecialItem("cat_companion") > 0 ? 15 : 0) + (st.catBlessedNextRun ? 15 : 0);
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
      "Ash-veiled hometown — choose where to walk.",
      "잿더미와 안개에 잠긴 고향 — 발걸음을 옮길 곳을 고르세요.",
      "灰と霧に沈んだ故郷 — 足を運ぶ場所を選べ。"
    )),
    deck: keptDeck,
    encounteredEnemies: [...(st.encounteredFoes || [])],
    defeatedEnemies: [...new Set([...(st.defeatedFoes || []), ...(st.defeatedBosses || [])])]
  });

  resetBattleChrome();
  const titleName = pickLang(ST_L("Village of the Lantern", "등불의 마을", "灯の里"));
  const titleGloss = pickLang(ST_L("Ruined Hometown", "안개에 잠긴 고향", "霧に沈んだ故郷"));
  logMd(`── 🏮 00 【里】 ${titleName} · 故郷 ──`, "sep-log");

  const nPhase = getStoryNarrativePhase();
  if (st.introStage === 0) {
    logBeat("event-log", `🏚 【里】 ${pickLang(ST_L("Homecoming to Ruin", "폐허가 된 고향으로의 귀향", "廃墟と化した故郷への帰郷"))}`, [
      pickLang(ST_L(
        "After years away, you step across the boundary of your hometown—only to find broken roofs buried in black ash and a suffocating fog.",
        "오랜 타향살이 끝에 마침내 고향 어귀에 발을 들였으나, 눈앞에 펼쳐진 것은 검은 재에 파묻힌 처마들과 숨 막히는 기괴한 안개뿐입니다.",
        "長い旅の果てにようやく故郷の入り口へ足を踏み入れたが、目の前に広がっていたのは黒い灰に埋もれた軒並みと、息が詰まるほど異様な霧だけだった。"
      )),
      pickLang(ST_L(
        "The villagers' voices are gone; the very characters (漢字) carved into the village signposts have been gouged out as if devoured by something beneath the earth.",
        "사람들의 말소리는 끊겼고, 이정표에 새겨져 있던 글자(漢字)들마저 땅 밑의 무언가에게 뜯어먹힌 듯 흉측하게 파여 있습니다.",
        "里人の話し声は途絶え、道標に刻まれていた文字（漢字）すら、地の底の何かに喰い千切られたかのように無惨に抉り取られている。"
      )),
      pickLang(ST_L(
        "🕯 Through the gloom, a solitary paper lantern still flickers inside the **Dying Study (【塾】)**.",
        "🕯 칠흑 같은 안개 너머, 반쯤 무너진 **꺼져가는 서당(【塾】)** 안에서만 유일하게 희미한 등불 하나가 흔들리고 있습니다.",
        "🕯 漆黒の霧の向こう、半ば崩れた**消えかけの書堂（【塾】）**の中だけで、唯一仄かな灯が揺れている。"
      ))
    ]);
  } else if (nPhase === "shura_12") {
    logBeat("event-log", `🩸 【里】 ${pickLang(ST_L("The Village Before a Shura", "수라(修羅)가 돌아온 마을", "修羅が還りし里"))}`, [
      pickLang(ST_L(
        "The moment your boots touch the village soil, the lantern flames turn blood-red and every living breath hides in terror.",
        "당신이 마을 땅을 밟는 순간, 등불의 불꽃이 핏빛으로 일렁이며 살아 숨 쉬는 모든 기척이 공포에 질려 숨을 죽입니다.",
        "お前が里の土を踏んだ瞬間、灯の炎が血の色に揺らぎ、生きとし生ける気配が恐怖に息を潜めた。"
      ))
    ]);
  } else if (nPhase === "peace_10") {
    logBeat("event-log", `🌸 【里】 ${pickLang(ST_L("Sunlight Over the Hometown", "햇살이 돌아온 등불의 마을", "陽差しが戻った灯の里"))}`, [
      pickLang(ST_L(
        "With the 10th Gaol conquered, warm light filters through the clouds over your hometown—though the forbidden seal below still hums.",
        "제10옥의 주인을 베어낸 뒤, 고향 하늘을 짓누르던 먹구름 사이로 따뜻한 햇살이 비쳐 듭니다.",
        "第十獄の主を斬り伏せた後、故郷の空を押し潰していた暗雲の隙間から暖かい陽差しが差し込んでいる。"
      ))
    ]);
  } else {
    logMd(pickLang(ST_L(
      `🏮 Returned to **【里】 Village of the Lantern**. Carry your echoes (**${st.yen} 円**) to the study, the brazier, the bridge, or your old home.`,
      `🏮 **【里】 등불의 마을**에 발을 들였습니다. 서당【塾】, 화로터【炉】, 돌다리【橋】, 본가【家】를 둘러보거나 정비할 수 있습니다.`,
      `🏮 **【里】 灯の里**へ足を踏み入れた。書堂【塾】、火炉跡【炉】、石橋【橋】、生家【家】を巡り、身支度を整えることができる。`
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
  if (st.introStage < 2) {
    // Before first gaol unlocked: study is always accessible, plus 3 random spots
    const others = allSpotKeys.filter(k => k !== "塾");
    const pickedOthers = sample(others, 3);
    spotKeys = ["塾", ...pickedOthers];
  } else {
    // Semi-random dynamic village landscape (4 distinct spots)
    spotKeys = sample(allSpotKeys, 4);
    if (!spotKeys.includes("塾") && Math.random() < 0.5) {
      spotKeys[0] = "塾";
    }
  }
  const tiles = spotKeys.map((k) => {
    const def = VILLAGE_SPOTS[k];
    const displayKanji = (k === "家" && st.catRescued) ? "猫" : k;
    const badge = (k === "塾" && st.introStage < 2) ? "🕯" : "";
    return {
      html: `<span class="fork-kanji tier-${getKanjiTier(displayKanji)}">${escapeHtml(displayKanji)}</span>` +
        `<span class="fork-omen">${escapeHtml(pickLang(def.title))} — ${escapeHtml(pickLang(def.omen))}</span>` +
        `<span class="fork-cards-hint">${escapeHtml(def.preview)}</span>` +
        (badge ? `<span class="fork-reveal">${badge}</span>` : ""),
      onClick: () => enterVillageSpot(k),
      cls: "fork-tile"
    };
  });

  if (st.unlockedDepth >= 1) {
    tiles.push({
      label: pickLang(ST_L(
        "⛩ Head Out to the Gaol Gates (Select Destination)",
        "⛩ 마을 어귀를 나선다 (옥문 선택으로)",
        "⛩ 里の外れへ出る（獄門選択へ）"
      )),
      onClick: () => leaveVillageToSelect(),
      gold: true,
      cls: "fork-return-btn"
    });
  } else {
    tiles.push({
      label: pickLang(ST_L(
        "🌫 Peer Into the Fog Outside (Speak to 【先】 in the Study 【塾】 first)",
        "🌫 마을 밖 안개 살피기 (먼저 서당【塾】의 스승【先】을 찾아가세요)",
        "🌫 里の外の霧を窺う（まずは書堂【塾】の師【先】を訪ねよ）"
      )),
      onClick: () => {
        playClickSfx();
        logMd(pickLang(ST_L(
          "짙은 먹빛 안개가 마을 밖을 짓누르고 있어 나아갈 수 없다. 등불이 켜진 서당【塾】 쪽에서 희미한 인기척이 느껴진다.",
          "짙은 먹빛 안개가 마을 밖을 짓누르고 있어 나아갈 수 없다. 등불이 켜진 서당【塾】 쪽에서 희미한 인기척이 느껴진다.",
          "🌫 里の外は一寸先も見えない黒い霧に阻まれている。まずは**消えかけの書堂（【塾】）**へ入り、かつての師**【先】**から異変の顛末と獄門のありかを聞くのだ。"
        )), "hint-log");
      },
      cls: "fork-return-btn"
    });
  }
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

  logMd(`→ 【${spotKey}】 — *${pickLang(def.title)}*`, "choice-log");

  if (spotKey === "塾") {
    logSenseiArrival();
  } else if (spotKey === "炉") {
    logElderArrival();
  } else if (spotKey === "橋") {
    logFriendArrival();
  } else if (spotKey === "家") {
    logHomeArrival();
  } else if (spotKey === "井") {
    logBeat("event-log", "💧 【井】 마른 우물가", [
      "깊이를 알 수 없는 마른 우물가에 앉은 여인【女】이 피 묻은 무명천을 묵묵히 헹구고 있다.",
      "\"…글자를 잃은 이들은 모두 저 아래로 던져졌어요. 귀를 기울이면 아직도 희미하게 긁는 소리가 들려요…\""
    ]);
  } else if (spotKey === "鍛") {
    logBeat("event-log", "⚒ 【鍛】 무너진 대장간", [
      "불 꺼진 화덕 곁에서 거친 사내【男】가 부러진 칼날들을 모루 위에 내리치고 있다.",
      "\"칼날에 글자를 새기지 않으면 원령의 가죽을 벨 수 없다. 옥문에서 쓸 만한 쇳조각이나 주워 오든가.\""
    ]);
  } else if (spotKey === "祠") {
    logBeat("event-log", "⛩ 【祠】 이끼 낀 당산 사당", [
      "썩어가는 고목 아래, 핏빛 금줄로 칭칭 묶인 돌사당에서 태고의 신음이 흘러나온다.",
      "사람들이 두려워 잊어버린 고신(古神)의 이름들이 이끼 낀 돌 틈에 새겨져 있다."
    ]);
  } else if (spotKey === "墓") {
    logBeat("event-log", "🪦 【墓】 무명 묘지", [
      "비문이 뭉개진 돌비석들이 안개 속에 서 있다. 누구의 묘인지조차 알 수 없다.",
      "이름을 빼앗긴 자들이 묻힌 자리. 흙 속에서 차가운 한기가 발목을 휘감는다."
    ]);
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
    "Ash-veiled hometown — choose where to walk.",
    "잿더미와 안개에 잠긴 고향 — 발걸음을 옮길 곳을 고르세요.",
    "灰と霧に沈んだ故郷 — 足を運ぶ場所を選べ。"
  ));
  updateBattleHUD(false);
  renderVillageFork();
}

/* ---- 1. 【塾】 꺼져가는 서당 — 옛 스승 【先】 ---- */

function logSenseiArrival() {
  const st = ensureStoryConfig();
  const phase = getStoryNarrativePhase();

  if (st.introStage === 0) {
    logBeat("event-log", `🕯 【先】 ${pickLang(ST_L("Old Teacher of the Dying Study", "꺼져가는 서당의 옛 스승", "消えかけの書堂の旧師"))}`, [
      pickLang(ST_L(
        "Inside the half-collapsed study, your old teacher 【先】 shields a trembling paper lantern with his frail hands. Hearing your footsteps, his eyes widen.",
        "서까래가 무너져 내린 서당 안에서, 백발이 성성해진 옛 스승 【先】이 여윈 손으로 흔들리는 등불을 감싸 쥐고 있습니다. 당신의 인기척에 스승이 눈을 크게 뜹니다.",
        "垂木が崩れ落ちた書堂の中で、白髪の旧師【先】が痩せた手で揺れる灯を庇っている。お前の足音に気づき、師が目を見開いた。"
      )),
      pickLang(ST_L(
        `*"…Is that truly you? To think you returned to thisforsaken hometown now, of all times…"*`,
        `*"…네가 정녕 살아 돌아왔구나. 하필이면 고향이 이 지경이 된 지금 돌아오다니…"*`,
        `*「……お前、本当に生きて戻ったのか。よりによって故郷がこのような有様になった今、帰ってくるとはな……」*`
      ))
    ]);
    return;
  }

  if (phase === "shura_12") {
    logBeat("event-log", `🕯 【先】 ${pickLang(ST_L("Old Teacher in Dread", "공포에 질린 옛 스승", "恐怖に震える旧師"))}`, [
      pickLang(ST_L(
        `*"S-Stay back…! The stench of the 12th Abyss clings to your blade… You are no longer my student—you have become a Shura (修羅) that devours script itself…"*`,
        `*"다… 다가오지 마라…! 네 칼끝에서 제12옥 나락의 악취가 진동하고 있어… 넌 더 이상 내 제자가 아니다. 문자 그 자체를 집어삼킨 수라(修羅)야…!"*`,
        `*「ち、近づくな……！ お前の刃から第十二獄・奈落の瘴気が漂っている……もはや私の弟子ではない、文字そのものを喰らう修羅（しゅら）だ……！」*`
      ))
    ]);
  } else if (phase === "abyss_11") {
    logBeat("event-log", `🕯 【先】 ${pickLang(ST_L("Old Teacher's Warning", "창백해진 옛 스승", "青ざめた旧師"))}`, [
      pickLang(ST_L(
        `*"Why… why did you tear open the 11th Gate after peace had already returned?! Those characters were banished from human speech for a reason! Turn back before your humanity is gone!"*`,
        `*"어째서냐… 인간 세상은 이미 평화를 되찾았거늘, 왜 제11옥의 금제를 찢고 들어간 게냐! 그 너머의 문자들은 인간이 감당할 수 없어 도려낸 저주란 말이다!"*`,
        `*「なぜだ……人の世にはすでに平穏が戻ったというのに、なぜ第十一獄の禁制を破ったのだ！ あの先の文字は人が耐えきれず切り捨てた呪いだというのに！」*`
      ))
    ]);
  } else if (phase === "peace_10") {
    logBeat("event-log", `🕯 【先】 ${pickLang(ST_L("Old Teacher's Relief", "안도하는 옛 스승", "安堵する旧師"))}`, [
      pickLang(ST_L(
        `*"You actually felled the lord of the 10th Gaol (冥府)… Look outside—the villagers' words and names have returned. Please, lay down your blade and rest here in peace."*`,
        `*"기어이 제10옥(冥府)의 주인까지 베어냈구나… 밖을 보아라, 마을 사람들의 말과 이름이 돌아오고 있다. 이제 칼을 내려놓고 이곳에서 평안히 쉬어라."*`,
        `*「ついに第十獄（冥府）の主まで斬り伏せたか……外を見よ、里人の言葉と名前が戻ってきている。もう刃を置き、ここで安らかに休むがいい。」*`
      ))
    ]);
  } else {
    logBeat("event-log", `🕯 【先】 ${pickLang(ST_L("Old Teacher of the Dying Study", "꺼져가는 서당의 옛 스승", "消えかけの書堂の旧師"))}`, [
      pickLang(ST_L(
        `*"So long as the **Talisman of Return to Life (【生】)** is with you, this lantern will call your soul home. Currently, up to the **${st.unlockedDepth}th Gaol** has been revealed."*`,
        `*"네 품에 **생환의 부적(【生】)**이 있는 한, 설령 옥문에서 쓰러져도 이 등불이 네 영혼을 고향으로 불러들일 것이다. 지금은 **제${st.unlockedDepth}옥**까지 길이 열려 있구나."*`,
        `*「お前の懐に**生還の護符（【生】）**がある限り、たとえ獄門で倒れてもこの灯が魂を呼び戻す。今は**第${st.unlockedDepth}獄**まで道が開いているぞ。」*`
      ))
    ]);
  }
}

/* ---- 2. 【炉】 잿빛 화로터 — 눈먼 노인 【老】 ---- */

function logElderArrival() {
  const phase = getStoryNarrativePhase();
  if (phase === "shura_12") {
    logBeat("event-log", `🔥 【老】 ${pickLang(ST_L("The Blind Elder by the Brazier", "화로터의 잿빛 눈 노인", "火炉跡の灰眸の老人"))}`, [
      pickLang(ST_L(
        `*"…Heh. So you swallowed even the 12th Abyss (奈落). Sensei 【先】 trembles at the sight of you, yet my blind eyes see clearly: you have become the living lexicon itself."*`,
        `*"…허허, 기어이 제12옥 나락(奈落)의 밑바닥까지 삼켜버렸군. 선생【先】은 자네를 보고 사시나무 떨듯 떨더구먼… 내 먼 눈에는 보이네. 자네야말로 살아 걸어 다니는 문자(漢字)의 심연 그 자체야."*`,
        `*「……ふふ、ついに第十二獄・奈落の底まで呑み込んだか。先生【先】はお前を見て震えておったが……わしの盲いた目には見えるぞ。お前こそが生きて歩く文字の深淵そのものだ。」*`
      ))
    ]);
  } else if (phase === "abyss_11") {
    logBeat("event-log", `🔥 【老】 ${pickLang(ST_L("The Blind Elder by the Brazier", "화로터의 잿빛 눈 노인", "火炉跡の灰眸の老人"))}`, [
      pickLang(ST_L(
        `*"You stepped across the fence of Common Kanji into the 11th Gaol, didn't you? Once you taste the true strokes of the primordial beasts, the lukewarm words of mortals can never satisfy you again…"*`,
        `*"상용(常用)의 울타리를 넘어 제11옥에 발을 들였구먼. 태고의 짐승들이 품은 진짜 획(画)의 맛을 본 자는, 결코 인간들의 미지근한 언어로 돌아가지 못하는 법이지…"*`,
        `*「常用の垣根を越え、第十一獄へ足を踏み入れたな。太古の獣が宿す真の画数の味を知った者は、二度と人の世の生温い言葉には戻れぬものよ……」*`
      ))
    ]);
  } else if (phase === "peace_10") {
    logBeat("event-log", `🔥 【老】 ${pickLang(ST_L("The Blind Elder by the Brazier", "화로터의 잿빛 눈 노인", "火炉跡の灰眸の老人"))}`, [
      pickLang(ST_L(
        `*"Sensei 【先】 rejoices that the 2,136 Common Kanji are safe. Naive man… Do you know why mortals drew a line at 2,136 characters? Because they were terrified of the 4,000 ancient curses writhing below the 10th floor…"*`,
        `*"선생【先】은 상용한자 2,136자를 되찾았다고 기뻐하더구먼. 순진한 양반… 인간들이 왜 상용(常用)이라는 울타리를 쳤는지 아나? 제10옥 밑바닥 너머에 도사린 4천여 개의 고대 문자들이 너무나도 두려워 눈을 가린 게야…"*`,
        `*「先生【先】は常用漢字2,136字を取り戻したと喜んでおったな。無邪気なことよ……人がなぜ『常用』という檻を作ったか分かるか？ 第十獄の底のさらに奥に蠢く四千もの古代文字が恐ろしくて、目を背けたのさ……」*`
      ))
    ]);
  } else {
    logBeat("event-log", `🔥 【老】 ${pickLang(ST_L("The Blind Elder by the Brazier", "화로터의 잿빛 눈 노인", "火炉跡の灰眸の老人"))}`, [
      pickLang(ST_L(
        `*"Sensei 【先】 teaches that kanji are orderly tools of human civilization. He sees only the surface. Every character is a cage built to bind a primeval spirit. Toss your characters into my brazier if you wish to see their true form."*`,
        `*"선생【先】은 한자가 인간을 이롭게 하는 단정한 규율이라 가르치지. 그건 껍데기일 뿐이야. 본래 한자란 태고의 악귀와 자연의 폭력을 획(画)이라는 창살에 가둔 주술적 감옥이네. 화로에 글자를 던져 넣어 보게."*`,
        `*「先生【先】は漢字を人の世を律する正しい規範だと教えるだろう。だがそれは表層に過ぎん。本来、漢字とは太古の悪鬼や自然の暴力を『画』という檻に閉じ込めた呪術の牢獄なのだよ。」*`
      ))
    ]);
  }
}

/* ---- 3. 【橋】 안개 낀 돌다리 — 옛 벗 【友】 ---- */

function logFriendArrival() {
  const st = ensureStoryConfig();
  const phase = getStoryNarrativePhase();

  if (phase === "shura_12") {
    logBeat("event-log", `🗡 【友】 ${pickLang(ST_L("Old Friend on the Bridge", "돌다리의 옛 벗", "石橋の旧友"))}`, [
      pickLang(ST_L(
        `*"…Hey. When you walked across the bridge just now, I didn't see my friend. I saw a mountain of corpses and blood-red strokes. Please… don't draw your blade here…"*`,
        `*"…야, 방금 네가 다리 저편에서 걸어오는데… 내 눈엔 옛 친구가 아니라 피로 쓰인 거대한 살(殺) 자 하나가 걸어오는 것 같았어. 제발… 이 마을에서만큼은 칼을 뽑지 말아 줘…"*`,
        `*「……おい、今お前が橋の向こうから歩いてきた時……俺の目には旧友ではなく、血で書かれた巨大な『殺』の字が歩いてくるように見えたんだ。頼む……この里でだけは刃を抜かないでくれ……」*`
      ))
    ]);
  } else if (phase === "abyss_11") {
    logBeat("event-log", `🗡 【友】 ${pickLang(ST_L("Old Friend on the Bridge", "돌다리의 옛 벗", "石橋の旧友"))}`, [
      pickLang(ST_L(
        `*"You're still descending?! The fog already cleared after the 10th Gaol! Look at your eyes, friend… something in that 11th depth is changing you."*`,
        `*"설마… 아직도 밑으로 내려가고 있는 거냐?! 10옥을 깨고 안개는 이미 걷혔잖아! 네 눈빛을 봐… 제11옥의 불길한 글자들이 널 집어삼키고 있어."*`,
        `*「まさか……まだ下へ潜っているのか！？ 十獄を平定して霧はもう晴れたんだぞ！ お前の目を見ろよ……第十一獄の不吉な文字にお前自身が呑まれかけているぞ。」*`
      ))
    ]);
  } else if (phase === "peace_10") {
    logBeat("event-log", `🗡 【友】 ${pickLang(ST_L("Old Friend on the Bridge", "돌다리의 옛 벗", "石橋の旧友"))}`, [
      pickLang(ST_L(
        `*"Hahaha! You really pulled it off! My wounded arm doesn't even ache anymore watching the sunlight hit the river. Our hometown is finally saved!"*`,
        `*"하하하! 네가 진짜로 해낼 줄 알았다! 강물 위로 햇빛이 비치는 걸 보니 다친 팔이 쑤시던 것도 싹 가시는구나. 우리 고향이 마침내 구원받았어!"*`,
        `*「ハハハ！ お前なら本当にやり遂げると思っていたぞ！ 川面に陽差しが反射するのを見ていると、傷んだ腕の疼きまですっかり消えていくようだ。俺たちの故郷は救われたんだ！」*`
      ))
    ]);
  } else if (!st.friendGiftClaimed) {
    logBeat("event-log", `🗡 【友】 ${pickLang(ST_L("Reunion on the Stone Bridge", "돌다리 위에서의 재회", "石橋の上での再会"))}`, [
      pickLang(ST_L(
        `*"…Is that you?! Hah… I tried holding the bridge when the black fog surged up from the cliff, but the wraiths shattered my blade and tore up my arm."*`,
        `*"…야, 너 진짜 살아 돌아왔구나! 절벽 아래에서 검은 안개가 덮쳐 올 때 어떻게든 이 다리를 막아보려 했는데… 괴물 같은 글자들에게 칼은 부러지고 팔만 이 꼴이 됐어."*`,
        `*「……おい、本当に生きて戻ってきたのか！ 崖の下から黒い霧が押し寄せてきた時、どうにかこの橋を守ろうとしたんだが……化け物じみた文字どもに刀は折られ、腕もこのざまだ。」*`
      ))
    ]);
  } else {
    const catLine = st.catRescued
      ? pickLang(ST_L(
          `*"I saw that black cat 【猫】 you rescued heading toward your ruined family home 【家】! At least one small life found warmth again."*`,
          `*"네가 옥문에서 구해 온 고양이【猫】 말이야, 네 무너진 본가【家】 아궁이 쪽으로 총총걸음으로 가던데! 가서 한번 쓰다듬어 줘."*`,
          `*「お前が獄門から救い出した猫【猫】なら、お前の崩れた生家【家】のかまどの方へ駆けていったぞ！ 行って撫でてやれよ。」*`
        ))
      : pickLang(ST_L(
          `*"By the way… before I retreated from the Gaols, I heard a small cat 【猫】 crying somewhere inside the mist. If you hear it during your expedition, please save the poor thing."*`,
          `*"참, 내가 다치기 전에 옥문 안개 속에서 어린 고양이【猫】 울음소리를 들었거든. 혹시 원정 중에 마주치거든 모른 척하지 말고 꼭 구해 줘."*`,
          `*「そうだ、俺が怪我をする前、獄門の霧の中で小さな猫【猫】の鳴き声を聞いたんだ。もし遠征中に見かけたら、見捨てずに助けてやってくれ。」*`
        ));
    logBeat("event-log", `🗡 【友】 ${pickLang(ST_L("Old Friend on the Bridge", "돌다리의 옛 벗", "石橋の旧友"))}`, [catLine]);
  }
}

/* ---- 4. 【家】 무너진 본가 — 옛집과 고양이 【猫】 ---- */

function logHomeArrival() {
  const st = ensureStoryConfig();
  const phase = getStoryNarrativePhase();

  if (st.catRescued) {
    if (phase === "shura_12") {
      logBeat("event-log", `🐱 【猫】 ${pickLang(ST_L("Hearth of the Ruined Home", "본가의 아궁이와 고양이", "生家のかまどと黒猫"))}`, [
        pickLang(ST_L(
          "Everyone in the village trembles at the smell of blood and abyssal ink on your cloak—yet the small cat 【猫】 trots out from the hearth and rubs its head warmly against your ankle.",
          "마을의 그 누구도 수라(修羅)가 된 당신의 눈을 마주치지 못하지만, 무너진 본가 아궁이에서 나온 고양이【猫】만큼은 피비린내 나는 당신의 옷자락에 변함없이 머리를 비비며 골골거립니다.",
          "里の誰もが修羅となったお前の目を見られずにいる中、崩れた生家のかまどから出てきた猫【猫】だけは、血生臭いお前の裾に変わらず頭を擦り寄せて喉を鳴らしている。"
        ))
      ]);
    } else {
      logBeat("event-log", `🐱 【猫】 ${pickLang(ST_L("Hearth of the Ruined Home", "본가의 아궁이와 고양이", "生家のかまどと黒猫"))}`, [
        pickLang(ST_L(
          "Beneath the collapsed roof of your childhood home, the rescued black cat 【猫】 is curled up beside the warm hearthstone, purring softly as you approach.",
          "무너진 본가 처마 밑, 당신이 안개 속에서 구해낸 검은 고양이【猫】가 아궁이의 잔열 곁에 웅크리고 있다가 반갑게 울며 다가옵니다. (영구 효과: 최대 체력 +15 적용 중)",
          "崩れた生家の軒下、お前が霧の中から救い出した黒猫【猫】がかまどの余熱の傍らで丸くなり、嬉しそうに鳴きながら歩み寄ってきた。（永久効果：最大HP+15適用中）"
        ))
      ]);
    }
  } else {
    logBeat("event-log", `🏚 【家】 ${pickLang(ST_L("Ruined Family Home", "폐허가 된 본가", "廃墟となった生家"))}`, [
      pickLang(ST_L(
        "You stand in the ash-covered courtyard of your childhood home. The hearth is cold and empty, waiting for warmth to return.",
        "어린 시절을 보냈던 본가의 마당은 잿더미에 덮여 고요합니다. 차갑게 식은 아궁이에는 찬 바람만이 감돌고 있습니다.",
        "幼き日々を過ごした生家の庭は灰に覆われ静まり返っている。冷え切ったかまどには冷たい風だけが吹き抜けていた。"
      ))
    ]);
  }
}

/* ---- Interactive Choices at Each Village Spot (#choice-panel) ---- */

function renderVillageSpotChoices(spotKey) {
  const st = ensureStoryConfig();
  const actions = [];

  if (spotKey === "塾") {
    if (st.introStage === 0) {
      actions.push({
        label: pickLang(ST_L(
          "💬 Ask what happened to the hometown",
          "💬 고향에 대체 무슨 일이 벌어졌는지 묻는다",
          "💬 故郷に一体何が起きたのか尋ねる"
        )),
        gold: true,
        onClick: () => {
          playClickSfx();
          st.introStage = 1;
          persistStoryState();
          logMd(`→ ${pickLang(ST_L("Ask about the calamity", "고향의 변고에 대해 묻는다", "故郷の異変について尋ねる"))}`, "choice-log");
          logBeat("event-log", `🕯 【先】 ${pickLang(ST_L("The Cracking of the Gaols", "열려버린 문자의 지옥", "開かれた文字の地獄"))}`, [
            pickLang(ST_L(
              `*"Three moons ago, the earth beneath the northern cliff split open. From that chasm—the **Gaol (獄門)**—black fog poured forth and devoured the villagers' characters (漢字) one by one."*`,
              `*"석 달 전, 마을 북쪽 절벽 아래의 땅이 갈라지며 시커먼 구렁텅이—**옥문(獄門)**—이 입을 벌렸다. 그곳에서 뿜어져 나온 안개가 사람들의 말과 글자(漢字)를 하나씩 집어삼켰지."*`,
              `*「三月前、里の北の崖下で大地が裂け、底知れぬ大穴――**獄門（ごくもん）**――が口を開けた。そこから噴き出した霧が、里人の言葉と文字（漢字）を一つずつ喰らい尽くしたのだ。」*`
            )),
            pickLang(ST_L(
              `*"Those who lost their characters became hollow wraiths, and those who entered the chasm without protection had their very names erased upon death…"*`,
              `*"글자를 빼앗긴 자들은 아귀가 되었고, 무방비로 옥문에 들어간 자들은 목숨을 잃는 순간 존재와 이름마저 안개 속에 지워지고 말았다…"*`,
              `*「文字を奪われた者は餓鬼と化し、無防備に獄門へ踏み込んだ者は命を落とすとともに存在も名前も霧の中へ消え去ってしまった……」*`
            ))
          ]);
          renderVillageSpotChoices("塾");
        }
      });
    } else if (st.introStage === 1) {
      actions.push({
        label: pickLang(ST_L(
          "🕯 Receive the 【生】 Talisman of Return to Life & hear the location of 01 獄門 (10級)",
          "🕯 스승이 건네는 【生】 생환의 부적을 받고 첫 옥문의 위치를 듣는다",
          "🕯 師が差し出す【生】生還の護符を受け取り、第一獄のありかを聞く"
        )),
        gold: true,
        onClick: () => {
          playSealStampSfx();
          st.introStage = 2;
          if (st.unlockedDepth < 1) st.unlockedDepth = 1;
          addSpecialItem("talisman_life", 1);
          persistStoryState();
          logMd(`→ ${pickLang(ST_L("Receive the Talisman of Return to Life", "【生】 생환의 부적을 건네받는다", "【生】生還の護符を受け取る"))}`, "choice-log");
          logBeat("event-log", `🕯 【生】 ${pickLang(ST_L("Heirloom of the Lantern & The First Gate", "생환의 부적과 제1옥의 해금", "生還の護符と第一獄の解禁"))}`, [
            pickLang(ST_L(
              "Sensei 【先】 unties an ancient wooden talisman scorched with the character **【生】** from the lantern stand and presses it firmly into your hand.",
              "스승 【先】이 등불 받침대에 묶여 있던 낡은 목패—**【生】 생환의 부적**—을 풀어 당신의 손에 굳게 쥐여 줍니다.",
              "師【先】は灯台に結ばれていた古い木札――**【生】生還の護符**――を解き、お前の手に固く握らせた。"
            )),
            pickLang(ST_L(
              `*"Keep this **Talisman of Return to Life (【生】)** close to your heart. Even if your body falls inside the Gaols, this talisman will pull your soul and memories back to this lantern."*`,
              `*"이 **생환의 부적(【生】)**을 품속 깊이 간직하거라. 설령 옥문 안에서 육신이 스러진다 해도, 이 부적이 네 영혼과 기억을 이 등불 앞으로 되불러들일 것이다."*`,
              `*「この**生還の護符（【生】）**を懐深くに抱いてゆけ。たとえ獄門の内で肉体が滅びようとも、この護符がお前の魂と記憶をこの灯の前へ呼び戻すだろう。」*`
            )),
            pickLang(ST_L(
              "🔓 **【Gaol Unlocked】**: The path to **【01 獄門 (漢検10級)】** beneath the northern cliff has been revealed!",
              "🔓 **【옥문 해금】**: 마을 북쪽 절벽 아래, 가장 얕은 첫 번째 문인 **【01 獄門 (漢検10級)】**의 위치가 밝혀졌습니다!",
              "🔓 **【獄門解禁】**: 里の北の崖下、最も浅い最初の門である **【01 獄門（漢検10級）】** のありかが明らかになった！"
            ))
          ]);
          updateBattleHUD(false);
          renderVillageSpotChoices("塾");
        }
      });
    } else {
      // Normal post-intro conversation & lantern offerings
      actions.push({
        label: pickLang(ST_L(
          "💬 Converse about the Gaols and the fence of Common Kanji",
          "💬 옥문의 현황과 상용(常用)의 결계에 대해 이야기를 나눈다",
          "💬 獄門の現状と『常用』の結界について語り合う"
        )),
        onClick: () => {
          playClickSfx();
          logMd(`→ ${pickLang(ST_L("Converse with Sensei 【先】", "스승 【先】과 이야기를 나눈다", "師【先】と語り合う"))}`, "choice-log");
          logBeat("event-log", `🕯 【先】 ${pickLang(ST_L("Teachings of the Study", "서당의 가르침", "書堂の教え"))}`, [
            pickLang(ST_L(
              `*"From the 1st Gaol (10級) to the 6th Gaol (5級) are the Educational Kanji taught to children; up to the 10th Gaol (2級) are the 2,136 Common Kanji that sustain human life. Slay the master of each Gaol to open the path deeper."*`,
              `*"제1옥(10급)부터 제6옥(5급)까지는 아이들이 배우는 교육한자요, 제10옥(2급)까지가 인간 세상의 질서를 지탱하는 상용한자 2,136자다. 각 옥문의 주인을 베어야만 다음 옥문으로 내려가는 봉인이 풀릴 것이다."*`,
              `*「第一獄（10級）から第六獄（5級）までは童が学ぶ教育漢字、そして第十獄（2級）までが人の世の秩序を支える常用漢字2,136字だ。各獄門の主を斬り伏せてこそ、次の獄門へ降りる封印が解かれるだろう。」*`
            ))
          ]);
          renderVillageSpotChoices("塾");
        }
      });

      if (st.senseiOfferingStage === 0 && countSpecialItem("talisman_keep") === 0) {
        const cost = 80;
        actions.push({
          label: pickLang(ST_L(
            `🕯 Offer echoes to the lantern (${cost} 円) — Weave the 【持】 Cord of Retention`,
            `🕯 등불에 잔향을 바친다 (${cost} 円) — 스승이 엮어 주는 【持】 소지의 부적`,
            `🕯 灯に残響を捧げる（${cost} 円） — 師が編み上げる【持】所持の護符`
          )),
          gold: st.yen >= cost,
          onClick: () => {
            if (st.yen < cost) {
              playClickSfx();
              logMd(pickLang(ST_L(
                `🕯 Sensei shakes his head gently: *"You need at least **${cost} 円** of residual echoes so I can bind the lantern ash into a cord."*`,
                `🕯 스승 【先】이 조용히 고개를 젓습니다: *"등불의 재로 결속의 끈을 엮으려면 최소 **${cost} 円**의 잔향이 필요하단다."*`,
                `🕯 師【先】は静かに首を振った：*「灯の灰で結束の紐を編むには、少なくとも **${cost} 円** の残響が必要だ。」*`
              )), "hint-log");
              return;
            }
            playSealStampSfx();
            addStoryYen(-cost);
            st.senseiOfferingStage = 1;
            addSpecialItem("talisman_keep", 1);
            persistStoryState();
            logMd(`→ ${pickLang(ST_L(`Offer ${cost} 円 to the study lantern`, `서당 등불에 ${cost} 円을 공양한다`, `書堂の灯に ${cost} 円を供養する`))}`, "choice-log");
            logBeat("event-log", `📿 【持】 ${pickLang(ST_L("Cord of Retention Bestowed", "【특수 소지 획득】 소지의 부적", "【特殊所持獲得】所持の護符"))}`, [
              pickLang(ST_L(
                "Sensei 【先】 mixes the offered echoes with warm lantern ash and braids a tight cord around the mouth of your satchel.",
                "스승 【先】이 당신이 바친 잔향을 등불의 따뜻한 재와 섞어, 당신의 가방 매듭에 단단한 부적 끈을 엮어 줍니다.",
                "師【先】は捧げられた残響を灯の温かい灰と混ぜ合わせ、お前の袋の口に固い護符の紐を編み上げた。"
              )),
              pickLang(ST_L(
                "📿 **【持】 Cord of Retention (Permanent Relic)** — Even if you fall in the Gaols, up to **5 Kanji cards** in your bag will never be lost.",
                "📿 **【특수 소지 획득: 【持】 소지의 부적 (영구 귀속)】** — 이제 옥문에서 쓰러져 생환할 때에도 일반 소지 한자 중 **최대 5장**을 잃지 않고 끝까지 지켜냅니다.",
                "📿 **【特殊所持獲得：【持】所持の護符（永久帰属）】** — 獄門で倒れて生還する際も、一般所持の漢字のうち**最大5枚**を失わず守り抜く。"
              ))
            ]);
            updateBattleHUD(false);
            renderVillageSpotChoices("塾");
          }
        });
      } else if (st.senseiOfferingStage === 1 && countSpecialItem("talisman_return") === 0) {
        const cost = 160;
        actions.push({
          label: pickLang(ST_L(
            `🔔 Offer deep echoes to the altar (${cost} 円) — Entrust the 【帰】 Bell of Unbroken Return`,
            `🔔 서당 제단에 깊은 잔향을 바친다 (${cost} 円) — 비전 성물 【帰】 귀환의 방울 전수`,
            `🔔 書堂の祭壇に深い残響を捧げる（${cost} 円） — 秘伝の聖物【帰】帰還の鈴の伝授`
          )),
          gold: st.yen >= cost,
          onClick: () => {
            if (st.yen < cost) {
              playClickSfx();
              logMd(pickLang(ST_L(
                `🕯 Sensei gazes at the altar: *"To awaken the bronze bell beneath the floorboards, bring **${cost} 円** of echoes."*`,
                `🕯 스승 【先】이 제단 아래를 내려다봅니다: *"마루 밑에 잠든 고동색 방울을 깨우려면 **${cost} 円**의 잔향이 모여야 한다."*`,
                `🕯 師【先】は祭壇の下を見つめた：*「床下に眠る古銅の鈴を目覚めさせるには **${cost} 円** の残響が必要だ。」*`
              )), "hint-log");
              return;
            }
            playSealStampSfx();
            addStoryYen(-cost);
            st.senseiOfferingStage = 2;
            addSpecialItem("talisman_return", 1);
            persistStoryState();
            logMd(`→ ${pickLang(ST_L(`Offer ${cost} 円 to awaken the altar bell`, `제단에 ${cost} 円을 바쳐 방울을 깨운다`, `祭壇に ${cost} 円を捧げて鈴を目覚めさせる`))}`, "choice-log");
            logBeat("event-log", `🔔 【帰】 ${pickLang(ST_L("Bell of Unbroken Return Bestowed", "【특수 소지 획득】 귀환의 방울", "【特殊所持獲得】帰還の鈴"))}`, [
              pickLang(ST_L(
                "Sensei 【先】 lifts a floorboards plank and hands you an ancient bronze bell inscribed with **【帰】**.",
                "스승 【先】이 서당 마루 밑에서 오랜 세월 잠들어 있던 고동색 방울—**【帰】 귀환의 방울**—을 꺼내 당신의 허리춤에 매어 줍니다.",
                "師【先】は書堂の床下から長い歳月眠っていた古銅の鈴――**【帰】帰還の鈴**――を取り出し、お前の腰に結んだ。"
              )),
              pickLang(ST_L(
                "🔔 **【帰】 Bell of Unbroken Return (Permanent Relic)** — Even in death or retreat, **100% of your bag's Kanji** return safely with you.",
                "🔔 **【특수 소지 획득: 【帰】 귀환의 방울 (영구 귀속)】** — 이제 옥문에서 쓰러지거나 중도에 물러나더라도 일반 소지 한자를 **단 한 장도 잃지 않고 100% 보전**합니다.",
                "🔔 **【特殊所持獲得：【帰】帰還の鈴（永久帰属）】** — 獄門で倒れるか撤退しても、一般所持の漢字を**1枚も失わず100%保全**する。"
              ))
            ]);
            updateBattleHUD(false);
            renderVillageSpotChoices("塾");
          }
        });
      } else if (!st.senseiBlessedNextRun) {
        const cost = 50;
        actions.push({
          label: pickLang(ST_L(
            `🍵 Share bitter medicinal tea with Sensei (${cost} 円) — Next run Max HP +15 & Free Reroll +1`,
            `🍵 스승이 달여 준 쓴 약차를 마시며 정신을 가다듬는다 (${cost} 円 · 다음 출정 최대 HP +15 · 리롤 +1)`,
            `🍵 師が煎じた苦い薬茶を飲み精神を整える（${cost} 円・次回出陣 最大HP+15・リロール+1）`
          )),
          onClick: () => {
            if (st.yen < cost) {
              playClickSfx();
              logMd(pickLang(ST_L(
                `🕯 You need **${cost} 円** to burn the medicinal incense and brew the tea.`,
                `🕯 약초 향을 피우고 차를 달이려면 **${cost} 円**이 필요합니다.`,
                `🕯 薬草の香を焚き茶を煎じるには **${cost} 円** が必要だ。`
              )), "hint-log");
              return;
            }
            playHealSfx();
            addStoryYen(-cost);
            st.senseiBlessedNextRun = true;
            state.maxHp += 15;
            state.playerHp = state.maxHp;
            state.rerollTokens += 1;
            persistStoryState();
            logMd(pickLang(ST_L(
              `🍵 Warmth spreads through your chest — **Next expedition Max HP +15 & Free Reroll +1** granted.`,
              `🍵 쌉싸름한 약차의 온기가 가슴 깊이 번집니다 — **다음 옥문 출정 시 최대 체력 +15 · 무료 리롤 +1** 가호가 부여되었습니다.`,
              `🍵 ほろ苦い薬茶の温もりが胸の奥まで広がる — **次回の獄門出陣時、最大HP+15・無料リロール+1** の加護が宿った。`
            )), "fx-log");
            updateBattleHUD(false);
            renderVillageSpotChoices("塾");
          }
        });
      }
    }
  } else if (spotKey === "炉") {
    // 2. 【炉】 잿빛 화로터 — 눈먼 노인 【老】
    actions.push({
      label: pickLang(ST_L(
        "💬 Listen deeply to the blind Elder's insight on the Abyss",
        "💬 화로 너머 노인의 깊은 통찰에 귀를 기울인다",
        "💬 火炉の向こうの老人の深い洞察に耳を傾ける"
      )),
      gold: !st.elderRelicClaimed && st.unlockedDepth >= 1,
      onClick: () => {
        playClickSfx();
        logMd(`→ ${pickLang(ST_L("Listen to the Elder 【老】", "노인 【老】의 통찰에 귀를 기울인다", "老人【老】の洞察に耳を傾ける"))}`, "choice-log");
        if (!st.elderRelicClaimed) {
          st.elderRelicClaimed = true;
          addSpecialItem("talisman_god", 1);
          state.freeSummons = countSpecialItem("talisman_god");
          state.rerollTokens += 1;
          persistStoryState();
          playSealStampSfx();
          logBeat("event-log", `👁 【眼】 ${pickLang(ST_L("The Mind's Eye Awakened", "【특수 소지 획득】 심안의 부적", "【特殊所持獲得】心眼の護符"))}`, [
            pickLang(ST_L(
              `*"Sensei 【先】 fears the ancient characters beyond the Common fence, yet one cannot cut down a nightmare with closed eyes. Take this obsidian bead—it holds the gaze of those who read the sky before paper existed."*`,
              `*"선생【先】은 울타리 너머의 고대 글자들을 두려워하지만, 눈을 감고서야 어찌 악몽을 베겠나. 자, 화로 밑바닥에서 건져 올린 이 흑요석 구슬을 받아 두게. 종이가 생겨나기 전 하늘의 획을 읽던 고신(古神)의 눈동자라네."*`,
              `*「先生【先】は垣根の向こうの古代文字を恐れるが、目を閉じていてはどうやって悪夢を斬れるというのだ。さあ、火炉の底から拾い上げたこの黒曜石の珠を受け取るがいい。紙が生まれる前に天の画を読んでいた古神の瞳よ。」*`
            )),
            pickLang(ST_L(
              "👁 **【眼】 Bead of the Mind's Eye (Permanent Relic)** — Grants **+1 free Ancient God summon** and **+1 free Reroll** on every expedition!",
              "👁 **【특수 소지 획득: 【眼】 심안의 부적 (영구 귀속)】** — 매 옥문 출정마다 **무료 고신(古神) 소환 +1** 및 **무료 조율(리롤) +1**이 부여됩니다!",
              "👁 **【特殊所持獲得：【眼】心眼の護符（永久帰属）】** — 毎回の獄門出陣ごとに **無料古神召喚+1** および **無料調律（リロール）+1** が付与される！"
            ))
          ]);
          updateBattleHUD(false);
        } else {
          logBeat("event-log", `🔥 【老】 ${pickLang(ST_L("Whispers of the Ash", "재 속에서 피어오르는 진실", "灰の中から立ち昇る真実"))}`, [
            pickLang(ST_L(
              `*"When two characters are cast into the fire together, their strokes devour one another and birth a denser, older curse. And when a character is burned to ash, its residual echo (円) remains."*`,
              `*"두 글자를 한데 묶어 화로에 던지면 획과 획이 서로를 삼켜 더 짙고 오래된 글자로 다시 태어나지. 반대로 필요 없는 글자를 태우면 그 안에 맺힌 잔향(円)만 남는 법이고."*`,
              `*「二つの文字を共に火炉へ投げ込めば、画と画が互いを喰らい合い、より濃く古い文字へと生まれ変わる。逆に不要な文字を焼けば、そこに宿っていた残響（円）だけが残るというわけさ。」*`
            ))
          ]);
        }
        renderVillageSpotChoices("炉");
      }
    });

    actions.push({
      label: pickLang(ST_L(
        `🔥 Cast 2 Kanji from your bag into the brazier (Fusion · 80 円 · Bag: ${st.deck.length})`,
        `🔥 화로에 가방 속 한자 두 장을 던져 넣어 합친다 (합자 연성 · 80 円 · 소지 ${st.deck.length}장)`,
        `🔥 火炉に袋の漢字二枚を投げ入れて掛け合わせる（合字錬成・80 円・所持 ${st.deck.length}枚）`
      )),
      onClick: () =>openVillageBrazierFuse()
    });

    actions.push({
      label: pickLang(ST_L(
        `🕯 Burn 1 Kanji from your bag into echoes (+35 円 · Bag: ${st.deck.length})`,
        `🕯 가방 속 한자를 화로에 태워 잔향으로 환원한다 (+35 円 · 소지 ${st.deck.length}장)`,
        `🕯 袋の漢字を火炉で焼き、残響へ還元する（+35 円・所持 ${st.deck.length}枚）`
      )),
      onClick: () => openVillageBrazierBurn()
    });

    if ((st.defeatedFoes || []).length > 0) {
      actions.push({
        label: pickLang(ST_L(
          `💀 Call the names of slain wraiths into the ash (Re-summon ${st.defeatedFoes.length} foes · 60 円)`,
          `💀 베어낸 원령들의 이름을 화로에 불러 다시 깨운다 (${st.defeatedFoes.length}종 재소환 · 60 円)`,
          `💀 斬り伏せた怨霊の名を火炉に呼んで蘇らせる（${st.defeatedFoes.length}種再召喚・60 円）`
        )),
        onClick: () => {
          if (st.yen < 60) {
            playClickSfx();
            logMd(pickLang(ST_L(
              "🔥 The Elder shakes his head: *\"You need **60 円** of echoes to stir the ashes of slain wraiths.\"*",
              "🔥 노인이 고개를 젓습니다: *\"죽은 원령들의 재를 다시 일으키려면 **60 円**의 잔향이 필요하네.\"*",
              "🔥 老人は首を振った：*「死んだ怨霊の灰を再び起こすには **60 円** の残響が必要だ。」*"
            )), "hint-log");
            return;
          }
          playGongSfx();
          addStoryYen(-60);
          st.defeatedFoes = [];
          state.defeatedEnemies = [...(st.defeatedBosses || [])];
          persistStoryState();
          logMd(pickLang(ST_L(
            "💀 Black smoke billows from the brazier — all slain normal/elite wraiths across the Gaols have risen once more!",
            "💀 화로에서 시커먼 연기가 치솟으며 옥문 전역의 일반·정예 원령들이 다시 깨어났습니다! (수급한 주인 토벌 기록은 유지)",
            "💀 火炉から黒煙が立ち昇り、獄門全域の通常・精鋭の怨霊たちが再び目を覚ました！（獄門の主の討伐記録は維持）"
          )), "fx-log");
          updateBattleHUD(false);
          renderVillageSpotChoices("炉");
        }
      });
    }
  } else if (spotKey === "橋") {
    // 3. 【橋】 안개 낀 돌다리 — 옛 벗 【友】 (대화 속에 자연스럽게 전낭/매듭 전수 통합)
    actions.push({
      label: pickLang(ST_L(
        "💬 Talk with your friend 【友】 leaning against the stone parapet",
        "💬 다리 난간에 기댄 옛 벗 【友】과 이야기를 나눈다",
        "💬 石橋の欄干に凭れる旧友【友】と語り合う"
      )),
      gold: !st.friendGiftClaimed,
      onClick: () => {
        logMd(`→ ${pickLang(ST_L("Talk with 【友】", "옛 벗 【友】과 이야기를 나눈다", "旧友【友】と語り合う"))}`, "choice-log");
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
          logBeat("event-log", `🗡 【友】 ${pickLang(ST_L("Words on the Bridge & Knot of Echoes", "돌다리 위에서의 해후", "石橋の上での邂逅"))}`, [
            pickLang(ST_L(
              `*"I can't swing a blade with this shattered arm anyway… Here, take the characters and echoes left in my pouch, and tie this **Knot of Residual Echoes (【富】)** around your wrist."*`,
              `*"이 부러진 팔로는 당분간 칼도 못 쥐니까… 내 품에 남아 있던 글자들이랑 잔향은 네가 가져가. 그리고 이 **잔향의 매듭(【富】)**을 손목에 감아 둬. 원령을 베었을 때 흩어지는 잔향을 끌어모아 줄 거야."*`,
              `*「この折れた腕じゃしばらく刀も握れないからな……俺の懐に残っていた文字と残響はお前が持っていろ。それとこの**残響の結び（【富】）**を手首に巻いておけ。」*`
            )),
            pickLang(ST_L(
              "🎁 Received **+80 円**, normal Kanji **【火 · 水 · 刀】**, and **【富】 Knot of Residual Echoes (+50% 円 gain)**.",
              "🎁 대화 끝에 벗이 건넨 **+80 円**, 일반 소지 한자 **【火 · 水 · 刀】**, 그리고 **【특수 소지: 【富】 잔향의 매듭 (적 처치 시 円 +50%)】**을 품에 넣었습니다.",
              "🎁 旧友から **+80 円**、一般所持漢字 **【火・水・刀】**、そして **【特殊所持：【富】残響の結び（敵討伐時の円+50%）】** を受け取った。"
            ))
          ]);
          updateBattleHUD(false);
        } else {
          playClickSfx();
          logFriendArrival();
        }
        renderVillageSpotChoices("橋");
      }
    });
  } else if (spotKey === "家") {
    // 4. 【家】 무너진 본가 — 옛집과 고양이 【猫】
    if (st.catRescued) {
      if (!st.catBlessedNextRun) {
        actions.push({
          label: pickLang(ST_L(
            "🐾 Stroke the black cat 【猫】 by the hearth (Next expedition Max HP +15 & Free Reroll +1)",
            "🐾 아궁이 곁의 고양이 【猫】를 쓰다듬는다 (다음 출정 시 최대 체력 +15 · 무료 리롤 +1)",
            "🐾 かまどの傍らの黒猫【猫】を撫でる（次回出陣時、最大HP+15・無料リロール+1）"
          )),
          gold: true,
          onClick: () => {
            playHealSfx();
            st.catBlessedNextRun = true;
            state.maxHp += 15;
            state.playerHp = state.maxHp;
            state.rerollTokens += 1;
            persistStoryState();
            logMd(`→ ${pickLang(ST_L("Stroke the rescued cat 【猫】", "구출한 고양이 【猫】의 턱밑을 쓰다듬는다", "救出した黒猫【猫】の顎を撫でる"))}`, "choice-log");
            logMd(pickLang(ST_L(
              "🐱 **【猫】** purrs warmly against your palm — **Next expedition Max HP +15 & Free Reroll +1** granted!",
              "🐱 **【猫】**가 따뜻한 아궁이 곁에서 기분 좋게 골골거립니다 — **다음 옥문 출정 시 최대 체력 +15 · 무료 리롤 +1** 축복을 받았습니다!",
              "🐱 **【猫】**が温かいかまどの傍らで心地よさそうに喉を鳴らした — **次回の獄門出陣時、最大HP+15・無料リロール+1** の祝福を受けた！"
            )), "fx-log");
            updateBattleHUD(false);
            renderVillageSpotChoices("家");
          }
        });
      } else {
        actions.push({
          label: pickLang(ST_L(
            "🐾 Watch the black cat 【猫】 nap peacefully by the hearth",
            "🐾 아궁이 곁에서 평화롭게 졸고 있는 고양이 【猫】를 바라본다",
            "🐾 かまどの傍らで安らかにまどろむ黒猫【猫】を見つめる"
          )),
          onClick: () => {
            playClickSfx();
            logMd(pickLang(ST_L(
              "🐱 **【猫】** flicks its tail lazily in the warmth. Its blessing is already with you for your next expedition.",
              "🐱 **【猫】**가 아궁이 잔열 속에서 꼬리를 살랑입니다. 이미 다음 출정을 위한 고양이의 온기가 당신과 함께하고 있습니다.",
              "🐱 **【猫】**がかまどの余熱の中で尻尾を揺らしている。すでに次回出陣のための温もりがお前に宿っている。"
            )), "sys-log");
            renderVillageSpotChoices("家");
          }
        });
      }
    } else {
      actions.push({
        label: pickLang(ST_L(
          "🏚 Search the cold hearth beneath the collapsed roof",
          "🏚 무너진 처마 밑과 식어버린 아궁이 주변을 살핀다",
          "🏚 崩れた軒下と冷え切ったかまどの周りを調べる"
        )),
        onClick: () => {
          playClickSfx();
          logMd(pickLang(ST_L(
            "Beneath the collapsed roof, cold ash scatters across the empty hearthstone.",
            "무너진 지붕 밑 차가운 아궁이에 검은 재만 흩날린다. 바람이 불 때마다 어릴 적의 기억이 서늘하게 스쳐 지나간다.",
            "崩れた屋根の下、冷え切ったかまどに黒い灰だけが舞っている。"
          )), "sys-log");
          renderVillageSpotChoices("家");
        }
      });
    }
  } else if (spotKey === "井") {
    actions.push({
      label: "💧 우물가 여인【女】에게 다가간다",
      onClick: () => {
        playClickSfx();
        logMd("→ 우물가 여인【女】에게 다가간다", "choice-log");
        if (!state.wellVisited) {
          state.wellVisited = true;
          const cap = typeof MAX_DECK_SIZE !== "undefined" ? MAX_DECK_SIZE : 40;
          if (st.deck.length < cap) {
            st.deck.push("水");
            state.deck = [...st.deck];
            persistStoryState();
          }
          logBeat("event-log", "💧 【女】 우물가의 여인", [
            "여인이 핏물이 빠지지 않는 무명천을 짜다 말고, 젖은 손으로 차가운 물방울이 맺힌 한자 조각 **【水】** 하나를 건넨다.",
            "\"…우물 밑바닥에서 건져 올린 글자예요. 목이 타들어 갈 때 쓰세요…\""
          ]);
        } else {
          logBeat("event-log", "💧 【女】 우물가의 여인", [
            "여인이 고개를 숙인 채 마른 천을 다시 물에 적신다.",
            "\"옥문 깊은 곳에서는 자비도, 동정도 통하지 않아요. 부디 팔다리 온전히 돌아오시길…\""
          ]);
        }
        updateBattleHUD(false);
        renderVillageSpotChoices("井");
      }
    });
  } else if (spotKey === "鍛") {
    actions.push({
      label: "⚒ 대장장이【男】에게 칼날을 내보인다",
      onClick: () => {
        playClickSfx();
        logMd("→ 대장장이【男】에게 칼날을 내보인다", "choice-log");
        if (!state.smithVisited) {
          state.smithVisited = true;
          const cap = typeof MAX_DECK_SIZE !== "undefined" ? MAX_DECK_SIZE : 40;
          if (st.deck.length < cap) {
            st.deck.push("鉄");
            state.deck = [...st.deck];
            persistStoryState();
          }
          logBeat("event-log", "⚒ 【男】 무너진 대장간", [
            "사내가 굳은살 박인 엄지로 당신의 칼날을 훑더니, 모루 위에서 벼려낸 묵직한 쇠 글자 **【鉄】** 하나를 툭 던져 준다.",
            "\"이딴 무딘 날로 뭘 베겠다는 거냐. 가방에 쇠【鉄】라도 한 장 품고 가라. 살점이 뜯겨 나가기 싫거든.\""
          ]);
        } else {
          logBeat("event-log", "⚒ 【男】 무너진 대장간", [
            "사내는 말없이 식어버린 모루 위에 망치질만 계속하고 있다.",
            "\"글자의 급수가 높아질수록 원령들의 가죽은 무쇠보다 단단해진다. 어설픈 획으로는 기스도 안 날 거다.\""
          ]);
        }
        updateBattleHUD(false);
        renderVillageSpotChoices("鍛");
      }
    });
  } else if (spotKey === "祠") {
    if (!state.shrinePrayed) {
      actions.push({
        label: "⛩ 금줄이 감긴 당산 사당 앞에 고개를 숙인다",
        onClick: () => {
          playGongSfx();
          state.shrinePrayed = true;
          state.rerollTokens += 1;
          updateBattleHUD(false);
          logMd("⛩ 비바람에 깎인 사당 앞에서 묵념하자 서늘한 바람이 이마를 스치며 정신이 맑아집니다. (**조율/리롤 +1**)", "fx-log");
          renderVillageSpotChoices("祠");
        }
      });
    } else {
      actions.push({
        label: "⛩ 고요해진 돌제단을 살핀다",
        onClick: () => {
          playClickSfx();
          logMd("⛩ 붉은 금줄이 바람에 희미하게 흔들릴 뿐, 사당은 다시 깊은 침묵에 잠겨 있습니다.", "sys-log");
          renderVillageSpotChoices("祠");
        }
      });
    }
  } else if (spotKey === "墓") {
    actions.push({
      label: "🪦 글자가 깎여 나간 무명 비석을 어루만진다",
      onClick: () => {
        playClickSfx();
        logMd("→ 글자가 지워진 비석을 어루만진다", "choice-log");
        if (!state.graveSearched) {
          state.graveSearched = true;
          addStoryYen(25);
          persistStoryState();
          logBeat("event-log", "🪦 【墓】 비석 밑의 유품", [
            "비석의 차가운 돌 표면을 쓸어내리자, 무너진 흙더미 사이에서 이름 모를 망자가 남긴 **25 円**의 잔향이 손끝에 걸립니다."
          ]);
        } else {
          logBeat("event-log", "🪦 【墓】 비석의 한기", [
            "이름을 빼앗긴 자들이 묻힌 자리. 안개 속에서 차가운 한기만이 손끝을 타고 오릅니다."
          ]);
        }
        updateBattleHUD(false);
        renderVillageSpotChoices("墓");
      }
    });
  }
  actions.push({
    label: pickLang(ST_L(
      "↩ Return to the Village Crossroads (【里】)",
      "↩ 마을 갈림길(【里】)로 돌아간다",
      "↩ 里の辻（【里】）へ戻る"
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

  const indexedChoices = st.deck.map((k, idx) => `${k}#${idx}`);
  openPicker({
    title: pickLang(ST_L("🔥 Cast 2 Kanji Into the Brazier (80 円)", "🔥 화로 합자 연성 (2장 선택 · 80 円)", "🔥 火炉の合字錬成（2枚選択・80 円）")),
    desc: pickLang(ST_L(
      "Choose 2 Kanji from your bag to fuse in the Elder's ash brazier.",
      "노인의 화로에 던져 넣어 하나로 합칠 한자 2장을 고르세요.",
      "老人の火炉に投げ入れて一つに掛け合わせる漢字を2枚選べ。"
    )),
    choices: indexedChoices.map(c => c.split("#")[0]),
    selected: [],
    need: 2,
    confirmLabel: (n) => `${pickLang(ST_L("Fuse in Brazier", "화로에 던져 연성", "火炉で錬成"))} (${n}/2)`,
    onCancel: () => closePicker(),
    onConfirm: (pickedKanji) => {
      closePicker();
      if (!pickedKanji || pickedKanji.length < 2) return;
      const k1 = pickedKanji[0];
      const k2 = pickedKanji[1];
      // Remove one instance of k1 and one instance of k2 from st.deck
      const i1 = st.deck.indexOf(k1);
      if (i1 >= 0) st.deck.splice(i1, 1);
      const i2 = st.deck.indexOf(k2);
      if (i2 >= 0) st.deck.splice(i2, 1);

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
  });
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
      "Choose 1 Kanji from your bag to burn in the brazier for +35 円.",
      "화로에 태워 +35 円의 잔향으로 환원할 한자 1장을 선택하세요.",
      "火炉で焼べて+35円の残響へ還元する漢字を1枚選べ。"
    )),
    choices: [...st.deck],
    selected: [],
    need: 1,
    confirmLabel: (n) => `${pickLang(ST_L("Burn into Ash", "화로에 소각", "火炉で焼却"))} (${n}/1)`,
    onCancel: () => closePicker(),
    onConfirm: (pickedKanji) => {
      closePicker();
      if (!pickedKanji || !pickedKanji.length) return;
      const k = pickedKanji[0];
      const idx = st.deck.indexOf(k);
      if (idx >= 0) st.deck.splice(idx, 1);
      state.deck = [...st.deck];
      addStoryYen(35);
      persistStoryState();
      playClickSfx();
      logMd(pickLang(ST_L(
        `🕯 Burned **【${k}】** in the Elder's brazier → Recovered **+35 円**!`,
        `🕯 가방의 **【${k}】** 한 장을 노인의 화로에 태워 **+35 円**의 잔향을 거두었습니다.`,
        `🕯 袋の **【${k}】** を老人の火炉で焼き、**+35 円** の残響を回収した。`
      )), "fx-log");
      updateBattleHUD(false);
      renderVillageSpotChoices("炉");
    }
  });
}

/* Render Special Possessions banner inside the Deck Viewer (#pick-modal) when in Story Mode */
function renderSpecialItemsBannerHtml() {
  if (!isStoryMode()) return "";
  const st = ensureStoryConfig();
  const owned = (st.specialItems || []).filter(it => it.count > 0 && STORY_SPECIAL_ITEMS[it.id]);

  const title = pickLang(ST_L(
    `📿 Special Relics (Never lost on death) · 🪙 ${(st.yen || 0).toLocaleString()} 円`,
    `📿 특수 소지 (사망 시에도 영구 보존되는 성물) · 🪙 ${(st.yen || 0).toLocaleString()} 円`,
    `📿 特殊所持（死亡時も永久に失われない聖物） · 🪙 ${(st.yen || 0).toLocaleString()} 円`
  ));

  if (!owned.length) {
    const emptyTxt = pickLang(ST_L(
      "No Special Relics yet — explore the Village of the Lantern (【里】) and speak with its survivors.",
      "보유한 특수 소지가 없습니다 — 등불의 마을(【里】)을 탐방하며 주민들과 대화를 나눠 보세요.",
      "特殊所持なし — 灯の里（【里】）を巡り、里人たちと語り合ってみよう。"
    ));
    return `<div class="special-bag-box"><div class="special-bag-title">${escapeHtml(title)}</div><div class="special-bag-empty">${escapeHtml(emptyTxt)}</div></div>`;
  }

  const chips = owned.map(it => {
    const def = STORY_SPECIAL_ITEMS[it.id];
    return `<div class="special-bag-chip" title="${escapeHtml(pickLang(def.desc))}">
      <span class="sbc-kanji tier-${def.tier}">${escapeHtml(def.kanji)}</span>
      <span class="sbc-name">${escapeHtml(pickLang(def.name))}</span>
    </div>`;
  }).join("");

  return `<div class="special-bag-box">
    <div class="special-bag-title">${escapeHtml(title)}</div>
    <div class="special-bag-list">${chips}</div>
  </div>`;
}
