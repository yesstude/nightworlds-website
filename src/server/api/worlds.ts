"use server";

type World = {
  available: boolean;
};

const worlds = {
  medium: {
    available: false,
  },
} satisfies { [key: string]: World };

export async function getWorld(name: keyof typeof worlds) {
  return worlds[name];
}
