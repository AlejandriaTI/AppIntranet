import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ Export estático para Capacitor
  output: "export",

  // ✅ IMPORTANTÍSIMO para Android
  images: {
    unoptimized: true,
  },

  reactStrictMode: false, // ⚠️ En móviles esto causa warnings molestos

  // ✅ Mantiene las rutas correctas dentro de Android
  trailingSlash: true,

  // ✅ Permitir acceso desde IP local durante desarrollo
  // (esto NO lo usa Next de forma nativa, así que no afecta nada)
  // Si querés usarlo realmente hay que hacer un middleware.
};

export default nextConfig;
