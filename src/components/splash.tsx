"use client"; // Asegurarse de que este componente se ejecute solo en el cliente

import { useEffect, useState } from "react";
import { motion } from "framer-motion"; // Importamos framer motion

const Splash = () => {
  const [isClient, setIsClient] = useState(false); // Estado para verificar si estamos en el cliente

  useEffect(() => {
    // Usamos setTimeout para diferir la actualización del estado
    const timer = setTimeout(() => {
      setIsClient(true); // Esto ocurre solo en el cliente
    }, 0); // Esto asegura que se ejecute en el siguiente ciclo de renderizado

    return () => clearTimeout(timer); // Limpiar el temporizador
  }, []); // Solo se ejecuta una vez, al montar el componente

  if (!isClient) {
    return null; // No renderiza nada en el servidor
  }

  return (
    <div className="flex justify-center items-center h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      {" "}
      {/* Fondo degradado */}
      {/* Usamos motion.div para la animación */}
      <motion.img
        src="/logo/alejandria_logo.png" // Asegúrate de tener el logo en la carpeta public
        alt="Logo"
        className="w-72" // Tamaño aumentado del logo (ajustado a 72)
        initial={{ opacity: 0, scale: 0.5 }} // Estado inicial
        animate={{ opacity: 1, scale: 1 }} // Estado final
        transition={{ duration: 1.5 }} // Tiempo de la animación
      />
    </div>
  );
};

export default Splash;
