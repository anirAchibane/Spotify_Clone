<template>
  <div class="welcome-container">
    <div class="nav-strip">
      <div class="logo-strip">
        <div class="since-badge">SINCE 2025</div>
        <div class="world-renowned">NEO SPOTIFY</div>
      </div>
    </div>
    
    <div class="hero-section">
      <div class="hero-overlay">
        <div class="graffiti-tag">NEO SPOTIFY</div>
        <h1 class="main-title">just like <p style="color:#1DB954;">Spotify</p></h1>
        <div class="steroids-tag">yep, just a copy</div>
      </div>
      <div class="scroll-indicator">
        <span class="arrow-down"></span>
        <span>SCROLL DOWN</span>
      </div>
    </div>
    
    <div class="cta-section">
      <div class="cta-box">
        <div class="cta-content">
          <h3 class="cta-tagline">join us</h3>
          <div class="cta-buttons">
            <button @click="goTo()" class="login-button">LOG IN WITH SPOTIFY</button>
            <button @click="goToSpotify()" class="signup-button">SIGN UP ON SPOTIFY</button>
          </div>
        </div>
      </div>
    </div>
    

  </div>
</template>

<script setup>
  const config = useRuntimeConfig();
  
  const goTo = () => {
    const clientId = config.public.spotifyClientId
    const redirectUri = config.public.spotifyRedirectUri
    const scope = [
        'user-read-private',
        'user-read-email',
        'user-top-read',
        'user-library-read',
        'user-read-playback-state',
        'user-read-currently-playing',
        'user-read-recently-played',
        'playlist-read-private',
        'playlist-read-collaborative',
        'playlist-modify-public',
        'playlist-modify-private',
        'user-follow-read',
        'user-read-playback-position'
      ].join(' ');
    
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`
    console.log('Redirecting to:',redirectUri) 
    window.location.href = authUrl
  }

  const goToSpotify = () => {
      window.location.href = 'https://open.spotify.com/';
  }
</script>

<style scoped>
:root {
  --spotify-green: #1DB954;
  --spotify-black: #000000;
  --spotify-dark-gray: #212121;
  --spotify-light-gray: #b3b3b3;
  --spotify-white: #FFFFFF;
}

.welcome-container {
  min-height: 100vh;
  background: var(--spotify-black);
  color: var(--spotify-white);
  font-family: 'SpotifyMix-Black', Arial, sans-serif;
  position: relative;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}

.nav-strip {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 15px 30px;
  z-index: 100;
  mix-blend-mode: difference;
}

.logo-strip {
  display: flex;
  justify-content: space-between;
  letter-spacing: 1px;
  font-size: 12px;
  font-weight: bold;
}

.since-badge, .world-renowned {
  text-transform: uppercase;
  position: relative;
  color:#1DB954
}

.since-badge::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -5px;
  width: 100%;
  height: 2px;
  background-color: var(--spotify-white);
  transform-origin: bottom right;
  transform: scaleX(0);
  transition: transform 0.3s ease-out;
}

.since-badge:hover::after {
  transform: scaleX(1);
  transform-origin: bottom left;
}

.hero-section {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 0 20px;
  background-color: #000;
  overflow: hidden;
}

.hero-overlay {
  width: 100%;
  max-width: 1400px;
  position: relative;
  z-index: 2;
  text-align: center;
}

.graffiti-tag {
  font-family: 'SpotifyMix-Black', Arial, sans-serif;
  font-size: 1.2rem;
  text-align: center;
  letter-spacing: 6px;
  margin-bottom: 10px;
  font-style: italic;
  position: relative;
  transform: skewX(-7deg);
}

.main-title {
  font-size: clamp(3rem, 10vw, 7rem);
  line-height: 0.95;
  font-weight: 900;
  margin: 0;
  padding: 0;
  letter-spacing: -2px;
  text-transform: uppercase;
  overflow: visible;
  animation: text-reveal 1.5s ease-out forwards;
  animation-delay: 0.3s;
  opacity: 0;
}

.steroids-tag {
  font-family: 'SpotifyMix-Black', Arial, sans-serif;
  font-size: 1.2rem;
  font-style: italic;
  letter-spacing: 4px;
  margin-top: 10px;
  text-align: center;

  transform: skewX(-7deg);
  color: var(--spotify-green);
  position: relative;
  animation: fadeIn 0.5s ease-in forwards;
  animation-delay: 1.5s;
  opacity: 0;
  display: inline-block;
}

.steroids-tag::after {
  content: "";
  position: absolute;
  left: -10px;
  right: -10px;
  bottom: -3px;
  height: 1px;
  background-color: var(--spotify-green);
  animation: lineExpand 1s ease-out forwards;
  animation-delay: 1.8s;
  transform: scaleX(0);
  transform-origin: left;
}

@keyframes lineExpand {
  to {
    transform: scaleX(1);
  }
}

@keyframes text-reveal {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

.scroll-indicator {
  position: absolute;
  bottom: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  font-size: 10px;
  letter-spacing: 1.5px;
  opacity: 0.6;
  transition: opacity 0.3s ease;
  cursor: pointer;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.arrow-down {
  width: 10px;
  height: 10px;
  border-right: 1px solid white;
  border-bottom: 1px solid white;
  transform: rotate(45deg);
  display: block;
}

.manifesto-section {
  padding: 120px 30px;
  background-color: var(--spotify-green);
  position: relative;
  overflow: hidden;
}

.manifesto-title {
  font-size: clamp(1.5rem, 4vw, 3rem);
  font-weight: 900;
  line-height: 1.1;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  letter-spacing: -1px;
  color: var(--spotify-black);
  text-transform: uppercase;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  max-width: 1400px;
  margin: 0 auto;
  padding: 80px 30px;
  gap: 40px;
}

.feature-item {
  background-color: rgba(0, 0, 0, 0.5);
  padding: 40px 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  transition: transform 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.feature-item:hover {
  transform: translateY(-10px);
}

.feature-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: var(--spotify-green);
  transform: scaleX(0);
  transition: transform 0.5s cubic-bezier(0.7, 0, 0.3, 1);
  transform-origin: left;
}

.feature-item:hover::after {
  transform: scaleX(1);
}

.feature-title {
  font-size: 1.2rem;
  font-weight: 800;
  letter-spacing: 1px;
  margin-bottom: 20px;
}

.feature-icon {
  margin: 20px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  color: var(--spotify-green);
}

.feature-desc {
  font-size: 0.9rem;
  letter-spacing: 1px;
  margin-top: 20px;
  color: #999;
}

.cta-section {
  padding: 120px 30px;
  background-color: #111;
  position: relative;
}

.cta-box {
  max-width: 1000px;
  margin: 0 auto;
  border: 2px solid var(--spotify-white);
  padding: 50px;
  text-align: center;
  position: relative;
}

.cta-tagline {
  font-size: clamp(1.5rem, 5vw, 3rem);
  margin-bottom: 40px;
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: -1px;
  text-transform: uppercase;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.login-button, .signup-button {
  padding: 15px 30px;
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  border: none;
  cursor: pointer;
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.login-button {
  background-color: var(--spotify-green);
  color: var(--spotify-black);
}

.login-button:hover {
  background-color: #1DB954;;
  transform: translateY(-5px);
}

.signup-button {
  background-color: transparent;
  color: var(--spotify-white);
  border: 1px solid var(--spotify-white);
}

.signup-button:hover {
  background-color: #1DB954;
  color: var(--spotify-black);
  transform: translateY(-5px);
}

.marquee-container {
  overflow: hidden;
  background-color: var(--spotify-green);
  padding: 15px 0;
  white-space: nowrap;
}

.marquee-content {
  display: inline-block;
  animation: marquee 30s linear infinite;
}

.marquee-content span {
  display: inline-block;
  padding: 0 15px;
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--spotify-black);
}

@keyframes marquee {
  0% { transform: translate(0, 0); }
  100% { transform: translate(-50%, 0); }
}

.footer {
  padding: 60px 30px;
  background-color: #000;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.footer-logo {
  font-size: 1.5rem;
  font-weight: 900;
  letter-spacing: 1px;
}

.footer-info {
  font-size: 0.8rem;
  color: #666;
}

@media (max-width: 768px) {
  .nav-strip {
    padding: 10px 15px;
  }
  
  .logo-strip {
    font-size: 10px;
  }
  
  .main-title {
    font-size: clamp(2rem, 8vw, 4rem);
  }
  
  .manifesto-title {
    font-size: clamp(1rem, 3vw, 2rem);
    padding: 0 15px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    padding: 40px 20px;
    gap: 30px;
  }
  
  .cta-box {
    padding: 30px 15px;
  }
  
  .cta-tagline {
    font-size: clamp(1.2rem, 4vw, 2rem);
  }
  
  .cta-buttons {
    flex-direction: column;
    width: 100%;
  }
  
  .login-button, .signup-button {
    width: 100%;
  }
  
  .footer-content {
    flex-direction: column;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 0 10px;
  }
  
  .graffiti-tag {
    font-size: 0.9rem;
    letter-spacing: 3px;
  }
  
  .steroids-tag {
    font-size: 0.9rem;
    letter-spacing: 2px;
  }
  
  .manifesto-section {
    padding: 60px 15px;
  }
  
  .feature-item {
    padding: 30px 15px;
  }
  
  .cta-section {
    padding: 60px 15px;
  }
  
  .scroll-indicator {
    bottom: 20px;
  }
}
</style>