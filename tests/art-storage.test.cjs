const fs = require("fs"),
  vm = require("vm"),
  assert = require("assert"),
  c = vm.createContext({});
for (const f of ["data", "engine", "storage"])
  vm.runInContext(fs.readFileSync(`js/games/art-puzzle/${f}.js`, "utf8"), c);
const A = c.SianArt,
  s = {
    stars: 52,
    level: 6,
    progress: { 한글: 70 },
    stage100: { 영어: 23 },
    records: {
      runner: { stage: 5 },
      clawMachine: { inventory: { deer: 2 } },
      shape: { old: true },
      artPuzzle: { version: 1, works: { legacy: { completed: true, levels: { challenge: { stars: 2, bestSeconds: 91 } } } }, unlocked: ["legacy"] },
    },
    collection: ["keep"],
  },
  original = JSON.parse(JSON.stringify(s));
A.progress(s);
assert.equal(s.records.artPuzzle.version, 2);
assert.equal(s.records.artPuzzle.works.legacy.levels.challenge.bestSeconds, 91);
const e = new A.Engine();
for (let i = 0; i < 6; i++) {
  e.select(i);
  e.place(i);
}
assert.equal(A.reward(s, A.artworks[0], e), 3);
assert.equal(A.reward(s, A.artworks[0], e), 0);
assert.equal(s.stars, 55);
const reload = JSON.parse(JSON.stringify(s));
assert.equal(A.progress(reload).works[A.artworks[0].id].levels.easy.stars, 3);
for (const key of ["level", "progress", "stage100", "collection"])
  assert.deepEqual(s[key], original[key]);
for (const key of Object.keys(original.records).filter((key) => key !== "artPuzzle"))
  assert.deepEqual(s.records[key], original.records[key]);
assert.ok(A.progress(s).unlocked.length >= 20);
A.unlock(s, A.artworks[11].id);
assert(A.progress(s).unlocked.includes(A.artworks[11].id));
assert.equal(A.reward(s, A.artworks[1], new A.Engine()), 0);
console.log(
  "PASS capped repeat rewards, reload, all artworks open, legacy runner/claw/learning/level preservation",
);
