(function (global) {
  "use strict";
  const D = () => global.AutoBattlerData, E = () => global.AutoBattlerEngine, S = () => global.AutoBattlerStorage;
  let run, record, view, selectedUid = null, dragUid = null, itemA = null, battleLog = [];
  const char = (id) => D().characters.find((c) => c.id === id);
  const unitById = (uid) => [...run.board, ...run.bench].find((u) => u.uid === uid);
  const stars = (n) => "★".repeat(n);

  function persist() { record.activeRun = JSON.parse(JSON.stringify(run)); S().saveRecord(record); }
  function notifyGame(message, tone = "info") { const n = document.querySelector(".autoToast"); if (!n) return; n.textContent = message; n.dataset.tone = tone; n.classList.add("show"); clearTimeout(notifyGame.timer); notifyGame.timer = setTimeout(() => n.classList.remove("show"), 2300); }
  function stage() { return D().stages[run.stageIndex % D().stages.length]; }
  function phaseLabel() { return run.phase === "BATTLE" ? "자동 전투" : run.phase === "RESULT" ? "전투 결과" : "배치 준비"; }

  function baseMarkup() {
    return `<section class="autoGame" aria-label="시안Hi 스타 보드">
      <header class="autoTopbar"><div class="autoTitle"><span class="autoLogo">✦</span><div><small>SIANHI ORIGINAL</small><b>스타 보드</b></div></div><div class="autoRound"><small>${stage().type}</small><b>${stage().id}</b><span>${phaseLabel()}</span></div><div class="autoStats"><span title="플레이어 체력">♥ <b data-stat="hp">${run.playerHp}</b></span><span title="골드">● <b data-stat="gold">${run.gold}</b></span><span title="레벨">LV.<b data-stat="level">${run.level}</b></span></div></header>
      <div class="autoLayout">
        <aside class="autoSide autoInventory"><div class="autoPanelTitle"><b>모듈 공방</b><small>재료 2개를 선택</small></div><div class="materialGrid" data-materials></div><div class="recipePreview" data-recipe><span>＋</span><small>조합할 재료를 골라요</small></div><button class="autoAction combine" data-action="combine" disabled>조합</button><div class="equipmentList" data-equipment></div></aside>
        <main class="autoArenaWrap"><div class="autoCanvas" data-auto-canvas></div><button class="mobilePanelToggle craft" data-panel="craft">공방</button><button class="mobilePanelToggle info" data-panel="info">정보</button><div class="arenaHint" data-arena-hint>벤치 캐릭터를 드래그해 파란 칸에 놓아 보세요</div><div class="combatBanner" data-combat-banner hidden></div><div class="synergyBar" data-synergies></div></main>
        <aside class="autoSide autoInfo"><div class="autoPanelTitle"><b>캐릭터 정보</b><small>캐릭터를 선택</small></div><div data-unit-info class="unitInfo empty">보드나 벤치에서<br>캐릭터를 눌러 보세요.</div><div class="autoEconomy"><button data-action="xp"><span>경험치 +4</span><b>4 Gold</b></button><progress data-xp value="${run.xp}" max="${4 + run.level * 2}"></progress></div><button class="autoBattleButton" data-action="battle"><span>⚔</span><b>전투 시작</b><small>${run.board.length} / ${run.level} 배치</small></button></aside>
      </div>
      <section class="autoShop"><div class="shopHeading"><div><small>LEVEL ${run.level} 상점</small><b>스타 마켓</b></div><button data-action="refresh">↻ 새로고침 <strong>2</strong></button></div><div class="shopCards" data-shop></div></section>
      <section class="autoBench"><div class="benchLabel"><small>대기석</small><b><span data-bench-count>${run.bench.length}</span> / 9</b></div><div class="benchSlots" data-bench></div></section>
      <div class="autoToast" role="status"></div><div class="autoTutorial" data-tutorial hidden></div>
    </section>`;
  }

  function rarity(c) { return `<span class="rarity grade${c.grade}">${c.grade}급</span>`; }
  function shopMarkup() {
    return run.shop.map((slot, i) => {
      if (!slot || slot.sold) return `<button class="shopCard sold" disabled><span>구매 완료</span></button>`;
      const c = char(slot.characterId), role = D().roles[c.role], trait = D().traits[c.trait];
      return `<button class="shopCard grade${c.grade}" data-buy="${i}" style="--unit:${c.color}"><span class="shopPortrait"><i class="miniBot"><u></u><em></em></i></span><span class="shopCopy">${rarity(c)}<b>${c.name}</b><small><i style="--role:${role.color}"></i>${role.ko} · ${trait.ko}</small></span><strong>● ${c.grade}</strong></button>`;
    }).join("");
  }
  function unitToken(u, location) { const c = char(u.characterId); return `<button class="unitToken grade${c.grade} ${selectedUid === u.uid ? "selected" : ""}" draggable="true" data-unit="${u.uid}" data-location="${location}" style="--unit:${c.color}" aria-label="${c.name} ${u.star}성 선택"><i class="tokenBot"><u></u><em></em></i><span>${stars(u.star)}</span><b>${c.name}</b>${u.items.length ? `<small>${u.items.map((id) => D().equipment[id].icon).join("")}</small>` : ""}</button>`; }

  function renderBench() { const el = document.querySelector("[data-bench]"); if (!el) return; el.innerHTML = Array.from({ length: 9 }, (_, i) => run.bench[i] ? unitToken(run.bench[i], "bench") : `<div class="benchSlot"><span>${i + 1}</span></div>`).join(""); document.querySelector("[data-bench-count]").textContent = run.bench.length; bindUnitTokens(); }
  function renderShop() { const el = document.querySelector("[data-shop]"); if (!el) return; el.innerHTML = shopMarkup(); el.querySelectorAll("[data-buy]").forEach((b) => b.onclick = () => buy(Number(b.dataset.buy))); }
  function renderInventory() {
    const mats = document.querySelector("[data-materials]"), equips = document.querySelector("[data-equipment]"); if (!mats) return;
    mats.innerHTML = Object.values(D().materials).map((m) => { const count = run.inventory.filter((id) => id === m.id).length; return `<button data-material="${m.id}" ${!count ? "disabled" : ""} class="material ${itemA === m.id ? "selected" : ""}" style="--item:${m.color}"><i>${m.icon}</i><span>${m.name}</span><b>${count}</b></button>`; }).join("");
    equips.innerHTML = `<h3>완성 장비</h3>${run.equipment.length ? run.equipment.map((id, i) => { const it = D().equipment[id]; return `<button class="equipment" draggable="true" data-equip="${id}" data-equip-index="${i}"><i>${it.icon}</i><span><b>${it.name}</b><small>${it.text}</small></span></button>`; }).join("") : `<p>재료를 조합하면 장비가 생겨요.</p>`}`;
    mats.querySelectorAll("[data-material]").forEach((b) => b.onclick = () => chooseMaterial(b.dataset.material));
    equips.querySelectorAll("[data-equip]").forEach((b) => { b.onclick = () => { if (!selectedUid) return notifyGame("먼저 장착할 캐릭터를 선택해 주세요."); equipSelected(b.dataset.equip); }; b.ondragstart = (e) => e.dataTransfer.setData("text/equipment", b.dataset.equip); });
  }
  function chooseMaterial(id) {
    if (!itemA) { itemA = id; document.querySelector("[data-recipe]").innerHTML = `<i style="--item:${D().materials[id].color}">${D().materials[id].icon}</i><span>＋</span><small>두 번째 재료를 골라요</small>`; }
    else { const result = D().recipes[[itemA, id].sort().join("+")]; document.querySelector("[data-recipe]").innerHTML = result ? `<i>${D().materials[itemA].icon}</i><span>＋</span><i>${D().materials[id].icon}</i><b>→ ${D().equipment[result].name}</b>` : `<span>?</span><small>이 조합은 아직 발견되지 않았어요</small>`; document.querySelector("[data-action=combine]").disabled = !result; document.querySelector("[data-action=combine]").dataset.second = id; }
    renderInventorySelection();
  }
  function renderInventorySelection() { document.querySelectorAll("[data-material]").forEach((b) => b.classList.toggle("selected", b.dataset.material === itemA)); }
  function combine() { const second = document.querySelector("[data-action=combine]").dataset.second; const result = E().combine(run, itemA, second); if (result) { notifyGame(`${D().equipment[result].name} 완성!`, "success"); itemA = null; renderInventory(); persist(); } }
  function equipSelected(itemId) { if (E().equip(run, selectedUid, itemId)) { notifyGame("장비를 장착했어요!", "success"); renderAll(); persist(); } else notifyGame("장비 슬롯은 3칸까지예요."); }

  function renderInfo() {
    const el = document.querySelector("[data-unit-info]"); const u = unitById(selectedUid); if (!u) { el.className = "unitInfo empty"; el.innerHTML = "보드나 벤치에서<br>캐릭터를 눌러 보세요."; return; }
    const c = char(u.characterId), scale = E().starScale(u.star); el.className = "unitInfo";
    el.innerHTML = `<div class="infoHero" style="--unit:${c.color}"><i class="bigBot"><u></u><em></em></i><div>${rarity(c)}<h3>${c.name}</h3><strong>${stars(u.star)}</strong></div></div><div class="infoTags"><span>${D().roles[c.role].ko}</span><span>${D().traits[c.trait].ko}</span></div><dl><div><dt>체력</dt><dd>${Math.round(c.hp * scale)}</dd></div><div><dt>공격</dt><dd>${Math.round(c.attack * scale)}</dd></div><div><dt>방어</dt><dd>${Math.round(c.defense * scale)}</dd></div><div><dt>사거리</dt><dd>${c.range}</dd></div></dl><article><small>고유 스킬</small><b>${c.skillName}</b></article><div class="equippedSlots">${[0,1,2].map((i) => u.items[i] ? `<span title="${D().equipment[u.items[i]].name}">${D().equipment[u.items[i]].icon}</span>` : `<span>＋</span>`).join("")}</div><button class="sellUnit" data-action="sell">판매 · ${c.grade * Math.pow(3, u.star - 1)} Gold</button>`;
    el.querySelector("[data-action=sell]").onclick = () => { if ((u.star === 3 || c.grade === 5 || u.items.length) && !confirm(`${c.name}을(를) 판매할까요? 장비는 공방으로 돌아옵니다.`)) return; E().sell(run, u.uid); selectedUid = null; notifyGame("판매했어요."); renderAll(); persist(); };
    el.ondragover = (e) => { if (e.dataTransfer.types.includes("text/equipment")) e.preventDefault(); }; el.ondrop = (e) => { e.preventDefault(); equipSelected(e.dataTransfer.getData("text/equipment")); };
  }
  function renderSynergies() { const counts = {}; run.board.forEach((u) => { const t = char(u.characterId).trait; counts[t] = (counts[t] || 0) + 1; }); const el = document.querySelector("[data-synergies]"); el.innerHTML = Object.entries(counts).map(([id, count]) => { const t = D().traits[id], active = count >= t.tiers[0]; return `<span class="${active ? "active" : ""}" style="--trait:${t.color}"><i>⬡</i><b>${t.ko}</b><small>${count}/${t.tiers[0]}</small></span>`; }).join("") || `<small>캐릭터를 배치하면 팀 시너지가 나타나요</small>`; }
  function renderStats() { document.querySelector("[data-stat=hp]").textContent = run.playerHp; document.querySelector("[data-stat=gold]").textContent = run.gold; document.querySelector("[data-stat=level]").textContent = run.level; const xp = document.querySelector("[data-xp]"); xp.value = run.xp; xp.max = 4 + run.level * 2; const btn = document.querySelector("[data-action=battle]"); btn.querySelector("small").textContent = `${run.board.length} / ${run.level} 배치`; btn.disabled = run.phase !== "PREP"; }
  function renderAll() { renderShop(); renderBench(); renderInventory(); renderInfo(); renderSynergies(); renderStats(); view?.setPlanningUnits(run.board); }
  function selectUnit(uid) { selectedUid = uid; run.selectedUnit = uid; renderInfo(); document.querySelectorAll("[data-unit]").forEach((b) => b.classList.toggle("selected", b.dataset.unit === uid)); view.select(uid); }
  function bindUnitTokens() { document.querySelectorAll("[data-unit]").forEach((b) => { b.onclick = () => selectUnit(b.dataset.unit); b.ondragstart = (e) => { dragUid = b.dataset.unit; e.dataTransfer.setData("text/unit", dragUid); view.highlight(true); }; b.ondragend = () => { dragUid = null; view.highlight(false); }; b.onpointerdown = () => { dragUid = b.dataset.unit; view.highlight(true); }; }); }

  function buy(index) { const result = E().buy(run, index); if (!result.ok) return notifyGame(result.reason); if (result.merges.length) { const c = char(result.merges[0].characterId); notifyGame(`${c.name} ${stars(result.merges[0].star)} 승급!`, "success"); document.querySelector(".autoGame").classList.add("mergeFlash"); setTimeout(() => document.querySelector(".autoGame")?.classList.remove("mergeFlash"), 700); } else notifyGame(`${char(result.unit.characterId).name}이(가) 벤치에 합류!`, "success"); record.collection[result.unit.characterId] = true; renderAll(); persist(); }
  function refresh() { if (run.phase !== "PREP") return; if (run.gold < 2) return notifyGame("골드가 부족해요."); run.gold -= 2; E().rollShop(run); renderAll(); persist(); }
  function buyXp() { if (!E().buyXp(run)) return notifyGame(run.level >= 9 ? "최고 레벨이에요!" : "골드가 부족해요."); notifyGame(`레벨 ${run.level} · 최대 ${run.level}명 배치`, "success"); renderAll(); persist(); }
  function moveTo(uid, tile) { const result = E().move(run, uid, { type: "board", ...tile }); if (!result.ok) notifyGame(result.reason); else { selectUnit(uid); renderAll(); persist(); } }
  function moveToBench(uid) { const result = E().move(run, uid, { type: "bench" }); if (!result.ok) notifyGame(result.reason); else { renderAll(); persist(); } }

  function startBattle() {
    if (!run.board.length) return notifyGame("캐릭터를 한 명 이상 배치해 주세요.");
    run.phase = "BATTLE"; battleLog = []; document.querySelector(".autoGame").classList.add("inBattle"); document.querySelector("[data-arena-hint]").textContent = "캐릭터들이 스스로 목표를 찾고 싸우고 있어요"; renderStats();
    const enemy = E().makeEnemy(stage()); view.stagePower = stage().power; view.startBattle(run.board, enemy);
    const banner = document.querySelector("[data-combat-banner]"); banner.hidden = false; banner.innerHTML = `<small>${stage().type}</small><b>BATTLE</b>`; setTimeout(() => banner.hidden = true, 1200);
  }
  function battleEnd(won) {
    run.phase = "RESULT"; document.querySelector(".autoGame").classList.remove("inBattle"); const current = stage(), banner = document.querySelector("[data-combat-banner]"); banner.hidden = false;
    if (won) { const gain = current.reward + Math.min(3, Math.max(0, run.streak)); run.gold += gain; run.streak++; run.xp += 2; run.inventory.push(Object.keys(D().materials)[Math.floor(Math.random() * 6)]); run.stageIndex++; record.wins++; record.bestStage = Math.max(record.bestStage, run.stageIndex + 1); banner.innerHTML = `<small>라운드 승리</small><b>VICTORY</b><span>+${gain} Gold · 재료 획득</span>`; }
    else { run.playerHp = Math.max(0, run.playerHp - Math.max(2, current.count - 1)); run.streak = 0; banner.innerHTML = `<small>다시 준비해요</small><b>DEFEAT</b><span>플레이어 체력 ${run.playerHp}</span>`; }
    record.games++;
    if (run.playerHp <= 0 || run.stageIndex >= D().stages.length) { record.activeRun = null; S().saveRecord(record); setTimeout(() => endRun(run.playerHp > 0), 2200); return; }
    persist(); setTimeout(nextPrep, 2200);
  }
  function nextPrep() { run.phase = "PREP"; run.result = null; E().rollShop(run); document.querySelector("[data-combat-banner]").hidden = true; document.querySelector("[data-arena-hint]").textContent = "새 전투를 준비하세요 · 캐릭터와 장비를 강화할 시간!"; const round = document.querySelector(".autoRound"); round.innerHTML = `<small>${stage().type}</small><b>${stage().id}</b><span>${phaseLabel()}</span>`; renderAll(); persist(); }
  function endRun(won) { const root = document.querySelector(".autoGame"); root.innerHTML = `<section class="autoEnd"><span>${won ? "🏆" : "✦"}</span><small>${won ? "16개 라운드 완주" : "이번 모험 기록"}</small><h2>${won ? "스타 보드 챔피언!" : `${stage().id}까지 도전했어요`}</h2><p>수집한 캐릭터와 최고 기록은 안전하게 남아 있어요.</p><button data-new-run>새 모험 시작</button><button data-close-run>게임 월드로</button></section>`; root.querySelector("[data-new-run]").onclick = () => { run = S().createRun(); E().rollShop(run); record.activeRun = run; persist(); mount(); }; root.querySelector("[data-close-run]").onclick = () => global.closeGame(); }

  function bindArena() {
    const canvas = document.querySelector("[data-auto-canvas]"); canvas.ondragover = (e) => { if (e.dataTransfer.types.includes("text/unit")) e.preventDefault(); }; canvas.ondrop = (e) => { e.preventDefault(); const tile = view.pickTile(e.clientX, e.clientY); if (tile) moveTo(e.dataTransfer.getData("text/unit"), tile); view.highlight(false); };
    canvas.onclick = (e) => { if (dragUid || run.phase !== "PREP") return; const uid = view.pickUnit(e.clientX, e.clientY); if (uid) selectUnit(uid); };
    const bench = document.querySelector("[data-bench]"); bench.ondragover = (e) => { if (e.dataTransfer.types.includes("text/unit")) e.preventDefault(); }; bench.ondrop = (e) => { e.preventDefault(); moveToBench(e.dataTransfer.getData("text/unit")); };
    const pointerMove = (e) => { if (dragUid) e.preventDefault(); };
    const pointerUp = (e) => { if (!dragUid || run.phase !== "PREP") return; const rect = canvas.getBoundingClientRect(); if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) { const tile = view.pickTile(e.clientX, e.clientY); if (tile) moveTo(dragUid, tile); } dragUid = null; view.highlight(false); };
    document.addEventListener("pointermove", pointerMove, { passive: false }); document.addEventListener("pointerup", pointerUp); global.Session?.cleanup(() => { document.removeEventListener("pointermove", pointerMove); document.removeEventListener("pointerup", pointerUp); });
    document.querySelectorAll("[data-panel]").forEach((b) => b.onclick = () => { const target = b.dataset.panel === "craft" ? document.querySelector(".autoInventory") : document.querySelector(".autoInfo"); const open = target.classList.toggle("open"); document.querySelectorAll(".autoSide").forEach((side) => { if (side !== target) side.classList.remove("open"); }); b.setAttribute("aria-expanded", String(open)); });
  }
  function showTutorial() { if (record.tutorialSeen) return; const el = document.querySelector("[data-tutorial]"); el.hidden = false; el.innerHTML = `<div><small>첫 번째 스타 보드</small><h2>세 단계만 기억해요!</h2><ol><li><b>1</b>상점에서 캐릭터 구매</li><li><b>2</b>벤치에서 파란 보드로 배치</li><li><b>3</b>전투 시작 — 이제 친구들이 스스로 싸워요</li></ol><button>모험 시작</button></div>`; el.querySelector("button").onclick = () => { el.hidden = true; record.tutorialSeen = true; persist(); }; }
  function mount() {
    if (view) view.destroy(); gameBody.innerHTML = baseMarkup();
    view = global.AutoBattlerRenderer.create(document.querySelector("[data-auto-canvas]"), { get stagePower() { return stage().power; }, onBattleEnd: battleEnd, onCombatEvent(e) { battleLog.push(e.type); } });
    document.querySelector("[data-action=refresh]").onclick = refresh; document.querySelector("[data-action=xp]").onclick = buyXp; document.querySelector("[data-action=combine]").onclick = combine; document.querySelector("[data-action=battle]").onclick = startBattle;
    bindArena(); renderAll(); showTutorial(); global.Session?.cleanup(() => view?.destroy());
  }
  function play() { record = S().get(); run = record.activeRun && record.activeRun.playerHp > 0 ? JSON.parse(JSON.stringify(record.activeRun)) : S().createRun(); if (!run.shop?.length) E().rollShop(run); run.phase = "PREP"; selectedUid = run.selectedUnit; persist(); mount(); }
  global.playAutoBattler = play;
})(window);
