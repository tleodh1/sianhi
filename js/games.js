function openGameWorld() {
  Session.begin();

  gameBody.innerHTML = `<div class="pixelWorld"><div class="pixelTitle"><span>★ ★ ★ ★ ★</span><h2>시안Hi 게임월드</h2><p>원하는 게임을 골라서 출발!</p></div><div class="pixelGames">
 <button class="pixelGame pgMath" data-pg="brick"><b>🧱</b><strong>벽돌깨기</strong><small>별 공으로 벽돌을 모두 깨요!</small></button>
 <button class="pixelGame pgHangul" data-pg="runner"><b>🏃</b><strong>한글 달리기</strong><small>점프해서 글자를 모아요!</small></button>
 <button class="pixelGame pgEnglish" data-pg="memory"><b>🃏</b><strong>영어 카드 뒤집기</strong><small>같은 알파벳 짝을 찾아요!</small></button>
 <button class="pixelGame pgCoding" data-pg="claw"><b>🕹️</b><strong>인형뽑기</strong><small>코인을 넣고 집게로 인형을 뽑아요!</small></button>
 <button class="pixelGame pgShape" data-pg="shape"><b>🧩</b><strong>퍼즐 맞추기</strong><small>공룡·동물·자동차·로봇 그림 퍼즐!</small></button>
 <button class="pixelGame pgTetris" data-pg="tetris"><b>🟦</b><strong>테트리스</strong><small>블록을 움직여 줄을 완성해요!</small></button></div><div class="pixelHint">★ 모든 게임을 바로 플레이할 수 있어요.</div></div>`;
  game.showModal();
  gameBody.querySelector('[data-pg="brick"]').onclick = playBrick;
  gameBody.querySelector('[data-pg="runner"]').onclick = playRunner;
  gameBody.querySelector('[data-pg="memory"]').onclick = playMemory;
  gameBody.querySelector('[data-pg="claw"]').onclick = playClaw;
  gameBody.querySelector('[data-pg="shape"]').onclick = playShape;
  gameBody.querySelector('[data-pg="tetris"]').onclick = playTetris;
}
function gameShell(title, body, controls = "") {
  Session.begin();
  gameBody.innerHTML = `<div class="arcade"><div class="arcadeTop"><b>${title}</b><button class="backWorld">← 게임월드</button></div>${body}<div class="arcadeControls">${controls}</div></div>`;
  gameBody.querySelector(".backWorld").onclick = openGameWorld;
}
function playBrick() {
  const touchMode = window.matchMedia("(pointer: coarse)").matches;
  gameShell(
    "🧱 벽돌깨기",
    `<div class="brickScene plainBrick" aria-label="벽돌깨기 게임 영역"><div class="brickField"></div><div class="pixelBall">⭐</div><div class="pixelPaddle"></div></div><p class="gameStatus">${touchMode ? "손가락으로 받침대를 움직여 벽돌을 모두 깨요!" : "마우스나 방향키로 받침대를 움직여 벽돌을 모두 깨요!"}</p>`,
    `<button class="moveL" aria-label="받침대 왼쪽 이동">◀</button><button class="moveR" aria-label="받침대 오른쪽 이동">▶</button>`,
  );
  let x = 50,
    y = 75,
    vx = 1.05,
    vy = -1.15,
    p = 50,
    lives = 3,
    run = true,
    raf;
  const scene = gameBody.querySelector(".brickScene"),
    field = gameBody.querySelector(".brickField"),
    ball = gameBody.querySelector(".pixelBall"),
    pad = gameBody.querySelector(".pixelPaddle"),
    msg = gameBody.querySelector(".gameStatus");
  for (let i = 0; i < 24; i++) {
    let e = document.createElement("div");
    e.className = "plainBlock";
    e.style.left = 5 + (i % 6) * 15.5 + "%";
    e.style.top = 10 + Math.floor(i / 6) * 8 + "%";
    field.appendChild(e);
  }
  const draw = () => {
    ball.style.left = x + "%";
    ball.style.top = y + "%";
    pad.style.left = p + "%";
  };
  function step() {
    if (!run) return;
    x += vx;
    y += vy;
    if (x < 2 || x > 98) vx *= -1;
    if (y < 3) vy = Math.abs(vy);
    if (y > 82 && y < 88 && Math.abs(x - p) < 13) vy = -Math.abs(vy);
    for (const e of [...field.children]) {
      let ex = parseFloat(e.style.left),
        ey = parseFloat(e.style.top);
      if (Math.abs(x - (ex + 6)) < 8 && Math.abs(y - ey) < 5) {
        vy *= -1;
        e.remove();
        if (!field.children.length) {
          run = false;
          msg.textContent = "🎉 전부 깼다! 벽돌깨기 성공! ⭐";
          state.stars++;
          save();
        }
        break;
      }
    }
    if (y > 98) {
      lives--;
      x = 50;
      y = 70;
      vy = -1.15;
      if (lives < 1) {
        run = false;
        msg.textContent = "다시 도전! 게임월드에서 벽돌깨기를 다시 눌러 봐.";
      }
    }
    draw();
    raf = Session.frame(step);
  }
  const movePaddle = (clientX) => {
    let r = scene.getBoundingClientRect();
    p = Math.max(13, Math.min(87, ((clientX - r.left) / r.width) * 100));
    draw();
  };
  scene.onmousemove = (e) => movePaddle(e.clientX);
  let dragPointer = null;
  scene.onpointerdown = (e) => {
    if (e.pointerType === "mouse") return;
    dragPointer = e.pointerId;
    scene.setPointerCapture?.(e.pointerId);
    movePaddle(e.clientX);
  };
  scene.onpointermove = (e) => {
    if (e.pointerId === dragPointer) movePaddle(e.clientX);
  };
  const releasePointer = (e) => {
    if (e.pointerId === dragPointer) dragPointer = null;
  };
  scene.onpointerup = releasePointer;
  scene.onpointercancel = releasePointer;
  const left = () => {
    p = Math.max(13, p - 12);
    draw();
  };
  const right = () => {
    p = Math.min(87, p + 12);
    draw();
  };
  gameBody.querySelector(".moveL").onclick = left;
  gameBody.querySelector(".moveR").onclick = right;
  Session.key((e) => {
    if (e.key === "ArrowLeft") left();
    if (e.key === "ArrowRight") right();
  });
  draw();
  raf = Session.frame(step);
}
function playMemory() {
  const vals = [
    "A",
    "A",
    "B",
    "B",
    "C",
    "C",
    "D",
    "D",
    "E",
    "E",
    "F",
    "F",
  ].sort(() => Math.random() - 0.5);
  let first = null,
    lock = false,
    done = 0;
  gameShell(
    "🃏 영어 카드 뒤집기",
    `<div class="memoryGrid">${vals.map((v, i) => `<button class="memoryCard" data-v="${v}"><span>?</span></button>`).join("")}</div><p class="gameStatus">같은 알파벳 두 장을 찾아봐!</p>`,
  );
  gameBody.querySelectorAll(".memoryCard").forEach(
    (c) =>
      (c.onclick = () => {
        if (lock || c.classList.contains("matched") || c === first) return;
        c.classList.add("open");
        c.querySelector("span").textContent = c.dataset.v;
        if (!first) {
          first = c;
          return;
        }
        if (first.dataset.v === c.dataset.v) {
          first.classList.add("matched");
          c.classList.add("matched");
          first = null;
          done += 2;
          if (done === vals.length) {
            gameBody.querySelector(".gameStatus").textContent =
              "🎉 모든 알파벳 짝을 찾았어! ⭐";
            state.stars++;
            save();
          }
        } else {
          lock = true;
          let a = first;
          first = null;
          Session.timeout(() => {
            a.classList.remove("open");
            c.classList.remove("open");
            a.querySelector("span").textContent = c.querySelector(
              "span",
            ).textContent = "?";
            lock = false;
          }, 650);
        }
      }),
  );
}
function playRunner() {
  HangulRunner.start();
}
function playShape() { SianArt.start(); }
function playClaw() { SianClaw.start(); }

