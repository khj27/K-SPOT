export function isSameOrigin(request: Request) {
  return request.headers.get("origin") === new URL(request.url).origin;
}
export async function readAccountJson(request: Request, maxBytes = 450_000): Promise<unknown> {
  const reader = request.body?.getReader();
  if (!reader) throw new Error("EMPTY_BODY");
  let length = 0, text = "";
  const decoder = new TextDecoder("utf-8", { fatal: true });
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.length;
    if (length > maxBytes) { await reader.cancel(); throw new Error("BODY_TOO_LARGE"); }
    text += decoder.decode(value, { stream: true });
  }
  return JSON.parse(text + decoder.decode());
}
