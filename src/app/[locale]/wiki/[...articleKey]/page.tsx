import { getLocale, getTranslations } from "next-intl/server";
import { getWikiPageData, type WikiArticle } from "./actions";
import type { Locale } from "~/i18n/routing";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { articleKey: string[] } }) {
  const locale = (await getLocale()) as Locale;
  const data = await getWikiPageData(params.articleKey.join("/"), locale);
  if (!data) return {title: "NightWorlds Wiki"};

  return {
    title: data.title,
    description: data.description,
    openGraph: {
      title: data.title,
      description: data.description,
      type: "article",
    },
  } satisfies Metadata;
}

export default async function WikiPage({ params }: { params: { articleKey: string[] } }) {
  const locale = (await getLocale()) as Locale;

  const data = await getWikiPageData(params.articleKey.join("/"), locale);

  if (!data) notFound();

  return <WikiArticle data={data} userLocale={locale} />;
}

async function WikiArticle({ data, userLocale }: { data: WikiArticle, userLocale: Locale }) {
  const tcommon = await getTranslations("common");
  const t = await getTranslations("wiki");

  return (
    <>
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl text-primary">
          {data.title}
        </h1>
      </header>
      {!Object.keys(data.titlesInLocales).includes(userLocale) && (
        <div className="mb-8 rounded-lg bg-primary/10 p-4 text-primary">
          <p className="text-sm md:text-base">{t("not_available_in_your_locale", { locale: tcommon("locales." + data.locale) })}</p>
        </div>
      )}
      <div className="">
        <div className="[&>*+*]:mt-6 [&>h2]:mt-16 [&>h2]:text-3xl [&>h2]:font-medium [&>h2]:tracking-tight [&>h2]:md:text-4xl
                      [&>h3]:mt-12 [&>h3]:text-2xl [&>h3]:font-medium [&>h3]:tracking-tight [&>h3]:md:text-3xl
                      [&>h4]:mt-8 [&>h4]:text-xl [&>h4]:font-medium [&>h4]:tracking-tight [&>h4]:md:text-2xl
                      text-lg leading-relaxed md:text-xl lg:text-2xl text-foreground/90
                      [&>ul]:list-disc [&>ul]:pl-6 [&>ol]:list-decimal [&>ol]:pl-6 [&>ul]:mt-6 [&>ol]:mt-6
                      [&>li]:mt-2 [&>li]:text-lg [&>li]:md:text-xl [&>li]:lg:text-2xl
                      [&>a]:text-primary [&>a]:underline-offset-4 [&>a:hover]:text-primary/80 [&>a:hover]:underline
                      [&>code]:rounded [&>code]:bg-muted [&>code]:px-1 [&>code]:py-0.5 [&>code]:text-foreground
                      [&>pre]:rounded-lg [&>pre]:bg-muted [&>pre]:p-4 [&>pre]:text-muted-foreground [&>pre]:mt-8
                      [&>blockquote]:border-l-4 [&>blockquote]:border-primary/20 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:mt-8">
          <MDXRemote source={data.content} />
        </div>
      </div>
    </>
  );
}