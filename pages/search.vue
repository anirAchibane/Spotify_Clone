<template>
    <div class="search-page">
        <mini-nave-bar />
        
        <div class="search-container">
            <div class="search-bar">
                <div class="search-input-wrapper">
                    <span class="search-icon">
                        <svg role="img" height="24" width="24" viewBox="0 0 24 24">
                            <path d="M10.533 1.279c-5.18 0-9.407 4.14-9.407 9.279s4.226 9.279 9.407 9.279c2.234 0 4.29-.77 5.907-2.058l4.353 4.353a1 1 0 101.414-1.414l-4.344-4.344a9.157 9.157 0 002.077-5.816c0-5.14-4.226-9.28-9.407-9.28zm-7.407 9.279c0-4.006 3.302-7.279 7.407-7.279s7.407 3.273 7.407 7.279-3.302 7.279-7.407 7.279-7.407-3.273-7.407-7.279z"></path>
                        </svg>
                    </span>
                    <input 
                        type="text" 
                        v-model="searchQuery"
                        @input="handleSearch"
                        placeholder="What do you want to listen to?"
                        class="search-input"
                    >
                    <span v-if="searchQuery" @click="clearSearch" class="clear-button">×</span>
                </div>
            </div>

            <div v-if="loading" class="loading-state">
                <div class="loading-spinner"></div>
                <span>Searching...</span>
            </div>

            <div v-else-if="searchQuery && hasResults" class="search-results">
                <!-- Artists Section -->
                <section v-if="filteredArtists.length" class="result-section">
                    <h2>Artists</h2>
                    <div class="artists-grid">
                        <div v-for="artist in filteredArtists" 
                             :key="artist.id"
                             class="artist-card"
                             @click="navigateToArtist(artist.id)">
                            <div class="artist-image">
                                <img :src="getArtistImage(artist)" :alt="artist.name">
                            </div>
                            <h3>{{ artist.name }}</h3>
                            <span class="artist-type">Artist</span>
                        </div>
                    </div>
                </section>

                <!-- Tracks Section -->
                <section v-if="filteredTracks.length" class="result-section">
                    <h2>Songs</h2>
                    <div class="tracks-grid">
                        <div v-for="track in filteredTracks" 
                             :key="track.id"
                             class="track-card"
                             @click="navigateToTrack(track.id)">
                            <div class="track-image">
                                <img :src="getTrackImage(track)" :alt="track.name">
                            </div>
                            <h3>{{ track.name }}</h3>
                            <span class="track-artist">{{ getArtistNames(track.artists) }}</span>
                        </div>
                    </div>
                </section>

                <!-- Albums Section -->
                <section v-if="filteredAlbums.length" class="result-section">
                    <h2>Albums</h2>
                    <div class="albums-grid">
                        <div v-for="album in filteredAlbums" 
                             :key="album.id"
                             class="album-card"
                             @click="navigateToAlbum(album.id)">
                            <div class="album-image">
                                <img :src="getAlbumImage(album)" :alt="album.name">
                            </div>
                            <h3>{{ album.name }}</h3>
                            <span class="album-artist">{{ getAlbumArtist(album) }}</span>
                        </div>
                    </div>
                </section>

                <!-- Playlists Section -->
                <section v-if="filteredPlaylists.length" class="result-section">
                    <h2>Playlists</h2>
                    <div class="playlists-grid">
                        <div v-for="playlist in filteredPlaylists" 
                             :key="playlist.id"
                             class="playlist-card"
                             @click="navigateToPlaylist(playlist.id)">
                            <div class="playlist-image">
                                <img :src="getPlaylistImage(playlist)" :alt="playlist.name">
                            </div>
                            <h3>{{ playlist.name }}</h3>
                            <span class="playlist-owner">By {{ getPlaylistOwner(playlist) }}</span>
                        </div>
                    </div>
                </section>
            </div>

            <div v-else-if="searchQuery && !hasResults" class="no-results">
                <h2>No results found for "{{ searchQuery }}"</h2>
                <p>Please make sure your words are spelled correctly, or try different keywords.</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import debounce from 'lodash/debounce'

const router = useRouter()
const searchQuery = ref('')
const loading = ref(false)
const artists = ref([])
const tracks = ref([])
const albums = ref([])
const playlists = ref([])

// Helper functions for safe data access
const getArtistImage = (artist) => {
    return artist.images?.[0]?.url || '/default-artist.png'
}

const getTrackImage = (track) => {
    return track.album?.images?.[2]?.url || '/default-track.png'
}

const getAlbumImage = (album) => {
    return album.images?.[0]?.url || '/default-album.png'
}

const getPlaylistImage = (playlist) => {
    return playlist.images?.[0]?.url || '/default-playlist.png'
}

