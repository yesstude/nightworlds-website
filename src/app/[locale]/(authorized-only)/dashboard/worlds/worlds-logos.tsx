import nwm4 from "./nwm37.svg";
import unknown from "./unknown.svg";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { WorldId } from "~/server/api/worlds";

const worldsLogos: { [key in WorldId]?: { logo: StaticImport; alt: string } } =
  {
    medium: {
      logo: nwm4,
      alt: "Cuboid letter M logo",
    },
  };

export function worldLogo(id: WorldId) {
  return (
    worldsLogos[id] ?? {
      logo: unknown,
      alt: "Unknown server cuboid logo",
    }
  );
}
