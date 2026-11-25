import { Layout } from "../Layout";
import { ListSkeleton } from "../notices/Skeleton";

// 빌드 때는 껍데기만 만든다. 공지 내용은 src/notices-client.tsx가 API에서 받아 채운다.
export function Notices() {
  return (
    <Layout>
      <div id="notices-root">
        <h1>공지사항</h1>
        <ListSkeleton />
        <noscript>
          <p className="empty">공지를 보려면 JavaScript를 켜 주세요.</p>
        </noscript>
      </div>
    </Layout>
  );
}
