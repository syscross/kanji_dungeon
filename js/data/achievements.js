/*
 * Achievement definitions.
 *  - COMMON_ACHIEVEMENTS: hand-written, unlocked by game events (see js/game/achievements.js).
 *  - Depth achievements: generated per depth from DEPTH_ACHIEVEMENT_TEMPLATES.
 *  - Boss bestiary: generated per boss Kanji in kanken_data.json (id: "boss_<kanji>").
 * Names are kanji titles shared by every language; descriptions are localized.
 */

const COMMON_ACHIEVEMENTS = [
  { id: "first_blood", icon: "🩸", name: "初陣",
    desc: { EN: "Defeat your first enemy.", KO: "첫 적을 처치했다.", JA: "初めて敵を倒した。", ZH_CN: "击败第一个敌人。", ZH_TW: "擊敗第一個敵人。" } },
  { id: "full_hand", icon: "🖐️", name: "全札一体",
    desc: { EN: "Use all 5 hand cards in one spell (SOLID or better).", KO: "한 주문에 손패 5장을 모두 활용했다 (良 이상).", JA: "一度の呪文で手札5枚すべてを活かした (良以上)。", ZH_CN: "一次咒语用上全部5张手牌 (良以上)。", ZH_TW: "一次咒語用上全部5張手牌 (良以上)。" } },
  { id: "clever", icon: "🌀", name: "妙手",
    desc: { EN: "Earn a CLEVER verdict.", KO: "妙 CLEVER 판정을 받았다.", JA: "妙 CLEVER の裁定を得た。", ZH_CN: "获得妙 CLEVER 裁决。", ZH_TW: "獲得妙 CLEVER 裁決。" } },
  { id: "masterful", icon: "✨", name: "絶技",
    desc: { EN: "Earn a MASTERFUL verdict.", KO: "絶 MASTERFUL 판정을 받았다.", JA: "絶 MASTERFUL の裁定を得た。", ZH_CN: "获得绝 MASTERFUL 裁决。", ZH_TW: "獲得絕 MASTERFUL 裁決。" } },
  { id: "fizzle", icon: "💨", name: "不発",
    desc: { EN: "Have a spell fizzle. Everyone starts somewhere.", KO: "주문이 불발했다. 누구나 처음은 있다.", JA: "呪文が不発に終わった。誰にでも最初はある。", ZH_CN: "咒语失败了。谁都有第一次。", ZH_TW: "咒語失敗了。誰都有第一次。" } },
  { id: "summoner", icon: "🐉", name: "血盟召喚",
    desc: { EN: "Call a summon with /summon.", KO: "/summon으로 소환수를 불러냈다.", JA: "/summon で召喚獣を呼び出した。", ZH_CN: "用 /summon 召唤了召唤兽。", ZH_TW: "用 /summon 召喚了召喚獸。" } },
  { id: "scholar", icon: "📜", name: "探究者",
    desc: { EN: "Study the Kanji with /hint or /prompt.", KO: "/hint 또는 /prompt로 한자를 탐구했다.", JA: "/hint か /prompt で漢字を探究した。", ZH_CN: "用 /hint 或 /prompt 探究汉字。", ZH_TW: "用 /hint 或 /prompt 探究漢字。" } },
  { id: "gambler", icon: "🎲", name: "運命転換",
    desc: { EN: "Redraw your hand with /reroll.", KO: "/reroll로 패를 갈아엎었다.", JA: "/reroll で手札を引き直した。", ZH_CN: "用 /reroll 重抽手牌。", ZH_TW: "用 /reroll 重抽手牌。" } },
  { id: "flawless", icon: "🛡️", name: "無傷",
    desc: { EN: "Defeat an enemy without taking any damage from it.", KO: "피해를 한 번도 입지 않고 적을 처치했다.", JA: "一度も傷を負わずに敵を倒した。", ZH_CN: "未受任何伤害击败敌人。", ZH_TW: "未受任何傷害擊敗敵人。" } },
  { id: "one_turn", icon: "⚡", name: "一閃",
    desc: { EN: "Defeat an enemy on your first turn against it.", KO: "첫 턴에 적을 처치했다.", JA: "初手で敵を倒した。", ZH_CN: "第一回合就击败敌人。", ZH_TW: "第一回合就擊敗敵人。" } },
  { id: "comeback", icon: "🩹", name: "起死回生",
    desc: { EN: "Defeat an enemy with 15 HP or less remaining.", KO: "HP 15 이하로 적을 처치했다.", JA: "残りHP15以下で敵を倒した。", ZH_CN: "在剩余 HP 15 以下时击败敌人。", ZH_TW: "在剩餘 HP 15 以下時擊敗敵人。" } },
  { id: "healer", icon: "🌿", name: "回生",
    desc: { EN: "Recover 30 HP or more in a single turn.", KO: "한 턴에 HP를 30 이상 회복했다.", JA: "1ターンでHPを30以上回復した。", ZH_CN: "单回合恢复 30 以上 HP。", ZH_TW: "單回合恢復 30 以上 HP。" } },
  { id: "streak_5", icon: "🔥", name: "五連斬",
    desc: { EN: "Reach a 5-kill streak in one run.", KO: "한 원정에서 5연속 처치했다.", JA: "一度の探索で5連続撃破した。", ZH_CN: "单次远征达成5连斩。", ZH_TW: "單次遠征達成5連斬。" } },
  { id: "streak_10", icon: "🔥", name: "十連斬",
    desc: { EN: "Reach a 10-kill streak in one run.", KO: "한 원정에서 10연속 처치했다.", JA: "一度の探索で10連続撃破した。", ZH_CN: "单次远征达成10连斩。", ZH_TW: "單次遠征達成10連斬。" } },
  { id: "streak_20", icon: "☠️", name: "二十連斬",
    desc: { EN: "Reach a 20-kill streak in one run.", KO: "한 원정에서 20연속 처치했다.", JA: "一度の探索で20連続撃破した。", ZH_CN: "单次远征达成20连斩。", ZH_TW: "單次遠征達成20連斬。" } },
  { id: "kills_100", icon: "⚔️", name: "百人斬り",
    desc: { EN: "Defeat 100 enemies in total.", KO: "누적 100체의 적을 처치했다.", JA: "累計100体の敵を倒した。", ZH_CN: "累计击败 100 个敌人。", ZH_TW: "累計擊敗 100 個敵人。" } },
  { id: "bestiary_50", icon: "📕", name: "百鬼図鑑",
    desc: { EN: "Record 50 different bosses in the bestiary.", KO: "보스 도감에 50종을 기록했다.", JA: "図鑑に50種のボスを記録した。", ZH_CN: "图鉴记录 50 种首领。", ZH_TW: "圖鑑記錄 50 種首領。" } },
  { id: "abyss_12", icon: "👁️", name: "深淵到達",
    desc: { EN: "Set foot in the deepest layer, Depth 12.", KO: "최심부 12계층에 발을 들였다.", JA: "最深部・第12階層に足を踏み入れた。", ZH_CN: "踏入最深处第12阶层。", ZH_TW: "踏入最深處第12階層。" } },
  { id: "all_depths", icon: "🗝️", name: "全階踏破",
    desc: { EN: "Defeat an enemy in all 12 depths.", KO: "12개 계층 모두에서 적을 처치했다.", JA: "全12階層で敵を倒した。", ZH_CN: "在全部12个阶层击败敌人。", ZH_TW: "在全部12個階層擊敗敵人。" } }
];

/* One entry per depth for each template; desc keys live in I18N (dKillDesc etc.). */
const DEPTH_ACHIEVEMENT_TEMPLATES = [
  { key: "kill",     icon: "🩸", name: "初討伐", descKey: "dKillDesc" },
  { key: "streak",   icon: "🔥", name: "五連斬", descKey: "dStreakDesc" },
  { key: "flawless", icon: "🛡️", name: "無傷",   descKey: "dFlawlessDesc" },
  { key: "purge",    icon: "👑", name: "制覇",   descKey: "dPurgeDesc" }
];

/* Old achievement ids that were folded into the bestiary. */
const LEGACY_ACHIEVEMENT_MAP = {
  dog_slayer: ["boss_犬"],
  heaven_defier: ["boss_天"]
};
