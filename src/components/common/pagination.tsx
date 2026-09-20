import Link from "next/link";
import { LocaleText } from "@/components/common/locale-provider";
export function Pagination({ page, totalPages, pages, query }: { page: number; totalPages: number; pages: number[]; query: Record<string, string | undefined> }) {
  if (totalPages <= 1) return null;
  const href = (value: number) => { const params = new URLSearchParams(); Object.entries(query).forEach(([key, val]) => { if (val) params.set(key, val); }); params.set("page", String(value)); return `/explore?${params}`; };
  return <nav className="pagination" aria-label="Pages">{pages[0] > 1 ? <Link href={href(pages[0] - 1)}><LocaleText>이전</LocaleText></Link> : <span aria-disabled="true"><LocaleText>이전</LocaleText></span>}{pages.map((value) => <Link key={value} href={href(value)} aria-current={value === page ? "page" : undefined}>{value}</Link>)}{pages[pages.length - 1] < totalPages ? <Link href={href(pages[pages.length - 1] + 1)}><LocaleText>다음</LocaleText></Link> : <span aria-disabled="true"><LocaleText>다음</LocaleText></span>}</nav>;
}
