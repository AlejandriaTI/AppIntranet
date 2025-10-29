import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.aleja.pe",
  appName: "intranet-movil",
  webDir: "out",
  server: {
    url: "http://192.168.1.39:3000", // ⚠️ tu servidor local
    cleartext: true, // ⚠️ habilita HTTP plano (sin HTTPS)
  },
};

export default config;
