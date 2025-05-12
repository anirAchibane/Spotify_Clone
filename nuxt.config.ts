// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  runtimeConfig: {
    
    public: {
      spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      spotifyRedirectUri: process.env.SPOTIFY_REDIRECT_URI,
      spotifyClientId: process.env.SPOTIFY_CLIENT_ID,
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN
    }
  },
  devServer: {
    host: '0.0.0.0',
    port: 3000,
  },
  plugins: ['~/plugins/firebase.client', '~/plugins/spotify-embed'],

  vite: {
    server: {
      hmr: false,
    },
  },
  css: ['~/assets/fonts/stylesheet.css'],
  
  // Add app-wide head configuration
  app: {
    head: {
      script: [
        {
          src: 'https://open.spotify.com/embed-podcast/iframe-api/v1',
          async: true
        }
      ]
    }
  }
})
