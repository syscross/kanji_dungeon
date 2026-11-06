# KANJI DUNGEON 【漢字地獄】 — Handover Spec (Static Web)

Design rules and roadmap live in `GUIDELINE.md` — read that first. This file is the map of the code as it is.

## 1. Architecture
- **Live:** `https://kanjidungeon.vercel.app` (Vercel, GitHub `syscross/kanji_dungeon`, deploys `main`). Installable PWA; `sw.js` is network-first, so deploys show up immediately. Script tags carry a `?v=` cache-buster — bump it when shipping.
- **100% static, BYOK, no build step.** `index.html` + classic `<script>` files sharing globals. Load order is at the bottom of `index.html` (i18n → data → core → ai → fx → ui → game → main).
- **Do NOT read or paste `kanken_data.json` into LLM context.** 12 Kanken levels (`depth_1` = Level 10 … `depth_12` = Level 1, 6,355 kanji). Only the `kanji` pools are used at runtime; everything that makes a depth a place lives in `js/data/`.
- `tools/judge-test.mjs` — prompt harness (Node, OpenRouter). `public/assets/aistudio/*.png` are stray screenshots (safe to delete).

## 2. File map
```
index.html, sw.js, manifest.json, icons/, vercel.json, package.json (dev server only)
css/base.css            tokens, app shell, buttons, dropdowns, modals, toasts, forms
css/screens.css         top bar, title, gaol select + entry modal, settings / guide / achievements, picker, special items
css/battle.css          battle screen, phases, fork/option buttons, log cards, scavenge dock, rank mark, foe reveal

js/i18n/index.js        I18N registry, t(), pickLang(), applyLocalization()
js/i18n/{en,ko,ja,zh-cn,zh-tw}.js   UI strings (EN is the fallback)

js/data/depths.js       DEPTHS: name, gloss, lore, roster {normal, elite, boss, bossPool}, abyss warnings (11–12);
js/data/pool-policy.js  STAGE_ONLY_KANJI (prefecture-only kanji: stage names, never cards), CARD_EXCLUDE (radicals),
                        PLAYABLE_POOLS (optional /kanken_curated.json), isPlayableKanji(), playableDepthPool()
                        KANJI_DEPTH_MAP / getKanjiDepthNum / getKanjiTier (edu | common | abyss); kankenLabel()
js/data/stages.js       STAGE_SIGNS (omen, cards, foes, outcomes, risky) · DEPTH_STAGE_POOLS · DEPTH_ESCAPE_INTENTS ·
                        DEPTH_INTENT_POOLS · FOE_INTENT_PROFILES (normal / countdown) · FOE_ENCOUNTER_LINES · FOE_NAMES ·
                        intent classes (LETHAL/EVADE/CURSE/ESCAPE/COUNTDOWN) · INTENT_KANJI_MEANINGS (KO only) ·
                        buildEnemyIntentDetail() · RANDOM_EVENT_POOL · PATH_STEPS=9 · FORK_WIDTH=3
js/data/rewards.js      spoils 回 壮 召 替 探 焚 合 with per-tier params
js/data/events.js       QUIZ_BANK (AI-free reading quiz) + EVENTS (quiz rest forge shrine well flower corpse stranger swarm dice mirror lantern cat_rescue)
js/data/guide.js        guide pages (KO/EN/JA)
js/data/achievements.js common achievements, per-gaol templates, legacy id map

js/core/state.js        config (+ story state), createRunState(), persistence (arcade / story runs), records, helpers

js/ai/providers.js      PROVIDERS + callLLM() + parseJsonSafe(); "offline" / "free_keyless" / "custom" need no key
js/ai/gm.js             DEFAULT_GM_RULES, GM_LATITUDE, buildJudgePrompt / buildSummonDirective / buildFleeDirective /
                        buildHintPrompt / buildQuestionPrompt, normalizeJudgment()
js/ai/local-engine.js   offline judge (counts written hand kanji; handles summon / flee / escape crudely)

js/game/rules.js        ALL combat numbers: verdict damage, kill thresholds, heal, enemy HP, rank mult, RANK_MARK,
                        counter baseline by depth, intent multipliers, escape outcomes, brutal crit
js/game/deck.js         buildStageCards() (10 env cards), draw pile = stage + bag, dealEnemyHand() (intents, escape intent),
                        cardChoices / foeScavengeChoices / scavengeChoices
js/game/run.js          startRun (arcade + story), renderPhase(), forks (generateFork), enterNode, advance,
                        pickEnemyForStage (boss ambush, cleared stages), startBattle (omen → cinematic reveal → fight), resume / pause / abandon
js/game/battle.js       slash commands (/hint /reroll /prompt /summon /flee), judged turns, applySpecialEvent,
                        applyTurnResult (escape, enemy escape, death, talisman), onEnemyDefeated, log export
js/game/effects.js      effect interpreter (hp, healPct, maxHp, freeSummons, tokens, yen, reveal, scavenge, foeScavenge,
                        addCard, burn, dup, fuse, offerSpoils, bossClear, returnGaol, ambushNpc, battle, chance, say);
                        inline scavenge dock, fuse picker, pending picks persist in state.pending
js/game/rewards.js      spoils offer / choose / skip
js/game/events.js       event start, options, quiz handling
js/game/beats.js        kill stamp, boss clear beat, clear / death / return cards, records, endRunDock
js/game/story.js        story mode: village (depth_0) spots & NPCs, special items (talismans), yen, endings, bag persistence
js/game/achievements.js catalog build, unlock + hooks, achievements modal

js/ui/dom.js            toasts, markdown-lite, modals, view transitions, gaol entry cinematic, dropdowns, exit prompts
js/ui/hud.js            HUD, run roster bar, cards (tier colours, source badges), run log, dock actions, FX, judging spinner
js/ui/picker.js         picker modal (picks, bag viewer with special items, stage cards viewer)
js/ui/screens.js        title banners, guide, depth select (locks, records), depth entry modal, abyss confirm
js/ui/settings.js       settings modal, provider / model presets, save export / import / wipe
js/ui/viewport.js       visible-viewport sizing (--app-h, body.kb-open) for on-screen keyboards
js/ui/keyboard.js, connect.js, install.js
js/main.js              bootstrap + #battle / #select restore on refresh
```

