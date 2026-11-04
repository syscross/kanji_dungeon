/*
 * Offline GM — used for the "No AI" provider and whenever the trial server is busy.
 * It cannot read meaning, so it counts hand kanji written in the move and handles
 * offline escape attempts cleanly.
 */
function localKanjiEngine(expectJson, opts = {}) {
  const hand = state.playerHand;
  const boss = state.enemyKanji;
  if (!expectJson) return t("leHint")(hand.join(" · "), state.enemyHand.join(" · "), boss);

  const raw = state._lastRawInput || "";
  const summoning = Boolean(opts.summon);
  const fleeing = Boolean(opts.flee) || /(도주|도망|튀어|달아|피신|flee|escape|run away|逃げ)/i.test(raw);
  const used = summoning ? [...hand] : hand.filter(k => raw.includes(k));
  const narrative = hand.reduce((s, k) => s.split(k).join(""), raw).replace(/[\s\p{P}\p{S}]/gu, "");

  let verdict;
  if (used.length === 0) verdict = fleeing ? "WEAK" : "FIZZLE";
  else if (summoning) verdict = "SOLID";
  else if (narrative.length < 2) verdict = used.length >= 2 ? "WEAK" : "FIZZLE";
  else verdict = used.length >= 4 ? "CLEVER" : used.length >= 2 ? "SOLID" : "WEAK";

  let escape = "none";
  if (fleeing) {
    if (used.length >= 2 && narrative.length >= 2) escape = "success";
    else if (used.length >= 1) escape = Math.random() < 0.7 ? "costly" : "failed";
    else escape = Math.random() < 0.35 ? "costly" : "failed";
  }

  return {
    _offline: true,
    card_roles: Object.fromEntries(hand.map(k => [k, used.includes(k) ? "written in the move" : null])),
    verdict,
    attack: verdict !== "FIZZLE" && escape === "none",
    heal: "none",
    defense: "none",
    escape,
    special_event: null,
    gm_judgment: verdict === "FIZZLE"
      ? (used.length === 0 ? t("leNoCard")(hand.join(", ")) : t("leDump"))
      : t("leHit")(used.join(" · "), used.length),
    enemy_used_kanji: [...state.enemyHand],
    enemy_action: t("leCounter")(boss),
    new_field_state: state.fieldState,
    new_player_state: verdict === "FIZZLE" ? "Off-Balance" : "Focused",
    new_enemy_state: state.enemyState
  };
}
