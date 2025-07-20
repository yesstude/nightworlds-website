import { Icon } from "~/components/ui/icon";
import Image from "next/image";
import unknownServer from "../worlds/unknown.svg";
import React from "react";
import { BaseBlessingProfile } from "~/server/db/schema";
import { Card, CardContent } from "~/components/ui/card";

interface BlessingContentProps {
  t: (key: string) => string;
  profile: BaseBlessingProfile;
  styles: { [key: string]: string };
}

export async function BlessingContent({ t, styles }: BlessingContentProps) {
  return (
    <div className="flex flex-col gap-12 lg:p-8">
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

      <div className="flex justify-center">
        <Card className="w-full max-w-[380px] bg-primary/5 rounded-[24px]">
          <CardContent className="flex flex-col gap-4 p-0">
            <div className="rounded-[24px] p-6 h-full flex flex-col gap-4">
              <h2 className="text-lg font-medium text-white mb-2">{t("task_of_week")}</h2>
              <div className="flex items-center gap-4 mb-2">
                <Image src={unknownServer} alt="Task icon" width={48} height={48} />
                <div className="flex-1">
                  <span className="text-lg font-semibold text-white">example task</span>
                </div>
              </div>
              <div className="text-white/90 text-base">
                example description
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 