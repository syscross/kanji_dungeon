/*
 * Spoils offered after a won fight (choose one or leave it).
 * Note: Stage card scavenging (up to 5 cards) already happens automatically after a fight;
 * these spoils provide additional recovery, max HP, extra card picks, or bag pruning.
 */

const REWARDS = {
  heal: {
    kanji: "回",
    params: { normal: { min: 14, max: 30 }, elite: { min: 25, max: 42 } },
    label: {
      EN: p => `Mend — HP +${p.min}~${p.max}`, KO: p => `회복 — HP +${p.min}~${p.max}`, JA: p => `回復 — HP +${p.min}~${p.max}`,
      ZH_CN: p => `回复 — HP +${p.min}~${p.max}`, ZH_TW: p => `回復 — HP +${p.min}~${p.max}`
    }
  },
  maxhp: {
    kanji: "壮",
    params: { normal: { n: 8 }, elite: { n: 14 } },
    label: {
      EN: p => `Fortify — Max HP +${p.n}`, KO: p => `강건 — 최대 HP +${p.n}`, JA: p => `壮健 — 最大HP +${p.n}`,
      ZH_CN: p => `强健 — 最大 HP +${p.n}`, ZH_TW: p => `強健 — 最大 HP +${p.n}`
    }
  },
  summon: {
    kanji: "召",
    params: { normal: {}, elite: {} },
    when: s => s.summonCost > 10,
    label: {
      EN: () => "Appease — summon cost back to 10", KO: () => "진혼 — 소환 비용 10으로", JA: () => "鎮魂 — 召喚コストを10に",
      ZH_CN: () => "镇魂 — 召唤消耗回到 10", ZH_TW: () => "鎮魂 — 召喚消耗回到 10"
    }
  },
  tokens: {
    kanji: "替",
    params: { normal: { n: 2 }, elite: { n: 3 } },
    label: {
      EN: p => `Shuffle — ${p.n} free rerolls`, KO: p => `교체 — 무료 리롤 ${p.n}회`, JA: p => `交替 — 無料引き直し${p.n}回`,
      ZH_CN: p => `交替 — 免费重抽 ${p.n} 次`, ZH_TW: p => `交替 — 免費重抽 ${p.n} 次`
    }
  },
  card: {
    kanji: "探",
    params: { normal: { choices: 5 }, elite: { choices: 5 } },
    label: {
      EN: p => `Explore Stage — scavenge stage kanji (up to ${p.choices})`,
      KO: p => `주변 추가 탐사 — 스테이지 한자 갈무리 (최대 ${p.choices}장)`,
      JA: p => `周辺探索 — ステージ漢字を追加回収 (最大${p.choices}枚)`,
      ZH_CN: p => `探索四周 — 拾取场地汉字 (最多 ${p.choices})`,
      ZH_TW: p => `探索四周 — 拾取場地漢字 (最多 ${p.choices})`
    }
  },
  burn: {
    kanji: "焚",
    params: { normal: {}, elite: {} },
    when: s => s.deck.length > 0,
    label: {
      EN: () => "Burn — remove a kanji from your bag", KO: () => "소각 — 챙긴 글자 하나 버리기", JA: () => "焚書 — 袋から字を一つ捨てる",
      ZH_CN: () => "焚字 — 从行囊移除一个字", ZH_TW: () => "焚字 — 從行囊移除一個字"
    }
  },
  fuse: {
    kanji: "合",
    params: { normal: {}, elite: {} },
    when: s => s.deck.length >= 2,
    label: {
      EN: () => "Fuse — combine 2 kanji in your bag into 1", KO: () => "합자(合字) — 챙긴 두 글자를 직접 합치기", JA: () => "合字 — 袋の二字を直接一つに合わせる",
      ZH_CN: () => "合字 — 将行囊中的两个字合二为一", ZH_TW: () => "合字 — 將行囊中的兩個字合二為一"
    }
  }
};

/* How many spoils are offered. Treasure rooms use the elite tier. */
const REWARD_OFFER_COUNT = 3;
