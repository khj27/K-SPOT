import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-inner">
        <div>
          <strong>로컬리</strong>
          <p>K-콘텐츠를 따라 발견하는 새로운 로컬 여행</p>
        </div>
        <div className="footer-links">
          <Link href="/explore">탐색</Link>
          <Link href="/planner">여행 만들기</Link>
          <Link href="/admin/login">관리자</Link>
        </div>
      </div>
    </footer>
  );
}
