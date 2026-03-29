const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

export const setAuthToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
};

export const removeAuthToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
};

export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});
  
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
  }
  
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let data;
  try {
    data = await response.json();
  } catch (e) {
    data = null;
  }

  if (response.status === 401) {
    removeAuthToken();
    if (typeof window !== "undefined" && window.location.pathname !== "/login" && window.location.pathname !== "/register") {
      window.location.href = "/login";
    }
  }

  if (!response.ok) {
    throw new Error(data?.detail || "Системд алдаа гарлаа!");
  }

  return data;
};
