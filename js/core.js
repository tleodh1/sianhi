/* Shared local-first state and game lifecycle. No global timer monkey-patching. */
const $ = (s) => document.querySelector(s);
const game = document.getElementById("game"),
  gameBody = document.getElementById("gameBody");
function loadState() {
  try {
    const raw = JSON.parse(localStorage.getItem("sianhi-v2") || "{}");
    const s = {
      stars: 0,
      done: [],
      progress: {},
      stage100: {},
      completed: {},
      collection: [],
      records: {},
      ...raw,
    };
    s.stars = Number.isFinite(Number(s.stars)) ? Math.max(0, Number(s.stars)) : 0;
    for (const k of ["done", "collection"]) if (!Array.isArray(s[k])) s[k] = [];
    for (const k of ["progress", "stage100", "completed", "records"])
      if (!s[k] || typeof s[k] !== "object" || Array.isArray(s[k])) s[k] = {};
    if (s.stage100["팩토"])
      s.stage100["사고력 수학"] = Math.max(
        s.stage100["팩토"],
        s.stage100["사고력 수학"] || 1,
      );
    for (const key of Object.keys(s.stage100)) {
      s.stage100[key] = Math.min(100, Math.max(1, Math.floor(Number(s.stage100[key])) || 1));
    }
    return s;
  } catch {
    return {
      stars: 0,
      done: [],
      progress: {},
      stage100: {},
      completed: {},
      collection: [],
      records: {},
    };
  }
}
let state = loadState();
function save() {
  try {
    localStorage.setItem("sianhi-v2", JSON.stringify(state));
  } catch {
    notify(
      "저장 공간을 사용할 수 없어요. 보호자 안내에서 기록을 파일로 저장해 주세요.",
    );
  }
  render();
}
function award(id, amount = 1) {
  if (!state.completed[id]) {
    state.completed[id] = Date.now();
    state.stars += amount;
  }
  save();
}
function notify(message) {
  const n = $("#notice");
  n.textContent = message;
  n.hidden = false;
  setTimeout(() => (n.hidden = true), 4000);
}
function notice(message) {
  notify(message);
}
const Session = {
  timers: new Set(),
  intervals: new Set(),
  frames: new Set(),
  keys: [],
  cleanups: [],
  generation: 0,
  begin() {
    this.end();
    this.generation++;
  },
  end() {
    this.timers.forEach(clearTimeout);
    this.intervals.forEach(clearInterval);
    this.frames.forEach(cancelAnimationFrame);
    this.keys.forEach((f) => document.removeEventListener("keydown", f));
    this.cleanups.forEach((f) => f());
    this.timers.clear();
    this.intervals.clear();
    this.frames.clear();
    this.keys = [];
    this.cleanups = [];
    if (window.LearningSpeech) window.LearningSpeech.stop();
    else if ("speechSynthesis" in window) speechSynthesis.cancel();
  },
  timeout(fn, ms) {
    const token = this.generation;
    const id = setTimeout(() => {
      this.timers.delete(id);
      if (token === this.generation && game.open) fn();
    }, ms);
    this.timers.add(id);
    return id;
  },
  interval(fn, ms) {
    const id = setInterval(() => {
      if (game.open) fn();
    }, ms);
    this.intervals.add(id);
    return id;
  },
  frame(fn) {
    const token = this.generation;
    const id = requestAnimationFrame((t) => {
      this.frames.delete(id);
      if (token === this.generation && game.open) fn(t);
    });
    this.frames.add(id);
    return id;
  },
  cleanup(fn) {
    this.cleanups.push(fn);
    return fn;
  },
  key(fn) {
    this.keys.push(fn);
    document.addEventListener("keydown", fn);
  },
};
function closeGame() {
  Session.end();
  game.close();
}
game.addEventListener("close", () => Session.end());
game.addEventListener("cancel", () => Session.end());
function say(text, lang = "ko-KR") {
  if (!state.sound || !("speechSynthesis" in window)) return;
  if (window.LearningSpeech) return window.LearningSpeech.speak([{text,lang}],{automatic:true});
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  u.rate = 0.8;
  speechSynthesis.speak(u);
}
