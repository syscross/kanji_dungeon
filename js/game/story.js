/*
 * Story Mode (物語 / 스토리 모드):
 * - Village hub 【里】 등불의 마을 with 【先】 선생, 【老】 노인, 【友】 벗, and rescued 【猫】 고양이
 * - Dual inventory: Special Possessions (특수 소지, never lost on death) & Normal Bag (일반 소지, lost on death unless protected by talisman)
 * - Currency: Yen (円) earned from enemies & exploration
 * - Persistent world progression: Slain bosses & foes stay slain across runs; Gaols unlock sequentially 01 -> 10
 * - Depth 10 Boss ominous final words -> Mortal World Happy Ending -> Sekiro Shura-style Depth 11 & 12 unlock + dynamic villager reactions
 */

const ST_L = (EN, KO, JA, ZH_CN = EN, ZH_TW = JA) => ({ EN, KO, JA, ZH_CN, ZH_TW });

const STORY_SPECIAL_ITEMS = {
  talisman_life: {
    id: "talisman_life",
    kanji: "生",
    tier: "edu",
    cost: 200,
    consumable: true,
    maxStack: 5,
    name: ST_L("Talisman of Life", "생환의 부적", "生還の護符", "生还护符", "生還護符"),
    desc: ST_L(
      "Consumable Special Talisman. When a fatal blow reduces your HP to 0, this talisman burns to restore 40 HP and defies death.",
      "소모성 특수 부적. 전투 중 체력이 0이 되는 치명상을 입으면 부적이 대신 불타오르며 HP 40으로 즉시 부활합니다.",
      "消耗型の特殊護符。致命傷を受けてHPが0になった瞬間、護符が燃え上がりHP40で即座に蘇生する。"
    )
  },
  talisman_return: {
    id: "talisman_return",
    kanji: "帰",
    tier: "edu",
    cost: 180,
    consumable: true,
    maxStack: 5,
    name: ST_L("Talisman of Return", "귀환의 부적", "帰還の護符", "归还护符", "歸還護符"),
    desc: ST_L(
      "Consumable Special Talisman. If you die or abandon a run inside a Gaol, this talisman activates to preserve 100% of your Normal Bag kanji.",
      "소모성 특수 부적. 옥문 안에서 사망하거나 원정을 포기하더라도 일반 가방의 한자를 단 한 장도 잃지 않고 마을로 전부 보전합니다.",
      "消耗型の特殊護符。獄門内で死亡・放棄しても、一般袋の漢字を一枚も失わずすべて里へ持ち帰る。"
    )
  },
  talisman_keep: {
    id: "talisman_keep",
    kanji: "持",
    tier: "common",
    cost: 350,
    consumable: false,
    maxStack: 3,
    name: ST_L("Talisman of Keeping", "소지의 부적", "所持の護符", "所持护符", "所持護符"),
    desc: ST_L(
      "Permanent Special Talisman (never lost on death). Protects up to 5 Normal Bag kanji per stack even when you die without a Return Talisman.",
      "죽어도 사라지지 않는 영구 특수 부적. 사망 시에도 일반 가방의 한자(합자 포함)를 장당 5장씩 영구적으로 지켜줍니다.",
      "死んでも失われない永久護符。敗北時でも一般袋の漢字を1枚につき5枚まで永久に保護する。"
    )
  },
  talisman_wealth: {
    id: "talisman_wealth",
    kanji: "富",
    tier: "common",
    cost: 300,
    consumable: false,
    maxStack: 2,
    name: ST_L("Talisman of Wealth", "재물의 부적", "財宝の護符", "财富护符", "財富護符"),
    desc: ST_L(
      "Permanent Special Talisman (never lost on death). Increases Yen (円) earned from slaying foes by +50% per stack.",
      "죽어도 사라지지 않는 영구 특수 부적. 적 처치 및 사건에서 얻는 엔화(円) 획득량이 중첩당 +50% 증가합니다.",
      "死んでも失われない永久護符。敵討伐や探索で得る円(円)の獲得量が+50%増加する。"
    )
  },
  talisman_god: {
    id: "talisman_god",
    kanji: "神",
    tier: "common",
    cost: 450,
    consumable: false,
    maxStack: 2,
    name: ST_L("Talisman of the Old God", "고신의 부적", "古神の護符", "古神护符", "古神護符"),
    desc: ST_L(
      "Permanent Special Talisman (never lost on death). Grants +1 Free Summon and +1 Free Reroll at the start of every Gaol entry.",
      "죽어도 사라지지 않는 영구 특수 부적. 옥문에 입장할 때마다 무료 고신 +1 · 무료 리롤 +1을 자동으로 부여합니다.",
      "死んでも失われない永久護符。獄門へ入るたびに無料古神+1・無料引き直し+1を付与する。"
    )
  },
  cat_companion: {
    id: "cat_companion",
    kanji: "猫",
    tier: "common",
    cost: 0,
    shopHidden: true,
    consumable: false,
    maxStack: 1,
    name: ST_L("Rescued Cat 【猫】", "구출한 고양이 【猫】", "救出した猫 【猫】", "获救的猫 【猫】", "獲救的貓 【猫】"),
    desc: ST_L(
      "Permanent Companion rescued from the mist. Waits at your home in the Village and grants +15 Max HP on every Gaol descent.",
      "옥문에서 구출해 마을 집에서 지내는 귀여운 고양이. 죽어도 곁을 떠나지 않으며, 매 원정 시 최대 HP +15를 부여합니다.",
      "獄門から救い出し里の家で暮らす愛猫。決して離れず、出撃時に最大HP+15を授ける。"
    )
  }
};

function ensureStoryConfig() {
  if (!config.story || typeof config.story !== "object") {
    config.story = createDefaultStoryState();
  }
  if (!Array.isArray(config.story.deck)) config.story.deck = [];
  if (!Array.isArray(config.story.specialItems)) config.story.specialItems = [];
  if (!Array.isArray(config.story.defeatedFoes)) config.story.defeatedFoes = [];
  if (!Array.isArray(config.story.defeatedBosses)) config.story.defeatedBosses = [];
  if (!Array.isArray(config.story.encounteredFoes)) config.story.encounteredFoes = [];
  if (!config.story.gaolBosses || typeof config.story.gaolBosses !== "object") config.story.gaolBosses = {};
  if (typeof config.story.yen !== "number") config.story.yen = 120;
  if (typeof config.story.unlockedDepth !== "number" || config.story.unlockedDepth < 1) config.story.unlockedDepth = 1;
  return config.story;
}

function countSpecialItem(itemId) {
  const st = ensureStoryConfig();
  return st.specialItems.filter(id => id === itemId).length;
}

function addSpecialItem(itemId) {
  const st = ensureStoryConfig();
  const def = STORY_SPECIAL_ITEMS[itemId];
  if (!def) return false;
  const cur = countSpecialItem(itemId);
  if (def.maxStack && cur >= def.maxStack) return false;
  st.specialItems.push(itemId);
  persistStoryState();
  return true;
}

