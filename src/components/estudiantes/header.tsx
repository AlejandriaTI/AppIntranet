import { Skeleton } from "@/components/ui/skeleton";
import { loginSuccess } from "@/store/auth/authSlice";
import { RootState } from "@/store/store";
import Image from "next/image";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

interface HeaderProps {
  isLoading: boolean;
}

export function Header({ isLoading }: HeaderProps) {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // ✅ Verifica si hay usuario guardado en localStorage y lo restaura
    if (!user) {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("authToken");

      if (storedUser && token) {
        dispatch(
          loginSuccess({
            datos_usuario: JSON.parse(storedUser),
            access_token: token,
          })
        );
      }
    }
    setLoading(false);
  }, [dispatch, user]);

  // ⏳ Estado de carga visual
  if (isLoading || loading) {
    return (
      <div className="bg-primary text-primary-foreground rounded-lg m-4 overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-6 p-6 md:p-8">
          <div className="flex-1 space-y-4">
            <Skeleton className="h-4 w-32 bg-primary-foreground/20" />
            <Skeleton className="h-10 w-full max-w-md bg-primary-foreground/20" />
            <Skeleton className="h-4 w-full max-w-lg bg-primary-foreground/20" />
          </div>
          <Skeleton className="w-full md:w-64 h-40 rounded-lg bg-primary-foreground/20 shrink-0" />
        </div>
      </div>
    );
  }

  // 🧠 Obtener nombre del usuario (si existe)
  const nombreUsuario = user?.nombre || "Usuario";

  // 🗓️ Fecha formateada
  const fechaActual = new Date().toLocaleDateString("es-PE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-primary text-primary-foreground rounded-lg m-4 overflow-hidden">
      <div className="flex flex-col md:flex-row items-center gap-6 p-6 md:p-8">
        <div className="flex-1">
          <p className="text-sm opacity-90 mb-2">{fechaActual}</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-balance">
            Bienvenido {nombreUsuario} al Intranet de asesoría de tesis
          </h1>
          <p className="text-sm md:text-base opacity-90">
            Aquí encontrarás toda la información para tu asesoría de tesis.
          </p>
        </div>

        <div className="w-full md:w-64 h-40 rounded-lg bg-primary-foreground/10 shrink-0 overflow-hidden">
          <Image
            src="/graduation-ceremony-students.jpg"
            alt="Graduación"
            className="w-full h-full object-cover"
            width={256}
            height={160}
            priority
          />
        </div>
      </div>
    </div>
  );
}
