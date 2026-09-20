import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
function syntax(dir){for(const p of fs.readdirSync(dir)){const full=dir+'/'+p,stat=fs.statSync(full);if(stat.isDirectory())syntax(full);else if(p.endsWith('.js'))new vm.Script(fs.readFileSync(full,'utf8'));}}
syntax("js");
const learning = fs.readFileSync("js/learning.js", "utf8");
const ctx = vm.createContext({ state: { stage100: {} } });
vm.runInContext(learning, ctx);
for (const subject of [
  "연산",
  "수학",
  "사고력 수학",
  "한글",
  "영어",
  "과학",
  "코딩",
  "한자",
]) {
  const stages = vm.runInContext(`build100('${subject}')`, ctx);
  assert.equal(stages.length, 100);
  for (let n = 1; n <= 100; n++) {
    const q = vm.runInContext(`stageQuestion('${subject}',${n})`, ctx);
    assert.ok(q.opts.map(String).includes(q.ans));
  }
}
for (let stage = 1; stage <= 100; stage++) {
  const size = stage < 31 ? 5 : stage < 71 ? 6 : 7;
  assert.ok(size * 3 >= (size - 1) * 2);
}
for (const file of [
  "assets/sian-face.webp",
  "assets/sky-world.webp",
  "assets/PretendardVariable.woff2",
])
  assert.ok(fs.statSync(file).size > 1000);
console.log(
  "PASS: syntax, 800 stage answers, coding command budget, local image/font assets",
);
require("../tests/runner-adventure.test.cjs");
require("../tests/game-navigation.test.cjs");
require("../tests/claw-engine.test.cjs");
require("../tests/arithmetic-options.test.cjs");
require("../tests/learning-bank.test.cjs");
require("../tests/learning-responsive.test.cjs");
require("../tests/autobattler-engine.test.cjs");
require("../tests/brick-stage.test.cjs");
require("../tests/brick-touch.test.cjs");
require("../tests/art-engine.test.cjs");
require("../tests/art-storage.test.cjs");
require("../tests/art-collection.test.cjs");

require("../tests/runner-expansion.test.cjs");
require("../tests/runner-physics.test.cjs");
require("../tests/runner-ocean.test.cjs");
