function openGameWorld() {
  closeGame();
  if (typeof go === "function") go("games");
}
function gameShell(title, body, controls = "") {
  Session.begin();
  gameBody.innerHTML = `<div class="arcade"><div class="arcadeTop gameHeader"><b class="gameHeaderTitle">${title}</b><button class="backWorld gameHeaderBack">← 게임월드</button></div>${body}<div class="arcadeControls">${controls}</div></div>`;
  gameBody.querySelector(".backWorld").onclick = openGameWorld;
}
function playBrick() {
  SianBrick.start();
}
function playMemory() { SianMemory.start(); }
function playRobot() { SianRobot.start(); }
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
    "블록 공장",
    '<div class="tetrisHud"><div class="tStats"><div>🏆<small>점수</small><strong id="tScore">0</strong></div><div>⭐<small>레벨</small><strong id="tLevel">1</strong></div><div>🚩<small>라인</small><strong id="tLines">0</strong></div><div class="comboBox">🔥<small>콤보</small><strong id="tCombo">-</strong></div></div><div class="tetrisMain"><div class="tetrisBoard"></div><div class="tetrisSide"><b>다음 블록</b><div id="nextPreview" class="piecePreview"></div><b>보관 블록</b><div id="holdPreview" class="piecePreview"></div><button data-t="H">교체 (C)</button><p>← → 이동<br>↑ 회전<br>↓ 빠르게<br>Space 즉시 내리기<br>C 블록 교체</p></div></div></div><p class="gameStatus">여러 줄을 연속으로 지우면 콤보 점수가 올라가요!</p>',
    '<button data-t="L">◀</button><button data-t="R">▶</button><button data-t="D">▼</button><button data-t="X">↻</button><button data-t="H">교체</button><button data-t="DROP">⤓</button>',
  );
  gameBody.querySelector(".arcade").classList.add("tetrisGame");
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
      const retry=document.createElement('button');retry.textContent='다시 시작';retry.onclick=playTetris;msg.append(retry);
      state.records.tetris={...(state.records.tetris||{}),best:Math.max(state.records.tetris?.best||0,score),level,lines};save();
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
      clearInterval(timer);Session.intervals.delete(timer);timer=Session.interval(drop,Math.max(120,650-(level-1)*45));
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
      const retry=document.createElement('button');retry.textContent='다시 시작';retry.onclick=playTetris;msg.append(retry);
      state.records.tetris={...(state.records.tetris||{}),best:Math.max(state.records.tetris?.best||0,score),level,lines};save();
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
