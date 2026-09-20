
import { LocaleText } from "@/components/common/locale-provider";
import Link from "next/link";

import { AppIcon } from "@/components/common/app-icon";
import type { ContentCategory } from "@/types/home";

export function CategoryCard({ category }: { category: ContentCategory }) {
  return <Link className={`category-card category-${category.id}`} href={`/explore?type=${category.id}`}><AppIcon name={category.icon} size={36} /><strong><LocaleText>{category.label}</LocaleText></strong><span>{category.count}<LocaleText>{"곳"}</LocaleText></span></Link>;
}