## 3. A descent (run)
- Choose a gaol (entry modal with lore; 11–12 need an extra confirm) → **step 1 is a fork** (no starting deck; the bag is empty in arcade, carried over in story).
- At each fork: three stage signs from `DEPTH_STAGE_POOLS[depth]`; outcomes are rolled when the fork is generated. Entering a stage builds **10 environment cards** (`STAGE_SIGNS[sign].cards` within grade + depth pool). A 寺/堂/祠 is forced before the boss. "【帰】 return" is always offered at a fork.
- Depth 4 stages are prefecture names (茨城 新潟 栃木 大阪 岐阜 宮城 + 街); `state.sign` may be 2 kanji there (CSS `.multi`).
- Fights: `startBattle` → omen beat → curtain reveal → fight. Hand = 5 random from stage cards + bag. The foe telegraphs 1–2 **single** intent kanji; the engine locks a description (`state.enemyIntentDesc`) and type (`normal_attack | lethal_attack | countdown_prep | guard_counter | curse_bind | escape`).
- Foes at ≤38% HP may try to flee (once); if not blocked they leave with their HP remembered (`woundedEnemies`) and no spoils. The run's boss can ambush from step 4 on risky/haunted stages.
- After a kill: scavenge from 5 candidates, keep `SCAVENGE_LIMIT` (1 normal / 2 elite / 3 boss) → spoils (3 of 7, skippable). `addCardToDeck` refuses non-playable kanji. Step 9 (or an early ambush win) is the boss → clear record (time, turns, HP, kills, deck size, provider/model, mode, offline share) → continue expedition / finish.
- `state.phase` ∈ path | battle_encounter_omen | battle_encounter_ready | battle | reward | event | cleared | dead | abandoned | returned (draft is legacy). `renderPhase()` rebuilds the screen from state; card picks persist in `state.pending`.
- Story mode: `config.story.sectorTime[depthId]` accumulates the clock per gaol (re-entering continues it); Sensei's tea and the cat's blessing are once per expedition.
- Storage keys: `kd_saved_run` (arcade), `kd_saved_story_run`, `kd_story_state`, `kd_records`, `kd_achievements`, `kd_seen_foes`, `kd_stats`, `kd_keys`… (`STORAGE` in state.js). `RUN_VERSION` = 3.

