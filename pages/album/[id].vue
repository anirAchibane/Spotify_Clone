<template>
    <mini-nave-bar></mini-nave-bar>
    <div v-if="album" class="album-container">
        <div class="album-header">
            <img :src="album.images[0]?.url" alt="Album Image" width="200" />
            <div class="album-info">
                <span class="album-type">{{ album.album_type.toUpperCase() }}</span>
                <h1>{{ album.name }}</h1>
                <div class="album-meta">
                    <span v-if="album.artists">
                        {{ album.artists.map(artist => artist.name).join(', ') }} •
                    </span>
                    <span>{{ new Date(album.release_date).getFullYear() }} • </span>
                    <span>{{ album.total_tracks }} tracks</span>
                </div>
                <a :href="album.external_urls?.spotify" target="_blank" class="play-button">

                    Play album
                </a>
            </div>
        </div>

        <div class="tracks-container">
            <div v-for="(track, index) in album.tracks.items" :key="track.id" class="track-item" >
                <div class="track-number">{{ index + 1 }}</div>
                <div class="track-info" @click="goToTrack(track.id)">
                    <div class="track-name">{{ track.name }}</div>
                    <div class="track-artists">
                        {{ track.artists.map(artist => artist.name).join(', ') }}
                    </div>
                </div>
                <div class="track-duration">
                    {{ formatDuration(track.duration_ms) }}
                </div>
            </div>
        </div>
    </div>
    <div v-else>
        <h2>Couldn't find album...</h2>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import {useRouter} from 'vue-router'

const album = ref(null);
const route = useRoute();
const albumId = route.params.id;
const router = useRouter();

onMounted(async () => {
  const token = localStorage.getItem("access_token");
  if (!token) return;

  try {
    const res = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch album");
    album.value = await res.json();
  } catch (err) {
    console.error("Error fetching album:", err);
  }
});

const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const goToTrack = (trackId) => {
  router.push(`/track/${trackId}`)
}
</script>

<style scoped>
.album-container {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.album-header {
    display: flex;
    gap: 2rem;
    margin-bottom: 2rem;
}

.album-info {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
}

.album-type {
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
}

.album-meta {
    color: #6b7280;
    font-size: 0.875rem;
    margin-top: 0.5rem;
    margin-bottom: 1.5rem;
}

.tracks-container {
    margin-top: 2rem;
}

.track-item {
    display: grid;
    grid-template-columns: 40px 1fr auto;
    align-items: center;
    padding: 0.75rem;
    border-radius: 4px;
    gap: 1rem;
}

.track-item:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.track-number {
    color: #6b7280;
    font-size: 0.875rem;
}

.track-info {
    display: flex;
    flex-direction: column;
}

.track-artists {
    color: #6b7280;
    font-size: 0.875rem;
}

.track-duration {
    color: #6b7280;
    font-size: 0.875rem;
}

.play-button {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    background-color: #1DB954;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 9999px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s ease;
    width: fit-content;
}

.play-button:hover {
    background-color: #1ed760;
    transform: scale(1.03);
}

.play-button svg {
    width: 24px;
    height: 24px;
}
</style>