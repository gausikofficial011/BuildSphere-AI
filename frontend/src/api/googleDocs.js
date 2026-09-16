import { apiClient } from './client';

export const GOOGLE_CONFIG = {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || "806968895262-na7dlvecdr2cbbokokqjulf8bfvhtts7.apps.googleusercontent.com",
  redirectUri: import.meta.env.VITE_GOOGLE_REDIRECT_URI || "http://localhost:3001/auth/google/callback",
  scopes: import.meta.env.VITE_GOOGLE_DOCS_SCOPES || "https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/drive.readonly"
};

/**
 * Initiates the Google OAuth consent redirect to connect a Google Docs account.
 */
export async function connectGoogleDocsAccount() {
  try {
    const response = await apiClient.get('/api/google-docs/auth-url');
    if (response.data && response.data.auth_url) {
      window.location.href = response.data.auth_url;
    } else {
      // Fallback manual URL construction using verified credentials
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CONFIG.clientId}&redirect_uri=${GOOGLE_CONFIG.redirectUri}&response_type=code&scope=${encodeURIComponent(GOOGLE_CONFIG.scopes)}&access_type=offline&prompt=consent`;
      window.location.href = authUrl;
    }
  } catch (error) {
    console.error("Failed to generate OAuth URL, redirecting directly via config:", error);
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CONFIG.clientId}&redirect_uri=${GOOGLE_CONFIG.redirectUri}&response_type=code&scope=${encodeURIComponent(GOOGLE_CONFIG.scopes)}&access_type=offline&prompt=consent`;
    window.location.href = authUrl;
  }
}

/**
 * Fetches the list of Google Documents available in the connected account / project.
 */
export async function fetchBuildSphereGoogleDocs() {
  const response = await apiClient.get('/api/google-docs/list');
  return response.data.documents || [];
}

/**
 * Reads full plaintext contents and AI extracted insights from a specific Google Doc.
 */
export async function readGoogleDocContent(docId) {
  const response = await apiClient.get(`/api/google-docs/${docId}/read`);
  return response.data;
}

/**
 * Creates a new Google Document with initial specifications or report text.
 */
export async function createGoogleDoc({ title, content = "", project_id = "", category = "Technical Specification" }) {
  const response = await apiClient.post('/api/google-docs/create', {
    title,
    content,
    project_id,
    category
  });
  return response.data;
}

/**
 * Appends inspection logs, meeting summaries, or AI Copilot notes to an existing Google Doc.
 */
export async function appendToGoogleDoc(docId, text_to_append, section_title = "AI Copilot Analysis") {
  const response = await apiClient.post(`/api/google-docs/${docId}/append`, {
    text_to_append,
    section_title
  });
  return response.data;
}
