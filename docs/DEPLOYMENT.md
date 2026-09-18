# Deployment / 인수인계

## 저장소와 배포

- Repository: `tleodh1/sianhi`
- Production branch: `main`
- Production: Vercel 연결 배포

`main` 변경은 운영 배포로 이어질 수 있으므로 큰 리팩터링은 별도 branch → 확인 → main 병합을 권장합니다.

## 인수인계 체크리스트

새 개발자는 다음 순서로 확인합니다.

1. README
2. docs/ARCHITECTURE.md
3. docs/SECURITY.md
4. index.html
5. js/app.js의 현재 레거시 동작
6. css/style.css의 현재 레거시 스타일
7. Vercel 배포 상태

## 배포 전 smoke test

- 홈 로드
- 학습 과목 진입
- 오늘의 미션
- 기록 표시
- 게임월드 진입
- 벽돌깨기
- 한글 달리기
- 영어 카드
- 퍼즐
- 인형뽑기
- 테트리스
- 게임 닫고 재진입
- 키보드 listener 중복 여부
- 모바일 폭에서 UI 잘림 여부
- localStorage 진도 저장/재로드

## 롤백

배포 후 치명적 오류가 있으면 직전 정상 커밋으로 되돌립니다. 대규모 변경은 여러 기능을 한 커밋에 섞지 말고 기능 단위로 커밋합니다.