function consumeSpecialItem(itemId) {
  const st = ensureStoryConfig();
  const idx = st.specialItems.indexOf(itemId);
  if (idx < 0) return false;
  st.specialItems.splice(idx, 1);
  persistStoryState();
  return true;
}

/* Calculate Yen reward when defeating an enemy in Story Mode */
function awardStoryYenForKill(rank) {
  if (!isStoryMode()) return 0;
  const st = ensureStoryConfig();
  const base = rank === "boss" ? 180 : rank === "elite" ? 75 : 35;
  const wealthStacks = countSpecialItem("talisman_wealth");
  const mult = 1 + wealthStacks * 0.5;
  const gained = Math.round(base * mult);
  st.yen = (st.yen || 0) + gained;
  persistStoryState();
  return gained;
}

/* Check if the player in Story Mode has reached the Shura (Depth 11 / 12) state */
function getStoryAuraStage() {
  const st = ensureStoryConfig();
  if (st.visitedDepth12) return "abyss12";
  if (st.visitedDepth11) return "abyss11";
  if (st.humanEndingSeen) return "peace";
  if (st.unlockedDepth >= 7) return "slayer";
  return "early";
}

/* Ominous final words spoken by the Depth 10 Boss (冥 / 闇 / 鬱) upon defeat */
function getDepth10BossLastWords(bossKanji) {
  return pickLang(ST_L(
    `💀 **【${bossKanji}】's Dying Curse**: *"…Hah… hahaha… Foolish mortal. You severed the mere fence of 'Common Kanji' and think it ends here? The true Abyss that humans excised from their lexicon in terror—the 11th and 12th Gates—has already caught the scent of your blood…"*`,
    `💀 **【${bossKanji}】의 단말마**: *"…크크크… 어리석은 인간이여. 고작 '상용(常用)'의 울타리 안을 베어냈다고… 여기서 끝일 거라 생각하나? 인간들이 두려워 문자 밖으로 도려낸 진짜 심연(第11獄 · 第12獄)이… 이미 네 피 냄새를 맡았다…"*`,
    `💀 **【${bossKanji}】の断末魔**: *「……ククク……愚かな人間よ。たかだか『常用』の檻の中を斬り伏せた程度で……これで終わりだと思うか？ 人が恐れて文字の外へ切り捨てた真の深淵（第十一獄・第十二獄）は……すでにお前の血の匂いを嗅ぎつけたぞ……」*`
  ));
}

function getHumanWorldHappyEndingLines() {
  return [
    pickLang(ST_L(
      "With the fall of the 10th Gaol (冥府), the crimson fog choking the mortal realm dissolves into warm sunlight.",
      "제10옥(冥府)의 주인이 쓰러지자 인간 세상을 뒤덮었던 핏빛 안개가 걷히고, 마침내 마을 위로 따뜻한 햇살이 내려앉습니다.",
      "第十獄（冥府）の主が倒れると、人の世を覆っていた血霧が晴れ、ついに里へ暖かい陽差しが降り注いだ。"
    )),
    pickLang(ST_L(
      "🌸 **Mortal World Restored (Happy Ending)** — The 2,136 Common Kanji have been reclaimed. In the Village, Sensei 【先】 and your Friend 【友】 await the return of their hero.",
      "🌸 **【인간계 평정 — 해피엔딩 달성】** — 인간의 언어(상용한자 2,136자)가 모두 제자리를 되찾았습니다. 등불의 마을에서 선생【先】과 벗【友】이 영웅의 귀환을 기다립니다.",
      "🌸 **【人間界平定 — ハッピーエンド達成】** — 人の言葉（常用漢字2,136字）はすべて取り戻された。灯の里で先生【先】と友【友】が英雄の帰還を待っている。"
    )),
    pickLang(ST_L(
      "…Yet beneath the floor of the Underworld, two blood-red seals that should never be opened begin to pulse.",
      "…허나 저승의 바닥 너머에서, 결코 열려서는 안 될 핏빛 금역(第11獄 獣王廟 · 第12獄 奈落)의 봉인이 불길하게 맥동하기 시작합니다.",
      "……だが冥府の底のさらに奥で、決して開けてはならぬ二つの禁域（第十一獄・第十二獄）の封印が不気味に脈動し始めていた。"
    ))
  ];
}

function getShuraEndingLines() {
  return [
    pickLang(ST_L(
      "🩸 **【SHURA APOTHEOSIS — THE ABYSS ITSELF】** — Even the unreadable curses of the 12th Gaol (奈落) have been devoured by your blade.",
      "🩸 **【수라등극(修羅登極) — 나락의 지배자】** — 인간은 읽을 수조차 없는 제12옥 나락(奈落)의 태고신마저 당신의 칼끝에 도륙났습니다.",
      "🩸 **【修羅登極 — 奈落の支配者】** — 人には読めるはずもない第十二獄・奈落の太古神すら、お前の刃に喰らい尽くされた。"
    )),
    pickLang(ST_L(
      "No kanji in heaven, earth, or hell can judge you now. When you walk back toward the Village, the very air trembles in terror.",
      "이제 천지와 지옥 어디에도 당신을 심판할 수 있는 문자(漢字)는 남아 있지 않습니다. 당신이 마을로 발걸음을 옮기자 대기가 공포로 비명을 지릅니다.",
      "もはや天地にも地獄にも、お前を裁ける文字（漢字）は存在しない。お前が里へ歩みを戻すと、大気そのものが恐怖に悲鳴を上げた。"
    ))
  ];
}

/* Sync combat kills & boss clear into persistent Story state */
function syncStoryKillProgress(kanji, isBoss, depthId) {
  if (!isStoryMode()) return;
  const st = ensureStoryConfig();
  if (kanji && !st.defeatedFoes.includes(kanji)) {
    st.defeatedFoes.push(kanji);
  }
  if (isBoss) {
    if (kanji && !st.defeatedBosses.includes(kanji)) {
      st.defeatedBosses.push(kanji);
    }
    const dNum = depthNumber(depthId);
    if (dNum >= st.unlockedDepth && dNum < 12) {
      st.unlockedDepth = dNum + 1;
    }
    if (dNum === 10) {
      st.humanEndingSeen = true;
      if (st.unlockedDepth < 11) st.unlockedDepth = 11;
    }
    if (dNum === 11 && st.unlockedDepth < 12) {
      st.unlockedDepth = 12;
    }
    if (dNum === 12) {
      st.shuraEndingSeen = true;
    }
  }
  persistStoryState();
}

/* Rescue 【猫】 in Story Mode (called from battle with 猫 or from the Cat Rescue event) */
function rescueStoryCat() {
  const st = ensureStoryConfig();
  const firstTime = !st.catRescued;
  st.catRescued = true;
  st.catBlessedNextRun = true;
  if (!st.specialItems.includes("cat_companion")) {
    st.specialItems.push("cat_companion");
  }
  persistStoryState();
  return firstTime;
}

/* Handle death or mid-gaol abandon in Story Mode:
 * - Special items, Yen, and slain bosses/foes are ALWAYS kept!
 * - Normal bag (state.deck) is lost UNLESS protected by talisman_return (100%) or talisman_keep (5 per stack). */
