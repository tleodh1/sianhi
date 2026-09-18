# 인형뽑기 개발 및 검증 기록

기준: main cbb892608a8c17d9c19071679be86a83aab44dad. 작업 범위는 인형뽑기뿐이다.

## 모듈
- catalog.js: 오리지널 인형 12종, 희귀도 4단계, 크기/무게/배치. 신규 인형은 atlas의 source rectangle과 함께 추가한다.
- engine.js: DOM이나 random에 의존하지 않는 집게 상태 머신. aim → descend → close → lift → transport → release → reveal → result. 집게 중심 거리, 감싸는 정도, 크기 적합성, 무게, 힘, 흔들림을 계산한다.
- renderer.js: 800×533 논리 좌표 Canvas, x/z 원근 투영, 3발 집게, 그림자/유리/캡슐/파티클. DPR은 2로 제한한다.
- controls.js: 키보드, Pointer Events, 포인터별 이동 상태, cancel/lostcapture/blur/visibility 정리. 짧은 클릭은 작은 이동도 지원한다.
- storage.js: 기존 sianhi-v2 아래 records.clawMachine에만 도감/코인/시도/최고 연속 기록을 추가한다. 기존 records.claw, 다른 게임 기록과 진도는 삭제하지 않는다.
- game.js: Session 수명주기에 연결. RAF 1개, AbortController 이벤트 해제, 오디오 종료, 비동기 이미지 로딩 이후 종료 여부 확인. interval/timer는 사용하지 않는다.
- css/games/claw.css: claw-dialog 내부에만 적용. 기존 홈/다른 게임 스타일은 변경하지 않는다.

## 저장과 보상
무료 놀이 코인 10개. 소진 후 DROP으로 무료 재충전한다. 인형 최초 획득은 희귀도에 따라 별 1~4개, 중복은 별 1개를 추가한다. 사용자의 기존 별에서 비용을 차감하지 않는다. 각 시도와 결과에서 기존 save()를 호출한다. 저장 실패 안내는 기존 공통 저장 처리에 따른다.

## 그래픽 에셋
AI 이미지 생성으로 제작한 오리지널 3D 렌더 스타일 plush-atlas.webp(12종)와 cabinet.webp(빈 기계). 원본을 WebP로 인코딩했고 렌더러에서 개별 인형 영역을 잘라 사용한다. 토끼, 곰, 여우, 펭귄, 젤리, 꽃 고슴도치, 공룡, 양, 별빛 고양이, 잎새 용, 달빛 사슴, 햇살 불사조. 특정 상용 캐릭터나 음악은 사용하지 않는다. 집게는 관절을 가진 Canvas 도형, 효과음은 Web Audio 합성이다.

## 실행한 검증
- node tests/claw-engine.test.cjs: 8개 통과. 12종 중심 조준 성공, 빈 바닥 실패, 거리별 잡는 힘, 상승 후 미끄러짐, 중복 DROP 방지, 전체 상태 순서, 앞뒤 이동과 무료 충전.
- node tests/claw-storage.test.cjs: 신규/중복 보상, JSON 재로드, 기존 레벨/학습/collection/runner/legacy claw 기록 보존.
- node tests/claw-controls.test.cjs: 3회 생성/종료 후 리스너 0개, 두 pointerId 독립 유지, pointercancel, blur, visibility 해제. EventTarget 테스트 더블로 검증했으며 실제 두 손가락 입력과 구분한다.
- npm test: 기존 구문/800개 학습 단계/코딩 명령 예산/로컬 에셋 통과.
- games.js는 playClaw 함수 밖의 내용이 기준 커밋과 동일함을 비교했다. 한글 달리기 파일/에셋은 수정하지 않았다.
- 로컬 PC 브라우저: 성공, 실패, 닫기/재실행 3회, 획득 후 새로고침 도감 유지.
- 로컬 320/390/430px iframe 뷰포트: 화면과 버튼 잘림 검사, 이동 및 DROP 클릭. 실제 모바일 장치/터치 에뮬레이션과 구분한다.
- 운영 https://sianhi.vercel.app/ 직접 접속 → 게임 월드 → 인형뽑기. 키보드 ArrowRight/A 입력, 마우스 조준, 달빛 사슴 획득(NEW, 별 +4), 빈 위치 실패를 확인했다.
- 쿠키/인증 헤더 없는 curl 요청: 운영 홈 HTTP 200, 최종 URL 동일, 새 claw script 6개 포함. 일반 브라우저에서도 로그인 화면 없이 실행됐다.

## 남은 검증
실제 iPhone/Android, Safari, 실기기 다중 터치, 운영본 모바일 터치 에뮬레이션, 전용 시크릿 컨텍스트는 현재 검증 환경에서 제공되지 않는다. 이 항목들은 미검증이다. Vercel 연결의 list_teams는 빈 목록, get_project는 커넥터 입력 스키마 오류를 반환해 Deployment Protection 설정 자체는 읽지 못했다. 공개 URL의 비인증 HTTP 응답만 별도로 확인했다. 오디오 청취/휴대폰 장시간 FPS, RAF/오디오 실행 개수의 운영 런타임 계측은 수행하지 않았다. 따라서 모든 최종 완료 조건이 검증됐다고 주장하지 않는다.

운영 추가 확인: 3회 열기 → 실제 DROP → 결과 → 닫기를 완료했다(신규 달빛 사슴 성공 / 빈 위치 실패 / 달빛 사슴 중복 성공). 중복 보상은 별 +1이며, 새로고침 후 도감에 '2번 만났어요', 놀이 코인 7이 유지됐다. 이 반복에서 눈에 띄는 중복 애니메이션/코인 중복 차감은 없었다. 내부 RAF 개수 계측 결과로 대체해서 보고하지 않는다.

단계 커밋: 엔진 a10ae7b, 그래픽 d22416f, 저장 893ad87, 통합 fd2fbdc. 최종 검증/문서/인형뽑기 파일 포맷 커밋은 이 문서를 포함하는 커밋이다.
