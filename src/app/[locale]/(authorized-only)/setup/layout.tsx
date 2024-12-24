import { Metadata } from "next";
import { redirect } from "next/navigation";
import { ReactNode, Suspense } from "react";
import { getMe } from "~/server/api/sessions";

export const metadata: Metadata = {
  title: "Первоначальная настройка аккаунта",
};

export default async function AccountSetupLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getMe();

  if (user!.isSetUp) return redirect("/dashboard");

  return (
    <div className="relative flex min-h-full flex-col place-items-center sm:min-h-[unset]">
      <Suspense
        fallback={
          <div
            key="window"
            className="flex w-full max-w-[100vw] grow flex-col place-items-center gap-8 bg-foreground/5 px-4 pb-4 pt-16 text-center text-[18px] font-medium leading-relaxed tracking-wide text-foreground/80 subpixel-antialiased opacity-0 transition-opacity sm:m-8 sm:min-w-[260px] sm:max-w-[480px] sm:grow-0 sm:rounded-[48px] sm:p-16 [&_h1]:mb-4 [&_h1]:text-[32px] [&_h1]:font-bold [&_h1]:leading-tight [&_h1]:tracking-normal [&_h1]:text-foreground"
          />
        }
      >
        <div
          key="window"
          className="flex w-full max-w-[100vw] grow flex-col place-items-center gap-8 bg-foreground/5 px-4 pb-4 pt-16 text-center text-[18px] font-medium leading-relaxed tracking-wide text-foreground/80 subpixel-antialiased opacity-100 transition-opacity sm:m-8 sm:min-w-[260px] sm:max-w-[480px] sm:grow-0 sm:rounded-[48px] sm:p-16 [&_h1]:mb-4 [&_h1]:text-[32px] [&_h1]:font-bold [&_h1]:leading-tight [&_h1]:tracking-normal [&_h1]:text-foreground"
        >
          {children}
        </div>
      </Suspense>
    </div>
  );
}
