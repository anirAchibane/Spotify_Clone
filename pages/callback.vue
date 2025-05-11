<template>
  <div>
    <p>Logging in...</p>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { onMounted } from "vue";

const router = useRouter();

onMounted(async () => {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  if (!code) {
    console.error("Code d'autorisation manquant dans l'URL.");
    return;
  }

  try {
    const response = await fetch("/api/spotify/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Échec de la récupération du token : ${error}`);
    }    const tokenData = await response.json();
    console.log("Token data received:", Object.keys(tokenData));
    
    const { access_token, expires_in, refresh_token } = tokenData;
    
    // Store expiration time if provided
    if (expires_in) {
      const expiresAt = Date.now() + (expires_in * 1000);
      localStorage.setItem("token_expires_at", expiresAt.toString());
      console.log("Token expires at:", new Date(expiresAt).toLocaleString());
    }
    
    // Store refresh token if available
    if (refresh_token) {
      localStorage.setItem("refresh_token", refresh_token);
    }

    const profileResponse = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!profileResponse.ok) {
      const error = await profileResponse.text();
      throw new Error(`Échec de la récupération du profil : ${error}`);
    }

    const profile = await profileResponse.json();

    // Stocker les données du profil dans le stockage local
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("spotify_profile", JSON.stringify(profile));

    // Nettoyer l'URL pour supprimer le code
    window.history.replaceState({}, document.title, "/homepage");

    // Rediriger vers la page d'accueil
    console.log("Redirecting to /Home");
    router.push("/homepage");
  } catch (error) {
    console.error("Une erreur s'est produite :", error);
    //window.location.href = "/";
  }
});
</script>
