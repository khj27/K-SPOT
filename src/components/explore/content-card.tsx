import Link from "next/link";

import { AppIcon } from "@/components/common/app-icon";
import type { ContentExploreItem } from "@/types/content";

type ContentCardProps = {
  content: ContentExploreItem;
  saved: boolean;
  onToggleSaved: (id: string) => void;
};

export function ContentCard({ content, saved, onToggleSaved }: ContentCardProps) {
  return (
    <article className="explore-content-card">
      <Link className={`content-card-visual visual-${content.visualTone}`} href={`/contents/${content.id}`} aria-label={`${content.title} 상세 보기`}>
        <span className={`content-type-badge type-${content.contentType}`}>{content.typeLabel}</span>
        <div className="visual-horizon" />
        <div className="visual-figures" aria-hidden="true"><i /><i /><i /></div>
        <small>UI DEMO</small>
      </Link>
      <div className="content-card-body">
        <div>
          <Link href={`/contents/${content.id}`}><h2>{content.title}</h2></Link>
          <p>{content.year} · {content.format}</p>
        </div>
        <button className={saved ? "is-saved" : undefined} type="button" onClick={() => onToggleSaved(content.id)} aria-label={saved ? `${content.title} 저장 취소` : `${content.title} 저장`} aria-pressed={saved}>
          <AppIcon name="bookmark" size={18} />
        </button>
        <span className="content-place-count">촬영지 {content.placeCount}곳</span>
      </div>
    </article>
  );
}
