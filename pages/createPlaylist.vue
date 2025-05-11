<template>
    <mini-nave-bar/>
    <div class="create-playlist-container">
        <div class="form-container">
            <h1>Create New Playlist</h1>
            
            <form @submit.prevent="createPlaylist" class="playlist-form">
                <div class="form-group">
                    <label for="playlist-name">Name</label>
                    <input 
                        id="playlist-name"
                        v-model="playlistName"
                        type="text"
                        placeholder="My Playlist"
                        required
                        :maxlength="100"
                    />
                    <div class="char-count">{{ playlistName.length }}/100</div>
                </div>

                <div class="form-group">
                    <label for="playlist-description">Description</label>
                    <textarea
                        id="playlist-description"
                        v-model="description"
                        placeholder="Give your playlist a description"
                        :maxlength="300"
                        rows="4"
                    ></textarea>
                    <div class="char-count">{{ description.length }}/300</div>
                </div>

                <div class="form-group">
                    <label class="privacy-label">
                        <input
                            type="checkbox"
                            v-model="isPublic"
                        />
                        <span>Make playlist public</span>
                    </label>
                </div>

                <div class="form-actions">
                    <button type="submit" class="create-button" :disabled="creating">
                        {{ creating ? 'Creating...' : 'Create Playlist' }}
                    </button>
                    <button type="button" class="cancel-button" @click="router.back()" :disabled="creating">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { validateTokenOrRedirect } from '../utils/tokenUtils'

const router = useRouter()
const playlistName = ref('')
const description = ref('')
const isPublic = ref(true)
const creating = ref(false)

// Validate token when component loads
onMounted(() => {
  validateTokenOrRedirect()
})

const createPlaylist = async () => {
    if (!playlistName.value.trim()) return
    
    creating.value = true
    
    // Validate token first
    if (!validateTokenOrRedirect()) {
        creating.value = false
        return
    }
    
    const token = localStorage.getItem('access_token')
    
    try {
        // First check if token is actually valid with the API
        const profileCheck = await fetch('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!profileCheck.ok) {
            if (profileCheck.status === 401) {
                console.error('Token expired or invalid, redirecting to login');
                alert('Your login session has expired. Please log in again.');
                validateTokenOrRedirect();
                return;
            }
        }
        
        // Use "me" instead of userId to refer to the current authenticated user
        const response = await fetch('https://api.spotify.com/v1/me/playlists', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: playlistName.value.trim(),
                description: description.value.trim(),
                public: isPublic.value
            })
        })

        if (!response.ok) {
            const errorDetails = await response.text();
            console.error(`Failed to create playlist (${response.status}):`, errorDetails);
            throw new Error(`Failed to create playlist: ${response.statusText}`);
        }
        
        const playlist = await response.json();
        alert('Playlist created successfully!');
        router.push(`/playlist/${playlist.id}`);
    } catch (error) {
        console.error('Error creating playlist:', error);
        alert(`Error creating playlist: ${error.message}`);
    } finally {
        creating.value = false;
    }
}
</script>

<style scoped>
.create-playlist-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    min-height: calc(100vh - 64px);
    display: flex;
    justify-content: center;
    align-items: flex-start;
}

.form-container {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 2rem;
    width: 100%;
    max-width: 600px;
}

h1 {
    font-size: 2rem;
    margin-bottom: 2rem;
    text-align: center;
}

.playlist-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

label {
    font-size: 0.875rem;
    font-weight: 500;
}

input, textarea {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    padding: 0.75rem;
    color: black;
    font-size: 1rem;
    transition: border-color 0.2s;
}

input:focus, textarea:focus {
    outline: none;
    border-color: #1DB954;
}

.char-count {
    font-size: 0.75rem;
    color: #6b7280;
    text-align: right;
}

.privacy-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
}

.privacy-label input[type="checkbox"] {
    width: 1.25rem;
    height: 1.25rem;
    padding: 0;
}

.form-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
}

.create-button, .cancel-button {
    flex: 1;
    padding: 0.75rem;
    border-radius: 9999px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
}

.create-button {
    background: #1DB954;
    color: white;
}

.create-button:hover:not(:disabled) {
    background: #1ed760;
    transform: scale(1.02);
}

.cancel-button {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
}

.cancel-button:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.1);
}

button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

@media (max-width: 768px) {
    .create-playlist-container {
        padding: 1rem;
    }
    
    .form-container {
        padding: 1.5rem;
    }
    
    .form-actions {
        flex-direction: column;
    }
}
</style>