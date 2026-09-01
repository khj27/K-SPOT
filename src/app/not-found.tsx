import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page-main">
      <section className="shell placeholder-panel">
        <p className="eyebrow">404 · NOT FOUND</p>
        <h1>요청한 페이지를 찾지 못했어요.</h1>
        <p className="placeholder-description">주소가 정확한지 확인하거나 홈에서 다시 시작해 주세요.</p>
        <Link className="button button-primary" href="/">홈으로 가기</Link>
      </section>
    </main>
  );
}
