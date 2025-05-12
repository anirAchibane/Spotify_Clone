<template>  <div>
    <mini-nave-bar></mini-nave-bar>
    <div class="example-container">
      <h1>Spotify Embed Examples</h1>
      
      <section class="embed-section">
        <h2>Track Example</h2>
        <p>This is a track embed with toggleable player</p>
        <div class="example-track" :class="{ 'hidden-content': playerStates.track }">
          <div class="track-card">
            <img src="https://i.scdn.co/image/ab67616d0000b2734ae1c4c5c45aabe565499163" alt="Track cover">
            <div class="track-info">
              <h3>Bohemian Rhapsody</h3>
              <p>Queen</p>
            </div>
          </div>
        </div>
        <SpotifyEmbed 
          id="4iV5W9uYEdYUVa79Axb7Rh" 
          type="track" 
          size="normal" 
          @visibility-change="(visible) => handleVisibilityChange('track', visible)"
        />
      </section>
        <section class="embed-section">
        <h2>Album Example</h2>
        <p>This is an album embed with toggleable player</p>
        <div class="example-album" :class="{ 'hidden-content': playerStates.album }">
          <div class="album-card">
            <img src="https://i.scdn.co/image/ab67616d0000b27326f7f19c7f0381e56156c94a" alt="Album cover">
            <div class="album-info">
              <h3>A Night At The Opera</h3>
              <p>Queen • 1975 • 12 songs</p>
            </div>
          </div>
        </div>
        <SpotifyEmbed 
          id="1GbtB4zTqAsyfZEsm1RZfx" 
          type="album" 
          size="normal" 
          @visibility-change="(visible) => handleVisibilityChange('album', visible)"
        />
      </section>
        <section class="embed-section">
        <h2>Playlist Example</h2>
        <p>This is a playlist embed with toggleable player</p>
        <div class="example-playlist" :class="{ 'hidden-content': playerStates.playlist }">
          <div class="album-card">
            <img src="https://i.scdn.co/image/ab67706f00000002ca5a7517156021292e5663a6" alt="Playlist cover">
            <div class="album-info">
              <h3>This Is Queen</h3>
              <p>Spotify • 50 songs • 10,000+ followers</p>
            </div>
          </div>
        </div>
        <SpotifyEmbed 
          id="37i9dQZF1DZ06evO07zaGc" 
          type="playlist" 
          size="normal" 
          @visibility-change="(visible) => handleVisibilityChange('playlist', visible)"
        />
      </section>
      
      <section class="embed-section">
        <h2>Artist Example</h2>
        <p>This is an artist embed with toggleable player</p>
        <div class="example-artist" :class="{ 'hidden-content': playerStates.artist }">
          <div class="album-card">
            <img src="https://i.scdn.co/image/ab6761610000e5eb6c85a73c3d34527f686d0cfb" alt="Artist image">
            <div class="album-info">
              <h3>Queen</h3>
              <p>40,326,765 monthly listeners</p>
            </div>
          </div>
        </div>
        <SpotifyEmbed 
          id="1dfeR4HaWDbWqFHLkxsg1d" 
          type="artist" 
          size="normal" 
          @visibility-change="(visible) => handleVisibilityChange('artist', visible)"
        />
      </section>
      
      <section class="embed-section">
        <h2>Compact Size Example</h2>
        <p>This is a compact size embed with toggle functionality</p>
        <SpotifyEmbed 
          id="4iV5W9uYEdYUVa79Axb7Rh"
          type="track" 
          size="compact" 
        />
      </section>
    </div>
  </div>
</template>

<script setup>
import SpotifyEmbed from '~/components/SpotifyEmbed.vue';
import { ref, reactive } from 'vue';

// Track visibility state for different player types
const playerStates = reactive({
  track: false,
  album: false,
  playlist: false,
  artist: false
});

// Handle visibility change events from SpotifyEmbed components
const handleVisibilityChange = (type, isVisible) => {
  playerStates[type] = isVisible;
};
</script>

<style scoped>
.example-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #1DB954;
}

.embed-section {
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
}

h2 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: #ffffff;
}

p {
  color: #b3b3b3;
  margin-bottom: 1rem;
}

.track-card, .album-card {
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
}

.track-card img, .album-card img {
  width: 100px;
  height: 100px;
  border-radius: 4px;
  margin-right: 1rem;
}

.track-info, .album-info {
  flex: 1;
}

.track-info h3, .album-info h3 {
  font-size: 1.5rem;
  margin: 0 0 0.5rem 0;
}

.track-info p, .album-info p {
  margin: 0;
  color: #b3b3b3;
}

.hidden-content {
  height: 0;
  opacity: 0;
  overflow: hidden;
  margin: 0;
  padding: 0;
  transition: all 0.5s ease;
}

@keyframes fadeOut {
  from {
    opacity: 1;
    max-height: 200px;
  }
  to {
    opacity: 0;
    max-height: 0;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 200px;
  }
}
</style>
