import styles from "./blessing.module.css";
import { getTranslations } from "next-intl/server";
import { BlessingContent } from "./BlessingContent";
import { getBlessingProfile } from "./actions";
import { redirect } from "next/navigation";

export default async function BlessingPage() {
  const t = await getTranslations("dashboard.blessing");

  const profile = await getBlessingProfile();

  if (!profile) {
    redirect("/dashboard/blessing/agreement");
    return <></>;
  }

  return <BlessingContent t={t} styles={styles} profile={profile} />;
}
