/*
 * All combat numbers live here. The GM classifies a turn (verdict, effect levels,
 * escape outcome, and optional rule-breaking triggers); this file turns that
 * classification into HP changes.
 */

const HAND_SIZE = 5;
const STARTING_DECK_SIZE = 0; // Runs start empty-handed; stage cards supply the initial fight
const STARTING_MAX_HP = 100;
const REROLL_HP_COST = 5;
const SUMMON_COST_STEP = 10;

const VERDICTS = ["FIZZLE", "WEAK", "SOLID", "CLEVER", "MASTERFUL"];
const VERDICT_LABELS = {
  FIZZLE: "不発 FIZZLE", WEAK: "凡 WEAK", SOLID: "良 SOLID", CLEVER: "妙 CLEVER", MASTERFUL: "絶 MASTERFUL"
};

/* Damage dealt by verdict (only when the move attacks). */
const VERDICT_DAMAGE = { FIZZLE: [0, 0], WEAK: [7, 13], SOLID: [15, 24], CLEVER: [26, 36], MASTERFUL: [40, 58] };

/* Healing by level; "major" needs at least SOLID, MASTERFUL adds a bonus. */
const HEAL_RANGE = { none: [0, 0], minor: [7, 12], major: [15, 24] };

const ENEMY_HP = { normal: 60, elite: 90, boss: 140 };
const RANK_DAMAGE_MULT = { normal: 1, elite: 1.22, boss: 1.4 };
const RANK_MARK = { normal: "", elite: "強", boss: "主" };

/*
 * Enemy counterattack baseline before rank/intent/defense modifiers.
 * Deeper gaols (especially 7-12) hit with horror-game lethality if telegraphed intents are ignored.
 */
function enemyCounterBaseline(depthId) {
  const d = depthNumber(depthId);
  const abyssBoost = d >= 11 ? 9 : d >= 7 ? 4 : 0;
  const min = 5 + d + abyssBoost;
  return { min, max: min + 6 + Math.floor(d / 3) };
}

const atLeast = (verdict, floor) => VERDICTS.indexOf(verdict) >= VERDICTS.indexOf(floor);

/* j: normalized judgment ({ verdict, attack, heal, defense, escape }). Returns concrete numbers. */
function resolveTurnNumbers(j) {
  const [dMin, dMax] = VERDICT_DAMAGE[j.verdict];
  let enemyDamage = j.attack ? randInt(dMin, dMax) : 0;

  let healLevel = j.verdict === "FIZZLE" ? "none" : j.heal;
  if (healLevel === "major" && !atLeast(j.verdict, "SOLID")) healLevel = "minor";
  let heal = randInt(...HEAL_RANGE[healLevel]);
  if (heal && j.verdict === "MASTERFUL") heal += 8;

  let defense = j.verdict === "FIZZLE" ? "none" : j.defense;
  if (defense === "full" && !atLeast(j.verdict, "CLEVER")) defense = "partial";

  const base = enemyCounterBaseline(state.depthId);
  let counter = randInt(base.min, base.max) * RANK_DAMAGE_MULT[state.enemyRank];

  // Check enemy's telegraphed Intent Kanji (`state.enemyHand`)
  const primaryIntent = (state.enemyHand && state.enemyHand[0]) || "";
  const hasLethalIntent = (state.enemyHand || []).some(k => typeof LETHAL_INTENTS !== "undefined" && LETHAL_INTENTS.has(k));
  const isCountdownPrep = primaryIntent === "三" || primaryIntent === "二" || primaryIntent === "兆" || primaryIntent === "号";

  if (isCountdownPrep) {
    counter *= 0.35; // Ominous countdown turn before the storm
  } else if (hasLethalIntent && defense === "none") {
    counter *= 1.65; // Ignoring a telegraphed execution/heavy intent is devastating!
  }

  // Escape resolution
  if (j.escape === "success") {
    counter = 0;
  } else if (j.escape === "costly") {
    counter *= 0.55;
  } else if (j.escape === "failed") {
    counter *= 1.15;
  } else {
    if (j.verdict === "FIZZLE") counter *= 1.45;
    else if (defense === "partial") counter *= 0.45;
    else if (defense === "full") counter = 0;
  }

  return { enemyDamage, heal, playerDamage: Math.round(counter), defense };
}
