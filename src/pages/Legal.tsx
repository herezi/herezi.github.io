import { Layout } from "../Layout";

// 기존 HTML 본문을 그대로 넣는다(문구 수정 금지).
export function Legal({ html }: { html: string }) {
  return (
    <Layout>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </Layout>
  );
}
