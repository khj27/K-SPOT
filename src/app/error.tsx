"use client";

import Link from "next/link";
import { useTranslation } from "@/components/common/locale-provider";

export default function PageError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const { t } = useTranslation();
  return <main className="saved-page"><section className="saved-empty" role="alert">
    <h1>{t("페이지를 불러오지 못했습니다.")}</h1>
    <p>{t("잠시 후 다시 시도해 주세요. 저장된 자료는 삭제되지 않습니다.")}</p>
    <div className="ui-actions"><button className="kspot-primary-button" type="button" onClick={retry}>{t("다시 시도")}</button><Link className="ui-button" href="/">{t("홈으로 가기")}</Link></div>
  </section></main>;
}
