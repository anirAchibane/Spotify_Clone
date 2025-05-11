<template>
    <mini-nave-bar></mini-nave-bar>
    <div v-if="track" class="track-container">
        <div class="track-header">
            <img :src="track.album.images[0]?.url" alt="Album Cover" class="track-image">
            <div class="track-info">
                <span class="track-type">SONG</span>
                <h1>{{ track.name }}</h1>
                <p class="artists">
                    <span v-for="(artist, index) in track.artists" :key="artist.id">
                        <a @click="goToArtist(artist.id)" class="artist-link">{{ artist.name }}</a>
                        <span v-if="index < track.artists.length - 1">, </span>
                    </span>
                </p>
                <div class="track-meta">
                    <img :src="track.album.images[2]?.url" alt="Album Thumbnail" class="album-thumb">
                    <a @click="goToAlbum(track.album.id)" class="album-link">{{ track.album.name }}</a>
                    <span>•</span>
                    <span>{{ new Date(track.album.release_date).getFullYear() }}</span>
                    <span>•</span>
                    <span>{{ formatDuration(track.duration_ms) }}</span>
                </div>
                <a :href="track.external_urls?.spotify" target="_blank" class="play-button">
                    Play track
                </a>
            </div>
        </div>

        <div class="track-details" v-if="audioFeatures">
            <h2>Track Features</h2>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-value">{{ Math.round(audioFeatures.tempo) }}</div>
                    <div class="feature-label">BPM</div>
                </div>
                <div class="feature-card">
                    <div class="feature-value">{{ getPitchNotation(audioFeatures.key) }}</div>
                    <div class="feature-label">Key</div>
                </div>
                <div class="feature-card">
                    <div class="feature-value">{{ audioFeatures.time_signature }}/4</div>
                    <div class="feature-label">Time Signature</div>
                </div>
                <div class="feature-card">
                    <div class="feature-value">{{ Math.round(audioFeatures.danceability * 100) }}</div>
                    <div class="feature-label">Danceability</div>
                </div>
                <div class="feature-card">
                    <div class="feature-value">{{ Math.round(audioFeatures.energy * 100) }}</div>
                    <div class="feature-label">Energy</div>
                </div>
                <div class="feature-card">
                    <div class="feature-value">{{ track.popularity }}</div>
                    <div class="feature-label">Popularity</div>
                </div>
            </div>
        </div>

        <div class="album-context">
            <h2>From the album</h2>
            <div class="album-info" @click="goToAlbum(track.album.id)">
                <img :src="track.album.images[1]?.url" alt="Album Cover" class="album-image">
                <div>
                    <h3>{{ track.album.name }}</h3>
                    <p>Release date: {{ formatDate(track.album.release_date) }}</p>
                    <p class="album-artists">
                        By: {{ track.album.artists.map(artist => artist.name).join(', ') }}
                    </p>
                </div>
            </div>
        </div>        <div class="artist-section" v-if="track.primaryArtistDetails">
            <h2>Artist</h2>
            <div class="artist-info" @click="goToArtist(track.primaryArtistDetails.id)">
                <img 
                    :src="track.primaryArtistDetails.images && track.primaryArtistDetails.images[0]?.url || '/default-artist.png'" 
                    :alt="track.primaryArtistDetails.name" 
                    class="artist-image">
                <div>
                    <h3>{{ track.primaryArtistDetails.name }}</h3>
                    <p v-if="track.primaryArtistDetails.followers">
                        {{ formatNumber(track.primaryArtistDetails.followers.total) }} followers
                    </p>
                    <div class="artist-genres" v-if="track.primaryArtistDetails.genres && track.primaryArtistDetails.genres.length > 0">
                        <span class="genre-tag" v-for="genre in track.primaryArtistDetails.genres.slice(0, 3)" :key="genre">
                            {{ formatGenre(genre) }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div v-else>
        <h2>Couldn't find track...</h2>
    </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const route = useRoute()
const router = useRouter()
const trackId = route.params.id
const track = ref(null)
const audioFeatures = ref(null)

const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const formatGenre = (genre) => {
    return genre.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
}

const getPitchNotation = (key) => {
    const pitches = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B']
    return key >= 0 ? pitches[key] : 'N/A'
}

const goToAlbum = (albumId) => {
    router.push(`/album/${albumId}`)
}

const goToArtist = (artistId) => {
    router.push(`/artist/${artistId}`)
}

onMounted(async () => {
    const token = localStorage.getItem('access_token')
    if (!token) {
        console.error('No access token found')
        return
    }

    try {
        // Fetch track details
        const trackResponse = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        if (!trackResponse.ok) {
            throw new Error('Failed to fetch track')
        }        track.value = await trackResponse.json()

        // Fetch audio features
        try {
            const featuresResponse = await fetch(`https://api.spotify.com/v1/audio-features/${trackId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            
            if (featuresResponse.ok) {
                audioFeatures.value = await featuresResponse.json()
            }
        } catch (featuresErr) {
            console.error('Error fetching audio features:', featuresErr)
        }
        
        // Fetch primary artist info
        if (track.value && track.value.artists && track.value.artists.length > 0) {
            try {
                const artistId = track.value.artists[0].id
                const artistResponse = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                
                if (artistResponse.ok) {
                    const artistData = await artistResponse.json()
                    track.value.primaryArtistDetails = artistData
                }
            } catch (artistErr) {
                console.error('Error fetching artist details:', artistErr)
            }
        }
    } catch (err) {
        console.error('Error fetching track:', err)
    }
})
</script>

<style scoped>
.track-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

.track-header {
    display: flex;
    gap: 2rem;
    margin-bottom: 3rem;
    align-items: flex-end;
}

.track-image {
    width: 300px;
    height: 300px;
    object-fit: cover;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.track-info {
    flex: 1;
}

.track-type {
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
    display: block;
}

.track-info h1 {
    font-size: 3rem;
    margin: 0.5rem 0;
}

.artists {
    font-size: 1.25rem;
    margin-bottom: 1rem;
}

.artist-link {
    color: inherit;
    text-decoration: none;
    cursor: pointer;
}

.artist-link:hover {
    text-decoration: underline;
}

.track-meta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: #6b7280;
    margin-bottom: 1.5rem;
}

.album-thumb {
    width: 24px;
    height: 24px;
    border-radius: 2px;
}

.album-link {
    color: inherit;
    text-decoration: none;
    cursor: pointer;
}

.album-link:hover {
    text-decoration: underline;
}

.track-details {
    margin-top: 3rem;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
}

.feature-card {
    background: rgba(255, 255, 255, 0.1);
    padding: 1rem;
    border-radius: 8px;
    text-align: center;
}

.feature-value {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
}

.feature-label {
    color: #6b7280;
    font-size: 0.875rem;
}

.album-context {
    margin-top: 3rem;
}

.album-info {
    display: flex;
    gap: 1.5rem;
    margin-top: 1rem;
    padding: 1rem;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.1);
    cursor: pointer;
    transition: background-color 0.2s;
}

.album-info:hover {
    background: rgba(255, 255, 255, 0.15);
}

.album-image {
    width: 150px;
    height: 150px;
    object-fit: cover;
}

.album-artists {
    color: #6b7280;
    margin-top: 0.5rem;
}

h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
}

h3 {
    margin: 0;
    font-size: 1.25rem;
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
}

.play-button:hover {
    background-color: #1ed760;
    transform: scale(1.03);
}

.play-button svg {
    width: 24px;
    height: 24px;
}

.artist-section {
    margin-top: 3rem;
}

.artist-info {
    display: flex;
    gap: 1.5rem;
    margin-top: 1rem;
    padding: 1rem;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.1);
    cursor: pointer;
    transition: background-color 0.2s;
}

.artist-info:hover {
    background: rgba(255, 255, 255, 0.15);
}

.artist-image {
    width: 150px;
    height: 150px;
    object-fit: cover;
    border-radius: 50%;
}

.artist-genres {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.75rem;
}

.genre-tag {
    background-color: rgba(255, 255, 255, 0.1);
    padding: 0.25rem 0.75rem;
    border-radius: 16px;
    font-size: 0.75rem;
    color: #e4e4e4;
}
</style>