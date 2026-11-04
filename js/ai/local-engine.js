/*
 * Offline fallback GM used when the free public endpoint is unavailable.
 * Mirrors the judge JSON contract (see js/ai/gm.js) with simple literal-match heuristics.
 */
function localKanjiEngine(expectJson) {
  const hand = state.playerHand;
  const boss = state.enemyKanji;
  if (!expectJson) {
    return t("leHint")(hand.join(" · "), state.enemyHand.join(" · "), boss);
  }

  const raw = state._lastRawInput || "";
  const used = hand.filter(k => raw.includes(k));
  const enemyPick = state.enemyHand[Math.floor(Math.random() * state.enemyHand.length)] || boss;
  const baseline = enemyCounterBaseline(state.depthId);
  // Whatever is left once hand Kanji, whitespace and punctuation are stripped = the actual "action".
  const narrative = hand.reduce((s, k) => s.split(k).join(""), raw).replace(/[\s\p{P}\p{S}]/gu, "");

  if (used.length === 0 || narrative.length < 4) {
    return {
      _offline: true,
      used_kanji: [],
      reason: "no meaningful card use",
      verdict: "FIZZLE",
      enemy_damage_taken: 0,
      player_heal: 0,
      player_damage_taken: Math.round(baseline.max * 1.3),
      gm_judgment: used.length === 0 ? t("leNoCard")(hand.join(", ")) : t("leDump"),
      enemy_action: t("leCounter")(boss, enemyPick),
      new_field_state: state.fieldState,
      new_player_state: "Off-Balance",
      new_enemy_state: "Aggressive"
    };
  }

  const verdict = used.length >= 4 ? "CLEVER" : used.length >= 2 ? "SOLID" : "WEAK";
  const band = VERDICT_DAMAGE_HINT[verdict];
  const dmg = band.min + Math.floor(Math.random() * (band.max - band.min + 1));
  const eDmg = Math.max(0, baseline.min + Math.floor(Math.random() * (baseline.max - baseline.min + 1)) - used.length * 2);

  return {
    _offline: true,
    used_kanji: used,
    reason: `${used.length} card(s) used literally`,
    verdict,
    enemy_damage_taken: dmg,
    player_heal: 0,
    player_damage_taken: eDmg,
    gm_judgment: t("leHit")(used.join(" · "), boss),
    enemy_action: t("leCounter")(boss, enemyPick),
    new_field_state: `${used[0]} × ${enemyPick}`,
    new_player_state: verdict === "CLEVER" ? "Empowered" : "Focused",
    new_enemy_state: dmg >= 30 ? "Staggered" : "Hostile"
  };
}
