import { Layout } from "../Layout";

export function NotFound() {
  return (
    <Layout>
      <h1>페이지를 찾을 수 없어요</h1>
      <p className="meta">주소가 바뀌었거나 없는 페이지예요.</p>
      <p className="back"><a href="/">홈으로 가기</a></p>
    </Layout>
  );
}
