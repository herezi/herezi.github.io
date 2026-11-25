// 공지 API 클라이언트. 공지는 Supabase `notices` 테이블에 있고, herezi-api가 공개분만 내려준다.
// 로컬에서 목 서버를 쓰려면 VITE_API_BASE=http://localhost:8787 npm run build 처럼 바꿔 빌드한다.
export const API_BASE: string = import.meta.env.VITE_API_BASE || "https://api-production-4ebcf3e2.up.railway.app";

export type NoticeSummary = { id: number; title: string; published_at: string };
export type Notice = NoticeSummary & { body: string };

export class NotFoundError extends Error {}

const TIMEOUT_MS = 10_000;

async function getJson(path: string, signal: AbortSignal): Promise<unknown> {
  const ctrl = new AbortController();
  const onAbort = () => ctrl.abort();
  signal.addEventListener("abort", onAbort);
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${API_BASE}${path}`, { signal: ctrl.signal, headers: { Accept: "application/json" } });
    if (res.status === 404) throw new NotFoundError(path);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
    signal.removeEventListener("abort", onAbort);
  }
}

function isSummary(v: unknown): v is NoticeSummary {
  const o = v as Record<string, unknown> | null;
  return !!o && typeof o.id === "number" && typeof o.title === "string" && typeof o.published_at === "string";
}

export async function fetchNotices(signal: AbortSignal): Promise<NoticeSummary[]> {
  const data = (await getJson("/v1/notices", signal)) as { notices?: unknown } | null;
  if (!data || !Array.isArray(data.notices)) throw new Error("잘못된 응답");
  return data.notices.filter(isSummary);
}

export async function fetchNotice(id: number, signal: AbortSignal): Promise<Notice> {
  const data = await getJson(`/v1/notices/${id}`, signal);
  if (!isSummary(data)) throw new Error("잘못된 응답");
  const body = (data as { body?: unknown }).body;
  return { id: data.id, title: data.title, published_at: data.published_at, body: typeof body === "string" ? body : "" };
}

const kst = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** ISO 시각 → KST 기준 YYYY.MM.DD */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const parts = Object.fromEntries(kst.formatToParts(d).map((p) => [p.type, p.value]));
  return `${parts.year}.${parts.month}.${parts.day}`;
}
