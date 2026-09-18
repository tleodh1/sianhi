const fs = require("fs"),
  vm = require("vm"),
  assert = require("assert");
const c = vm.createContext({});
for (const f of ["catalog", "storage"])
  vm.runInContext(fs.readFileSync(`js/games/claw/${f}.js`, "utf8"), c);
const s = {
  stars: 18,
  level: 7,
  progress: { 한글: 31 },
  records: { runner: { best: 55 }, claw: { old: true } },
  collection: ["old"],
};
const before = JSON.stringify(s);
const r = c.SianClaw.progress(s);
assert.equal(r.coins, 10);
assert(c.SianClaw.reward(s, "bunny").isNew);
assert(!c.SianClaw.reward(s, "bunny").isNew);
assert.equal(s.stars, 20);
const re = JSON.parse(JSON.stringify(s));
assert.equal(c.SianClaw.progress(re).inventory.bunny, 2);
const original = JSON.parse(before);
for (const k of ["level", "progress", "collection"])
  assert.deepEqual(s[k], original[k]);
assert.deepEqual(s.records.runner, original.records.runner);
assert.deepEqual(s.records.claw, original.records.claw);
console.log(
  "PASS new/duplicate rewards, reload, legacy records and progress preservation",
);
