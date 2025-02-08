import {
  SubscriptionFeatureAccessPolicy,
  getSubscriptionPricingFor,
} from "./billing";
import { getClientSafeUser } from "./users";
import {
  ClientSafeWorld,
  WorldId,
  getWorlds,
  getWorldsAvailability,
} from "./worlds";

export type PersonalizedWorldAvailability =
  | { type: "free" }
  | {
      type: "subscription";
      price: number;
      period: SubscriptionFeatureAccessPolicy["period"];
      isPreorder?: boolean;
    }
  | { type: "unavailable" };

export type PersonalizedWorld = ClientSafeWorld & {
  id: WorldId;
  availability: PersonalizedWorldAvailability;
};

export async function getPersonalizedWorlds() {
  "use server";

  const me = await getClientSafeUser();

  const worlds = await getWorlds();
  const worldsAvailability = await getWorldsAvailability(
    worlds.map((v) => v.id) as any
  );

  let result: PersonalizedWorld[] = [];

  for (let i = 0; i < worlds.length; i++) {
    const w = worlds[i]!;

    let availability: PersonalizedWorldAvailability = { type: "unavailable" };
    if (worldsAvailability[i] != "none") {
      if (w.accessPolicy.type == "free") availability = { type: "free" };
      if (w.accessPolicy.type == "subscription") {
        const { period } = w.accessPolicy;
        const { price } = await getSubscriptionPricingFor(
          w.accessPolicy,
          me?.id
        );
        availability = { type: "subscription", period, price };
      }
    }

    result.push({
      id: w.id as any,
      name: w.name,
      techDesc: w.techDesc,
      description: w.description,
      availability,
    });
  }
  return result;
}
