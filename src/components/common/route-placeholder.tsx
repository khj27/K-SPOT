import Link from "next/link";

type RoutePlaceholderProps = {
  eyebrow: string;
  title: string;
  description: string;
  nextStep: string;
  backHref?: string;
  backLabel?: string;
};

export function RoutePlaceholder({
  eyebrow,
  title,
  description,
  nextStep,
  backHref = "/",
  backLabel = "홈으로 돌아가기",
}: RoutePlaceholderProps) {
  return (
    <main className="page-main">
      <section className="shell placeholder-panel">
        <div className="placeholder-icon" aria-hidden="true">✦</div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="placeholder-description">{description}</p>
        <div className="status-note">
          <span>현재 단계</span>
          <strong>라우팅과 공통 화면 구조 준비 완료</strong>
          <p>{nextStep}</p>
        </div>
        <Link className="button button-secondary" href={backHref}>{backLabel}</Link>
      </section>
    </main>
  );
}
