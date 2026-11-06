/*
 * One modal for every "choose a kanji" moment:
 *  - Stage card scavenge (multi-select up to 5 cards in a single centered row)
 *  - Spoils / event picks (add / burn / copy)
 *  - Read-only bag (deck) viewer
 */

let pickerOnClose = null;

function openPicker({ title, desc = "", specialHtml = "", cards, onCard = null, multiSelect = false, selectedIndices = [], showOrderBadge = false, actions = [], locked = false, onClose = null }) {
  const modal = $("pick-modal");
  pickerOnClose = onClose;
  modal.dataset.locked = locked ? "1" : "";
  $("pick-title").textContent = title;
  const spWrap = $("pick-special-wrap");
  if (spWrap) {
    spWrap.innerHTML = specialHtml || "";
    spWrap.style.display = specialHtml ? "" : "none";
  }
  $("pick-desc").textContent = desc;
  $("pick-desc").style.display = desc ? "" : "none";
  $("pick-close").style.display = locked ? "none" : "";

  const grid = $("pick-grid");
  grid.innerHTML = "";
  grid.classList.toggle("readonly", !onCard && !multiSelect);

  cards.forEach((k, i) => {
    const tile = document.createElement("button");
    const tier = typeof getKanjiTier === "function" ? getKanjiTier(k) : "edu";
    const orderIdx = selectedIndices.indexOf(i);
    const isSel = orderIdx >= 0;
    const charLen = [...String(k)].length;
    tile.className = `pick-tile tier-${tier}${isSel ? " selected" : ""}${charLen > 1 ? " multi" : ""}${charLen >= 3 ? " multi-long" : ""}`;
    tile.dataset.len = String(Math.min(8, Math.max(1, charLen)));
    tile.style.setProperty("--char-len", String(Math.max(1, charLen)));
    if (isSel && showOrderBadge) {
      tile.dataset.order = String(orderIdx + 1);
    }
    tile.textContent = k;
    if (onCard) {
      tile.onclick = () => { playClickSfx(); onCard(k, i, tile); };
    } else {
      tile.disabled = true;
    }
    grid.appendChild(tile);
  });

  const bar = $("pick-actions");
  bar.innerHTML = "";
  actions.forEach(({ label, onClick, gold }) => {
    const b = document.createElement("button");
    b.className = `btn${gold ? " btn-gold" : ""}`;
    b.textContent = label;
    b.onclick = () => { playClickSfx(); onClick(); };
    bar.appendChild(b);
  });
  openModal("pick-modal");
}

/* Programmatic close (after a choice) — does not fire onClose. */
function closePicker() {
  pickerOnClose = null;
  closeModal("pick-modal");
}

/* Player dismissed the picker (✕ / ESC / back). */
function dismissPicker() {
  const cb = pickerOnClose;
  closePicker();
  if (cb) cb();
}

/* ---- Bag (Deck) viewer ---- */

function openDeckViewer() {
  playClickSfx();
  closeDropdowns();
  const storyMode = typeof isStoryMode === "function" && isStoryMode();
  const bagSource = (storyMode && (!state.active || state.gameMode !== "story"))
    ? ((config.story && config.story.deck) || [])
    : (state.deck || []);
  const sorted = [...bagSource].sort((a, b) => a.localeCompare(b, "ja"));
  const desc = sorted.length === 0
    ? t("bagEmptyDesc")()
    : t("bagDesc")();
  const specialHtml = (storyMode && typeof renderSpecialItemsBannerHtml === "function")
    ? renderSpecialItemsBannerHtml()
    : "";
  openPicker({
    title: t("deckTitle")(sorted.length),
    specialHtml,
    desc,
    cards: sorted
  });
}

/* ---- Battle Left Pile: 使用 (Discard / Used Pile) viewer ---- */

