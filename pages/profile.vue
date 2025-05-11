<template>
    <div class="page-wrapper">
        <mini-nave-bar></mini-nave-bar>
        <div v-if="profile" class="profile-container">
            <!-- Profile Header -->
            <div class="profile-header">
                <img v-if="profile.images?.[0]?.url" 
                     :src="profile.images[0].url" 
                     :alt="profile.display_name"
                     class="profile-image">
                <div class="profile-info">
                    <h1>{{ profile.display_name }}</h1>
                    <div class="profile-stats">
                        <div class="stat">
                            <span class="stat-value">{{ profile.followers?.total || 0 }}</span>
                            <span class="stat-label">Followers</span>
                        </div>                        <div class="stat">
                            <span class="stat-value">{{ topArtists?.artists?.items?.length || 0 }}</span>
                            <span class="stat-label">Following</span>
                        </div>
                        <div class="stat">
                            <span class="stat-value">{{ userPlaylists.length }}</span>
                            <span class="stat-label">Playlists</span>
                        </div>
                    </div>
                </div>
            </div>            <!-- Top Artists Section -->            <section class="top-artists">
                <h2>Top Artists</h2>
                <div v-if="topArtists?.artists?.items?.length" class="artists-list">
                    <div v-for="artist in topArtists.artists.items" 
                         :key="artist.id" 
                         class="artist-list-item"
                         @click="navigateToArtist(artist.id)">
                        <div class="artist-list-image">
                            <img :src="artist.images && artist.images[0]?.url || '/default-artist.png'" :alt="artist.name">
                        </div>
                        <div class="artist-list-info">
                            <h3>{{ artist.name }}</h3>
                            <span class="artist-followers">{{ formatNumber(artist.followers?.total || 0) }} followers</span>
                        </div>
                    </div>
                </div>
                <div v-else class="empty-state">
                    <p>No artist data available.</p>
                </div>
            </section>

            <!-- Top Tracks Section -->            <section class="top-tracks">
                <h2>Top Tracks</h2>
                <div v-if="topTracks && topTracks.length > 0" class="tracks-list">
                    <div class="tracks-header">
                        <div class="track-number-header">#</div>
                        <div class="track-title-header">TITLE</div>
                        <div class="track-album-header">ALBUM</div>
                        <div class="track-duration-header">DURATION</div>
                    </div>
                    <div v-for="(track, index) in topTracks" 
                         :key="track && track.id"
                         class="track-item"
                         @click="track && track.id && navigateToTrack(track.id)">                        <span class="track-number">{{ index + 1 }}</span>
                        <div class="track-title">
                            <img :src="track && track.album?.images && track.album.images[2]?.url || '/default-track.png'" :alt="track?.name || 'Track'">
                            <div class="track-info">
                                <div class="track-name">{{ track?.name || 'Unknown Track' }}</div>
                                <div class="track-artist">{{ track?.artists && track.artists[0]?.name || 'Unknown Artist' }}</div>
                            </div>
                        </div>
                        <div class="track-album">{{ track?.album?.name || 'Unknown Album' }}</div>
                        <div class="track-duration">{{ formatDuration(track?.duration_ms || 0) }}</div>
                    </div>
                </div>
                <div v-else class="empty-state">
                    <p>No track data available.</p>
                </div>
            </section>

            <!-- User Playlists -->
            <section class="playlists">
                <h2>Your Playlists</h2>
                <div v-if="userPlaylists && userPlaylists.length > 0" class="playlists-grid">
                    <div v-for="playlist in userPlaylists" 
                         :key="playlist.id"
                         class="playlist-card"
                         @click="navigateToPlaylist(playlist.id)">
                        <div class="playlist-image">
                            <img :src="playlist.images && playlist.images[0]?.url || '/default-playlist.png'" :alt="playlist.name">
                        </div>
                        <div class="playlist-info">
                            <h3>{{ playlist.name }}</h3>
                            <span class="playlist-tracks">{{ playlist.tracks?.total || 0 }} tracks</span>
                        </div>
                    </div>
                </div>
                <div v-else class="empty-state">
                    <p>No playlists available.</p>
                </div>
            </section>
        </div>        <div v-else class="loading">
            <div class="loading-spinner"></div>
            <div class="loading-text">Loading profile...</div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const profile = ref(null)
const topArtists = ref({
    artists: {
        items: []
    }
})
const topTracks = ref([])
const userPlaylists = ref([])

const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const navigateToArtist = (id) => router.push(`/artist/${id}`)
const navigateToTrack = (id) => router.push(`/track/${id}`)
const navigateToPlaylist = (id) => router.push(`/playlist/${id}`)

