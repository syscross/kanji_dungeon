/*
 * All combat numbers live here. The GM classifies a turn (verdict, effect levels,
 * escape outcome, and optional rule-breaking triggers); this file turns that
 * classification into HP changes.
 */

const HAND_SIZE = 5;
const STARTING_DECK_SIZE = 0; // Runs start empty-handed; stage cards supply the initial fight
const STARTING_MAX_HP = 100;
const REROLL_HP_COST = 5;
const SUMMON_HP_COST = 10;
const SUMMON_COST_STEP = 0;

const VERDICTS = ["FIZZLE", "WEAK", "SOLID", "CLEVER", "MASTERFUL"];
const VERDICT_LABELS = {
  FIZZLE: "不発 FIZZLE", WEAK: "凡 WEAK", SOLID: "良 SOLID", CLEVER: "妙 CLEVER", MASTERFUL: "絶 MASTERFUL"
};

/* Damage dealt by verdict (only when the move attacks). */
const VERDICT_DAMAGE = { FIZZLE: [0, 0], WEAK: [10, 18], SOLID: [22, 34], CLEVER: [38, 52], MASTERFUL: [65, 95] };

/*
 * Exact Enemy HP threshold at or below which a verdict is GUARANTEED to be a finishing blow (막타).
 * Shared with buildJudgePrompt() in js/ai/gm.js so the GM always knows 100% whether its chosen
 * verdict kills the enemy this turn or leaves it alive!
 */
const VERDICT_KILL_THRESHOLD = { FIZZLE: 0, WEAK: 18, SOLID: 34, CLEVER: 52, MASTERFUL: 95 };

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
  // Brutal baseline: early gaols punish careless play with 15-28 dmg, abyss gaols 35-65+ dmg!
  const abyssBoost = d >= 11 ? 22 : d >= 7 ? 12 : 0;
  const min = 12 + d * 2 + abyssBoost;
  return { min, max: min + 10 + Math.floor(d * 1.5) };
}

const atLeast = (verdict, floor) => VERDICTS.indexOf(verdict) >= VERDICTS.indexOf(floor);

/* j: normalized judgment ({ verdict, attack, heal, defense, escape }). Returns concrete numbers. */
function resolveTurnNumbers(j) {
  const [dMin, dMax] = VERDICT_DAMAGE[j.verdict];
  let enemyDamage = j.attack ? randInt(dMin, dMax) : 0;

  // Synchronize with VERDICT_KILL_THRESHOLD so the GM's finishing-blow narration and the HP math never diverge!
  if (j.attack && state.enemyHp > 0) {
    const killCap = VERDICT_KILL_THRESHOLD[j.verdict] || 0;
    if (state.enemyHp <= killCap) {
      enemyDamage = Math.max(enemyDamage, state.enemyHp);
    } else {
      enemyDamage = Math.min(enemyDamage, state.enemyHp - 1);
    }
  }

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
    counter *= 2.2; // Devastating lethal intent ignoring!
  }

  // Escape resolution
  if (j.escape === "success") {
    counter = 0;
  } else if (j.escape === "costly") {
    counter *= 0.55;
  } else if (j.escape === "failed") {
    counter *= 1.15;
  } else {
    if (j.verdict === "FIZZLE") {
      counter *= 1.85; // Complete whiff leads to ruthless punishment
    } else if (defense === "partial") {
      counter *= 0.45;
    } else if (defense === "full") {
      counter = 0;
    } else if (defense === "none") {
      // Fear & Hunger style sudden brutal mutilation strike
      if (Math.random() < 0.25) {
        counter *= 1.6;
        j.brutalCrit = true;
      }
    }
  }

  return { enemyDamage, heal, playerDamage: Math.round(counter), defense };
}
