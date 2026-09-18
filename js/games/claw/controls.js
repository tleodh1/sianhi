(function (C) {
  C.Controls = class {
    constructor(root, canvas, engine, renderer, drop) {
      this.keys = new Set();
      this.pointers = new Map();
      this.abort = new AbortController();
      const on = (el, type, fn) =>
        el.addEventListener(type, fn, { signal: this.abort.signal });
      const map = {
        ArrowLeft: "left",
        a: "left",
        ArrowRight: "right",
        d: "right",
        ArrowUp: "back",
        w: "back",
        ArrowDown: "front",
        s: "front",
      };
      on(window, "keydown", (e) => {
        const k = map[e.key];
        if (k) {
          e.preventDefault();
          this.keys.add(k);
        }
      });
      on(window, "keyup", (e) => this.keys.delete(map[e.key]));
      root.querySelectorAll("[data-move]").forEach((b) => {
        on(b, "click", () => {
          const d = b.dataset.move;
          engine.aim(
            engine.claw.x + (d === "left" ? -18 : d === "right" ? 18 : 0),
            engine.claw.z + (d === "back" ? 0.06 : d === "front" ? -0.06 : 0),
          );
        });
        on(b, "pointerdown", (e) => {
          e.preventDefault();
          b.setPointerCapture(e.pointerId);
          this.pointers.set(e.pointerId, b.dataset.move);
          b.classList.add("pressed");
          engine.aimTarget = null;
        });
        const end = (e) => {
          this.pointers.delete(e.pointerId);
          if (![...this.pointers.values()].includes(b.dataset.move))
            b.classList.remove("pressed");
        };
        on(b, "pointerup", end);
        on(b, "pointercancel", end);
        on(b, "lostpointercapture", end);
      });
      on(canvas, "pointerdown", (e) => {
        const r = canvas.getBoundingClientRect(),
          p = renderer.pick(
            ((e.clientX - r.left) / r.width) * 800,
            ((e.clientY - r.top) / r.height) * 533,
            engine,
          );
        engine.aim(p.x, p.z);
      });
      on(window, "blur", () => this.clear());
      on(document, "visibilitychange", () => {
        if (document.hidden) this.clear();
      });
      this.root = root;
    }
    read() {
      const all = new Set([...this.keys, ...this.pointers.values()]);
      return {
        left: all.has("left"),
        right: all.has("right"),
        back: all.has("back"),
        front: all.has("front"),
      };
    }
    clear() {
      this.keys.clear();
      this.pointers.clear();
      this.root
        .querySelectorAll(".pressed")
        .forEach((b) => b.classList.remove("pressed"));
    }
    destroy() {
      this.clear();
      this.abort.abort();
    }
  };
})(SianClaw);