onMounted(async () => {
    const token = localStorage.getItem('access_token')
    if (!token) {
        router.push('/')
        return
    }    try {
        // Fetch user profile
        const profileRes = await fetch('https://api.spotify.com/v1/me', {
            headers: { Authorization: `Bearer ${token}` }
        })
        if (!profileRes.ok) {
            throw new Error(`Error fetching profile: ${profileRes.statusText}`);
        }
        profile.value = await profileRes.json()

        // Fetch top artists
        try {
            const artistsRes = await fetch("https://api.spotify.com/v1/me/following?type=artist&limit=10", {
                headers : { Authorization: `Bearer ${token}` },
            })
            if (!artistsRes.ok) {
                throw new Error(`Error fetching artists: ${artistsRes.statusText}`);
            }
            topArtists.value = await artistsRes.json();
        } catch (artistError) {
            console.error('Error fetching artists:', artistError)
            // Keep the default empty structure for topArtists
        }        // Fetch top tracks
        try {
            const feattracks = await fetch("https://api.spotify.com/v1/me/tracks?limit=10", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!feattracks.ok) {
                throw new Error(`Error: ${feattracks.statusText}`);
            }
            
            const tracksData = await feattracks.json();
            // The /me/tracks endpoint returns items with a track property
            if (tracksData && tracksData.items) {
                topTracks.value = tracksData.items.map(item => item.track).filter(track => track != null);
            } else {
                topTracks.value = [];
            }
        } catch(err) {
            console.log("error: ", err);
            topTracks.value = [];
        }

        // Fetch user playlists
        try {
            const playlistsRes = await fetch('https://api.spotify.com/v1/me/playlists?limit=6', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!playlistsRes.ok) {
                throw new Error(`Error fetching playlists: ${playlistsRes.statusText}`);
            }
            const playlistsData = await playlistsRes.json();
            userPlaylists.value = playlistsData.items || [];
        } catch (playlistsError) {
            console.error('Error fetching playlists:', playlistsError);
            // Keep the default empty array for userPlaylists
        }
    } catch (error) {
        console.error('Error fetching profile data:', error);
    }
})
</script>

<style scoped>
.page-wrapper {
    background-color: #121212;
    min-height: 100vh;
}

.profile-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    background-color: #121212;
    color: #ffffff;
    min-height: 100vh;
}

.profile-header {
    display: flex;
    align-items: center;
    gap: 2rem;
    margin-bottom: 3rem;
    padding: 2rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.profile-image {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    object-fit: cover;
    box-shadow: 0 4px 60px rgba(0, 0, 0, .5);
}

.profile-info h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: #ffffff;
}

.profile-stats {
    display: flex;
    gap: 2rem;
}

.stat {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.stat-value {
    font-size: 1.5rem;
    font-weight: bold;
    color: #ffffff;
}

.stat-label {
    color: #b3b3b3;
    font-size: 0.875rem;
}

section {
    margin-bottom: 3rem;
    padding: 1rem;
    background-color: rgba(255, 255, 255, 0.03);
    border-radius: 8px;
}

h2 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    color: #ffffff;
}

.artist-card, .track-item, .playlist-card {
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 6px;
    transition: all 0.3s ease;
}

.artist-card:hover, .track-item:hover, .playlist-card:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.track-artist, .track-album, .playlist-info span {
    color: #b3b3b3;
}

.loading {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #121212;
    gap: 1.5rem;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #1DB954;
    border-radius: 50%;
    border-top-color: transparent;
    animation: spin 1s linear infinite;
}

.loading-text {
    font-size: 1.25rem;
    color: #b3b3b3;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.artists-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 1rem;
}

.artist-list-item {
    display: flex;
    align-items: center;
    padding: 0.75rem;
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.artist-list-item:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateX(4px);
}

.artist-list-image {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 1rem;
    flex-shrink: 0;
}

.artist-list-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.artist-list-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.playlists-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1.5rem;
    margin-top: 1rem;
}

.playlist-card {
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
}

.playlist-card:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-4px);
}

.playlist-image img {
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
}

.playlist-image {
    width: 100%;
    aspect-ratio: 1;
    position: relative;
    overflow: hidden;
}

.playlist-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.playlist-card:hover .playlist-image img {
    transform: scale(1.05);
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
    color: white;
}

.playlist-tracks {
    font-size: 0.875rem;
    color: #b3b3b3;
}

.tracks-list {
    display: flex;
    flex-direction: column;
}

.tracks-header {
    display: grid;
    grid-template-columns: 50px 1fr 1fr 100px;
    padding: 0 1rem;
    margin-bottom: 1rem;
    color: #b3b3b3;
    font-size: 0.75rem;
    letter-spacing: 0.1em;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 0.5rem;
}

.track-item {
    display: grid;
    grid-template-columns: 50px 1fr 1fr 100px;
    align-items: center;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    margin-bottom: 0.5rem;
}

.track-title {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.track-title img {
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 4px;
}

.track-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.track-name {
    color: white;
    font-size: 0.9rem;
}

.track-artist, .track-album {
    color: #b3b3b3;
    font-size: 0.8rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.track-number {
    color: #b3b3b3;
    font-size: 0.9rem;
}

.track-duration {
    color: #b3b3b3;
    font-size: 0.8rem;
    text-align: right;
}

.track-item:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.artist-list-info h3 {
    font-size: 1rem;
    font-weight: 600;
    color: white;
    margin: 0 0 0.25rem 0;
}

.artist-followers {
    display: block;
    font-size: 0.8rem;
    color: #b3b3b3;
}

.empty-state {
    padding: 2rem;
    text-align: center;
    background-color: rgba(255, 255, 255, 0.02);
    border-radius: 8px;
    border: 1px dashed rgba(255, 255, 255, 0.1);
}

.empty-state p {
    color: #8c8c8c;
    font-size: 1rem;
}
</style>