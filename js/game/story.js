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
      EN: "Obsidian bead bestowed by the blind Elder 【老】. Grants Ancient God Summon +1 and Reroll +1 at the start of every expedition.",
      KO: "잿빛 눈의 노인【老】이 건네준 흑요석 부적. 매 출정마다 고신 소환 1회 및 리롤 1회를 부여합니다.",
      JA: "灰色の目の老人【老】から授かった黒曜石の護符。毎回の出陣時に古神召喚1回・リロール1回を付与する。",
      ZH_CN: "灰眸老人【老】赐予的黑曜石护符。每次出征时赋予古神召唤+1与重掷+1。",
      ZH_TW: "灰眸老人【老】賜予的黑曜石護符。每次出征時賦予古神召喚+1與重擲+1。"
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
  if (typeof getBossLastWords === "function") {
    return getBossLastWords(bossKanji, "depth_10");
  }
  return pickLang(ST_L(
    `💀 **【${bossKanji}】**: *"…The Tenth Gate shatters. Return to your lantern-lit village as a human—or step below and become a monster forever…"*`,
    `💀 **【${bossKanji}】**: *"…열 번째 자물쇠가 부서졌구나. 등불 켜진 마을로 돌아가 사람으로 남든가… 저 아래 금역으로 내려와 영원히 괴물이 되든가…"*`,
    `💀 **【${bossKanji}】**: *「……第十の錠が砕けたか。灯のともる里へ還り人として生きるか……下の禁域へ降りて永遠の化け物となるか……」*`
  ));
}

function getHumanWorldHappyEndingLines() {
  return [
    pickLang(ST_L(
      "As the lord of the Tenth Gaol falls, the ash-gray fog over the valley parts and pale dawn light touches the village roofs.",
      "열 번째 옥문의 주인이 쓰러지자 골짜기를 짓누르던 잿빛 안개가 갈라지고, 처마 끝마다 창백한 새벽빛이 내려앉습니다.",
      "第十獄の主が倒れると、谷を覆っていた灰色の霧が裂け、軒先に淡い暁の光が降り注いだ。"
    )),
    pickLang(ST_L(
      "The stolen words of the living have returned to human lips. In Lantern Village, those who waited through the long night call your name.",
      "빼앗겼던 산 자의 말들이 마침내 사람들의 입술로 돌아왔습니다. 긴 밤을 견뎌낸 등불의 마을에서 스승【先】과 벗【友】이 그대의 이름을 부릅니다.",
      "奪われていた生者の言葉がついに人々の唇へと還った。長き夜を耐え抜いた灯の里で、師【先】と友【友】が貴方の名を呼んでいる。"
    )),
    pickLang(ST_L(
      "…Yet beneath the cracked stone of the Tenth Gate, a forbidden pulse excised from mortal speech begins to beat.",
      "…허나 열 번째 문바닥의 갈라진 틈새 아래에서, 사람의 말 밖으로 도려내졌던 금역의 맥동이 조용히 고동치기 시작합니다.",
      "……だが第十の門のひび割れた石畳の下で、人の言葉の外へ切り捨てられた禁域の脈動が静かに打ち始めていた。"
    ))
  ];
}

function getShuraEndingLines() {
  return [
    pickLang(ST_L(
      "Even the primordial fiends at the bottom of the Twelfth Gaol have been drunk dry by your ink-black blade.",
      "사람의 눈으로는 읽을 수조차 없는 열두 번째 나락 밑바닥의 태고신마저 그대의 검붉은 칼끝에 삼켜졌습니다.",
      "人の目では読むことすら叶わぬ第十二獄・奈落の底の太古神すら、貴方の黒紅き切っ先に呑み込まれた。"
    )),
    pickLang(ST_L(
      "Ten thousand strokes coil beneath your skin. When you turn your steps back toward the village, even the paper lanterns go dark in dread.",
      "만 갈래의 획이 혈관 속에서 소용돌이칩니다. 그대가 고향 마을을 향해 발걸음을 돌리자, 등불마저 공포에 질려 일제히 빛을 거둡니다.",
      "万の画数が血管の中で渦巻いている。貴方が故郷の里へと歩みを返すと、提灯の火すら恐怖に凍りついて一斉に消えた。"
    ))
  ];
}

