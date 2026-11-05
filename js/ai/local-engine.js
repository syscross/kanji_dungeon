/*
 * Offline GM — used for the "No AI" provider and whenever the trial server is busy.
 * It cannot read meaning, so it counts hand kanji written in the move and handles
 * offline escape attempts and ancient god summons cleanly.
 */
function localKanjiEngine(expectJson, opts = {}) {
  const hand = state.playerHand;
  const boss = state.enemyKanji;
  const intentInfo = state.enemyIntentDesc || state.enemyHand.join(" · ");
  if (!expectJson) return t("leHint")(hand.join(" · "), intentInfo, boss);

  const raw = state._lastRawInput || "";
  const summoning = Boolean(opts.summon);
  const fleeing = Boolean(opts.flee) || /(도주|도망|튀어|달아|피신|flee|escape|run away|逃げ)/i.test(raw);
  const blockingFlee = state.enemyEscapeIntent && /(막|차단|붙잡|포위|봉쇄|추격|묶|저지|block|trap|bind|chase|stop|封|止)/i.test(raw);

  // Even when summoning, the Ancient God's power depends on how well the hand cards align (simulated roll in offline mode)
  let used;
  let verdict;
  if (summoning) {
    const roll = Math.random();
    if (roll < 0.25) {
      used = hand.slice(0, 1);
      verdict = "WEAK";
    } else if (roll < 0.72) {
      used = hand.slice(0, 3);
      verdict = "SOLID";
    } else {
      used = [...hand];
      verdict = "CLEVER";
    }
  } else {
    used = hand.filter(k => raw.includes(k));
    const narrative = hand.reduce((s, k) => s.split(k).join(""), raw).replace(/[\s\p{P}\p{S}]/gu, "");
    if (used.length === 0) verdict = fleeing ? "WEAK" : "FIZZLE";
    else if (narrative.length < 2) verdict = used.length >= 2 ? "WEAK" : "FIZZLE";
    else verdict = used.length >= 4 ? "CLEVER" : used.length >= 2 ? "SOLID" : "WEAK";
  }

  let escape = "none";
  if (fleeing) {
    if (used.length >= 2) escape = "success";
    else if (used.length >= 1) escape = Math.random() < 0.7 ? "costly" : "failed";
    else escape = Math.random() < 0.35 ? "costly" : "failed";
  }

  let defense = "none";
  if (state.enemyEscapeIntent) {
    if (summoning && verdict !== "WEAK") defense = "full";
    else if (blockingFlee && used.length >= 1) defense = used.length >= 2 ? "full" : "partial";
    else if (used.length >= 3) defense = "partial";
  } else if (verdict === "CLEVER" || verdict === "MASTERFUL") {
    defense = "partial";
  }

  const willAttack = verdict !== "FIZZLE" && escape === "none";
  const killCap = typeof VERDICT_KILL_THRESHOLD !== "undefined" ? (VERDICT_KILL_THRESHOLD[verdict] || 0) : 0;
  const isKillingBlow = willAttack && state.enemyHp <= killCap;

  return {
    _offline: true,
    card_roles: Object.fromEntries(hand.map(k => [k, used.includes(k) ? "written in the move" : null])),
    god_chant: summoning ? `${used.join(" · ")} — ${t("leGodChant")(used.join(""), boss)}` : null,
    verdict,
    attack: willAttack,
    heal: "none",
    defense,
    escape,
    special_event: null,
    gm_judgment: verdict === "FIZZLE"
      ? (used.length === 0 ? t("leNoCard")(hand.join(", ")) : t("leDump"))
      : isKillingBlow
        ? t("leKill")(used.join(" · "), boss)
        : t("leHit")(used.join(" · "), used.length),
    enemy_used_kanji: [...state.enemyHand],
    enemy_action: state.enemyIntentDesc ? `${t("leCounter")(boss)} (${state.enemyIntentDesc})` : t("leCounter")(boss),
    new_field_state: state.fieldState,
    new_player_state: verdict === "FIZZLE" ? "Off-Balance" : "Focused",
    new_enemy_state: isKillingBlow ? "Slain" : state.enemyState
  };
}
