/*
 * The twelve gaols. kanken_data.json supplies each depth's kanji pool (kept 100% intact);
 * this file supplies each depth's name, readable gloss, and enemy/boss pools.
 *
 * Every enemy in `roster` is strictly selected from that depth's Kanken grade in kanken_data.json
 * and represents an entity, creature, person, spirit, or living horror (never pure tools/verbs like 刀 or 破,
 * which belong in cards and enemy intents).
 */

const DEPTHS = {
  depth_1: {
    name: "獄門",
    gloss: { EN: "The Prison Gate", KO: "지옥의 문턱", JA: "地獄の入口", ZH_CN: "地狱之门", ZH_TW: "地獄之門" },
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
    roster: {
      normal: ["羊", "童", "客", "医", "者", "氷", "病"],
      elite: ["血", "悪"],
      boss: "死",
      bossPool: ["死", "神", "主"]
    }
  },
  depth_4: {
    name: "古戦場",
    gloss: { EN: "The Old Battlefield", KO: "옛 싸움터", JA: "古き戦場", ZH_CN: "古战场", ZH_TW: "古戰場" },
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
    roster: {
      normal: ["猫", "蛇", "猿", "蚊", "忍", "囚", "虜"],
      elite: ["仙", "翁"],
      boss: "覇",
      bossPool: ["覇", "竜", "帥"]
    }
  },
  depth_10: {
    name: "冥府",
    gloss: { EN: "The Underworld", KO: "저승", JA: "冥府", ZH_CN: "冥府", ZH_TW: "冥府" },
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

function depthRoster(depthId) {
  return (DEPTHS[depthId] || DEPTHS.depth_1).roster;
}

function allRosterKanji(depthId) {
  const r = depthRoster(depthId);
  const bosses = r.bossPool || [r.boss];
  return [...new Set([...r.normal, ...r.elite, ...bosses])];
}
