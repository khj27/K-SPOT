import { AdminCsvImport } from "@/components/admin/admin-csv-import";
import { requireAdminPage } from "@/lib/firebase/session";

export default async function AdminImportPage() {
  await requireAdminPage();
  return <main className="admin-page"><section className="admin-heading"><div><p className="kspot-eyebrow">ADMIN · CSV</p><h1>CSV 데이터 일괄 등록</h1><p>오류를 확인한 후 정상 항목만 초안으로 저장합니다.</p></div></section><ol className="admin-import-steps" aria-label="등록 순서"><li><strong>01</strong> 파일 선택</li><li><strong>02</strong> 미리보기·오류 확인</li><li><strong>03</strong> 초안 저장·검수</li></ol><AdminCsvImport /></main>;
}
