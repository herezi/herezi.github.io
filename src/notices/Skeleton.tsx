// 공지 로딩 중 자리 표시. 빌드 때 HTML에 미리 들어가고(SSR), 클라이언트에서도 같은 모양을 쓴다.
export function ListSkeleton() {
  return (
    <ul className="notice-list skeleton" aria-busy="true" aria-label="공지를 불러오는 중">
      {[0, 1, 2].map((i) => (
        <li key={i}>
          <span className="sk sk-title" />
          <span className="sk sk-date" />
        </li>
      ))}
    </ul>
  );
}

export function DetailSkeleton() {
  return (
    <div className="skeleton" aria-busy="true" aria-label="공지를 불러오는 중">
      <span className="sk sk-h1" />
      <span className="sk sk-date" />
      <span className="sk sk-line" />
      <span className="sk sk-line" />
      <span className="sk sk-line short" />
    </div>
  );
}
