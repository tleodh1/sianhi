const SUBJECTS = [
  ["연산", "1+2", "#f4bd63", "10 이내의 수부터 차근차근"],
  ["수학", "△", "#8acdb0", "모양·시간·크기의 발견"],
  ["사고력 수학", "?", "#b3a1e0", "규칙을 찾고 생각을 넓혀요"],
  ["한글", "가", "#f39b98", "가나다에서 이야기까지"],
  ["영어", "Aa", "#8fc9e7", "ABC와 소리부터 천천히"],
  ["과학", "⚗", "#a9ce83", "관찰하고 예상해요"],
  ["코딩", "{ }", "#9bb7e9", "순서대로 스스로 해결해요"],
  ["한자", "山", "#efc18c", "그림처럼 만나는 한자"],
];
const GAMES = [
  [
    "runner",
    "한글 달리기",
    "LETTER ADVENTURE",
    "점프하며 글자를 모아요",
    "assets/game-cards/hangul-runner.webp",
    "시안이가 한글 블록을 모으며 달리는 모습",
  ],
  [
    "brick",
    "별빛 벽돌깨기",
    "STAR BREAKER",
    "통통 튀는 공으로 별을 깨워요",
    "assets/game-cards/star-breaker.webp",
    "시안이가 빛나는 공으로 벽돌을 깨는 모습",
  ],
  [
    "memory",
    "영어 카드 뒤집기",
    "ALPHABET FRIENDS",
    "숨은 영어 친구를 찾아요",
    "assets/game-cards/alphabet-friends.webp",
    "시안이가 영어 카드를 뒤집어 친구를 찾는 모습",
  ],
  [
    "claw",
    "토이 인형뽑기",
    "TOY COLLECTION",
    "집게를 움직여 친구를 잡아요",
    "assets/game-cards/toy-claw.webp",
    "시안이가 집게로 인형을 뽑는 모습",
  ],
  [
    "shape",
    "명화 퍼즐",
    "MASTERPIECE PUZZLE",
    "조각조각 명화를 완성해요",
    "assets/game-cards/masterpiece-puzzle.webp",
    "시안이가 별이 빛나는 밤 퍼즐을 맞추는 모습",
  ],
  [
    "tetris",
    "블록 공장",
    "BLOCK FACTORY",
    "차곡차곡 빈틈없이 쌓아요",
    "assets/game-cards/block-factory.webp",
    "시안이가 빛나는 블록 게임을 완성하는 모습",
  ],
  [
    "robot",
    "로봇 메이커",
    "ROBOT ARENA",
    "내 로봇을 조립하고 배틀해요",
    "assets/game-cards/robot-maker.webp",
    "시안이가 자신만의 로봇을 조립하는 모습",
  ],
];
const escapeText = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
function render() {
  document.getElementById("stars").textContent = state.stars;
  document.getElementById("level").textContent =
    "LEVEL " + (Math.floor(state.stars / 15) + 1);
}
function cards() {
  return GAMES.map(
    (g) =>
      `<button class="adventureCard adventureCard--${g[0]}" data-game="${g[0]}" aria-label="${g[1]} 게임 시작"><div class="cardPicture"><img src="${g[4]}" alt="${g[5]}" loading="lazy" decoding="async"><span class="cardShine" aria-hidden="true"></span></div><div class="cardCopy"><small>${g[2]}</small><h3>${g[1]}</h3><p>${g[3]}</p><b aria-hidden="true">→</b></div></button>`,
  ).join("");
}
function subjectButtons() {
  return SUBJECTS.map(
    (s) =>
      `<button class="islandButton" data-subject="${s[0]}" style="--subject:${s[2]}"><span>${s[1]}</span><div><b>${s[0]}</b><small>${s[3]}</small></div></button>`,
  ).join("");
}
function bind() {
  document
    .querySelectorAll("[data-subject]")
    .forEach((b) => (b.onclick = () => openStageMap(b.dataset.subject)));
  document
    .querySelectorAll("[data-game]")
    .forEach((b) => (b.onclick = () => launch(b.dataset.game)));
  document
    .querySelectorAll("[data-page]")
    .forEach((b) => (b.onclick = () => go(b.dataset.page)));
}
function go(page) {
  if (location.hash === "#" + page) show(page);
  else location.hash = page;
}
function show(page = "home") {
  closeGame();
  const main = $("#main");
  document
    .querySelectorAll("[data-nav]")
    .forEach((b) => b.classList.toggle("active", b.dataset.nav === page));
  if (page === "home") {
    main.innerHTML = `<section class="skyWorld"><div class="welcome"><small>A LITTLE ADVENTURE, EVERY DAY</small><h1>시안아, 안녕!<br>오늘은 <em>어디로</em><br>떠나 볼까?</h1><p>배움의 섬에서 놀고, 발견하고.<br>작은 도전이 반짝이는 별이 될 거야.</p><button id="todayStart">오늘의 모험 시작하기　→</button><span>하루 10~15분 · 시안이의 속도로</span></div><div class="worldBadge">✦　시안이의 하늘 모험 월드</div><div class="chapter"><strong>01</strong><p>반짝이는 배움의 섬<br>첫 모험이 시작되는 곳</p></div><div class="islandMenu">${subjectButtons()}</div></section><section class="homeContent"><div class="dailyBar"><div><h2>오늘의 작은 도전</h2><p>두 번의 배움, 한 번의 놀이</p></div><button data-subject="연산"><i>01</i><div><b>숫자 숲 탐험</b><small>10 이내의 수 · 약 3분</small></div></button><button data-subject="한글"><i>02</i><div><b>가나다 꽃밭</b><small>글자와 낱말 · 약 3분</small></div></button><button data-game="runner"><i>03</i><div><b>한글 달리기</b><small>글자를 모으며 점프!</small></div></button></div><div class="headingLine"><h2>놀이가 모험이 되는 순간</h2><button data-page="games">모든 게임 보기 →</button></div><div class="adventureGrid">${cards()}</div><p class="encourage">틀려도 괜찮아. 다시 해 보면 되니까. 시안이의 모든 도전을 응원해!</p></section>`;
    $("#todayStart").onclick = () =>
      playStage100("연산", state.stage100["연산"] || 1);
  } else if (page === "learning") {
    main.innerHTML = `<section class="pageWrap"><small class="eyebrow">LEARNING ISLANDS</small><h1>어디로 떠나 볼까?</h1><p class="pageLead">8가지 배움, 작은 미션으로 차근차근 완성해요.</p><div class="learningGrid">${subjectButtons()}</div><p class="encourage">각 과목은 10개 월드로 이어져요. 완료한 단계는 언제든 다시 즐길 수 있어요.</p></section>`;
  } else if (page === "games") {
    main.innerHTML = `<section class="pageWrap"><small class="eyebrow">PLAY, DISCOVER, GROW</small><h1>시안이의 게임 월드</h1><p class="pageLead">직접 움직이고, 만들고, 도전해요. 어떤 모험부터 시작할까요?</p><div class="adventureGrid">${cards()}</div></section>`;
  } else if (page === "records") {
    main.innerHTML = `<section class="pageWrap"><small class="eyebrow">MY LITTLE ACHIEVEMENTS</small><h1>시안이의 반짝이는 기록</h1><p class="pageLead">조금씩 쌓인 도전이 이렇게 커졌어요.</p><div class="recordStats"><article><strong>${state.stars}</strong>모은 별</article><article><strong>${Object.keys(state.completed).length}</strong>완료한 새 미션</article><article><strong>${Math.floor(state.stars / 15) + 1}</strong>탐험가 레벨</article></div><div class="learningGrid">${SUBJECTS.map((s) => `<button class="progressCard" data-subject="${s[0]}"><b>${s[0]}</b><span>${state.stage100[s[0]] || 1} / 100단계</span><progress value="${state.stage100[s[0]] || 1}" max="100"></progress><small>계속하기 →</small></button>`).join("")}</div></section>`;
  } else if (page === "collection") {
    main.innerHTML = `<section class="pageWrap"><small class="eyebrow">MY TREASURE ROOM</small><h1>반짝반짝 수집함</h1><p class="pageLead">모험에서 모은 별과 달성한 월드 배지를 확인해요.</p><div class="collectionGrid">${
      SUBJECTS.filter((s) => (state.stage100[s[0]] || 1) > 10)
        .map(
          (s) =>
            `<article class="badgeCard"><span>★</span><h3>${s[0]} 탐험 배지</h3><p>${Math.floor(((state.stage100[s[0]] || 1) - 1) / 10)}개 월드 완료</p></article>`,
        )
        .join("") ||
      '<div class="emptyBox">첫 월드를 마치면 배지를 받을 수 있어요.<br>작은 미션부터 함께 시작해 볼까요?</div>'
    }</div></section>`;
  } else parentPage();
  bind();
  render();
  window.scrollTo(0, 0);
}
function launch(id) {
  Session.begin();
  game.showModal();
  const fn = {
    runner: playRunner,
    brick: playBrick,
    memory: playMemory,
    claw: playClaw,
    shape: playShape,
    tetris: playTetris,
    robot: playRobot,
  }[id];
  if (fn) fn();
}
function parentPage() {
  $("#main").innerHTML =
    '<section class="pageWrap parentPage"><small class="eyebrow">FOR PARENTS</small><h1>함께하는 배움 안내</h1><article><h3>하루 두 번의 배움, 한 번의 놀이</h3><p>처음에는 10~15분으로 시작해 주세요. 틀린 문제는 다시 시도할 수 있고, 완료한 미션은 언제든 복습할 수 있어요.</p></article><article><h3>진도는 이 브라우저에 저장돼요</h3><p>기존 별과 학습 진도를 유지합니다. 다른 기기로 옮기거나 브라우저 데이터를 지우기 전 저장 파일을 내려받아 주세요. 자동 기기 동기화나 계정 로그인 기능은 없습니다.</p><div class="parentActions"><button id="exportSave">기록 파일 저장</button><button id="importSave">기록 파일 불러오기</button><input id="saveFile" type="file" accept=".json,application/json" hidden></div></article><article><h3>소리와 개인정보</h3><p>카메라·마이크·위치 접근을 요청하지 않습니다. 상단 소리 버튼으로 음성 읽기를 켜고 끌 수 있습니다. 보호자 안내는 암호 잠금 기능이 아닙니다.</p></article></section>';
  $("#exportSave").onclick = () => {
    const url = URL.createObjectURL(
        new Blob([JSON.stringify(state, null, 2)], {
          type: "application/json",
        }),
      ),
      a = document.createElement("a");
    a.href = url;
    a.download = "sianhi-progress.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  $("#importSave").onclick = () => $("#saveFile").click();
  $("#saveFile").onchange = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 2000000) return notify("파일이 너무 커요.");
    try {
      const data = JSON.parse(await f.text());
      if (
        !data ||
        typeof data.stars !== "number" ||
        !data.stage100 ||
        !Array.isArray(data.done)
      )
        throw Error();
      if (
        confirm(
          "선택한 파일의 진도로 바꿀까요? 현재 기록은 먼저 파일로 저장해 주세요.",
        )
      ) {
        localStorage.setItem("sianhi-v2", JSON.stringify(data));
        state = loadState();
        render();
        notify("기록을 불러왔어요.");
      }
    } catch {
      notify("올바른 시안Hi 기록 파일을 골라 주세요.");
    }
  };
}
document.querySelector(".close").onclick = closeGame;
document
  .querySelectorAll("[data-nav]")
  .forEach((b) => (b.onclick = () => go(b.dataset.nav)));
$("#parentButton").onclick = () => go("parent");
$("#profileButton").onclick = () => go("records");
$("#soundToggle").onclick = () => {
  state.sound = !state.sound;
  save();
  $("#soundToggle").setAttribute(
    "aria-label",
    state.sound ? "소리 끄기" : "소리 켜기",
  );
  notify(state.sound ? "소리를 켰어요." : "소리를 껐어요.");
};
window.addEventListener("hashchange", () =>
  show(location.hash.slice(1) || "home"),
);
show(location.hash.slice(1) || "home");
