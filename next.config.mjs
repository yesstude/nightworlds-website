import withMDXBuilder from "@next/mdx";
const withMDX = withMDXBuilder();
import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin();

// @ts-check

import i18nconfig from "./next-i18next.config.mjs";

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));

/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
function defineNextConfig(config) {
  return config;
}

export default withNextIntl(
  withMDX(
    defineNextConfig({
      pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
      reactStrictMode: true,
      swcMinify: true,
      // Next.js i18n docs: https://nextjs.org/docs/advanced-features/i18n-routing
      i18n: i18nconfig.i18n,
      images: {
        domains: ["cataas.com"],
      },
    })
  )
);
