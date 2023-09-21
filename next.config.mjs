import createBundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const isCloudflare = process.env.CF_PAGES === "1";

/**
 * Parse the environment variable for the custom domains for Next.js Image Optimization
 *
 * @returns {string[]}
 */
function parseImageDomains() {
  try {
    return JSON.parse(process.env.STATIC_CONTENT_DOMAIN);
  } catch {
    return [];
  }
}

/**
 * Create the configuration for Next.js Image Optimization
 *
 * @returns {import("next/dist/shared/lib/image-config").ImageConfig}
 */
function createImageConfig() {
  // Cloudflare Pages doesn't support Image Optimization
  if (isCloudflare) {
    return { unoptimized: true };
  }

  return {
    domains: parseImageDomains(),
  };
}

const config = withBundleAnalyzer({
  images: createImageConfig(),
  webpack: config => {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  productionBrowserSourceMaps: process.env.PRODUCTION_SOURCE_MAPS === "true",
});

export default config;
