(function (A) {
  A.progress = function (s) {
    const old = s.records.artPuzzle || {};
    const r = {
      ...old,
      version: 1,
      works: { ...(old.works || {}) },
      unlocked: [
        ...new Set([
          ...(old.unlocked || []),
          ...A.artworks.slice(0, 3).map((a) => a.id),
        ]),
      ],
    };
    s.records.artPuzzle = r;
    return r;
  };
  A.unlock = function (s, id) {
    const r = A.progress(s);
    if (A.artworks.some((a) => a.id === id) && !r.unlocked.includes(id))
      r.unlocked.push(id);
  };
  A.reward = function (s, art, e) {
    if (!e.complete) return 0;
    const r = A.progress(s),
      old = r.works[art.id] || { levels: {} },
      level = old.levels?.[e.level] || {},
      stars = e.rating(),
      delta = Math.max(0, stars - (level.stars || 0));
    r.works[art.id] = {
      ...old,
      bestStars: Math.max(old.bestStars || 0, stars),
      completed: true,
      levels: {
        ...(old.levels || {}),
        [e.level]: {
          stars: Math.max(level.stars || 0, stars),
          bestSeconds: Math.min(
            level.bestSeconds ?? Infinity,
            Math.round(e.seconds),
          ),
          fewestHints: Math.min(level.fewestHints ?? Infinity, e.hints),
          plays: (level.plays || 0) + 1,
        },
      },
      lastLevel: e.level,
    };
    s.stars += delta;
    const count = Object.keys(r.works).length;
    for (const a of A.artworks.slice(0, Math.min(12, 3 + count * 2)))
      if (!r.unlocked.includes(a.id)) r.unlocked.push(a.id);
    return delta;
  };
})(SianArt);
