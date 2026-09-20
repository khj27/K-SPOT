import { cookies } from "next/headers";
import { translate } from "@/lib/i18n";

export async function getTranslation() {
  const locale = (await cookies()).get("kspot-locale")?.value === "en" ? "en" : "ko";
  return { locale, t: (text: string) => translate(text, locale) };
}
