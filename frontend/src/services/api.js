import axios from "axios";
import API_BASE from "../api/base";
import { notify } from "../utils/toast";

const api = axios.create({
  baseURL: API_BASE,
});

const AUTH_ENDPOINTS = ["/users/login/", "/users/register/", "/users/token/refresh/"];

const isAuthEndpoint = (url = "") =>
  AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));

const clearSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh");
};

const getErrorMessage = (error) => {
  if (!error.response) {
    return error.request
      ? "Network error. Server not reachable."
      : "Something went wrong";
  }

  const data = error.response.data;

  if (data?.detail) return data.detail;
  if (data?.error) return data.error;
  if (Array.isArray(data)) return data.join(" ");
  if (typeof data === "object" && data !== null) {
    return Object.values(data).flat().join(" ");
  }

  return typeof data === "string" ? data : "Something went wrong";
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const shouldSkipToast = Boolean(originalRequest?.skipToast);

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      localStorage.getItem("refresh") &&
      !isAuthEndpoint(originalRequest.url)
    ) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem("refresh");
        const res = await axios.post(`${API_BASE}users/token/refresh/`, {
          refresh,
        });

        localStorage.setItem("token", res.data.access);
        if (res.data.refresh) {
          localStorage.setItem("refresh", res.data.refresh);
        }

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;

        return api(originalRequest);
      } catch {
        clearSession();
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    if (shouldSkipToast) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !isAuthEndpoint(originalRequest?.url)) {
      clearSession();

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    notify.error(getErrorMessage(error));

    return Promise.reject(error);
  }
);

export default api;
