(function (C) {
  C.start = async function () {
    Session.begin();
    game.classList.add("claw-dialog");
    gameBody.innerHTML =
      '<div class="claw-app"><p>인형 친구들을 불러오는 중이에요…</p></div>';
    if (!game.open) game.showModal();
    let alive = true,
      frame = 0,
      controls,
      audio;
    const abort = new AbortController();
    Session.cleanups.push(() => {
      alive = false;
      cancelAnimationFrame(frame);
      controls?.destroy();
      abort.abort();
      audio?.close();
      game.classList.remove("claw-dialog");
    });
    try {
      const art = await C.loadArt();
      if (!alive) return;
      let r = C.progress(state),
        book = false,
        last = 0,
        announced = -1;
      gameBody.innerHTML = `<section class="claw-app"><header><div><small>SIANHi TOY ATELIER</small><h2>별빛 인형뽑기</h2></div><button data-book>내 인형 도감</button></header><div class="claw-hud"><span data-coins></span><span data-owned></span><span data-best></span></div><div class="claw-stage"><canvas aria-label="인형을 눌러 집게를 조준하세요"></canvas><div class="claw-result" hidden></div><div class="claw-book" hidden></div></div><p class="claw-status" role="status">인형을 누르거나 방향 버튼으로 가운데를 맞춰요!</p><div class="claw-controls"><div class="claw-pad"><button data-move="back" aria-label="뒤로">뒤 ▲</button><button data-move="left" aria-label="왼쪽">◀ 좌</button><button data-move="front" aria-label="앞으로">앞 ▼</button><button data-move="right" aria-label="오른쪽">우 ▶</button></div><button class="claw-drop">DROP<br><small>집게 내리기</small></button></div><footer>방향키 / WASD · 인형 클릭으로 조준 · 놀이 코인은 무료로 충전해요.</footer></section>`;
      const root = gameBody.querySelector(".claw-app"),
        q = (s) => root.querySelector(s),
        canvas = q("canvas"),
        renderer = new C.Renderer(canvas, art);
      const on = (el, type, fn) =>
        el.addEventListener(type, fn, { signal: abort.signal });
      const hud = () => {
        r = C.progress(state);
        q("[data-coins]").textContent = `놀이 코인 ${r.coins}`;
        q("[data-owned]").textContent =
          `도감 ${Object.keys(r.inventory).length} / 12`;
        q("[data-best]").textContent = `최고 연속 ${r.best}`;
      };
      const sound = (rarity) => {
        if (!state.sound) return;
        try {
          audio ||= new (window.AudioContext || window.webkitAudioContext)();
          audio.resume();
          for (let i = 0; i < 3 + rarity; i++) {
            const o = audio.createOscillator(),
              g = audio.createGain(),
              t = audio.currentTime + i * 0.12;
            o.type = "sine";
            o.frequency.value = 440 * Math.pow(1.25, i);
            g.gain.setValueAtTime(0.08, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
            o.connect(g).connect(audio.destination);
            o.start(t);
            o.stop(t + 0.31);
          }
        } catch {}
      };
      const e = new C.Engine({
        attempts: r.coins,
        onEvent: ({ type }) => {
          if (type === "attempt") {
            r = C.progress(state);
            r.coins = e.attempts;
            r.attempts++;
            save();
            hud();
          }
          if (type === "result" && announced !== e.round) {
            announced = e.round;
            let reward = null,
              def = null;
            if (e.result.success) {
              def = C.catalog.find((d) => d.id === e.result.toyId);
              reward = C.reward(state, def.id);
              sound(def.rarity);
            } else C.progress(state).streak = 0;
            save();
            hud();
            const box = q(".claw-result");
            box.hidden = false;
            box.className =
              "claw-result" + (def?.rarity === 3 ? " legendary" : "");
            box.innerHTML = def
              ? `<small>${reward.isNew ? "NEW · 새로운 친구!" : "또 만났어요! 별 +1"}</small><img src="${renderer.card(def)}" alt="${def.name}"><h3>${def.name}</h3><p style="color:${C.rarities[def.rarity].color}">${"★".repeat(def.rarity + 1)} ${C.rarities[def.rarity].name}</p><p>도감에 저장했어요 · 별 +${reward.stars}</p><button data-again>한 번 더 놀기</button>`
              : "<h3>조금만 더 가운데로!</h3><p>인형의 몸 가운데를 누르고 다시 도전해요.</p><button data-again>다시 도전</button>";
            on(box.querySelector("button"), "click", () => {
              box.hidden = true;
              e.resetRound();
              e.restock();
              q(".claw-drop").disabled = false;
            });
          }
        },
      });
      const drop = () => {
        if (book || e.phase !== "aim") return;
        controls?.clear();
        if (e.attempts === 0) {
          e.refill();
          C.progress(state).coins = e.attempts;
          save();
          hud();
          q(".claw-status").textContent = "놀이 코인 10개를 무료로 충전했어요!";
          return;
        }
        if (e.drop()) q(".claw-drop").disabled = true;
      };
      controls = new C.Controls(root, canvas, e, renderer, drop);
      on(q(".claw-drop"), "click", drop);
      on(window, "keydown", (ev) => {
        if (
          ev.code === "Space" &&
          !ev.repeat &&
          !/BUTTON/.test(ev.target.tagName)
        ) {
          ev.preventDefault();
          drop();
        }
      });
      on(q("[data-book]"), "click", () => {
        book = !book;
        controls.clear();
        const b = q(".claw-book");
        b.hidden = !book;
        q("[data-book]").textContent = book
          ? "게임으로 돌아가기"
          : "내 인형 도감";
        if (book) {
          r = C.progress(state);
          b.innerHTML =
            '<h3>내 인형 도감</h3><div class="claw-grid">' +
            C.catalog
              .map(
                (d) =>
                  `<article class="${r.inventory[d.id] ? "" : "locked"}"><img src="${renderer.card(d, 180)}" alt="${d.name}"><strong>${d.name}</strong><span style="color:${C.rarities[d.rarity].color}">${"★".repeat(d.rarity + 1)}</span><small>${r.inventory[d.id] ? `${r.inventory[d.id]}번 만났어요` : "아직 만나지 못했어요"}</small></article>`,
              )
              .join("") +
            "</div>";
        }
      });
      hud();
      const labels = {
        aim: "인형의 몸 가운데를 맞추고 DROP!",
        descend: "집게가 내려가요",
        close: "세 발로 꼬옥!",
        lift: "조심조심 올려요",
        transport: "선물 출구로 이동해요",
        release: "선물을 내려놓아요",
        reveal: "두근두근, 누구일까요?",
        result: "새로운 친구를 만나러 가요!",
      };
      let phase = "";
      function tick(now) {
        if (!alive) return;
        const dt = last ? Math.min((now - last) / 1000, 0.025) : 0;
        last = now;
        if (!book && !document.hidden) e.step(dt, controls.read());
        renderer.paint(e);
        if (phase !== e.phase) {
          phase = e.phase;
          q(".claw-status").textContent = labels[phase];
        }
        frame = requestAnimationFrame(tick);
      }
      frame = requestAnimationFrame(tick);
    } catch (err) {
      if (alive)
        gameBody.textContent = err.message + " 게임을 닫고 다시 열어 주세요.";
    }
  };
})(SianClaw);
