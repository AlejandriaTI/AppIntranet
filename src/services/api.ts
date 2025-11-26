import axios, { InternalAxiosRequestConfig, AxiosError } from "axios";
import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";

const platform = Capacitor.getPlatform();
const isNative = platform === "android" || platform === "ios";

const MOBILE_API = process.env.NEXT_PUBLIC_MOBILE_API_URL;
const WEB_API = process.env.NEXT_PUBLIC_WEB_API_URL;
const BASE_API = process.env.NEXT_PUBLIC_API_BASE_URL;

const LOCAL_FALLBACK = "https://api.alejandriaconsultora.com";

const baseURL = (isNative ? MOBILE_API : WEB_API || BASE_API) || LOCAL_FALLBACK;

console.log("📱 Plataforma:", platform);
console.log("🔧 API Base URL:", baseURL);

const api = axios.create({
  baseURL,
  withCredentials: false,
});

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  try {
    const { value } = await Preferences.get({ key: "authToken" });
    if (value) {
      config.headers.Authorization = `Bearer ${value}`;
    }
  } catch (error) {
    console.error("Error getting token from preferences", error);
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status === 401 &&
      !originalRequest.url?.includes("/auth/login")
    ) {
      console.warn(
        "⚠️ Token expirado, limpiando sesión y redirigiendo al login"
      );

      await Preferences.remove({ key: "authToken" });
      await Preferences.remove({ key: "tokenExpiry" });
      await Preferences.remove({ key: "user" });

      // Redirigir al login
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }

      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;
