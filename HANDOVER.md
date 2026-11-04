# KANJI DUNGEON 【漢字地獄】 — AI Handover Spec (v1.0 Static Web)

## 1. Project Architecture
- **Live Domain Target:** `https://kanji.syscross.dev` (Hosted on Vercel via GitHub `syscross/kanji_dungeon`, DNS via Cloudflare).
- **100% Static BYOK Architecture:** Zero backend server. Pure `index.html` + `kanken_data.json` + `manifest.json` + `vercel.json`.
- **DO NOT read or paste `kanken_data.json` into LLM context:** It contains all 12 Kanken levels (`depth_1` = Level 10 through `depth_12` = Level 1, 6,355 Kanji total). Schema per key: `{ title, count, enemies: [...], kanji: [...] }`.

## 2. Implemented Core Mechanics in `index.html`
1. **4 Slash Commands (`parseInputCommand`):**
   - `/hint` (No-arg; ignores trailing text, free briefing without ending turn)
   - `/reroll` (No-arg; ignores trailing text, costs 5 HP to redraw 5 cards without ending turn)
   - `/prompt <arg>` (Requires arg; asks GM about specific Kanji/strategy without ending turn)
   - `/summon [optional arg]` (Escalating HP cost within a battle round: `10 -> 20 -> 30...`, resets to `10` when advancing to the next enemy in the streak)
2. **3 Instruction Modes & Separate Leaderboards (`localStorage`):**
   - `Default` (Read-only official rules), `Custom` (Official + user patch), `Sandbox` (Full custom rules).
   - Endless Survival Streak: Defeating an enemy carries over remaining HP & `playerState` to the next enemy and records mode-specific high scores per Depth.
3. **Multi-Provider Direct Browser Calls (`callLLM`):**
   - Supports `gemini`, `anthropic` (with `anthropic-dangerous-direct-browser-access: true`), and `openrouter`, plus custom model ID input (`claude-haiku-5-5`, `gemini-flash-lite-latest`, etc.).
