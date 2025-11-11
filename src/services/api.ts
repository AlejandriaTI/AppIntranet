import axios, { InternalAxiosRequestConfig } from "axios";
import { Capacitor } from "@capacitor/core";

// 🔍 Detecta plataforma (web / android / ios)
const platform = Capacitor.getPlatform();
const isNative = platform === "android" || platform === "ios";

// ✅ Lee URLs desde .env (si existen)
const MOBILE_API = process.env.NEXT_PUBLIC_MOBILE_API_URL; // Ej: http://192.168.1.42:3001
const WEB_API = process.env.NEXT_PUBLIC_WEB_API_URL; // Ej: http://localhost:3001
const BASE_API = process.env.NEXT_PUBLIC_API_BASE_URL; // fallback general

// ✅ Fallback manual (por si .env no se inyecta en móvil)
const LOCAL_FALLBACK = "http://192.168.1.46:3001";

// 🧩 Selección de URL según entorno
const baseURL = (isNative ? MOBILE_API : WEB_API || BASE_API) || LOCAL_FALLBACK;

console.log("📱 Plataforma:", platform);
console.log("🔧 API Base URL:", baseURL);

const api = axios.create({
  baseURL,
  withCredentials: false, // JWT → no usar cookies
});

// 🧠 Interceptor: adjunta token JWT si existe
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
