// This file registers the SpotifyEmbed component globally in the Nuxt app

import { defineNuxtPlugin } from '#app'
import SpotifyEmbed from '~/components/SpotifyEmbed.vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('SpotifyEmbed', SpotifyEmbed)
})
