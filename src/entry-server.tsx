import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { legal } from "./content";
import { Home } from "./pages/Home";
import { Legal } from "./pages/Legal";
import { Moved } from "./pages/Moved";
import { Notices } from "./pages/Notices";
import { NotFound } from "./pages/NotFound";

export type RenderedPage = {
  /** dist 안의 출력 경로. "" = 루트 */
  file: string;
  title: string;
  description?: string;
  noindex?: boolean;
  /** 이 페이지에 실을 클라이언트 번들(vite manifest 키). 없으면 JS 없음. */
  script?: string;
  /** 지정하면 meta refresh로 이 주소에 보낸다. */
  redirect?: string;
  body: string;
};

const SITE = "히어지";
const DESCRIPTION = "앱을 열면 위치만으로 지금 내 주변에 뭐가 있는지 보여줍니다.";

function page(file: string, title: string, el: ReactElement, extra: Partial<RenderedPage> = {}): RenderedPage {
  return { file, title, body: renderToStaticMarkup(el), ...extra };
}

// #1에서 md 파일로 만들었던 공지 상세 주소. 공지가 DB로 옮겨 가서 목록으로 보낸다.
const MOVED_NOTICES = ["2026-11-25-test-start"];

export async function renderAll(): Promise<RenderedPage[]> {
  return [
    page("index.html", "히어지 Herezi", <Home />, { description: DESCRIPTION }),
    page("privacy/index.html", `개인정보 처리방침 · ${SITE}`, <Legal html={legal.privacy} />, { noindex: true }),
    page("terms/index.html", `이용약관 · ${SITE}`, <Legal html={legal.terms} />, { noindex: true }),
    page("notices/index.html", `공지사항 · ${SITE}`, <Notices />, { script: "src/notices-client.tsx" }),
    ...MOVED_NOTICES.map((slug) =>
      page(`notices/${slug}/index.html`, `공지사항 · ${SITE}`, <Moved to="/notices/" />, {
        noindex: true,
        redirect: "/notices/",
      }),
    ),
    page("404.html", `페이지를 찾을 수 없어요 · ${SITE}`, <NotFound />, { noindex: true }),
  ];
}
