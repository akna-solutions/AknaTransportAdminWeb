// API Base URLs
export const API_URLS = {
  IDENTITY: "https://localhost:5000",
  LOAD: "https://localhost:5001",
};

// Get auth token from localStorage
export const getAuthToken = () => {
  return localStorage.getItem("accessToken");
};

// Create headers with authorization
export const getHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// API Error Handler
export const handleApiError = (error) => {
  console.error("API Error:", error);
  if (error.message.includes("401")) {
    // Token expired, redirect to login
    localStorage.clear();
    window.location.href = "/login";
  }
  throw error;
};
