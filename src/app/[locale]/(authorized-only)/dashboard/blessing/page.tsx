"use client";

import { useTranslations } from "next-intl";
import { Icon } from "~/components/ui/icon";
import styles from "./blessing.module.css";
import Image from "next/image";
import unknownServer from "../worlds/unknown.svg";

export default function BlessingPage() {
  const t = useTranslations("dashboard.blessing");

  return (
    <div className="flex w-full flex-col gap-12 lg:p-8">
      <p className="text-center text-sm text-muted-foreground">
        {t("medium_player_notice")}
      </p>

      <div className="flex flex-col items-center gap-4">
        <div className="relative flex h-[128px] w-[128px] items-center justify-center rounded-[24px] bg-primary/10">
          <Icon icon="folded_hands" size={64} className={styles.glowGradientIcon} />
          <span
            className="absolute bottom-2 right-2 bg-[#2D1B4A] text-white rounded-full px-3 py-1 text-sm font-bold shadow border border-white/20"
            style={{ textShadow: "0 1px 4px rgba(0,0,0,0.7)" }}
          >
            0
          </span>
        </div>

        <h1 className={"text-[32px] font-bold leading-tight tracking-normal text-foreground " + styles.glowGradientText}>
          {t("title")}
        </h1>
        <p className="max-w-[500px] text-center">
          {t("description")}
        </p>
      </div>

      <div className="flex w-full justify-center">
        <div className="w-full max-w-[380px]">
          <div className="flex flex-col gap-4 rounded-[24px] bg-primary/5 p-0">
            <div className="rounded-[24px] p-6 w-full h-full flex flex-col gap-4" style={{ minHeight: 260 }}>
              <h2 className="text-lg font-medium text-white mb-2">{t("task_of_week")}</h2>
              <div className="flex items-center gap-4 mb-2">
                <Image src={unknownServer} alt={t("task_icon_alt")} width={48} height={48} />
                <div className="flex-1">
                  <span className="text-lg font-semibold text-white">{t("mine_coal_title")}</span>
                </div>
              </div>
              <div className="text-white/90 text-base">
                {t("mine_coal_description")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}