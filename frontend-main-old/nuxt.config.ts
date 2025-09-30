// https://nuxt.com/docs/api/configuration/nuxt-config

import wasm from "vite-plugin-wasm";

export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  runtimeConfig: {
    serviceUserBase: process.env.NUXT_SERVICE_USER_BASE,
    serviceQueryBase: process.env.NUXT_SERVICE_QUERY_BASE,
    serviceMediaBase: process.env.NUXT_SERVICE_MEDIA_BASE,
    serviceGatewayBase: process.env.NUXT_SERVICE_GATEWAY_BASE,
    serviceNotificationBase: process.env.NUXT_SERVICE_NOTIFICATION_BASE,
    serviceChatBase: process.env.NUXT_SERVICE_CHAT_BASE,
    redisChatBase: process.env.NUXT_REDIS_CHAT_BASE,
    public: {
      apiBaseBrowser: "",
      validWallets: ["lace", "eternl"],
      mediaCDNBase: process.env.NUXT_PUBLIC_MEDIA_CDN,    //build-arg github action 
      cardanoNetwork: process.env.NUXT_PUBLIC_CARDANO_NETWORK,
      pairfyBase: process.env.NUXT_PUBLIC_PAIRFY_BASE,
    },
  },
  css: [
    "~/assets/css/main.css", // global CSS
  ],
  modules: ["@pinia/nuxt", "@vueuse/nuxt"],
  vite: {
    plugins: [wasm()],
    build: {
      target: "esnext",
    },
    server: {
      allowedHosts: [],
    },
  },
});
