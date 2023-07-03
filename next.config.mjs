import remarkGfm from "remark-gfm";

import path from "path";
import glob from "glob";
import withTMConfig from "next-transpile-modules";

const withTM = withTMConfig([
  "@patternfly/react-core",
  "@patternfly/react-styles",
  "@patternfly/react-icons",
]);

/**
 * Function that searches for all patternfly styles in node_modules and outputs an webpack alias object to ignore found modules.
 * @param {string} root absolute directory path to root folder containig package.json
 * @returns {Object}
 */
const searchIgnoredStyles = (root) => {
  const ignoredPaths = [
    path.join(root, "./node_modules/@patternfly/react-styles"),
    path.join(
      root,
      "./node_modules/@redhat-cloud-services/frontend-components"
    ),
  ];

  let result = {};

  ignoredPaths.forEach((path) => {
    result = {
      ...result,
      ...glob.sync(`${path}/**/*.css`).reduce((acc, curr) => {
        if (
          curr.includes("@redhat-cloud-services/frontend-components/index.css")
        ) {
          return acc;
        }
        return {
          ...acc,
          [curr]: false,
        };
      }, {}),
    };
  });

  return result;
};

export default withTM({
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  experimental: {
    esmExternals: true,
  },
  basePath: "/platform-docs",
  assetPrefix: "/platform-docs",
  async redirects() {
    return [
      {
        source: "/",
        destination: "/platform-docs",
        basePath: false,
        permanent: false,
      },
    ];
  },
  webpack: (config) => {
    config.resolve.alias = {
      "@docs/example-component": path.resolve(
        process.cwd(),
        "./components/example-component"
      ),
      "@docs/examples": path.resolve(process.cwd(), "./components/examples"),
      "@docs/deprecation-warn": path.resolve(
        process.cwd(),
        "./components/deprecation-warn"
      ),
      "@docs/extensive-prop": path.resolve(
        process.cwd(),
        "./components/extensive-prop"
      ),
      ...config.resolve.alias,
      ...searchIgnoredStyles(process.cwd()),
    };
    config.module.rules.push({
      test: /\.mdx?$/,
      use: [
        {
          loader: "@mdx-js/loader",
          options: {
            providerImportSource: "@mdx-js/react",
            remarkPlugins: [remarkGfm],
          },
        },
      ],
    });
    return config;
  },
});
