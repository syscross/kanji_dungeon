# KANJI DUNGEON 【漢字地獄】 — Handover Spec (Static Web)

## 1. Architecture
- **Live:** `https://kanjidungeon.vercel.app` (Vercel, GitHub `syscross/kanji_dungeon`).
- **100% static, BYOK, no build step.** `index.html` + plain `<script>` files sharing globals (load order in `index.html` matters).
- **Do NOT read or paste `kanken_data.json` into LLM context.** 12 Kanken levels (`depth_1` = Level 10 … `depth_12` = Level 1, 6,355 Kanji). Schema per key: `{ title, count, enemies: [...], kanji: [...] }`.

## 2. File map
```
css/base.css          tokens, app shell, buttons, dropdowns, modals, toasts, forms
css/screens.css       top bar, title, depth select, settings / guide / achievements
css/battle.css        battle screen (+ phone and `body.kb-open` keyboard layouts)
js/data/i18n.js       I18N strings (EN/KO/JA/ZH_CN/ZH_TW), t(), pickLang(), applyLocalization()
js/data/guide.js      guide pages (KO/EN/JA, others fall back to EN)
js/data/achievements.js  common achievement defs, depth templates, legacy id map
js/core/state.js      config (settings), run state, localStorage persistence, depth helpers
js/ai/providers.js    PROVIDERS list + callLLM(prompt, expectJson, {temperature})
js/ai/gm.js           GM rules, prompt builders, verdict bands, normalizeJudgment()
js/ai/local-engine.js offline fallback GM (used when the free endpoint fails)
js/fx/audio.js, js/fx/embers.js   procedural SFX, background particles
js/ui/dom.js          toasts, markdown-lite, modals, view switching, dropdowns
js/ui/hud.js          battle HUD, cards, GM log, combat FX, judging spinner
js/ui/viewport.js     visible-viewport sizing for on-screen keyboards (--app-h, kb-open)
js/ui/keyboard.js     desktop keyboard navigation
js/ui/settings.js     settings modal
js/ui/connect.js      trial mode detection, quick Gemini connect modal, run-start gate
js/ui/install.js      PWA install button (beforeinstallprompt / iOS instructions), SW registration
sw.js, manifest.json, icons/   PWA shell (network-first cache; cross-origin untouched)
js/ui/screens.js      title, guide, depth select, game over
js/game/achievements.js  catalog build, unlock + event hooks, achievements modal
js/game/run.js        start / spawn / deal / pause / resume / abandon
js/game/battle.js     slash commands, judged turns, applying results, log export
js/main.js            bootstrap
```

## 3. Judging contract (`js/ai/gm.js`)
- The GM judges only what the player wrote — it must not invent the player's tactics. Bare Kanji input (`bareKanjiDump`) is forced to FIZZLE.
- A card counts as used if written **or** invoked by meaning (native words count). The GM fills `card_roles` for every hand card (role or null) — this per-card check helps weak models.
- The enemy wields only enemy-hand Kanji (`enemy_used_kanji`, filtered in code) or attacks plainly with its own nature. Both hand and used cards are shown in the log.
- The GM returns a **verdict** (`FIZZLE | WEAK | SOLID | CLEVER | MASTERFUL`) plus numbers inside that verdict's band.
- `normalizeJudgment()` enforces per-verdict damage/heal caps (`VERDICT_DAMAGE_HINT[].cap`, `VERDICT_HEAL_CAP`), filters `used_kanji` to the hand, and fills defaults. FIZZLE always deals 0.
- Enemy counter baseline scales with depth (`enemyCounterBaseline`).
- Player input is wrapped in `<action>` tags; meta / rule-changing requests are FIZZLE.
- Rule modes: `Default` (official), `Custom` (official + user patch), `Sandbox` (user rules only). Output format is outside the rule body, so all modes keep the JSON contract.

## 4. Slash commands
`/hint` (free briefing), `/reroll` (−5 HP redraw), `/prompt <q>` (free question), `/summon [dir]` (HP cost 10 → 20 → 30…, resets per enemy; refunded if the API call fails).

## 5. Achievements
- **Common** (`COMMON_ACHIEVEMENTS`), **per depth** (`d<n>_kill|streak|flawless|purge`), **boss bestiary** (`boss_<kanji>`, generated from `enemies`).
- Stored as `{ id: timestamp }` in `kd_achievements`; total kills in `kd_stats`.
- Old ids `dog_slayer` / `heaven_defier` migrate to `boss_犬` / `boss_天`.

## 6. Trial mode vs. keys
- `free_keyless` = trial. Starting a run in trial mode opens the quick-connect modal once per session; the battle bar shows `🔌 Trial`; the first offline verdict in a run shows a connect CTA.

## 7. Known limits
- Trial endpoint (pollinations `openai`) allows ~1 reply / 45 s per IP and is a weak reasoning model (needs `max_tokens` headroom; often misses native-word meanings and ignores the output language). Excess turns fall back to the offline engine, marked `🔌 offline GM`.
