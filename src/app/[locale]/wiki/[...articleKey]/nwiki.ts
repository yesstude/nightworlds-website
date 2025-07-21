import "server-only";
import { env } from "~/env/server.mjs";
import { routing, type Locale } from "~/i18n/routing";

const ENDPOINT = env.NWWIKI_S3_BUCKET_ENDPOINT;
const KEY_DELIMITER = "/";
const DEFAULT_LOCALE = routing.defaultLocale;

export type WikiPageMeta = {
  titles: Partial<{
    [locale in Locale]: string;
  }>;
  descriptions: Partial<{
    [locale in Locale]: string;
  }>;
};

export class WikiPage {
  constructor(public readonly key: string) { }

  getLastKeyPart() {
    return this.key.split(KEY_DELIMITER).pop();
  }

  getParentKey() {
    return this.key.split(KEY_DELIMITER).slice(0, -1).join(KEY_DELIMITER);
  }

  getParent() {
    return new WikiPage(this.getParentKey());
  }

  private cachedMeta: WikiPageMeta | null = null;

  async getMeta(forceUpdate: boolean = false): Promise<WikiPageMeta> {
    if (!this.cachedMeta || forceUpdate) {
      const response = await fetch(`${ENDPOINT}/${this.key}/meta.json`);
      if (response.ok) this.cachedMeta = await response.json();
      else if (response.status === 404) this.cachedMeta = null;
      else throw new Error(`Failed to get meta for ${this.key}: ${response.statusText}`);
    }
    return this.cachedMeta as WikiPageMeta;
  }

  async exists() {
    return (await this.getMeta()) !== null;
  }

  async getTitle(locale: Locale = DEFAULT_LOCALE) {
    const meta = await this.getMeta();
    const firstAvailableLocale = await this.getFirstAvailableLocale();
    return meta.titles[locale] ?? meta.titles[firstAvailableLocale] ?? this.getLastKeyPart();
  }

  async getDescription(locale: Locale = DEFAULT_LOCALE) {
    const meta = await this.getMeta();
    const firstAvailableLocale = await this.getFirstAvailableLocale();
    return meta.descriptions[locale] ?? meta.descriptions[firstAvailableLocale] ?? undefined;
  }

  async getAvailableLocales() {
    const meta = await this.getMeta();
    return Object.keys(meta.titles) as Locale[];
  }

  async getFirstAvailableLocale() {
    const meta = await this.getMeta();
    return (Object.keys(meta.titles).find(locale => meta.titles[locale as Locale] !== undefined) ?? DEFAULT_LOCALE) as Locale;
  }

  async getContent(locale: Locale = DEFAULT_LOCALE) {
    const response = await fetch(`${ENDPOINT}/${this.key}/${locale}.md`);
    if (response.ok) return response.text();
    else if (response.status === 404) return undefined;
    else throw new Error(`Failed to get content for ${this.key} in ${locale}: ${response.statusText}`);
  }
}

export function getWikiPage(key: string) {
  return new WikiPage(key);
}