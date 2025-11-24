"use client";

import { useEffect, useState } from "react";
import Splash from "@/components/splash";
import LoginPage from "@/components/auth/login-form";
import { Preferences } from "@capacitor/preferences";

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const init = async () => {
      // Revisar si ya vio el Splash antes
      const { value } = await Preferences.get({ key: "hasSeenSplash" });

      if (value === "true") {
        // Ya vio el splash → Ir directo al login
        setShowLogin(true);
        return;
      }

      // Primera vez → mostrar splash y luego login
      const timer = setTimeout(async () => {
        setShowLogin(true);

        // Guardar bandera para NO volver a mostrar Splash
        await Preferences.set({
          key: "hasSeenSplash",
          value: "true",
        });
      }, 3000);

      return () => clearTimeout(timer);
    };

    init();
  }, []);

  return <>{!showLogin ? <Splash /> : <LoginPage />}</>;
}
