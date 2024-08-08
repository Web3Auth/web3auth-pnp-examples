/* eslint-disable import/no-extraneous-dependencies */
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { resolve } from "path";

// https://vitejs.dev/config/
// IMP START - Bundler Issues
  export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // "@web3auth/ethereum-provider": resolve("./node_modules/@web3auth/ethereum-provider/dist/ethereumProvider.cjs.js"),
    },
  },
  define: {
    "global": "globalThis",
  },
// IMP END - Bundler Issues
});
