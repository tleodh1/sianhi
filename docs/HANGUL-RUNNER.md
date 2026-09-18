# 한글 달리기 2.5D Adventure

기준: 운영 main 9f7c7cd. 홈, 학습, 다른 게임, core.js 수정 없음.

## 모듈
- stage-data.js: 7단계 낱말/문장, 플랫폼·절벽·몬스터·체크포인트 배치
- engine.js: DOM 독립 120Hz 물리 시뮬레이션, 충돌, 상태, 별 보상 마이그레이션
- controls.js: 키보드/멀티 포인터 입력. 인스턴스별 해제, blur/visibility reset
- renderer.js: Canvas 2D, 3D 렌더 스프라이트, 8종 레이어 패럴랙스, 카메라 밖 오브젝트 생략
- ../hangul-runner.js: dialog 수명, 단일 RAF, 오디오, HUD, 메뉴, 기록 연결
- css/games/hangul-runner.css: 한글 달리기 dialog 전용 스타일

## 저장 호환
기존 sianhi-v2를 그대로 사용. 기존 stars, done, progress, stage100, completed,
collection, records의 다른 키는 유지. records.hangulRunner(version 1)에 단계별
최고 평가, 가장 짧은 시간, 최근 획득 결과, 다음 단계 해금 저장.
전역 별은 기존 최고 평가보다 향상된 1~3별의 차이만 지급. 코인/모험 별은
그 판의 기록이며 전역 별과 구분. 진행 중 판은 저장하지 않고 완료 기록을 저장.

## 그래픽 제작
2026-09-18 built-in image_gen 사용. 원본 생성 PNG는 작업 디렉터리에 보관하고,
실제 게임은 알파 보존 WebP 3개(총 약 1.2MB)를 사용. 런타임에서 atlas를
자르고 외부 투명 여백을 정리. 외부 이미지·스크립트 요청 없음.

프롬프트 요약(의도/배치 보존):
1. character: original Korean boy, orange jacket, teal shorts, white teal cap,
   right-facing polished 3D toy render, transparent 4x4 atlas; 8 running frames,
   idle/jump/fall/land/hurt/power-up/dead/celebrate, consistent camera and scale.
2. objects: transparent 4x4 atlas, 3D grass cliff/floating platform/rope bridge/tree,
   teal jelly/purple sprout/rock/log/thorn/crate/gold coin/star/star-fruit/cloud/flowers/portal.
3. scenery: transparent 2x2 parallax atlas: distant floating mountains,
   ivory teal-roof castle island, cliff waterfall, dense rounded forest.
All original design, no franchise character/object, no labels or UI.

## 검증 명령
node tests/hangul-runner.test.cjs
node tests/runner-controls.test.cjs
npm test

## 난이도와 확장
기본 속도 270px/s, 중력 1500px/s², 점프 초기 속도 -650px/s.
최대 점프 높이 약 141px. 기본 절벽 너비 115px, 보조 발판 높이 126px.
피격 무적 1.6초. 낙하 후 0.85초에 체크포인트 재시작.
작은 상태 HP 소진 시 HP 3으로 재도전, 글자/아이템 중복 획득 없음.
콘텐츠 확장은 stages에 항목 추가. 새 지형은 buildStage에서 배치.

## 2026-09-18 검증 기록
- 엔진 테스트 11개: 통과. 7개 단계 모두 정상 이동/점프만으로 완주.
- 입력 테스트: 3회 생성/종료, 두 포인터 동시 입력/취소/blur 후 해제 통과.
- 로컬 PC 브라우저 실제 키보드 Stage 1 완주: 14/14 글자, 모험 별 9,
  코인 18, 124초, HP 1, 평가 2별. 다음 단계 진입과 재진입 시 해금 유지 확인.
- 로컬 PC 및 390px 프레임 각각 열기/조작/닫기/재진입 3회 확인.
  열린 세션 RAF 소유 1개/입력 리스너 22개, 닫힌 세션 모두 0.
  자체 반복 타이머 없음. AudioContext/ResizeObserver/RAF도 종료 시 해제.
- 모바일 390px dialog clientWidth=scrollWidth=359px. 가로 넘침 없음.
- tests/runner-responsive.html은 로컬 반응형 확인용. 운영 CSP는 iframe 삽입을
  차단하므로 운영에서 해당 fixture를 사용하지 않는다.
- 홈/학습/core.js/기타 게임 함수/기존 CSS/Vercel 보안 설정 원문 동일 검증.
- 실제 iOS/Android 장치 및 운영 모바일 터치 실기기 테스트는 이 환경에서 미실시.


## 운영 배포 후 확인
- 운영 코드 커밋: f0420c736fc2807f8f4260eed639f581ad55d7ed. Vercel success 확인.
- https://sianhi.vercel.app/ 실제 키보드 플레이로 Stage 1 완주.
  글자 14/14, 모험 별 13, 코인 26, 283초, HP 3, 평가 2별.
- 플레이 중 낙하·HP 소진·체크포인트 재시작 및 글자 유지 확인.
- 다음 스테이지 버튼으로 Stage 2 진입, 페이지 새로고침 후 Stage 2 해금 유지.
- 운영본 열기/키보드 및 화면 버튼 조작/닫기/재진입 3회 추가 확인.
- 종료 시 게임 소유 RAF 및 입력 리스너 해제 확인. 애플리케이션 오류 0개
  (브라우저 확장 프로그램 자체 로그 제외).
- 한계: 모바일 너비는 로컬 390px, touch pointer는 입력 단위 테스트로 확인.
  실제 모바일 기기에서 운영 주소의 멀티터치·성능을 검증한 것은 아님.
