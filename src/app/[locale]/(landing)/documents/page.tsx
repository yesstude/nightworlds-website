import Documents from "./documents";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: t("documents.title"),
    description: t("documents.description"),
    openGraph: {
      type: "article",
      siteName: "NightWorlds",
      title: t("documents.ogtitle"),
      description: t("documents.description"),
    },
  };
}

export default async function DocumentsPage() {
  const t = await getTranslations();

  return (
    <div className="max-w-[1200px] flex-col gap-16 px-8 md:px-20">
      <h1 className="mb-4 text-[32px] font-bold leading-tight tracking-normal text-foreground">
        {t("documents.title")}
      </h1>
      <p className="text-[18px] font-medium leading-relaxed tracking-wide text-foreground/80">
        {t("documents.subtitle")}
      </p>
      <Documents />
    </div>
  );
}
