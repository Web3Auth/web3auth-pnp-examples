const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolver: {
    extraNodeModules: {
      assert: require.resolve("empty-module"), // assert can be polyfilled here if needed
      http: require.resolve("empty-module"), // stream-http can be polyfilled here if needed
      https: require.resolve("empty-module"), // https-browserify can be polyfilled here if needed
      os: require.resolve("empty-module"), // os-browserify can be polyfilled here if needed
      url: require.resolve("empty-module"), // url can be polyfilled here if needed
      zlib: require.resolve("empty-module"), // browserify-zlib can be polyfilled here if needed
      path: require.resolve("empty-module"),
      stream: require.resolve("readable-stream"),
    },
    sourceExts: [...defaultConfig.resolver.sourceExts, "svg"],
    resolveRequest: (context, moduleName, platform) => {
      if (moduleName === "crypto") {
        // when importing crypto, resolve to react-native-quick-crypto
        return context.resolveRequest(context, "react-native-quick-crypto", platform);
      }
      // otherwise chain to the standard Metro resolver.
      return context.resolveRequest(context, moduleName, platform);
    },
  },
};

module.exports = mergeConfig(defaultConfig, config);
