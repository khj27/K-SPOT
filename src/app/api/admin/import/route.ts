import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminIdentity } from "@/lib/firebase/session";
import { getFirebaseAdminDb } from "@/lib/firebase/admin";
import { CSV_MAX_BYTES, inspectContentCsv } from "@/lib/content-csv";

export async function POST(request: Request) {
  const admin = await getAdminIdentity();
  if (!admin) return NextResponse.json({ message: "관리자 로그인이 필요합니다." }, { status: 401 });
  if (request.headers.get("origin") !== new URL(request.url).origin) return NextResponse.json({ message: "허용되지 않은 요청입니다." }, { status: 403 });
  // Bound the stream itself, not only the caller-controlled Content-Length.
  const reader = request.body?.getReader();
  if (!reader) return NextResponse.json({ message: "CSV 데이터가 없습니다." }, { status: 400 });
  let raw = "", bytes = 0;
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.length;
    if (bytes > CSV_MAX_BYTES * 2) { await reader.cancel(); return NextResponse.json({ message: "요청 크기가 너무 큽니다." }, { status: 413 }); }
    raw += decoder.decode(value, { stream: true });
  }
  raw += decoder.decode();
  let csv: string, commit: boolean;
  try {
    const body = JSON.parse(raw);
    if (typeof body.csv !== "string" || !["preview", "commit"].includes(body.action)) throw new Error();
    csv = body.csv; commit = body.action === "commit";
  } catch { return NextResponse.json({ message: "올바른 CSV 요청이 아닙니다." }, { status: 400 }); }
  let rows;
  try { rows = inspectContentCsv(csv); }
  catch (error) { return NextResponse.json({ message: error instanceof Error ? error.message : "CSV를 읽지 못했습니다." }, { status: 400 }); }
  try {
    const db = getFirebaseAdminDb();
    const result = await db.runTransaction(async (transaction) => {
      const candidates = rows.filter((row) => row.data);
      const refs = candidates.map((row) => db.collection("contentSpots").doc(row.slug));
      const snapshots = refs.length ? await transaction.getAll(...refs) : [];
      const existing = new Set(snapshots.filter((doc) => doc.exists).map((doc) => doc.id));
      const checked = rows.map((row) => ({ ...row, errors: existing.has(row.slug) ? [...row.errors, "이미 등록된 고유 주소입니다. 기존 데이터는 덮어쓰지 않습니다."] : row.errors }));
      const valid = checked.filter((row) => row.data && row.errors.length === 0);
      if (commit) {
        for (const row of valid) transaction.create(db.collection("contentSpots").doc(row.slug), { ...row.data, status: "draft", createdBy: admin.email, updatedBy: admin.email, createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() });
      }
      return { rows: checked.map(({ row, slug, title, errors, data }) => ({ row, slug, title, errors, data })), validCount: valid.length, savedCount: commit ? valid.length : 0 };
    });
    return NextResponse.json(result);
  } catch { return NextResponse.json({ message: "저장소 연결에 실패했습니다. 다시 미리보기하면 저장 여부와 중복을 확인할 수 있습니다." }, { status: 503 }); }
}
