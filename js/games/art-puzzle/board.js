(function (A) {
  A.play = async function (root, art, level, scope, onFinish, onBack, options = {}) {
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
    const e = new A.Engine(level, img.height > img.width, Math.random, options),
      tiles = A.makeTiles(img, e.cols, e.rows);
    const ratio = img.width / img.height;
    const shape = (i) => e.jigsaw ? `style="--piece-clip:${A.jigsawClip(i,e.cols,e.rows)};--rotation:${e.rotations[i]}deg"` : `style="--rotation:${e.rotations[i]}deg"`;
    const guideOpacity = e.total <= 12 ? .16 : e.total <= 20 ? .07 : 0;
    root.innerHTML = `<div class="art-studio ${e.jigsaw ? "art-jigsaw" : ""}"><div class="art-toolbar"><button data-back>← 갤러리</button><h3>${art.title} · ${e.total}조각</h3><span class="art-time">0:00</span></div><div class="art-play"><div class="art-board-wrap"><div class="art-zoom-tools"><button data-zoom-out aria-label="축소">−</button><b data-zoom>100%</b><button data-zoom-in aria-label="확대">＋</button></div><div class="art-board-stage"><div class="art-board" style="--cols:${e.cols};--rows:${e.rows};--ratio:${ratio};--guide:${guideOpacity}" aria-label="명화 퍼즐판">${Array.from({ length: e.total }, (_, i) => `<button class="art-slot" data-slot="${i}" data-kind="${A.pieceKind(i,e.cols,e.rows)}" ${shape(i)} aria-label="${i + 1}번 위치"><img src="${tiles[i]}" alt="" draggable="false"></button>`).join("")}<img class="art-board-guide" src="${art.image}" alt="" aria-hidden="true"><img class="art-preview" src="${art.image}" crossorigin="anonymous" alt="완성 그림 미리보기" hidden><img class="art-full" src="${art.image}" crossorigin="anonymous" alt="${A.escape(art.title)} 전체 작품"><div class="art-sparkles" aria-hidden="true">✦　✧　✦　✧　✦</div></div></div></div><aside class="art-tray-wrap"><div class="art-tray-title"><b>조각 보관함</b><span data-count>0 / ${e.total}</span></div>${e.total>=30?`<div class="art-piece-filter"><button data-piece-filter="all" class="active">전체</button><button data-piece-filter="corner">모서리</button><button data-piece-filter="edge">테두리</button><button data-piece-filter="inside">내부</button></div>`:""}<div class="art-tray" style="--tile-ratio:${(ratio * e.rows) / e.cols}">${e.order.map((i) => `<button class="art-piece" data-piece="${i}" data-kind="${A.pieceKind(i,e.cols,e.rows)}" ${shape(i)} aria-label="조각 ${i + 1}"><img src="${tiles[i]}" alt="" draggable="false">${e.rotationEnabled?'<span class="art-rotation-mark">↻</span>':""}</button>`).join("")}</div><div class="art-tray-nav"><button data-prev aria-label="이전 조각">←</button><button data-more aria-label="다음 조각">→</button></div>${e.rotationEnabled?'<button data-rotate class="art-rotate">↻ 선택 조각 90° 회전</button>':""}<p class="art-help">끌어 놓거나, 조각 → 빈칸을 눌러요.${e.rotationEnabled?" 위치와 방향이 모두 맞아야 해요.":""}</p></aside></div><div class="art-hints"><button data-hint="1">◉ 그림 보기 <small data-view-left>${Number.isFinite(e.viewLimit())?e.viewLimit():"∞"}</small></button><button data-hint="2">✧ 자리 찾기</button><button data-hint="3">↗ 한 조각 도움 <small>${e.autoLimit()}</small></button></div><p class="art-message" role="status">마음에 드는 조각부터 골라 보세요.</p><div class="art-celebration" hidden></div></div><div class="art-view-modal" hidden><button data-close-view aria-label="작품 닫기">×</button><div class="art-frame"><img src="${art.image}" crossorigin="anonymous" alt="${A.escape(art.title)}"></div><h2>${art.title}</h2><p>${art.artist} · ${art.year} · ${art.museum || "미술관 소장"}</p><small>${art.story}</small></div>`;
    const q = (s) => root.querySelector(s),
      board = q(".art-board");
    let finished = false,
      previewToken = 0,
      glowToken = 0,
      zoom = 1;
    const setZoom = (next) => {
      zoom = Math.max(1, Math.min(2.4, Math.round(next * 10) / 10));
      board.style.width = `${zoom * 100}%`;
      q("[data-zoom]").textContent = Math.round(zoom * 100) + "%";
    };
    const selected = () => {
      root.querySelectorAll("[data-piece]").forEach((b) => {
        b.classList.toggle("art-selected", +b.dataset.piece === e.selected);
        b.setAttribute("aria-pressed", String(+b.dataset.piece === e.selected));
        b.style.setProperty("--rotation", `${e.rotations[+b.dataset.piece]}deg`);
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
      finished = true;window.SianAudio?.stopMusic();window.SianAudio?.effect("clear");
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
        box.innerHTML = `<small>PUZZLE COMPLETE</small><h2>${art.title}</h2><p>${art.artist} · ${art.country} · ${art.year}</p><strong class="art-result-stars">${"★".repeat(e.rating())}${"☆".repeat(3 - e.rating())}</strong><p><b>${e.total}조각 완성 · ${Math.floor(e.seconds/60)}:${String(Math.floor(e.seconds)%60).padStart(2,"0")}</b></p><p>${art.story}</p><p class="art-look">${art.look}</p><p>힌트 ${e.hints}회 · ${reward ? `별 +${reward}` : "최고 기록을 간직했어요"}</p><a class="art-source" href="${art.source}" target="_blank" rel="noopener">${art.museum || "미술관"} 원본 · Public Domain</a><div><button data-next class="art-primary">다른 작품 만나기 →</button></div>`;
        scope.on(box.querySelector("[data-next]"), "click", onBack);
        box.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }, 1600);
    };
    const place = (index) => {
      if (e.selected === null) return;
      if (e.place(index)) {window.SianAudio?.effect("snap");
        sync();
        const slot=q(`[data-slot="${index}"]`); slot.classList.add("art-snapped"); scope.later(()=>slot.classList.remove("art-snapped"),700);
        q(".art-message").textContent = "딱 맞아요! 그림이 조금 더 보이네요.";
        complete();
      } else {
        board.classList.remove("art-wrong"); void board.offsetWidth; board.classList.add("art-wrong");
        q(".art-message").textContent =
          "그림의 색과 선을 보고 다른 자리에 놓아 봐요.";
      }
    };
    new A.Input(root, e, scope, place, selected, (delta) => setZoom(zoom * delta));
    scope.on(q("[data-zoom-in]"), "click", () => setZoom(zoom + .2));
    scope.on(q("[data-zoom-out]"), "click", () => setZoom(zoom - .2));
    if (q("[data-rotate]")) scope.on(q("[data-rotate]"), "click", () => {
      if (e.selected === null) return q(".art-message").textContent = "먼저 회전할 조각을 골라 주세요.";
      e.rotate(e.selected); selected();
    });
    root.querySelectorAll("[data-piece-filter]").forEach((b) => scope.on(b,"click",()=>{
      root.querySelectorAll("[data-piece-filter]").forEach(x=>x.classList.toggle("active",x===b));
      root.querySelectorAll("[data-piece]").forEach(p=>p.classList.toggle("art-filtered",b.dataset.pieceFilter!=="all"&&p.dataset.kind!==b.dataset.pieceFilter));
    }));
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
          q(".art-view-modal").hidden = false;
          const left=q("[data-view-left]"); if(left) left.textContent=Number.isFinite(e.viewLimit())?Math.max(0,e.viewLimit()-e.viewHints):"∞";
          b.disabled=e.viewHints>=e.viewLimit();
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
          q(`[data-slot="${id}"]`)?.classList.add("art-help-flight");
          b.querySelector("small").textContent =
            e.autoLimit() - e.autoHints;
          b.disabled = e.autoHints >= e.autoLimit();
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
    scope.on(q("[data-close-view]"),"click",()=>q(".art-view-modal").hidden=true);
    scope.on(q(".art-view-modal"),"click",ev=>{if(ev.target===q(".art-view-modal"))q(".art-view-modal").hidden=true});
  };
})(SianArt);
