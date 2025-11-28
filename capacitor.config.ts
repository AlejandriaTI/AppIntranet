import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.aleja.pe",
  appName: "Portal Alejandria",
  webDir: "out",

  server: {
    androidScheme: "http",
    allowNavigation: ["*"],
    cleartext: true,
    hostname: "localhost",
  },

  android: {
    webContentsDebuggingEnabled: true,
    allowMixedContent: true,
  },

  plugins: {
    StatusBar: {
      style: "DARK",
      overlaysWebView: true,
    },

    SplashScreen: {
      launchShowDuration: 0,
      autoHide: false,
      showSpinner: false,
      splashImmersive: false,
    },
  },
};

export default config;
