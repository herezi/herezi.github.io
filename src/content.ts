import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

import privacyHtml from "../content/legal/privacy.html?raw";
import termsHtml from "../content/legal/terms.html?raw";

// 법률 문서는 기존 정적 HTML 본문을 문구 그대로 옮겨 둔 조각이다. 손대지 말 것.
export const legal = { privacy: privacyHtml, terms: termsHtml };

export type Notice = {
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  html: string;
};

const files = import.meta.glob("../content/notices/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function toDateString(value: unknown, file: string): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  throw new Error(`${file}: frontmatter date는 YYYY-MM-DD 형식이어야 해요.`);
}

export async function loadNotices(): Promise<Notice[]> {
  const notices = await Promise.all(
    Object.entries(files).map(async ([path, raw]) => {
      const slug = path.split("/").pop()!.replace(/\.md$/, "");
      if (!/^[a-z0-9-]+$/.test(slug)) {
        throw new Error(`${path}: 파일 이름은 영문 소문자·숫자·하이픈만 써요.`);
      }
      const { data, content } = matter(raw);
      if (typeof data.title !== "string" || !data.title.trim()) {
        throw new Error(`${path}: frontmatter title이 필요해요.`);
      }
      const body = await remark().use(html).process(content);
      return { slug, title: data.title.trim(), date: toDateString(data.date, path), html: String(body) };
    }),
  );
  // 최신순. 날짜가 같으면 slug 역순.
  return notices.sort((a, b) => (a.date === b.date ? b.slug.localeCompare(a.slug) : b.date.localeCompare(a.date)));
}

export function formatDate(date: string): string {
  return date.replaceAll("-", ".");
}
