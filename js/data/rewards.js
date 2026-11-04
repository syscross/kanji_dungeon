/*
 * Spoils offered after a won fight (choose one or leave it).
 * Each reward: kanji (shown on the button), label(p) per language, params per tier,
 * and an optional `when(state)` filter. Effects are applied in js/game/rewards.js.
 */

const REWARDS = {
  heal: {
    kanji: "回",
    params: { normal: { min: 12, max: 30 }, elite: { min: 25, max: 40 } },
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
    kanji: "札",
    params: { normal: { choices: 3 }, elite: { choices: 4 } },
    label: {
      EN: p => `Inscribe — add a kanji (1 of ${p.choices})`, KO: p => `새김 — 글자 추가 (${p.choices}개 중 1)`, JA: p => `刻字 — 字を加える (${p.choices}択)`,
      ZH_CN: p => `刻字 — 加入一个字 (${p.choices} 选 1)`, ZH_TW: p => `刻字 — 加入一個字 (${p.choices} 選 1)`
    }
  },
  burn: {
    kanji: "焚",
    params: { normal: {}, elite: {} },
    when: s => s.deck.length > 5,
    label: {
      EN: () => "Burn — remove a kanji from your deck", KO: () => "소각 — 덱에서 글자 하나 제거", JA: () => "焚書 — デッキから字を一つ除く",
      ZH_CN: () => "焚字 — 从牌组移除一个字", ZH_TW: () => "焚字 — 從牌組移除一個字"
    }
  }
};

/* How many spoils are offered. Treasure rooms use the elite tier. */
const REWARD_OFFER_COUNT = 3;
