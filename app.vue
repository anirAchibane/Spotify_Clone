<template>
    <NuxtPage />
</template>

<style>
* {
    font-family: 'Spotify Mix';
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    background-color: #121212;
    color: #ffffff;
    min-height: 100vh;
    overflow-x: hidden;
}

::-webkit-scrollbar {
    width: 12px;
}

::-webkit-scrollbar-track {
    background: #121212;
}

::-webkit-scrollbar-thumb {
    background: #535353;
    border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
    background: #7d7d7d;
}

/* Spotify-like button styles */
button {
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
}

/* Link styles */
a {
    color: inherit;
    text-decoration: none;
    transition: all 0.2s ease;
}

a:hover {
    color: #1DB954;
}

/* Gradient background for some components */
.gradient-background {
    background: linear-gradient(180deg, #3b3b3b 0%, #121212 100%);
}
</style>