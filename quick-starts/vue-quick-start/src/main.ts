// IMP START - Setup Wagmi Provider
import { VueQueryPlugin } from "@tanstack/vue-query";
// IMP END - Setup Wagmi Provider
import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";

// IMP START - Setup Wagmi Provider
createApp(App).use(VueQueryPlugin).mount("#app");
// IMP END - Setup Wagmi Provider
