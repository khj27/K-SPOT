export type ContentType = "드라마" | "예능" | "영화" | "뮤직비디오" | "아이돌" | "웹툰/웹소설";

export type GeographicCoordinate = {
  latitude: number;
  longitude: number;
};

export type DemoMapPosition = {
  x: number;
  y: number;
  tone: "purple" | "blue" | "green" | "orange" | "teal" | "red";
};

export type ExploreContent = {
  id: string;
  title: string;
  type: ContentType;
  region: string;
  spotName: string;
  coordinates: GeographicCoordinate;
  mapPosition: DemoMapPosition;
  description: string;
  episode: string;
  visual: "navy" | "sky" | "rose" | "violet" | "green";
};
