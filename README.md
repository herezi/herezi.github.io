# herezi.github.io

히어지(Herezi) 웹사이트 — https://herezi.github.io/

- `/` 소개
- `/notices/` 공지사항 (앱 MY 탭에서 열림)
- `/privacy/` 개인정보 처리방침
- `/terms/` 이용약관

React + TypeScript + Vite. 모든 페이지를 빌드 때 정적 HTML로 미리 만들어(`/notices/`만 클라이언트 JS로 공지를 불러옴) GitHub Pages(Actions)로 배포한다.

## 개발
```bash
npm ci
npm run lint
npm run build          # dist/
python3 -m http.server -d dist 4317
```

## 공지 추가
배포 없이 Supabase Table Editor의 `notices` 테이블에서 쓴다(`title`, `body` 마크다운, `published_at` — 미래면 예약, `is_hidden`). 약 1분 안에 `/notices/`에 반영된다. `/notices/`는 브라우저에서 API(`GET /v1/notices`)로 공지를 받아 그린다. 자세한 내용은 [AGENTS.md](AGENTS.md).
