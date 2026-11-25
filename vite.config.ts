import { defineConfig } from "vite";

// 정적 사이트: 각 페이지 HTML은 scripts/prerender.mjs가 SSR 번들로 미리 만들어 dist/에 쓴다.
// 클라이언트 빌드 입력: client.ts(공통 CSS만 뽑음), notices-client.tsx(/notices/ 전용 JS).
// GitHub Pages 사용자/조직 사이트라 base는 루트("/").
export default defineConfig({
  base: "/",
  publicDir: "public",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    manifest: true,
    rollupOptions: { input: ["src/client.ts", "src/notices-client.tsx"] },
  },
});
