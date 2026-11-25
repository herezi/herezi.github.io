// 빌드 마지막 단계: SSR 번들로 모든 페이지를 HTML 파일로 미리 만든다.
// 결과: dist/index.html, dist/privacy/index.html, dist/notices/<slug>/index.html ...
// GitHub Pages가 각 주소를 실제 파일로 200 응답하도록 하기 위함(SPA 리다이렉트 없음).
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const ssrDir = join(root, "dist-ssr");

const PRETENDARD =
  "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css";

const manifest = JSON.parse(await readFile(join(dist, ".vite", "manifest.json"), "utf8"));
const entry = manifest["src/client.ts"];
if (!entry?.css?.length) throw new Error("manifest에서 CSS를 찾지 못했어요.");
const cssLinks = entry.css.map((href) => `<link rel="stylesheet" href="/${href}">`).join("\n");

const escape = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const { renderAll } = await import(pathToFileURL(join(ssrDir, "entry-server.js")).href);
const pages = await renderAll();

for (const p of pages) {
  const html = `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${escape(p.title)}</title>
${p.description ? `<meta name="description" content="${escape(p.description)}">\n` : ""}${p.noindex ? '<meta name="robots" content="noindex">\n' : ""}<meta name="theme-color" content="#ffffff">
<link rel="icon" href="/assets/logo.svg" type="image/svg+xml">
<link rel="stylesheet" crossorigin href="${PRETENDARD}">
${cssLinks}
</head>
<body>
${p.body}
</body>
</html>
`;
  const out = join(dist, p.file);
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, html);
  console.log(`prerender: /${p.file}`);
}

// 페이지에 JS를 싣지 않으므로 클라이언트 JS·manifest·SSR 번들은 지운다.
await Promise.all([
  ...(entry.file ? [rm(join(dist, entry.file), { force: true })] : []),
  rm(join(dist, ".vite"), { recursive: true, force: true }),
  rm(ssrDir, { recursive: true, force: true }),
]);