const getArtistNames = (artists) => {
    if (!artists?.length) return 'Unknown Artist'
    return artists.map(artist => artist.name).join(', ')
}

const getAlbumArtist = (album) => {
    return album.artists?.[0]?.name || 'Unknown Artist'
}

const getPlaylistOwner = (playlist) => {
    return playlist.owner?.display_name || 'Unknown User'
}

// Filtered computed properties to ensure valid data
const filteredArtists = computed(() => 
    artists.value.filter(artist => artist && artist.id && artist.name)
)

const filteredTracks = computed(() => 
    tracks.value.filter(track => track && track.id && track.name)
)

const filteredAlbums = computed(() => 
    albums.value.filter(album => album && album.id && album.name)
)

const filteredPlaylists = computed(() => 
    playlists.value.filter(playlist => playlist && playlist.id && playlist.name)
)

const hasResults = computed(() => {
    return filteredArtists.value.length > 0 || 
           filteredTracks.value.length > 0 || 
           filteredAlbums.value.length > 0 || 
           filteredPlaylists.value.length > 0
})

const clearSearch = () => {
    searchQuery.value = ''
    artists.value = []
    tracks.value = []
    albums.value = []
    playlists.value = []
}

const handleSearch = debounce(async () => {
    if (!searchQuery.value.trim()) {
        clearSearch()
        return
    }

    loading.value = true
    const token = localStorage.getItem('access_token')
    
    try {
        const response = await fetch(
            `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery.value)}&type=artist,track,album,playlist&limit=8`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )

        if (!response.ok) throw new Error('Search failed')
        
        const data = await response.json()
        artists.value = data.artists?.items || []
        tracks.value = data.tracks?.items || []
        albums.value = data.albums?.items || []
        playlists.value = data.playlists?.items || []
    } catch (error) {
        console.error('Search error:', error)
        clearSearch()
    } finally {
        loading.value = false
    }
}, 300)

const navigateToArtist = (id) => router.push(`/artist/${id}`)
const navigateToTrack = (id) => router.push(`/track/${id}`)
const navigateToAlbum = (id) => router.push(`/album/${id}`)
const navigateToPlaylist = (id) => router.push(`/playlist/${id}`)
</script>

<style scoped>
.search-page {
    min-height: 100vh;
    background-color: #121212;
    color: #ffffff;
}

.search-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    background-color: #121212;
    min-height: 100vh;
}

.search-bar {
    margin-bottom: 2rem;
}

.search-input-wrapper {
    position: relative;
    max-width: 600px;
    margin: 0 auto;
}

.search-icon {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #b3b3b3;
}

.search-icon svg {
    fill: currentColor;
}

.search-input {
    width: 100%;
    padding: 14px 40px 14px 48px;
    border-radius: 30px;
    border: none;
    background-color: #242424;
    color: #ffffff;
    font-size: 16px;
    transition: all 0.3s ease;
}

.search-input:focus {
    outline: none;
    background-color: #333333;
    box-shadow: 0 0 0 2px rgba(29, 185, 84, 0.3);
}

.search-input::placeholder {
    color: #b3b3b3;
}

.clear-button {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 24px;
    cursor: pointer;
    color: #b3b3b3;
    line-height: 1;
}

.clear-button:hover {
    color: #ffffff;
}

.result-section {
    margin-bottom: 2rem;
}

.result-section h2 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: #121212;
}

.artists-grid, .albums-grid, .playlists-grid, .tracks-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1.5rem;
}

.artist-card, .album-card, .playlist-card, .track-card {
    background: rgba(255, 255, 255, 0.1);
    padding: 1rem;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.artist-card:hover, .album-card:hover, .playlist-card:hover, .track-card:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.artist-image, .album-image, .playlist-image, .track-image {
    width: 100%;
    aspect-ratio: 1;
    border-radius: 6px;
    overflow: hidden;
    margin-bottom: 1rem;
}

.artist-image {
    border-radius: 50%;
}

.artist-image img, .album-image img, .playlist-image img, .track-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

h3 {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #ffffff;
}

.artist-type, .album-artist, .playlist-owner, .track-artist {
    font-size: 0.875rem;
    color: #b3b3b3;
}

.loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 2rem;
    color: #b3b3b3;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #1DB954;
    border-radius: 50%;
    border-top-color: transparent;
    animation: spin 1s linear infinite;
}

.no-results {
    color: #b3b3b3;
    text-align: center;
    padding: 3rem;
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
}

.no-results h2 {
    margin-bottom: 1rem;
    color: #ffffff;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
    .search-container {
        padding: 1rem;
    }

    .artists-grid, .albums-grid, .playlists-grid, .tracks-grid {
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 1rem;
    }
}
</style>