function getVillageGateModalLore(nPhase) {
  const st = ensureStoryConfig();
  const clearedCount = Array.isArray(st.clearedDepths) ? st.clearedDepths.length : Math.max(0, (st.unlockedDepth || 1) - 1);
  if (nPhase === "shura_12") {
    return pickLang(ST_L(
      "The village lanterns burn the color of dried blood. Every door is barred from the inside; the survivors hear the footsteps of a Shura in the mist.",
      "마을의 등불들이 말라붙은 핏빛으로 흔들리고 모든 문짝이 안쪽에서 굳게 잠겨 있습니다. 살아남은 이들은 안개 속에서 걸어오는 수라(修羅)의 발소리에 숨을 죽입니다.",
      "里の提灯は乾いた血の色に揺らめき、全ての戸が内側から固く閉ざされている。生き残った者たちは霧の中を歩み来る修羅の足音に息を殺していた。"
    ));
  }
  if (nPhase === "abyss_11") {
    return pickLang(ST_L(
      "Though human words returned to the streets, a chilling shadow of primeval ink follows your heels from the Eleventh Gate.",
      "골목에는 사람들의 말소리가 돌아왔으나, 제11옥의 금제를 찢고 돌아온 그대의 그림자 끝에서 서늘한 태고의 묵향이 번져 나갑니다.",
      "路地には人々の話し声が戻ったものの、第十一獄の禁制を破って戻った貴方の影からは冷たい太古の墨香が滲み出ている。"
    ));
  }
  if (nPhase === "peace_10") {
    return pickLang(ST_L(
      "Morning light warms the ash-swept roofs. The gouged-out signposts carry their names once more, and the scent of tea drifts from the study hall.",
      "검은 재를 쓸어낸 처마 위로 아침 볕이 스며들고, 파여 나갔던 현판마다 옛 글자가 되살아났습니다. 서당에서는 따뜻한 약차 향기가 골목으로 번집니다.",
      "黒い灰を掃き清めた軒先に朝陽が差し込み、削り取られていた扁額には古き文字が蘇った。書堂からは温かい薬茶の香りが路地へと漂っている。"
    ));
  }
  if (clearedCount >= 6) {
    return pickLang(ST_L(
      "Over half the stolen words have returned. Smoke rises from the smithy furnace and the nameless headstones bear their epitaphs again.",
      "빼앗겼던 말의 절반 이상이 고향으로 돌아왔습니다. 대장간 화덕에서 다시 연기가 피어오르고, 비어 있던 무덤비마다 망자의 이름이 또렷이 읽힙니다.",
      "奪われた言葉の半ば以上が故郷へと還った。鍛冶場の炉から再び煙が立ち昇り、空白だった墓石には亡者の名がはっきりと浮かび上がっている。"
    ));
  }
  if (clearedCount >= 2) {
    return pickLang(ST_L(
      "Faint warmth returns to the ruined village. A few characters have resurfaced on the road signs, and whispers of speech echo by the well.",
      "폐허가 되었던 마을에 희미한 온기가 감돕니다. 어귀의 이정표에 몇 글자가 되살아나고, 우물가에서는 더듬거리는 말소리가 들려옵니다.",
      "廃墟と化していた里に仄かな温もりが戻り始めた。道標にいくつかの文字が蘇り、井戸端からは辿々しい話し声が聞こえてくる。"
    ));
  }
  return pickLang(ST_L(
    "Broken roofs lie buried under black ash, and the characters on the village signposts have been gouged out. Through the fog, only a faint paper lantern sways.",
    "오랜만에 돌아온 고향의 처마들은 검은 재에 파묻혀 있고, 어귀의 이정표와 현판은 누군가 후벼 판 듯 글자가 파여 나갔습니다. 잿빛 안개 너머로 꺼져가는 등불만이 흔들립니다.",
    "久方ぶりに戻った故郷の軒並みは黒い灰に埋もれ、道標や扁額は抉られたように文字が削り取られている。灰色の霧の向こうで消えかけの灯だけが揺れていた。"
  ));
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
    if (!Array.isArray(st.clearedDepths)) st.clearedDepths = [];
    if (depthId && !st.clearedDepths.includes(depthId)) {
      st.clearedDepths.push(depthId);
      st.lastClearedDepth = dNum;
    }
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
 * 【里】 등불의 마을 (DEPTH 0) — STAGE EXPLORATION & SEKIRO-STYLE LIVING CHRONICLE
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

/* Per-Gaol Village Restoration Chronicles shown when returning to Lantern Village after slaying a Boss */
const VILLAGE_RETURN_CHRONICLES = {
  1: ST_L(
    "🕯 **【Words Returned — First Gaol】**: On the wooden signposts by the gate, the characters for **Sun【日】**, **Moon【月】**, and **Water【水】** have resurfaced in faint ink. Near the well, a child points at the sky and whispers a word for the first time in months.",
    "🕯 **【돌아온 말 · 제1옥】**: 파여 나갔던 마을 어귀 이정표에 **【日·月·水】**의 획이 희미한 먹빛으로 다시 배어 나왔습니다. 우물가에서는 말문을 잃었던 아이가 석 달 만에 처음으로 하늘을 가리키며 이름을 중얼거립니다.",
    "🕯 **【還りし言葉・第一獄】**: 削り取られていた里の道標に**【日・月・水】**の画が淡い墨色で浮かび上がった。井戸端では言葉を失っていた童が三月ぶりに空を指さし、その名を呟いている。"
  ),
  2: ST_L(
    "🕯 **【Words Returned — Second Gaol】**: The stagnant air over the roofs stirs as **Wind【風】** and **Morning【朝】** return. The suffocating endless dusk gives way to the scent of wet grass and turning seasons.",
    "🕯 **【돌아온 말 · 제2옥】**: 고여 있던 처마 끝의 공기가 흔들리며 **【風】**과 **【朝·夜】**의 감각이 마을로 돌아왔습니다. 끝없는 땅거미에 갇혀 있던 골짜기에 비로소 풀내음과 계절의 결이 스며듭니다.",
    "🕯 **【還りし言葉・第二獄】**: 澱んでいた軒先の空気が揺れ、**【風】**と**【朝・夜】**の感覚が里へと還った。終わりなき夕闇に閉ざされていた谷に、草の匂いと季節の移ろいが染み渡る。"
  ),
  3: ST_L(
    "🕯 **【Words Returned — Third Gaol】**: Labels have reappeared on the herb jars inside the study hall. With **Medicine【薬】** and **Breath【息】** restored, the hollow coughing behind the village shutters begins to subside.",
    "🕯 **【돌아온 말 · 제3옥】**: 서당 구석의 약단지마다 지워졌던 **【薬】**과 **【命·息】** 글자가 되살아났습니다. 판자문 너머로 밤새 들려오던 마을 사람들의 마른기침 소리가 한결 잦아들었습니다.",
    "🕯 **【還りし言葉・第三獄】**: 書堂の隅の薬壺に消えていた**【薬】**と**【命・息】**の字が蘇った。板戸の向こうから夜通し響いていた里人たちの乾いた咳が静まりつつある。"
  ),
  4: ST_L(
    "🕯 **【Words Returned — Fourth Gaol】**: Across the blank parchment maps on the bridge post, the names of distant provinces and castles **【城·道·県】** bleed back into view. The village is no longer an island severed from the world.",
    "🕯 **【돌아온 말 · 제4옥】**: 돌다리 초소에 걸린 백지 지도 위로 이바라키, 에히메, 도치기 등 지워졌던 고을과 옛 가도**【城·道·県】**의 이름이 먹물처럼 되살아났습니다. 고립되었던 고향이 다시 이승의 땅과 이어집니다.",
    "🕯 **【還りし言葉・第四獄】**: 石橋の詰め所に掛けられた白紙の地図の上に、消えていた州や古き街道**【城・道・県】**の名が墨のように浮かび上がった。孤立していた故郷が再び現世の土地と繋がり始める。"
  ),
  5: ST_L(
    "🕯 **【Words Returned — Fifth Gaol】**: Out in the misty graveyard, chiseled-out headstones regain the carved names of the dead **【墓·魂·弔】**. Survivors kneel before the stones, finally able to weep for those they had forgotten.",
    "🕯 **【돌아온 말 · 제5옥】**: 안개 낀 무명 묘지의 비석마다 깎여 나갔던 망자들의 이름과 **【墓·魂·弔】**의 비문이 되새겨졌습니다. 누구를 잃었는지조차 잊고 있던 이들이 비석 앞에서 비로소 이름을 부르며 눈물을 흘립니다.",
    "🕯 **【還りし言葉・第五獄】**: 霧の墓所の墓石一つ一つに、削り取られていた亡者の名と**【墓・魂・弔】**の碑文が刻み直された。誰を失ったかすら忘れていた人々が、墓前でついにその名を呼んで涙を流している。"
  ),
  6: ST_L(
    "🕯 **【Words Returned — Sixth Gaol】**: With the fall of the Bone Citadel's lord, the words for **Bone【骨】**, **Pulse【脈】**, and **Resolve【志】** return. The stooped backs of the villagers straighten with living warmth.",
    "🕯 **【돌아온 말 · 제6옥】**: 백골성의 주인이 스러지자 **【骨·脈·志】**의 글자가 산 자들의 몸으로 돌아왔습니다. 허깨비처럼 구부정하게 흔들리던 마을 사람들의 등줄기에 다시 뜨거운 맥박과 기개가 돕니다.",
    "🕯 **【還りし言葉・第六獄】**: 白骨城の主が倒れ、**【骨・脈・志】**の字が生者の身体へと還った。亡霊のように俯いていた里人たちの背筋に、再び熱い脈動と気概が宿り始める。"
  ),
  7: ST_L(
    "🕯 **【Words Returned — Seventh Gaol】**: Clear, ringing hammer-strikes echo from the smithy. Now that **Blade【刃】**, **Steel【鋼】**, and **Oath【誓】** have been reclaimed, notched iron gleams with a keen edge once more.",
    "🕯 **【돌아온 말 · 제7옥】**: 무너진 대장간에서 맑고 짱짱한 망치 소리가 울려 퍼집니다. **【剣·刃·誓】**의 이름이 돌아오자, 녹슬고 이 빠졌던 쇠붙이들이 다시 서슬 퍼런 날을 세웁니다.",
    "🕯 **【還りし言葉・第七獄】**: 崩れた鍛冶場から澄んだ槌音が響き渡る。**【剣・刃・誓】**の名が取り戻されたことで、錆びついていた鉄が再び鋭い鎬を光らせ始めた。"
  ),
  8: ST_L(
    "🕯 **【Words Returned — Eighth Gaol】**: Living crimson sparks leap inside the Elder's bronze brazier and the cold hearths of the village **【炉·炎·灯】**. For the first time, the chill of the abyss retreats from the alleys.",
    "🕯 **【돌아온 말 · 제8옥】**: 노인의 청동 화로와 집집마다 식어 있던 아궁이 속에 산 자의 불꽃**【炉·炎·灯】**이 타오릅니다. 골목을 감싸던 심연의 한기가 처음으로 뒷걸음질 칩니다.",
    "🕯 **【還りし言葉・第八獄】**: 老人の青銅の火炉と家々の冷えたかまどに、生者の炎**【炉・炎・灯】**が燃え上がった。路地を支配していた深淵の冷気が初めて後退してゆく。"
  ),
  9: ST_L(
    "🕯 **【Words Returned — Ninth Gaol】**: The black clouds above the northern ridge split open as the dragon-veins **【龍·雷·峰】** uncoil. Only a single gate—the Underworld itself—now stands between the village and dawn.",
    "🕯 **【돌아온 말 · 제9옥】**: 북쪽 능선을 짓누르던 먹구름이 갈라지며 산맥의 용맥**【龍·雷·峰】**이 트였습니다. 이제 고향의 여명까지 남은 것은 마지막 열 번째 문, 저승의 주인뿐입니다.",
    "🕯 **【還りし言葉・第九獄】**: 北の尾根を押し潰していた黒雲が裂け、山脈の龍脈**【龍・雷・峰】**が通じた。故郷の黎明まで残すは最後の第十獄、冥府の主のみとなった。"
  ),
  10: ST_L(
    "🌅 **【Words Returned — Tenth Gaol】**: Sunlight pours across the rooftops of Lantern Village. Every stolen common word has returned to mortal speech—yet from beneath the northern cliff, an ancient, nameless hunger watches your blade.",
    "🌅 **【돌아온 말 · 제10옥】**: 등불의 마을 처마 위로 마침내 맑은 아침 볕이 쏟아집니다. 빼앗겼던 사람의 말이 모두 돌아왔으나… 북쪽 절벽 가장 깊은 바닥에서는 이름조차 없는 태고의 허기가 당신의 칼끝을 응시하고 있습니다.",
    "🌅 **【還りし言葉・第十獄】**: 灯の里の軒先についに澄んだ朝陽が降り注いだ。奪われていた人の言葉はすべて還った——だが北の崖の最深部では、名すらなき太古の飢えが貴方の切っ先を見つめている。"
  ),
  11: ST_L(
    "🩸 **【Seal Broken — Eleventh Gaol】**: As you return from the Beast-King's Sanctum, the village dogs whimper and hide. Strange, jagged strokes smolder beneath the skin of your sword-arm.",
    "🩸 **【금역 침범 · 제11옥】**: 수왕묘의 주인을 베고 돌아오자 마을의 들개들이 꼬리를 말고 숨어듭니다. 칼을 쥔 당신의 팔뚝 혈관 위로 사람의 것이 아닌 날 선 획들이 검붉게 돋아나 있습니다.",
    "🩸 **【禁域侵犯・第十一獄】**: 獣王廟の主を斬って里へ戻ると、野犬たちが尾を巻いて隠れた。刀を握る貴方の腕の血管には、人のものではない鋭い画数が黒紅く浮き上がっている。"
  ),
  12: ST_L(
    "💀 **【Nightfall — Twelfth Gaol】**: No one dares step into the lane as you pass. The paper lanterns flicker with black flame—for the sovereign of the Kanji Abyss now walks among the living.",
    "💀 **【수라 강림 · 제12옥】**: 당신이 골목을 지나가자 그 누구도 감히 문밖으로 나서지 못합니다. 종이 등불마다 검은 불꽃이 일렁입니다—모든 한자의 심연을 집어삼킨 새 주인이 지금 이승을 걷고 있기 때문입니다.",
    "💀 **【修羅降臨・第十二獄】**: 貴方が路地を通ると、誰一人として戸の外へ出ようとしない。紙提灯に黒い炎が揺らめく——全ての漢字の深淵を呑み込んだ新たな主が今、現世を歩いているからだ。"
  )
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

function findMatchingCardInDeck(deck, candidates) {
  if (!Array.isArray(deck) || !deck.length) return -1;
  for (let i = 0; i < deck.length; i++) {
    const card = String(deck[i] || "");
    if (candidates.some(c => card.includes(c))) return i;
  }
  return -1;
}

function playDialoguePool(st, npcKey, milestones, ambientPool) {
  if (!st.seenDialogues || typeof st.seenDialogues !== "object") st.seenDialogues = {};
  for (const m of milestones) {
    if (m.cond && !st.seenDialogues[m.id]) {
      st.seenDialogues[m.id] = true;
      persistStoryState();
      logMd(pickLang(m.text), "event-log");
      return;
    }
  }
  const stepKey = `${npcKey}TalkStep`;
  const idx = (st[stepKey] || 0) % ambientPool.length;
  st[stepKey] = (st[stepKey] || 0) + 1;
  persistStoryState();
  logMd(pickLang(ambientPool[idx]), "event-log");
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
  } else if (st.lastClearedDepth && st.lastClearedDepth !== st.lastChronicleShownFor && VILLAGE_RETURN_CHRONICLES[st.lastClearedDepth]) {
    st.lastChronicleShownFor = st.lastClearedDepth;
    persistStoryState();
    logMd(pickLang(VILLAGE_RETURN_CHRONICLES[st.lastClearedDepth]), "event-log");
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
    const clearedCount = Array.isArray(st.clearedDepths) ? st.clearedDepths.length : 0;
    if (clearedCount >= 5) {
      logMd(pickLang(ST_L(
        "🏮 Lantern light reflects off the newly restored characters on the village eaves. Smoke rises from the brazier and smithy as the survivors await your next descent.",
        "🏮 글자가 되살아난 처마 끝마다 등불 빛이 은은하게 맺혀 있다. 화로터와 대장간에서 피어오르는 연기 너머로 살아남은 이들이 당신의 발걸음을 맞이한다.",
        "🏮 文字が蘇った軒先に提灯の光が仄かに宿っている。火炉と鍛冶場から立ち昇る煙の向こうで、生き残った者たちがお前の帰還を迎えた。"
      )), "sys-log");
    } else {
      logMd(pickLang(ST_L(
        "🏮 Cold ash drifts across the silent crossroads while the paper lantern guards your returning soul. Before descending into the Gaols again, you can tend to your gear or speak with those who remain.",
        "🏮 차가운 재가 내려앉은 고향 갈림길 위로 희미한 등불이 돌아온 당신의 그림자를 비춘다. 다시 북쪽 절벽의 옥문으로 내려가기 전, 마을에 남은 이들과 이야기를 나누거나 행장을 추스를 수 있다.",
        "🏮 冷たい灰が積もる故郷の辻で、仄かな提灯が戻ったお前の影を照らしている。再び北の崖の獄門へ降りる前に、里に残る者たちと語り合い支度を整えることができる。"
      )), "sys-log");
    }
  }

  if ((st.resurrectionCount || 0) >= 2 && !st.seenDialogues?.inkScarNotice) {
    if (!st.seenDialogues) st.seenDialogues = {};
    st.seenDialogues.inkScarNotice = true;
    persistStoryState();
    logMd(pickLang(ST_L(
      "🖋 **【Ink-Scar of Resurrection】**: Fine black lines like brush-strokes have begun to trace along your wrist where the **【生】** talisman burned to pull you back from death.",
      "🖋 **【회생(回生)의 묵흔】**: 죽음의 문턱에서 **【生】** 부적이 타오르며 당신을 끌어올렸던 자리마다, 붓끝으로 그은 듯한 검은 먹물 자국이 손목 혈관을 따라 희미하게 번져 있습니다.",
      "🖋 **【回生の墨痕】**: 死の淵で**【生】**の護符が燃え上がりお前を引き戻した跡に、筆先で引いたような黒い墨の筋が手首の血管に沿って滲んでいる。"
    )), "fx-log");
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
    logWellArrival();
  } else if (spotKey === "鍛") {
    logSmithArrival();
  } else if (spotKey === "祠") {
    logShrineArrival();
  } else if (spotKey === "墓") {
    logGraveArrival();
  }

  updateBattleHUD(false);
  renderVillageSpotChoices(spotKey);
  if (typeof pushAppHistoryState === "function") {
    pushAppHistoryState({ view: "battle", spot: spotKey });
  }
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

const SENSEI_DEPTH_ARRIVAL_LINES = {
  1: ST_L(
    "🕯 **【先】** — Sensei trims the lantern wick as cold mist curls past the broken threshold.\n*\"Beyond the northern cliff lies the First Gaol, where the most fundamental names of earth, fire, and beast are caged. Carry **【生】** close to your heart.\"*",
    "🕯 **【先】** — 스승이 부서진 문지방 너머로 스며드는 안개를 바라보며 등불 심지를 돋운다.\n*\"북쪽 절벽 아래 첫 옥문에는 불과 물, 들개와 여우처럼 가장 기초적인 사물의 이름들이 갇혀 있단다. **【生】** 부적을 가슴 깊이 품고 내려가거라.\"*",
    "🕯 **【先】** — 師は崩れた敷居から忍び寄る霧を見つめ、提灯の芯を整えた。\n*「北の崖下の第一獄には、火や水、野犬や狐といった最も根源的な物の名が囚われている。**【生】**の護符を懐深く抱いて降りよ。」*"
  ),
  2: ST_L(
    "🕯 **【先】** — Sensei traces the freshly resurfaced characters on a wooden tablet.\n*\"With the First Gate broken, light and water have returned to our signposts. Yet in the Second Gaol below, the stolen seasons and winds still howl in the dark.\"*",
    "🕯 **【先】** — 스승이 목간 위에 희미하게 되살아난 글자 획을 손끝으로 쓸어본다.\n*\"첫 옥문의 주인을 베어낸 덕에 마을 이정표에 해와 물의 이름이 돌아왔구나. 허나 두 번째 옥문 아래에는 빼앗긴 바람과 사계절의 시간들이 아직 울부짖고 있다.\"*",
    "🕯 **【先】** — 師は木簡の上に淡く蘇った文字の画を指先でなぞった。\n*「第一獄の主を討ったおかげで道標に日と水の名が戻ったぞ。だが第二獄の底では、奪われた風と四季の巡りがまだ闇の中で呻いている。」*"
  ),
  3: ST_L(
    "🕯 **【先】** — A cool breeze stirs the study curtains as Sensei sorts dried herb jars whose labels are still blank.\n*\"The wind moves again, yet the villagers still cough black ash. The words for medicine and breath lie trapped inside the Third Gaol's Silent Ward.\"*",
    "🕯 **【先】** — 서당 발을 흔드는 바람 속에서 스승이 아직 이름표가 백지인 약단지들을 정리하고 있다.\n*\"마을에 바람은 다시 불기 시작했으나, 사람들의 마른기침이 멎질 않는구나. 약과 숨결의 글자들이 세 번째 옥문의 병동에 갇혀 있기 때문이지.\"*",
    "🕯 **【先】** — 書堂の簾を揺らす風の中で、師はまだ札が白紙のままの薬壺を並べ直している。\n*「里に風は戻り始めたが、人々の乾いた咳が止まらぬ。薬と息吹の文字が第三獄の病棟に囚われているからだ。」*"
  ),
  4: ST_L(
    "🕯 **【先】** — Sensei spreads a faded provincial map across the low desk.\n*\"The herbs have regained their names, and the children's fever is breaking. Next lie the old garrison roads—Ibaraki, Ehime, Tochigi, Osaka—where entire provinces were swallowed by the mist.\"*",
    "🕯 **【先】** — 스승이 서안 위에 바랜 옛 고을 지도를 펼쳐 놓고 붓끝으로 북쪽 가도를 가리킨다.\n*\"약단지의 글자가 돌아와 아이들의 열이 내렸구나. 이제 네 번째 옥문부터는 이바라키, 에히메, 도치기, 오사카 등 안개에 통째로 삼켜진 옛 고을과 주둔군의 땅이다.\"*",
    "🕯 **【先】** — 師は文机の上に色褪せた古地図を広げ、筆先で北の街道を指し示した。\n*「薬壺の文字が戻り、童たちの熱も下がった。第四獄からは、いばらき、えひめ、とちぎ、おおさか……霧に丸ごと呑まれた古き州と駐屯軍の土地だ。」*"
  ),
  5: ST_L(
    "🕯 **【先】** — Sensei gazes out toward the crooked gravestones beyond the study wall.\n*\"The roads are linked again, yet the dead in our graveyard still have no names on their headstones. In the Fifth Gaol's Mirage Pavilion, illusions and unmourned souls await.\"*",
    "🕯 **【先】** — 스승이 서당 담장 너머 안개 낀 무명 묘지 쪽을 쓸쓸한 눈으로 바라본다.\n*\"끊어졌던 고을의 길들은 이어졌건만, 저 묘지의 비석들은 아직도 이름이 파여 나간 채구나. 다섯 번째 옥문인 미망각에서 떠도는 망자들의 이름을 되찾아 다오.\"*",
    "🕯 **【先】** — 師は書堂の塀の向こう、霧に沈む墓所を寂しげな目で見つめた。\n*「途絶えていた街道は繋がったが、あの墓所の墓石はいまだ名を削られたままだ。第五獄・迷妄閣を彷徨う亡者たちの名を取り戻してくれ。」*"
  ),
  6: ST_L(
    "🕯 **【先】** — Sensei sets down a cup of warm tea; his posture is straighter than before.\n*\"The sixth gate is the Bone Citadel—the deepest threshold of mortal learning. Once you break its seal, the compound fiends of the deeper Gaols will bare their fangs.\"*",
    "🕯 **【先】** — 스승이 따뜻한 차를 내려놓으며 전보다 한결 곧아진 허리로 당신을 마주 본다.\n*\"여섯 번째 옥문인 백골성은 사람이 평소에 배우고 익히는 글자의 마지막 경계선이다. 저 문을 넘어서면 두 글자 이상이 엉겨 붙은 흉물들이 본격적으로 이빨을 드러낼 것이다.\"*",
    "🕯 **【先】** — 師は温かい茶を置き、以前より背筋を伸ばしてお前と向き合った。\n*「第六獄・白骨城は、人が日頃学び習う文字の最後の境界線だ。あの門を越えれば、二字以上が絡み合った凶物どもが本格的に牙を剥くぞ。」*"
  ),
  7: ST_L(
    "🕯 **【先】** — Sensei's expression turns solemn as he looks at your notched blade.\n*\"You have stepped beyond basic script into the Slayer's Grounds of the Seventh Gaol. Down there, wraiths wield two-character names and deadlier intent—never neglect your defense.\"*",
    "🕯 **【先】** — 스승이 당신의 날 선 칼끝을 살피며 자못 무거운 표정을 짓는다.\n*\"마침내 일곱 번째 옥문, 귀살의 사지로 발을 들였구나. 그곳부터는 두 글자가 하나로 뭉친 원령들이 매서운 살기를 품고 덮쳐 오니, 공격만큼이나 파훼에 신경을 써야 한다.\"*",
    "🕯 **【先】** — 師はお前の鋭い切っ先を見つめ、厳粛な面持ちになった。\n*「ついに第七獄、鬼殺の死地へと足を踏み入れたか。あそこからは二字が一つに凝り固まった怨霊が凄まじい殺気で迫るゆえ、攻めと同じく破邪の守りを怠るな。」*"
  ),
  8: ST_L(
    "🕯 **【先】** — Warm light flickers off the study rafters as Sensei listens to the distant rumble of the Eighth Gaol.\n*\"The Eighth Gaol is the Furnace of Karma, where my old fellow disciple 【老】 once tempered his blade. Beware the scorching compound curses that burn from within.\"*",
    "🕯 **【先】** — 서당 서까래에 따뜻한 등불 빛이 어른거리고, 스승은 북쪽 절벽 깊은 곳의 울림에 귀를 기울인다.\n*\"여덟 번째 옥문은 업화의 화로다. 내 옛 사형인 화로터의 노인【老】이 젊은 시절 칼을 벼리던 곳이기도 하지. 속부터 태워버리는 화염의 주술을 조심하거라.\"*",
    "🕯 **【先】** — 書堂の垂木に灯の光が揺れ、師は北の崖の奥深くから響く地鳴りに耳を澄ませた。\n*「第八獄は業火の炉。わしの兄弟子である火炉の老人【老】が若き日に刀を鍛えた場所でもある。内側焼き尽くす業火の呪術に気をつけよ。」*"
  ),
  9: ST_L(
    "🕯 **【先】** — Thunder rumbles faintly above the northern ridge as Sensei clasps his hands behind his back.\n*\"The Ninth Gaol is the Dragon's Abyss. Only that ridge and the Tenth Gate of the Underworld remain before every human word is restored to our village.\"*",
    "🕯 **【先】** — 북쪽 능선 너머로 천둥소리가 은은히 울리고, 스승이 뒷짐을 진 채 창밖을 내다본다.\n*\"아홉 번째 옥문은 용연(龍淵)이다. 저 험준한 능선과 열 번째 황천의 문만 넘으면, 사람이 살아가는 데 필요한 모든 말이 우리 고향으로 돌아오게 된다.\"*",
    "🕯 **【先】** — 北の尾根の向こうで雷鳴が微かに轟き、師は後ろ手を組んで窓の外を見やった。\n*「第九獄は龍淵だ。あの険しい尾根と第十の黄泉の門さえ越えれば、人が生きるために必要な全ての言葉が我が故郷へと還る。」*"
  ),
  10: ST_L(
    "🕯 **【先】** — Sensei rises from his seat, his eyes shining with both awe and quiet dread.\n*\"Before you stands the Tenth Gate—the Underworld itself. Slay its master, bring back the final stolen words of the living, and come home to the dawn, my pupil.\"*",
    "🕯 **【先】** — 스승이 자리에서 일어나 경외와 깊은 염려가 교차하는 눈으로 당신의 두 어깨를 바라본다.\n*\"이제 눈앞에 남은 것은 열 번째 문, 황천의 밑바닥뿐이다. 저 옥문의 주인을 베어 산 자의 마지막 말을 되찾고… 부디 사람으로서 새벽빛 속으로 돌아오너라, 내 제자야.\"*",
    "🕯 **【先】** — 師は席から立ち上がり、畏敬と深い憂いが交錯する目でお前の両肩を見つめた。\n*「もはや目の前に残るは第十の門、黄泉の底のみだ。かの獄門の主を討ち、生者の最後の言葉を取り戻して……どうか人として暁の光の中へ還ってこい、我が弟子よ。」*"
  )
};

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
      "🕯 **【先】** — As you step across the threshold, the lantern flame shrinks back and Sensei's hand trembles on his cane.\n*\"Stay back…! The stench of the Twelfth Abyss clings to your blade. In trying to cut down the curses, you have become a Shura yourself…\"*",
      "🕯 **【先】** — 당신이 문턱을 넘자 서당의 등불이 파르르 오그라들고, 스승은 지팡이를 쥔 손을 떨며 뒷걸음질 친다.\n*\"다가오지 마라…! 네 칼끝에서 나락 밑바닥의 역겨운 묵향이 진동하는구나. 괴물을 베려다 스스로 수라가 되었어…\"*",
      "🕯 **【先】** — お前が敷居を跨ぐと書堂の灯が縮こまり、師は杖を握る手を震わせて後ずさった。\n*「近づくな……！ お前の刃から奈落の底の悍ましい墨香が漂っている。怪物を斬ろうとして自ら修羅と化したか……」*"
    )), "event-log");
  } else if (phase === "abyss_11") {
    logMd(pickLang(ST_L(
      "🕯 **【先】** — Sensei stares in disbelief at the ancient ink scars seeping through your sleeves.\n*\"Why did you unseal the Eleventh Gate?! Those primeval characters were banished from human speech because no mortal mind can bear them!\"*",
      "🕯 **【先】** — 스승은 당신의 소매 끝에 배어든 기괴한 고대 문자의 낙인을 보며 경악을 금치 못한다.\n*\"어째서 수왕묘의 금제를 찢은 게냐! 그 너머의 글자들은 사람의 정신으로 감당할 수 없어 옛 서기들이 도려낸 저주란 말이다!\"*",
      "🕯 **【先】** — 師はお前の袖に染みついた奇怪な古代文字の烙印を見て愕然と目を見開いた。\n*「なぜ獣王廟の禁制を破った！ あの先の文字は人の精神では耐えきれず、古の書記が切り捨てた呪いだというのに！」*"
    )), "event-log");
  } else if (phase === "peace_10") {
    logMd(pickLang(ST_L(
      "🕯 **【先】** — Warm light fills the study hall as Sensei looks over the restored wooden tablets with quiet relief.\n*\"You felled the lord of the Tenth Gaol… Words have returned to the villagers' lips. Do not look beneath the floor—lay down your blade and rest.\"*",
      "🕯 **【先】** — 서당 창살 너머로 맑은 볕이 스며들고, 스승은 글자가 되돌아온 서책들을 어루만지며 깊은 안도의 한숨을 내쉰다.\n*\"기어이 열 번째 옥문의 주인을 베었구나… 마을 사람들의 입술에 말이 돌아오고 있다. 이제 바닥 너머의 기척은 잊고 칼을 놓아라.\"*",
      "🕯 **【先】** — 書堂の格子から澄んだ陽差しが差し込み、師は文字の戻った書物を撫でながら深い安堵の息をついた。\n*「ついに第十獄の主を斬り伏せたか……里人の唇に言葉が戻ってきている。もう底の気配など忘れて刃を置け。」*"
    )), "event-log");
  } else if ((st.resurrectionCount || 0) >= 3 && !st.seenDialogues?.senseiResWarn) {
    if (!st.seenDialogues) st.seenDialogues = {};
    st.seenDialogues.senseiResWarn = true;
    persistStoryState();
    logMd(pickLang(ST_L(
      "🕯 **【先】** — Sensei's eyes linger on the dark ink-veins creeping up your wrist.\n*\"The 【生】 talisman has pulled you back from death more than once… Be careful. Every resurrection leaves a drop of the Abyss's ink inside your pulse.\"*",
      "🕯 **【先】** — 스승의 시선이 당신의 손목 위로 번진 검붉은 먹물 자국에 머문다.\n*\"【生】 부적이 네 목숨을 여러 번 건져 올렸구나… 조심하거라. 죽음을 거슬러 회생할 때마다 네 맥박 속에 심연의 먹물이 한 방울씩 고인다.\"*",
      "🕯 **【先】** — 師の視線がお前の手首に広がる黒紅い墨の筋に留まった。\n*「【生】の護符が幾度かお前の命を引き戻したようだな……気をつけよ。死に逆らって回生するたび、脈の中に深淵の墨が一滴ずつ溜まっていくのだ。」*"
    )), "event-log");
  } else {
    const dLine = SENSEI_DEPTH_ARRIVAL_LINES[st.unlockedDepth] || SENSEI_DEPTH_ARRIVAL_LINES[1];
    logMd(pickLang(dLine), "event-log");
  }
}

