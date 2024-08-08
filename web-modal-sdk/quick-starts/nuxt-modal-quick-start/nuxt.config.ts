// https://nuxt.com/docs/api/configuration/nuxt-config

import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineNuxtConfig({
  devtools: { enabled: true },

  // IMP START - Bundler Issues
  ssr: false,

  // IMP END - Bundler Issues
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

  compatibilityDate: "2024-08-08"
});