import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.aleja.pe",
  appName: "Portal Alejandria",
  webDir: "out",
  server: {
    androidScheme: "http",
    cleartext: true,
  },
  android: {
    webContentsDebuggingEnabled: true,
    allowMixedContent: true,
  },
};

export default config;