## 4. Judging contract (current)
- GM classifies: `card_roles` (per hand card), `verdict` (FIZZLE WEAK SOLID CLEVER MASTERFUL), `attack`, `heal` (none/minor/major), `defense` (none/partial/full), `escape` (none/success/costly/failed), `special_event` (TIME_REWIND / INSTANT_PACIFY / STEAL_KANJI / MUTATE_ENEMY + `mutated_kanji`), `god_chant` (summon), narration and three state strings.
- `rules.js` turns that into numbers. The prompt tells the GM the exact HP thresholds at which each verdict kills, so the narration matches the arithmetic.
- Kanji-only input is a legitimate incantation (real compounds / fused images). Player input is wrapped in `<move>`; rule-changing requests are FIZZLE.
- `/summon [direction]`: 10 HP (or a free token); the GM composes the move from the hand. `/flee [how]`: judged escape.
- Prompt size today ≈ 8.8k chars ≈ 2.3k tokens (Gemini) / 3.5k (Claude). Target in GUIDELINE §6 is ≤ 1.5k.

## 5. Providers
- Dropdown order: Gemini → Claude → OpenAI → DeepSeek → Groq → xAI → OpenRouter → Local → Trial → No AI.
- Claude direct: no sampling params, `output_config.effort: "low"`, text block picked out of `content`.
- OpenRouter path (generic OpenAI-compatible): sends `temperature`, no `max_tokens`, no `reasoning`. Claude Haiku 5.5 via OpenRouter accepts `temperature` and spends ~300–1,100 reasoning tokens per turn on the current prompt (`reasoning: { effort: "low" }` is accepted by both Gemini and Claude; `enabled: false` is rejected by Gemini).
- Trial (`free_keyless`): pollinations, ~1 reply / 45 s per IP, falls back to the offline judge.

## 6. Known issues / debt (2026-11-06)
- Intent meanings (`INTENT_KANJI_MEANINGS`) and several omen/encounter fallbacks are Korean-only and are injected into the prompt regardless of UI language.
- Intents were converted to single kanji mechanically (last char of the old compound, within grade); a few profiles still carry a kanji above the depth's grade (卒/突, 隊/囲, 毒/痛) — `dealEnemyHand` filters those out at runtime.
- Rosters 7–12 were renamed to single kanji; saved story progress (`defeatedBosses`, `gaolBosses`) from before 2026-11-06 still holds the old compound names and will not match.
- `COUNTDOWN_PREP_INTENTS` still lists old compound strings; only 三 二 兆 号 trigger the prep turn now.
- Weak models (gemini flash-lite) hand out CLEVER + `defense: "full"` for almost any coherent sentence — see harness baseline; the contract needs the "name the intent kanji" rule (GUIDELINE §6).
- `depth_12` pool includes radicals / components with no standalone meaning.
- Random `brutalCrit` (25%, ×1.6) is unannounced damage variance.
- `summonCost` escalation was removed (flat 10 HP); `fxSummonReset` strings remain for compatibility.
- Scavenge offers "take all 5" after every fight → bag bloat; no bag cap.
- Harness baseline (KO, 15 scenarios, 2026-11-06): flash-lite 15/15, Haiku 15/15 after the output cap was raised to 4k.
