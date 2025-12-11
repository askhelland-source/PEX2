// Fetch.js - Centralized API Utility

const BASE_URL = "http://localhost:3002/api/v1/tickets";

// --- CORE CRUD OPERATIONS ---

/**
 * Handles all GET requests (Read/Search).
 * @param {string} path - The specific endpoint path (e.g., /123 or ?query=term)
 */
export async function apiGet(path = "") {
  const url = `${BASE_URL}${path}`;
  const response = await fetch(url);

  if (!response.ok) {
    // Throw error with status and message
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(`Failed to fetch: ${response.statusText} (${response.status}). ${errorBody.message || ''}`);
  }
  
  return response.json();
}

/**
 * Handles all non-GET requests (Create, Update, Delete).
 * @param {string} method - HTTP method ('POST', 'PUT', 'DELETE')
 * @param {string} path - The specific endpoint path (e.g., /123)
 * @param {object} data - The data payload for POST/PUT requests
 */
export async function apiSend(method, path, data = null) {
  const url = `${BASE_URL}${path}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(`Operation failed: ${response.statusText} (${response.status}). ${errorBody.message || ''}`);
  }



  
  // DELETE requests might return a 204 No Content, so we check first
  return response.status !== 204 ? response.json() : {};
}