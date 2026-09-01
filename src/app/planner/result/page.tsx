import { RoutePlaceholder } from "@/components/common/route-placeholder";

export default function PlannerResultPage() {
  return <RoutePlaceholder eyebrow="MY ITINERARY" title="여행 일정 결과와 편집" description="날짜별 방문 순서, 체류 시간과 장소를 편집할 화면입니다." nextStep="STEP 7에서 순서 변경, 추가·삭제와 로컬 저장을 구현합니다." backHref="/planner" backLabel="여행 조건으로 돌아가기" />;
}
