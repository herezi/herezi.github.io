# AGENTS.md — herezi.github.io

히어지(Herezi) 웹사이트. https://herezi.github.io/ 에 배포된다.
React + TypeScript를 Vite로 빌드하고, 모든 페이지를 빌드 때 HTML 파일로 미리 만든다.
클라이언트 JS는 `/notices/`에만 싣는다(공지를 API에서 받아 그림). 나머지 페이지는 JS 없음.

## 주소 (바꾸지 말 것)
| 주소 | 파일 | 비고 |
| --- | --- | --- |
| `/` | `src/pages/Home.tsx` | |
| `/privacy/` | `content/legal/privacy.html` | 앱스토어·카카오 등에 등록된 주소 |
| `/terms/` | `content/legal/terms.html` | 앱스토어·카카오 등에 등록된 주소 |
| `/notices/` | `src/pages/Notices.tsx`(껍데기) + `src/notices/` | 앱 MY 탭 "공지사항"이 여는 주소. 목록 |
| `/notices/?id=<id>` | 위와 같은 파일 | 공지 상세(정적 호스팅이라 쿼리로 구분) |
| `/notices/2026-11-25-test-start/` | `src/pages/Moved.tsx` | 옛 공지 주소. `/notices/`로 보냄(meta refresh) |

각 주소는 `dist/<경로>/index.html` 실제 파일로 나간다. SPA 리다이렉트(404.html 꼼수)나 HashRouter는 쓰지 않는다.

## 공지 추가하는 법 (배포 필요 없음)
공지는 Supabase DB의 `notices` 테이블에 있다. 이 저장소를 고치거나 배포할 필요가 없다.
1. Supabase 대시보드 → Table Editor → `notices` 테이블에서 행을 추가한다.
   - `title`: 제목
   - `body`: 본문(마크다운). 줄바꿈 한 번은 줄바꿈, 빈 줄은 문단.
   - `published_at`: 게시 시각. 미래 시각이면 그때부터 보인다(예약 게시).
   - `is_hidden`: `true`면 숨긴다(내릴 때 지우지 말고 이걸 켠다).
2. 저장하면 약 1분 안에 https://herezi.github.io/notices/ 에 반영된다(API 캐시).
3. 말투: 해요체, 쉬운 말, 과장 없이(토스 공지 톤).

목록은 `published_at` 최신순이다. 날짜는 KST 기준 `YYYY.MM.DD`로 보인다.

### 공지 화면 동작
- API: `https://api-production-4ebcf3e2.up.railway.app` (herezi-api)
  - `GET /v1/notices` → `{"notices":[{"id","title","published_at"}]}`
  - `GET /v1/notices/{id}` → `{"id","title","body","published_at"}`, 없으면 404
- 빌드 때는 껍데기(헤더·푸터·로딩 자리)만 만들고, `src/notices-client.tsx`가 브라우저에서 채운다.
- 상태: 로딩(스켈레톤) · 빈 목록("아직 공지가 없어요") · 오류("다시 시도") · 없는 공지.
- 목록↔상세 이동은 `history.pushState`라 뒤로 가기가 된다.
- 본문 마크다운은 `marked`로 HTML로 바꾸고 `DOMPurify`로 sanitize한다. sanitize를 빼지 않는다.
- 로컬에서 목 API로 확인: `VITE_API_BASE=http://localhost:8787 npm run build`

## 법률 문서
`content/legal/*.html`은 개인정보 처리방침·이용약관 본문이다. 문구를 고칠 때는 법률 검토를 거친 내용만, 별도 PR로 바꾼다. 디자인 작업 중에 문구를 바꾸지 않는다.

## 작업 규칙
- 이슈 → 브랜치(`feat/<이슈번호>-...`) → PR. main에 직접 푸시하지 않는다.
- 의존성 버전은 정확히 고정한다(`^`, `latest` 금지). npm + `package-lock.json`.
- 디자인: 잉크 `#191F28`, 흰 배경, Pretendard, 모바일 우선(앱 안 브라우저로 열림), 본문 폭 640px.
- 추적·분석 스크립트를 넣지 않는다.

## 명령
```bash
npm ci
npm run lint
npm run build      # dist/ 생성
npx serve dist     # 또는 python3 -m http.server -d dist
```

## 구조
- `src/entry-server.tsx` — 모든 페이지를 HTML 문자열로 렌더링(`renderAll`). `script`가 있는 페이지만 JS를 싣는다
- `src/content.ts` — 법률 HTML 불러오기
- `src/notices/` — 공지 API 클라이언트(`api.ts`), 화면(`NoticesApp.tsx`), 로딩 자리(`Skeleton.tsx`)
- `src/notices-client.tsx` — `/notices/` 전용 클라이언트 진입점
- `scripts/prerender.mjs` — SSR 번들을 실행해 `dist/**/index.html`을 쓴다(페이지별 script 태그·meta refresh 포함)
- `src/styles.css` — 전체 스타일(빌드 시 해시된 CSS 파일로 나감)
- `public/` — 그대로 복사(`assets/logo.svg`, `.nojekyll`)

## 배포
`.github/workflows/deploy.yml`: main 푸시 → `npm ci` → lint → build → `actions/upload-pages-artifact`(`./dist`) → `actions/deploy-pages`. PR에서는 lint·build만 돈다. 저장소 Pages 소스는 "GitHub Actions"(build_type=workflow)여야 한다.