function resolveStoryDeathOrAbandonBag() {
  const st = ensureStoryConfig();
  const currentBag = Array.isArray(state.deck) ? [...state.deck] : [];
  if (currentBag.length === 0) {
    st.deck = [];
    persistStoryState();
    return { kept: [], mode: "empty" };
  }
  if (consumeSpecialItem("talisman_return")) {
    st.deck = [...currentBag];
    persistStoryState();
    return { kept: [...currentBag], mode: "talisman_return" };
  }
  const keepStacks = countSpecialItem("talisman_keep");
  if (keepStacks > 0) {
    const keepCap = keepStacks * 5;
    // Prioritize multi-kanji fused cards first, then recent cards
    const sorted = [...currentBag].sort((a, b) => [...String(b)].length - [...String(a)].length);
    const kept = sorted.slice(0, keepCap);
    st.deck = kept;
    persistStoryState();
    return { kept, mode: "talisman_keep", lostCount: Math.max(0, currentBag.length - kept.length) };
  }
  st.deck = [];
  persistStoryState();
  return { kept: [], mode: "lost", lostCount: currentBag.length };
}

/* ---- Village Hub Modal (#village-modal) ---- */

let currentVillageTab = "sensei";

function openVillageModal(defaultTab = "sensei") {
  playClickSfx();
  const st = ensureStoryConfig();
  st.started = true;
  st.villageVisits = (st.villageVisits || 0) + 1;
  persistStoryState();
  currentVillageTab = defaultTab;
  renderVillageModal();
  openModal("village-modal");
}

function closeVillageModal() {
  playClickSfx();
  closeModal("village-modal");
  if (currentView === "select") renderDepthSpine();
}

function switchVillageTab(tab) {
  playClickSfx();
  currentVillageTab = tab;
  renderVillageModal();
}

function getSenseiDialogue() {
  const aura = getStoryAuraStage();
  if (aura === "abyss12") {
    return pickLang(ST_L(
      "*(Sensei 【先】 collapses backward, knocking over his inkstone in sheer terror)*\n“S-stay back…! What is that abyssal darkness writhing inside your eyes?! You are no longer a human… Have you become the living Kanji Hell (漢字地獄) itself?!”",
      "*(선생【先】이 벼루를 쓰러뜨리며 공포에 질려 뒷걸음질 친다)*\n「히익…! 가, 가까이 오지 마십시오! 당신의 눈동자 속에 일렁이는 그 칠흑 같은 문자들은 대체 무엇입니까?! 당신은 더 이상 사람이 아닙니다… 걸어 다니는 한자지옥(漢字地獄) 그 자체란 말입니까…!」",
      "*(先生【先】は硯をひっくり返し、恐怖に引きつった顔で後ずさる)*\n「ひぃっ……！ ち、近づかないでください！ あなたの瞳の奥で蠢くその悍ましい文字は何なのですか！？ あなたはもう人ではない……歩く漢字地獄そのものだというのですか……！」"
    ));
  }
  if (aura === "abyss11") {
    return pickLang(ST_L(
      "*(Sensei 【先】 trembles, clutching his brush with pale knuckles)*\n“Wait… What is that suffocating stench of beast blood on your clothes?! You already saved the mortal world at the 10th Gate! Why in heaven's name did you tear open the Forbidden Seal (Depth 11)…?!”",
      "*(선생【先】이 창백하게 질린 얼굴로 붓을 쥔 손을 덜덜 떤다)*\n「잠깐… 당신의 옷자락에서 풍기는 그 역겨운 흉수의 피비린내는 무엇입니까?! 열 번째 옥문을 닫아 인간계를 구한 영웅께서… 어째서 스스로 상용 외 금역(第11獄)의 봉인을 뜯어내신 겁니까…!」",
      "*(先生【先】は蒼白な顔で筆を握る手を震わせている)*\n「待ってください……あなたの衣から漂うその悍ましい凶獣の血臭は何ですか！？ 第十獄を閉じて人の世を救った英雄が……なぜ自ら常用外禁域（第十一獄）の封印を破られたのですか……！」"
    ));
  }
  if (aura === "peace") {
    return pickLang(ST_L(
      "*(Warm sunlight streams through the schoolhouse window as Sensei 【先】 bows deeply)*\n“You actually did it! With the 10th Gaol conquered, all 2,136 Common Kanji have returned to peace! You may lay down your blade now. …Huh? The 11th Seal? Please, pretend you never saw that gate. No sane mortal belongs beyond it.”",
      "*(서당 창가로 따뜻한 햇살이 스며들고, 선생【先】이 깊이 고개를 숙인다)*\n「해내셨군요! 제10옥(冥府)이 평정되면서 인간계의 모든 상용한자(2,136자)가 안식을 되찾았습니다! 이제 칼을 내려놓고 평화를 누리셔도 됩니다. …네? 열한 번째 봉인이요? 부디 그 문만큼은 보지 못한 척하십시오. 그 너머는 사람의 영역이 아닙니다.」",
      "*(寺子屋の窓から暖かい陽が差し込み、先生【先】は深く頭を下げる)*\n「成し遂げられましたね！ 第十獄（冥府）が平定され、人の世の常用漢字（2,136字）はすべて安寧を取り戻しました！ ……え？ 第十一の封印ですか？ どうかあの門だけは見なかったことにしてください。あの先は人の踏み込む領域ではありません。」"
    ));
  }
  if (aura === "slayer") {
    return pickLang(ST_L(
      "“You have crossed into the Slayer's Grounds (Depths 7–10). The fiends there wield lethal Common Kanji, yet every Boss you fell stays permanently slain. Prepare your Special Talismans well—as long as you reaches the 10th Gate, our world will be saved!”",
      "「드디어 귀살의 사지(제7옥~제10옥)까지 진격하셨군요. 그곳의 악귀들은 날 선 상용한자를 휘두르지만, 당신이 한 번 쓰러뜨린 주인(主)들은 결코 되살아나지 않습니다. 열 번째 문(冥府)만 정복하면 인간계는 구원받을 것입니다!」",
      "「ついに鬼殺の死地（第七獄〜第十獄）へ到達されましたね。かの地の悪鬼は鋭い常用漢字を振るいますが、一度討った主（ボス）が蘇ることはありません。第十の門（冥府）さえ平定すれば、人の世は救われます！」"
    ));
  }
  return pickLang(ST_L(
    "“Welcome to the Lantern Village 【里】. I am 【先】, a humble teacher. Even if you fall inside a Gaol, the bosses you slay and the **Special Talismans (특수 소지)** you carry here will never be lost. Bring back **Yen (円)** from your battles, and I will inscribe protective talismans for you.”",
    "「안개 너머의 피난처, 등불의 마을【里】에 오신 것을 환영합니다. 저는 글자를 가르치던 선생【先】이라 합니다.\n설령 옥문 안에서 쓰러지더라도 **당신이 처치한 적의 기록**과 품에 지닌 **특수 소지(부적)**는 결코 사라지지 않습니다. 원정에서 얻은 **엔화(円)**를 가져오시면 생환과 소지를 돕는 부적을 써 드리겠습니다.」",
    "「霧の向こうの避難所、灯の里【里】へようこそ。私は文字を教えていた先生【先】と申します。\nたとえ獄門で倒れても、**討伐した敵の記録**と身につけた**特殊所持（護符）**は決して失われません。遠征で得た**円（円）**をお持ちくだされば、生還と所持を守る護符を認めましょう。」"
  ));
}

