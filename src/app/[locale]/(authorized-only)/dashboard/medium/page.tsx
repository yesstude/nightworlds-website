import { getMyResidences } from "./actions";
import { ResidenceCard } from "./residence-card";

export default async function MediumDashboardPage() {
  const residences = await getMyResidences();

  return (
    <div className="flex w-full flex-col gap-6 lg:p-8">
      <div className="flex justify-between">
        <h1 className="mb-4 text-[32px] font-bold leading-tight tracking-normal text-foreground">
          Medium
        </h1>
        <div className="flex flex-row gap-2">
          <img
            src={`https://mineskin.eu/helm/${"yesstude"}`}
            loading="eager"
            className="max-h-[40px] rounded-[8px] pb-1"
          />
          <span className=" text-[24px] font-medium text-foreground">
            {"yesstude"}
          </span>
        </div>
      </div>
      <div className="flex grid-cols-[repeat(auto-fill,_minmax(360px,1fr))] flex-col gap-4 md:grid">
        {residences.map((r) => (
          <ResidenceCard className="w-full" key={r.id} resident={r} />
        ))}
      </div>
    </div>
  );
}
