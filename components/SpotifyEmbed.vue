<template>
  <div class="spotify-player-wrapper">
    <div v-if="!isPlaying" class="play-button-container">
      <button @click="startPlaying" class="play-button">
        <span class="play-icon">▶</span> Play {{ type }}
      </button>
    </div>
    
    <div v-if="isPlaying" class="spotify-embed-container" :class="{ compact: size === 'compact' }">
      <button @click="stopPlaying" class="return-button">
        ← Return to {{ type }} info
      </button>
      <iframe 
        :src="embedUrl" 
        :width="width" 
        :height="height"
        frameborder="0" 
        allowtransparency="true" 
        allow="encrypted-media"
        loading="lazy">
      </iframe>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const isPlaying = ref(false);

const emit = defineEmits(['visibility-change']);

const startPlaying = () => {
  isPlaying.value = true;
  emit('visibility-change', true);
};

const stopPlaying = () => {
  isPlaying.value = false;
  emit('visibility-change', false);
};

const props = defineProps({
  
  id: {
    type: String,
    required: true
  },
  
  type: {
    type: String,
    required: true,
    validator: value => ['track', 'album', 'playlist', 'artist'].includes(value)
  },
  
  size: {
    type: String,
    default: 'normal',
    validator: value => ['normal', 'compact'].includes(value)
  },
  
  width: {
    type: [String, Number],
    default: '100%'
  },
  
  height: {
    type: [String, Number],
    default: () => '352' 
  },
  
  theme: {
    type: String,
    default: 'dark',
    validator: value => ['dark', 'light'].includes(value)
  }
});


const embedUrl = computed(() => {
  
  const spotifyId = props.id.includes(':') 
    ? props.id.split(':').pop() 
    : props.id;
  
  return `https://open.spotify.com/embed/${props.type}/${spotifyId}?utm_source=generator&theme=${props.theme}`;
});
</script>

<style scoped>
.spotify-player-wrapper {
  position: relative;
  margin: 20px 0;
  width: 100%;
}

.spotify-embed-container {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  animation: fadeIn 0.3s ease;
}

.spotify-embed-container iframe {
  border-radius: 12px;
  margin-top: 40px;
}

.spotify-embed-container.compact {
  max-width: 500px;
}

.play-button-container {
  display: flex;
  justify-content: flex-start;
  margin: 10px 0;
}

.play-button {
  background-color: #1DB954;
  color: white;
  border: none;
  border-radius: 30px;
  padding: 12px 24px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
  font-size: 14px;
}

.play-button:hover {
  background-color: #1ed760;
  transform: scale(1.05);
}

.play-icon {
  margin-right: 8px;
}

.return-button {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.return-button:hover {
  background-color: rgba(29, 185, 84, 0.8);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>