/* ---- 2. 【炉】 잿빛 화로터 — 눈먼 노인 【老】 ---- */

const ELDER_DEPTH_ARRIVAL_LINES = {
  1: ST_L(
    "🔥 **【老】** — Sitting cross-legged before an iron brazier of glowing ash, a blind old man warms his withered hands.\n*\"Every Kanji is a cage binding an ancient spirit inside its strokes. Even the nine-tailed fox 【九】 prowl the First Gate—if you gather spare characters, cast them into my flames.\"*",
    "🔥 **【老】** — 불씨만 남은 무쇠 화로 앞에서 백내장 낀 눈의 노인이 마른 손바닥을 쬐며 중얼거린다.\n*\"한자란 본디 태고의 악귀와 사념을 획이라는 창살 안에 가둔 감옥이지. 첫 옥문에는 구미호【九】까지 어슬렁거린다더군. 남는 글자가 생기거든 내 화로에 가져오게.\"*",
    "🔥 **【老】** — 熾火の残る鉄火炉の前で、白濁した目の老人が枯れ枝のような手をかざして呟いている。\n*「漢字とは本来、太古の悪鬼や思念を画という格子に閉じ込めた牢獄よ。第一獄には九尾の狐【九】までうろついているそうだ。余った文字ができたらわしの火炉へ持ってこい。」*"
  ),
  2: ST_L(
    "🔥 **【老】** — The blind Elder tilts his ear toward the wind blowing down from the roof tiles.\n*\"So the First Gate fell, and the wind is moving again. Bring two characters to my brazier whenever your hand feels too thin for the Second Gaol.\"*",
    "🔥 **【老】** — 눈먼 노인이 처마 끝을 스치는 바람 소리에 귀를 기울이며 희미하게 입꼬리를 올린다.\n*\"첫 옥문이 열리고 마을에 바람이 통하기 시작했구먼. 두 번째 옥문의 요괴들이 버겁거든 언제든 두 글자를 가져와 합자로 묶어 가게.\"*",
    "🔥 **【老】** — 盲目の老人は軒先を掠める風の音に耳を傾け、微かに口角を上げた。\n*「第一獄が開き、里に風が通り始めたな。第二獄の妖どもが荷が重いなら、いつでも二字を持ってきて合字に束ねていけ。」*"
  ),
  3: ST_L(
    "🔥 **【老】** — Pale blue smoke curls from the brazier as the Elder pokes the charcoal with iron tongs.\n*\"The Third Gaol smells of old medicine and stagnant blood. Burn away the weak clutter in your bag so your palm always draws a decisive stroke.\"*",
    "🔥 **【老】** — 쇠젓가락으로 숯불을 뒤적이는 노인의 화로에서 푸르스름한 연기가 피어오른다.\n*\"세 번째 옥문에서는 묵은 약초와 고인 피 냄새가 나지. 급할 때 헛손질하지 않으려거든 가방의 자잘한 잔패들은 내 불에 태워 정리해 두게.\"*",
    "🔥 **【老】** — 火箸で炭を突く老人の火炉から青白い煙が立ち昇る。\n*「第三獄からは古い薬草と澱んだ血の匂いがするわい。いざという時に空振りせぬよう、袋の雑多な端札はわしの火で焼いて整理しておけ。」*"
  ),
  4: ST_L(
    "🔥 **【老】** — The Elder taps the rim of his bronze brazier, listening to the metallic ring.\n*\"Marching into the old province roads of the Fourth Gaol? Soldiers who died in formation fear fire and thunder most—weld a compound card before you go.\"*",
    "🔥 **【老】** — 노인이 청동 화로 테두리를 쇠젓가락으로 가볍게 두드리며 맑은 쇳소리를 듣는다.\n*\"네 번째 옥문의 옛 주둔군 가도로 내려가는가? 대열을 짜고 죽은 병사들의 망령은 화염과 벼락에 약하니, 화로에서 두 글자를 단단히 엮어 가도록 하게.\"*",
    "🔥 **【老】** — 老人は青銅の火炉の縁を火箸で軽く叩き、澄んだ金属音に耳を傾けた。\n*「第四獄の古き駐屯軍の街道へ降りるか。隊列を組んで死んだ兵どもの亡霊は炎と雷に弱いゆえ、火炉で二字を固く束ねていくがよい。」*"
  ),
  5: ST_L(
    "🔥 **【老】** — The Elder's scarred eyelids twitch as ash swirls around the brazier.\n*\"The Fifth Gaol is full of mirrors and phantom faces. Even if an enemy tries to deceive you, you can speak to it with **/talk** or shatter its illusion with true fire.\"*",
    "🔥 **【老】** — 화로 주변으로 잿가루가 맴돌고, 노인의 흉터 진 눈꺼풀이 작게 떨린다.\n*\"다섯 번째 옥문인 미망각은 거울과 헛개비들의 소굴이지. 원령에게 직접 말을 걸어 그 본심을 떠보거나, 진짜 불길로 환영을 깨부수게.\"*",
    "🔥 **【老】** — 火炉の周りで灰が渦巻き、老人の傷ついた瞼が小さく震えた。\n*「第五獄の迷妄閣は鏡と幻の巣窟よ。怨霊に直接語りかけてその本心を探るか、本物の炎で幻影を打ち砕いてやれ。」*"
  ),
  6: ST_L(
    "🔥 **【老】** — Red-hot coals glow inside the brazier as the Elder warms his knuckles.\n*\"You stand before the Bone Citadel of the Sixth Gaol. Beyond that gate, single characters alone will struggle to pierce the wraiths' armor.\"*",
    "🔥 **【老】** — 화로 안의 숯불이 한층 붉게 달아오르고, 노인이 마디 굵은 손등을 불길에 쬔다.\n*\"여섯 번째 백골성 앞까지 왔구먼. 저 성문을 넘어가면 낱글자 하나만으로는 원령들의 두꺼운 뼈갑옷을 뚫기가 쉽지 않을 걸세.\"*",
    "🔥 **【老】** — 火炉の中の炭火が一段と赤く熾り、老人は節くれ立った手の甲を炎にかざした。\n*「第六の白骨城の前まで来たか。あの城門を越えれば、一字だけでは怨霊どもの分厚い骨の鎧を貫くのは容易ではないぞ。」*"
  ),
  7: ST_L(
    "🔥 **【老】** — Sparks leap from the brazier as the Elder hears the clink of your satchel.\n*\"From the Seventh Gaol downward, two-character horrors roam the mist. Fight compound with compound—fuse your best strokes in my fire.\"*",
    "🔥 **【老】** — 당신의 가방에서 부딪히는 한자 조각 소리를 듣고 노인이 껄껄 웃으며 숯불을 돋운다.\n*\"일곱 번째 옥문부터는 두 글자가 엉겨 붙은 흉물들이 어슬렁거리지. 겹글자 괴물에게는 이쪽도 화로에서 벼려낸 합자 패로 맞서는 게 상책이야.\"*",
    "🔥 **【老】** — お前の袋の中で鳴る漢字の欠片の音を聞き、老人は低く笑って炭火をかき立てた。\n*「第七獄からは二字が絡み合った凶物どもがうろついておる。重字の化け物には、こちらも火炉で鍛えた合字札で立ち向かうのが上策よ。」*"
  ),
  8: ST_L(
    "🔥 **【老】** — Living crimson flames roar inside the bronze brazier as the Elder listens to your breathing.\n*\"You have reached the Eighth Gaol—the Furnace of Karma where my youth burned away. My fire is hotter now; bring your heaviest script and temper it.\"*",
    "🔥 **【老】** — 청동 화로 속에서 되살아난 진홍빛 불씨가 타닥거리고, 노인이 귀를 기울여 당신의 숨소리를 듣는다.\n*\"내 젊은 날이 불타 사라졌던 여덟 번째 업화의 화로까지 내려왔군. 발소리가 갈수록 예전의 나를 닮아가네. 무거운 글자가 있거든 내 불길에 던져 넣게.\"*",
    "🔥 **【老】** — 青銅の火炉の中で蘇った真紅の火種が爆ぜ、老人は耳を澄ませてお前の息遣いを聞いた。\n*「わしの若き日が焼け落ちた第八獄・業火の炉まで降りてきたか。足音がだんだん昔のわしに似てきたな。重い文字があるならわしの炎へ投げ入れよ。」*"
  ),
  9: ST_L(
    "🔥 **【老】** — A low crackle like distant lightning answers from the Elder's brazier.\n*\"The Ninth Gaol's dragon-veins are uncoiling. Only one mortal gate remains after this—make sure your bag holds no dead weight.\"*",
    "🔥 **【老】** — 노인의 화로 속에서 먼 벼락 같은 불꽃이 튀며 매캐한 연기를 뿜어낸다.\n*\"아홉 번째 용연의 맥이 요동치고 있구먼. 이제 사람의 영역에서 남은 문은 단 두 개뿐이야. 가방에 군더더기가 없도록 날을 바짝 세워 두게.\"*",
    "🔥 **【老】** — 老人の火炉の中で遠い稲妻のような火花が散り、鋭い煙を噴き上げた。\n*「第九獄・龍淵の脈がうねっておるな。人の領域に残された門はあと二つのみ。袋に無駄な荷が残らぬよう、刃を研ぎ澄ませておけ。」*"
  ),
  10: ST_L(
    "🔥 **【老】** — The Elder sits motionless before a pillar of white-hot flame.\n*\"The Tenth Gate of the Underworld… Forty years ago, I did not stop there, and it cost me my eyes. Whether you stop at dawn or step into the forbidden dark below is yours to choose.\"*",
    "🔥 **【老】** — 하얗게 달아오른 화로 불길 앞에서 노인이 미동도 없이 앉아 입을 연다.\n*\"열 번째 황천의 문… 사십 년 전의 나는 거기서 멈추지 못해 두 눈을 잃었지. 새벽빛을 되찾고 멈출지, 그 아래 금역으로 발을 들일지는 자네 손끝에 달렸네.\"*",
    "🔥 **【老】** — 白熱する火炉の炎の前で、老人は身じろぎもせずに口を開いた。\n*「第十の黄泉の門……四十年前のわしはそこで止まれずに両目を失った。暁を取り戻して立ち止まるか、その下の禁域へ足を踏み入れるかは貴様次第よ。」*"
  )
};

