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
  gameShell(
    "🧱 벽돌깨기",
    `<div class="brickScene plainBrick"><div class="brickField"></div><div class="pixelBall">⭐</div><div class="pixelPaddle"></div></div><p class="gameStatus">마우스나 버튼으로 받침대를 움직여 벽돌을 모두 깨요!</p>`,
    `<button class="moveL">◀</button><button class="moveR">▶</button>`,
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
  scene.onmousemove = (e) => {
    let r = scene.getBoundingClientRect();
    p = Math.max(13, Math.min(87, ((e.clientX - r.left) / r.width) * 100));
    draw();
  };
  gameBody.querySelector(".moveL").onclick = () => {
    p = Math.max(13, p - 12);
    draw();
  };
  gameBody.querySelector(".moveR").onclick = () => {
    p = Math.min(87, p + 12);
    draw();
  };
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
function playShape() {
  const themes = [
    {
      name: "공룡 월드",
      icon: "🦖",
      tiles: ["🌋", "🌴", "🦕", "🥚", "🦖", "🌿", "🪨", "☀️", "🌳"],
    },
    {
      name: "동물 친구",
      icon: "🦁",
      tiles: ["🦁", "🐼", "🐯", "🐻", "🐰", "🐶", "🦊", "🐵", "🐨"],
    },
    {
      name: "자동차 도시",
      icon: "🚙",
      tiles: ["🚗", "🚕", "🚙", "🏎️", "🚓", "🚑", "🚒", "🚜", "🚌"],
    },
    {
      name: "몬스터 모험",
      icon: "👾",
      tiles: ["👾", "🐲", "🔥", "⚡", "💧", "🌿", "⭐", "🥚", "🏆"],
    },
    {
      name: "로봇 연구소",
      icon: "🤖",
      tiles: ["🤖", "⚙️", "🔋", "🦾", "🛸", "📡", "💡", "🔧", "🚀"],
    },
    {
      name: "우주 탐험",
      icon: "🚀",
      tiles: ["🚀", "🌍", "🌙", "⭐", "🪐", "👨‍🚀", "☄️", "🛸", "🌌"],
    },
  ];
  let ti = 0,
    moves = 0,
    start = Date.now(),
    selected = null;
  gameShell(
    "🧩 퍼즐 맞추기",
    '<div class="jigsawGame"><aside class="puzzleThemes"></aside><section><div class="puzzleInfo"><b id="pTitle"></b><span>이동 <strong id="pMoves">0</strong>회</span><span id="pTime">00:00</span></div><div class="jigsawBoard"></div><p class="gameStatus">두 조각을 차례로 눌러 자리를 바꿔 완성해요.</p></section></div>',
  );
  const themesEl = gameBody.querySelector(".puzzleThemes"),
    board = gameBody.querySelector(".jigsawBoard");
  themesEl.innerHTML = themes
    .map(
      (t, i) =>
        '<button data-theme="' + i + '">' + t.icon + " " + t.name + "</button>",
    )
    .join("");
  function load(i) {
    ti = i;
    moves = 0;
    selected = null;
    start = Date.now();
    const t = themes[i];
    gameBody.querySelector("#pTitle").textContent = t.icon + " " + t.name;
    gameBody.querySelector("#pMoves").textContent = 0;
    let arr = t.tiles.map((v, n) => ({ v, n })).sort(() => Math.random() - 0.5);
    if (arr.every((x, n) => x.n === n)) [arr[0], arr[1]] = [arr[1], arr[0]];
    board.innerHTML = arr
      .map(
        (x) =>
          '<button class="jPiece" data-home="' + x.n + '">' + x.v + "</button>",
      )
      .join("");
    bind();
  }
  function bind() {
    board.querySelectorAll(".jPiece").forEach(
      (p) =>
        (p.onclick = () => {
          if (!selected) {
            selected = p;
            p.classList.add("picked");
            return;
          }
          if (selected === p) {
            p.classList.remove("picked");
            selected = null;
            return;
          }
          const marker = document.createElement("span");
          selected.before(marker);
          p.before(selected);
          marker.replaceWith(p);
          selected.classList.remove("picked");
          selected = null;
          moves++;
          gameBody.querySelector("#pMoves").textContent = moves;
          check();
        }),
    );
  }
  function check() {
    const ok = [...board.children].every((p, i) => +p.dataset.home === i);
    if (ok) {
      gameBody.querySelector(".gameStatus").textContent =
        "🎉 퍼즐 완성! " + moves + "번 만에 성공했어! ⭐";
      state.stars++;
      save();
      board.querySelectorAll("button").forEach((x) => (x.disabled = true));
    }
  }
  themesEl
    .querySelectorAll("button")
    .forEach((b) => (b.onclick = () => load(+b.dataset.theme)));
  load(0);
  const clock = Session.interval(() => {
    if (!game.open) {
      clearInterval(clock);
      return;
    }
    let n = Math.floor((Date.now() - start) / 1000);
    let e = gameBody.querySelector("#pTime");
    if (e)
      e.textContent =
        String(Math.floor(n / 60)).padStart(2, "0") +
        ":" +
        String(n % 60).padStart(2, "0");
  }, 1000);
}
function playClaw() {
  let coins = 10,
    x = 50,
    prizes = 0,
    busy = false,
    downHandler,
    round = 0;
  const icons = [
    "🧸",
    "🦖",
    "🤖",
    "🐼",
    "🚗",
    "🦁",
    "🐰",
    "🐯",
    "🐶",
    "🦊",
    "🐨",
    "🐵",
    "🐙",
    "🦈",
    "🚀",
    "🚒",
    "🏎️",
    "⚽",
    "🐲",
    "🐧",
    "🦕",
    "🐻",
    "🐸",
    "🛸",
  ];
  const toys = Array.from({ length: 34 }, (_, i) => ({
    icon: icons[i % icons.length],
    x: 5 + Math.random() * 90,
    y: 3 + Math.random() * 82,
    rot: -25 + Math.random() * 50,
    size: 34 + Math.random() * 18,
    won: false,
  }));
  gameShell(
    "🕹️ 인형뽑기",
    '<div class="clawHud"><b>🪙 코인 <span id="clawCoins">10</span></b><b>🎁 뽑은 인형 <span id="clawWins">0</span></b><b>🎯 집게 위치 <span id="clawPos">50</span></b></div><div class="clawMachine realClaw"><div class="clawRail"><div class="clawHead"><span class="clawCar">▰</span><div class="clawArm"><i></i><span class="clawGrip">⌄</span></div></div></div><div class="toyBin"></div><div class="clawGlass"></div><div class="clawSlot">🪙 1 COIN</div></div><p class="gameStatus">← → 로 위치를 아주 잘 맞춘 뒤 Space! 집게 힘이 매번 달라서 쉽게 안 뽑혀요.</p>',
    '<button data-claw="L">◀</button><button data-claw="R">▶</button><button data-claw="GO">🪙 넣고 뽑기 (Space)</button>',
  );
  const head = gameBody.querySelector(".clawHead"),
    arm = gameBody.querySelector(".clawArm"),
    grip = gameBody.querySelector(".clawGrip"),
    bin = gameBody.querySelector(".toyBin"),
    msg = gameBody.querySelector(".gameStatus");
  toys.forEach((t, i) => {
    let e = document.createElement("span");
    e.className = "clawToy";
    e.dataset.i = i;
    e.textContent = t.icon;
    e.style.left = t.x + "%";
    e.style.bottom = t.y + "px";
    e.style.fontSize = t.size + "px";
    e.style.transform = "translateX(-50%) rotate(" + t.rot + "deg)";
    e.style.zIndex = 1 + Math.floor(t.y / 10);
    bin.appendChild(e);
  });
  function draw() {
    head.style.left = x + "%";
    gameBody.querySelector("#clawPos").textContent = Math.round(x);
  }
  function move(d) {
    if (!busy) {
      x = Math.max(5, Math.min(95, x + d));
      draw();
    }
  }
  function go() {
    if (busy) return;
    if (coins <= 0) {
      msg.textContent = "코인이 없어! 다시 시작하면 코인이 충전돼.";
      return;
    }
    coins--;
    round++;
    gameBody.querySelector("#clawCoins").textContent = coins;
    busy = true;
    grip.classList.remove("closed");
    arm.classList.add("down");
    msg.textContent = "집게가 내려가는 중...";
    Session.timeout(() => {
      const candidates = toys
        .map((t, i) => ({ t, i, dist: Math.abs(t.x - x) }))
        .filter((o) => !o.t.won && o.dist < 10)
        .sort((a, b) => a.dist - b.dist);
      const target = candidates[0];
      let success = false;
      if (target) {
        const center = Math.max(0, 1 - target.dist / 10);
        const crowd = candidates.length;
        const gripPower = 0.28 + Math.random() * 0.42;
        const buried =
          Math.min(0.35, target.t.y / 220) + (crowd > 2 ? 0.12 : 0);
        const chance = Math.max(
          0.08,
          Math.min(0.68, center * 0.62 + gripPower * 0.35 - buried),
        );
        success = Math.random() < chance;
        const el = bin.querySelector('[data-i="' + target.i + '"]');
        grip.classList.add("closed");
        if (success) {
          msg.textContent = "잡았다! 떨어뜨리지 않게 버텨라...";
          el.classList.add("caught");
          Session.timeout(() => {
            const holdChance = 0.58 + Math.min(0.2, center * 0.2);
            if (Math.random() < holdChance) {
              target.t.won = true;
              el.classList.add("won");
              el.classList.remove("caught");
              prizes++;
              gameBody.querySelector("#clawWins").textContent = prizes;
              msg.textContent = "🎉 " + target.t.icon + " 뽑기 성공! ⭐";
              state.stars++;
              save();
            } else {
              el.classList.remove("caught");
              el.classList.add("dropped");
              target.t.x = Math.max(
                6,
                Math.min(94, target.t.x + (Math.random() - 0.5) * 12),
              );
              target.t.y = Math.max(2, target.t.y - 8);
              el.style.left = target.t.x + "%";
              el.style.bottom = target.t.y + "px";
              Session.timeout(() => el.classList.remove("dropped"), 450);
              msg.textContent = "앗! 올라오다가 떨어졌어. 위치를 다시 맞춰봐!";
            }
          }, 700);
        } else
          msg.textContent =
            target.dist < 4
              ? "집게가 인형을 눌렀지만 힘이 부족했어!"
              : "살짝 빗나갔어. 인형 중심을 더 정확히 맞춰봐!";
      } else
        msg.textContent = "허공을 잡았어! 인형 위에 집게 중심을 맞춰야 해.";
      Session.timeout(
        () => {
          arm.classList.remove("down");
          grip.classList.remove("closed");
          Session.timeout(() => (busy = false), 650);
        },
        success ? 1450 : 650,
      );
    }, 950);
  }
  gameBody.querySelector('[data-claw="L"]').onclick = () => move(-3);
  gameBody.querySelector('[data-claw="R"]').onclick = () => move(3);
  gameBody.querySelector('[data-claw="GO"]').onclick = go;
  downHandler = (e) => {
    if (!game.open) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      move(-2);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      move(2);
    }
    if (e.key === " ") {
      e.preventDefault();
      go();
    }
  };
  Session.key(downHandler);
  const back = gameBody.querySelector(".backWorld");
  if (back)
    back.addEventListener(
      "click",
      () => document.removeEventListener("keydown", downHandler),
      { once: true },
    );
  draw();
}

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
