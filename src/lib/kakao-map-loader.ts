export type KakaoLatLng = { getLat(): number; getLng(): number };

export type KakaoMapInstance = {
  getCenter(): KakaoLatLng;
  getLevel(): number;
  setLevel(level: number): void;
  setCenter(position: KakaoLatLng): void;
  setBounds(bounds: { extend(position: KakaoLatLng): void }): void;
  relayout(): void;
};

export type KakaoMarkerInstance = {
  setMap(map: KakaoMapInstance | null): void;
  setOpacity(opacity: number): void;
  setZIndex(zIndex: number): void;
};

export type KakaoMaps = {
  load(callback: () => void): void;
  LatLng: new (latitude: number, longitude: number) => KakaoLatLng;
  LatLngBounds: new () => { extend(position: KakaoLatLng): void };
  Map: new (container: HTMLElement, options: { center: KakaoLatLng; level: number }) => KakaoMapInstance;
  Marker: new (options: { map: KakaoMapInstance; position: KakaoLatLng; title?: string; clickable?: boolean; image?: unknown }) => KakaoMarkerInstance;
  MarkerImage: new (source: string, size: unknown, options?: { offset?: unknown }) => unknown;
  Size: new (width: number, height: number) => unknown;
  Point: new (x: number, y: number) => unknown;
  event: {
    addListener(target: object, type: string, handler: () => void): void;
    removeListener(target: object, type: string, handler: () => void): void;
  };
};

declare global {
  interface Window {
    kakao?: { maps: KakaoMaps };
  }
}

let sdkPromise: Promise<KakaoMaps> | null = null;

export function loadKakaoMaps(appKey: string): Promise<KakaoMaps> {
  if (typeof window === "undefined") return Promise.reject(new Error("Kakao Maps는 브라우저에서만 사용할 수 있습니다."));
  if (!appKey) return Promise.reject(new Error("Kakao Maps API 키가 설정되지 않았습니다."));
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise<KakaoMaps>((resolve, reject) => {
    const finish = () => {
      if (!window.kakao?.maps) {
        reject(new Error("Kakao Maps SDK를 초기화하지 못했습니다."));
        return;
      }
      window.kakao.maps.load(() => resolve(window.kakao!.maps));
    };

    if (window.kakao?.maps) {
      finish();
      return;
    }

    const existing = document.getElementById("kakao-maps-sdk") as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", finish, { once: true });
      existing.addEventListener("error", () => reject(new Error("Kakao Maps SDK를 불러오지 못했습니다.")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = "kakao-maps-sdk";
    script.async = true;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${encodeURIComponent(appKey)}`;
    script.addEventListener("load", finish, { once: true });
    script.addEventListener("error", () => reject(new Error("Kakao Maps SDK를 불러오지 못했습니다.")), { once: true });
    document.head.appendChild(script);
  }).catch((error) => {
    sdkPromise = null;
    throw error;
  });

  return sdkPromise;
}