function logElderArrival() {
  const st = ensureStoryConfig();
  const phase = getStoryNarrativePhase();
  if (phase === "shura_12") {
    logMd(pickLang(ST_L(
      "🔥 **【老】** — The blind Elder inhales the dark miasma trailing behind you and lets out a dry, rasping laugh.\n*\"Forty years ago I burned out my own eyes to stop myself from becoming what you are now. Sit by the fire if you wish, Shura of the Ten Thousand Strokes.\"*",
      "🔥 **【老】** — 눈먼 노인이 당신의 등 뒤에서 일렁이는 검붉은 마기를 들이마시더니 마른기침 섞인 웃음을 흘린다.\n*\"사십 년 전의 나는 바로 지금의 자네 같은 수라가 되는 것이 두려워 스스로 두 눈을 지졌지. 그래, 만획을 삼킨 기분이 어떠한가.\"*",
      "🔥 **【老】** — 盲目の老人はお前の背後に揺らめく黒紅い瘴気を吸い込み、乾いた笑い声を漏らした。\n*「四十年前のわしは、今の貴様のような修羅になるのが恐ろしくて自ら両目を焼いたのよ。さて、万画を呑み込んだ心地はどうじゃ。」*"
    )), "event-log");
  } else if (phase === "abyss_11") {
    logMd(pickLang(ST_L(
      "🔥 **【老】** — Greenish flames dance in the ash brazier as the Elder turns his scarred eyelids toward you.\n*\"I hear the howling of the Beast-King's Sanctum on your blade. Once a swordsman tastes those primeval strokes, tame mortal words never satisfy the hand again.\"*",
      "🔥 **【老】** — 화로 속에서 푸르스름한 불길이 일렁이고, 노인이 흉터 진 눈꺼풀을 들어 당신을 향한다.\n*\"자네 칼날에서 수왕묘의 짐승들이 울부짖는 소리가 들리는구먼. 길들여지지 않은 태고의 획 맛을 본 손은 다시는 순한 말로 돌아가지 못해.\"*",
      "🔥 **【老】** — 火炉の中で青白い炎が揺らめき、老人は傷ついた瞼を向けて呟いた。\n*「貴様の刃から獣王廟の獣どもの遠吠えが聞こえるぞ。飼い慣らされぬ太古の画の味を知った手は、二度と穏やかな言葉には戻れぬ。」*"
    )), "event-log");
  } else if (phase === "peace_10") {
    logMd(pickLang(ST_L(
      "🔥 **【老】** — Warm golden embers glow quietly in the brazier as the Elder nods.\n*\"You broke the Tenth Gate and yet your breathing is still human. Even so, I can tell your hand remembers the weight of the abyss…\"*",
      "🔥 **【老】** — 화로 속에 금빛 불씨가 평온하게 일렁이고, 노인이 고개를 끄덕인다.\n*\"열 번째 문을 부수고도 사람의 숨결을 잃지 않았구먼. 허나 자네 손끝이 아직 절벽 아래의 무거운 획들을 기억하고 있는 게 느껴지네…\"*",
      "🔥 **【老】** — 火炉の中で金色の火種が穏やかに揺れ、老人は静かに頷いた。\n*「第十の門を砕いてもなお人の息遣いを失わなかったか。だが、貴様の指先がまだ崖下の重い画を覚えているのが分かるぞ……」*"
    )), "event-log");
  } else {
    const dLine = ELDER_DEPTH_ARRIVAL_LINES[st.unlockedDepth] || ELDER_DEPTH_ARRIVAL_LINES[1];
    logMd(pickLang(dLine), "event-log");
  }
}

/* ---- 3. 【橋】 안개 낀 돌다리 — 옛 벗 【友】 ---- */

const FRIEND_DEPTH_ARRIVAL_LINES = {
  1: ST_L(
    "🗡 **【友】** — Your friend adjusts his sling on the bridge and looks toward the First Gaol.\n*\"Watch out for the Nine-Tailed Fox 【九】 in the First Gaol—it bewitches travelers with fox-fire before tearing them apart!\"*",
    "🗡 **【友】** — 옛 벗이 돌다리 난간에서 붕대 감긴 팔을 고쳐 매며 첫 옥문 쪽을 가리킨다.\n*\"첫 번째 옥문 안개 속에서 아홉 꼬리 여우인 구미호【九】를 본 적이 있어. 여우불과 홀리는 소리로 정신을 빼놓으니 단단히 조심해!\"*",
    "🗡 **【友】** — 旧友は石橋の欄干で包帯の腕をさすりながら第一獄の方を指さした。\n*「第一獄の霧の中で九尾の狐【九】を見たことがあるんだ。狐火と惑わしの声で意識を奪ってくるから気をつけろよ！」*"
  ),
  2: ST_L(
    "🗡 **【友】** — Your friend looks up as a fresh gust of wind sweeps the mist from the bridge.\n*\"You cleared the First Gaol! And listen—before I retreated from the lower gates, I heard a small black cat 【猫】 crying in the fog. Save it if you find it.\"*",
    "🗡 **【友】** — 돌다리 위로 불어오는 바람에 안개가 살짝 걷히자 옛 벗이 반갑게 얼굴을 든다.\n*\"첫 옥문의 우두머리를 쓰러뜨렸구나! 맞다, 내가 다쳐서 후퇴하기 직전에 안개 너머에서 어린 검은 고양이【猫】 울음소리를 들었어. 마주치면 꼭 구해 줘.\"*",
    "🗡 **【友】** — 石橋の上を吹く風に霧がわずかに晴れ、旧友が嬉しそうに顔を上げた。\n*「第一獄の主を倒したんだな！ そういえば怪我をして退く直前、霧の奥で小さな黒猫【猫】の鳴き声を聞いたんだ。出くわしたら助けてやってくれ。」*"
  ),
  3: ST_L(
    "🗡 **【友】** — Your friend flexes his healing fingers against the stone parapet.\n*\"Since you opened the Third Gaol, the numbness in my wounded arm has started to fade. If you bring back the medicine words from the Silent Ward, the whole village will breathe easier.\"*",
    "🗡 **【友】** — 옛 벗이 돌난간 위에서 다친 쪽 손가락을 조금씩 쥐었다 펴 본다.\n*\"네가 세 번째 옥문까지 길을 뚫어 준 뒤로 내 상처의 시커먼 독기도 조금씩 빠지는 것 같아. 적막의 병동에서 약과 숨의 글자들을 되찾아 오면 마을 사람들도 한결 살 만해질 거야.\"*",
    "🗡 **【友】** — 旧友は石の欄干の上で傷ついた方の指を少しずつ握り直してみた。\n*「お前が第三獄まで道を切り開いてくれてから、傷口の黒い毒気も少しずつ抜けてきた気がする。静寂の病棟から薬と息の文字を取り戻せば、里のみんなもずっと楽になるはずだ。」*"
  ),
  4: ST_L(
    "🗡 **【友】** — Your friend points across the gorge toward the ruined highway milestones.\n*\"The Fourth Gaol is where our garrison was wiped out—Ibaraki, Ehime, Tochigi, Osaka… Even the province names turned into ghosts. Don't let their generals surround you.\"*",
    "🗡 **【友】** — 옛 벗이 협곡 너머의 무너진 가도 이정표를 가리키며 목소리를 낮춘다.\n*\"네 번째 옥문은 우리 주둔군이 전멸했던 옛 가도야—이바라키, 에히메, 도치기, 오사카… 고을 이름들까지 망령이 되어 떠돌고 있으니 지휘관들의 포위망에 걸리지 마.\"*",
    "🗡 **【友】** — 旧友は渓谷の向こうの崩れた街道の道標を指さし、声を潜めた。\n*「第四獄は俺たちの駐屯軍が全滅した古き街道だ——いばらき、えひめ、とちぎ、おおさか……土地の名まで亡霊となって彷徨っているから、指揮官どもの包囲網には気をつけろ。」*"
  ),
  5: ST_L(
    "🗡 **【友】** — Your friend stares into the mist swirling beneath the bridge arch.\n*\"In the Fifth Gaol's Mirage Pavilion, wraiths wear the faces of people you know. Try speaking to them with **/talk** if you sense a lingering human heart—or cut straight through the lie.\"*",
    "🗡 **【友】** — 옛 벗이 다리 아치 아래로 소용돌이치는 짙은 안개를 내려다본다.\n*\"다섯 번째 옥문인 미망각에서는 원령들이 산 자의 기억을 흉내 내어 사람을 홀린대. 만약 한이 맺힌 망자 같거든 대화(**/talk**)로 달래 보거나, 아예 환영째로 베어버려.\"*",
    "🗡 **【友】** — 旧友は橋のアーチの下で渦巻く濃い霧を見下ろした。\n*「第五獄の迷妄閣では、怨霊が生者の記憶を真似て人を惑わすらしい。もし未練を残す亡者なら対話（**/talk**）で鎮めるか、幻影ごと斬り捨てろ。」*"
  ),
  6: ST_L(
    "🗡 **【友】** — Your friend taps your shoulder with his good hand, his eyes steady.\n*\"The Sixth Gaol—the Bone Citadel. That's the farthest any scout from our village ever laid eyes on before turning back. Come back in one piece.\"*",
    "🗡 **【友】** — 옛 벗이 성한 쪽 손으로 당신의 어깨를 두드리며 굳건한 눈빛을 보낸다.\n*\"여섯 번째 옥문인 백골성까지 왔구나. 우리 마을 척후병들이 살아 돌아오며 본 가장 깊은 경계가 바로 저 성벽이었어. 부디 다치지 말고 돌아와.\"*",
    "🗡 **【友】** — 旧友は無事な方の手でお前の肩を叩き、真っ直ぐな眼差しを向けた。\n*「第六獄・白骨城まで来たんだな。俺たちの里の斥候が生きて戻る前に目にした一番深い境界があの城壁だった。どうか無事で戻ってこいよ。」*"
  ),
  7: ST_L(
    "🗡 **【友】** — Your friend watches the northern ridge where thunderclouds gather over the Seventh Gaol.\n*\"The garrison captains who marched into the Seventh Gaol never came back. Down there, two characters fuse into a single horror—keep your bag sharp.\"*",
    "🗡 **【友】** — 옛 벗이 먹구름이 소용돌이치는 일곱 번째 옥문 너머를 근심 어린 눈으로 바라본다.\n*\"예전에 고을을 지키던 무사들이 일곱 번째 옥문 아래로 내려갔다가 단 한 명도 돌아오지 못했어. 거기부턴 두 글자가 하나로 뭉친 흉물들이 득실거리니 단단히 준비해.\"*",
    "🗡 **【友】** — 旧友は黒雲が渦巻く第七獄の向こうを憂いの目で見つめた。\n*「かつて里を守っていた武人たちが第七獄の下へ降りて、一人も戻らなかった。あそこからは二字が一つに塊となった凶物がうごめいているから、しっかり備えていけよ。」*"
  ),
  8: ST_L(
    "🗡 **【友】** — Heat haze shimmers faintly on the northern horizon as your friend shields his eyes.\n*\"Even from this bridge I can feel the heat of the Eighth Gaol's furnace. Take plenty of water and ice script with you!\"*",
    "🗡 **【友】** — 북쪽 절벽 능선 너머로 아지랑이가 피어오르고, 옛 벗이 이마에 손을 얹어 그쪽을 살핀다.\n*\"이 돌다리까지 여덟 번째 옥문의 열기가 전해지는 것 같아. 화염을 뒤집어쓰지 않으려면 물이나 얼음, 바람 계통의 글자를 가방에 넉넉히 챙겨 가!\"*",
    "🗡 **【友】** — 北の崖の尾根の向こうに陽炎が揺らめき、旧友は額に手をかざしてそちらを見やった。\n*「この石橋まで第八獄の熱気が伝わってくるようだ。業火を浴びないよう、水や氷、風の文字を袋に十分携えていけよ！」*"
  ),
  9: ST_L(
    "🗡 **【友】** — Forked lightning flashes silently inside the clouds above the Ninth Gaol.\n*\"The Ninth Gaol—the Dragon's Abyss. You're almost at the bottom of the mortal gates. Everyone in the village is praying for your blade.\"*",
    "🗡 **【友】** — 아홉 번째 옥문 위쪽 먹구름 속에서 마른번개가 소리 없이 번쩍인다.\n*\"아홉 번째 용연까지 닿았구나. 이제 사람의 말이 갇힌 옥문도 거의 바닥이 보여. 마을에 남은 사람들 모두가 네 칼끝에 희망을 걸고 있어.\"*",
    "🗡 **【友】** — 第九獄の上空の黒雲の中で、音のない稲妻が鋭く閃いた。\n*「第九獄・龍淵まで届いたんだな。人の言葉が囚われた獄門も、もうすぐ底が見える。里に残った全員がお前の刃に望みを託しているぞ。」*"
  ),
  10: ST_L(
    "🗡 **【友】** — Your friend grips the stone rail with his bandaged hand, his voice trembling with emotion.\n*\"The Tenth Gate… Finish off the lord of the Underworld and come back to us! Once the ten gates are cleared, we'll rebuild this village together!\"*",
    "🗡 **【友】** — 옛 벗이 붕대 감긴 손으로 돌난간을 꽉 움켜쥐며 벅찬 목소리로 외친다.\n*\"드디어 열 번째 문이야… 저 황천의 주인만 쓰러뜨리고 우리 곁으로 돌아와! 열 개의 옥문이 모두 평정되면 다 같이 이 고향을 다시 일으켜 세우자!\"*",
    "🗡 **【友】** — 旧友は包帯の手で石の欄干を強く握りしめ、感極まった声で叫んだ。\n*「ついに第十の門だ……あの黄泉の主を討ち果たして、俺たちのところへ戻ってこい！ 十の獄門をすべて平定したら、みんなでこの故郷を立て直そう！」*"
  )
};

function logFriendArrival() {
  const st = ensureStoryConfig();
  const phase = getStoryNarrativePhase();

  if (phase === "shura_12") {
    logMd(pickLang(ST_L(
      "🗡 **【友】** — Your old friend instinctively grips his broken hilt, cold sweat running down his pale jaw.\n*\"…For a heartbeat just now, I didn't see my childhood friend walking across the bridge. I saw a towering blood-red 【殺】.\"*",
      "🗡 **【友】** — 돌다리 난간에 기대어 있던 옛 벗이 무의식중에 부러진 칼자루를 움켜쥐며 창백하게 굳는다.\n*\"…방금 안개 속에서 네가 걸어오는데, 내 어릴 적 친구가 아니라 피로 휘갈겨 쓴 거대한 살(殺) 자가 걸어오는 줄 알았어.\"*",
      "🗡 **【友】** — 石橋の欄干に凭れていた旧友は無意識に折れた柄を握りしめ、青ざめて凍りついた。\n*「……今、霧の中からお前が歩いてきた時、幼馴染ではなく血で殴り書きされた巨大な『殺』の字が迫ってくるのかと思ったよ。」*"
    )), "event-log");
  } else if (phase === "abyss_11") {
    logMd(pickLang(ST_L(
      "🗡 **【友】** — Your friend takes half a step back as a dark, primeval scent of blood and ink drifts from your scabbard.\n*\"Hey… the ten gates were already cleared. Why did you go down into the Eleventh Gate? Look at your eyes…\"*",
      "🗡 **【友】** — 당신의 칼집에서 낯설고 원시적인 먹물과 피 냄새가 풍기자 옛 벗이 반 걸음 물러선다.\n*\"야… 열 번째 옥문까지 다 끝났었잖아. 대체 왜 그 아래 열한 번째 금역으로 내려간 거야? 네 눈빛이… 예전 같지가 않아.\"*",
      "🗡 **【友】** — お前の鞘から見知らぬ原始の墨と血の匂いが漂い、旧友は半歩後ずさった。\n*「おい……第十獄でもう全部終わったはずだろ。いったいなぜその下の第十一獄へ降りたんだ？ お前の目つきが……昔と違うぞ。」*"
    )), "event-log");
  } else if (phase === "peace_10") {
    logMd(pickLang(ST_L(
      "🗡 **【友】** — Leaning on the sunlit bridge rail, your friend gazes at the clear stream running beneath the stone arch.\n*\"Look at the water—the black ink is gone. You actually did what my broken arm couldn't. Stay in the village with us now.\"*",
      "🗡 **【友】** — 햇살이 비치는 돌다리 난간에 기댄 옛 벗이 다리 아래로 흐르는 맑은 개울물을 내려다본다.\n*\"저 물빛 좀 봐, 시커먼 먹물이 다 빠졌어. 내 부러진 팔이 끝내 해내지 못한 걸 네가 해냈구나. 이제 그만 칼을 씻고 우리 곁에 머물러라.\"*",
      "🗡 **【友】** — 陽差しの落ちる石橋の欄干に凭れた旧友が、橋の下を流れる澄んだせせらぎを見下ろした。\n*「あの水の色を見てみろ、黒い墨がすっかり消えたぞ。俺の折れた腕では届かなかったことをお前が成し遂げたんだ。もう刀を洗って里にいてくれ。」*"
    )), "event-log");
  } else if (!st.friendGiftClaimed) {
    logMd(pickLang(ST_L(
      "🗡 **【友】** — Leaning against the broken bridge parapet with his arm in bloodstained bandages, your childhood friend's eyes widen.\n*\"You're alive! When the cliff split open, living characters crawled out of the abyss—my blade shattered just holding the bridge…\"*",
      "🗡 **【友】** — 무너진 돌다리 난간에 기대어 피 묻은 붕대로 한쪽 팔을 동여맨 옛 벗이 당신을 발견하고 눈을 크게 뜬다.\n*\"살아 돌아왔구나! 북쪽 절벽이 갈라지며 기어 나온 괴이한 글자들을 막아내다 칼은 두 동강이 나고 팔만 이 꼴이 됐어…\"*",
      "🗡 **【友】** — 崩れた石橋の欄干に凭れ、血の滲む包帯で片腕を吊った旧友がお前に気づいて目を見開いた。\n*「生きて戻ったか！ 北の崖が割れて這い出てきた怪異な文字どもを食い止めようとして、刀は折れ腕もこのざまだ……」*"
    )), "event-log");
  } else {
    const dLine = FRIEND_DEPTH_ARRIVAL_LINES[st.unlockedDepth] || FRIEND_DEPTH_ARRIVAL_LINES[1];
    logMd(pickLang(dLine), "event-log");
  }
}

