import { Layout } from "../Layout";

export function Home() {
  return (
    <Layout home>
      <section className="hero">
        <img src="/assets/logo.svg" alt="히어지 로고" width={88} height={88} />
        <h1>히어지 Herezi</h1>
        <p>
          앱을 열면, 위치만으로
          <br />
          지금 내 주변에 뭐가 있는지 보여줘요.
        </p>
      </section>
      <ul className="links">
        <li><a href="/notices/">공지사항</a></li>
        <li><a href="/privacy/">개인정보 처리방침</a></li>
        <li><a href="/terms/">이용약관</a></li>
      </ul>
      <p className="contact">
        문의: help@herezi.com <span className="todo">미확정</span>
      </p>
    </Layout>
  );
}
