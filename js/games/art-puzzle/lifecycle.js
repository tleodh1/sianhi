(function (A) {
  A.Scope = class {
    constructor() {
      this.abort = new AbortController();
      this.timers = new Set();
      this.frame = 0;
      this.closed = false;
      this.cleanups = [];
    }
    on(target, event, fn) {
      target.addEventListener(event, fn, { signal: this.abort.signal });
    }
    later(fn, ms) {
      const id = setTimeout(() => {
        this.timers.delete(id);
        if (!this.closed) fn();
      }, ms);
      this.timers.add(id);
      return id;
    }
    loop(fn) {
      let last = 0;
      const tick = (now) => {
        if (this.closed) return;
        fn(last ? Math.min((now - last) / 1000, 0.1) : 0);
        last = now;
        this.frame = requestAnimationFrame(tick);
      };
      this.frame = requestAnimationFrame(tick);
    }
    destroy() {
      if (this.closed) return;
      this.closed = true;
      this.abort.abort();
      for (const id of this.timers) clearTimeout(id);
      this.timers.clear();
      cancelAnimationFrame(this.frame);
      for (const fn of this.cleanups) fn();
      this.cleanups = [];
    }
  };
})(SianArt);
