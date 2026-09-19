(function (global) {
  "use strict";
  const D = () => global.AutoBattlerData;
  const E = () => global.AutoBattlerEngine;

  function createFallback(container, hooks = {}) {
    container.classList.add("fallbackArena");
    container.innerHTML = `<div class="fallbackGrid">${Array.from({ length: 64 }, (_, i) => `<button data-tile="${i % 8},${Math.floor(i / 8)}" class="${i >= 32 ? "friendly" : "enemy"}" aria-label="${i >= 32 ? "아군" : "적군"} 칸"></button>`).join("")}</div><div class="fallbackUnits"></div>`;
    const layer = container.querySelector(".fallbackUnits"), tiles = [...container.querySelectorAll("[data-tile]")];
    let unitMap = new Map(), timer = null, selected = null;
    const pos = (x, y) => ({ left: `${(x + .5) * 12.5}%`, top: `${(y + .5) * 12.5}%` });
    function token(unit, team) { const c = unit.data || D().characters.find((x) => x.id === unit.characterId), b = document.createElement("button"); b.className = `fallbackUnit ${team}`; b.dataset.uid = unit.uid; b.style.setProperty("--unit", c.color); b.innerHTML = `<i></i><span>${"★".repeat(unit.star)}</span><b>${c.name}</b><progress value="${unit.hp || unit.maxHp || c.hp}" max="${unit.maxHp || c.hp}"></progress>`; const p = pos(unit.x ?? unit.tile.x, unit.y ?? unit.tile.y); Object.assign(b.style, p); layer.appendChild(b); unitMap.set(unit.uid, { root: b, unit }); return b; }
    function clear() { layer.innerHTML = ""; unitMap.clear(); if (timer) clearInterval(timer); }
    function setPlanningTeams(player, enemy) { clear(); player.filter((u) => u.tile).forEach((u) => token(u, "player")); enemy.filter((u) => u.tile).forEach((u) => token(u, "enemy")); }
    function startBattle(player, enemy) {
      clear(); const combat = [...player.map((u, i) => E().buildCombatUnit(u, "player", i)), ...enemy.map((u, i) => E().buildCombatUnit(u, "enemy", i, hooks.stagePower || 1))]; combat.forEach((u) => token(u, u.team)); let ticks = 0;
      timer = setInterval(() => { ticks++; const aliveP = combat.filter((u) => u.alive && u.team === "player"), aliveE = combat.filter((u) => u.alive && u.team === "enemy"); hooks.onCombatState?.(aliveP.length, aliveE.length); if (!aliveP.length || !aliveE.length || ticks > 32) { clearInterval(timer); timer = null; hooks.onBattleEnd?.(aliveP.length >= aliveE.length, combat); return; } for (const u of [...aliveP, ...aliveE]) { const targets = u.team === "player" ? aliveE : aliveP, target = targets[Math.floor(Math.random() * targets.length)]; if (!target) continue; const attacker = unitMap.get(u.uid)?.root, victim = unitMap.get(target.uid)?.root; attacker?.classList.add("attacking"); setTimeout(() => attacker?.classList.remove("attacking"), 180); const dealt = Math.max(8, u.attack - target.defense * .25); target.hp -= dealt; target.mana += 28; victim?.classList.add("hit"); const number = document.createElement("em"); number.className = "floatNumber damage"; number.textContent = `-${Math.round(dealt)}`; victim?.appendChild(number); setTimeout(() => { victim?.classList.remove("hit"); number.remove(); }, 520); const bar = victim?.querySelector("progress"); if (bar) bar.value = Math.max(0, target.hp); hooks.onCombatEvent?.({ type: target.mana >= 100 ? "skill" : (u.range > 1 ? "projectile" : "damage"), source: u, target, amount: Math.round(dealt) }); if (target.mana >= 100) { target.mana = 0; target.hp -= u.attack * .65; victim?.classList.add("skillHit"); } if (target.hp <= 0) { target.alive = false; victim?.classList.add("defeated"); hooks.onCombatEvent?.({ type: "defeat", target }); } } }, 360);
    }
    function locate(clientX, clientY) { const rect = container.getBoundingClientRect(), x = Math.floor((clientX - rect.left) / rect.width * 8), y = Math.floor((clientY - rect.top) / rect.height * 8); return x >= 0 && x < 8 && y >= 0 && y < 8 ? { x, y } : null; }
    return { setPlanningTeams, startBattle, highlight(on) { container.classList.toggle("highlight", on); }, pickTile: locate, pickUnit(clientX, clientY) { const el = document.elementFromPoint(clientX, clientY)?.closest?.("[data-uid]"); return el?.dataset.uid || null; }, select(uid) { selected = uid; unitMap.forEach((v, key) => v.root.classList.toggle("selected", key === selected)); }, resize() {}, isBattling: () => !!timer, destroy() { if (timer) clearInterval(timer); container.innerHTML = ""; } };
  }

  function create(container, hooks = {}) {
    if (!global.THREE) throw new Error("Three.js is required");
    const THREE = global.THREE;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050b23);
    scene.fog = new THREE.FogExp2(0x06102c, 0.018);
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 120);
    camera.position.set(0, 12.2, 12.8); camera.lookAt(0, 0.25, -0.4);
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" }); }
    catch (error) { console.warn("Star Board: WebGL unavailable, using 2D fallback.", error.message); return createFallback(container, hooks); }
    renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 700 ? 1.35 : 1.8));
    renderer.shadowMap.enabled = innerWidth > 700;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0x8fdfff, 0x10152e, 2.1));
    const key = new THREE.DirectionalLight(0xffffff, 2.8); key.position.set(-4, 12, 7); key.castShadow = true; scene.add(key);
    const rim = new THREE.PointLight(0x6f4cff, 28, 30); rim.position.set(6, 5, -4); scene.add(rim);
    const board = new THREE.Group(); scene.add(board);
    const tileMeshes = [];
    const tileGeo = new THREE.BoxGeometry(1.42, 0.18, 1.42);
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) {
      const friendly = y >= 4;
      const mat = new THREE.MeshStandardMaterial({ color: friendly ? ((x + y) % 2 ? 0x123b67 : 0x164c78) : ((x + y) % 2 ? 0x2a1f48 : 0x342455), metalness: 0.62, roughness: 0.32, emissive: friendly ? 0x062d51 : 0x1b0d38, emissiveIntensity: 0.7 });
      const m = new THREE.Mesh(tileGeo, mat); m.position.set((x - 3.5) * 1.48, 0, (y - 3.5) * 1.48); m.receiveShadow = true; m.userData = { tile: { x, y }, base: mat.color.clone(), friendly }; board.add(m); tileMeshes.push(m);
    }
    const base = new THREE.Mesh(new THREE.BoxGeometry(12.7, 0.6, 12.7), new THREE.MeshStandardMaterial({ color: 0x12172f, metalness: 0.9, roughness: 0.24, emissive: 0x051339 })); base.position.y = -0.42; base.receiveShadow = true; board.add(base);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(8.25, 0.12, 8, 4), new THREE.MeshBasicMaterial({ color: 0x34dfff })); ring.rotation.x = Math.PI / 2; ring.rotation.z = Math.PI / 4; ring.position.y = -0.05; scene.add(ring);
    for (let i = 0; i < 54; i++) {
      const star = new THREE.Mesh(new THREE.IcosahedronGeometry(0.025 + Math.random() * 0.05), new THREE.MeshBasicMaterial({ color: i % 3 ? 0x86cfff : 0xffd978 }));
      star.position.set((Math.random() - 0.5) * 28, 3 + Math.random() * 11, -8 - Math.random() * 18); scene.add(star);
    }

    const raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2();
    let unitViews = new Map(), combatUnits = [], projectiles = [], effects = [], active = true, battle = false, elapsed = 0, last = performance.now(), selectedUid = null;

    function gridPos(x, y) { return new THREE.Vector3((x - 3.5) * 1.48, 0.22, (y - 3.5) * 1.48); }
    function contain(unit){unit.x=Math.max(.05,Math.min(6.95,unit.x));unit.y=Math.max(.05,Math.min(6.95,unit.y));}
    function mat(color, emissive = 0x000000) { return new THREE.MeshStandardMaterial({ color, metalness: 0.68, roughness: 0.26, emissive, emissiveIntensity: 1.2 }); }
    function addPart(group, geometry, material, x, y, z, sx = 1, sy = 1, sz = 1) { const m = new THREE.Mesh(geometry, material); m.position.set(x, y, z); m.scale.set(sx, sy, sz); m.castShadow = true; group.add(m); return m; }
    function makeModel(c, star, team) {
      const root = new THREE.Group(); root.userData.uid = null;
      const primary = mat(c.color, new THREE.Color(c.color).multiplyScalar(0.13));
      const dark = mat(team === "player" ? 0x15233a : 0x32182c); const silver = mat(0xd7e4ee); const glow = new THREE.MeshBasicMaterial({ color: c.color });
      const role = c.role;
      const bodyScale = role === "GUARDIAN" ? 1.18 : role === "ASSASSIN" ? 0.83 : 1;
      addPart(root, new THREE.CapsuleGeometry(0.42, 0.48, 5, 8), primary, 0, 1.35, 0, bodyScale, 1, bodyScale);
      addPart(root, new THREE.SphereGeometry(0.34, 12, 8), dark, 0, 2.05, 0);
      addPart(root, new THREE.BoxGeometry(0.38, 0.09, 0.08), glow, 0, 2.06, 0.31);
      addPart(root, new THREE.BoxGeometry(1.38, 0.25, 0.42), primary, 0, 1.72, 0, role === "GUARDIAN" ? 1.2 : 1, 1, 1);
      for (const side of [-1, 1]) {
        addPart(root, new THREE.CapsuleGeometry(0.16, 0.45, 4, 7), silver, side * 0.58, 1.2, 0).rotation.z = side * 0.18;
        addPart(root, new THREE.CapsuleGeometry(0.18, 0.48, 4, 7), dark, side * 0.3, 0.43, 0).rotation.z = side * -0.08;
        if (role === "RANGER" || role === "ENGINEER") addPart(root, new THREE.CylinderGeometry(0.13, 0.18, 0.65, 8), primary, side * 0.66, 1.1, 0.2).rotation.x = Math.PI / 2;
        if (c.trait === "Sky" || c.id === "nova") { const wing = addPart(root, new THREE.ConeGeometry(0.27, 1.18, 4), primary, side * 0.76, 1.54, -0.28); wing.rotation.z = side * -0.72; }
      }
      addPart(root, new THREE.SphereGeometry(0.18, 10, 6), glow, 0, 1.42, 0.4);
      if (c.id.includes("drake") || c.id === "ember") {
        const horn1 = addPart(root, new THREE.ConeGeometry(0.1, 0.5, 6), primary, -0.22, 2.37, -0.02); horn1.rotation.z = -0.3;
        const horn2 = addPart(root, new THREE.ConeGeometry(0.1, 0.5, 6), primary, 0.22, 2.37, -0.02); horn2.rotation.z = 0.3;
      }
      const scale = 0.72 * (star === 2 ? 1.11 : star === 3 ? 1.24 : 1); root.scale.setScalar(scale); root.userData.baseScale = scale;
      const teamColor = team === "player" ? 0x36d9ff : 0xff704f;
      const aura = new THREE.Mesh(new THREE.TorusGeometry(0.62, star === 3 ? 0.075 : 0.052, 8, 28), new THREE.MeshBasicMaterial({ color: star > 1 ? (star === 3 ? 0xffd950 : c.color) : teamColor, transparent: true, opacity: star > 1 ? 0.9 : 0.68 })); aura.rotation.x = Math.PI / 2; aura.position.y = 0.05; root.add(aura); root.userData.aura = aura;
      return root;
    }
    function clearUnits() { for (const v of unitViews.values()) scene.remove(v.root); unitViews.clear(); }
    function setPlanningTeams(player, enemy) {
      battle = false; combatUnits = []; clearUnits();
      for (const [team, units] of [["player", player], ["enemy", enemy]]) for (const u of units) {
        if (!u.tile) continue; const c = D().characters.find((x) => x.id === u.characterId); const preview = E().buildCombatUnit(u, team, 0, team === "enemy" ? hooks.stagePower || 1 : 1); const root = makeModel(c, u.star, team);
        root.position.copy(gridPos(u.tile.x, u.tile.y)); root.rotation.y = team === "enemy" ? Math.PI : 0; root.userData.uid = u.uid; const nameplate = statusSprite(preview, false); root.add(nameplate); scene.add(root); unitViews.set(u.uid, { root, unit: u, nameplate }); updateStatus(unitViews.get(u.uid), preview, false);
      }
    }
    function roundRect(ctx, x, y, width, height, radius) {
      const r = Math.min(radius, width / 2, height / 2); ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + width, y, x + width, y + height, r); ctx.arcTo(x + width, y + height, x, y + height, r); ctx.arcTo(x, y + height, x, y, r); ctx.arcTo(x, y, x + width, y, r); ctx.closePath();
    }
    function statusSprite(unit, inBattle) {
      const canvas = document.createElement("canvas"); canvas.width = 256; canvas.height = inBattle ? 92 : 68; const ctx = canvas.getContext("2d");
      const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false, depthWrite: false })); sprite.scale.set(2.25, inBattle ? .81 : .6, 1); sprite.position.set(0, 2.62, 0); sprite.renderOrder = 100; sprite.userData = { canvas, ctx, texture }; return sprite;
    }
    function updateStatus(view, unit, inBattle = battle) {
      const { ctx, canvas, texture } = view.nameplate.userData; const c = unit.data || D().characters.find((x) => x.id === unit.characterId); const enemy = unit.team === "enemy";
      ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.save(); ctx.shadowColor = "#000b"; ctx.shadowBlur = 12; ctx.shadowOffsetY = 5;
      const gradient = ctx.createLinearGradient(18, 8, 238, 58); gradient.addColorStop(0, enemy ? "rgba(112,24,65,.96)" : "rgba(53,38,133,.96)"); gradient.addColorStop(1, enemy ? "rgba(55,12,41,.94)" : "rgba(20,45,105,.94)");
      roundRect(ctx, 16, 7, 224, 52, 15); ctx.fillStyle = gradient; ctx.fill(); ctx.shadowColor = "transparent"; ctx.lineWidth = 3; ctx.strokeStyle = enemy ? "#ff806f" : "#76dfff"; ctx.stroke();
      ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.font = "900 24px Pretendard, sans-serif"; ctx.fillStyle = "#fff"; ctx.fillText(`${c.name} ${"★".repeat(unit.star)}`, 128, 33);
      if (inBattle) { const ratio = Math.max(0, unit.hp / unit.maxHp); roundRect(ctx, 24, 67, 208, 15, 8); ctx.fillStyle = "#090d20e8"; ctx.fill(); roundRect(ctx, 28, 71, 200 * ratio, 7, 4); ctx.fillStyle = enemy ? "#ff5c68" : "#4ee5aa"; ctx.fill(); if (unit.shield > 0) { ctx.strokeStyle = "#73e7ff"; ctx.lineWidth = 3; ctx.strokeRect(25, 68, 206, 13); } }
      ctx.restore();
      texture.needsUpdate = true;
    }
    function startBattle(player, enemy) {
      clearUnits(); projectiles = []; effects = []; battle = true; elapsed = 0;
      combatUnits = [
        ...player.map((u, i) => E().buildCombatUnit(u, "player", i)),
        ...enemy.map((u, i) => E().buildCombatUnit(u, "enemy", i, hooks.stagePower || 1)),
      ];
      for (const u of combatUnits) {
        const root = makeModel(u.data, u.star, u.team); root.position.copy(gridPos(u.x, u.y)); root.rotation.y = u.team === "enemy" ? Math.PI : 0;
        const nameplate = statusSprite(u, true); root.add(nameplate); scene.add(root); unitViews.set(u.uid, { root, unit: u, nameplate }); updateStatus(unitViews.get(u.uid), u, true);
      }
      hooks.onCombatEvent?.({ type: "start" });
    }
    function nearest(unit, enemies) { return enemies.filter((x) => x.alive).sort((a, b) => Math.hypot(a.x - unit.x, a.y - unit.y) - Math.hypot(b.x - unit.x, b.y - unit.y))[0]; }
    function burst(position, color, count = 12, size = 0.08) {
      for (let i = 0; i < count; i++) { const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(size), new THREE.MeshBasicMaterial({ color, transparent: true })); mesh.position.copy(position); scene.add(mesh); effects.push({ mesh, life: 0.45 + Math.random() * 0.35, velocity: new THREE.Vector3((Math.random() - 0.5) * 4, Math.random() * 3.5, (Math.random() - 0.5) * 4) }); }
    }
    function floatingNumber(target, text, color) {
      const canvas = document.createElement("canvas"); canvas.width = 160; canvas.height = 72; const ctx = canvas.getContext("2d"); ctx.font = "900 38px sans-serif"; ctx.textAlign = "center"; ctx.strokeStyle = "#071022"; ctx.lineWidth = 8; ctx.strokeText(text, 80, 45); ctx.fillStyle = color; ctx.fillText(text, 80, 45); const texture = new THREE.CanvasTexture(canvas); const mesh = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false })); const root = unitViews.get(target.uid)?.root; if (!root) return; mesh.position.copy(root.position).add(new THREE.Vector3(0, 2.1, 0)); mesh.scale.set(1.3, .58, 1); scene.add(mesh); effects.push({ mesh, life: .8, velocity: new THREE.Vector3(0, .9, 0), float: true });
    }
    function damage(target, amount, source, skill = false) {
      if (!target.alive) return; let value = Math.max(5, amount - target.defense * 0.32);
      if (target.shield > 0) { const blocked = Math.min(target.shield, value); target.shield -= blocked; value -= blocked; hooks.onCombatEvent?.({ type: "shield", target }); }
      target.hp -= value; target.mana = Math.min(100, target.mana + 12);
      const view = unitViews.get(target.uid); if (view) { view.root.userData.hit = 0.22; burst(view.root.position.clone().add(new THREE.Vector3(0, 1, 0)), skill ? 0xffdb55 : 0x6fe8ff, skill ? 22 : 9, skill ? 0.11 : 0.07); floatingNumber(target, `-${Math.round(value)}`, skill ? "#ffe66d" : "#ffffff"); updateStatus(view, target, true); }
      hooks.onCombatEvent?.({ type: "damage", target, source, amount: Math.round(value), skill });
      if (target.hp <= 0) { target.alive = false; if (view) view.root.userData.defeat = 0; hooks.onCombatEvent?.({ type: "defeat", target }); }
    }
    function projectile(source, target, amount, skill = false, color = null) {
      const geo = new THREE.SphereGeometry(skill ? 0.24 : 0.105, 10, 8); const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: color || source.data.color }));
      mesh.position.copy(unitViews.get(source.uid).root.position).add(new THREE.Vector3(0, 0.95, 0)); scene.add(mesh); projectiles.push({ mesh, source, target, amount, skill, speed: skill ? 6.5 : 8.5, life: 3 });
      hooks.onCombatEvent?.({ type: skill ? "skill" : "projectile", source, target });
    }
    function cast(unit, enemies, allies) {
      unit.mana = 0; const target = nearest(unit, enemies); if (!target) return;
      const casterView = unitViews.get(unit.uid); if (casterView) { burst(casterView.root.position.clone().add(new THREE.Vector3(0, 1.1, 0)), 0xffe66d, 18, .075); casterView.root.userData.charge = .32; }
      const power = unit.attack * (1.55 + unit.star * 0.25);
      if (unit.data.skill === "heal") { const friend = allies.filter((u) => u.alive).sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0]; if (friend) { const before = friend.hp; friend.hp = Math.min(friend.maxHp, friend.hp + power); const v = unitViews.get(friend.uid); burst(v.root.position.clone().add(new THREE.Vector3(0, 1, 0)), 0x64ffac, 16); floatingNumber(friend, `+${Math.round(friend.hp - before)}`, "#63ffad"); updateStatus(v, friend, true); } }
      else if (unit.data.skill === "shield") { allies.filter((u) => u.alive).forEach((a) => { a.shield += power * 0.9; updateStatus(unitViews.get(a.uid), a, true); }); burst(unitViews.get(unit.uid).root.position, 0x63dfff, 24, 0.09); }
      else if (unit.data.skill === "haste") { allies.filter((u) => u.alive).forEach((a) => { a.speed *= 1.08; }); burst(unitViews.get(unit.uid).root.position, 0xa9edff, 16); }
      else if (unit.data.skill === "dash") { damage(target, power, unit, true); unit.x = target.x + (unit.team === "player" ? -0.45 : 0.45); unit.y = target.y;contain(unit); }
      else if (unit.data.skill === "freeze") { enemies.filter((e) => e.alive && Math.hypot(e.x - target.x, e.y - target.y) < 2.4).forEach((e) => { e.speed *= 0.75; damage(e, power * 0.72, unit, true); }); }
      else if (unit.data.skill === "nova") { enemies.filter((e) => e.alive).forEach((e) => damage(e, power * 0.58, unit, true)); }
      else projectile(unit, target, power, true, unit.data.skill === "fireball" ? 0xff633e : 0xffdf62);
    }
    function chooseTarget(unit, enemies) { const alive = enemies.filter((x) => x.alive); if (unit.data.role === "ASSASSIN") return alive.sort((a, b) => unit.team === "player" ? b.y - a.y : a.y - b.y)[0]; if (unit.data.role === "MAGE") return alive.sort((a, b) => Math.abs(a.x - 3.5) - Math.abs(b.x - 3.5))[0]; return nearest(unit, alive); }
    function updateCombat(dt) {
      elapsed += dt; const aliveP = combatUnits.filter((u) => u.alive && u.team === "player"), aliveE = combatUnits.filter((u) => u.alive && u.team === "enemy");
      hooks.onCombatState?.(aliveP.length, aliveE.length);
      if (!aliveP.length || !aliveE.length || elapsed > 45) { battle = false; hooks.onBattleEnd?.(aliveP.length >= aliveE.length, combatUnits); return; }
      for (const u of combatUnits) {
        const view = unitViews.get(u.uid); if (!u.alive) { if (view) { view.root.userData.defeat += dt; view.root.rotation.z += dt * 2.4; view.root.scale.multiplyScalar(0.97); view.nameplate.material.opacity = Math.max(0, 1 - view.root.userData.defeat / .8); if (view.root.userData.defeat > 0.8) view.root.visible = false; } continue; }
        const enemies = u.team === "player" ? aliveE : aliveP, allies = u.team === "player" ? aliveP : aliveE; const target = enemies.find((e) => e.uid === u.targetUid && e.alive) || chooseTarget(u, enemies); if (!target) continue; u.targetUid = target.uid;
        const dx = target.x - u.x, dy = target.y - u.y, dist = Math.hypot(dx, dy); u.cooldown -= dt;
        if (["RANGER", "MAGE", "SUPPORT", "ENGINEER"].includes(u.data.role) && dist < Math.max(1.4, u.range * .55)) { const pace = dt * .72; u.x -= dx / Math.max(.1, dist) * pace; u.y -= dy / Math.max(.1, dist) * pace; }
        else if (dist > u.range * 0.9) { const pace = dt * (u.data.role === "ASSASSIN" ? 1.55 : u.data.role === "GUARDIAN" ? .82 : 1.05); u.x += dx / dist * pace; u.y += dy / dist * pace; }
        else if (u.cooldown <= 0) { u.cooldown = 1 / u.speed; u.attacks++; u.mana = Math.min(100, u.mana + 25); if (u.mana >= 100) cast(u, enemies, allies); else if (u.range > 1) projectile(u, target, u.attack * (Math.random() < u.equipStats.crit ? 1.7 : 1)); else damage(target, u.attack, u); }
        contain(u);if (u.equipStats.regen) u.hp = Math.min(u.maxHp, u.hp + u.equipStats.regen * dt);
        if (view) { const pos = gridPos(u.x, u.y); view.root.position.lerp(pos, Math.min(1, dt * 7)); view.root.lookAt(gridPos(target.x, target.y)); view.root.userData.aura.rotation.z += dt * (u.star + 1); if (view.root.userData.hit > 0) { view.root.userData.hit -= dt; view.root.scale.setScalar(view.root.userData.baseScale * (1 + Math.sin(view.root.userData.hit * 50) * .06)); } else view.root.scale.setScalar(view.root.userData.baseScale); updateStatus(view, u, true); }
      }
      for (let i = projectiles.length - 1; i >= 0; i--) { const p = projectiles[i]; p.life -= dt; if (!p.target.alive || p.life <= 0) { scene.remove(p.mesh); projectiles.splice(i, 1); continue; } const dest = unitViews.get(p.target.uid).root.position.clone().add(new THREE.Vector3(0, .8, 0)); const delta = dest.sub(p.mesh.position), dist = delta.length(); if (dist < .28) { damage(p.target, p.amount, p.source, p.skill); scene.remove(p.mesh); projectiles.splice(i, 1); } else p.mesh.position.add(delta.normalize().multiplyScalar(dt * p.speed)); }
    }
    function highlight(enabled) { tileMeshes.forEach((m) => { if (m.userData.friendly) { m.material.emissive.set(enabled ? 0x0c6faf : 0x062d51); m.material.emissiveIntensity = enabled ? 1.6 : .7; } }); }
    function pickTile(clientX, clientY) { const rect = renderer.domElement.getBoundingClientRect(); pointer.x = (clientX - rect.left) / rect.width * 2 - 1; pointer.y = -(clientY - rect.top) / rect.height * 2 + 1; raycaster.setFromCamera(pointer, camera); return raycaster.intersectObjects(tileMeshes, false)[0]?.object?.userData?.tile || null; }
    function pickUnit(clientX, clientY) { const rect = renderer.domElement.getBoundingClientRect(); pointer.x = (clientX - rect.left) / rect.width * 2 - 1; pointer.y = -(clientY - rect.top) / rect.height * 2 + 1; raycaster.setFromCamera(pointer, camera); const hits = raycaster.intersectObjects([...unitViews.values()].map((v) => v.root), true); if (!hits.length) return null; let object = hits[0].object; while (object && !object.userData.uid) object = object.parent; return object?.userData?.uid || null; }
    function select(uid) { selectedUid = uid; unitViews.forEach((v, key) => { v.root.userData.aura.material.opacity = key === uid ? 1 : (v.unit.star > 1 ? .78 : .24); }); }
    function resize() { const w = container.clientWidth || 900, h = container.clientHeight || 600; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
    const ro = new ResizeObserver(resize); ro.observe(container); resize();
    function loop(now) { if (!active) return; const dt = Math.min(.035, (now - last) / 1000); last = now; if (battle) updateCombat(dt); effects.forEach((e) => { e.life -= dt; e.mesh.position.addScaledVector(e.velocity, dt); e.velocity.y -= dt * 5; e.mesh.material.opacity = Math.max(0, e.life * 2); }); effects.filter((e) => e.life <= 0).forEach((e) => scene.remove(e.mesh)); effects = effects.filter((e) => e.life > 0); renderer.render(scene, camera); requestAnimationFrame(loop); }
    requestAnimationFrame(loop);
    return { setPlanningTeams, startBattle, highlight, pickTile, pickUnit, select, resize, isBattling: () => battle, destroy() { active = false; ro.disconnect(); renderer.dispose(); container.innerHTML = ""; } };
  }
  global.AutoBattlerRenderer = { create };
})(window);
