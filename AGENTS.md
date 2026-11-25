# AGENTS.md — herezi.github.io

히어지(Herezi) 웹사이트. https://herezi.github.io/ 에 배포된다.
React + TypeScript를 Vite로 빌드하고, 모든 페이지를 빌드 때 HTML 파일로 미리 만든다(클라이언트 JS 없음).

## 주소 (바꾸지 말 것)
| 주소 | 파일 | 비고 |
| --- | --- | --- |
| `/` | `src/pages/Home.tsx` | |
| `/privacy/` | `content/legal/privacy.html` | 앱스토어·카카오 등에 등록된 주소 |
| `/terms/` | `content/legal/terms.html` | 앱스토어·카카오 등에 등록된 주소 |
| `/notices/` | `src/pages/Notices.tsx` | 앱 MY 탭 "공지사항"이 여는 주소 |
| `/notices/<slug>/` | `content/notices/<slug>.md` | 공지 상세 |

각 주소는 `dist/<경로>/index.html` 실제 파일로 나간다. SPA 리다이렉트(404.html 꼼수)나 HashRouter는 쓰지 않는다.

## 공지 추가하는 법
1. `content/notices/YYYY-MM-DD-영문-슬러그.md` 파일 하나를 만든다. 파일 이름이 곧 주소다(영문 소문자·숫자·하이픈만).
2. 맨 위에 frontmatter를 쓴다.
   ```md
   ---
   title: 히어지 테스트를 시작했어요
   date: 2026-11-25
   ---

   본문은 마크다운으로 써요.
   ```
3. 말투: 해요체, 쉬운 말, 과장 없이(토스 공지 톤).
4. `npm run build`로 확인하고 PR을 연다. main에 머지되면 자동 배포된다.

목록은 `date` 최신순으로 정렬된다. 다른 파일은 건드릴 필요 없다.

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
- `src/entry-server.tsx` — 모든 페이지를 HTML 문자열로 렌더링(`renderAll`)
- `src/content.ts` — 공지 md 읽기(gray-matter + remark), 법률 HTML 불러오기
- `scripts/prerender.mjs` — SSR 번들을 실행해 `dist/**/index.html`을 쓴다
- `src/styles.css` — 전체 스타일(빌드 시 해시된 CSS 파일로 나감)
- `public/` — 그대로 복사(`assets/logo.svg`, `.nojekyll`)

## 배포
`.github/workflows/deploy.yml`: main 푸시 → `npm ci` → lint → build → `actions/upload-pages-artifact`(`./dist`) → `actions/deploy-pages`. PR에서는 lint·build만 돈다. 저장소 Pages 소스는 "GitHub Actions"(build_type=workflow)여야 한다.
