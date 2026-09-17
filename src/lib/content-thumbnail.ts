/** Only recognize known YouTube hosts; never fetch arbitrary page metadata. */
export function youtubeThumbnail(value: string): string | undefined {
  try {
    const url = new URL(value.trim());
    if (!["https:", "http:"].includes(url.protocol)) return;
    const host = url.hostname.toLowerCase();
    const parts = url.pathname.split("/").filter(Boolean);
    let id: string | null | undefined;
    if (host === "youtu.be") id = parts[0];
    else if (["youtube.com", "www.youtube.com", "m.youtube.com", "music.youtube.com", "www.youtube-nocookie.com", "youtube-nocookie.com"].includes(host)) {
      if (url.pathname === "/watch") id = url.searchParams.get("v");
      else if (["shorts", "embed", "live"].includes(parts[0])) id = parts[1];
    }
    if (id && /^[A-Za-z0-9_-]{11}$/.test(id)) return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  } catch { /* Invalid URLs have no thumbnail. */ }
}

export function contentThumbnail(imageUrl = "", sourceUrl = ""): string | undefined {
  const image = imageUrl.trim();
  if (!image) return youtubeThumbnail(sourceUrl);
  const youtube = youtubeThumbnail(image);
  if (youtube) return youtube;
  try {
    const url = new URL(image);
    if (["http:", "https:"].includes(url.protocol)) return url.href;
  } catch { /* Keep the text fallback. */ }
}
