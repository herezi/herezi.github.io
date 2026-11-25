# herezi.github.io

히어지(Herezi) 웹사이트 — https://herezi.github.io/

- `/` 소개
- `/notices/` 공지사항 (앱 MY 탭에서 열림)
- `/privacy/` 개인정보 처리방침
- `/terms/` 이용약관

React + TypeScript + Vite. 모든 페이지를 빌드 때 정적 HTML로 미리 만들어 GitHub Pages(Actions)로 배포한다.

## 개발
```bash
npm ci
npm run lint
npm run build          # dist/
python3 -m http.server -d dist 4317
```

## 공지 추가
`content/notices/YYYY-MM-DD-slug.md` 파일 하나를 만들고(frontmatter `title`, `date`) PR을 연다. 자세한 규칙은 [AGENTS.md](AGENTS.md).
