import { Layout } from "../Layout";

// 옮겨진 주소용 안내 페이지. <head>의 meta refresh가 바로 이동시키고, 안 되면 링크를 누르게 한다.
export function Moved({ to }: { to: string }) {
  return (
    <Layout>
      <h1>공지사항 주소가 바뀌었어요</h1>
      <p className="meta">잠시 후 공지사항으로 이동해요.</p>
      <p className="back">
        <a href={to}>공지사항으로 가기</a>
      </p>
    </Layout>
  );
}
