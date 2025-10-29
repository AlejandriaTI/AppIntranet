import axios, { InternalAxiosRequestConfig } from "axios";
import { Capacitor } from "@capacitor/core";

const isNativeMobile =
  Capacitor.getPlatform() === "android" || Capacitor.getPlatform() === "ios";

// IP de tu backend local
const LOCAL_API = "http://192.168.1.39:3001";
const PROD_API = process.env.NEXT_PUBLIC_API_BASE_URL ?? LOCAL_API;

const api = axios.create({
  baseURL: isNativeMobile ? LOCAL_API : PROD_API,
  withCredentials: true, // solo si tu backend usa cookies
});

// Interceptor: agregar token si está en localStorage
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
