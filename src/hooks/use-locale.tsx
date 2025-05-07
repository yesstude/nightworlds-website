import { useLocale as useLocaleOriginal } from "next-intl";
import { routing } from "~/i18n/routing";

export function useLocale() {
  return useLocaleOriginal() as (typeof routing.locales)[number];
}
