"use client";

import { useState } from "react";

export function ContentThumbnail({ src, title }: { src?: string; title: string }) {
  const [failed, setFailed] = useState<string>();
  if (!src || failed === src) return <strong>{title.slice(0, 1)}</strong>;
  // External publisher thumbnails are loaded directly; failed/deleted videos retain a text cover.
  // eslint-disable-next-line @next/next/no-img-element
  return <img className="content-cover-image" src={src} alt={`${title} 썸네일`} loading="lazy" referrerPolicy="no-referrer" onError={() => setFailed(src)} />;
}
