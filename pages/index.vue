<template>
    <div>
        <h1>Spotify on steroids!!</h1>
    </div>
    <button @click="goTo()">login</button>
    <button @click="goToSpotify()">Signup</button>
</template>

<script setup>
  const config = useRuntimeConfig();
  
  const goTo = () => {
    const clientId = config.public.spotifyClientId
    const redirectUri = config.public.spotifyRedirectUri
    const scope = [
        'user-read-private',
        'user-read-email',
        'user-top-read',
        'user-library-read',
        'user-read-playback-state',
        'user-read-currently-playing',
        'user-read-recently-played',
        'playlist-read-private',
        'playlist-read-collaborative',
        'playlist-modify-public',
        'playlist-modify-private',
        'user-follow-read',
        'user-read-playback-position'
      ].join(' ');
    
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`
    console.log('Redirecting to:',redirectUri) 
    window.location.href = authUrl
  }

    const goToSpotify = () => {
        window.location.href = 'https://open.spotify.com/';
    }
  
</script>