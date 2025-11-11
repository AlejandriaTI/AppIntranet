"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

/* ------------------------------
 ✅ TIPO CORRECTO DEL PERFIL
--------------------------------*/
type Perfil = {
  nombre: string;
  apellido: string;
  email: string;
  carrera: string;
  universidad: string;
  gradoAcademico?: {
    nombre: string;
  };
  pais: string;
};

export default function MiPerfil() {
  const [perfilData, setPerfilData] = useState<Perfil | null>(null);

  const user = useSelector((state: RootState) => state.auth.user);
  const idCliente = user?.id_cliente;

  /* ------------------------------
     ✅ useEffect CORREGIDO
  --------------------------------*/
  useEffect(() => {
    if (!idCliente) return;

    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cliente/${idCliente}`)
      .then((response) => setPerfilData(response.data))
      .catch((error) =>
        console.error("Error al obtener datos del perfil:", error)
      );
  }, [idCliente]);

  /* ------------------------------
     ✅ Loading state
  --------------------------------*/
  if (!perfilData) {
    return (
      <Card className="w-full max-w-3xl mx-auto mt-10 p-6">
        <CardContent>Cargando perfil...</CardContent>
      </Card>
    );
  }

  /* ------------------------------
     ✅ Iniciales tipadas
  --------------------------------*/
  const iniciales =
    perfilData.nombre
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";

  /* ------------------------------
     ✅ UI shadcn limpia
  --------------------------------*/
  return (
    <Card className="w-full max-w-3xl mx-auto mt-10">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-14 w-14 rounded-md">
          <AvatarFallback className="bg-black text-white font-bold rounded-md">
            {iniciales}
          </AvatarFallback>
        </Avatar>

        <div>
          <CardTitle className="text-xl">
            {perfilData.nombre} {perfilData.apellido}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{perfilData.email}</p>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="grid gap-6 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Nombres" value={perfilData.nombre} />
          <Field label="Apellidos" value={perfilData.apellido} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Carrera" value={perfilData.carrera} />
          <Field label="Tipo de trabajo" value="Suficiencia profesional" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Universidad" value={perfilData.universidad} />
          <Field
            label="Nivel educativo"
            value={perfilData.gradoAcademico?.nombre ?? ""}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
          <Field label="Correo" value={perfilData.email} />
          <Field label="País" value={perfilData.pais} />
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------
 ✅ COMPONENTE FIELD REUTILIZABLE
--------------------------------*/
function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm font-medium">{label}</p>
      <div className="rounded-md border bg-muted p-3 text-sm text-muted-foreground">
        {value || "—"}
      </div>
    </div>
  );
}
