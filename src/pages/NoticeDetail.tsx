import { formatDate, type Notice } from "../content";
import { Layout } from "../Layout";

export function NoticeDetail({ notice }: { notice: Notice }) {
  return (
    <Layout>
      <article className="notice">
        <h1>{notice.title}</h1>
        <p className="meta">
          <time dateTime={notice.date}>{formatDate(notice.date)}</time>
        </p>
        <div className="prose" dangerouslySetInnerHTML={{ __html: notice.html }} />
      </article>
      <p className="back">
        <a href="/notices/">공지 목록 보기</a>
      </p>
    </Layout>
  );
}
