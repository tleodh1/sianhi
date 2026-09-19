(function (global) {
  "use strict";
  const D = () => global.AutoBattlerData;
  let serial = 1;
  const clone = (v) => JSON.parse(JSON.stringify(v));
  const unitId = () => `au-${Date.now().toString(36)}-${serial++}`;
  const starScale = (star) => ({ 1: 1, 2: 1.7, 3: 2.65 })[star] || 1;

  function createUnit(characterId, star = 1) {
    const c = D().characters.find((x) => x.id === characterId);
    if (!c) throw new Error("Unknown character");
    const mult = starScale(star);
    return { uid: unitId(), characterId, star, items: [], hp: Math.round(c.hp * mult), maxHp: Math.round(c.hp * mult), mana: 0 };
  }

  function weightedGrade(level, rng = Math.random) {
    const odds = D().shopOdds[Math.max(0, Math.min(8, level - 1))];
    let roll = rng() * 100;
    for (let i = 0; i < odds.length; i++) { roll -= odds[i]; if (roll < 0) return i + 1; }
    return 1;
  }

  function rollShop(run, rng = Math.random) {
    run.shop = Array.from({ length: 5 }, () => {
      const grade = weightedGrade(run.level, rng);
      let choices = D().characters.filter((c) => c.grade === grade && (run.pool[c.id] || 0) > 0);
      if (!choices.length) choices = D().characters.filter((c) => (run.pool[c.id] || 0) > 0);
      const c = choices[Math.floor(rng() * choices.length)];
      return c ? { characterId: c.id, sold: false } : null;
    });
    return run.shop;
  }

  function mergeUnits(run) {
    const all = [...run.board, ...run.bench];
    const merges = [];
    for (const character of D().characters) {
      for (const star of [1, 2]) {
        let matches = all.filter((u) => u.characterId === character.id && u.star === star);
        while (matches.length >= 3) {
          const consumed = matches.splice(0, 3);
          const anchor = consumed.find((u) => run.board.includes(u)) || consumed[0];
          const location = run.board.includes(anchor) ? "board" : "bench";
          const tile = anchor.tile ? { ...anchor.tile } : null;
          const returnedItems = consumed.flatMap((u) => u.items || []);
          run.board = run.board.filter((u) => !consumed.includes(u));
          run.bench = run.bench.filter((u) => !consumed.includes(u));
          const upgraded = createUnit(character.id, star + 1);
          upgraded.items = returnedItems.slice(0, 3);
          if (location === "board" && tile) { upgraded.tile = tile; run.board.push(upgraded); }
          else run.bench.push(upgraded);
          all.splice(0, all.length, ...run.board, ...run.bench);
          matches = all.filter((u) => u.characterId === character.id && u.star === star);
          merges.push({ characterId: character.id, star: star + 1, uid: upgraded.uid });
        }
      }
    }
    return merges;
  }

  function canBuy(run, slotIndex) {
    const slot = run.shop[slotIndex];
    if (!slot || slot.sold) return { ok: false, reason: "이미 판매된 슬롯이에요." };
    const c = D().characters.find((x) => x.id === slot.characterId);
    if (run.gold < c.grade) return { ok: false, reason: "골드가 부족해요." };
    const copies = [...run.board, ...run.bench].filter((u) => u.characterId === c.id && u.star === 1).length;
    if (run.bench.length >= 9 && copies < 2) return { ok: false, reason: "벤치가 가득 찼어요." };
    return { ok: true, character: c };
  }

  function buy(run, slotIndex) {
    const check = canBuy(run, slotIndex);
    if (!check.ok) return check;
    run.gold -= check.character.grade;
    run.pool[check.character.id] = Math.max(0, (run.pool[check.character.id] || 0) - 1);
    run.shop[slotIndex].sold = true;
    const unit = createUnit(check.character.id);
    run.bench.push(unit);
    const merges = mergeUnits(run);
    return { ok: true, unit, merges };
  }

  function move(run, uid, target) {
    if (run.phase !== "PREP") return { ok: false, reason: "전투 중에는 이동할 수 없어요." };
    const fromBoard = run.board.find((u) => u.uid === uid);
    const fromBench = run.bench.find((u) => u.uid === uid);
    const unit = fromBoard || fromBench;
    if (!unit) return { ok: false, reason: "캐릭터를 찾지 못했어요." };
    if (target.type === "bench") {
      if (fromBench) return { ok: true };
      if (run.bench.length >= 9) return { ok: false, reason: "벤치가 가득 찼어요." };
      run.board = run.board.filter((u) => u.uid !== uid); delete unit.tile; run.bench.push(unit); return { ok: true };
    }
    if (target.y < 4 || target.y > 7 || target.x < 0 || target.x > 7) return { ok: false, reason: "파란색 아군 영역에 배치해 주세요." };
    const occupied = run.board.find((u) => u.tile.x === target.x && u.tile.y === target.y);
    if (occupied && occupied.uid !== uid) {
      if (fromBoard) { const old = { ...fromBoard.tile }; fromBoard.tile = { x: target.x, y: target.y }; occupied.tile = old; }
      else { run.bench = run.bench.filter((u) => u.uid !== uid); occupied.tile = null; run.board = run.board.filter((u) => u.uid !== occupied.uid); run.bench.push(occupied); unit.tile = { x: target.x, y: target.y }; run.board.push(unit); }
      return { ok: true, swapped: true };
    }
    if (!fromBoard && run.board.length >= run.level) return { ok: false, reason: `현재 레벨에는 ${run.level}명까지 배치할 수 있어요.` };
    if (fromBench) run.bench = run.bench.filter((u) => u.uid !== uid);
    if (!fromBoard) run.board.push(unit);
    unit.tile = { x: target.x, y: target.y };
    return { ok: true };
  }

  function sell(run, uid) {
    const unit = [...run.board, ...run.bench].find((u) => u.uid === uid);
    if (!unit) return { ok: false };
    const c = D().characters.find((x) => x.id === unit.characterId);
    run.gold += c.grade * Math.pow(3, unit.star - 1);
    run.equipment.push(...(unit.items || []));
    run.pool[c.id] = (run.pool[c.id] || 0) + Math.pow(3, unit.star - 1);
    run.board = run.board.filter((u) => u.uid !== uid); run.bench = run.bench.filter((u) => u.uid !== uid);
    return { ok: true };
  }

  function combine(run, a, b) {
    if (a === b || !run.inventory.includes(a) || run.inventory.filter((x) => x === a).length < (a === b ? 2 : 1) || !run.inventory.includes(b)) return null;
    const key = [a, b].sort().join("+"); const result = D().recipes[key]; if (!result) return null;
    run.inventory.splice(run.inventory.indexOf(a), 1); run.inventory.splice(run.inventory.indexOf(b), 1); run.equipment.push(result); return result;
  }

  function equip(run, uid, itemId) {
    const unit = [...run.board, ...run.bench].find((u) => u.uid === uid);
    const at = run.equipment.indexOf(itemId);
    if (!unit || at < 0 || unit.items.length >= 3) return false;
    run.equipment.splice(at, 1); unit.items.push(itemId); return true;
  }

  function buyXp(run) {
    if (run.gold < 4 || run.level >= 9) return false;
    run.gold -= 4; run.xp += 4;
    const need = 4 + run.level * 2;
    if (run.xp >= need) { run.xp -= need; run.level++; }
    return true;
  }

  function buildCombatUnit(unit, team, index, stagePower = 1) {
    const c = D().characters.find((x) => x.id === unit.characterId);
    const mult = starScale(unit.star) * stagePower;
    const equipStats = (unit.items || []).map((id) => D().equipment[id]?.stats || {}).reduce((a, x) => ({
      speed: a.speed + (x.speed || 0), shield: a.shield + (x.shield || 0), proc: a.proc + (x.proc || 0), regen: a.regen + (x.regen || 0), crit: a.crit + (x.crit || 0), attack: a.attack + (x.attack || 0),
    }), { speed: 0, shield: 0, proc: 0, regen: 0, crit: 0, attack: 0 });
    const tile = unit.tile || { x: index % 8, y: team === "player" ? 6 : 1 };
    return { ...clone(unit), team, data: c, x: tile.x, y: tile.y, tx: tile.x, ty: tile.y, hp: Math.round(c.hp * mult), maxHp: Math.round(c.hp * mult), shield: equipStats.shield, attack: Math.round(c.attack * mult * (1 + equipStats.attack)), defense: Math.round(c.defense * mult), speed: c.speed * (1 + equipStats.speed), range: c.range, mana: 0, cooldown: Math.random() * 0.4, alive: true, targetUid: null, equipStats, attacks: 0 };
  }

  function makeEnemy(stage, rng = Math.random) {
    const round = Math.max(0, D().stages.findIndex((s) => s.id === stage.id));
    const allowedGrade = Math.min(5, 1 + Math.floor(round / 3));
    const themes = [
      { name: "방어 대형", roles: ["GUARDIAN", "RANGER", "SUPPORT"] },
      { name: "돌진 대형", roles: ["FIGHTER", "ASSASSIN", "GUARDIAN"] },
      { name: "마법 대형", roles: ["MAGE", "SUPPORT", "GUARDIAN"] },
      { name: "기계 군단", trait: "Mechanical" },
      { name: "원소 연합", traits: ["Ocean", "Electric", "Fire"] },
    ];
    const theme = themes[Math.floor(rng() * themes.length)];
    const eligible = D().characters.filter((c) => c.grade <= allowedGrade);
    const themed = eligible.filter((c) => theme.trait ? c.trait === theme.trait : theme.traits ? theme.traits.includes(c.trait) : theme.roles.includes(c.role));
    const team = Array.from({ length: stage.count }, (_, i) => {
      const pool = i < themed.length && themed.length ? themed : eligible;
      const c = pool[Math.floor(rng() * pool.length)];
      const starChance = round >= 12 ? 0.72 : round >= 7 ? 0.42 : round >= 3 ? 0.18 : 0;
      const star = rng() < starChance ? (round >= 13 && rng() < 0.22 ? 3 : 2) : 1;
      const u = createUnit(c.id, star);
      const front = ["GUARDIAN", "FIGHTER"].includes(c.role);
      u.tile = { x: Math.max(0, Math.min(7, Math.round((i + 1) * 7 / (stage.count + 1)))), y: front ? 2 : i % 2 };
      if (round >= 6 && i === 0) u.items.push(round >= 12 ? "cannon" : "barrier");
      if (round >= 10 && i === 1) u.items.push("rapid");
      return u;
    });
    team.composition = theme.name;
    return team;
  }

  global.AutoBattlerEngine = { createUnit, weightedGrade, rollShop, mergeUnits, canBuy, buy, move, sell, combine, equip, buyXp, buildCombatUnit, makeEnemy, starScale };
})(window);