function playTetris() {
  const W = 10,
    H = 18,
    board = Array.from({ length: H }, () => Array(W).fill(0));
  const pieces = [
    [[1, 1, 1, 1]],
    [
      [1, 1],
      [1, 1],
    ],
    [
      [0, 1, 0],
      [1, 1, 1],
    ],
    [
      [1, 0, 0],
      [1, 1, 1],
    ],
    [
      [0, 0, 1],
      [1, 1, 1],
    ],
    [
      [0, 1, 1],
      [1, 1, 0],
    ],
    [
      [1, 1, 0],
      [0, 1, 1],
    ],
  ];
  let piece,
    nextPiece = null,
    holdPiece = null,
    x,
    y,
    timer,
    score = 0,
    lines = 0,
    combo = 0,
    level = 1,
    over = false,
    canHold = true,
    downHandler;
  gameShell(
    "🎮 게임월드  ›  테트리스",
    '<div class="tetrisHud"><div class="tStats"><div>🏆<small>점수</small><strong id="tScore">0</strong></div><div>⭐<small>레벨</small><strong id="tLevel">1</strong></div><div>🚩<small>라인</small><strong id="tLines">0</strong></div><div class="comboBox">🔥<small>콤보</small><strong id="tCombo">-</strong></div></div><div class="tetrisMain"><div class="tetrisBoard"></div><div class="tetrisSide"><b>다음 블록</b><div id="nextPreview" class="piecePreview"></div><b>보관 블록</b><div id="holdPreview" class="piecePreview"></div><button data-t="H">교체 (C)</button><p>← → 이동<br>↑ 회전<br>↓ 빠르게<br>Space 즉시 내리기<br>C 블록 교체</p></div></div></div><p class="gameStatus">여러 줄을 연속으로 지우면 콤보 점수가 올라가요!</p>',
    '<button data-t="L">◀</button><button data-t="R">▶</button><button data-t="D">▼</button><button data-t="X">↻</button><button data-t="H">교체</button><button data-t="DROP">⤓</button>',
  );
  const el = gameBody.querySelector(".tetrisBoard"),
    msg = gameBody.querySelector(".gameStatus");
  function clone(p) {
    return p.map((r) => [...r]);
  }
  function randomPiece() {
    return clone(pieces[Math.floor(Math.random() * pieces.length)]);
  }
  function preview(id, p) {
    const e = gameBody.querySelector(id);
    if (!e) return;
    e.innerHTML = p
      ? p
          .flatMap((r) =>
            r.map((v) => '<i class="' + (v ? "on" : "") + '"></i>'),
          )
          .join("")
      : "";
    e.style.setProperty("--cols", p ? p[0].length : 4);
  }
  function spawn(p = null) {
    piece = p ? clone(p) : nextPiece || randomPiece();
    nextPiece = randomPiece();
    x = Math.floor((W - piece[0].length) / 2);
    y = 0;
    canHold = true;
    preview("#nextPreview", nextPiece);
    preview("#holdPreview", holdPiece);
    if (hit(0, 0, piece)) {
      over = true;
      clearInterval(timer);
      msg.textContent = "게임 종료! 점수 " + score + "점";
    }
  }
  function hit(dx, dy, p = piece) {
    return p.some((r, yy) =>
      r.some(
        (v, xx) =>
          v &&
          (y + yy + dy >= H ||
            x + xx + dx < 0 ||
            x + xx + dx >= W ||
            board[y + yy + dy]?.[x + xx + dx]),
      ),
    );
  }
  function renderT() {
    let t = board.map((r) => [...r]);
    piece?.forEach((r, yy) =>
      r.forEach((v, xx) => {
        if (v && t[y + yy]) t[y + yy][x + xx] = 2;
      }),
    );
    el.innerHTML = t
      .flat()
      .map(
        (v) =>
          '<i class="' + (v ? "on " : "") + (v === 2 ? "fall" : "") + '"></i>',
      )
      .join("");
  }
  function updateHud() {
    gameBody.querySelector("#tScore").textContent = score;
    gameBody.querySelector("#tLines").textContent = lines;
    gameBody.querySelector("#tLevel").textContent = level;
    gameBody.querySelector("#tCombo").textContent =
      combo > 1 ? combo + " COMBO!" : "-";
  }
  function lock() {
    piece.forEach((r, yy) =>
      r.forEach((v, xx) => {
        if (v && board[y + yy]) board[y + yy][x + xx] = 1;
      }),
    );
    let cleared = 0;
    for (let r = H - 1; r >= 0; r--)
      if (board[r].every(Boolean)) {
        board.splice(r, 1);
        board.unshift(Array(W).fill(0));
        cleared++;
        r++;
      }
    if (cleared) {
      lines += cleared;
      combo++;
      level = 1 + Math.floor(lines / 10);
      score += cleared * 100 * level + (combo > 1 ? (combo - 1) * 50 : 0);
      msg.textContent =
        combo > 1
          ? "🔥 " + combo + " COMBO! 연속으로 지웠어!"
          : "⭐ 라인 클리어!";
    } else combo = 0;
    updateHud();
    spawn();
    renderT();
  }
  function drop() {
    if (over) return;
    if (!hit(0, 1)) y++;
    else lock();
    renderT();
  }
  function rot() {
    let p = piece[0].map((_, i) => piece.map((r) => r[i]).reverse());
    if (!hit(0, 0, p)) piece = p;
    renderT();
  }
  function hold() {
    if (over || !canHold) return;
    const old = clone(piece);
    if (holdPiece) {
      piece = clone(holdPiece);
      holdPiece = old;
      x = Math.floor((W - piece[0].length) / 2);
      y = 0;
    } else {
      holdPiece = old;
      piece = nextPiece;
      nextPiece = randomPiece();
      x = Math.floor((W - piece[0].length) / 2);
      y = 0;
    }
    canHold = false;
    if (hit(0, 0, piece)) {
      over = true;
      clearInterval(timer);
      msg.textContent = "게임 종료! 점수 " + score + "점";
    }
    preview("#nextPreview", nextPiece);
    preview("#holdPreview", holdPiece);
    renderT();
  }
  function action(a) {
    if (over) return;
    if (a === "L" && !hit(-1, 0)) x--;
    if (a === "R" && !hit(1, 0)) x++;
    if (a === "D") drop();
    if (a === "X") rot();
    if (a === "H") hold();
    if (a === "DROP") {
      while (!hit(0, 1)) y++;
      lock();
    }
    renderT();
  }
  gameBody
    .querySelectorAll("[data-t]")
    .forEach((b) => (b.onclick = () => action(b.dataset.t)));
  downHandler = (e) => {
    if (!game.open) return;
    const m = {
      ArrowLeft: "L",
      ArrowRight: "R",
      ArrowDown: "D",
      ArrowUp: "X",
      " ": "DROP",
      c: "H",
      C: "H",
    }[e.key];
    if (m) {
      e.preventDefault();
      action(m);
    }
  };
  Session.key(downHandler);
  const back = gameBody.querySelector(".backWorld");
  if (back)
    back.addEventListener(
      "click",
      () => {
        clearInterval(timer);
        document.removeEventListener("keydown", downHandler);
      },
      { once: true },
    );
  spawn();
  updateHud();
  renderT();
  timer = Session.interval(drop, 650);
}
