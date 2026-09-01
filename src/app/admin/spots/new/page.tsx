import { RoutePlaceholder } from "@/components/common/route-placeholder";

export default function NewSpotPage() {
  return <RoutePlaceholder eyebrow="ADMIN · NEW SPOT" title="새 관광 장소 등록" description="좌표, 콘텐츠 관계, 출처와 이미지 권리 정보를 입력할 화면입니다." nextStep="STEP 8에서 공통 검증 스키마 기반 등록 폼을 구현합니다." backHref="/admin/spots" backLabel="장소 관리로 돌아가기" />;
}
