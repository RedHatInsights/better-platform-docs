import remarkGfm from 'remark-gfm';

import path from 'path';
import glob from 'glob';
import withTMConfig from 'next-transpile-modules';

const withTM = withTMConfig([
  '@patternfly/react-core',
  '@patternfly/react-styles',
  '@patternfly/react-icons'
]);

/**
 * Function that searches for all patternfly styles in node_modules and outputs an webpack alias object to ignore found modules.
 * @param {string} root absolute directory path to root folder containig package.json
 * @returns {Object}
 */
const searchIgnoredStyles = (root) => {
  const ignoredPaths = [
    path.join(root, './node_modules/@patternfly/react-styles'),
    path.join(root, './node_modules/@redhat-cloud-services/frontend-components'),
  ];

  let result = {};

  ignoredPaths.forEach((path) => {
    result = {
      ...result,
      ...glob.sync(`${path}/**/*.css`).reduce((acc, curr) => {
        if (curr.includes('@redhat-cloud-services/frontend-components/index.css')) {
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
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  experimental: {
    esmExternals:true
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      ...searchIgnoredStyles(process.cwd()),
    };
    config.module.rules.push({
      test: /\.mdx?$/,
    use: [
      {
        loader: '@mdx-js/loader',
        options: {
          providerImportSource: '@mdx-js/react',
          remarkPlugins: [
            remarkGfm,
          ]
        }
      }
    ]
    })
    return config;
  },
});
