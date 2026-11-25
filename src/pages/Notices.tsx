import { formatDate, type Notice } from "../content";
import { Layout } from "../Layout";

export function Notices({ notices }: { notices: Notice[] }) {
  return (
    <Layout>
      <h1>공지사항</h1>
      {notices.length === 0 ? (
        <p className="empty">아직 공지가 없어요.</p>
      ) : (
        <ul className="notice-list">
          {notices.map((n) => (
            <li key={n.slug}>
              <a href={`/notices/${n.slug}/`}>
                <span className="notice-title">{n.title}</span>
                <time dateTime={n.date}>{formatDate(n.date)}</time>
              </a>
            </li>
          ))}
        </ul>
      )}
    </Layout>
  );
}
