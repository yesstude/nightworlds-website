import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Не найдено",
  description: "Такой страницы не существует",
  openGraph: {
    type: "website",
    siteName: "NightWorlds",
    title: "Несуществующая страница",
    description: "Эта страница не была найдена",
  },
};

export default async function DashboardNotFoundPage() {
  return (
    <div className="w-full">
      <h2 className="mb-3 text-center text-[24px] font-bold leading-tight tracking-normal text-foreground">
        Кажется, такой страницы не существует
      </h2>
    </div>
  );
}
