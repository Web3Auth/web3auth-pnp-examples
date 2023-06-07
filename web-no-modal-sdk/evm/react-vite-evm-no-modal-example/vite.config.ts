/* eslint-disable import/no-extraneous-dependencies */
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
import react from "@vitejs/plugin-react";
import builtins from "rollup-plugin-node-builtins";
import rollupNodePolyFill from "rollup-plugin-node-polyfills";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // This Rollup aliases are extracted from @esbuild-plugins/node-modules-polyfill,
      // see https://github.com/remorses/esbuild-plugins/blob/master/node-modules-polyfill/src/polyfills.ts
      stream: "rollup-plugin-node-polyfills/polyfills/stream",
      _stream_duplex: "rollup-plugin-node-polyfills/polyfills/readable-stream/duplex",
      _stream_passthrough: "rollup-plugin-node-polyfills/polyfills/readable-stream/passthrough",
      _stream_readable: "rollup-plugin-node-polyfills/polyfills/readable-stream/readable",
      _stream_writable: "rollup-plugin-node-polyfills/polyfills/readable-stream/writable",
      _stream_transform: "rollup-plugin-node-polyfills/polyfills/readable-stream/transform",
      buffer: "rollup-plugin-node-polyfills/polyfills/buffer-es6",
      crypto: "rollup-plugin-node-polyfills/polyfills/crypto-browserify",
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "es2020",
      supported: { bigint: true },
      plugins: [NodeModulesPolyfillPlugin()],
    },
  },
  build: {
    target: "es2020",
    rollupOptions: {
      plugins: [
        // Enable rollup polyfills plugin
        // used during production bundling
        builtins(),
        rollupNodePolyFill(),
      ],
    },
  },
});
