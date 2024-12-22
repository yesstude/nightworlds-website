import React from "react";
import Documents from "./documents";

export default function DocumentsPage() {
  return (
    <div className="max-w-[1200px] flex-col gap-16 px-8 md:px-20">
      <h1 className="mb-4 text-[32px] font-bold leading-tight tracking-normal text-foreground">
        Документы
      </h1>
      <p className="text-[18px] font-medium leading-relaxed tracking-wide text-foreground/80">
        На этой странице можно ознакомиться с документами, которые могут
        понадобиться Вам в процессе использования услуг NightWorlds
      </p>
      <Documents />
    </div>
  );
}
