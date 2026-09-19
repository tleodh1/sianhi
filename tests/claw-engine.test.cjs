const fs = require("node:fs"),
  vm = require("node:vm"),
  a = require("node:assert/strict");
const ctx = vm.createContext({});
for (const f of ["catalog", "engine"])
  vm.runInContext(fs.readFileSync(`js/games/claw/${f}.js`, "utf8"), ctx);
const C = ctx.SianClaw;
let total = 0;
function test(s, f) {
  f();
  console.log("PASS", s);
  total++;
}
function run(e) {
  for (let n = 0; n < 2000 && e.phase !== "result"; n++) e.step(1 / 120);
  a.equal(e.phase, "result");
}
test("expanded original catalog, 30-toy pile and four rarities", () => {
  a(C.catalog.length >= 16);
  a.equal(new Set(C.catalog.map((t) => t.id)).size, C.catalog.length);
  a.equal(new Set(C.catalog.map((t) => t.rarity)).size, 4);
  const pile=C.layout();a.equal(pile.length,30);a.equal(new Set(pile.map(t=>Math.round(t.z*10))).size,3);
  a(Math.max(...pile.map(t=>t.scale))>=1.5);a(Math.min(...pile.map(t=>t.scale))<.9);
  a(pile.some(t=>Math.abs(t.tilt)>1));a(new Set(pile.map(t=>t.pose)).size>=3);
});
test("size and weight affect centered grip instead of guaranteed success", () => {
  const d=C.catalog.find(d=>d.id==='dragon'),small={x:0,z:.5,scale:.8},large={x:0,z:.5,scale:1.62},claw={x:0,z:.5,strength:1.7,sway:0};
  const easy=C.evaluateGrip(claw,small,d),hard=C.evaluateGrip(claw,large,d);a(easy.margin>hard.margin);a(hard.load>easy.load);
});
test("empty area fails without random reward", () => {
  const e = new C.Engine();
  e.claw.x = -240;
  e.claw.z = 0.07;
  e.drop();
  run(e);
  a.equal(e.result.success, false);
  a.equal(e.events.delivery, undefined);
});
test("offset influences enclosure and holding margin", () => {
  const e = new C.Engine(),
    t = e.toys[1],
    d = C.catalog[1];
  e.claw.x = t.x;
  e.claw.z = t.z;
  const good = C.evaluateGrip(e.claw, t, d);
  e.claw.x += 43;
  const bad = C.evaluateGrip(e.claw, t, d);
  a(good.force > bad.force);
  a(good.margin > 0);
  a(bad.margin < 0);
});
test("marginal grip lifts then slips physically", () => {
  const e = new C.Engine(),
    t = e.toys[0];
  e.claw.x = t.x - 35;
  e.claw.z = t.z;
  e.drop();
  run(e);
  a(e.events.grip);
  a(e.events.slip);
  a.equal(e.result.success, false);
  a.equal(t.won, false);
});
test("failed toys keep their changed position for the next attempt",()=>{
 const e=new C.Engine(),t=e.toys[0],x=t.x;e.claw.x=t.x-50;e.claw.z=t.z;e.drop();run(e);a.equal(t.won,false);a.notEqual(t.x,x);
});
test("drop debounces and aim locks during sequence", () => {
  const e = new C.Engine();
  a(e.drop());
  a(!e.drop());
  a.equal(e.attempts, 9);
  const x = e.claw.x;
  e.step(0.01, { right: true });
  a.equal(e.claw.x, x);
  run(e);
  e.resetRound();
  a.equal(e.phase, "aim");
});
test("all crane phases in order", () => {
  const phases = [],
    e = new C.Engine({
      onEvent: (e) => {
        if (e.type === "phase") phases.push(e.phase);
      },
    });
  e.drop();
  run(e);
  a.deepEqual(phases, [
    "descend",
    "close",
    "lift",
    "transport",
    "release",
    "reveal",
    "result",
  ]);
});
test("movement, front/back, sway settling, free refill", () => {
  const e = new C.Engine({ attempts: 0 });
  a(!e.drop());
  a(e.refill());
  for (let i = 0; i < 60; i++) e.step(1 / 120, { right: true, back: true });
  a(e.claw.x > 0 && e.claw.z > 0.55 && e.claw.sway > 0);
  for (let i = 0; i < 90; i++) e.step(1 / 120);
  a.equal(e.claw.sway, 0);
});
console.log(total + " claw engine tests passed");
