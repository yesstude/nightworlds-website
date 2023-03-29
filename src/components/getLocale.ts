import nextI18nConfig from "../../next-i18next.config.mjs";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function getLocale(...localeSections: string[]) {
  const getServerSideProps = async ({ locale }: { locale: string }) => ({
    props: {
      ...(await serverSideTranslations(
        locale,
        localeSections,
        nextI18nConfig,
        nextI18nConfig.i18n.locales
      )),
    },
  });
  return getServerSideProps;
}

export async function getLocaleProps(
  { locale }: { locale: string },
  ...localeSections: string[]
) {
  return await serverSideTranslations(
    locale,
    localeSections,
    nextI18nConfig,
    nextI18nConfig.i18n.locales
  );
}
