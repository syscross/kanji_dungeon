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
    params: { normal: { n: 1 }, elite: { n: 2 } },
    label: {
      EN: p => `Summon — Free God +${p.n}`, KO: p => `강림 — 무료 고신 +${p.n}`, JA: p => `降臨 — 無料古神 +${p.n}`,
      ZH_CN: p => `降临 — 免费古神 +${p.n}`, ZH_TW: p => `降臨 — 免費古神 +${p.n}`
    }
  },
  tokens: {
    kanji: "替",
    params: { normal: { n: 2 }, elite: { n: 3 } },
    label: {
      EN: p => `Shuffle — Free Reroll +${p.n}`, KO: p => `교체 — 무료 리롤 +${p.n}`, JA: p => `交替 — 無料引き直し +${p.n}`,
      ZH_CN: p => `交替 — 免费重抽 +${p.n}`, ZH_TW: p => `交替 — 免費重抽 +${p.n}`
    }
  },
  card: {
    kanji: "探",
    params: { normal: { choices: 5 }, elite: { choices: 5 } },
    label: {
      EN: () => "Explore — claim stage kanji",
      KO: () => "탐사 — 스테이지 한자 획득",
      JA: () => "探索 — ステージ漢字を獲得",
      ZH_CN: () => "探索 — 获取场地汉字",
      ZH_TW: () => "探索 — 獲取場地漢字"
    }
  },
  burn: {
    kanji: "焚",
    params: { normal: {}, elite: {} },
    when: s => s.deck.length > 0,
    label: {
      EN: () => "Burn — discard 1 kanji", KO: () => "소각 — 한자 1장 버리기", JA: () => "焚書 — 漢字を1枚捨てる",
      ZH_CN: () => "焚字 — 舍弃 1 张汉字", ZH_TW: () => "焚字 — 捨棄 1 張漢字"
    }
  },
  fuse: {
    kanji: "合",
    params: { normal: {}, elite: {} },
    when: s => s.deck.length >= 2,
    label: {
      EN: () => "Fuse — combine 2 kanji", KO: () => "합자 — 한자 2장 합체", JA: () => "合字 — 漢字2枚を合体",
      ZH_CN: () => "合字 — 合并 2 张汉字", ZH_TW: () => "合字 — 合併 2 張漢字"
    }
  }
};

/* How many spoils are offered. Treasure rooms use the elite tier. */
const REWARD_OFFER_COUNT = 3;
