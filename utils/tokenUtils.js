/**
 * Check if the stored access token is valid (exists and not expired)
 * @returns {boolean} True if token is valid
 */
export function isTokenValid() {
  const token = localStorage.getItem('access_token');
  if (!token) return false;
  
  const expiresAt = localStorage.getItem('token_expires_at');
  if (!expiresAt) return true; // If no expiration stored, assume token is valid
  
  // Check if token has expired
  return Date.now() < parseInt(expiresAt);
}

/**
 * Validate token and redirect to login if invalid
 * @returns {boolean} True if token is valid, false if redirected
 */
export function validateTokenOrRedirect() {
  if (!isTokenValid()) {
    // Clear any existing tokens
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_expires_at');
    
    // Redirect to login page
    window.location.href = '/';
    return false;
  }
  return true;
}