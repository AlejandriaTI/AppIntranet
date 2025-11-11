"use client"; // Asegúrate de que este componente se ejecute solo en el cliente

import { useEffect, useState } from "react";
import Splash from "@/components/splash"; // Importa tu Splash Screen
import LoginPage from "@/components/auth/login-form"; // Importa la página de login

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    // Mostrar Splash durante 3 segundos
    const timer = setTimeout(() => {
      setShowLogin(true); // Después de 3 segundos, mostramos el Login
    }, 3000); // Ajusta este tiempo a tu gusto

    return () => clearTimeout(timer); // Limpiar el temporizador cuando se desmonta el componente
  }, []);

  return (
    <>
      {!showLogin ? (
        <Splash /> // Mostrar Splash Screen mientras se espera
      ) : (
        <LoginPage /> // Mostrar Login después de 3 segundos
      )}
    </>
  );
}
