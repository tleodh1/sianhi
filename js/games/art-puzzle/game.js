(function (A) {
  A.start = function () {
    Session.begin();
    game.classList.add("art-dialog");
    gameBody.innerHTML = '<section class="art-app"></section>';
    if (!game.open) game.showModal();
    const root = gameBody.querySelector(".art-app");
    let scope;
    const screen = () => {
      scope?.destroy();
      scope = new A.Scope();
      return scope;
    };
    Session.cleanups.push(() => {
      scope?.destroy();
      game.classList.remove("art-dialog");
    });
    const gallery = () => {
      const sc = screen();
      A.gallery(root, A.progress(state), detail, book, sc);
    };
    const detail = (art) => {
      const sc = screen(),
        r = A.progress(state),
        rec = r.works[art.id];
      root.innerHTML = `<div class="art-toolbar"><button data-back>← 갤러리</button></div><div class="art-detail"><div class="art-frame"><img src="${art.image}" crossorigin="anonymous" alt="${A.escape(art.title)}"></div><h2>${art.title}</h2><small>${art.artist} · ${art.country} · ${art.year}</small><p>${art.story}</p><div class="art-levels">${A.levels.map((d, i) => `<button data-level="${d.id}" class="${i === 0 ? "primary" : ""}"><b>${d.name}</b><span>${d.cols * d.rows}조각 ${rec?.levels?.[d.id] ? "· " + "★".repeat(rec.levels[d.id].stars) : ""}</span></button>`).join("")}</div><p class="art-note">원하는 조각 수를 바로 골라도 괜찮아요.</p><a class="art-source" href="${art.source}" target="_blank" rel="noopener">${art.museum || "미술관"} 작품 정보 · Public Domain</a><br><a class="art-source" href="${art.imageSource}" target="_blank" rel="noopener">이미지 출처 · ${art.imageLicense}</a><small>${A.escape(art.originalTitle)}</small></div>`;
      sc.on(root.querySelector("[data-back]"), "click", gallery);
      root.querySelectorAll("[data-level]").forEach((b) =>
        sc.on(b, "click", () => {
          const playScope = screen();
          A.play(
            root,
            art,
            b.dataset.level,
            playScope,
            (e) => {
              const reward = A.reward(state, art, e);
              save();
              return reward;
            },
            gallery,
          );
        }),
      );
    };
    const book = () => {
      const sc = screen(),
        r = A.progress(state);
      root.innerHTML = `<div class="art-toolbar"><button data-back>← 갤러리</button><h3>나의 명화 도감 · ${Object.keys(r.works).length}/${A.artworks.length}</h3></div><div class="art-book-grid">${A.artworks
        .map((a) => {
          const w = r.works[a.id];
          return `<article class="${w ? "" : "art-unknown"}"><div class="art-frame"><img src="${a.image}" alt="${w ? A.escape(a.title) : "아직 완성하지 않은 작품"}" loading="lazy"></div><h3>${w ? a.title : "다음에 만날 작품"}</h3>${w ? `<small>${a.artist} · ${a.country} · ${a.year}</small><p>${"★".repeat(w.bestStars)}</p><p>${a.story}</p><p>${a.look}</p><a class="art-source" href="${a.source}" target="_blank" rel="noopener">원본 작품 정보</a><p><button data-view="${a.id}">크게 감상하기</button></p>` : "<p>퍼즐을 완성하면 액자가 열려요.</p>"}</article>`;
        })
        .join("")}</div>`;
      sc.on(root.querySelector("[data-back]"), "click", gallery);
      root
        .querySelectorAll("[data-view]")
        .forEach((b) =>
          sc.on(b, "click", () =>
            detail(A.artworks.find((a) => a.id === b.dataset.view)),
          ),
        );
    };
    gallery();
  };
})(SianArt);