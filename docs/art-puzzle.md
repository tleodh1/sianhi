# 명화 퍼즐 — 구현 및 검증 기록

기준 main: 5cfdd622b2ba6b776cd6d5510687e114d967a5e4. 작업 대상은 playShape()로 연결되던 퍼즐 하나뿐이다.

## 실제 명화와 출처

| 작품 | 화가 | 연도 | 출처 | 이미지 이용 상태 |
|---|---|---|---|---|
| 침실 | 빈센트 반 고흐 | 1889 | [미술관](https://www.artic.edu/artworks/28560) · [이미지](https://commons.wikimedia.org/wiki/File:1926.417_-_The_Bedroom_Vincent_van_Gogh_1889.jpg) | Public domain |
| 사과 바구니 | 폴 세잔 | 1893년경 | [미술관](https://www.artic.edu/artworks/111436) · [이미지](https://commons.wikimedia.org/wiki/File:Paul_C%C3%A9zanne_-_The_Basket_of_Apples_-_1926.252_-_Art_Institute_of_Chicago.jpg) | Public domain |
| 두 자매 — 테라스에서 | 피에르 오귀스트 르누아르 | 1881 | [미술관](https://www.artic.edu/artworks/14655) · [이미지](https://commons.wikimedia.org/wiki/File:Pierre-Auguste_Renoir_-_Two_Sisters_(On_the_Terrace)_-_1933.455_-_Art_Institute_of_Chicago.jpg) | Public domain |
| 가나가와 해변의 높은 파도 | 가쓰시카 호쿠사이 | 1830–1833 | [미술관](https://www.artic.edu/artworks/77333) · [이미지](https://commons.wikimedia.org/wiki/File:1952.343_-_Under_the_Wave_off_Kanagawa_(Kanagawa_oki_nami.jpg) | CC0 |
| 수련 | 클로드 모네 | 1906 | [미술관](https://www.artic.edu/artworks/16568) · [이미지](https://commons.wikimedia.org/wiki/File:Claude_Monet_-_Water_Lilies_-_1933.1157_-_Art_Institute_of_Chicago.jpg) | Public domain |
| 수련 연못 | 클로드 모네 | 1900 | [미술관](https://www.artic.edu/artworks/87088) · [이미지](https://commons.wikimedia.org/wiki/File:Claude_Monet_-_Water_Lily_Pond_-_1933.441_-_Art_Institute_of_Chicago.jpg) | Public domain |
| 파리의 거리, 비 오는 날 | 귀스타브 카유보트 | 1877 | [미술관](https://www.artic.edu/artworks/20684) · [이미지](https://commons.wikimedia.org/wiki/File:Gustave_Caillebotte_-_Paris_Street,_Rainy_Day_-_1964.336_-_Art_Institute_of_Chicago.jpg) | Public domain |
| 아이의 목욕 | 메리 커샛 | 1893 | [미술관](https://www.artic.edu/artworks/111442) · [이미지](https://commons.wikimedia.org/wiki/File:The_Child%27s_Bath_by_Mary_Cassatt_1893.jpg) | Public domain |
| 밀짚 더미 — 여름의 끝 | 클로드 모네 | 1890–1891 | [미술관](https://www.artic.edu/artworks/64818) · [이미지](https://commons.wikimedia.org/wiki/File:Claude_Monet_-_Stacks_of_Wheat_(End_of_Summer)_-_1985.1103_-_Art_Institute_of_Chicago.jpg) | Public domain |
| 푸르빌 절벽 산책 | 클로드 모네 | 1882 | [미술관](https://www.artic.edu/artworks/14620) · [이미지](https://commons.wikimedia.org/wiki/File:Claude_Monet_-_Cliff_Walk_at_Pourville_-_Google_Art_Project.jpg) | Public domain |
| 그랑드 자트 섬의 일요일 오후 | 조르주 쇠라 | 1884–1886 · 테두리 1888–1889 | [미술관](https://www.artic.edu/artworks/27992) · [이미지](https://commons.wikimedia.org/wiki/File:Georges_Seurat_-_A_Sunday_on_La_Grande_Jatte_--_1884_-_Google_Art_Project.jpg) | Public domain |
| 포도, 레몬, 배와 사과 | 빈센트 반 고흐 | 1887 | [미술관](https://www.artic.edu/artworks/64957) · [이미지](https://commons.wikimedia.org/wiki/File:Vincent_van_Gogh_-_Grapes,_Lemons,_Pears,_and_Apples_-_1949.215_-_Art_Institute_of_Chicago.jpg) | Public domain |

미술관 API의 is_public_domain=true와 실제 배포한 Commons 파일의 Public Domain 또는 CC0 표기를 각각 확인했다. 큰 파도는 시카고 미술관 77333번 소장 인쇄본이다. 미술관 이미지 서버의 자동 요청 차단으로 Commons의 동일 작품 디지털 복제본을 사용했다. 다른 미술관 소장의 비슷한 수련 이미지 및 잘린 그랑드 자트 부분 이미지는 제외했다. AI 생성/재해석 이미지는 사용하지 않았다. 개별 다운로드 URL, Commons page ID, 라이선스, 소장처 근거는 assets/art-puzzle/sources.json에 보존한다. 설명 문장은 어린이를 위해 새로 작성했다. originalTitle은 미술관의 공식 영문 작품명이다.

[미술관 공개 이미지 지침](https://api.artic.edu/docs/#copyright)

## 모듈과 유지보수

- data.js: 작품/화가/국가/연도/설명/관찰 포인트/출처. 이미지와 metadata ID를 함께 검증해서 추가한다.
- engine.js: 6/9/16/20조각, 세로 작품 행·열 전환, 셔플, 올바른 칸 배치, SNAP 좌표, 시간/힌트/평가.
- render.js: 갤러리 액자, 원본 비율을 유지한 Canvas 조각 분할. 원본을 자르거나 AI 이미지로 바꾸지 않는다.
- input.js: Pointer Events 드래그 및 조각 → 위치 선택. 보조 포인터는 현재 드래그를 취소하지 않는다. 캡처 취소/초점 이탈/게임 종료 시 임시 조각 제거. 버튼은 키보드 선택도 지원한다.
- lifecycle.js: 화면마다 Scope 하나. AbortController, timeout Set, RAF 1개를 관리한다. 화면 교체·종료 시 모두 정리하고, 완성 시 RAF를 중단한다.
- board.js: 3단계 힌트, 조각 확대/그림자, 원본 페이드와 액자·별 연출. 마지막 조각 즉시 저장하고 설명은 연출 뒤 표시한다.
- storage.js: 기존 sianhi-v2.records.artPuzzle 안에만 기록 추가. 기존 state의 별 증가분 외 다른 데이터를 수정하지 않는다.
- game.js: 갤러리 → 상세/난이도 → 플레이 → 도감. 처음 3점 개방, 작품 하나 완료 시 2점 추가 개방. 잠긴 작품도 먼저 열기 버튼으로 선택할 수 있다.
- css/games/art-puzzle.css: art-dialog/art-app 범위로 한정. 원래 홈/공통 CSS 변경 없음.

## 보상과 저장

작품·난이도마다 최고 별 1~3개를 저장하고, 이전 최고 별 대비 증가분만 전체 별에 합산한다. 같은 기록 반복은 0개이며, 12작품×4난이도의 최대 합은 144개다. 난이도별 최고 시간/최소 힌트/플레이 수를 저장한다. 자동 배치 힌트는 조각 수의 1/4(내림, 최소 1회)로 제한하며 전체를 자동 완성하지 않는다. 미리보기와 위치 표시는 횟수에 따라 별 평가에 반영한다. 기존 한글 달리기/인형뽑기/레벨/학습 진도는 유지한다.

## 실행한 자동 테스트

- node tests/art-engine.test.cjs: 12점의 출처 데이터, 4난이도와 가로/세로 방향, 오배치 거부, 완료, 자동 힌트 한도, SNAP 경계.
- node tests/art-storage.test.cjs: 신규/반복 보상 상한, JSON 재로드, 선택 해금, 기존 runner/claw/학습/레벨/collection 기록 보존.
- node tests/art-lifecycle.test.cjs: 3회 생성/종료, 실제 입력 핸들러의 드래그와 SNAP, 다른 pointerId의 취소 격리, ghost 제거, RAF/timer/listener 0개. 테스트 더블 기반이며 운영 브라우저 내부 계측과 구분한다.
- npm test: 기존 구문/800개 학습 단계/명령 예산/로컬 에셋 검증 통과.
- 기준 main 대비 games.js의 playShape 바깥을 비교해 동일함을 확인했다. 한글 달리기, 인형뽑기, core.js, app.js, learning.js의 diff는 없다.
- 로컬 파일과 Git blob을 대조했다. 큰 르누아르 이미지의 전송 누락을 발견해 완전한 파일로 수정하고 SHA 일치를 확인했다.

## 브라우저 검증

로컬 PC: 드래그 SNAP, 잘못된 칸 안내, 선택 → 위치 입력, 6조각 완성/원본/설명/별 3개, 새로고침 후 도감 1/12 유지.

로컬 반응형 iframe: 320/390/430px 및 세로형 작품 배치를 확인했다. 320px의 침실 20조각 칸은 약 55×55px, 390px은 약 69×68px였다. 390px에서 20조각을 마우스 드래그와 선택 배치, 세 단계 힌트를 섞어 완성했다. 조각 보관함은 가로 스크롤 및 이전/다음 버튼으로 조작한다. 실제 터치 디바이스나 모바일 에뮬레이터 테스트는 아니다.

운영 검증 결과와 제한은 아래에 후속 기록한다.

### 운영본 검증 — 2026-09-18

- https://sianhi.vercel.app/ 직접 접속 → 게임 월드 → 그림 퍼즐 → 명화 갤러리. 로그인 화면 없이 진입했다. 별도 쿠키 없는 HTTP 요청도 200이었다.
- 침실 6조각: 마우스 드래그 SNAP 및 선택→위치 입력, 원본/액자/설명/별 3개. 사과 바구니로 이동하여 미리보기 힌트 실행 중 닫기.
- 두 번째 진입: 사과 바구니 6조각 완성, 69초/힌트 0/별 +3.
- 세 번째 진입: 침실 6조각 재완성, 최고 기록 유지 안내, 별 추가 없음. 닫고 새로고침 후 도감 2/12 및 두 작품 별 3개 유지. 전체 별은 7→13이며 반복 완료 후 13 유지.
- 3회 열기/플레이/닫기에서 관찰 가능한 중복 입력/애니메이션은 없었다. 운영 내부 listener/RAF 개수 직접 계측은 하지 않았으며, 해당 정리는 별도 lifecycle 자동 테스트로 검증했다.
- 기존 인형뽑기의 놀이 코인 7, 도감 1/12, 최고 연속 1이 유지됨을 UI에서 확인했다. 다른 모든 사용자 저장값을 운영 브라우저에서 원시 JSON으로 대조한 것은 아니다.
- 브라우저 로그 조회에는 도구 확장 프로그램의 metadata 전송 오류가 있었다. 이를 사이트 게임 오류로 분류하지 않았으며, 전체 콘솔 오류가 0이라고 주장하지 않는다.

### 미검증 사항

- 실제 iPhone/Android/Safari 및 실제 터치·모바일 에뮬레이터 입력. 320/390/430px는 로컬 iframe 폭과 마우스 Pointer Events 테스트다.
- 운영본 390px 실제 터치 드래그/터치 선택/SNAP 전체 흐름.
- 별도 시크릿 컨텍스트 생성 및 Vercel 관리 화면의 Deployment Protection 설정 직접 조회. 공개 HTTP와 일반 브라우저 접근은 확인했다.
- 운영 환경 모든 기존 저장 필드의 원시 값 전체 비교. 기존 데이터 보존은 자동 회귀 테스트 및 제한된 운영 UI 대조로 검증했다.

이 미검증 항목 때문에 사용자 정의의 최종 완료 판정은 보류한다.
