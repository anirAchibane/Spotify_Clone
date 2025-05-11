<template>
    <mini-nave-bar/>
    <div class="playlists-container">
        <div class="playlists-header">
            <div class="header-content">
                <h1>Your Playlists</h1>
                <div class="playlist-stats" v-if="playlists">
                    <span>{{ playlists.total }} playlists</span>
                </div>
            </div>
            <button @click="createNewPlaylist" class="create-button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                </svg>
                Create Playlist
            </button>
        </div>

        <div v-if="playlists" class="playlists-grid">
            <!-- Created Playlists -->            <div v-for="playlist in playlists.items" 
                 :key="playlist.id"
                 class="playlist-card">
                <div class="playlist-content" @click="goToPlaylist(playlist.id)">
                    <div class="playlist-image">
                        <img :src="playlist.images && playlist.images.length > 0 ? playlist.images[0]?.url : '/default-playlist.png'" 
                             :alt="playlist.name">
                    </div>
                    <div class="playlist-info">
                        <h3>{{ playlist.name }}</h3>
                        <div class="playlist-meta">
                            <span>{{ playlist.tracks.total }} tracks</span>
                            <span v-if="playlist.public" class="visibility">Public</span>
                            <span v-else class="visibility">Private</span>
                        </div>
                        <p class="playlist-owner">
                            By {{ playlist.owner.display_name }}
                        </p>
                    </div>
                </div>
                
                <div class="playlist-actions">
                    <button 
                        @click.stop="goToAddSongs(playlist.id)" 
                        class="action-button"
                        v-if="playlist.owner.id === currentUserId"
                        title="Add songs to this playlist">
                        Add Songs
                    </button>
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div v-else-if="loading" class="loading-state">
            <div v-for="n in 8" :key="n" class="playlist-card skeleton">
                <div class="playlist-image skeleton-image"></div>
                <div class="playlist-info">
                    <div class="skeleton-text"></div>
                    <div class="skeleton-text-short"></div>
                </div>
            </div>
        </div>

        <!-- Error State -->
        <div v-else class="error-state">
            <p>Couldn't load your playlists. Please try again.</p>
            <button @click="fetchPlaylists" class="retry-button">Retry</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const playlists = ref(null)
const loading = ref(true)
const currentUserId = ref('')

const createNewPlaylist = () => {
    router.push('/createPlaylist')
}

const goToPlaylist = (id) => {
    router.push(`/playlist/${id}`)
}

const fetchPlaylists = async () => {
    loading.value = true
    const token = localStorage.getItem('access_token')
    
    if (!token) {
        router.push('/')
        return
    }

    try {
        const response = await fetch('https://api.spotify.com/v1/me/playlists?limit=50', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if (!response.ok) throw new Error('Failed to fetch playlists')
        
        playlists.value = await response.json()
    } catch (error) {
        console.error('Error fetching playlists:', error)
        playlists.value = null
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchPlaylists()
})
</script>

<style scoped>
.playlists-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

.playlists-header {
    margin-bottom: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header-content {
    display: flex;
    flex-direction: column;
}

.playlists-header h1 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
}

.playlist-stats {
    color: #6b7280;
    font-size: 0.875rem;
}

.create-button {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    background-color: #1DB954;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 9999px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
}

.create-button:hover {
    background-color: #1ed760;
    transform: scale(1.03);
}

.create-button svg {
    width: 24px;
    height: 24px;
}

.playlists-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.5rem;
}

.playlist-card {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
}

.playlist-card:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-4px);
}

.playlist-image {
    aspect-ratio: 1;
    overflow: hidden;
}

.playlist-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.playlist-info {
    padding: 1rem;
}

.playlist-info h3 {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.playlist-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    color: #6b7280;
}

.visibility {
    background: rgba(255, 255, 255, 0.1);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
}

.playlist-owner {
    font-size: 0.875rem;
    color: #6b7280;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* Loading State Styles */
.skeleton {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.skeleton-image {
    background: rgba(255, 255, 255, 0.1);
    width: 100%;
    aspect-ratio: 1;
}

.skeleton-text {
    height: 1rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    margin-bottom: 0.5rem;
}

.skeleton-text-short {
    height: 1rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    width: 60%;
}

@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: .5;
    }
}

/* Error State Styles */
.error-state {
    text-align: center;
    padding: 2rem;
    color: #6b7280;
}

.retry-button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background: #1DB954;
    border: none;
    border-radius: 4px;
    color: white;
    cursor: pointer;
    transition: background-color 0.2s;
}

.retry-button:hover {
    background: #1ed760;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
    .playlists-container {
        padding: 1rem;
    }

    .playlists-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1rem;
    }
}
</style>