function getElderDialogue() {
  const aura = getStoryAuraStage();
  if (aura === "abyss12") {
    return pickLang(ST_L(
      "*(The grey-eyed Elder 【老】 lowers his head in solemn awe as black embers dance around you)*\n“Heh… Even the primordial curses of the 12th Abyss have been carved into your flesh. Sensei 【先】 and your Friend 【友】 weep in terror, calling you a demon (Shura)… Yet I see the truth. You have become the sovereign of all 6,355 characters.”",
      "*(잿빛 눈의 노인【老】이 당신 주위에 일렁이는 검은 불씨를 보며 경외 어린 표정으로 고개를 숙인다)*\n「허허… 인간은 읽을 수조차 없는 제12옥 나락(奈落)의 태고신들마저 네 칼끝에 베어 삼켰구나. 선생【先】과 네 벗【友】은 너를 괴물(修羅)이라 부르며 두려워하더군. 허나 내 눈엔 보인다… 너는 이제 6,355자 모든 문자의 정점에 선 지배자다.」",
      "*(灰色の目の老人【老】は、お前の周囲に舞う黒い火の粉を見て畏敬の面持ちで頭を下げる)*\n「ふぉっふぉ……人には読めぬ第十二獄・奈落の太古神すら斬り喰らったか。先生【先】もお前の友【友】もお前を修羅と呼んで怯えておる。だがワシには見えるぞ……お前は今や六千三百五十五字すべての頂に立つ支配者だ。」"
    ));
  }
  if (aura === "abyss11") {
    return pickLang(ST_L(
      "*(Elder 【老】 gazes into his brazier with a knowing, chilling smile)*\n“So you broke the 11th Seal after all. Once a swordsman tastes the forbidden script outside Common Kanji, the peaceful spring of mortals feels like a lie. Now only the final gate—the 12th Abyss (奈落)—remains before you.”",
      "*(노인【老】이 화로의 불꽃을 응시하며 서늘한 미소를 짓는다)*\n「결국 열한 번째 봉인(獣王廟)을 뜯어냈구나. 상용(常用)의 울타리 너머에 버려진 금단의 글자를 맛본 자는, 결코 인간들의 평화로운 봄날로 돌아갈 수 없지. 이제 네 앞에 남은 건 마지막 문… 제12옥 나락(奈落)뿐이로구나.」",
      "*(老人【老】は火鉢の炎を見つめ、冷ややかな笑みを浮かべる)*\n「ついに第十一の封印（獣王廟）を破ったか。常用の檻の外に棄てられた禁断の文字を味わった者は、もう人間の穏やかな春には戻れぬ。さあ、残るは最後の門……第十二獄『奈落』のみよ。」"
    ));
  }
  if (aura === "peace") {
    return pickLang(ST_L(
      "*(Elder 【老】 chuckles quietly while everyone else celebrates)*\n“Sensei 【先】 truly believes the world is saved just because the 10th Gate fell. Mortals draw a line around 2,136 characters, call them 'Common Kanji', and pretend the horrors outside don't exist. You heard the 10th Boss's dying curse, didn't you? Will you stay a hero of men… or step into the 11th Gate as a Shura?”",
      "*(마을의 환호성 속에서도 노인【老】만은 나지막이 웃음을 흘린다)*\n「선생【先】은 열 번째 옥문이 닫혔다고 세상이 완전히 구원받은 줄 알더군. 인간들은 고작 이천 남짓한 글자에 '상용(常用)'이라 이름 붙이고, 그 바깥의 괴물들은 없는 셈 치며 살아가지. 열 번째 주인의 유언을 들었을 테지? 인간의 영웅으로 남을 텐가… 아니면 열한 번째 문을 열고 수라(修羅)가 될 텐가?」",
      "*(里が歓喜に沸く中、老人【老】だけは低く笑い声を漏らす)*\n「先生【先】は第十獄が閉じただけで世が救われたと信じておる。人はたかだか二千余りの字に『常用』と名付け、その外の怪異など最初から無かったことにして生きるものよ。十獄の主の遺言を聞いたであろう？ 人の英雄として留まるか……それとも第十一獄を開き、修羅となるか？」"
    ));
  }
  return pickLang(ST_L(
    "*(An old man 【老】 with ash-grey eyes warms his hands by a dark brazier)*\n“Sensei 【先】 only teaches the surface of letters. Listen well: a single character has its limits, but when two characters are forged into one compound (合字), their karma multiplies. Bring your scavenged kanji and Yen to my brazier.”",
    "*(화로 곁에 앉은 잿빛 눈의 노인【老】이 깊고 서늘한 눈빛으로 당신을 올려다본다)*\n「선생【先】이 해주는 이야기는 수면 위의 껍데기에 불과하다네. 왜 인간들이 배운 글자부터 차례로 지옥으로 변했는지 궁금하지 않은가? …가방에 모은 한자들을 가져오게. 내 화로에서 두 글자를 하나로 벼려(合字) 주거나, 불필요한 글자를 태워 엔화(円)로 환원해 주지.」",
    "*(火鉢の傍らに座る灰色の目の老人【老】が、深く鋭い眼差しでお前を見上げる)*\n「先生【先】の話など水面の上っ面にすぎんよ。なぜ人が学ぶ順に文字が地獄へ堕ちたのか、気にならんか？ ……袋に集めた漢字を持ってきなさい。ワシの火鉢で二字を一つの合字に鍛えるか、不要な字を焼いて円（円）に還してやろう。」"
  ));
}

