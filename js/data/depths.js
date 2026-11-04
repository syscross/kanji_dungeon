/*
 * The twelve gaols. kanken_data.json supplies each depth's kanji pool; this file supplies
 * everything that makes a depth a place: its name, a readable gloss, and the enemy roster.
 *
 * roster.normal  — ordinary foes met on 戦 nodes
 * roster.elite   — tougher foes behind risky signs (山, 門 …), better spoils
 * roster.boss    — the gaol's master, fought on the last step (may be multi-character)
 */

const DEPTHS = {
  depth_1: {
    name: "獄門",
    gloss: { EN: "The Prison Gate", KO: "지옥의 문턱", JA: "地獄の入口", ZH_CN: "地狱之门", ZH_TW: "地獄之門" },
    roster: { normal: ["犬", "虫", "火", "石", "車", "森"], elite: ["山", "天"], boss: "王" }
  },
  depth_2: {
    name: "風穴",
    gloss: { EN: "The Wind Hollow", KO: "바람의 굴", JA: "風の洞", ZH_CN: "风之洞", ZH_TW: "風之洞" },
    roster: { normal: ["馬", "鳥", "魚", "牛", "風", "雪", "雲"], elite: ["刀", "夜"], boss: "電" }
  },
  depth_3: {
    name: "血池",
    gloss: { EN: "The Blood Pond", KO: "피의 못", JA: "血の池", ZH_CN: "血池", ZH_TW: "血池" },
    roster: { normal: ["血", "氷", "病", "波", "鉄", "銀", "酒"], elite: ["悪", "神"], boss: "死" }
  },
  depth_4: {
    name: "古戦場",
    gloss: { EN: "The Old Battlefield", KO: "옛 싸움터", JA: "古き戦場", ZH_CN: "古战场", ZH_TW: "古戰場" },
    roster: { normal: ["兵", "熊", "鹿", "焼", "茨", "械"], elite: ["城", "戦"], boss: "軍" }
  },
  depth_5: {
    name: "罪人塚",
    gloss: { EN: "The Sinners' Mound", KO: "죄인의 무덤", JA: "罪人の塚", ZH_CN: "罪人冢", ZH_TW: "罪人塚" },
    roster: { normal: ["毒", "墓", "破", "迷", "武", "暴"], elite: ["殺", "罪"], boss: "災" }
  },
  depth_6: {
    name: "白骨殿",
    gloss: { EN: "The Hall of Bones", KO: "백골의 전당", JA: "白骨の殿", ZH_CN: "白骨殿", ZH_TW: "白骨殿" },
    roster: { normal: ["骨", "脳", "臓", "傷", "乱", "亡"], elite: ["敵", "聖"], boss: "皇" }
  },
  depth_7: {
    name: "鬼哭谷",
    gloss: { EN: "The Valley of Wailing", KO: "귀신이 우는 골짜기", JA: "鬼の哭く谷", ZH_CN: "鬼哭谷", ZH_TW: "鬼哭谷" },
    roster: { normal: ["剣", "獣", "爆", "砲", "刺", "鎖"], elite: ["雷", "巨", "狂"], boss: "鬼" }
  },
  depth_8: {
    name: "魔境",
    gloss: { EN: "The Demon Wilds", KO: "마의 경계", JA: "魔の境", ZH_CN: "魔境", ZH_TW: "魔境" },
    roster: { normal: ["霊", "怪", "邪", "魂", "炎", "賊", "幽"], elite: ["侍", "縛"], boss: "魔" }
  },
  depth_9: {
    name: "覇道",
    gloss: { EN: "The Road of Tyrants", KO: "패왕의 길", JA: "覇者の道", ZH_CN: "霸道", ZH_TW: "霸道" },
    roster: { normal: ["忍", "銃", "刃", "蛇", "猫", "猿", "棺"], elite: ["竜", "艦"], boss: "覇" }
  },
  depth_10: {
    name: "冥府",
    gloss: { EN: "The Underworld", KO: "저승", JA: "冥府", ZH_CN: "冥府", ZH_TW: "冥府" },
    roster: { normal: ["呪", "斬", "妖", "虎", "牙", "骸", "鎌"], elite: ["嵐", "怨"], boss: "冥" }
  },
  depth_11: {
    name: "獣王廟",
    gloss: { EN: "The Beast King's Tomb", KO: "짐승왕의 사당", JA: "獣王の廟", ZH_CN: "兽王庙", ZH_TW: "獸王廟" },
    roster: { normal: ["狼", "狐", "屍", "鷲", "豹", "猪", "鰐", "鮫"], elite: ["焔", "兇"], boss: "龍" }
  },
  depth_12: {
    name: "奈落",
    gloss: { EN: "The Abyss", KO: "나락", JA: "奈落の底", ZH_CN: "无底深渊", ZH_TW: "無底深淵" },
    roster: { normal: ["巫", "蟲", "咒", "祟", "詛", "獰", "蠱"], elite: ["傀儡", "髑髏", "殲"], boss: "饕餮" }
  }
};

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
  return [...r.normal, ...r.elite, r.boss];
}
