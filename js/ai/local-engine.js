/*
 * Offline GM — used for the "No AI" provider and whenever the trial server is busy.
 * It cannot read meaning, so it only counts hand kanji written in the move and says so
 * honestly. Same JSON contract as the real GM (see js/ai/gm.js), so the rules engine
 * treats both identically.
 */
function localKanjiEngine(expectJson, opts = {}) {
  const hand = state.playerHand;
  const boss = state.enemyKanji;
  if (!expectJson) return t("leHint")(hand.join(" · "), state.enemyHand.join(" · "), boss);

  const raw = state._lastRawInput || "";
  const summoning = Boolean(opts.summon);
  const used = summoning ? [...hand] : hand.filter(k => raw.includes(k));
  // Whatever remains once hand kanji, whitespace and punctuation are removed is the described action.
  const narrative = hand.reduce((s, k) => s.split(k).join(""), raw).replace(/[\s\p{P}\p{S}]/gu, "");

  let verdict;
  if (used.length === 0) verdict = "FIZZLE";
  else if (summoning) verdict = "SOLID";
  else if (narrative.length < 2) verdict = used.length >= 2 ? "WEAK" : "FIZZLE"; // bare incantation: meaning unknown offline
  else verdict = used.length >= 4 ? "CLEVER" : used.length >= 2 ? "SOLID" : "WEAK";

  return {
    _offline: true,
    card_roles: Object.fromEntries(hand.map(k => [k, used.includes(k) ? "written in the move" : null])),
    verdict,
    attack: verdict !== "FIZZLE",
    heal: "none",
    defense: "none",
    gm_judgment: verdict === "FIZZLE"
      ? (used.length === 0 ? t("leNoCard")(hand.join(", ")) : t("leDump"))
      : t("leHit")(used.join(" · "), used.length),
    enemy_used_kanji: [],
    enemy_action: t("leCounter")(boss),
    new_field_state: state.fieldState,
    new_player_state: verdict === "FIZZLE" ? "Off-Balance" : "Focused",
    new_enemy_state: state.enemyState
  };
}