function getFriendDialogue() {
  const st = ensureStoryConfig();
  const aura = getStoryAuraStage();
  if (aura === "abyss12") {
    return pickLang(ST_L(
      "*(Your old friend 【友】 grips his sword hilt with trembling hands, tears falling down his cheeks)*\n“…My friend died back at the 10th Gate. The one standing before me now is only a Shura (修羅) who swallowed the Abyss (奈落) whole… Please, don't make me draw my blade against you…”",
      "*(옛 벗【友】이 떨리는 손으로 칼자루를 쥐고 고개를 떨군 채 눈물을 흘린다)*\n「…내 자랑스러운 벗은 열 번째 옥문에서 이미 죽었어. 지금 내 앞에 서 있는 건 나락(奈落)의 심연을 통째로 집어삼킨 수라(修羅)일 뿐이야… 제발, 내가 너에게 칼을 겨누게 하지 말아 줘…」",
      "*(旧友【友】は震える手で柄を握りしめ、俯いて涙をこぼす)*\n「……俺の誇らしい友は、第十獄でもう死んだんだ。今目の前に立っているのは、奈落の深淵を丸呑みにした修羅（しゅら）だけだ……頼む、俺にお前へ刃を向けさせないでくれ……」"
    ));
  }
  if (aura === "abyss11") {
    return pickLang(ST_L(
      "*(Your friend 【友】 steps back in shock, staring at your blood-stained aura)*\n“Hey… What happened to your eyes?! Every time you take a step, the talismans in the village scream and turn black! Stop going into that Forbidden Gate—if you go any deeper, you'll turn into a monster (Shura)!”",
      "*(벗【友】이 경악하며 한 걸음 물러서서 당신의 핏빛 눈동자를 바라본다)*\n「야… 너 눈동자가 왜 그래?! 네가 걸어올 때마다 마을에 붙여둔 부적들이 비명을 지르며 시커멓게 타들어가고 있어! 제발 그 금역(第11獄)에서 손 떼… 거기서 더 내려갔다간 너 자신이 괴물(修羅)이 되고 말 거야!」",
      "*(友【友】は驚愕して一歩後退り、お前の血走った瞳を見つめる)*\n「おい……お前の目、どうしたんだよ！？ お前が歩くたびに里の護符が悲鳴を上げて黒く焦げていくんだ！ 頼むからその禁域（第十一獄）からは手を引いてくれ……これ以上降りたら、お前自身が修羅になっちまうぞ！」"
    ));
  }
  if (aura === "peace") {
    return pickLang(ST_L(
      "*(Your friend 【友】 beams with joy and claps your shoulder)*\n“You actually conquered the Underworld (Depth 10)! The crimson fog is gone—we saved the human world! …Wait, why are you still looking toward the bottom of the cliff? Don't tell me that final boss's dying curse got into your head?”",
      "*(벗【友】이 환하게 웃으며 당신의 어깨를 힘껏 두드린다)*\n「네가 진짜로 저승의 문턱(제10옥)까지 깨부술 줄 알았어! 봐봐, 인간 세상의 핏빛 안개가 다 걷혔잖아! 우리 해피엔딩이라고! …근데 왜 자꾸 절벽 아래쪽을 내려다보는 거야? 설마 열 번째 주인이 남긴 찜찜한 유언이 신경 쓰이는 건 아니지?」",
      "*(友【友】は満面の笑みでお前の肩を強く叩く)*\n「お前なら本当に冥府（第十獄）まで打ち破ると思ってたよ！ 見ろよ、人の世の血霧がすっかり晴れたぞ！ 俺たちのハッピーエンドだ！ ……なのに、なんでさっきから崖の下ばかり見てるんだ？ まさか十獄の主が遺した不気味な言葉が気になってるんじゃないだろうな？」"
    ));
  }
  const catHint = !st.catRescued
    ? pickLang(ST_L(
        "\n\n💡 *Rumor*: “By the way, when I scouted the mist, I heard a small cat 【猫】 mewing inside the Gaols. If you spot it in an event or battle, please rescue it!”",
        "\n\n💡 *소문*: 「참, 정찰 중에 옥문 안개 속에서 길 잃은 **고양이【猫】** 울음소리를 들었어! 탐사 중에 마주치면 해치지 말고 꼭 구출해 와 줘!」",
        "\n\n💡 *噂*: 「そうだ、偵察中に獄門の霧の中で迷い**猫【猫】**の鳴き声を聞いたんだ！ 見かけたら傷つけずに救出してきてくれよ！」"
      ))
    : pickLang(ST_L(
        "\n\n🐾 “That cat 【猫】 you rescued is sleeping so peacefully in your house! Make sure to pet it before you head out.”",
        "\n\n🐾 「네가 구해 온 **고양이【猫】**, 네 집 방석 위에서 아주 세상 모르고 골골대며 자더라! 출정하기 전에 꼭 쓰다듬어 줘.」",
        "\n\n🐾 「お前が助けた**猫【猫】**、家の座布団の上で気持ちよさそうに喉を鳴らして寝てたぞ！ 出撃前に撫でてやれよ。」"
      ));
  return pickLang(ST_L(
    `“Good to see you alive, my friend 【友】! Right now we have unsealed up to **Gaol #${st.unlockedDepth} (${depthName("depth_" + st.unlockedDepth)})**. Remember: if things get too dangerous inside a Gaol, use **【帰】 Return** at a crossroads so you don't lose your scavenged cards!”`,
    `「살아서 돌아왔구나, 내 벗【友】이여! 지금 우리가 열어젖힌 문은 **제${st.unlockedDepth}옥(${depthName("depth_" + st.unlockedDepth)})**까지야. 옥문 안에서 위험하다 싶으면 무리하지 말고 갈림길에서 **【帰】 옥문 귀환**을 택해. 그래야 모은 한자들을 잃지 않고 마을로 가져올 수 있어!」`,
    `「生きて戻ったな、我が友【友】よ！ 今開いているのは**第${st.unlockedDepth}獄（${depthName("depth_" + st.unlockedDepth)}）**までだ。獄門の中で危なくなったら無理せず分岐で**【帰】獄門帰還**を選べよ。そうすれば集めた漢字を失わずに里へ持ち帰れるからな！」`
  )) + catHint;
}

function getCatHouseDialogue() {
  const st = ensureStoryConfig();
  const aura = getStoryAuraStage();
  if (!st.catRescued) {
    return pickLang(ST_L(
      "An empty cushion sits beside the warm hearth.\nRumors say a stray cat 【猫】 is trapped somewhere inside the Gaols. Explore event nodes (or encounter 【猫】 in the 9th Gaol) to rescue it and bring it home!",
      "따뜻한 화로 옆에 아직 주인 없는 작은 방석이 놓여 있습니다.\n옥문 어딘가에 길 잃은 **고양이【猫】**가 갇혀 있다는 소문이 들립니다. 옥문의 사건(또는 제9옥의 【猫】 조우)에서 고양이를 구출하면 이곳 집에서 함께 지낼 수 있습니다!",
      "暖かい囲炉裏の横に、まだ主のいない小さな座布団が置かれている。\n獄門のどこかに迷い**猫【猫】**が囚われているという。探索の事件（または第九獄での【猫】遭遇）で救出すれば、この家で一緒に暮らせるようになる！"
    ));
  }
  if (aura === "abyss11" || aura === "abyss12") {
    return pickLang(ST_L(
      "*(Everyone in the Village shrinks back from your Shura aura in terror… yet 【猫】 trots right up to you, purring loudly, and rubs its head against your blood-stained hem without a trace of fear.)*\n“Meow~ ♪”",
      "*(마을의 모두가 당신에게서 뿜어져 나오는 수라(修羅)의 살기에 공포를 느끼며 뒷걸음질 치지만… 구출한 고양이【猫】만큼은 두려워하지 않고 쪼르르 달려와 당신의 피 묻은 옷자락에 골골대며 머리를 부빈다.)*\n「야옹~ ♪」",
      "*(里の誰もが修羅と化したお前の殺気に怯えて後ずさる中……救い出した猫【猫】だけは少しも怖がらずに駆け寄り、血塗られた裾にゴロゴロと頭を擦りつけてくる。)*\n「ニャー♪」"
    ));
  }
  return pickLang(ST_L(
    "*(The rescued cat 【猫】 is curled up on the cushion by the hearth. When it spots you, it stretches its paws and purrs warmly.)*\n“Purrrr… Meow~ ♪”",
    "*(구출해 온 귀여운 고양이【猫】가 집 안 화로 옆 방석에서 식빵을 굽고 있다가, 당신을 보자 반갑게 발을 쭉 뻗으며 골골거린다.)*\n「골골골… 야옹~ ♪」",
    "*(救い出した可愛い猫【猫】が囲炉裏の座布団で丸くなっていたが、お前を見つけると嬉しそうに前足を伸ばして喉を鳴らす。)*\n「ゴロゴロ……ニャー♪」"
  ));
}

