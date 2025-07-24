import withMDXBuilder from "@next/mdx";

const withMDX = withMDXBuilder();

await import("./src/env/server.mjs");

/** @type {import("next").NextConfig} */
const config = withMDX({
  experimental: {
    serverActions: {
      allowedOrigins: ["*.cloudworkstations.dev", "localhost:3000"],
    },
  },
});

export default config;
