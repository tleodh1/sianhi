# Architecture / 유지보수 가이드

## 현재 상태

현재 앱은 정적 HTML/CSS/JavaScript 기반이며 서버 인증이나 데이터베이스 없이 동작합니다. 기존 구현은 `style.css`와 `app.js`가 커진 레거시 구조이므로, 새 기능을 추가할 때 더 이상 한 파일에 계속 누적하지 않는 것을 원칙으로 합니다.

## 목표 구조

```
assets/
  characters/
  world/
  games/
  subjects/
  ui/
css/
  base.css
  layout.css
  components.css
  world.css
  games/
js/
  app.js
  core/
    state.js
    storage.js
    navigation.js
  curriculum/
    arithmetic.js
    math.js
    thinking-math.js
    korean.js
    english.js
    science.js
    coding.js
    hanja.js
  games/
    hangul-runner.js
    claw-machine.js
    puzzle.js
    tetris.js
    brick-breaker.js
    english-memory.js
docs/
```

## 책임 분리

- **core**: 저장, 상태, 화면 전환 등 공통 기능만 담당.
- **curriculum**: 문제/스테이지 데이터와 학습 규칙. 화면 디자인과 분리.
- **games**: 게임별 입력, 물리, 충돌, 점수, 정리(cleanup)를 각 모듈 안에서 처리.
- **css/games**: 게임별 스타일을 분리하여 다른 게임 selector와 충돌하지 않도록 게임 root class 아래에 scope.
- **assets**: 화면 캡처 한 장이 아니라 움직이는 캐릭터/배경/아이템을 용도별 에셋으로 분리.

## 새 게임 추가 규칙

1. 게임 root element에 고유 class를 사용.
2. keyboard/timer/requestAnimationFrame listener를 시작했다면 게임 종료 시 반드시 제거.
3. 전역 변수 추가를 최소화.
4. 진행 저장은 공통 state/storage 계층을 통해서만 수행.
5. DOM에 외부/사용자 문자열을 넣을 때 `innerHTML` 대신 `textContent` 우선.
6. 모바일 터치와 PC 키보드를 함께 고려.
7. 게임월드 진입 → 플레이 → 종료 → 재진입을 3회 반복해 listener 중복 여부 확인.

## 커리큘럼 원칙

연산/교과 수학/사고력 수학은 서로 분리합니다. 사고력 수학은 수 감각·그림 관찰·규칙·논리·도형·공간·조건 추론 중심의 독자 문제로 구성합니다.

## 리팩터링 우선순위

1. 게임별 JS 분리
2. 커리큘럼 데이터 분리
3. state/storage 공통화
4. CSS base/components/game 분리
5. 자동 smoke test 추가

기능 동작을 보존하면서 한 영역씩 옮기며, 전체 파일을 한 번에 갈아엎지 않습니다.