function openDiscardPileViewer() {
  playClickSfx();
  closeDropdowns();
  const raw = Array.isArray(state.discard) ? state.discard : [];
  const cards = raw.map(c => (typeof c === "string" ? c : c.kanji)).filter(Boolean);
  const titleText = pickLang({
    EN: `【使用 — Used Pile (${cards.length})】`,
    KO: `【사용(使用) — 사용한 패 (${cards.length}장)】`,
    JA: `【使用 — 捨て札 (${cards.length}枚)】`,
    ZH_CN: `【使用 — 弃牌堆 (${cards.length}张)】`,
    ZH_TW: `【使用 — 棄牌堆 (${cards.length}張)】`
  });
  const descText = cards.length
    ? pickLang({
        EN: `Cards discarded from previous turns or rerolls. When the right Draw Pile (所持) runs out, all cards here are shuffled back into 所持.`,
        KO: `이전 턴이나 리롤로 지나간 한자 패입니다. 우측의 소지(所持) 패를 모두 뽑으면, 이곳의 패가 다시 섞여 우측 소지(所持)로 들어갑니다.`,
        JA: `前のターンや引き直しで送られた漢字札です。右側の所持（山札）をすべて引き切ると、ここの札が再び混ざって所持に戻ります。`,
        ZH_CN: `上一回合或重掷后进入此处的汉字牌。当右侧所持（抽牌堆）抽空时，此处的牌会重新洗回右侧所持。`,
        ZH_TW: `上一回合或重擲後進入此處的漢字牌。當右側所持（抽牌堆）抽空時，此處的牌會重新洗回右側所持。`
      })
    : pickLang({
        EN: `No used cards yet. Cards from finished turns or rerolls gather here, then shuffle back into the right Draw Pile (所持) when it empties.`,
        KO: `아직 사용한 패가 없습니다. 턴이 끝나거나 리롤을 하면 중앙의 5장 패가 이곳으로 이동하며, 우측 소지(所持)를 다 뽑으면 다시 소지로 들어갑니다.`,
        JA: `まだ使用した札はありません。ターン終了や引き直しで手札5枚がここへ移動し、右側の所持を引き切ると再び所持へ戻ります。`,
        ZH_CN: `尚无已使用的牌。回合结束或重掷时中央的5张手牌会移至此处，右侧所持抽空后将洗回所持。`,
        ZH_TW: `尚無已使用的牌。回合結束或重擲時中央的5張手牌會移至此處，右側所持抽空後將洗回所持。`
      });
  openPicker({
    title: titleText,
    desc: descText,
    cards
  });
}

/* ---- Battle Right Pile: 所持 (Draw Pile) viewer ---- */

function openDrawPileViewer() {
  playClickSfx();
  closeDropdowns();
  const raw = Array.isArray(state.drawPile) ? state.drawPile : [];
  const cards = raw
    .map(c => (typeof c === "string" ? c : c.kanji))
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, "ja"));
  const titleText = pickLang({
    EN: `【所持 — Draw Pile (${cards.length})】`,
    KO: `【소지(所持) — 뽑을 패 (${cards.length}장)】`,
    JA: `【所持 — 山札 (${cards.length}枚)】`,
    ZH_CN: `【所持 — 抽牌堆 (${cards.length}张)】`,
    ZH_TW: `【所持 — 抽牌堆 (${cards.length}張)】`
  });
  const descText = cards.length
    ? pickLang({
        EN: `Remaining cards waiting to be drawn (Stage 【${state.sign || "門"}】 cards + your Bag cards, shown in sorted order). When all cards here are drawn, the left Used Pile (使用) shuffles back in.`,
        KO: `앞으로 뽑히게 될 남은 한자 패입니다 (스테이지 【${state.sign || "門"}】 환경 한자 + 내 가방 한자 · 순서 비공개 정렬). 이 패를 모두 뽑으면 좌측 사용(使用) 패가 다시 섞여 들어옵니다.`,
        JA: `これから引かれる残りの漢字札です（ステージ【${state.sign || "門"}】環境漢字＋所持袋の漢字・順不同表示）。すべて引き切ると左側の使用札が再び混ざって戻ります。`,
        ZH_CN: `等待抽取的剩余汉字牌（关卡【${state.sign || "門"}】环境汉字＋行囊汉字，按字序排列）。全部抽完后，左侧使用牌堆会重新洗回此处。`,
        ZH_TW: `等待抽取的剩餘漢字牌（關卡【${state.sign || "門"}】環境漢字＋行囊漢字，按字序排列）。全部抽完後，左側使用牌堆會重新洗回此處。`
      })
    : pickLang({
        EN: `All cards in the Draw Pile (所持) have been drawn! On the next turn or reroll, the left Used Pile (使用: ${(state.discard || []).length}) will be shuffled back into 所持.`,
        KO: `우측 소지(所持)의 패를 모두 뽑았습니다! 다음 턴이나 리롤 시 좌측 사용(使用: ${(state.discard || []).length}장) 패가 다시 섞여 이곳으로 들어옵니다.`,
        JA: `右側の所持（山札）をすべて引き切りました！次のターンまたは引き直し時に、左側の使用札（${(state.discard || []).length}枚）が再び混ざってここに戻ります。`,
        ZH_CN: `右侧所持已全部抽完！下一回合或重掷时，左侧使用牌堆（${(state.discard || []).length}张）将重新洗回此处。`,
        ZH_TW: `右側所持已全部抽完！下一回合或重擲時，左側使用牌堆（${(state.discard || []).length}張）將重新洗回此處。`
      });
  openPicker({
    title: titleText,
    desc: descText,
    cards
  });
}

