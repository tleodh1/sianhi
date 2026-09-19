const CURRICULUM100 = {
  연산: [
    ["수 감각 모험", "10·20까지 수, 수의 순서와 크기, 10 만들기"],
    ["덧셈 마을", "한 자리 수 덧셈, 합이 20 이하"],
    ["뺄셈 동굴", "한 자리 수 뺄셈, 받아내림 전 기초"],
    ["100 숫자성", "두 자리 수, 자릿값, 100까지 수"],
    ["계산 다리", "두 자리 수 덧셈·뺄셈"],
    ["곱셈 숲", "묶어 세기와 곱셈구구"],
    ["나눗셈 항구", "똑같이 나누기와 나눗셈"],
    ["큰 수 사막", "세 자리 수와 받아올림·내림"],
    ["곱셈 공장", "두·세 자리 수 × 한 자리 수"],
    ["분수 별나라", "분수 기초와 생활 속 계산"],
  ],
  수학: [
    ["수와 양", "수 세기·대응·비교"],
    ["측정 놀이터", "길이·높이·무게·들이 비교"],
    ["시계 마을", "시각과 시간"],
    ["돈 가게", "동전·화폐와 생활 계산"],
    ["표와 분류", "기준 세우기와 자료 정리"],
    ["규칙 왕국", "반복·증가 규칙"],
    ["문제해결 숲", "그림·식으로 나타내기"],
    ["곱셈 관계", "배·묶음·배열"],
    ["분수 지도", "전체와 부분"],
    ["자료 탐정단", "표·그래프 읽기"],
  ],
  "사고력 수학": [
    ["같은 것 찾기", "분류·짝짓기·공통점"],
    ["규칙 기차", "반복 규칙과 다음 항"],
    ["도형 공방", "평면도형 구성·분해"],
    ["공간 미로", "위치·방향·회전"],
    ["조건 탐정", "조건 1~2개로 추리"],
    ["측정 연구소", "길이·넓이·들이 비교"],
    ["대칭 성", "선대칭과 모양 완성"],
    ["논리 다리", "순서·관계·경우 찾기"],
    ["전개도 행성", "입체 감각·쌓기나무"],
    ["캥거루 챌린지", "복합 규칙·논리 문제해결"],
  ],
  한글: [
    ["소리 숲", "자음·모음 소리와 글자 대응"],
    ["가나다 마을", "기본 음절과 첫소리"],
    ["받침 동굴", "기초 받침 낱말"],
    ["낱말 정원", "낱말 뜻·범주·반대말"],
    ["문장 기차", "문장 순서와 조사 기초"],
    ["이야기 숲", "짧은 글 읽고 내용 찾기"],
    ["맞춤법 마을", "띄어쓰기·기초 맞춤법"],
    ["독해 탐정단", "중심 내용·원인과 결과"],
    ["표현 극장", "문장 바꾸기·이어 쓰기"],
    ["책 속 왕국", "초3 수준 짧은 글 독해·어휘"],
  ],
  영어: [
    ["ABC 섬", "대·소문자와 알파벳 소리"],
    ["파닉스 숲", "기초 자음 소리"],
    ["모음 호수", "short vowel CVC"],
    ["단어 마을", "생활 기초 어휘"],
    ["문장 기차", "I am / This is / I like"],
    ["소리 동굴", "blends·digraphs 기초"],
    ["읽기 정원", "짧은 문장 읽기"],
    ["질문 탐정", "who·what·where 기초"],
    ["이야기 극장", "짧은 영어 이야기 순서"],
    ["리딩 스타", "초3 기초 문장·짧은 지문 이해"],
  ],
  과학: [
    ["관찰 숲", "오감으로 관찰하고 분류"],
    ["생명 정원", "동물·식물과 성장"],
    ["물질 주방", "고체·액체와 재료 성질"],
    ["날씨 마을", "계절·날씨·생활"],
    ["힘 놀이터", "밀기·당기기·자석"],
    ["빛과 소리 성", "빛·그림자·소리"],
    ["지구 탐험대", "땅·물·하늘 관찰"],
    ["생태 섬", "생물과 환경의 관계"],
    ["물질 연구소", "상태·혼합·분리 기초"],
    ["과학 탐정단", "예상→실험→관찰→결론"],
  ],
  코딩: [
    ["명령 숲", "방향과 한 단계 명령"],
    ["순서 다리", "명령 순서와 실행"],
    ["반복 동굴", "같은 움직임 반복"],
    ["조건 마을", "만약~라면 선택"],
    ["디버그 연구소", "틀린 순서 고치기"],
    ["좌표 섬", "격자·위치와 경로"],
    ["패턴 공장", "반복 패턴 압축"],
    ["알고리즘 성", "여러 방법 비교"],
    ["미션 로봇", "장애물·아이템 복합 경로"],
    ["코딩 챌린지", "반복·조건·최단경로 종합"],
  ],
  한자: [
    ["그림 한자", "日月山川木火水"],
    ["사람과 몸", "人大口目耳手足"],
    ["숫자 한자", "一二三四五六七八九十"],
    ["자연 마을", "天地雨石田林"],
    ["방향 성", "上下左右中大小"],
    ["생활 한자", "門車学校年"],
    ["뜻 연결", "부수 그림과 뜻 연결"],
    ["한자 낱말", "생활 속 한자어 기초"],
    ["반대 짝", "大小·上下·左右 등"],
    ["한자 탐정단", "초등 기초 한자 뜻·음 종합"],
  ],
};
function build100(subject) {
  const zones = CURRICULUM100[subject] || CURRICULUM100["수학"];
  return Array.from({ length: 100 }, (_, i) => {
    const z = Math.floor(i / 10),
      k = i % 10,
      info = zones[z];
    return {
      stage: i + 1,
      zone: z + 1,
      title: info[0],
      skill: info[1],
      mode: [
        "탐색",
        "찾기",
        "움직이기",
        "짝맞추기",
        "선택",
        "퍼즐",
        "응용",
        "이야기",
        "도전",
        "보스",
      ][k],
      story: [
        "토토가 새로운 지도를 발견했어.",
        "별빛 문을 열 열쇠를 찾아보자.",
        "친구가 길을 잃었어. 배운 힘으로 도와줘!",
        "숨은 규칙을 찾으면 다리가 나타나.",
        "알맞은 답을 골라 보물상자를 열자.",
        "조각을 맞춰 다음 길을 만들자.",
        "배운 방법을 다른 상황에도 써 보자.",
        "이야기 속 단서를 찾아 해결하자.",
        "힌트 없이 스스로 도전해 보자.",
        "별지기 보스의 마지막 미션을 해결하자!",
      ][k],
    };
  });
}
const LEARNING_SUBJECTS = [
  "연산",
  "수학",
  "사고력 수학",
  "한글",
  "영어",
  "과학",
  "코딩",
  "한자",
];
state.stage100 = state.stage100 || {};
LEARNING_SUBJECTS.forEach((n) => {
  if (!state.stage100[n]) state.stage100[n] = 1;
});
let arithmeticAnswerBag = [];
let arithmeticLastPosition = -1;
function nextArithmeticAnswerPosition() {
  if (!arithmeticAnswerBag.length) {
    arithmeticAnswerBag = [0, 1, 2, 3];
    for (let i = arithmeticAnswerBag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arithmeticAnswerBag[i], arithmeticAnswerBag[j]] = [
        arithmeticAnswerBag[j],
        arithmeticAnswerBag[i],
      ];
    }
    if (arithmeticAnswerBag[0] === arithmeticLastPosition)
      [arithmeticAnswerBag[0], arithmeticAnswerBag[1]] = [
        arithmeticAnswerBag[1],
        arithmeticAnswerBag[0],
      ];
  }
  arithmeticLastPosition = arithmeticAnswerBag.shift();
  return arithmeticLastPosition;
}
function randomizeArithmeticOptions(question) {
  const answer = Number(question.ans);
  const options = [...new Set(question.opts.map(Number))].filter(Number.isFinite);
  for (let distance = 1; options.length < 4; distance++) {
    for (const candidate of [answer - distance, answer + distance]) {
      if (candidate >= 0 && !options.includes(candidate)) options.push(candidate);
      if (options.length === 4) break;
    }
  }
  const wrong = options.filter((value) => value !== answer).slice(0, 3);
  const position = nextArithmeticAnswerPosition();
  wrong.splice(position, 0, answer);
  return { ...question, opts: wrong, answerPosition: position };
}
function advancedQuestion(subject, stage) {
  const n = stage;
  if (subject === "연산") {
    let a = ((n * 3) % 80) + 10,
      b = ((n * 2) % 9) + 1;
    return n < 31
      ? {
          q: (a % 10) + " + " + b + " = ?",
          ans: String((a % 10) + b),
          opts: [
            (a % 10) + b,
            (a % 10) + b + 1,
            Math.max(0, (a % 10) + b - 1),
            (a % 10) + b + 2,
          ],
        }
      : n < 61
        ? {
            q: a + " - " + b + " = ?",
            ans: String(a - b),
            opts: [a - b, a - b + 1, a - b - 1, a + b],
          }
        : {
            q: (n % 9) + 2 + " × " + ((n % 8) + 2) + " = ?",
            ans: String(((n % 9) + 2) * ((n % 8) + 2)),
            opts: [
              ((n % 9) + 2) * ((n % 8) + 2),
              ((n % 9) + 2) * ((n % 8) + 2) + 2,
              ((n % 9) + 2) * ((n % 8) + 1),
              ((n % 9) + 1) * ((n % 8) + 2),
            ],
          };
  }
  if (subject === "수학")
    return {
      q: [
        "더 긴 것을 고르기",
        "시계가 3시라면 짧은 바늘은?",
        "100원짜리 3개는 얼마?",
        "규칙 2,4,6 다음 수는?",
      ][n % 4],
      ans: ["━━━━", "3", "300원", "8"][n % 4],
      opts: [
        ["━━", "━━━━", "━", "━━━"],
        ["3", "6", "9", "12"],
        ["200원", "300원", "400원", "500원"],
        ["7", "8", "9", "10"],
      ][n % 4],
    };
  if (subject === "사고력 수학")
    return {
      q: [
        "🔴🔵🔴🔵 다음은?",
        "▲ ▲ ● ▲ 에서 다른 것은?",
        "□를 오른쪽으로 한 칸 옮기면 어느 방향?",
        "1,2,4,8 다음 수는?",
      ][n % 4],
      ans: ["🔴", "●", "→", "16"][n % 4],
      opts: [
        ["🔴", "🔵", "🟢", "🟡"],
        ["▲", "●", "■", "★"],
        ["←", "→", "↑", "↓"],
        ["10", "12", "16", "18"],
      ][n % 4],
    };
  if (subject === "한글")
    return {
      q: [
        "「가」로 시작하는 말은?",
        "받침이 있는 낱말은?",
        "자연스러운 문장은?",
        "「기쁘다」와 뜻이 반대인 말은?",
      ][n % 4],
      ans: ["가방", "산", "나는 학교에 가요.", "슬프다"][n % 4],
      opts: [
        ["가방", "나무", "다리", "모자"],
        ["나", "산", "오이", "우유"],
        [
          "학교 나는 가요.",
          "나는 학교에 가요.",
          "가요 학교 나는.",
          "나는 가요를 학교.",
        ],
        ["즐겁다", "슬프다", "빠르다", "크다"],
      ][n % 4],
    };
  if (subject === "영어")
    return {
      q: [
        "A로 시작하는 단어는?",
        "cat의 첫 소리는?",
        "I ___ happy.",
        "Where is the cat? 뜻은?",
      ][n % 4],
      ans: ["Apple", "c", "am", "고양이는 어디에 있나요?"][n % 4],
      opts: [
        ["Apple", "Sun", "Dog", "Moon"],
        ["c", "m", "s", "t"],
        ["is", "am", "are", "be"],
        [
          "고양이는 누구인가요?",
          "고양이는 어디에 있나요?",
          "고양이는 무엇을 먹나요?",
          "고양이는 몇 살인가요?",
        ],
      ][n % 4],
    };
  if (subject === "과학")
    return {
      q: [
        "살아 있는 것은?",
        "자석에 붙는 것은?",
        "그림자가 생기려면 필요한 것은?",
        "식물이 자라려면 필요한 것은?",
      ][n % 4],
      ans: ["나무", "쇠못", "빛과 물체", "물과 빛"][n % 4],
      opts: [
        ["돌", "나무", "자동차", "연필"],
        ["종이", "쇠못", "나무", "고무"],
        ["바람", "빛과 물체", "냄새", "소리"],
        ["물과 빛", "장난감", "소리", "플라스틱"],
      ][n % 4],
    };
  if (subject === "한자")
    return {
      q: [
        "산을 뜻하는 한자는?",
        "물을 뜻하는 한자는?",
        "큰 대(大)는?",
        "위 상(上)은?",
      ][n % 4],
      ans: ["山", "水", "大", "上"][n % 4],
      opts: [
        ["山", "水", "木", "日"],
        ["火", "水", "月", "人"],
        ["小", "中", "大", "下"],
        ["下", "上", "左", "右"],
      ][n % 4],
    };
  return {
    q: "별까지 가장 알맞은 방향은?",
    ans: "→",
    opts: ["→", "←", "↑", "↓"],
  };
}
function stageQuestion(subject, stage) {
  const n = stage - 1;
  const number = (q, a) => ({
    q,
    ans: String(a),
    opts: [a, a + 1, Math.max(0, a - 1), a + 2].filter(
      (v, i, x) => x.indexOf(v) === i,
    ),
  });
  if (subject === "연산") {
    if (stage <= 10) {
      const a = (n % 5) + 1,
        b = Math.min(9 - a, (n % 4) + 1);
      return randomizeArithmeticOptions(stage % 2
        ? number(a + " + " + b + " = ?", a + b)
        : number(a + b + " − " + b + " = ?", a));
    }
    if (stage <= 20)
      return randomizeArithmeticOptions(number(
        (n % 9) + 1 + " + " + (((n * 3) % 9) + 1) + " = ?",
        (n % 9) + 1 + ((n * 3) % 9) + 1,
      ));
    if (stage <= 30) {
      const a = (n % 9) + 8,
        b = (n % 7) + 1;
      return randomizeArithmeticOptions(number(a + " − " + b + " = ?", a - b));
    }
  }
  if (subject === "한글" && stage <= 20) {
    const words = [
      "가방",
      "나비",
      "다리",
      "라디오",
      "마늘",
      "바나나",
      "사과",
      "아기",
      "자동차",
      "차",
      "카메라",
      "타조",
      "파도",
      "하마",
    ];
    const i = n % 14;
    return {
      q: "「" + words[i][0] + "」로 시작하는 낱말은?",
      ans: words[i],
      opts: [
        words[i],
        words[(i + 3) % 14],
        words[(i + 7) % 14],
        words[(i + 11) % 14],
      ],
    };
  }
  if (subject === "영어" && stage <= 10) {
    const upper = "ABCDEFGHIJ",
      i = n % 10;
    return {
      q: upper[i] + "의 소문자 짝꿍을 찾아요.",
      ans: upper[i].toLowerCase(),
      opts: [
        upper[i].toLowerCase(),
        upper[(i + 2) % 10].toLowerCase(),
        upper[(i + 5) % 10].toLowerCase(),
        upper[(i + 7) % 10].toLowerCase(),
      ],
    };
  }
  if (subject === "영어" && stage <= 20) {
    const pairs = [
      ["apple", "A"],
      ["ball", "B"],
      ["cat", "C"],
      ["dog", "D"],
      ["egg", "E"],
      ["fish", "F"],
      ["goat", "G"],
      ["hat", "H"],
      ["igloo", "I"],
      ["jam", "J"],
    ];
    const e = pairs[n % 10];
    return {
      q: e[0] + "의 첫 글자는?",
      ans: e[1],
      opts: [
        e[1],
        pairs[(n + 2) % 10][1],
        pairs[(n + 5) % 10][1],
        pairs[(n + 7) % 10][1],
      ],
    };
  }
  if (subject === "한자" && stage <= 20) {
    const h = [
        ["山", "산"],
        ["水", "물"],
        ["木", "나무"],
        ["日", "해"],
        ["月", "달"],
        ["火", "불"],
        ["人", "사람"],
        ["大", "큰"],
        ["小", "작은"],
        ["口", "입"],
      ],
      i = n % 10;
    return {
      q: h[i][1] + "을 뜻하는 한자는?",
      ans: h[i][0],
      opts: [
        h[i][0],
        h[(i + 2) % 10][0],
        h[(i + 5) % 10][0],
        h[(i + 7) % 10][0],
      ],
    };
  }
  const question = advancedQuestion(subject, stage);
  return subject === "연산" ? randomizeArithmeticOptions(question) : question;
}
function openStageMap(subject) {
  Session.begin();

  const stages = build100(subject),
    cur = state.stage100[subject] || 1,
    zone = Math.floor((cur - 1) / 10);
  gameBody.innerHTML =
    '<div class="stageMap"><div class="stageMapHead"><button class="mapClose">← 학습 월드</button><div><small>' +
    subject +
    " · 100단계 모험</small><h2>" +
    stages[cur - 1].title +
    "</h2><p>" +
    stages[cur - 1].skill +
    "</p></div><b>" +
    cur +
    ' / 100</b></div><div class="zoneTabs">' +
    Array.from(
      { length: 10 },
      (_, z) =>
        '<button class="' +
        (z === zone ? "on" : "") +
        '" data-zone="' +
        z +
        '">' +
        (z * 10 + 1) +
        "–" +
        (z * 10 + 10) +
        "</button>",
    ).join("") +
    '</div><div class="stageStory">📖 ' +
    stages[cur - 1].story +
    '</div><div class="stageNodes"></div></div>';
  const nodes = gameBody.querySelector(".stageNodes");
  function drawZone(z) {
    nodes.innerHTML = stages
      .slice(z * 10, z * 10 + 10)
      .map(
        (s) =>
          '<button class="stageNode ' +
          (s.stage < cur ? "clear" : s.stage === cur ? "current" : "locked") +
          '" data-stage="' +
          s.stage +
          '" ' +
          (s.stage > cur ? "disabled" : "") +
          "><i>" +
          (s.stage < cur ? "★" : s.stage) +
          "</i><b>" +
          s.mode +
          "</b><small>" +
          s.title +
          "</small></button>",
      )
      .join("");
    nodes
      .querySelectorAll(".stageNode:not(.locked)")
      .forEach(
        (b) => (b.onclick = () => playStage100(subject, +b.dataset.stage)),
      );
  }
  gameBody.querySelectorAll("[data-zone]").forEach(
    (b) =>
      (b.onclick = () => {
        gameBody
          .querySelectorAll("[data-zone]")
          .forEach((x) => x.classList.remove("on"));
        b.classList.add("on");
        drawZone(+b.dataset.zone);
      }),
  );
  gameBody.querySelector(".mapClose").onclick = () => game.close();
  drawZone(zone);
  game.showModal();
}
function playStage100(subject, stage) {
  Session.begin();

  if (subject === "코딩") {
    playCoding100(stage);
    return;
  }
  const info = build100(subject)[stage - 1],
    q = stageQuestion(subject, stage);
  gameBody.innerHTML =
    '<div class="storyStage"><div class="stageTop"><button class="backMap">← 지도</button><b>' +
    subject +
    " " +
    stage +
    '/100</b></div><div class="storyPanel"><small>CHAPTER ' +
    info.zone +
    " · " +
    info.mode +
    "</small><h2>" +
    info.title +
    "</h2><p>" +
    info.story +
    '</p></div><div class="questCard"><h3>' +
    q.q +
    '</h3><div class="choices">' +
    q.opts.map((x) => '<button class="choice">' + x + "</button>").join("") +
    '</div><div class="feedback">토토와 함께 생각해 봐!</div></div></div>';
  gameBody.querySelector(".backMap").onclick = () => openStageMap(subject);
  const voice = document.createElement("button");
  voice.className = "hint";
  voice.textContent = "이야기와 문제 듣기";
  voice.onclick = () => say(info.story + " " + q.q);
  gameBody.querySelector(".questCard").append(voice);
  gameBody.querySelectorAll(".choice").forEach(
    (b) =>
      (b.onclick = () => {
        let f = gameBody.querySelector(".feedback");
        if (b.textContent === q.ans) {
          f.innerHTML = "⭐ 성공! 이야기의 다음 길이 열렸어!";
          gameBody
            .querySelectorAll(".choice")
            .forEach((x) => (x.disabled = true));
          state.stage100[subject] = Math.max(
            state.stage100[subject] || 1,
            Math.min(100, stage + 1),
          );
          award("learn:" + subject + ":" + stage);
          const next = document.createElement("button");
          next.className = "nextBtn";
          next.textContent = stage < 100 ? "다음 미션 →" : "지도로 돌아가기";
          next.onclick = () =>
            stage < 100
              ? playStage100(subject, stage + 1)
              : openStageMap(subject);
          f.append(next);
        } else {
          b.classList.add("wrongBrick");
          f.textContent = "아직 아니야. 다른 단서를 찾아보자!";
          Session.timeout(() => b.classList.remove("wrongBrick"), 300);
        }
      }),
  );
  game.showModal();
}
function playCoding100(stage) {
  Session.begin();

  const size = stage < 31 ? 5 : stage < 71 ? 6 : 7,
    start = [size - 1, 0],
    goal = [0, size - 1],
    walls = [];
  for (let i = 1; i < size - 1; i++)
    if ((i + stage) % 3 === 0)
      walls.push([size - 1 - i, Math.min(size - 2, i)]);
  const L = {
    size,
    start,
    goal,
    walls,
    max: size * 3,
    name: "별길 " + stage,
    story: build100("코딩")[stage - 1].story,
  };
  let pos = [...start],
    queue = [],
    running = false;
  gameBody.innerHTML =
    '<div class="codingGame"><div class="stageTop"><button class="backMap">← 지도</button><b>코딩 ' +
    stage +
    '/100</b></div><div class="codingStory"><b>🤖 ' +
    L.name +
    "</b><span>" +
    L.story +
    '</span></div><div class="codingStage"><div class="codingBoard" style="--n:' +
    size +
    '"></div></div><div class="codingPanel"><div class="commandQueue"><span class="emptyQueue">명령을 차례대로 넣어 줘</span></div><div class="codingControls"><button data-cmd="U">↑<small>위</small></button><button data-cmd="R">→<small>오른쪽</small></button><button data-cmd="D">↓<small>아래</small></button><button data-cmd="L">←<small>왼쪽</small></button><button class="undoCmd">↶<small>취소</small></button></div><div class="codingActions"><button class="resetCode">다시</button><button class="runCode">▶ 출발!</button></div><div class="codingFeedback">별까지 가는 길을 만들어 봐.</div></div></div>';
  const board = gameBody.querySelector(".codingBoard"),
    qb = gameBody.querySelector(".commandQueue"),
    fb = gameBody.querySelector(".codingFeedback");
  function draw() {
    board.innerHTML = "";
    for (let r = 0; r < size; r++)
      for (let c = 0; c < size; c++) {
        let e = document.createElement("div");
        e.className = "codeCell";
        if (walls.some((w) => w[0] === r && w[1] === c)) {
          e.classList.add("wall");
          e.textContent = "🌳";
        }
        if (goal[0] === r && goal[1] === c)
          e.innerHTML = '<span class="goalStar">⭐</span>';
        if (pos[0] === r && pos[1] === c)
          e.innerHTML = '<span class="robot">🤖</span>';
        board.appendChild(e);
      }
  }
  function rq() {
    qb.innerHTML = queue.length
      ? queue
          .map(
            (x) =>
              '<span class="cmdChip">' +
              { U: "↑", R: "→", D: "↓", L: "←" }[x] +
              "</span>",
          )
          .join("")
      : '<span class="emptyQueue">명령을 차례대로 넣어 줘</span>';
  }
  gameBody.querySelector(".backMap").onclick = () => openStageMap("코딩");
  gameBody.querySelectorAll("[data-cmd]").forEach(
    (b) =>
      (b.onclick = () => {
        if (!running && queue.length < L.max) {
          queue.push(b.dataset.cmd);
          rq();
        }
      }),
  );
  gameBody.querySelector(".undoCmd").onclick = () => {
    if (running) return;
    queue.pop();
    rq();
  };
  gameBody.querySelector(".resetCode").onclick = () => {
    if (running) return;
    queue = [];
    pos = [...start];
    rq();
    draw();
  };
  gameBody.querySelector(".runCode").onclick = async () => {
    if (!queue.length || running) return;
    running = true;
    pos = [...start];
    draw();
    const d = { U: [-1, 0], R: [0, 1], D: [1, 0], L: [0, -1] };
    for (const cmd of queue) {
      await new Promise((r) => Session.timeout(r, 220));
      let nr = pos[0] + d[cmd][0],
        nc = pos[1] + d[cmd][1];
      if (
        nr < 0 ||
        nc < 0 ||
        nr >= size ||
        nc >= size ||
        walls.some((w) => w[0] === nr && w[1] === nc)
      ) {
        fb.textContent = "🌳 길이 막혔어. 명령을 고쳐 보자!";
        running = false;
        return;
      }
      pos = [nr, nc];
      draw();
      if (nr === goal[0] && nc === goal[1]) {
        fb.textContent = "⭐ 성공! 다음 별길이 열렸어!";
        state.stage100["코딩"] = Math.max(
          state.stage100["코딩"] || 1,
          Math.min(100, stage + 1),
        );
        award("learn:코딩:" + stage);
        running = false;
        Session.timeout(
          () => (stage < 100 ? playCoding100(stage + 1) : openStageMap("코딩")),
          600,
        );
        return;
      }
    }
    fb.textContent = "조금 더 가야 해. 명령을 추가해 봐!";
    running = false;
  };
  draw();
  rq();
  game.showModal();
}