function renderVillageModal() {
  const st = ensureStoryConfig();
  const aura = getStoryAuraStage();
  const modalCard = $("village-modal-card");
  if (!modalCard) return;

  modalCard.classList.toggle("shura-aura", aura === "abyss11" || aura === "abyss12");
  modalCard.classList.toggle("peace-aura", aura === "peace");

  $("vm-yen").textContent = `🪙 ${st.yen.toLocaleString()} 円`;
  $("vm-bag-count").textContent = `🀄 ${st.deck.length}`;
  $("vm-special-count").textContent = `📿 ${st.specialItems.length}`;

  const tabsEl = $("vm-tabs");
  const tabs = [
    { id: "sensei", kanji: "先", label: pickLang(ST_L("Sensei", "선생 · 부적", "先生・護符")) },
    { id: "elder", kanji: "老", label: pickLang(ST_L("Elder", "노인 · 비술", "老人・秘術")) },
    { id: "friend", kanji: "友", label: pickLang(ST_L("Friend", "벗 · 소문", "旧友・噂")) },
    { id: "cat", kanji: "猫", label: st.catRescued ? pickLang(ST_L("Cat 【猫】", "집 · 고양이", "家・猫")) : pickLang(ST_L("Home", "빈 보금자리", "空き家")) }
  ];
  tabsEl.innerHTML = tabs.map(tb => `
    <button class="vm-tab-btn ${currentVillageTab === tb.id ? "active" : ""}" onclick="switchVillageTab('${tb.id}')">
      <span class="vm-tab-kanji">${tb.kanji}</span>
      <span class="vm-tab-label">${escapeHtml(tb.label)}</span>
    </button>
  `).join("");

  const body = $("vm-body");
  body.innerHTML = "";

  if (currentVillageTab === "sensei") {
    const npcHead = document.createElement("div");
    npcHead.className = "vm-npc-box";
    npcHead.innerHTML = `
      <div class="vm-npc-portrait tier-edu">先</div>
      <div class="vm-npc-talk">${formatGmText(getSenseiDialogue())}</div>
    `;
    body.appendChild(npcHead);

    const shopTitle = document.createElement("div");
    shopTitle.className = "vm-sec-title";
    shopTitle.textContent = pickLang(ST_L("📿 Special Talisman Shop (Never lost on death)", "📿 특수 소지 부적 서당 (사망 시 영구 보존)", "📿 特殊所持・護符処（死亡時も保持）"));
    body.appendChild(shopTitle);

    const grid = document.createElement("div");
    grid.className = "vm-shop-grid";
    Object.values(STORY_SPECIAL_ITEMS).filter(it => !it.shopHidden).forEach(it => {
      const owned = countSpecialItem(it.id);
      const maxed = it.maxStack && owned >= it.maxStack;
      const canBuy = !maxed && st.yen >= it.cost;
      const row = document.createElement("div");
      row.className = `vm-shop-item ${maxed ? "maxed" : ""}`;
      row.innerHTML = `
        <div class="vm-item-seal tier-${it.tier}">${it.kanji}</div>
        <div class="vm-item-info">
          <div class="vm-item-name">
            <strong>【${it.kanji}】 ${escapeHtml(pickLang(it.name))}</strong>
            <span class="vm-item-owned">${owned}/${it.maxStack || 5}</span>
          </div>
          <div class="vm-item-desc">${escapeHtml(pickLang(it.desc))}</div>
        </div>
      `;
      const buyBtn = document.createElement("button");
      buyBtn.className = `btn ${canBuy ? "btn-gold" : ""}`;
      buyBtn.disabled = !canBuy;
      buyBtn.textContent = maxed
        ? pickLang(ST_L("MAX", "최대 보유", "最大"))
        : `🪙 ${it.cost} 円`;
      buyBtn.onclick = () => {
        if (st.yen < it.cost || maxed) return;
        st.yen -= it.cost;
        addSpecialItem(it.id);
        if (typeof playHealSfx === "function") playHealSfx();
        else playClickSfx();
        showToast(`📿 【${it.kanji}】 ${pickLang(it.name)} +1`);
        renderVillageModal();
      };
      row.appendChild(buyBtn);
      grid.appendChild(row);
    });
    body.appendChild(grid);
  } else if (currentVillageTab === "elder") {
    const npcHead = document.createElement("div");
    npcHead.className = "vm-npc-box";
    npcHead.innerHTML = `
      <div class="vm-npc-portrait tier-common">老</div>
      <div class="vm-npc-talk">${formatGmText(getElderDialogue())}</div>
    `;
    body.appendChild(npcHead);

    const artTitle = document.createElement("div");
    artTitle.className = "vm-sec-title";
    artTitle.textContent = pickLang(ST_L("🔥 Elder's Brazier & Mystic Arts", "🔥 노인의 화로 · 비술", "🔥 老人の火鉢・秘術"));
    body.appendChild(artTitle);

    const actionsWrap = document.createElement("div");
    actionsWrap.className = "vm-shop-grid";

    // 1. Kanji Fusion in Village (100 Yen)
    const canFuse = st.deck.length >= 2 && st.yen >= 100;
    const fuseRow = document.createElement("div");
    fuseRow.className = "vm-shop-item";
    fuseRow.innerHTML = `
      <div class="vm-item-seal tier-common">合</div>
      <div class="vm-item-info">
        <div class="vm-item-name"><strong>${escapeHtml(pickLang(ST_L("Forge Compound Kanji (合字)", "합자(合字) 연성", "合字錬成")))}</strong></div>
        <div class="vm-item-desc">${escapeHtml(pickLang(ST_L("Combine 2 kanji in your Normal Bag into 1 horizontal compound card.", "일반 가방의 한자 2장을 골라 1장의 강력한 합자 카드로 벼려냅니다.", "一般袋の漢字2枚を選び、1枚の合字カードに鍛え上げる。")))}</div>
      </div>
    `;
    const fuseBtn = document.createElement("button");
    fuseBtn.className = `btn ${canFuse ? "btn-gold" : ""}`;
    fuseBtn.disabled = !canFuse;
    fuseBtn.textContent = st.deck.length < 2
      ? pickLang(ST_L("Need 2+ Bag Kanji", "가방 2장 이상 필요", "袋に2枚以上必要"))
      : "🪙 100 円";
    fuseBtn.onclick = () => openVillageFusePicker();
    fuseRow.appendChild(fuseBtn);
    actionsWrap.appendChild(fuseRow);

    // 2. Purify / Sell unwanted Kanji (+30 Yen)
    const canBurn = st.deck.length >= 1;
    const burnRow = document.createElement("div");
    burnRow.className = "vm-shop-item";
    burnRow.innerHTML = `
      <div class="vm-item-seal tier-edu">火</div>
      <div class="vm-item-info">
        <div class="vm-item-name"><strong>${escapeHtml(pickLang(ST_L("Purify Kanji into Yen (+30 円)", "불필요한 한자 소각 (+30 円 환원)", "不要漢字の浄化 (+30 円還元)")))}</strong></div>
        <div class="vm-item-desc">${escapeHtml(pickLang(ST_L("Burn 1 unwanted kanji from your Bag to compress your deck and gain +30 円.", "가방에서 필요 없는 한자 1장을 태워 덱을 압축하고 30엔(円)을 돌려받습니다.", "袋から不要な漢字1枚を焼き、30円を受け取る。")))}</div>
      </div>
    `;
    const burnBtn = document.createElement("button");
    burnBtn.className = `btn ${canBurn ? "btn-gold" : ""}`;
    burnBtn.disabled = !canBurn;
    burnBtn.textContent = canBurn ? "+30 円" : pickLang(ST_L("Bag Empty", "가방 비어 있음", "袋が空"));
    burnBtn.onclick = () => openVillageBurnPicker();
    burnRow.appendChild(burnBtn);
    actionsWrap.appendChild(burnRow);

    // 3. Re-summon slain normal/elite spirits (80 Yen) if player wants to farm again
    const canResummon = st.defeatedFoes.length > 0 && st.yen >= 80;
    const resummonRow = document.createElement("div");
    resummonRow.className = "vm-shop-item";
    resummonRow.innerHTML = `
      <div class="vm-item-seal tier-abyss">魂</div>
      <div class="vm-item-info">
        <div class="vm-item-name"><strong>${escapeHtml(pickLang(ST_L("Beckon Slain Spirits (Farm Reset)", "토벌한 원령 재소환 (파밍 리셋)", "討伐した怨霊の再召喚")))}</strong></div>
        <div class="vm-item-desc">${escapeHtml(pickLang(ST_L("Respawns slain normal/elite foes across Gaols for farming (Boss clear records & unlocked gates stay intact).", "이미 처치한 일반·정예 적들을 옥문에 다시 불러내어 한자와 엔화를 재파밍합니다. (보스 정복 및 옥문 해금은 유지)", "討伐済みの通常・精鋭敵を再出現させ、漢字や円を稼げるようにする（主の討伐記録と獄門解放は維持）。")))}</div>
      </div>
    `;
    const resummonBtn = document.createElement("button");
    resummonBtn.className = `btn ${canResummon ? "btn-gold" : ""}`;
    resummonBtn.disabled = !canResummon;
    resummonBtn.textContent = "🪙 80 円";
    resummonBtn.onclick = () => {
      if (st.yen < 80) return;
      st.yen -= 80;
      st.defeatedFoes = [...st.defeatedBosses];
      persistStoryState();
      playGongSfx();
      showToast(pickLang(ST_L("🕯 Slain spirits roam the Gaols once more!", "🕯 옥문에 원령들이 다시 스며들었습니다!", "🕯 獄門に再び怨霊が満ちた！")));
      renderVillageModal();
    };
    resummonRow.appendChild(resummonBtn);
    actionsWrap.appendChild(resummonRow);

    body.appendChild(actionsWrap);
  } else if (currentVillageTab === "friend") {
    const npcHead = document.createElement("div");
    npcHead.className = "vm-npc-box";
    npcHead.innerHTML = `
      <div class="vm-npc-portrait tier-edu">友</div>
      <div class="vm-npc-talk">${formatGmText(getFriendDialogue())}</div>
    `;
    body.appendChild(npcHead);

    const actWrap = document.createElement("div");
    actWrap.className = "vm-shop-grid";

    if (!st.friendGiftClaimed) {
      const giftRow = document.createElement("div");
      giftRow.className = "vm-shop-item";
      giftRow.innerHTML = `
        <div class="vm-item-seal tier-edu">礼</div>
        <div class="vm-item-info">
          <div class="vm-item-name"><strong>${escapeHtml(pickLang(ST_L("Friend's Expedition Pouch (Free Gift)", "옛 벗의 출정 보급품 (무료 수령)", "旧友の遠征補給品（無料）")))}</strong></div>
          <div class="vm-item-desc">${escapeHtml(pickLang(ST_L("Receive +100 円, 1x 【生】 Talisman of Life, and starter kanji 【火 · 水 · 刀】!", "옛 벗이 챙겨준 【生】 생환의 부적 1개 + 100 円 + 기본 한자 【火 · 水 · 刀】를 받습니다!", "旧友が用意してくれた【生】生還の護符1枚＋100円＋基本漢字【火・水・刀】を受け取る！")))}</div>
        </div>
      `;
      const giftBtn = document.createElement("button");
      giftBtn.className = "btn btn-gold";
      giftBtn.textContent = pickLang(ST_L("🎁 Claim", "🎁 보급품 받기", "🎁 受け取る"));
      giftBtn.onclick = () => {
        st.friendGiftClaimed = true;
        st.yen += 100;
        addSpecialItem("talisman_life");
        ["火", "水", "刀"].forEach(k => {
          if (st.deck.length < MAX_DECK) st.deck.push(k);
        });
        persistStoryState();
        if (typeof playHealSfx === "function") playHealSfx();
        showToast(pickLang(ST_L("🎁 Received +100 円, 【生】 Talisman & 3 Kanji!", "🎁 생환의 부적 · 100 円 · 기본 한자 3장 획득!", "🎁 生還の護符・100円・基本漢字3枚を獲得！")));
        renderVillageModal();
      };
      giftRow.appendChild(giftBtn);
      actWrap.appendChild(giftRow);
    }

    body.appendChild(actWrap);
  } else if (currentVillageTab === "cat") {
    const npcHead = document.createElement("div");
    npcHead.className = "vm-npc-box";
    npcHead.innerHTML = `
      <div class="vm-npc-portrait ${st.catRescued ? "tier-common" : "tier-edu"}">${st.catRescued ? "猫" : "家"}</div>
      <div class="vm-npc-talk">${formatGmText(getCatHouseDialogue())}</div>
    `;
    body.appendChild(npcHead);

    if (st.catRescued) {
      const catWrap = document.createElement("div");
      catWrap.className = "vm-shop-grid";
      const petRow = document.createElement("div");
      petRow.className = "vm-shop-item";
      petRow.innerHTML = `
        <div class="vm-item-seal tier-common">🐾</div>
        <div class="vm-item-info">
          <div class="vm-item-name"><strong>${escapeHtml(pickLang(ST_L("Pet 【猫】 (Cat's Blessing)", "고양이 【猫】 쓰다듬기 (출정 축복)", "猫【猫】を撫でる（出撃の祝福）")))}</strong></div>
          <div class="vm-item-desc">${escapeHtml(pickLang(ST_L("Grants +15 Max HP and +1 Free Reroll on your next Gaol descent!", "쓰다듬으면 기분 좋게 골골대며, 다음 옥문 입장 시 최대 HP +15 및 무료 리롤 +1을 부여합니다!", "撫でると気持ちよさそうに喉を鳴らし、次の獄門突入時に最大HP+15＆無料引き直し+1を授ける！")))}</div>
        </div>
      `;
      const petBtn = document.createElement("button");
      petBtn.className = `btn ${st.catBlessedNextRun ? "" : "btn-gold"}`;
      petBtn.textContent = st.catBlessedNextRun
        ? pickLang(ST_L("🐾 Purring Happily (Blessed)", "🐾 축복 활성화됨 (골골골♪)", "🐾 祝福付与済み（ゴロゴロ♪）"))
        : pickLang(ST_L("🐾 Pet Cat", "🐾 쓰다듬기", "🐾 撫でる"));
      petBtn.onclick = () => {
        st.catBlessedNextRun = true;
        persistStoryState();
        if (typeof playHealSfx === "function") playHealSfx();
        showToast(pickLang(ST_L("🐱 Meow~ ♪ Next descent blessed (+15 HP, +1 Reroll)!", "🐱 야옹~ ♪ 다음 원정에 고양이의 축복이 깃듭니다!", "🐱 ニャー♪ 次の遠征に猫の祝福が宿った！")));
        renderVillageModal();
      };
      petRow.appendChild(petBtn);
      catWrap.appendChild(petRow);
      body.appendChild(catWrap);
    }
  }
}

