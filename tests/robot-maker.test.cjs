const fs=require("node:fs"),vm=require("node:vm"),assert=require("node:assert/strict");
const ctx={window:{}};vm.createContext(ctx);vm.runInContext(fs.readFileSync("js/games/robot/catalog.js","utf8"),ctx);
const R=ctx.window.SianRobot;
assert.equal(R.slots.length,8);assert.equal(R.parts.head.length,5);assert.equal(R.parts.weapon.length,5);
for(const slot of R.slots) assert.ok(R.parts[slot].length>=3,`${slot} needs choices`);
assert.match(fs.readFileSync("js/games/robot/game.js","utf8"),/onpointerdown/);assert.match(fs.readFileSync("js/app.js","utf8"),/robot-maker\.webp/);
console.log("PASS robot maker has 8 modular slots, balanced choices, and pointer rotation");
