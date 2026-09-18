const fs = require("fs"),
  vm = require("vm"),
  assert = require("assert");
const c = vm.createContext({});
for (const f of ["data", "engine"])
  vm.runInContext(fs.readFileSync(`js/games/art-puzzle/${f}.js`, "utf8"), c);
const A = c.SianArt;
assert.equal(new Set(A.artworks.map((a) => a.id)).size, 12);
assert(
  A.artworks.every(
    (a) => a.publicDomain && a.source && a.originalTitle && a.country,
  ),
);
for (const level of A.levels) {
  for (const portrait of [true, false]) {
    const e = new A.Engine(level.id, portrait);
    assert.equal(e.order.length, e.total);
    assert.equal(new Set(e.order).size, e.total);
    assert(!e.select(-1));
    e.select(0);
    assert(!e.place(1));
    assert(!e.complete);
    for (let i = 0; i < e.total; i++) {
      e.select(i);
      assert(e.place(i));
    }
    assert(e.complete);
    assert.equal(e.rating(), 3);
    assert(!e.select(0));
    assert(!e.place(0));
  }
}
const h = new A.Engine();
for (let i = 0; i < 8; i++) h.hint(3);
assert.equal(h.placed.size, 1);
assert(!h.complete);
assert.equal(
  A.snap(101, 50, { left: 0, top: 0, width: 300, height: 200 }, 3, 2),
  1,
);
assert.equal(
  A.snap(-70, 0, { left: 0, top: 0, width: 300, height: 200 }, 3, 2),
  -1,
);
console.log(
  "PASS 12 sourced artworks, 4 difficulties/2 orientations, wrong placement, completion, hint cap, snap bounds",
);