/* ---- 4. 【家】 무너진 본가 — 옛집과 고양이 【猫】 ---- */

function logHomeArrival() {
  const st = ensureStoryConfig();
  const phase = getStoryNarrativePhase();
  if (st.catRescued) {
    if (phase === "shura_12") {
      logMd(pickLang(ST_L(
        "🐱 **【猫】** — Even as the rest of the village cowers from your crimson aura, the black cat by the hearth does not flee. It licks the dark ink on your knuckles with a rough, warm tongue.",
        "🐱 **【猫】** — 온 마을이 당신의 핏빛 살기를 두려워하며 문을 걸어 잠갔으나, 아궁이 곁의 검은 고양이만은 도망치지 않고 다가와 당신의 먹물 묻은 손등을 거칠고 따뜻한 혀로 핥아 준다.",
        "🐱 **【猫】** — 里中がお前の血の殺気を恐れて戸を閉ざす中、かまどの傍らの黒猫だけは逃げずに歩み寄り、墨に染まったお前の手の甲をざらついた温かい舌で舐めた。"
      )), "event-log");
    } else {
      logMd(pickLang(ST_L(
        "🐱 **【猫】** — Beneath the collapsed beams of your childhood home, the rescued black cat curls up beside the warm hearthstone and purrs softly. Having a living soul waiting at home steadies your breathing.",
        "🐱 **【猫】** — 무너진 본가 처마 아래, 옥문에서 구출한 검은 고양이가 아궁이의 온기 곁에 몸을 말고 앉아 반갑게 골골거린다. 돌아올 집에 살아 숨 쉬는 생명이 기다리고 있다는 사실만으로도 마음이 한결 놓인다.",
        "🐱 **【猫】** — 崩れた生家の軒下で、獄門から救い出した黒猫がかまどの温もりの傍らで丸くなり喉を鳴らしている。帰るべき家に生きる命が待っているというだけで、荒れた呼吸が静かに整っていく。"
      )), "event-log");
    }
  } else {
    logMd(pickLang(ST_L(
      "🏚 Half the roof of your childhood home has caved in, and cold ash piles inside the empty hearth. Only the wooden nameplate by the gate—stripped of its characters—reminds you of the family that once lived here.",
      "🏚 어린 시절 자라난 본가의 지붕은 반쯤 내려앉아 있고, 불 꺼진 아궁이 안에는 차가운 재만 수북이 쌓여 있다. 글자가 감쪽같이 파여 나간 문패만이 이곳에 한때 따뜻한 삶이 있었음을 희미하게 증언한다.",
      "🏚 幼き日を過ごした生家の屋根は半ば崩れ落ち、火の消えたかまどには冷たい灰だけが積もっている。文字の削り取られた表札だけが、かつてここにあった暮らしを微かに物語っていた。"
    )), "event-log");
  }
}

/* ---- 5. 【井】 마른 우물가 — 여인 【女】 ---- */

function logWellArrival() {
  const st = ensureStoryConfig();
  const phase = getStoryNarrativePhase();
  if (phase === "shura_12") {
    logMd(pickLang(ST_L(
      "💧 **【女】** — The woman drops her wooden ladle into the basin and presses her back against the cold well stones, unable to meet your eyes.",
      "💧 **【女】** — 우물가의 여인이 손에 쥐고 있던 나무 바가지를 떨어뜨리며 차가운 돌우물 벽에 등을 붙인 채 당신의 눈을 피한다.",
      "💧 **【女】** — 井戸端の女は手にしていた柄杓を落とし、冷たい石井戸の壁に背を押し当ててお前の目から視線を逸らした。"
    )), "event-log");
  } else if (phase === "abyss_11") {
    logMd(pickLang(ST_L(
      "💧 **【女】** — Dark ripples tremble across the well water as you approach. The woman clutches her shawl tightly around her shoulders.",
      "💧 **【女】** — 당신이 다가서자 맑아졌던 우물물 수면 위로 검붉은 파문이 일렁이고, 여인이 옷깃을 여미며 조심스레 뒷걸음질 친다.",
      "💧 **【女】** — お前が近づくと澄んでいた井戸の水面に黒紅い波紋が広がり、女は襟元を合わせて恐る恐る後ずさった。"
    )), "event-log");
  } else if (phase === "peace_10") {
    logMd(pickLang(ST_L(
      "💧 **【女】** — Clear spring water brims inside the stone well again. The woman hums an old lullaby as she folds clean white linen.",
      "💧 **【女】** — 갈라졌던 돌우물 안에 다시 맑은 샘물이 차올랐다. 여인은 하얗게 빤 무명천을 개며 잊었던 옛 자장가를 나직이 흥얼거리고 있다.",
      "💧 **【女】** — ひび割れていた石井戸に再び澄んだ湧き水が満ちている。女は白く洗い上げた木綿布を畳みながら、忘れていた古い子守唄を静かに口ずさんでいた。"
    )), "event-log");
  } else if (st.unlockedDepth >= 8) {
    logMd(pickLang(ST_L(
      "💧 **【女】** — The well water now rises halfway up the stone wall, reflecting the lantern light. The woman draws a bucket of clean water with a gentle smile.",
      "💧 **【女】** — 우물 안의 맑은 물이 이제 돌벽 절반 높이까지 차올라 등불 빛을 비추고 있다. 여인이 두레박으로 깨끗한 물을 길어 올리며 작게 미소 짓는다.",
      "💧 **【女】** — 井戸の中の澄んだ水が石壁の半ばまで満ち、提灯の光を映している。女は釣瓶で綺麗な水を汲み上げながら小さく微笑んだ。"
    )), "event-log");
  } else if (st.unlockedDepth >= 5) {
    logMd(pickLang(ST_L(
      "💧 **【女】** — A thin trickle of water has returned to the bottom of the well. The woman traces her husband's resurfaced name on the wet stone rim.",
      "💧 **【女】** — 메말랐던 우물 바닥에 가느다란 물줄기가 다시 고이기 시작했다. 여인은 젖은 우물가 돌턱 위에 되찾은 남편의 이름 글자를 천천히 적어 내려가고 있다.",
      "💧 **【女】** — 涸れていた井戸の底に細い水脈が戻り始めた。女は濡れた石枠の上に取り戻した夫の名の一字をゆっくりとなぞっている。"
    )), "event-log");
  } else if (st.unlockedDepth >= 3) {
    logMd(pickLang(ST_L(
      "💧 **【女】** — Cold dew beads along the mossy stones of the well. The woman whispers the newly returned words for 'morning' and 'wind' to herself.",
      "💧 **【女】** — 우물가 이끼 낀 돌틈마다 이슬이 맺히기 시작했다. 여인은 되돌아온 '아침'과 '바람'이라는 단어를 입속말로 조용히 되뇌어 본다.",
      "💧 **【女】** — 井戸端の苔むした石の隙間に露が結び始めた。女は戻ってきた『朝』と『風』という言葉を口の中で静かに繰り返している。"
    )), "event-log");
  } else {
    logMd(pickLang(ST_L(
      "💧 **【女】** — Beside the bone-dry stone well, a gaunt woman rinses bloodstained linen in a wooden basin. Her lips move in silent repetition, trying not to forget her missing family's names.",
      "💧 **【女】** — 바닥이 갈라진 돌우물 곁에서 야윈 여인이 핏물 배인 무명천을 나무 대야에 담가 조용히 헹구고 있다. 행방불명된 가족의 이름이라도 잊지 않으려는 듯, 갈라진 입술로 같은 음절만 끝없이 되뇌고 있다.",
      "💧 **【女】** — 底のひび割れた石井戸の傍らで、痩せ細った女が血の滲んだ木綿布を盥で静かに濯いでいる。行方知れずの家族の名だけでも忘れまいと、乾いた唇で同じ音を繰り返していた。"
    )), "event-log");
  }
}

/* ---- 6. 【鍛】 무너진 대장간 — 애꾸눈 대장장이 【男】 ---- */

function logSmithArrival() {
  const st = ensureStoryConfig();
  const phase = getStoryNarrativePhase();
  if (phase === "shura_12") {
    logMd(pickLang(ST_L(
      "⚒ **【男】** — The one-eyed smith keeps his hand on his heavy hammer, staring grimly at your blade.\n*\"That is no longer steel in your hand. It is a condensed bar of night and slaughter.\"*",
      "⚒ **【男】** — 애꾸눈 대장장이가 묵직한 메를 고쳐 쥔 채 당신의 허리춤을 무거운 눈으로 응시한다.\n*\"네 손에 들린 건 더 이상 무쇠 칼이 아니군. 밤과 살육이 엉겨 붙은 쇳덩어리지.\"*",
      "⚒ **【男】** — 隻眼の鍛冶屋は重い鎚を握り直し、険しい目でお前の腰元を見つめた。\n*「お前の手にあるのはもはや鋼の刀ではない。夜と殺戮が凝り固まった鉄塊だ。」*"
    )), "event-log");
  } else if (phase === "abyss_11") {
    logMd(pickLang(ST_L(
      "⚒ **【男】** — The smith frowns at the jagged black notches along your blade.\n*\"You struck something older than iron down in the Eleventh Gate. Careful your sword doesn't devour its wielder.\"*",
      "⚒ **【男】** — 대장장이가 당신의 칼날에 서린 검붉은 이빨 자국을 보며 미간을 찌푸린다.\n*\"열한 번째 문 아래에서 무쇠보다 오래된 괴물을 베었군. 칼이 주인을 잡아먹지 않게 조심해라.\"*",
      "⚒ **【男】** — 鍛冶屋はお前の刀身に宿る黒紅い刃こぼれを見て眉をひそめた。\n*「第十一獄の底で鉄より古い化け物を斬ったな。刀が主を喰わぬよう気をつけろ。」*"
    )), "event-log");
  } else if (st.unlockedDepth >= 8) {
    logMd(pickLang(ST_L(
      "⚒ **【男】** — Roaring orange flames fill the forge once more, and the smith's hammer rings clear and true across the courtyard.",
      "⚒ **【男】** — 화덕 안에서 다시 시뻘건 불길이 활활 타오르고, 대장장이의 망치질 소리가 맑고 우렁차게 마당을 울린다.",
      "⚒ **【男】** — 炉の中で再び紅蓮の炎が燃え盛り、鍛冶屋の槌音が澄んで力強く庭に響き渡っている。"
    )), "event-log");
  } else if (st.unlockedDepth >= 5) {
    logMd(pickLang(ST_L(
      "⚒ **【男】** — Warm smoke rises from the forge chimney as the smith sharpens a salvaged garrison spearhead.",
      "⚒ **【男】** — 대장간 굴뚝에서 따뜻한 연기가 피어오르고, 대장장이가 옛 주둔군 가도에서 거두어 온 창날을 숫돌에 갈고 있다.",
      "⚒ **【男】** — 鍛冶場の煙突から温かい煙が立ち昇り、鍛冶屋は古き街道から回収された槍先を砥石で研いでいる。"
    )), "event-log");
  } else {
    logMd(pickLang(ST_L(
      "⚒ **【男】** — Next to a cold furnace, a one-armed smith hammers a notched blade against a cracked anvil. Every strike scatters faint sparks of ink and iron across the ash.",
      "⚒ **【男】** — 불씨가 식어가는 화덕 곁에서 애꾸눈 대장장이가 이 빠진 검신을 갈라진 모루 위에 놓고 묵묵히 두드리고 있다. 망치가 내려앉을 때마다 쇳가루와 먹물이 섞인 서늘한 불꽃이 잿더미 위로 튄다.",
      "⚒ **【男】** — 火の消えかけた炉の傍らで、隻眼の鍛冶屋が刃こぼれした刀身をひび割れた金床に置いて黙々と打っている。槌が振り下ろされるたび、鉄粉と墨の混じった火花が灰の上に散った。"
    )), "event-log");
  }
}

/* ---- 7. 【祠】 이끼 낀 사당 & 8. 【墓】 무명 묘지 ---- */

function logShrineArrival() {
  const phase = getStoryNarrativePhase();
  if (phase === "shura_12") {
    logMd(pickLang(ST_L(
      "⛩ The crimson rope around the roadside shrine snaps as you approach, and the stone deity's face cracks down the middle.",
      "⛩ 당신이 다가서자 당산 사당에 감겨 있던 붉은 금줄이 팽팽하게 우는 소리를 내며 끊어지고, 돌장승의 얼굴에 실금이 간다.",
      "⛩ お前が近づくと石祠に巻かれていた朱の注連縄が張り詰めて千切れ、石仏の顔に亀裂が走った。"
    )), "event-log");
  } else {
    logMd(pickLang(ST_L(
      "⛩ Beneath a withered sacred tree stands a moss-covered shrine bound in frayed crimson rope. A cool breeze seeps from the stone crack, momentarily clearing the fog in your mind.",
      "⛩ 말라비틀어진 당산나무 아래, 해진 붉은 금줄이 감긴 돌사당이 안개를 마주 보고 서 있다. 이끼 낀 바위 틈새로 서늘한 바람이 흘러나와 흐려진 정신을 잠시 맑게 깨운다.",
      "⛩ 枯れ果てた御神木の下、擦り切れた朱の注連縄が巻かれた石祠が霧に向き合って立っている。苔むした岩の隙間から涼やかな風が流れ出し、濁った意識をひととき澄ませてくれた。"
    )), "event-log");
  }
}

function logGraveArrival() {
  const st = ensureStoryConfig();
  if ((st.clearedDepths || []).includes("depth_5") || st.unlockedDepth >= 6) {
    logMd(pickLang(ST_L(
      "🪦 On the tilted headstones where only blank stone remained before, carved names and epitaphs have resurfaced. White wildflowers bloom quietly between the graves.",
      "🪦 글자가 깎여 나가 민무늬 돌덩이만 남아 있던 묘비마다 망자의 이름과 생몰년이 되살아나 있다. 비석 사이로 작은 하얀 들꽃들이 고요히 피어나고 있다.",
      "🪦 文字が削り取られ空白だった墓石の一つ一つに、亡者の名と碑文が蘇っている。墓石の間には小さな白い野花が静かに咲いていた。"
    )), "event-log");
  } else {
    logMd(pickLang(ST_L(
      "🪦 Rows of tilted gravestones stand in the mist, every carved name chiseled away into blank stone. Residual echoes of those who died nameless still cling to the damp earth.",
      "🪦 비스듬히 기울어진 돌비석들이 안개 속에 줄지어 서 있으나, 비문마다 새겨져 있던 이름은 모두 깎여 나가 텅 비어 있다. 이름조차 남기지 못하고 스러진 망자들의 잔향만이 축축한 흙더미 위에 맴돈다.",
      "🪦 斜めに傾いた墓石が霧の中に並んでいるが、刻まれていたはずの名はすべて削り取られ空白となっている。名すら残せず散った亡者たちの残響だけが湿った土の上に漂っていた。"
    )), "event-log");
  }
}

/* ---- Interactive Choices at Each Village Spot (#choice-panel) ---- */

