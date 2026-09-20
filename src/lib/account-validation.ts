export function isSameOrigin(request: Request) {
  // Render terminates HTTPS before forwarding to the internal Next.js server.
  // Trust the configured public URL, never caller-controlled forwarded headers.
  const publicUrl = process.env.APP_URL || process.env.RENDER_EXTERNAL_URL;
  try {
    const expected = new URL(publicUrl || request.url);
    if (!['http:', 'https:'].includes(expected.protocol)) return false;
    return request.headers.get("origin") === expected.origin;
  } catch { return false; }
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
