const { getDefaultConfig } = require('metro-config');
const nodeLibs = require('node-libs-react-native');

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig();

  const defaultSourceExts = [...sourceExts, 'svg', 'mjs', 'cjs'];

  return {
    resolver: {
      extraNodeModules: {
        ...nodeLibs,
        crypto: require.resolve('crypto-browserify'),
      },

      assetExts: assetExts.filter((ext) => ext !== 'svg'),

      sourceExts: process.env.TEST_REACT_NATIVE
        ? ['e2e.js'].concat(defaultSourceExts)
        : defaultSourceExts,
    },
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
  };
})();
