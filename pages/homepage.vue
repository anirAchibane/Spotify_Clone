<template>
  <mini-nave-bar />
  <div v-if="profile" class="homepage-container">
    <h1 class="welcome-header">Welcome {{ profile.display_name }}</h1>

    <!-- Search Bar -->
    

    <!-- Made for you section -->
    <section class="section">
      <h2>Made for you</h2>
      <div class="rec-tracks">
        <div v-for="(item, index) in featTracks.items" 
             :key="item.track.id || index" 
             @click="goToTrack(item.track.id)"
             class="track-card">
          <div class="track-image">
            <img :src="item.track.album.images[0]?.url" alt="Album Cover" />
          </div>
          <div class="track-info">
            <h3>{{ item.track.name }}</h3>
            <p>{{ item.track.artists.map(artist => artist.name).join(', ') }}</p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Artists section -->
    <section class="section">
      <h2>Rediscover your favorite artists</h2>
      <div class="top-artists">
        <div v-for="artist in topArtists.artists.items" 
             :key="artist.id" 
             @click="goToArtist(artist.id)"
             class="artist-card">
          <div class="artist-image">
            <img :src="artist.images[0]?.url" alt="Artist Image" />
          </div>
          <h3>{{ artist.name }}</h3>
        </div>
      </div>
    </section>

    <!-- Release radar section -->
    <section class="section">
      <h2>Release radar</h2>
      <div class="released-albums">
        <div v-for="album in releasedAlbums.albums.items" 
             :key="album.id" 
             @click="goToalbums(album.id)"
             class="album-card">
          <div class="album-image">
            <img :src="album.images[0]?.url" alt="Album Cover" />
          </div>
          <h3>{{ album.name }}</h3>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import {useRouter} from 'vue-router';

const topArtists = ref(null);
const profile = ref(null);
const releasedAlbums = ref(null);
const featTracks = ref(null);

const router = useRouter();

onMounted(async () => {
  const token = localStorage.getItem("access_token");

  if (!token){
    console.error("Error fetching token");
    window.location.href = "/";
    return
  }

  try{
    const userInfo = await fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!userInfo.ok) {
        throw new Error(`Error: ${userInfo.statusText}`);
    }

    profile.value = await userInfo.json();

    const tartists = await fetch("https://api.spotify.com/v1/me/following?type=artist&limit=10", {
      headers : { Authorization: `Bearer ${token}` },
    })
    if (!tartists.ok) {
        throw new Error(`Error: ${tartists.statusText}`);
    }

    topArtists.value = await tartists.json();

    const featRes = await fetch("https://api.spotify.com/v1/browse/new-releases?limit=10", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!featRes.ok){
        throw new Error(`Error: ${featRes.statusText}`);
    }
    
    releasedAlbums.value = await featRes.json();

    const feattracks = await fetch("https://api.spotify.com/v1/me/tracks?limit=10", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!feattracks.ok){
        throw new Error(`Error: ${feattracks.statusText}`);
    }

    featTracks.value = await feattracks.json();

    console.log(releasedAlbums.value)

  } catch(err){
    console.log("error: ", err)
  }
})


const goToTrack = (trackId) => {
  router.push({ name: 'track-id', params: { id: trackId } });
};

const goToalbums = (albumsId) => {
  router.push({ name: 'album-id', params: { id: albumsId } });
};

const goToArtist = (artistId) => {
  router.push({ name: 'artist-id', params: { id: artistId } });
};


</script>

<style scoped>
.homepage-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.welcome-header {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
}

.search-bar {
  border:1px solid black;
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 3rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-bar:hover {
  background: rgba(255, 255, 255, 0.15);
}

.search-prompt {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #fff;
  font-size: 1.1rem;
}

.section {
  margin-bottom: 3rem;
}

.section h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.rec-tracks, .top-artists, .released-albums {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  overflow-x: auto;
  padding: 0.5rem;
}

.track-card, .artist-card, .album-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.track-card:hover, .artist-card:hover, .album-card:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-4px);
}

.track-image, .artist-image, .album-image {
  width: 100%;
  aspect-ratio: 1;
  margin-bottom: 1rem;
  border-radius: 4px;
  overflow: hidden;
}

.artist-image {
  border-radius: 50%;
}

.track-image img, .artist-image img, .album-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.track-info {
  padding: 0.5rem 0;
}

h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

p {
  font-size: 0.875rem;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .homepage-container {
    padding: 1rem;
  }

  .rec-tracks, .top-artists, .released-albums {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }
}
</style>
