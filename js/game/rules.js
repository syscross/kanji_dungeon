/*
 * All combat numbers live here. The GM only classifies a turn (verdict + effect levels);
 * this file turns that classification into HP changes, so every model — weak or strong,
 * or the offline engine — plays by the same arithmetic.
 */

const HAND_SIZE = 5;
const STARTING_DECK_SIZE = 8;
const STARTING_MAX_HP = 100;
const REROLL_HP_COST = 5;
const SUMMON_COST_STEP = 10;

const VERDICTS = ["FIZZLE", "WEAK", "SOLID", "CLEVER", "MASTERFUL"];
const VERDICT_LABELS = {
  FIZZLE: "不発 FIZZLE", WEAK: "凡 WEAK", SOLID: "良 SOLID", CLEVER: "妙 CLEVER", MASTERFUL: "絶 MASTERFUL"
};

/* Damage dealt by verdict (only when the move attacks). */
const VERDICT_DAMAGE = { FIZZLE: [0, 0], WEAK: [6, 12], SOLID: [14, 22], CLEVER: [24, 34], MASTERFUL: [38, 55] };

/* Healing by level; "major" needs at least SOLID, MASTERFUL adds a bonus. */
const HEAL_RANGE = { none: [0, 0], minor: [6, 10], major: [14, 22] };

const ENEMY_HP = { normal: 60, elite: 90, boss: 140 };
const RANK_DAMAGE_MULT = { normal: 1, elite: 1.2, boss: 1.35 };
const RANK_MARK = { normal: "", elite: "強", boss: "主" };

/* Enemy counterattack before rank/defense modifiers: gaol 1 → 6–11 … gaol 12 → 17–22. */
function enemyCounterBaseline(depthId) {
  const min = 5 + depthNumber(depthId);
  return { min, max: min + 5 };
}

const atLeast = (verdict, floor) => VERDICTS.indexOf(verdict) >= VERDICTS.indexOf(floor);

/* j: normalized judgment ({ verdict, attack, heal, defense }). Returns concrete numbers. */
function resolveTurnNumbers(j) {
  const [dMin, dMax] = VERDICT_DAMAGE[j.verdict];
  const enemyDamage = j.attack ? randInt(dMin, dMax) : 0;

  let healLevel = j.verdict === "FIZZLE" ? "none" : j.heal;
  if (healLevel === "major" && !atLeast(j.verdict, "SOLID")) healLevel = "minor";
  let heal = randInt(...HEAL_RANGE[healLevel]);
  if (heal && j.verdict === "MASTERFUL") heal += 8;

  let defense = j.verdict === "FIZZLE" ? "none" : j.defense;
  if (defense === "full" && !atLeast(j.verdict, "CLEVER")) defense = "partial";

  const base = enemyCounterBaseline(state.depthId);
  let counter = randInt(base.min, base.max) * RANK_DAMAGE_MULT[state.enemyRank];
  if (j.verdict === "FIZZLE") counter *= 1.5;
  else if (defense === "partial") counter *= 0.5;
  else if (defense === "full") counter = 0;

  return { enemyDamage, heal, playerDamage: Math.round(counter), defense };
}
