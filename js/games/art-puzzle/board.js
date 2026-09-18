(function (A) {
  A.play = async function (root, art, level, scope, onFinish, onBack) {
    root.innerHTML = '<p class="art-note">액자를 준비하고 있어요…</p>';
    let img;
    try {
      img = await A.loadImage(art.image);
    } catch (err) {
      if (!scope.closed) {
        root.innerHTML =
          "<p>" + err.message + "</p><button data-back>갤러리로</button>";
        scope.on(root.querySelector("button"), "click", onBack);
      }
      return;
    }
    if (scope.closed) return;
    const e = new A.Engine(level, img.height > img.width),
      tiles = A.makeTiles(img, e.cols, e.rows);
    const ratio = img.width / img.height;
    root.innerHTML = `<div class="art-toolbar"><button data-back>← 갤러리</button><h3>${art.title}</h3><span class="art-time">0:00</span></div><div class="art-play"><div class="art-board-wrap"><div class="art-board" style="--cols:${e.cols};--rows:${e.rows};--ratio:${ratio}" aria-label="명화 퍼즐판">${Array.from({ length: e.total }, (_, i) => `<button class="art-slot" data-slot="${i}" aria-label="${i + 1}번 위치"><img src="${tiles[i]}" alt="" draggable="false"></button>`).join("")}<img class="art-preview" src="${art.image}" alt="완성 그림 미리보기" hidden><img class="art-full" src="${art.image}" alt="${A.escape(art.title)} 전체 작품"><div class="art-sparkles" aria-hidden="true">✦　✧　✦　✧　✦</div></div></div><aside class="art-tray-wrap"><div class="art-tray-title"><b>조각 보관함</b><span data-count>0 / ${e.total}</span></div><div class="art-tray" style="--tile-ratio:${(ratio * e.rows) / e.cols}">${e.order.map((i) => `<button class="art-piece" data-piece="${i}" aria-label="조각 ${i + 1}"><img src="${tiles[i]}" alt="" draggable="false"></button>`).join("")}</div><div class="art-tray-nav"><button data-prev aria-label="이전 조각">←</button><button data-more aria-label="다음 조각">→</button></div><p class="art-help">끌어 놓거나, 조각 → 빈칸을 눌러요.</p></aside></div><div class="art-hints"><button data-hint="1">◉ 그림 보기</button><button data-hint="2">✧ 자리 찾기</button><button data-hint="3">↗ 한 조각 도움 <small>${Math.max(1, Math.floor(e.total / 4))}</small></button></div><p class="art-message" role="status">마음에 드는 조각부터 골라 보세요.</p><div class="art-celebration" hidden></div>`;
    const q = (s) => root.querySelector(s),
      board = q(".art-board");
    let finished = false,
      previewToken = 0,
      glowToken = 0;
    const selected = () => {
      root.querySelectorAll("[data-piece]").forEach((b) => {
        b.classList.toggle("art-selected", +b.dataset.piece === e.selected);
        b.setAttribute("aria-pressed", String(+b.dataset.piece === e.selected));
      });
    };
    const sync = () => {
      for (const i of e.placed) {
        const p = q(`[data-piece="${i}"]`),
          s = q(`[data-slot="${i}"]`);
        p.hidden = true;
        s.classList.add("art-placed");
        s.disabled = true;
      }
      q("[data-count]").textContent = e.placed.size + " / " + e.total;
      selected();
    };
    const complete = () => {
      if (!e.complete || finished) return;
      finished = true;
      scope.stopLoop();
      root.querySelectorAll("[data-hint]").forEach((b) => (b.disabled = true));
      board.classList.add("art-complete");
      q(".art-message").textContent = "멋져요! 조각이 하나의 작품이 되었어요.";
      scope.later(() => {
        board.classList.add("art-framed");
      }, 550);
      const reward = onFinish(e);
      scope.later(() => {
        const box = q(".art-celebration");
        box.hidden = false;
        box.innerHTML = `<small>나의 미술관에 새겨진 한 장면</small><h2>${art.title}</h2><p>${art.artist} · ${art.country} · ${art.year}</p><strong class="art-result-stars">${"★".repeat(e.rating())}${"☆".repeat(3 - e.rating())}</strong><p>${art.story}</p><p class="art-look">${art.look}</p><p>${Math.floor(e.seconds)}초 · 힌트 ${e.hints}회 · ${reward ? `별 +${reward}` : "최고 기록을 간직했어요"}</p><a class="art-source" href="${art.source}" target="_blank" rel="noopener">시카고 미술관 원본 · Public Domain</a><div><button data-next class="art-primary">다른 작품 만나기 →</button></div>`;
        scope.on(box.querySelector("[data-next]"), "click", onBack);
        box.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }, 1600);
    };
    const place = (index) => {
      if (e.selected === null) return;
      if (e.place(index)) {
        sync();
        q(".art-message").textContent = "딱 맞아요! 그림이 조금 더 보이네요.";
        complete();
      } else {
        q(".art-message").textContent =
          "그림의 색과 선을 보고 다른 자리에 놓아 봐요.";
      }
    };
    new A.Input(root, e, scope, place, selected);
    scope.on(q("[data-prev]"), "click", () =>
      q(".art-tray").scrollBy({ left: -240, behavior: "smooth" }),
    );
    scope.on(q("[data-more]"), "click", () =>
      q(".art-tray").scrollBy({ left: 240, behavior: "smooth" }),
    );
    scope.on(q("[data-back]"), "click", onBack);
    root.querySelectorAll("[data-hint]").forEach((b) =>
      scope.on(b, "click", () => {
        const level = +b.dataset.hint,
          id = e.hint(level);
        if (id === null) return;
        if (level === 1) {
          const token = ++previewToken;
          q(".art-preview").hidden = false;
          scope.later(() => {
            if (token === previewToken) q(".art-preview").hidden = true;
          }, 2400);
        }
        if (level === 2) {
          e.select(id);
          selected();
          const token = ++glowToken;
          root
            .querySelectorAll(".art-glow")
            .forEach((s) => s.classList.remove("art-glow"));
          q(`[data-slot="${id}"]`).classList.add("art-glow");
          scope.later(() => {
            if (token === glowToken)
              root
                .querySelectorAll(".art-glow")
                .forEach((s) => s.classList.remove("art-glow"));
          }, 2400);
        }
        if (level === 3) {
          sync();
          b.querySelector("small").textContent =
            Math.max(1, Math.floor(e.total / 4)) - e.autoHints;
          b.disabled = e.autoHints >= Math.max(1, Math.floor(e.total / 4));
          complete();
        }
        q(".art-message").textContent = "괜찮아요. 천천히 살펴보세요.";
      }),
    );
    scope.loop((dt) => {
      if (!document.hidden) e.tick(dt);
      const t = Math.floor(e.seconds);
      q(".art-time").textContent =
        Math.floor(t / 60) + ":" + String(t % 60).padStart(2, "0");
    });
  };
})(SianArt);
