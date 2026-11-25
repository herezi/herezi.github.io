import type { ReactNode } from "react";

export function Layout({ children, home = false }: { children: ReactNode; home?: boolean }) {
  return (
    <main>
      {!home && (
        <header className="site">
          <a href="/">
            <img src="/assets/logo.svg" alt="" width={28} height={28} />
            히어지
          </a>
        </header>
      )}
      {children}
      <footer className="site">
        <nav aria-label="사이트">
          <a href="/notices/">공지사항</a>
          <a href="/privacy/">개인정보 처리방침</a>
          <a href="/terms/">이용약관</a>
        </nav>
      </footer>
    </main>
  );
}
