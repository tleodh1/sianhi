# 시안Hi 앱 출시 인수인계

현재 웹 운영본과 같은 GitHub `main`을 기준으로 iOS/Android 네이티브 앱을 만든다.

## 현재 준비된 것

- Capacitor 8.5.2 설정
- 앱 ID: `com.sianhi.app`
- 앱 이름: `시안Hi`
- 네이티브 번들용 `www/` 생성 스크립트
- PWA manifest / Service Worker
- 홈 화면 설치용 앱 아이콘 SVG
- iPhone safe-area 대응
- 웹 운영 URL은 기존 `https://sianhi.vercel.app/` 유지

## Mac에서 최초 1회

```bash
git pull origin main
npm install
npm run mobile:build
npm run cap:add:ios
npm run cap:add:android
```

그 다음부터 웹 코드가 바뀌면:

```bash
git pull origin main
npm install
npm run cap:sync
```

iOS 열기:

```bash
npm run cap:open:ios
```

Android 열기:

```bash
npm run cap:open:android
```

## iOS 작업

1. Xcode에서 `ios/App/App.xcworkspace`를 연다.
2. Signing & Capabilities에서 사용자의 Apple Developer Team을 선택한다.
3. Bundle Identifier가 `com.sianhi.app`인지 확인한다.
4. 실제 iPhone에서 빌드해 한글 달리기, 시안팡, 학습 터치쓰기, 소리, 저장기록을 확인한다.
5. 앱 아이콘과 Launch Screen을 최종 PNG 자산으로 교체한다.
6. Product > Archive.
7. Distribute App > App Store Connect > Upload.
8. TestFlight에서 실제 기기로 검증한다.
9. 문제 없으면 App Store Connect에서 심사 제출한다.

## 반드시 실제 기기에서 확인할 항목

- iPhone 390px 계열에서 UI 잘림 없음
- Dynamic Island / 홈 인디케이터 영역 침범 없음
- Canvas 터치 필기 정상
- 한글 달리기 좌우/점프 입력 정상
- 시안팡 Swipe 정상
- BGM / 효과음 첫 터치 후 정상 재생
- 앱 백그라운드 전환 후 게임이 비정상적으로 자동 진행하지 않음
- 진행도/별/스테이지 기록 유지
- 오프라인에서 이미 로드된 핵심 화면 재진입 가능
- 외부 브라우저 주소창 없이 앱 내부에서 동작

## 스토어 제출 전에 사용자에게 확인받아야 하는 것

- Apple Developer 계정
- 최종 앱 아이콘
- App Store 표시 이름
- 부제/설명/검색 키워드
- 지원 이메일 또는 지원 페이지
- 개인정보처리방침 URL
- 연령 등급
- 앱이 어린이용 카테고리로 제출될지 여부
- 스크린샷 최종본

## 주의

- 웹사이트 자체를 원격 WebView로만 여는 앱으로 바꾸지 않는다.
- `npm run mobile:build`로 현재 HTML/CSS/JS/assets를 앱 내부 `www/`에 묶는다.
- 기존 웹 배포와 네이티브 앱을 병행한다.
- `ios/`, `android/`는 생성 후 GitHub에 커밋한다.
- `www/`는 생성물이라 커밋하지 않는다.
