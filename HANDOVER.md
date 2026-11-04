# KANJI DUNGEON 【漢字地獄】 — Handover Spec (Static Web)

## 1. Architecture
- **Live:** `https://kanjidungeon.vercel.app` (Vercel, GitHub `syscross/kanji_dungeon`). Installable PWA.
- **100% static, BYOK, no build step.** `index.html` + classic `<script>` files sharing globals. Load order is listed (and commented) at the bottom of `index.html`.
- **Do NOT read or paste `kanken_data.json` into LLM context.** 12 Kanken levels (`depth_1` = Level 10 … `depth_12` = Level 1, 6,355 kanji). Only the `kanji` pools are used; names and enemies come from `js/data/depths.js`.

## 2. File map
```
index.html, sw.js, manifest.json, icons/
css/base.css            tokens, app shell, buttons, dropdowns, modals, toasts, forms
css/screens.css         top bar, title, gaol select, settings / guide / achievements / picker
css/battle.css          battle screen, phases (intermission / run-over), fork & option buttons, log cards

js/i18n/index.js        I18N registry, t(), pickLang(), applyLocalization()
js/i18n/{en,ko,ja,zh-cn,zh-tw}.js   UI strings, one file per language (EN is the fallback)

js/data/depths.js       the 12 gaols: name, gloss, roster {normal, elite, boss}; kankenLabel()
js/data/stages.js       fork signs (道 山 門 花 寺 井 墓 蔵 闇 謎) → weighted outcomes; PATH_STEPS
js/data/rewards.js      spoils (回 壮 召 替 札 焚) with per-tier params
js/data/events.js       path events (寺 祠 井 花 屍 蟲 賽 鏡 灯) as pure effect specs
js/data/guide.js        guide pages (KO/EN/JA)
js/data/achievements.js common achievements, per-gaol templates, legacy id map

js/core/state.js        config, run state shape (createRunState), persistence, records, helpers

js/ai/providers.js      PROVIDERS + callLLM(); "offline" and "free_keyless" never need a key
js/ai/gm.js             GM contract (DEFAULT_GM_RULES), prompt builders, normalizeJudgment()
js/ai/local-engine.js   offline judge (counts written hand kanji, says so honestly)

js/game/rules.js        ALL combat numbers: verdict → damage, heal, defense, enemy HP, counters
js/game/deck.js         deck / draw pile / discard, draft offers, card choices
js/game/run.js          run lifecycle, renderPhase(), forks, startBattle(), resume / pause / abandon
js/game/battle.js       slash commands, judged turns, applyTurnResult(), kill handling, log export
js/game/effects.js      effect interpreter for spoils and events (incl. persisted card picks)
js/game/rewards.js      spoils offer / choose
js/game/events.js       event start / options
js/game/beats.js        kill stamp, clear card (+ record), death card
js/game/achievements.js catalog build, unlock + hooks, achievements modal

js/ui/dom.js            toasts, markdown-lite, modals (locked modals ignore ESC), views, dropdowns
js/ui/hud.js            HUD, cards, the run log (logMd / logBeat / replay), dock actions, FX
js/ui/picker.js         one modal for draft, card picks, deck viewer
js/ui/viewport.js       visible-viewport sizing for on-screen keyboards
js/ui/keyboard.js, settings.js, connect.js, install.js, screens.js
js/main.js              bootstrap + #battle / #select restore on refresh
```

## 3. A descent (run)
- Choose a gaol → **starting deck** of 10 kanji (redraw all, unlimited; ✕ backs out) → step 1 is a fight.
- Steps 2–8: a **fork** of three sign kanji. Outcomes are rolled when the fork is generated and stay hidden unless revealed (灯 event). A 寺 is guaranteed before the boss.
- Step 9: the gaol's **boss**. Winning records a clear (time, turns, HP, kills, deck size, **provider/model**, mode, offline-turn share).
- After a normal/elite win: choose one of 3 **spoils** or leave it. Treasure rooms use the elite tier.
- `state.phase` ∈ draft | path | battle | reward | event | cleared | dead. `renderPhase()` rebuilds the screen from state, so any moment survives a reload (card picks persist in `state.pending`).
- The log is never wiped between runs; each run's entries are kept in `state.history` and replayed after a reload.

## 4. Judging contract
- The GM **classifies, never counts**: `card_roles` (role or null per hand card), `verdict`, `attack`, `heal` (none/minor/major), `defense` (none/partial/full), `enemy_used_kanji`, narration.
- `js/game/rules.js` turns that into numbers (verdict damage bands, heal ranges, defense multipliers, rank multipliers, depth-scaled counterattacks). Change balance there.
- Kanji-only input is a legitimate **incantation**: real compounds / fused images are full moves; random strings fizzle.
- Ancient god (`/summon [direction]`): the GM composes the move from the player's hand; cost escalates for the whole run (10, 20, 30…), reset by 召 / 寺 / 鏡.
- The prompt has a strict contract (for weak models) plus a latitude paragraph (for strong ones).
- Player input is wrapped in `<move>` tags; rule-changing requests are FIZZLE.

## 5. Achievements
- **Common** (`COMMON_ACHIEVEMENTS`), **per gaol** (`d<n>_kill|clear|flawless|purge`), **bestiary** (`boss_<kanji>` for every roster kanji).
- Stored as `{ id: timestamp }` in `kd_achievements`; ids not in the catalog are ignored.

## 6. Providers
- Dropdown order: Gemini (recommended) → Claude → OpenAI → DeepSeek → Groq → xAI → OpenRouter → Local → Trial → No AI.
- Claude: no sampling params (current models reject them), `output_config.effort: "low"`, the text block is picked out of `content` (thinking blocks may come first).
- Trial (`free_keyless`): pollinations, ~1 reply / 45 s per IP, falls back to the offline judge (`🔌` in the log, and in records when >50% of turns were offline).

## 7. Known limits
- The trial model is weak: it often misses native-word meanings and ignores the output language.
- Non-Anthropic model presets may go stale; any model ID can be typed in.
- Event and guide text: KO / EN / JA (Chinese falls back to EN).
