<template>
    <mini-nave-bar></mini-nave-bar>
    <div v-if="artist" class="artist-container">
        <div class="artist-header">
            <img :src="artist.images[0]?.url" alt="Artist Image" class="artist-image" />
            <div class="artist-info">
                <h1>{{ artist.name }}</h1>
                <p class="followers">{{ artist.followers.total.toLocaleString() }} followers</p>
                <div class="genres">
                    <span v-for="genre in artist.genres" :key="genre" class="genre-tag">
                        {{ genre }}
                    </span>
                </div>
            </div>
        </div>

        <section class="top-tracks">
            <h2>Popular Tracks</h2>
            <div class="tracks-list">
                <div v-for="(track, index) in topTracks" :key="track.id" class="track-item" @click="goToTrack(track.id)">
                    <div class="track-number">{{ index + 1 }}</div>
                    <img :src="track.album.images[2]?.url" alt="Album Cover" class="track-image" />
                    <div class="track-info">
                        <div class="track-name">{{ track.name }}</div>
                        <div class="track-meta">{{ formatNumber(track.popularity) }} plays</div>
                    </div>
                    <div class="track-duration">{{ formatDuration(track.duration_ms) }}</div>
                </div>
            </div>
        </section>

        <section class="albums">
            <h2>Albums</h2>
            <div class="albums-grid">
                <div v-for="album in albums" :key="album.id" class="album-card" @click="navigateToAlbum(album.id)">
                    <img :src="album.images[1]?.url" alt="Album Cover" />
                    <div class="album-info">
                        <h3>{{ album.name }}</h3>
                        <p>{{ album.release_date.split('-')[0] }} • {{ album.album_type }}</p>
                    </div>
                </div>
            </div>
        </section>
    </div>
    <div v-else>
        <h2>Couldn't find artist...</h2>
    </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';

const artist = ref(null);
const topTracks = ref([]);
const albums = ref([]);
const route = useRoute();
const router = useRouter();
const artistId = route.params.id;

const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const navigateToAlbum = (albumId) => {
    router.push(`/album/${albumId}`);
};

const goToTrack = (trackId) => {
  router.push(`/track/${trackId}`)
}

onMounted(async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
        // Fetch artist details
        const artistRes = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!artistRes.ok) throw new Error("Failed to fetch artist");
        artist.value = await artistRes.json();

        // Fetch top tracks
        const topTracksRes = await fetch(
            `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (topTracksRes.ok) {
            const data = await topTracksRes.json();
            topTracks.value = data.tracks;
        }

        // Fetch albums
        const albumsRes = await fetch(
            `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album,single&market=US`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (albumsRes.ok) {
            const data = await albumsRes.json();
            albums.value = data.items;
        }
    } catch (err) {
        console.error("Error fetching artist data:", err);
    }
});
</script>

<style scoped>
.artist-container {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.artist-header {
    display: flex;
    gap: 2rem;
    margin-bottom: 3rem;
    align-items: flex-end;
}

.artist-image {
    width: 240px;
    height: 240px;
    object-fit: cover;
    border-radius: 50%;
}

.artist-info {
    flex: 1;
}

.artist-info h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.followers {
    color: #6b7280;
    margin-bottom: 1rem;
}

.genres {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.genre-tag {
    background: rgba(255, 255, 255, 0.1);
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.875rem;
}

.top-tracks, .albums {
    margin-top: 2rem;
}

h2 {
    margin-bottom: 1rem;
    font-size: 1.5rem;
}

.tracks-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.track-item {
    display: grid;
    grid-template-columns: 40px 40px 1fr auto;
    align-items: center;
    padding: 0.75rem;
    border-radius: 4px;
    gap: 1rem;
}

.track-item:hover {
    background: rgba(255, 255, 255, 0.1);
    cursor: pointer;
}

.track-image {
    width: 40px;
    height: 40px;
    object-fit: cover;
}

.track-number {
    color: #6b7280;
}

.track-meta {
    color: #6b7280;
    font-size: 0.875rem;
}

.albums-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-top: 1rem;
}

.album-card {
    cursor: pointer;
    transition: transform 0.2s;
}

.album-card:hover {
    transform: translateY(-4px);
}

.album-card img {
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
    border-radius: 4px;
    margin-bottom: 0.5rem;
}

.album-info h3 {
    font-size: 1rem;
    margin-bottom: 0.25rem;
}

.album-info p {
    color: #6b7280;
    font-size: 0.875rem;
}
</style>
