"use client";

import Link from "next/link";
import { useState } from "react";
import { CSV_MAX_BYTES, csvTemplate, readResearchCsv, serializeContentCsv, type CsvRow } from "@/lib/content-csv";

type Result = { rows: CsvRow[]; validCount: number; savedCount: number };
const researchLabels: Record<string, string> = { slug: "고유 주소 (자동 생성 · 수정 가능)", contentTitle: "미디어 제목", contentType: "미디어 유형", creator: "관련 연예인 이름", releaseYear: "미디어 공개연도", episode: "등장 장면", description: "장소 소개 및 조사 정보", spotName: "장소명", region: "지역 (주소에서 추출 · 확인 필요)", address: "정확한 주소", latitude: "위도 (필수)", longitude: "경도 (필수)", sourceUrl: "정보 출처 URL", sourceLabel: "출처명", verifiedAt: "검수일 (필수)", imageUrl: "직접 이미지 URL (선택)", imageRights: "이미지 출처·사용 근거 (선택)" };

export function AdminCsvImport() {
  const [csv, setCsv] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState("");
  const [research, setResearch] = useState<Record<string, string> | null>(null);

  function download() {
    const url = URL.createObjectURL(new Blob([csvTemplate()], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url; anchor.download = "k-spot-content-template.csv"; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function select(file?: File) {
    setCsv(""); setResult(null); setSaved(false); setMessage(""); setResearch(null);
    if (!file) return;
    if (file.size > CSV_MAX_BYTES) { setMessage("512KB 이하 파일을 선택해 주세요."); return; }
    setBusy(true);
    try {
      const text = new TextDecoder("utf-8", { fatal: true }).decode(await file.arrayBuffer());
      const converted = readResearchCsv(text);
      setResearch(converted); setCsv(text);
      if (converted) setMessage("조사표를 장소 1개로 읽었습니다. 아래 변환 내용과 누락된 필수 정보를 확인한 후 미리보기를 눌러 주세요.");
    }
    catch (error) { setMessage(error instanceof TypeError ? "CSV UTF-8 형식으로 저장해 주세요." : error instanceof Error ? error.message : "파일을 읽지 못했습니다."); }
    finally { setBusy(false); }
  }

  async function submit(action: "preview" | "commit") {
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/admin/import", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ csv: research ? serializeContentCsv(research) : csv, action }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message ?? "요청에 실패했습니다.");
      const next = payload as Result;
      setResult(next); setSaved(action === "commit");
      setMessage(action === "commit" ? `${next.savedCount}개를 초안으로 저장했습니다. ${next.rows.length - next.savedCount}개는 오류 또는 중복으로 제외했습니다.` : `검사 완료: 저장 가능 ${next.validCount}개, 오류 ${next.rows.length - next.validCount}개`);
    } catch (error) {
      setResult(null);
      setMessage(`${error instanceof Error ? error.message : "연결에 실패했습니다."} 저장 요청 후 오류가 발생했다면 다시 미리보기하여 중복 여부를 확인해 주세요.`);
    } finally { setBusy(false); }
  }

  return <section className="admin-csv-import">
    <p><strong>조사표 형식(번호 / 조사 항목 / 설명 / 작성 예시 또는 작성 내용)</strong>과 기존 일괄 등록 양식을 모두 지원합니다. 조사표 파일 하나는 장소 하나로 읽습니다. CSV UTF-8, 최대 512KB이며 기존 일괄 양식은 최대 100개 장소를 지원합니다.</p>
    <p>고유 주소(slug)가 중복되면 저장하지 않습니다. 모든 항목은 초안으로 등록되며 콘텐츠 장소 관리에서 검수 후 공개할 수 있습니다.</p>
    <div className="admin-csv-actions"><button type="button" className="kspot-primary-button" onClick={download}>CSV 양식 다운로드</button><Link href="/admin/spots">콘텐츠 장소 관리</Link></div>
    <details><summary>입력 항목 안내</summary><p>필수: slug(영문·숫자·하이픈), contentTitle(콘텐츠명), contentType(유형), episode(장면), description(관계 설명), spotName(장소명), region(지역), address(주소), latitude(위도), longitude(경도), sourceUrl(근거 주소), sourceLabel(출처명), verifiedAt(검수일 YYYY-MM-DD).</p><p>선택: creator(제작자), releaseYear(연도), imageUrl(이미지 주소), imageRights(이미지 출처·사용 근거). 유튜브 근거 주소는 이미지 주소가 비어 있으면 썸네일을 사용합니다. status 값은 항상 draft로 저장됩니다.</p></details>
    <label className="admin-csv-file">CSV 파일 선택<input type="file" accept=".csv,text/csv" disabled={busy} onChange={(event) => void select(event.target.files?.[0])} /></label>
    {research && <section className="admin-form-section"><h2>조사표 변환 내용 확인</h2><p>좌표·검수일은 실제 확인한 값을 입력해 주세요. 이미지 출처·사용 근거는 비워 두어도 됩니다. 기사 링크와 기타 조사 항목은 장소 소개에 보존합니다. 직접 이미지 주소가 없으면 정보 출처의 유튜브 썸네일을 사용합니다.</p><div className="admin-form-grid">{Object.entries(researchLabels).map(([key, label]) => <label key={key}><span>{label}</span>{key === "description" || key === "episode" ? <textarea disabled={busy} value={research[key] ?? ""} rows={key === "description" ? 8 : 3} onChange={(event) => { setResearch({ ...research, [key]: event.target.value }); setResult(null); setSaved(false); setMessage(""); }} /> : <input disabled={busy} type={key === "verifiedAt" ? "date" : "text"} value={research[key] ?? ""} onChange={(event) => { setResearch({ ...research, [key]: event.target.value }); setResult(null); setSaved(false); setMessage(""); }} />}</label>)}</div></section>}
    <div className="admin-csv-actions"><button type="button" className="kspot-primary-button" disabled={!csv || busy} onClick={() => void submit("preview")}>미리보기 및 검사</button><button type="button" className="kspot-primary-button" disabled={busy || saved || !result?.validCount} onClick={() => void submit("commit")}>정상 항목 {result?.validCount ?? 0}개 초안 저장</button></div>
    <p role="status" aria-live="polite">{busy ? "처리 중입니다…" : message}</p>
    {result && <div className="admin-table-wrap"><table className="admin-table"><caption>검사 결과 · 번호는 빈 줄을 제외한 데이터 순서입니다.</caption><thead><tr><th>번호</th><th>콘텐츠 / 고유 주소</th><th>장소</th><th>검사 결과</th></tr></thead><tbody>{result.rows.map((row) => <tr key={row.row}><td>{row.row - 1}</td><td><strong>{row.title || "이름 없음"}</strong><small>{row.slug}</small></td><td>{row.data?.spotName ?? "—"}</td><td>{row.errors.length ? <ul>{row.errors.map((error, i) => <li key={i}>{error}</li>)}</ul> : saved ? "초안 저장 완료" : "저장 가능"}</td></tr>)}</tbody></table></div>}
  </section>;
}
