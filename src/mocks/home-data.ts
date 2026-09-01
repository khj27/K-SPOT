import type { ContentCategory, FeaturedPlace, MapMarker } from "@/types/home";

export const homeCategories: ContentCategory[] = [
  { id: "drama", label: "드라마", count: 128, icon: "clapper" },
  { id: "variety", label: "예능", count: 96, icon: "mic" },
  { id: "movie", label: "영화", count: 78, icon: "film" },
  { id: "music-video", label: "뮤직비디오", count: 54, icon: "music" },
  { id: "idol", label: "아이돌", count: 42, icon: "users" },
  { id: "webtoon", label: "웹툰/웹소설", count: 37, icon: "book" },
];

export const homeMapMarkers: MapMarker[] = [
  { id: "m1", label: "해운대구", count: 12, x: 64, y: 20, tone: "purple" },
  { id: "m2", label: "수영구", count: 8, x: 61, y: 48, tone: "blue" },
  { id: "m3", label: "남구", count: 6, x: 45, y: 62, tone: "green" },
  { id: "m4", label: "서면", count: 7, x: 37, y: 37, tone: "orange" },
  { id: "m5", label: "태종대", count: 4, x: 50, y: 82, tone: "purple" },
  { id: "m6", label: "기장", count: 5, x: 88, y: 28, tone: "red" },
  { id: "m7", label: "감천문화마을", x: 31, y: 75, tone: "teal" },
];

export const featuredPlace: FeaturedPlace = {
  id: "gwangalli-demo",
  name: "광안리 해수욕장",
  region: "부산 수영구",
  rating: 4.6,
  reviewCount: 236,
  isDemo: true,
  contents: [
    { id: "queen-of-tears", title: "눈물의 여왕", type: "드라마", meta: "EP. 12", visual: "navy" },
    { id: "running-man", title: "런닝맨", type: "예능", meta: "EP. 678", visual: "sky" },
    { id: "spring-day", title: "BTS ‘봄날’", type: "뮤직비디오", meta: "MV 촬영지", visual: "rose" },
    { id: "attorney", title: "변호인", type: "영화", meta: "2013", visual: "violet" },
  ],
  nearby: [
    { label: "관광지", count: 15, icon: "♜" },
    { label: "카페", count: 23, icon: "☕" },
    { label: "맛집", count: 18, icon: "♨" },
    { label: "쇼핑", count: 12, icon: "▣" },
    { label: "숙박", count: 9, icon: "▤" },
    { label: "행사/축제", count: 5, icon: "✦" },
  ],
};
