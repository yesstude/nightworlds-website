"use server";

import { routing, type Locale } from "~/i18n/routing";
import { getWikiPage } from "./nwiki";

export type WikiArticle = {
  title: string;
  description?: string;
  content: string;
  type: "article";
  titlesInLocales: Partial<{
    [locale in Locale]: string;
  }>;
  locale: Locale;
};

export async function getWikiPageData(key: string, locale: Locale = routing.defaultLocale) {
  const page = getWikiPage(key);
  if (!(await page.exists())) return null;

  const availableLocales = await page.getAvailableLocales();
  if (!availableLocales.includes(locale)) locale = await page.getFirstAvailableLocale();
  const title = await page.getTitle(locale);
  const description = await page.getDescription(locale);
  let content = await page.getContent(locale);
  if (!title || !content) return null;

  // Remove infoblocks (for now)
  content = content.replace(/\%infoblock\%.*?\%infoblock\%/gs, "");

  return {
    title,
    description,
    content,
    type: "article",
    titlesInLocales: (await page.getMeta()).titles,
    locale,
  } satisfies WikiArticle;
}