import type { AppIconName } from "@/components/common/app-icon";

export type NavigationItem = {
  href: string;
  label: string;
  icon: AppIconName;
};

export const primaryNavigation: NavigationItem[] = [
  { href: "/", label: "홈", icon: "home" },
  { href: "/explore", label: "콘텐츠 검색", icon: "search" },
  { href: "/map", label: "지도 탐색", icon: "map" },
  { href: "/recommend", label: "맞춤 추천", icon: "sparkles" },
  { href: "/planner", label: "여행 코스 추천", icon: "route" },
  { href: "/saved", label: "찜한 장소", icon: "heart" },
  { href: "/mypage", label: "마이 페이지", icon: "user" },
];
