const fs = require("node:fs");
const vm = require("node:vm");
const assert = require("node:assert/strict");

const window = { state: { records: {} }, save() {} };
const ctx = vm.createContext({ window, state: window.state, save: window.save, Math, Date, console });
for (const file of ["data", "storage", "engine"]) {
  vm.runInContext(fs.readFileSync(`js/games/autobattler/${file}.js`, "utf8"), ctx);
}
const D = window.AutoBattlerData;
const E = window.AutoBattlerEngine;
const S = window.AutoBattlerStorage;
assert.equal(D.characters.length, 15, "original roster");
assert.equal(Object.keys(D.roles).length, 7, "seven distinct combat roles");
assert.equal(D.stages.length, 16, "four worlds of rounds");

const run = S.createRun();
E.rollShop(run, () => 0.01);
assert.equal(run.shop.length, 5);
assert.ok(run.shop.every((s) => D.characters.find((c) => c.id === s.characterId).grade === 1));
run.shop = [{ characterId: "bolt", sold: false }, { characterId: "bolt", sold: false }, { characterId: "bolt", sold: false }];
for (let i = 0; i < 3; i++) assert.equal(E.buy(run, i).ok, true);
assert.equal(run.bench.length, 1, "three one-stars merge into one unit");
assert.equal(run.bench[0].star, 2);

const upgraded = run.bench[0];
assert.equal(E.move(run, upgraded.uid, { type: "board", x: 2, y: 6 }).ok, true);
assert.equal(run.board.length, 1);
assert.equal(E.move(run, upgraded.uid, { type: "board", x: 2, y: 1 }).ok, false, "enemy half is locked");

run.inventory = ["power", "gear", "armor", "crystal"];
assert.equal(E.combine(run, "power", "gear"), "rapid");
assert.equal(E.combine(run, "armor", "crystal"), "barrier");
assert.equal(E.equip(run, upgraded.uid, "rapid"), true);
assert.equal(upgraded.items[0], "rapid");
const combat = E.buildCombatUnit(upgraded, "player", 0);
assert.ok(combat.maxHp > D.characters.find((c) => c.id === "bolt").hp);
assert.ok(combat.speed > combat.data.speed, "equipment modifies combat stats");

const enemy = E.makeEnemy(D.stages[7], () => 0.2);
assert.equal(enemy.length, D.stages[7].count);
assert.ok(enemy.every((u) => u.tile.y < 4));
assert.ok(enemy.composition, "AI composition is named before battle");
const earlyEnemy = E.makeEnemy(D.stages[0], () => 0.01);
assert.ok(earlyEnemy.every((u) => D.characters.find((c) => c.id === u.characterId).grade === 1), "early AI uses grade 1 units");
const lateEnemy = E.makeEnemy(D.stages[15], () => 0.01);
assert.ok(lateEnemy.some((u) => u.star > 1), "late AI upgrades stars");
assert.ok(lateEnemy.some((u) => u.items.length), "late AI equips items");
assert.equal(E.sell(run, upgraded.uid).ok, true);
assert.ok(run.equipment.includes("rapid"), "equipment returns on sale");
console.log("PASS auto-battler shop, merge, placement, crafting, equipment, AI and sale loop");
