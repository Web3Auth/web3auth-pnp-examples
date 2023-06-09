import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
import rollupNodePolyFill from "rollup-plugin-node-polyfills";
import builtins from "rollup-plugin-node-builtins";
import { nodeResolve } from '@rollup/plugin-node-resolve';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodeResolve({ preferBuiltins: true })],
  resolve: {
    alias: {  
      buffer: "rollup-plugin-node-polyfills/polyfills/buffer-es6",      
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
