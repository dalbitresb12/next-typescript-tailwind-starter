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
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find(rule => rule.test?.test?.(".svg"));

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        resourceQuery: { not: /url/ }, // exclude if *.svg?url
        use: ["@svgr/webpack"],
      }
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
  productionBrowserSourceMaps: process.env.PRODUCTION_SOURCE_MAPS === "true",
});

export default config;
