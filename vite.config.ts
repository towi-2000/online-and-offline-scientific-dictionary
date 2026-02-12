import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import devManifest from 'vite-plugin-dev-manifest'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  define:{__BUILD_ID__: JSON.stringify(Date.now().toString())},
  base:"/",
  plugins: [react(), devManifest(), VitePWA({
    devOptions:{enabled:false},
    registerType: 'autoUpdate',
    injectRegister: 'script',
    strategies:"generateSW",
    includeAssets: ["favicon.ico"],
    workbox:{
      navigateFallback:"/index.html",
      runtimeCaching:[{
        urlPattern: ({ url }) => url.pathname.endsWith("/data/data.json"),
        handler:"StaleWhileRevalidate",
        options:{
          cacheName: "cache:data-json",
          expiration:{
            maxEntries: 1,
            maxAgeSeconds: 2^53,
          },
          cacheableResponse:{statuses:[200],},
        }
      }],
    },
    manifest:{
      "name": "EET dict",
      "short_name":"EET dict",
      "start_url":"/",
      "display":"standalone",
      "background_color": "aliceblue",
      "theme_color":"#d6d6d6",
      "icons":[
        {"src":"icons/app_icon_small.png","sizes":"192x192","type":"image/png","purpose":"any"},
        {"src":"icons/app_icon_large.png","sizes":"512x512","type":"image/png","purpose":"any"},
        {"src":"icons/app_icon_apple.png","sizes":"180x180","type":"image/png"}
        ],
      "scope":"/",
    }
  })],
  build:{
    manifest: true,
    rollupOptions: {},
  },
  //hier Servereinstellungen ändern
  server: {
    port: 3000,
  },
})