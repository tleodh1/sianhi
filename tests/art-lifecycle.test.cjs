const fs = require("fs"),
  vm = require("vm"),
  assert = require("assert");
let n = 0;
const frames = new Map(),
  timers = new Map();
class Target {
  constructor() {
    this.events = {};
    this.style = {};
    this.dataset = {};
    this.classList = { add() {}, remove() {} };
  }
  addEventListener(type, f, { signal }) {
    (this.events[type] ??= []).push(f);
    signal.addEventListener(
      "abort",
      () => (this.events[type] = this.events[type].filter((x) => x !== f)),
    );
  }
  fire(type, opts = {}) {
    for (const f of this.events[type] || [])
      f({ preventDefault() {}, ...opts });
  }
  count() {
    return Object.values(this.events).flat().length;
  }
  setPointerCapture() {}
  hasPointerCapture() {
    return false;
  }
  cloneNode() {
    return new Target();
  }
  removeAttribute() {}
  setAttribute() {}
  remove() {}
  append() {}
  getBoundingClientRect() {
    return { left: 0, top: 0, width: 300, height: 200 };
  }
  querySelector() {
    return this;
  }
  closest(s) {
    return s === "[data-piece]" ? this : null;
  }
}
const win = new Target(),
  doc = new Target(),
  c = vm.createContext({
    SianArt: {},
    window: win,
    document: doc,
    AbortController,
    setTimeout: (f) => {
      timers.set(++n, f);
      return n;
    },
    clearTimeout: (id) => timers.delete(id),
    requestAnimationFrame: (f) => {
      frames.set(++n, f);
      return n;
    },
    cancelAnimationFrame: (id) => frames.delete(id),
  });
for (const f of ["engine", "lifecycle", "input"])
  vm.runInContext(fs.readFileSync(`js/games/art-puzzle/${f}.js`, "utf8"), c);
for (let run = 0; run < 3; run++) {
  const root = new Target(),
    piece = new Target();
  piece.dataset.piece = "0";
  const e = new c.SianArt.Engine(),
    scope = new c.SianArt.Scope();
  let placed = 0;
  const input = new c.SianArt.Input(
    root,
    e,
    scope,
    (i) => {
      if (e.place(i)) placed++;
    },
    () => {},
  );
  scope.loop(() => {});
  scope.later(() => {}, 2000);
  assert.equal(frames.size, 1);
  root.fire("pointerdown", {
    target: piece,
    pointerId: 1,
    clientX: 10,
    clientY: 10,
  });
  root.fire("pointerdown", {
    target: piece,
    pointerId: 2,
    clientX: 10,
    clientY: 10,
  });
  assert.equal(input.active.id, 1);
  root.fire("pointercancel", { pointerId: 2 });
  assert.equal(input.active.id, 1);
  root.fire("pointermove", { pointerId: 1, clientX: 50, clientY: 50 });
  assert(input.ghost);
  root.fire("pointerup", { pointerId: 1, clientX: 50, clientY: 50 });
  assert.equal(placed, 1);
  assert.equal(input.ghost, null);
  scope.destroy();
  scope.destroy();
  assert.equal(frames.size + timers.size, 0);
  assert.equal(root.count() + win.count() + doc.count(), 0);
}
console.log(
  "PASS 3 lifecycle cycles: drag/snap, secondary-pointer isolation, ghost cleanup, RAF/timer/listener disposal",
);
