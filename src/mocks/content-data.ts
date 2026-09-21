import type { ContentExploreItem, ContentTypeId } from "@/types/content";

export const contentTypeOptions: Array<{ id: ContentTypeId; label: string }> = [
  { id: "all", label: "전체" },
  { id: "drama", label: "드라마" },
  { id: "variety", label: "예능" },
  { id: "movie", label: "영화" },
  { id: "music-video", label: "뮤직비디오" },
  { id: "idol", label: "아이돌·음악" },
  { id: "webtoon", label: "웹툰/웹소설" },
];

export const regionOptions = ["전체 지역", "부산", "경주", "전주", "강릉", "제주", "대구", "여수"] as const;

export const demoContents: ContentExploreItem[] = [
  { id: "queen-of-tears", title: "눈물의 여왕", contentType: "drama", typeLabel: "드라마", year: 2024, format: "16부작", placeCount: 12, regions: ["부산", "대구"], artistNames: ["김수현", "김지원"], visualTone: "midnight", status: "draft", isDemo: true },
  { id: "running-man", title: "런닝맨", contentType: "variety", typeLabel: "예능", year: 2010, format: "방영 중", placeCount: 23, regions: ["부산", "경주", "제주"], artistNames: ["예능 출연진"], visualTone: "sky", status: "draft", isDemo: true },
  { id: "spring-day", title: "BTS ‘봄날’", contentType: "music-video", typeLabel: "뮤직비디오", year: 2017, format: "MV", placeCount: 18, regions: ["강릉", "부산"], artistNames: ["BTS"], visualTone: "coast", status: "draft", isDemo: true },
  { id: "attorney", title: "변호인", contentType: "movie", typeLabel: "영화", year: 2013, format: "127분", placeCount: 9, regions: ["부산"], artistNames: ["영화 출연진"], visualTone: "sepia", status: "draft", isDemo: true },
  { id: "lovesick-girls", title: "BLACKPINK ‘Lovesick Girls’", contentType: "idol", typeLabel: "아이돌·음악", year: 2020, format: "MV", placeCount: 15, regions: ["전주", "경주"], artistNames: ["BLACKPINK"], visualTone: "violet", status: "draft", isDemo: true },
  { id: "true-beauty", title: "여신강림", contentType: "webtoon", typeLabel: "웹툰/웹소설", year: 2018, format: "연재작", placeCount: 8, regions: ["전주", "대구"], artistNames: ["야옹이"], visualTone: "night", status: "draft", isDemo: true },
  { id: "two-days-one-night", title: "1박 2일 시즌4", contentType: "variety", typeLabel: "예능", year: 2019, format: "방영 중", placeCount: 20, regions: ["경주", "강릉", "여수"], artistNames: ["예능 출연진"], visualTone: "forest", status: "draft", isDemo: true },
  { id: "goblin-demo", title: "도깨비", contentType: "drama", typeLabel: "드라마", year: 2016, format: "16부작", placeCount: 14, regions: ["강릉", "전주"], artistNames: ["드라마 출연진"], visualTone: "heritage", status: "draft", isDemo: true },
  { id: "inside-men", title: "내부자들", contentType: "movie", typeLabel: "영화", year: 2015, format: "130분", placeCount: 11, regions: ["부산", "대구"], artistNames: ["영화 출연진"], visualTone: "city", status: "draft", isDemo: true },
  { id: "hometown-demo", title: "바닷마을 이야기", contentType: "drama", typeLabel: "드라마", year: 2022, format: "12부작", placeCount: 7, regions: ["여수", "제주"], artistNames: ["데모 출연진"], visualTone: "coast", status: "draft", isDemo: true },
  { id: "local-stage", title: "로컬 스테이지", contentType: "idol", typeLabel: "아이돌·음악", year: 2023, format: "공연", placeCount: 6, regions: ["대구", "부산"], artistNames: ["데모 아티스트"], visualTone: "violet", status: "draft", isDemo: true },
  { id: "weekend-trip", title: "주말 로컬 여행", contentType: "variety", typeLabel: "예능", year: 2021, format: "24부작", placeCount: 10, regions: ["전주", "여수"], artistNames: ["데모 출연진"], visualTone: "forest", status: "draft", isDemo: true },
];