/* Village Kanji Fusion picker (uses config.story.deck and costs 100 Yen) */
let villageFuseSelected = [];

function openVillageFusePicker() {
  const st = ensureStoryConfig();
  if (st.deck.length < 2 || st.yen < 100) return;
  villageFuseSelected = [];
  renderVillageFuseStep();
}

function renderVillageFuseStep() {
  const st = ensureStoryConfig();
  const sel = villageFuseSelected;
  let desc = t("fuseDescEmpty");
  if (sel.length === 1) {
    desc = t("fuseDescOne")(st.deck[sel[0]]);
  } else if (sel.length === 2) {
    const k1 = st.deck[sel[0]];
    const k2 = st.deck[sel[1]];
    desc = `${t("fuseDescTwo")(k1, k2, k1 + k2)} (🪙 100 円)`;
  }

  const actions = [];
  if (sel.length === 2) {
    const fused = st.deck[sel[0]] + st.deck[sel[1]];
    actions.push({
      label: `${t("fuseConfirmBtn")(fused)} (100 円)`,
      gold: true,
      onClick: () => {
        if (st.yen < 100) return;
        const [i1, i2] = sel;
        const k1 = st.deck[i1];
        const k2 = st.deck[i2];
        if (k1 && k2 && i1 !== i2) {
          st.yen -= 100;
          const [hi, lo] = i1 > i2 ? [i1, i2] : [i2, i1];
          st.deck.splice(hi, 1);
          st.deck.splice(lo, 1);
          st.deck.push(k1 + k2);
          persistStoryState();
          if (typeof playCardDealSfx === "function") playCardDealSfx(0);
          showToast(t("fxCardFuse")(k1, k2, k1 + k2));
        }
        closePicker();
        renderVillageModal();
      }
    });
  }
  actions.push({
    label: t("fuseCancelBtn"),
    onClick: () => {
      closePicker();
      renderVillageModal();
    }
  });

  openPicker({
    title: `${t("pickFusePrompt")} · 🪙 100 円`,
    desc,
    cards: st.deck,
    locked: true,
    selectedIndices: sel,
    showOrderBadge: true,
    onCard: (_k, idx) => {
      if (villageFuseSelected.includes(idx)) {
        villageFuseSelected = villageFuseSelected.filter(x => x !== idx);
      } else if (villageFuseSelected.length < 2) {
        villageFuseSelected = [...villageFuseSelected, idx];
      } else {
        villageFuseSelected = [villageFuseSelected[0], idx];
      }
      renderVillageFuseStep();
    },
    actions
  });
}

