/*
 * Path signs. At each fork the player picks a sign kanji; the sign hints at what lies
 * beyond but does not promise it. Outcomes are rolled when the fork is generated
 * (so saves are deterministic) and stay hidden unless revealed (e.g. by the 灯 event).
 *
 * outcome kinds: "battle" | "elite" | "treasure" | "event:<id>" | "event:*" (random event)
 */

const STAGE_SIGNS = {
  道: { omen: { EN: "a beaten path", KO: "다져진 길", JA: "踏み固められた道", ZH_CN: "踩实的路", ZH_TW: "踩實的路" },
        outcomes: [["battle", 75], ["event:*", 25]] },
  山: { omen: { EN: "steep and high", KO: "험하고 높다", JA: "険しく高い", ZH_CN: "陡峭高耸", ZH_TW: "陡峭高聳" },
        outcomes: [["elite", 55], ["treasure", 25], ["battle", 20]], risky: true },
  門: { omen: { EN: "something guards it", KO: "무언가 지키고 있다", JA: "何かが守っている", ZH_CN: "有东西守着", ZH_TW: "有東西守著" },
        outcomes: [["elite", 50], ["battle", 50]], risky: true },
  花: { omen: { EN: "a sweet smell", KO: "달콤한 냄새", JA: "甘い匂い", ZH_CN: "甜腻的气味", ZH_TW: "甜膩的氣味" },
        outcomes: [["event:flower", 60], ["battle", 40]] },
  寺: { omen: { EN: "incense smoke", KO: "향 연기", JA: "香の煙", ZH_CN: "焚香的烟", ZH_TW: "焚香的煙" },
        outcomes: [["event:rest", 75], ["event:shrine", 25]] },
  井: { omen: { EN: "dripping water", KO: "물방울 소리", JA: "水の滴る音", ZH_CN: "滴水声", ZH_TW: "滴水聲" },
        outcomes: [["event:well", 100]] },
  墓: { omen: { EN: "freshly dug earth", KO: "갓 파헤친 흙", JA: "掘り返された土", ZH_CN: "新翻的土", ZH_TW: "新翻的土" },
        outcomes: [["battle", 50], ["event:corpse", 50]] },
  蔵: { omen: { EN: "a locked door", KO: "잠긴 문", JA: "閉ざされた扉", ZH_CN: "上锁的门", ZH_TW: "上鎖的門" },
        outcomes: [["treasure", 60], ["battle", 40]] },
  闇: { omen: { EN: "you cannot see", KO: "보이지 않는다", JA: "何も見えない", ZH_CN: "什么也看不见", ZH_TW: "什麼也看不見" },
        outcomes: [["battle", 40], ["elite", 20], ["event:*", 40]], risky: true },
  謎: { omen: { EN: "unknown", KO: "알 수 없다", JA: "分からない", ZH_CN: "未知", ZH_TW: "未知" },
        outcomes: [["event:*", 100]] }
};

/* Events that "event:*" can roll (rest is reserved for 寺 so it stays a reliable refuge). */
const RANDOM_EVENT_POOL = ["swarm", "dice", "mirror", "lantern", "shrine", "well", "corpse", "flower"];

/* Run shape: step 1 is always a fight, steps 2..PATH_STEPS-1 are forks, the last step is the boss. */
const PATH_STEPS = 9;
const FORK_WIDTH = 3;

/* Icons shown when a fork's outcome is revealed. */
const OUTCOME_ICONS = { battle: "⚔", elite: "💀", treasure: "🎁", event: "❔", rest: "🕯" };
