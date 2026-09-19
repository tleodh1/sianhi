(function (B) {
  B.progress = function (s) {
    const old = s.records.starBreaker || {};
    const record = { version: 2, unlocked: Math.max(1, old.unlocked || 1), stages: { ...(old.stages || {}) } };
    s.records.starBreaker = record;
    return record;
  };
  B.complete = function (s, id, score, stars, seconds) {
    const r = B.progress(s), old = r.stages[id] || {};
    const delta = Math.max(0, stars - (old.stars || 0));
    r.stages[id] = { cleared: true, score: Math.max(score, old.score || 0), stars: Math.max(stars, old.stars || 0), bestSeconds: Math.min(seconds, old.bestSeconds || Infinity) };
    r.unlocked = Math.max(r.unlocked, Math.min(30, id + 1));
    s.stars += delta;
    return delta;
  };
})(SianBrick);
