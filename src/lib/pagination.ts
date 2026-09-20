export const PAGE_SIZE = 9;
export function paginate<T>(items: T[], requested?: string) {
  const totalPages = Math.ceil(items.length / PAGE_SIZE);
  const parsed = requested && /^\d+$/.test(requested) ? Number(requested) : 1;
  const page = Math.min(Math.max(Number.isSafeInteger(parsed) ? parsed : 1, 1), Math.max(totalPages, 1));
  const groupStart = Math.floor((page - 1) / 9) * 9 + 1;
  return { page, totalPages, items: items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), pages: Array.from({ length: Math.max(0, Math.min(9, totalPages - groupStart + 1)) }, (_, i) => groupStart + i) };
}
