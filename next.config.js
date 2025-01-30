import withMDXBuilder from "@next/mdx";
const withMDX = withMDXBuilder();
import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin();

await import("./src/env/server.mjs");

/** @type {import("next").NextConfig} */
const config = withNextIntl(
  withMDX({
    experimental: {
      serverActions: {
        allowedOrigins: ["*.cloudworkstations.dev", "localhost:3000"],
      },
    },
  })
);

export default config;
