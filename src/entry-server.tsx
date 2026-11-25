import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { legal, loadNotices } from "./content";
import { Home } from "./pages/Home";
import { Legal } from "./pages/Legal";
import { NoticeDetail } from "./pages/NoticeDetail";
import { Notices } from "./pages/Notices";
import { NotFound } from "./pages/NotFound";

export type RenderedPage = {
  /** dist 안의 출력 경로. "" = 루트 */
  file: string;
  title: string;
  description?: string;
  noindex?: boolean;
  body: string;
};

const SITE = "히어지";
const DESCRIPTION = "앱을 열면 위치만으로 지금 내 주변에 뭐가 있는지 보여줍니다.";

function page(file: string, title: string, el: ReactElement, extra: Partial<RenderedPage> = {}): RenderedPage {
  return { file, title, body: renderToStaticMarkup(el), ...extra };
}

export async function renderAll(): Promise<RenderedPage[]> {
  const notices = await loadNotices();
  return [
    page("index.html", "히어지 Herezi", <Home />, { description: DESCRIPTION }),
    page("privacy/index.html", `개인정보 처리방침 · ${SITE}`, <Legal html={legal.privacy} />, { noindex: true }),
    page("terms/index.html", `이용약관 · ${SITE}`, <Legal html={legal.terms} />, { noindex: true }),
    page("notices/index.html", `공지사항 · ${SITE}`, <Notices notices={notices} />),
    ...notices.map((n) =>
      page(`notices/${n.slug}/index.html`, `${n.title} · ${SITE}`, <NoticeDetail notice={n} />),
    ),
    page("404.html", `페이지를 찾을 수 없어요 · ${SITE}`, <NotFound />, { noindex: true }),
  ];
}
