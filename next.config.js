import withMDXBuilder from "@next/mdx";
import createNextIntlPlugin from "next-intl/plugin";

const withMDX = withMDXBuilder();

const withNextIntl = createNextIntlPlugin();

await import("./src/env/server.mjs");

/** @type {import("next").NextConfig} */
const config = withNextIntl(
  withMDX({
    experimental: {
      serverActions: {
        allowedOrigins: ["*.cloudworkstations.dev", "localhost:3000"],
      },
      serverComponentsExternalPackages: ["mcbanners"],
    },
  })
);

export default config;