function renderVillageSpotChoices(spotKey) {
  const st = ensureStoryConfig();
  if (!st.spotResonanceDone || typeof st.spotResonanceDone !== "object") st.spotResonanceDone = {};
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
            "🕯 **【先】** — *\"Fasten this **【生】 Talisman** to your chest. Even if the wraiths tear your body apart, my lantern will pull your soul back to this village. The path to the **First Gaol** lies beneath the northern cliff.\"*",
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

    // 2. Deep, evolving Sekiro-style conversation with Sensei 【先】
    actions.push({
      label: pickLang(ST_L(
        "💬 Speak with Sensei 【先】",
        "💬 스승【先】과 이야기를 나눈다",
        "💬 師【先】と語り合う"
      )),
      onClick: () => {
        playClickSfx();
        const milestones = [
          {
            id: "sensei_intro_lore",
            cond: true,
            text: ST_L(
              "🕯 **【先】** — *\"Three moons ago, the northern cliff split open and black ink-mist poured over our roofs. Every character carved on signs and scrolls rose up as a hungry wraith, and villagers who lost their names forgot even how to speak.\"*",
              "🕯 **【先】** — *\"석 달 전 북쪽 절벽이 갈라지더니 먹물 같은 안개가 마을을 덮쳤단다. 현판과 서책에 적혀 있던 글자들이 일제히 아귀처럼 일어나 사람들을 덮쳤고, 이름을 빼앗긴 마을 사람들은 말하는 법조차 잊은 채 껍데기만 남았지.\"*",
              "🕯 **【先】** — *「三月前、北の崖が割れて墨のような霧が里を覆ったのだ。扁額や書物に記されていた文字が一斉に餓鬼となって人々を襲い、名を奪われた里人は話すことすら忘れて抜け殻となってしまった。」*"
            )
          },
          {
            id: "sensei_resurrection_1",
            cond: (st.resurrectionCount || 0) >= 1,
            text: ST_L(
              "🕯 **【先】** — *\"Show me your wrist… So the 【生】 talisman burned to pull you back from the dark. Remember this: resurrection does not erase death. It borrows life from the lantern's ink, leaving a black stroke in your veins each time.\"*",
              "🕯 **【先】** — *\"손목을 이리 내밀어 보거라… 옥문 아래서 【生】 부적이 타오르며 죽음을 한 번 거슬렀구나. 명심해라, 회생(回生)은 죽음을 없던 일로 만드는 기적이 아니다. 등불의 먹물로 끊어진 명줄을 억지로 이어 붙이는 것이니, 되살아날 때마다 네 혈관에도 검은 획이 남는다.\"*",
              "🕯 **【先】** — *「手首を見せてみよ……獄門の底で【生】の護符が燃え、死を一度退けたな。心に留めておけ、回生とは死を無かったことにする奇跡ではない。灯の墨で千切れた命脈を強引に繋ぎ止める術ゆえ、蘇るたびにお前の血管にも黒い画が刻まれる。」*"
            )
          },
          {
            id: "sensei_gaol_3",
            cond: st.unlockedDepth >= 4,
            text: ST_L(
              "🕯 **【先】** — *\"Since you felled the master of the Silent Ward, the children have stopped coughing blood. In my youth, I served as a royal scribe in the capital… I helped draw the boundary lines that sealed these characters underground. This calamity is my sin to bear.\"*",
              "🕯 **【先】** — *\"네가 적막의 병동 우두머리를 베어낸 뒤로 아이들의 기침 소리가 멎었구나. 실은 말이다… 젊은 시절의 나는 도성에서 왕실의 자전(字典)을 편찬하던 서기였다. 사람의 말을 다듬는다며 수천의 해묵은 글자를 이 절벽 아래에 봉인하는 데 내 붓도 동원되었지. 이 재앙은 내 업보이기도 하다.\"*",
              "🕯 **【先】** — *「お前が静寂の病棟の主を討ってから、童たちの咳が止まったよ。実はな……若き日のわしは都で王室の字典を編む書記であった。人の言葉を整えるという名目で、幾千の古き文字をこの崖下に封じるのにわしの筆も使われたのだ。この災いはわしの業でもある。」*"
            )
          },
          {
            id: "sensei_gaol_7",
            cond: st.unlockedDepth >= 7,
            text: ST_L(
              "🕯 **【先】** — *\"You have reached the deeper Gaols where the words of war, oaths, and execution are kept. Have you spoken with the blind Elder 【老】 at the brazier? Forty years ago, he was my fellow disciple—and the greatest swordsman in this province.\"*",
              "🕯 **【先】** — *\"이제 아이들이 배우던 얕은 글자의 영역을 지나, 칼과 맹세와 형벌의 말들이 도사린 깊은 옥문으로 들어섰구나. 화로터의 눈먼 노인【老】과는 이야기를 나누어 보았느냐? 사십 년 전, 그이는 나와 함께 글과 검을 배웠던 사형(師兄)이자 이 고을 최고의 검객이었단다.\"*",
              "🕯 **【先】** — *「もはや童が学ぶ浅き文字の領域を越え、刃と誓いと刑罰の言葉が巣食う深き獄門へ入ったな。火炉の盲目の老人【老】とは話したか？ 四十年前、あやつはわしと共に書と剣を学んだ兄弟子であり、この国随一の剣客であったのだ。」*"
            )
          },
          {
            id: "sensei_gaol_10",
            cond: st.humanEndingSeen || st.unlockedDepth >= 11,
            text: ST_L(
              "🕯 **【先】** — *\"All the words needed for mortals to live, love, and mourn have returned to our village. You have fulfilled every oath. I beg of you as your teacher—do not unseal the Eleventh Gate where my old friend lost his eyes.\"*",
              "🕯 **【先】** — *\"사람이 이승에서 살아가고, 사랑하고, 애도하는 데 필요한 모든 말이 마을로 돌아왔다. 너는 이미 모든 맹세를 다했어. 스승으로서 마지막으로 청하건대… 내 옛 사형이 두 눈을 잃었던 열한 번째 금역의 문만은 결코 열지 마라.\"*",
              "🕯 **【先】** — *「人が現世で生き、愛し、弔うために必要な言葉はすべて里へ還った。お前はすでに全ての誓いを果たしたのだ。師として最後に頼む……わしの兄弟子が両目を失った第十一獄の門だけは、決して開けてはならぬ。」*"
            )
          },
          {
            id: "sensei_shura",
            cond: st.visitedDepth11 || st.visitedDepth12,
            text: ST_L(
              "🕯 **【先】** — *\"So even you could not resist the call of the uncarved strokes… If you fall completely into Shura at the bottom of the Twelfth Gaol, this old man will have no choice but to extinguish the lantern himself.\"*",
              "🕯 **【先】** — *\"결국 너마저 도려내진 태고의 획이 부르는 소리를 뿌리치지 못했구나… 만일 네가 열두 번째 나락 끝에서 완전히 수라로 전락한다면, 이 늙은 스승이 직접 등불을 꺼뜨려 네 귀환길을 끊을 수밖에 없다.\"*",
              "🕯 **【先】** — *「結局お前もまた、切り捨てられた太古の画の呼び声を振り切れなかったか……もしお前が第十二獄の果てで完全に修羅へと堕ちたなら、この老いぼれが自ら提灯の火を消し、お前の帰還の道を断つほかない。」*"
            )
          }
        ];

        const ambientPool = [
          ST_L(
            "🕯 **【先】** — *\"This lantern burns oil pressed from ancient sutra ashes. So long as you carry 【生】, death in the Gaol is not the end—though loose Kanji in your satchel will scatter into the mist unless bound by a cord or bell.\"*",
            "🕯 **【先】** — *\"이 등불은 옛 경전을 태운 재와 기름으로 타오르고 있다. 네가 【生】을 지닌 한 옥문에서 목숨을 잃어도 혼백은 이곳으로 돌아오지만, 가방에 담긴 일반 한자들은 안개에 흩어지니 소지의 부적이나 방울로 대비해야 할 것이다.\"*",
            "🕯 **【先】** — *「この提灯は古の経典を焼いた灰と油で灯っている。お前が【生】を持つ限り獄門で果てても魂はここへ戻るが、袋の一般漢字は霧に散ってしまうゆえ、護符や鈴で備えるがよい。」*"
          ),
          ST_L(
            "🕯 **【先】** — *\"When a wraith prepares its strike, look closely at the single intent character floating beside it. That character is not a riddle—it is the exact form of its upcoming attack. Answer fire with water, and blade with shield.\"*",
            "🕯 **【先】** — *\"원령이 살기를 모을 때 그 곁에 떠오르는 단 한 글자의 의도를 똑똑히 보거라. 그것은 수수께끼가 아니라 놈이 곧 휘두를 공격의 실체다. 불【火】로 덮쳐 오면 물【水】로 끄고, 칼날【刀】로 베어 오면 쇠나 돌로 받아쳐라.\"*",
            "🕯 **【先】** — *「怨霊が殺気を練る時、その傍らに浮かぶ一字の意図をよく見よ。それは謎掛けではなく、奴が繰り出す攻撃そのものだ。【火】で迫るなら【水】で消し、【刀】で斬りかかるなら鉄や石で受け止めよ。」*"
          ),
          ST_L(
            "🕯 **【先】** — *\"A word spoken without intent is mere noise. Even if you hold three strong characters in your palm, weaving two that truly fit the moment will cut far deeper than forcing all three.\"*",
            "🕯 **【先】** — *\"뜻이 실리지 않은 말은 허공에 흩어지는 소음에 불과하다. 손안에 아무리 좋은 글자가 여러 장 있어도, 억지로 욱여넣기보다 상황에 꼭 들어맞는 두 글자를 엮어 일격을 날리는 편이 훨씬 깊게 베는 법이니라.\"*",
            "🕯 **【先】** — *「意味の伴わぬ言葉は虚空に散る雑音にすぎぬ。手の中にどれほど良い文字が揃っていようと、無理に詰め込むより、局面にぴたりと噛み合う二字を紡いで一撃を放つ方が遥かに深く斬れるものだ。」*"
          ),
          ST_L(
            "🕯 **【先】** — *\"Do you remember sitting by that window as a child, falling asleep with ink on your cheek? Your friend 【友】 on the bridge and you used to race to see who could write 'Sword' first.\"*",
            "🕯 **【先】** — *\"어릴 적 저 창가에서 볼에 먹물을 묻힌 채 꾸벅꾸벅 졸던 네 모습이 아직도 눈에 선하구나. 돌다리에 있는 네 벗【友】과 누가 먼저 칼 도【刀】 자를 바르게 쓰나 내기하곤 했었지.\"*",
            "🕯 **【先】** — *「幼い頃、あの窓辺で頬に墨をつけたまま居眠りしていたお前の姿が今でも目に浮かぶよ。石橋にいる旧友【友】と、どちらが先に正しい『刀』の字を書けるか競い合っていたものだ。」*"
          ),
          ST_L(
            "🕯 **【先】** — *\"If a Gaol feels overwhelming, do not be ashamed to step back through the gate with 【帰】. Keeping the words you have gathered is wiser than losing them all to pride.\"*",
            "🕯 **【先】** — *\"옥문 아래의 기세가 감당하기 벅차거든 부끄러워 말고 갈림길에서 발걸음을 돌려 귀환하거라. 지금 거둔 글자들을 온전히 지킨 채 호흡을 가다듬는 것이 무모하게 스러지는 것보다 백번 현명하다.\"*",
            "🕯 **【先】** — *「獄門の気配が手に余る時は、恥じることなく辻から【帰】を選び引き返すがよい。今集めた文字を守り抜いて息を整える方が、無謀に散るより百倍賢明だ。」*"
          )
        ];

        playDialoguePool(st, "sensei", milestones, ambientPool);
        renderVillageSpotChoices("塾");
      }
    });

    // Contextual Kanji Resonance at 【塾】: Offer Tea/Medicine/Incense Kanji (茶, 薬, 香, 草) from bag
    const teaIdx = findMatchingCardInDeck(st.deck, ["茶", "薬", "香", "湯"]);
    if (teaIdx >= 0 && !st.spotResonanceDone.sensei_tea) {
      const teaCard = st.deck[teaIdx];
      actions.push({
        label: pickLang(ST_L(
          `🍵 Offer 【${teaCard}】 from Bag to Sensei`,
          `🍵 가방의 【${teaCard}】 한자를 스승께 달여 올린다`,
          `🍵 袋の【${teaCard}】を師に煎じて献じる`
        )),
        gold: true,
        onClick: () => {
          playHealSfx();
          st.deck.splice(teaIdx, 1);
          state.deck = [...st.deck];
          st.spotResonanceDone.sensei_tea = true;
          st.senseiBlessedNextRun = true;
          if ((st.resurrectionCount || 0) > 0) st.resurrectionCount -= 1;
          state.maxHp += 20;
          state.playerHp = state.maxHp;
          state.rerollTokens += 1;
          persistStoryState();
          logMd(pickLang(ST_L(
            `🍵 **【先】** breathes in the warm steam rising from **【${teaCard}】** and closes his eyes.\n*"…How long has it been since I tasted real tea instead of ash? Thank you, my pupil. This warmth washes the dark ink from your veins as well."* (**Next run Max HP +20 · Reroll +1 · Ink-Scar cleansed**)` ,
            `🍵 스승【先】이 당신이 건넨 **【${teaCard}】** 글자에서 피어오르는 따뜻한 김을 들이마시며 눈을 감습니다.\n*"…잿물이 아닌 진짜 향기를 맡아보는 게 얼마 만인지 모르겠구나. 고맙다, 내 제자야. 이 따뜻한 기운이 네 혈관에 고인 회생의 먹물도 씻어 줄 것이다."* (**다음 출정 최대 HP +20 · 리롤 +1 · 회생 묵흔 정화**)` ,
            `🍵 師【先】はお前が差し出した**【${teaCard}】**から立ち昇る湯気を吸い込み、静かに目を閉じた。\n*「……灰汁ではなく本物の香りを嗅ぐのはいつ以来か。礼を言うぞ、我が弟子よ。この温もりがお前の脈に溜まった回生の墨も洗い流してくれるだろう。」*（**次回出陣 最大HP+20・リロール+1・墨痕浄化**）`
          )), "fx-log");
          updateBattleHUD(false);
          renderVillageSpotChoices("塾");
        }
      });
    }

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
            if (st.senseiBlessedNextRun) {
              playClickSfx();
              logMd("🍵 이미 약차의 기운이 몸에 돌고 있습니다. 다음 출정 뒤에 다시 달여 주겠다고 합니다.", "hint-log");
              return;
            }
            playHealSfx();
            addStoryYen(-cost);
            st.senseiBlessedNextRun = true;
            state.maxHp += 15;
            state.playerHp = state.maxHp;
            state.rerollTokens += 1;
            persistStoryState();
            logMd("🍵 스승이 달여 준 쓴 약차를 마시자 단전에 따뜻한 기운이 돕니다 (**다음 출정 최대 HP +15 · 리롤 +1**).", "fx-log");
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
            "👁 Acquired **【眼】 Bead of the Mind's Eye** — Every run starts with **Ancient God Summon +1 & Reroll +1**!",
            "👁 **【특수 소지: 【眼】 심안의 부적】** 획득 — 매 출정마다 **고신 1회 · 리롤 1회**가 부여됩니다!",
            "👁 **【特殊所持：【眼】心眼の護符】** 獲得 — 毎回の出陣時に**古神召喚1回・リロール1回**が付与される！"
          )), "fx-log");
          updateBattleHUD(false);
        } else {
          playClickSfx();
          const milestones = [
            {
              id: "elder_origin_1",
              cond: true,
              text: ST_L(
                "🔥 **【老】** — *\"In the beginning, shaman-kings carved tortoise shells with red-hot bronze to bind rampaging calamities into shapes. When you combine two Kanji in battle, you are clashing two cages together to unleash their trapped fury.\"*",
                "🔥 **【老】** — *\"태초에 무왕들이 달군 청동 송곳으로 거북 등딱지를 지져, 날뛰는 재앙을 모양 속에 가둔 것이 한자의 시작이었지. 전장에서 두 글자를 합쳐 내리치는 건 두 감옥을 충돌시켜 그 안의 원념을 폭발시키는 주술일세.\"*",
                "🔥 **【老】** — *「太古の昔、巫王たちが焼いた青銅の錐で亀甲を穿ち、荒ぶる災厄を形の中に封じたのが漢字の始まりよ。戦場で二字を合わせて叩き込むのは、二つの牢獄をぶつけて中の怨念を爆発させる呪術なのじゃ。」*"
              )
            },
            {
              id: "elder_eyes_past",
              cond: st.unlockedDepth >= 5,
              text: ST_L(
                "🔥 **【老】** — *\"You wonder how I lost my sight? Forty years ago, I descended past the Tenth Gate with a blade in hand. When I looked upon the primeval characters of the Eleventh Gaol, my sword began to swing on its own—so I thrust two burning coals into my eyes before I could slaughter this village.\"*",
                "🔥 **【老】** — *\"내 두 눈이 어쩌다 멀었는지 궁금한가? 사십 년 전, 패기에 취해 열 번째 문 아래 금역까지 칼을 들고 내려갔었지. 거기서 사람의 규격을 벗어난 태고의 글자들을 본 순간 내 팔이 멋대로 살육을 갈망하더군… 그래서 마을로 돌아와 사람들을 베기 전에, 화로의 달군 숯 두 덩이로 내 눈을 직접 지졌네.\"*",
                "🔥 **【老】** — *「わしの両目がなぜ潰れたか気になるか？ 四十年前、若気の至りで第十の門の下の禁域まで刀を提げて降りたのよ。そこで人の規格を超えた太古の文字を見た瞬間、腕が勝手に殺戮を渇望し始めてな……里へ戻って人を斬る前に、火炉の炭で己の目を焼いたのさ。」*"
              )
            },
            {
              id: "elder_furnace_returned",
              cond: st.unlockedDepth >= 9,
              text: ST_L(
                "🔥 **【老】** — *\"Listen to the brazier crackle… Since you slew the lord of the Furnace of Karma, my ash fire burns hot enough to weld even the heaviest curses. Do not hesitate to fuse two characters into one before facing the Underworld.\"*",
                "🔥 **【老】** — *\"화로에서 불꽃 튀는 소리가 들리는가… 자네가 업화의 화로 주인을 베고 온 뒤로, 식어 있던 내 화로에도 진짜배기 불길이 돌아왔네. 저승의 주인을 마주하기 전에 남는 글자들을 연성해 단단한 합자 패로 묶어 두게.\"*",
                "🔥 **【老】** — *「火炉で火花の爆ぜる音が聞こえるか……貴様が業火の炉の主を討ってから、冷えかけていたわしの火炉にも本物の炎が戻ったわい。冥府の主に挑む前に、余った文字を錬成して強固な合字札に束ねておけ。」*"
              )
            },
            {
              id: "elder_shura_warn",
              cond: st.humanEndingSeen || st.unlockedDepth >= 11,
              text: ST_L(
                "🔥 **【老】** — *\"Sensei 【先】 told you never to open the Eleventh Gate, didn't he? He was always the righteous one. Yet I can smell the ink on your blade… You and I are cut from the same cursed iron.\"*",
                "🔥 **【老】** — *\"서당의 【先】은 자네더러 제11옥의 문만은 절대 열지 말라고 만류했겠지. 그 친구는 평생 올곧은 선비였으니까. 허나 내 코에는 자네 칼날에 밴 먹물 냄새가 맡아지네… 자네와 나는 결국 같은 부류의 칼잡이야.\"*",
                "🔥 **【老】** — *「書堂の【先】は貴様に第十一獄の門だけは開けるなと止めたであろう。あやつは昔から正しい男だったからな。だがわしの鼻には貴様の刃に染みた墨の匂いが分かる……貴様とわしは結局、同じ穴の刀使いよ。」*"
              )
            }
          ];

          const ambientPool = [
            ST_L(
              "🔥 **【老】** — *\"Cast any two characters into my ash brazier with 80 Yen of echoes, and the fire will bind them side by side into a single compound card. Or if your satchel is cluttered, burn unwanted script into pure Yen.\"*",
              "🔥 **【老】** — *\"가방의 글자 두 장에 잔향 80엔을 얹어 내 화로에 던져 넣으면, 불길이 두 글자를 이어 붙여 한 장의 합자 카드로 묶어 주지. 쓸모없는 패가 넘치거든 불에 태워 잔향으로 환원해도 좋고.\"*",
              "🔥 **【老】** — *「袋の文字二枚に残響80円を添えてわしの火炉へ投げ入れれば、炎が二字を繋ぎ合わせて一枚の合字札に束ねてくれる。不要な札が溢れているなら、焼いて残響に還すがよい。」*"
            ),
            ST_L(
              "🔥 **【老】** — *\"When your hand lacks the right element in combat, calling an Ancient God forces a high-tier character into your palm. My 【眼】 bead covers the first toll, but further summons will drink your own lifeblood.\"*",
              "🔥 **【老】** — *\"전투 중에 적의 약점을 찌를 마땅한 패가 없을 땐 고신을 불러내어 강력한 글자를 강제로 쥐는 수밖에 없지. 내가 준 【眼】 부적이 첫 대가를 대신 치러 주겠지만, 그다음부턴 자네의 생혈을 갉아먹을 걸세.\"*",
              "🔥 **【老】** — *「戦いの最中に敵の弱点を突く札がない時は、古神を呼び出して強い文字を強引に握るほかない。わしがやった【眼】の護符が最初の代償を肩代わりするが、次からは貴様の生血を啜ることになるぞ。」*"
            ),
            ST_L(
              "🔥 **【老】** — *\"Once you fell a wraith in the Gaols, its strokes are scattered and it will not rise again—unless you pay me to stir its ashes in this brazier.\"*",
              "🔥 **【老】** — *\"옥문에서 한 번 베어 넘긴 원령은 그 획이 부서져 다시 나타나지 않지. 혹여 수거하지 못한 글자가 아쉬워 놈들을 다시 불러내고 싶거든 내 화로에 잔향을 던져 넣게.\"*",
              "🔥 **【老】** — *「獄門で一度斬り伏せた怨霊は画が砕け、二度と現れぬ。もし拾い損ねた文字が惜しくて奴らを再び呼び出したいなら、わしの火炉に残響を投げ入れよ。」*"
            ),
            ST_L(
              "🔥 **【老】** — *\"A two-character compound card strikes with the weight of both concepts at once, and only takes up a single slot in your hand. Pair an element with a weapon—like Fire and Blade—and watch the wraiths burn.\"*",
              "🔥 **【老】** — *\"화로에서 묶어낸 두 글자짜리 카드는 손패 한 칸만 차지하면서도 두 글자의 뜻을 동시에 터뜨리지. 불【火】과 칼【刀】처럼 속성과 무기를 한 장으로 묶어 두면 요긴하게 쓰일 걸세.\"*",
              "🔥 **【老】** — *「火炉で束ねた二字の札は手札一枠しか使わずに二つの意味を同時に炸裂させる。【火】と【刀】のように属性と得物を一枚に束ねておけば重宝するぞ。」*"
            )
          ];

          playDialoguePool(st, "elder", milestones, ambientPool);
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
          const milestones = [
            {
              id: "friend_cat_saved",
              cond: st.catRescued,
              text: ST_L(
                "🗡 **【友】** — *\"Seeing that black cat 【猫】 curled up by your old hearth makes this dead village feel alive again. Drop by your home 【家】 whenever you return from the Gaols—it waits for your footsteps.\"*",
                "🗡 **【友】** — *\"네가 옥문에서 구해 온 검은 고양이【猫】가 네 옛 본가【家】 아궁이에 자리 잡은 걸 보니, 죽은 듯하던 마을에 비로소 온기가 도는 것 같아. 원정을 마치고 돌아올 때마다 들러서 쓰다듬어 줘.\"*",
                "🗡 **【友】** — *「お前が獄門から救い出した黒猫【猫】が生家【家】のかまどに居着いたのを見ると、死んだようだった里に温もりが戻った気がするよ。遠征から戻るたびに立ち寄って撫でてやれよ。」*"
              )
            },
            {
              id: "friend_gaol_4",
              cond: st.unlockedDepth >= 4,
              text: ST_L(
                "🗡 **【友】** — *\"Beyond the Third Gaol lie the old garrison roads—Ibaraki, Ehime, Tochigi, Osaka… Every province name was swallowed by the mist along with the soldiers stationed there. Watch out for their formation volleys.\"*",
                "🗡 **【友】** — *\"네 번째 옥문부터는 옛 주둔군이 지키던 가도와 고을들이야—이바라키, 에히메, 도치기, 오사카… 고을 이름 자체가 안개에 통째로 먹히면서 그곳을 지키던 병사들도 망령이 되었어. 화살 세례와 포위망을 조심해.\"*",
                "🗡 **【友】** — *「第四獄からはかつての駐屯軍が守っていた街道と州だ——いばらき、えひめ、とちぎ、おおさか……土地の名そのものが霧に呑まれ、そこを守っていた兵たちも亡霊と化した。斉射と包囲には気をつけろよ。」*"
              )
            },
            {
              id: "friend_gaol_7",
              cond: st.unlockedDepth >= 7,
              text: ST_L(
                "🗡 **【友】** — *\"From the Seventh Gaol downward, the wraiths are no longer single drifting words. Two characters fuse together into compound fiends like 【百鬼】 and 【狂獣】. Don't face them with a thin bag.\"*",
                "🗡 **【友】** — *\"일곱 번째 옥문 아래부터는 원령들의 격이 달라져. 낱글자로 떠돌던 사념들이 두 글자씩 엉겨 붙어 【광수(狂獣)】나 【백귀(百鬼)】 같은 흉물로 변하거든. 가방의 패를 묵직하게 갖추고 내려가야 해.\"*",
                "🗡 **【友】** — *「第七獄より下は怨霊どもの格が変わる。一字で漂っていた思念が二字ずつ絡み合い、【狂獣】や【百鬼】のような凶物へと化けるんだ。袋の札をしっかり鍛えてから降りろよ。」*"
              )
            },
            {
              id: "friend_gaol_10",
              cond: st.humanEndingSeen || st.unlockedDepth >= 11,
              text: ST_L(
                "🗡 **【友】** — *\"When we were kids, we swore we'd guard this bridge together. In the end, you carried the whole village on your back alone… Let's share a cup of tea at Sensei's hall and never look at that northern cliff again.\"*",
                "🗡 **【友】** — *\"어릴 적에 우리 둘이서 이 돌다리를 끝까지 지키자고 약속했었잖아. 결국 무거운 짐은 네가 혼자 다 짊어지고 말았네… 이제 스승님 서당에서 차나 나누면서, 저 북쪽 절벽 쪽은 쳐다보지도 말자.\"*",
                "🗡 **【友】** — *「子供の頃、二人でこの石橋を最後まで守ろうって約束したよな。結局、重い荷はお前一人に背負わせてしまった……もう先生の書堂で茶でも酌み交わして、北の崖なんか見ないようにしようぜ。」*"
              )
            }
          ];

          const ambientPool = [
            ST_L(
              "🗡 **【友】** — *\"When the fog rolled down from the cliff, ordinary steel passed right through those monsters. Only when I pressed a carved Kanji talisman against my blade did the strike actually bite into their flesh.\"*",
              "🗡 **【友】** — *\"절벽 아래서 안개가 쏟아져 나오던 날, 평범한 쇠칼은 그 괴물들의 몸을 그냥 허공처럼 스쳐 지나갔어. 품에 있던 한자 조각 두 개를 칼날에 겹쳐 쥐고 내리쳤을 때야 비로소 놈들의 살점이 베어지더군.\"*",
              "🗡 **【友】** — *「崖下から霧が溢れ出した日、ただの鉄刀はあいつらの体を空を切るようにすり抜けたんだ。懐にあった漢字の欠片を二つ刀身に重ねて打ち込んだ時、初めて奴らの肉に刃が通ったんだよ。」*"
            ),
            ST_L(
              "🗡 **【友】** — *\"If an enemy is badly wounded and shows an escape intent like 【走】 or 【出】, block its legs or cut off its path! If you let it bolt, it'll recover its breath and ambush you deeper in the Gaol.\"*",
              "🗡 **【友】** — *\"원령의 숨통이 거진 끊어져 갈 때 【주(走)】나 【출(出)】 같은 도주 기색을 보이면, 퇴로를 막거나 다리를 묶는 행동을 해야 해! 그대로 놓치면 안개 속에서 숨을 고른 뒤 더 깊은 길목에서 다시 덮쳐오거든.\"*",
              "🗡 **【友】** — *「怨霊の息が絶えかけた時、【走】や【出】のような逃走の気配を見せたら、退路を塞ぐか足を止める行動を取れ！ 逃がしてしまうと霧の中で息を整え、さらに奥で待ち伏せしてくるぞ。」*"
            ),
            ST_L(
              "🗡 **【友】** — *\"Remember how Sensei 【先】 used to rap our knuckles whenever we miswrote a single stroke? Who would've thought our lives would depend on those very strokes… Come back alive, my friend.\"*",
              "🗡 **【友】** — *\"어릴 적 서당에서 획 하나만 잘못 그어도 스승님【先】께 회초리를 맞곤 했잖아. 그때 억지로 외우던 글자들에 이제 우리 목숨이 달리게 될 줄 누가 알았겠어… 부디 죽지 말고 살아 돌아와라, 친구야.\"*",
              "🗡 **【友】** — *「昔、書堂で一画でも書き損じると先生【先】に竹箆で叩かれたよな。あの頃必死に覚えた文字に、今や俺たちの命が懸かることになるとは……頼むから生きて戻ってこいよ、友よ。」*"
            ),
            ST_L(
              "🗡 **【友】** — *\"The one-eyed smith 【男】 at the forge lost his son in the garrison. He speaks roughly, but if you bring him a good iron or fire character from the Gaols, his eyes light up.\"*",
              "🗡 **【友】** — *\"대장간의 애꾸눈 아저씨【男】 말야, 이번 안개 난리 때 주둔군에 나갔던 아들을 잃었어. 말투는 무뚝뚝해도 옥문에서 좋은 쇠나 불 글자를 구해 가면 누구보다 반기실 거야.\"*",
              "🗡 **【友】** — *「鍛冶場の隻眼のおっちゃん【男】、今回の霧の異変で駐屯軍に出ていた息子を亡くしたんだ。口ぶりはぶっきらぼうだけど、獄門から良い鉄や火の文字を持っていけば誰より喜んでくれるはずさ。」*"
            )
          ];

          playDialoguePool(st, "friend", milestones, ambientPool);
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
            if (st.catBlessedNextRun) {
              playClickSfx();
              logMd("🐾 고양이는 이미 당신의 손길에 만족한 듯 몸을 말고 잠들어 있습니다.", "hint-log");
              return;
            }
            playHealSfx();
            st.catBlessedNextRun = true;
            state.maxHp += 15;
            state.playerHp = state.maxHp;
            state.rerollTokens += 1;
            persistStoryState();
            logMd(pickLang(ST_L(
              "🐱 **【猫】** rubs its warm head against your palm and purrs loudly, banishing the chill of the abyss (**Next run Max HP +15 · Reroll +1**).",
              "🐱 **【猫】**가 따뜻한 머리를 당신의 손바닥에 비비며 기분 좋게 골골거립니다. 심연의 한기가 가시고 생기가 차오릅니다 (**다음 출정 최대 HP +15 · 리롤 +1**).",
              "🐱 **【猫】**が温かい頭をお前の手のひらに擦りつけて心地よさそうに喉を鳴らし、深淵の冷気が拭い去られた（**次回出陣 最大HP+15・リロール+1**）。"
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

      // Contextual Kanji Resonance at 【家】: Feed Fish/Meat (魚, 肉, 鳥) to 【猫】
      const foodIdx = findMatchingCardInDeck(st.deck, ["魚", "肉", "鳥", "貝"]);
      if (foodIdx >= 0 && !st.spotResonanceDone.cat_fed) {
        const foodCard = st.deck[foodIdx];
        actions.push({
          label: pickLang(ST_L(
            `🐟 Feed 【${foodCard}】 from Bag to 【猫】`,
            `🐟 가방의 【${foodCard}】 한자를 고양이【猫】에게 준다`,
            `🐟 袋の【${foodCard}】を黒猫【猫】にやる`
          )),
          gold: true,
          onClick: () => {
            playSealStampSfx();
            st.deck.splice(foodIdx, 1);
            st.deck.push("虎");
            state.deck = [...st.deck];
            st.spotResonanceDone.cat_fed = true;
            addStoryYen(60);
            persistStoryState();
            logMd(pickLang(ST_L(
              `🐱 **【猫】** eagerly devours **【${foodCard}】**, then bounds under the floorboards and drops a fierce **【虎】** shard and **+60 円** at your feet!`,
              `🐱 **【猫】**가 **【${foodCard}】** 한자를 맛있게 삼키더니, 마루 밑으로 쏙 들어가 반짝이는 맹호의 글자 조각 **【虎】**와 **+60 円**을 물어다 당신 발치에 내려놓습니다!`,
              `🐱 **【猫】**は **【${foodCard}】** を美味しそうに平らげると、縁の下へ潜り込んで輝く **【虎】** の欠片と **+60 円** を咥えてお前の足元に置いた！`
            )), "fx-log");
            updateBattleHUD(false);
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
          const milestones = [
            {
              id: "woman_husband_missing",
              cond: true,
              text: ST_L(
                "💧 **【女】** — *\"My husband ran toward the northern cliff when the characters attacked. Only this bloodied sleeve came back… and now I cannot even recall the Kanji of his name.\"*",
                "💧 **【女】** — *\"안개가 덮치던 밤에 남편이 식구들을 지키겠다며 절벽 쪽으로 달려 나갔어요. 돌아온 건 이 피 묻은 옷소매뿐인데… 이제는 그이 이름에 어떤 한자가 들어갔는지조차 떠오르지 않아요.\"*",
                "💧 **【女】** — *「霧が襲った夜、夫は家族を守ると言って崖の方へ駆けていきました。戻ってきたのはこの血塗れの袖だけで……今ではあの人の名にどんな字を書いていたかすら思い出せないのです。」*"
              )
            },
            {
              id: "woman_gaol_4",
              cond: st.unlockedDepth >= 5,
              text: ST_L(
                "💧 **【女】** — *\"Since you cleared the fourth gate, the character 【誠】 resurfaced on the inside of my husband's torn sleeve…! That was his name. Even if he is gone, I can finally call him by name when I pray.\"*",
                "💧 **【女】** — *\"당신이 네 번째 옥문의 주인을 베고 돌아온 날, 남편의 찢어진 옷소매 안감에 지워졌던 【정성 성(誠)】 자가 다시 떠올랐어요…! 그이의 이름이었어요. 비록 사람은 돌아오지 못해도, 이제는 이름을 부르며 기도할 수 있게 되었네요.\"*",
                "💧 **【女】** — *「あなたが第四獄の主を討って戻られた日、夫の千切れた袖の裏地に消えていた【誠】の字が浮かび上がったのです……！ あの人の名でした。たとえ帰らぬ人となっていても、ようやく名を呼んで祈ることができます。」*"
              )
            },
            {
              id: "woman_gaol_10",
              cond: st.humanEndingSeen || st.unlockedDepth >= 11,
              text: ST_L(
                "💧 **【女】** — *\"Look—the well is full of clear water again, and the children are singing in the lane. You gave us back our tears and our voices.\"*",
                "💧 **【女】** — *\"우물 안을 들여다보세요—시커먼 먹물이 가시고 맑은 샘물이 가득 차올랐어요. 우리가 울고 노래할 수 있는 말을 되찾아 주셔서 고맙습니다.\"*",
                "💧 **【女】** — *「井戸の中を見てください——黒い墨が消え、澄んだ湧き水が満ちています。私たちが泣き、歌うための言葉を取り戻してくださってありがとうございます。」*"
              )
            }
          ];

          const ambientPool = [
            ST_L(
              "💧 **【女】** — *\"Each time you slay a Gaol master below, a few forgotten words return to our tongues. Yesterday, the children finally remembered the word for 'water' and 'mother.'\"*",
              "💧 **【女】** — *\"당신이 옥문 아래에서 우두머리 원령을 하나씩 베어낼 때마다, 마을 사람들의 혀끝에 잊혔던 단어가 조금씩 돌아오고 있어요. 어제는 아이들이 마침내 '물'과 '어머니'라는 말을 다시 발음했답니다.\"*",
              "💧 **【女】** — *「あなたが獄門の底で主を討つたび、里人たちの舌に忘れられていた言葉が少しずつ戻ってきています。昨日は子供たちがようやく『水』と『母』という言葉を思い出しました。」*"
            ),
            ST_L(
              "💧 **【女】** — *\"In the deep Gaols, neither pity nor hesitation will spare you. Wash the black ink from your blade and come back to the lantern light alive.\"*",
              "💧 **【女】** — *\"옥문 깊은 곳의 원령들에게는 동정도 주저함도 통하지 않아요. 부디 검은 먹물에 마음이 물들지 않도록 조심하고, 살아 돌아오세요.\"*",
              "💧 **【女】** — *「獄門の奥深くに巣食う怨霊には、情けもためらいも通じません。どうか黒い墨に心を染められぬよう、生きて灯のもとへ戻ってきてください。」*"
            ),
            ST_L(
              "💧 **【女】** — *\"Before the fog came, travelers from Tochigi and Ehime used to stop by this well to drink. I wonder if the roads beyond our valley have regained their names too.\"*",
              "💧 **【女】** — *\"안개가 내리기 전에는 도치기나 에히메 쪽에서 오가던 나그네들도 이 우물에서 목을 축이곤 했어요. 골짜기 너머의 길들도 이제 제 이름을 되찾았을까요.\"*",
              "💧 **【女】** — *「霧が降りる前は、とちぎやえひめの方から往来する旅人もこの井戸で喉を潤していきました。谷の向こうの街道も、もう自分の名を取り戻したでしょうか。」*"
            )
          ];

          playDialoguePool(st, "woman", milestones, ambientPool);
        }
        updateBattleHUD(false);
        renderVillageSpotChoices("井");
      }
    });

    // Contextual Kanji Resonance at 【井】: Pour a Water/Spring/Rain Kanji (泉, 雨, 露, 清) into the dry well
    const waterIdx = findMatchingCardInDeck(st.deck, ["泉", "雨", "露", "清", "湖"]);
    if (waterIdx >= 0 && !st.spotResonanceDone.well_spring) {
      const waterCard = st.deck[waterIdx];
      actions.push({
        label: pickLang(ST_L(
          `💧 Cast 【${waterCard}】 into the Dry Well`,
          `💧 마른 우물 바닥에 【${waterCard}】 한자를 떨어뜨린다`,
          `💧 涸れ井戸の底に【${waterCard}】を落とす`
        )),
        gold: true,
        onClick: () => {
          playHealSfx();
          st.deck.splice(waterIdx, 1);
          state.deck = [...st.deck];
          st.spotResonanceDone.well_spring = true;
          state.maxHp += 15;
          state.playerHp = state.maxHp;
          addStoryYen(50);
          persistStoryState();
          logMd(pickLang(ST_L(
            `💧 As **【${waterCard}】** sinks into the cracked stone, a clear spring gushes up from the bottom of the well! **【女】** clasps her hands in tears (**Max HP +15 · +50 円**).`,
            `💧 갈라진 우물 바닥에 **【${waterCard}】** 한자를 떨어뜨리자, 차갑고 맑은 샘물이 솟구쳐 오릅니다! 여인【女】이 눈물을 글썽이며 두 손을 모읍니다 (**최대 HP +15 · +50 円**).`,
            `💧 ひび割れた井戸の底へ **【${waterCard}】** を落とすと、冷たく澄んだ湧き水が噴き上がった！ 女【女】は涙を浮かべて手を合わせる（**最大HP+15・+50 円**）。`
          )), "fx-log");
          updateBattleHUD(false);
          renderVillageSpotChoices("井");
        }
      });
    }
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
          const milestones = [
            {
              id: "smith_son_blade",
              cond: st.unlockedDepth >= 4,
              text: ST_L(
                "⚒ **【男】** — *\"The spear I forged for my boy when he marched to Miyagi fortress had the character 【勇】 engraved on its tang. If you run into fallen soldiers in the Fourth Gaol… give them a clean end.\"*",
                "⚒ **【男】** — *\"내 아들이 미야기 성채 주둔군으로 떠날 때 내가 직접 벼려 준 창자루에는 【날랠 용(勇)】 자가 새겨져 있었지. 네 번째 옥문에서 성터를 떠도는 병사들을 마주치거든… 부디 단칼에 편히 보내 주어라.\"*",
                "⚒ **【男】** — *「息子がみやぎの城砦へ出征する時、俺が打ってやった槍の茎には【勇】の字を刻んでおいた。第四獄で城跡を彷徨う兵どもに出くわしたら……どうか一太刀で楽にしてやってくれ。」*"
              )
            },
            {
              id: "smith_gaol_7",
              cond: st.unlockedDepth >= 8,
              text: ST_L(
                "⚒ **【男】** — *\"You broke the Oni of the Seventh Gaol? Hah! No wonder my anvil is singing again. A blade that remembers its name never rusts.\"*",
                "⚒ **【男】** — *\"일곱 번째 옥문의 악귀들을 베고 왔다고? 하! 어쩐지 오늘따라 모루에 망치가 착착 감기더라니. 제 이름을 기억하는 칼날은 절대 녹슬지 않는 법이다.\"*",
                "⚒ **【男】** — *「第七獄の鬼どもを斬ってきただと？ ハッ！ どうりで今日は金床に槌がよく馴染むわけだ。己の名を覚えている刃は決して錆びぬものよ。」*"
              )
            }
          ];

          const ambientPool = [
            ST_L(
              "⚒ **【男】** — *\"Brute force alone won't fell a Gaol Lord. Read the meaning of the enemy's character—strike Fire with Water, Darkness with Light, and Armor with Piercing steel.\"*",
              "⚒ **【男】** — *\"무작정 획수만 높은 글자를 휘두른다고 능사가 아니다. 적의 한자가 품은 뜻을 읽고 그 상성을 찌르는 두 글자를 조합해 내리쳐 봐라—약점이 제대로 맞물리면 단 일격에 갑절의 치명상을 입힐 수 있다.\"*",
              "⚒ **【男】** — *「ただ画数の多い文字を振り回せばいいというものではない。敵の漢字が持つ意味を読み、その相性を突く二字を組み合わせて打ち込め——弱点が噛み合えば一撃で倍の致命傷を与えられる。」*"
            ),
            ST_L(
              "⚒ **【男】** — *\"The deeper you descend past the Sixth Gaol, the thicker the wraiths' hides become. Claim the heavy Kanji dropped by elites and bosses—their strokes carry real weight.\"*",
              "⚒ **【男】** — *\"여섯 번째 옥문을 넘어 깊은 곳으로 내려갈수록 원령들의 가죽은 무쇠보다 단단해진다. 정예 원령이나 우두머리를 베었을 때 떨어지는 묵직한 한자들을 챙겨 두어라. 획의 무게가 다르니까.\"*",
              "⚒ **【男】** — *「第六獄を越えて深くへ降りるほど、怨霊どもの皮は鋼よりも硬くなる。精鋭や主を斬った時に落ちる重みのある漢字を拾っておけ。画の重さがまるで違うからな。」*"
            ),
            ST_L(
              "⚒ **【男】** — *\"A bloated bag draws a clumsy hand. Take your weak leftovers to the blind Elder 【老】 at the brazier and melt them down into stronger script.\"*",
              "⚒ **【男】** — *\"가방에 잡다한 글자가 너무 많으면 정작 급할 때 원하는 패가 손에 잡히지 않는 법이지. 안 쓰는 잔패들은 화로터의 눈먼 노인【老】에게 가져가 합자 연성으로 묶거나 소각해서 정예로 추려 두어라.\"*",
              "⚒ **【男】** — *「袋に雑多な文字が多すぎると、いざという時に狙った札が手に入らぬものだ。使わぬ端札は火炉の盲目の老人【老】のところへ持っていき、合字錬成で束ねるか焼却して精鋭に絞っておけ。」*"
            )
          ];

          playDialoguePool(st, "smith", milestones, ambientPool);
        }
        updateBattleHUD(false);
        renderVillageSpotChoices("鍛");
      }
    });

    // Contextual Kanji Resonance at 【鍛】: Temper blade with Fire/Steel/Sword Kanji (炎, 鋼, 剣, 刃, 焼)
    const forgeIdx = findMatchingCardInDeck(st.deck, ["炎", "鋼", "剣", "刃", "焼", "炭"]);
    if (forgeIdx >= 0 && !st.spotResonanceDone.smith_temper) {
      const forgeCard = st.deck[forgeIdx];
      actions.push({
        label: pickLang(ST_L(
          `⚒ Temper Your Blade with 【${forgeCard}】`,
          `⚒ 가방의 【${forgeCard}】 한자를 화덕에 넣어 검신을 벼린다`,
          `⚒ 袋の【${forgeCard}】を炉にくべて刀身を鍛える`
        )),
        gold: true,
        onClick: () => {
          playSealStampSfx();
          st.deck.splice(forgeIdx, 1);
          st.deck.push("斬鉄");
          state.deck = [...st.deck];
          st.spotResonanceDone.smith_temper = true;
          state.freeSummons = (state.freeSummons || 0) + 1;
          persistStoryState();
          logMd(pickLang(ST_L(
            `⚒ **【男】** grins fiercely as he hammers **【${forgeCard}】** into white-hot steel!\n*"Now THAT is a real strike! Take this forged **【斬鉄】** compound—it'll cleave right through iron armor!"* (**Acquired 【斬鉄】 · Summon +1**)`,
            `⚒ 대장장이【男】가 당신이 건넨 **【${forgeCard}】** 한자를 화덕에 집어넣고 땀방울을 흩날리며 쇠망치를 내리칩니다!\n*"크하, 오랜만에 제대로 된 불꽃이 튀는군! 자, 벼려낸 **【斬鉄】** 패를 가져가라. 어떤 갑주든 두 동강을 낼 거다!"* (**합자 【斬鉄】 획득 · 고신 +1**)`,
            `⚒ 鍛冶屋【男】はお前が渡した **【${forgeCard}】** を炉に投げ入れ、汗を散らして大鎚を振り下ろした！\n*「ハッ、久々にまともな火花が散ったぜ！ ほれ、鍛え上げた **【斬鉄】** の札を持っていけ。どんな鎧も真っ二つだ！」*（**合字【斬鉄】獲得・古神+1**）`
          )), "fx-log");
          updateBattleHUD(false);
          renderVillageSpotChoices("鍛");
        }
      });
    }
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
            "⛩ As you bow before the moss-covered altar, a clear mountain breeze brushes your forehead and sharpens your focus (**Reroll +1**).",
            "⛩ 이끼 낀 돌제단 앞에 고개를 숙이자, 서늘한 산바람이 이마를 스치며 어지럽던 호흡과 정신이 맑게 가다듬어집니다 (**리롤 +1**).",
            "⛩ 苔むした石祭壇の前に頭を垂れると、涼やかな山風が額を撫で、乱れていた呼吸と意識が澄み渡った（**リロール +1**）。"
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
            "🪦 Cold mist coils around the stones. Every Gaol Lord you fell returns another forgotten name to these graves.",
            "🪦 비석 사이로 차가운 안개가 감돈다. 옥문의 우두머리를 하나씩 베어낼 때마다 이 무덤들의 주인도 제 이름을 되찾아 가고 있다.",
            "🪦 墓石の間に冷たい霧が渦巻いている。獄門の主を討つたび、この墓の主たちも自らの名を取り戻しつつある。"
          )), "sys-log");
        }
        updateBattleHUD(false);
        renderVillageSpotChoices("墓");
      }
    });

    // Contextual Kanji Resonance at 【墓】: Offer Flower/Light/Heart/Soul (花, 光, 灯, 心, 魂) to the graves
    const graveIdx = findMatchingCardInDeck(st.deck, ["花", "光", "灯", "心", "魂", "梅"]);
    if (graveIdx >= 0 && !st.spotResonanceDone.grave_offering) {
      const graveCard = st.deck[graveIdx];
      actions.push({
        label: pickLang(ST_L(
          `🪦 Lay 【${graveCard}】 Before the Gravestones`,
          `🪦 무명 묘비 앞에 가방의 【${graveCard}】 한자를 바친다`,
          `🪦 無名墓石の前に袋の【${graveCard}】を手向ける`
        )),
        gold: true,
        onClick: () => {
          playGongSfx();
          st.deck.splice(graveIdx, 1);
          state.deck = [...st.deck];
          st.spotResonanceDone.grave_offering = true;
          addStoryYen(90);
          state.rerollTokens += 1;
          persistStoryState();
          logMd(pickLang(ST_L(
            `🪦 You place **【${graveCard}】** upon the blank stone. Warm golden light rises from the earth as the consoled spirits leave behind **+90 円** and **Reroll +1**!`,
            `🪦 비어 있는 돌비석 앞에 **【${graveCard}】** 한자를 내려놓자, 흙더미 아래에서 은은한 금빛 무리가 피어오르며 위로받은 망자들이 **+90 円**과 **리롤 +1**을 남겨 줍니다!`,
            `🪦 空白の墓石の前に **【${graveCard}】** を手向けると、土の下から淡い金色の光が立ち昇り、慰められた亡者たちが **+90 円** と **リロール+1** を遺してくれた！`
          )), "fx-log");
          updateBattleHUD(false);
          renderVillageSpotChoices("墓");
        }
      });
    }
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

