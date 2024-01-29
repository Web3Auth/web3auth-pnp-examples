// https://nuxt.com/docs/api/configuration/nuxt-config

import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineNuxtConfig({
  devtools: { enabled: true },
  // IMP START - Bundler Issues
  ssr: false,
  vite: {
    plugins: [
      nodePolyfills({
        globals: {
          Buffer: true,
          global: true,
        },
      }),
    ],
  },
  // IMP END - Bundler Issues
});
