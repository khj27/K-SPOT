export default function Loading() {
  return (
    <main className="page-main" aria-busy="true" aria-label="페이지를 불러오는 중">
      <div className="shell loading-panel">
        <div className="loading-line loading-line-short" />
        <div className="loading-line loading-line-title" />
        <div className="loading-line" />
      </div>
    </main>
  );
}
