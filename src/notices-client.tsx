// /notices/ 페이지에만 싣는 클라이언트 번들. 빌드 때 만든 껍데기(#notices-root 안의 로딩 자리)를
// 실제 공지 화면으로 바꾼다. 다른 페이지(/, /privacy/, /terms/)에는 JS가 없다.
import { createRoot } from "react-dom/client";

import { NoticesApp } from "./notices/NoticesApp";

const el = document.getElementById("notices-root");
if (el) createRoot(el).render(<NoticesApp />);