function openVillageBurnPicker() {
  const st = ensureStoryConfig();
  if (!st.deck.length) return;
  openPicker({
    title: pickLang(ST_L("🔥 Purify Kanji (+30 円)", "🔥 소각할 한자 선택 (+30 円)", "🔥 浄化する漢字を選択 (+30 円)")),
    desc: pickLang(ST_L("Tap a kanji to burn and convert into +30 円.", "탭한 한자 1장을 가방에서 소각하고 30엔(円)을 받습니다.", "タップした漢字1枚を焼却し、30円を受け取る。")),
    cards: st.deck,
    locked: false,
    onCard: (k, idx) => {
      st.deck.splice(idx, 1);
      st.yen += 30;
      persistStoryState();
      closePicker();
      showToast(`🔥 【${k}】 ➔ 🪙 +30 円`);
      renderVillageModal();
    },
    actions: [
      { label: t("fuseCancelBtn"), onClick: () => closePicker() }
    ]
  });
}

/* Open Special Possessions viewer modal (or combined inside Bag viewer) */
function renderSpecialItemsBannerHtml() {
  if (!isStoryMode()) return "";
  const st = ensureStoryConfig();
  const uniqueIds = [...new Set(st.specialItems)];
  if (!uniqueIds.length) {
    return `<div class="sp-bag-box empty">${escapeHtml(pickLang(ST_L(
      "📿 Special Possessions: None yet (Buy Talismans from 【先】 Sensei in the Village — never lost on death!)",
      "📿 특수 소지: 없음 (마을의 선생【先】에게서 부적을 구비하면 죽어도 잃지 않습니다!)",
      "📿 特殊所持: なし（里の先生【先】から護符を求めれば死んでも失われません！）"
    )))}</div>`;
  }
  const chips = uniqueIds.map(id => {
    const def = STORY_SPECIAL_ITEMS[id];
    if (!def) return "";
    const cnt = countSpecialItem(id);
    return `<div class="sp-bag-chip tier-${def.tier}" title="${escapeHtml(pickLang(def.desc))}">
      <span class="sp-chip-kanji">【${def.kanji}】</span>
      <span class="sp-chip-name">${escapeHtml(pickLang(def.name))}${cnt > 1 ? ` ×${cnt}` : ""}</span>
    </div>`;
  }).join("");
  return `<div class="sp-bag-box">
    <div class="sp-bag-head">📿 ${escapeHtml(pickLang(ST_L("Special Possessions (Kept on Death)", "특수 소지 (사망 시 영구 보존)", "特殊所持（死亡時も保持）")))} · 🪙 ${st.yen.toLocaleString()} 円</div>
    <div class="sp-bag-list">${chips}</div>
  </div>`;
}
