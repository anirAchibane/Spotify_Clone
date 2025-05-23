import { defineEventHandler } from 'h3';
import { useRuntimeConfig } from "#imports";

export default defineEventHandler(async (event) => {
  const { code } = await readBody(event);

  if (!code) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Code is required',
    });
  }

  const config = useRuntimeConfig();
  const clientId = config.public.spotifyClientId;
  const clientSecret = config.public.spotifyClientSecret;
  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', config.public.spotifyRedirectUri);

  const credentials = btoa(`${clientId}:${clientSecret}`);

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${credentials}`,
    },
    body: params,
  });

  if (!response.ok) {
    throw createError({
      statusCode: response.status,
      statusMessage: 'Failed to fetch token from Spotify',
    });
  }

  const data = await response.json();
  return data;
});