/* ---- Stage Environment Cards viewer (triggered by clicking top-right #b-sign) ---- */

function openStageCardsViewer() {
  playClickSfx();
  closeDropdowns();
  const currentSign = state.sign || (state.depthId === "depth_0" ? "里" : "門");
  const signDef = STAGE_SIGNS[currentSign];
  const omenText = signDef && signDef.omen ? pickLang(signDef.omen) : "";

  if (state.depthId === "depth_0") {
    const villageTitle = pickLang({
      EN: `🏮 【${currentSign}】 ${t("villageNodeTitle")}`,
      KO: `🏮 【${currentSign}】 ${t("villageNodeTitle")}`,
      JA: `🏮 【${currentSign}】 ${t("villageNodeTitle")}`,
      ZH_CN: `🏮 【${currentSign}】 ${t("villageNodeTitle")}`,
      ZH_TW: `🏮 【${currentSign}】 ${t("villageNodeTitle")}`
    });
    const villageDesc = pickLang({
      EN: `${omenText ? omenText + " — " : ""}A safe sanctuary outside the Gaols. Enter a Gaol stage to draw environment kanji cards.`,
      KO: `${omenText ? omenText + " — " : ""}옥문 밖의 안전한 거점입니다. 옥문 스테이지에 진입하면 해당 지형의 스테이지 한자 카드가 패에 섞여 들어옵니다.`,
      JA: `${omenText ? omenText + " — " : ""}獄門の外にある安全な拠点です。獄門のステージへ進むと、その地形のステージ漢字札が山札に加わります。`,
      ZH_CN: `${omenText ? omenText + " — " : ""}狱门外的安全据点。进入狱门关卡后，该地形的关卡汉字牌会混入牌堆。`,
      ZH_TW: `${omenText ? omenText + " — " : ""}獄門外的安全據點。進入獄門關卡後，該地形的關卡漢字牌會混入牌堆。`
    });
    openPicker({
      title: villageTitle,
      desc: villageDesc,
      cards: signDef && Array.isArray(signDef.cards) ? signDef.cards : ["里", "家", "灯", "休"]
    });
    return;
  }

  if ((!state.stageCards || !state.stageCards.length) && state.sign && typeof buildStageCards === "function") {
    state.stageCards = buildStageCards(state.depthId, state.sign);
  }

  const stageCards = (state.stageCards && state.stageCards.length)
    ? [...state.stageCards]
    : (signDef && Array.isArray(signDef.cards) ? signDef.cards.slice(0, 10) : []);

  const titleText = pickLang({
    EN: `🎴 Stage 【${currentSign}】 Cards (${stageCards.length})`,
    KO: `🎴 스테이지 【${currentSign}】 환경 한자 (${stageCards.length}장)`,
    JA: `🎴 ステージ【${currentSign}】環境漢字 (${stageCards.length}枚)`,
    ZH_CN: `🎴 关卡【${currentSign}】环境汉字 (${stageCards.length}张)`,
    ZH_TW: `🎴 關卡【${currentSign}】環境漢字 (${stageCards.length}張)`
  });

  const descText = stageCards.length
    ? pickLang({
        EN: `${omenText ? omenText + " · " : ""}These environment kanji cards from stage 【${currentSign}】 are shuffled with your bag cards during battle.`,
        KO: `${omenText ? omenText + " · " : ""}현재 스테이지 【${currentSign}】에서 제공하는 환경 한자 카드입니다. 전투 시 챙긴 한자(가방)와 합쳐져 매 턴 무작위로 드로우됩니다.`,
        JA: `${omenText ? omenText + " · " : ""}現在のステージ【${currentSign}】に宿る環境漢字札です。戦闘時、所持漢字と混ざって毎ターン無作為に引かれます。`,
        ZH_CN: `${omenText ? omenText + " · " : ""}当前关卡【${currentSign}】提供的环境汉字牌。战斗时会与行囊中的汉字混合抽取。`,
        ZH_TW: `${omenText ? omenText + " · " : ""}當前關卡【${currentSign}】提供的環境漢字牌。戰鬥時會與行囊中的漢字混合抽取。`
      })
    : pickLang({
        EN: `Choose a path ahead to enter a stage and draw its environment kanji cards.`,
        KO: `갈림길에서 다음 스테이지로 발을 들이면 해당 지형의 환경 한자 카드가 생성됩니다.`,
        JA: `岐路から次のステージへ足を踏み入れると、その地形の環境漢字札が生成されます。`,
        ZH_CN: `在岔路选择下一关卡后，将生成该地形的环境汉字牌。`,
        ZH_TW: `在岔路選擇下一關卡後，將生成該地形的環境漢字牌。`
      });

  openPicker({
    title: titleText,
    desc: descText,
    cards: stageCards
  });
}

