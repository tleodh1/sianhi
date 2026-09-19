(function (A) {
  A.levels = [
    { id: "easy", name: "입문", cols: 3, rows: 2 },
    { id: "normal", name: "쉬움", cols: 3, rows: 3 },
    { id: "medium", name: "보통", cols: 4, rows: 3 },
    { id: "hard", name: "어려움", cols: 4, rows: 4 },
    { id: "challenge", name: "상급", cols: 5, rows: 4, jigsaw: true },
    { id: "challenge30", name: "도전", cols: 6, rows: 5, jigsaw: true },
    { id: "master42", name: "마스터", cols: 7, rows: 6, jigsaw: true, rotation: true },
    { id: "master56", name: "명화 마스터", cols: 8, rows: 7, jigsaw: true, rotation: true },
  ];
  A.Engine = class {
    constructor(level = "easy", portrait = false, random = Math.random, options = {}) {
      const d = A.levels.find((d) => d.id === level) || A.levels[0];
      this.level = d.id;
      this.cols = portrait ? d.rows : d.cols;
      this.rows = portrait ? d.cols : d.rows;
      this.total = this.cols * this.rows;
      this.placed = new Set();
      this.selected = null;
      this.moves = 0;
      this.hints = 0;
      this.autoHints = 0;
      this.seconds = 0;
      this.complete = false;
      this.jigsaw = !!d.jigsaw;
      this.mode = ["normal", "challenge", "master"].includes(options.mode)
        ? options.mode
        : "normal";
      this.rotationEnabled = !!d.rotation && options.rotation !== false;
      this.viewHints = 0;
      this.order = Array.from({ length: this.total }, (_, i) => i);
      this.rotations = Array.from({ length: this.total }, () =>
        this.rotationEnabled ? Math.floor(random() * 4) * 90 : 0,
      );
      for (let i = this.total - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [this.order[i], this.order[j]] = [this.order[j], this.order[i]];
      }
    }
    rotate(id) {
      if (!this.rotationEnabled || this.placed.has(id) || this.complete)
        return false;
      this.rotations[id] = (this.rotations[id] + 90) % 360;
      return this.rotations[id];
    }
    viewLimit() {
      return this.mode === "master" ? 1 : this.mode === "challenge" ? 3 : Infinity;
    }
    autoLimit() {
      if (this.mode === "normal") return Math.max(1, Math.floor(this.total / 4));
      if (this.mode === "master") return 1;
      return this.total >= 56 ? 1 : this.total >= 42 ? 2 : this.total >= 30 ? 3 : 4;
    }
    select(id) {
      if (
        !Number.isInteger(id) ||
        id < 0 ||
        id >= this.total ||
        this.placed.has(id) ||
        this.complete
      )
        return false;
      this.selected = id;
      return true;
    }
    place(cell) {
      if (this.selected === null || this.complete) return false;
      this.moves++;
      if (cell !== this.selected || this.rotations[this.selected] !== 0) return false;
      this.placed.add(cell);
      this.selected = null;
      this.complete = this.placed.size === this.total;
      return true;
    }
    hint(level) {
      if (this.complete) return null;
      const id = this.selected ?? this.order.find((i) => !this.placed.has(i));
      if (level === 1 && this.viewHints >= this.viewLimit()) return null;
      if (level === 3 && this.autoHints >= this.autoLimit()) return null;
      this.hints++;
      if (level === 1) this.viewHints++;
      if (level === 3) {
        this.autoHints++;
        this.rotations[id] = 0;
        this.select(id);
        this.place(id);
      }
      return id;
    }
    tick(dt) {
      if (!this.complete && dt > 0) this.seconds += Math.min(dt, 1);
    }
    rating() {
      if (!this.complete) return 0;
      const budget = this.total * 45;
      return (
        1 +
        Number(this.hints <= Math.ceil(this.total / 3)) +
        Number(this.hints === 0 && this.seconds <= budget)
      );
    }
  };
  A.pieceKind = function (id, cols, rows) {
    const c = id % cols, r = Math.floor(id / cols), edges = Number(r === 0) + Number(r === rows - 1) + Number(c === 0) + Number(c === cols - 1);
    return edges >= 2 ? "corner" : edges === 1 ? "edge" : "inside";
  };
  A.jigsawClip = function (id, cols, rows) {
    const c = id % cols, r = Math.floor(id / cols), seed = (id * 17 + cols * 11 + rows * 7) % 2;
    const top = r === 0 ? 0 : ((id - cols) * 17 + cols * 11 + rows * 7) % 2 ? -1 : 1;
    const left = c === 0 ? 0 : ((id - 1) * 17 + cols * 11 + rows * 7) % 2 ? -1 : 1;
    const right = c === cols - 1 ? 0 : seed ? 1 : -1;
    const bottom = r === rows - 1 ? 0 : (id * 17 + cols * 11 + rows * 7) % 2 ? 1 : -1;
    const bump = (side, type) => type === 0 ? [] : side === "top" ? [[38,8],[42,type>0?0:16],[58,type>0?0:16],[62,8]] : side === "right" ? [[92,38],[type>0?100:84,42],[type>0?100:84,58],[92,62]] : side === "bottom" ? [[62,92],[58,type>0?100:84],[42,type>0?100:84],[38,92]] : [[8,62],[type>0?0:16,58],[type>0?0:16,42],[8,38]];
    const points=[[8,8],...bump("top",top),[92,8],...bump("right",right),[92,92],...bump("bottom",bottom),[8,92],...bump("left",left)];
    return `polygon(${points.map(([x,y])=>`${x}% ${y}%`).join(",")})`;
  };
  A.snap = function (x, y, rect, cols, rows, tolerance = 0.64) {
    const w = rect.width / cols,
      h = rect.height / rows,
      c = Math.round((x - rect.left) / w - 0.5),
      r = Math.round((y - rect.top) / h - 0.5);
    if (c < 0 || c >= cols || r < 0 || r >= rows) return -1;
    return Math.abs(x - (rect.left + (c + 0.5) * w)) <= w * tolerance &&
      Math.abs(y - (rect.top + (r + 0.5) * h)) <= h * tolerance
      ? r * cols + c
      : -1;
  };
})(SianArt);
