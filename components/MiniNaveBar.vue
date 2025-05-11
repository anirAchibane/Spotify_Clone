<template>
  <nav>
    <ul>
      <li><button @click="goToHome">Home</button></li>
      <li><button @click="goToSearch">Search</button></li>
      <li><button @click="goToPlaylists">My Playlists</button></li>
      <li><button @click="goToProfile">Profile</button></li>
      <li><button @click="logout">Logout</button></li>
    </ul>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter();

const goToSearch = () => {
  
  router.push('/search')
}

const goToHome = () => {
  window.location.href = '/homepage';
};

const goToPlaylists = () => {
  window.location.href = '/myPlaylists';
};

const goToProfile = () => {
  window.location.href = '/profile';
};

const logout = () => {
  // Logic to handle logout
  console.log('Logging out...');
  window.location.href = '/'; // Redirect to login page
};

</script>

<style scoped>
nav {
  background-color: #0e0e0e;
  padding: 16px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

ul {
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0;
  margin: 0;
  max-width: 1200px;
  margin: 0 auto;
}

li {
  margin: 0 8px;
}

button {
  padding: 10px 16px;
  background-color: transparent;
  color: #b3b3b3;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

button:hover {
  color: #ffffff;
}

.search-bar {
  flex: 1;
  max-width: 400px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 8px 16px;
  cursor: pointer;
  margin: 0 16px;
  transition: all 0.2s;
}

.search-bar:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.search-prompt p {
  color: #b3b3b3;
  font-size: 0.9rem;
}

/* Special styling for logout */
li:last-child button {
  color: #b3b3b3;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

li:last-child button:hover {
  color: #ffffff;
  border-color: #ffffff;
}
</style>