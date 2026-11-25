import DOMPurify from "dompurify";
import { marked } from "marked";
import { useCallback, useEffect, useMemo, useState, type MouseEvent } from "react";

import { fetchNotice, fetchNotices, formatDate, NotFoundError, type Notice, type NoticeSummary } from "./api";
import { DetailSkeleton, ListSkeleton } from "./Skeleton";

const SITE = "히어지";
const LIST_PATH = "/notices/";

/** 현재 주소의 ?id= 값. 없으면 null(목록), 숫자가 아니면 NaN(없는 공지). */
function readId(): number | null {
  const raw = new URLSearchParams(window.location.search).get("id");
  if (raw === null) return null;
  return /^\d+$/.test(raw) ? Number(raw) : Number.NaN;
}

type Result<T> = { key: string; ok: true; data: T } | { key: string; ok: false; notFound: boolean };

/** key가 바뀌면 다시 불러온다. 현재 key의 결과가 아직 없으면 null(로딩). */
function useLoad<T>(key: string | null, load: (signal: AbortSignal) => Promise<T>): Result<T> | null {
  const [result, setResult] = useState<Result<T> | null>(null);
  useEffect(() => {
    if (key === null) return;
    const ctrl = new AbortController();
    load(ctrl.signal).then(
      (data) => !ctrl.signal.aborted && setResult({ key, ok: true, data }),
      (err: unknown) => !ctrl.signal.aborted && setResult({ key, ok: false, notFound: err instanceof NotFoundError }),
    );
    return () => ctrl.abort();
  }, [key, load]);
  return result && result.key === key ? result : null;
}

/** 일반 클릭만 가로채서 pushState로 이동한다. 새 탭 열기 등은 브라우저에 맡긴다. */
function useNavigate(setId: (id: number | null) => void) {
  return useCallback(
    (e: MouseEvent<HTMLAnchorElement>, id: number | null) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      window.history.pushState(null, "", id === null ? LIST_PATH : `${LIST_PATH}?id=${id}`);
      window.scrollTo(0, 0);
      setId(id);
    },
    [setId],
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="state" role="alert">
      <p className="state-title">공지를 불러오지 못했어요</p>
      <p className="state-desc">인터넷 연결을 확인하고 다시 시도해 주세요.</p>
      <button type="button" className="retry" onClick={onRetry}>
        다시 시도
      </button>
    </div>
  );
}

function NoticeList({ go }: { go: (e: MouseEvent<HTMLAnchorElement>, id: number | null) => void }) {
  const [attempt, setAttempt] = useState(0);
  const result = useLoad<NoticeSummary[]>(`list#${attempt}`, fetchNotices);
  return (
    <>
      <h1>공지사항</h1>
      {result === null ? (
        <ListSkeleton />
      ) : !result.ok ? (
        <ErrorState onRetry={() => setAttempt((a) => a + 1)} />
      ) : result.data.length === 0 ? (
        <p className="empty">아직 공지가 없어요.</p>
      ) : (
        <ul className="notice-list">
          {result.data.map((n) => (
            <li key={n.id}>
              <a href={`${LIST_PATH}?id=${n.id}`} onClick={(e) => go(e, n.id)}>
                <span className="notice-title">{n.title}</span>
                <time dateTime={n.published_at}>{formatDate(n.published_at)}</time>
              </a>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function renderMarkdown(body: string): string {
  const html = marked.parse(body, { async: false, gfm: true, breaks: true });
  return DOMPurify.sanitize(html);
}

function NoticeDetail({ id, go }: { id: number; go: (e: MouseEvent<HTMLAnchorElement>, id: number | null) => void }) {
  const [attempt, setAttempt] = useState(0);
  const load = useCallback((signal: AbortSignal) => fetchNotice(id, signal), [id]);
  const result = useLoad<Notice>(Number.isNaN(id) ? null : `${id}#${attempt}`, load);
  const notice = result?.ok ? result.data : null;
  const html = useMemo(() => (notice ? renderMarkdown(notice.body) : ""), [notice]);
  const missing = Number.isNaN(id) || (result !== null && !result.ok && result.notFound);

  useEffect(() => {
    if (notice) document.title = `${notice.title} · ${SITE}`;
  }, [notice]);

  return (
    <>
      {missing ? (
        <div className="state">
          <h1>공지를 찾을 수 없어요</h1>
          <p className="meta">삭제됐거나 없는 공지예요.</p>
        </div>
      ) : result === null ? (
        <DetailSkeleton />
      ) : !result.ok ? (
        <ErrorState onRetry={() => setAttempt((a) => a + 1)} />
      ) : (
        <article className="notice">
          <h1>{result.data.title}</h1>
          <p className="meta">
            <time dateTime={result.data.published_at}>{formatDate(result.data.published_at)}</time>
          </p>
          <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
        </article>
      )}
      <p className="back">
        <a href={LIST_PATH} onClick={(e) => go(e, null)}>
          공지 목록 보기
        </a>
      </p>
    </>
  );
}

export function NoticesApp() {
  const [id, setId] = useState<number | null>(readId);
  const go = useNavigate(setId);

  useEffect(() => {
    const onPop = () => setId(readId());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (id === null) document.title = `공지사항 · ${SITE}`;
  }, [id]);

  return id === null ? <NoticeList go={go} /> : <NoticeDetail key={id} id={id} go={go} />;
}
