import i18next from './i18next'
import { cookies, headers } from 'next/headers'
import { routing } from './routing';
import { headerName } from './settings';

export async function getTranslations(ns: string, options?: { keyPrefix?: string }) {
  const headerList = await headers()
  const lng = headerList.get(headerName)
  // const lng = headerList.get("x-pathname")?.split("/")[1]

  if (lng && i18next.resolvedLanguage !== lng) {
    await i18next.changeLanguage(lng)
  }
  if (ns && !i18next.hasLoadedNamespace(ns)) {
    await i18next.loadNamespaces(ns)
  }
  return {
    t: i18next.getFixedT(
      lng ?? i18next.resolvedLanguage ?? routing.defaultLocale,
      Array.isArray(ns) ? ns[0] : ns,
      options?.keyPrefix,
    ),
    i18n: i18next,
  };
}