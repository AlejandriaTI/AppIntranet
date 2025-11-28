"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { UserCircle } from "lucide-react";
import { useAsesorias } from "@/hooks/useAsesoria";

interface Asesor {
  nombre: string;
  apellido: string;
}

interface AsesorImagen {
  nombre: string;
  imagen: string;
}

export default function MiAsesor() {
  const [asesor, setAsesor] = useState<Asesor | null>(null);

  const user = useSelector((state: RootState) => state.auth.user);
  const idCliente = user?.id_cliente;

  // ✅ Hook que trae asesorías del cliente
  const { asesorias, loading, selectedAsesoriaId, setSelectedAsesoriaId } =
    useAsesorias(idCliente);

  // ✅ Lista de imágenes en /public
  const asesorImagenes: AsesorImagen[] = [
    { nombre: "Diana Alexandra", imagen: "/Perfil-asesores/Diana.png" },
    { nombre: "Victor Alfonso", imagen: "/Perfil-asesores/Victor.png" },
    { nombre: "Hebert Wilder", imagen: "/Perfil-asesores/Heber.jpeg" },
    { nombre: "Christian Alexis", imagen: "/Perfil-asesores/Christian.jpeg" },
    { nombre: "Anthony", imagen: "/Perfil-asesores/Antony.png" },
    { nombre: "Brenda Lucia", imagen: "/Perfil-asesores/Brenda.jpg" },
    { nombre: "Olenka Ethel", imagen: "/Perfil-asesores/Olenka.jpg" },
    {
      nombre: "Daniel Emmerson",
      imagen: "/Perfil-asesores/DanielDominguez.png",
    },
    { nombre: "Haider Dante", imagen: "/Perfil-asesores/Haider.png" },
    { nombre: "Lidia Balbina", imagen: "/Perfil-asesores/Lidia.png" },
  ];

  const getImagenAsesor = (nombre?: string): string | null => {
    if (!nombre) return null;

    const encontrado = asesorImagenes.find((a) =>
      nombre.toLowerCase().includes(a.nombre.toLowerCase())
    );

    return encontrado ? encontrado.imagen : null;
  };

  // ✅ Función para obtener el asesor real
  const obtenerDatosAsesor = (asesoriaId: number) => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/cliente/asesor/${asesoriaId}`
    )
      .then((res) => res.json())
      .then((data: Asesor) => setAsesor(data))
      .catch((err) => console.error("Error al obtener asesor:", err));
  };

  // ✅ Cada vez que cambia la asesoría seleccionada → buscar asesor
  useEffect(() => {
    if (selectedAsesoriaId) {
      obtenerDatosAsesor(Number(selectedAsesoriaId));
    }
  }, [selectedAsesoriaId]);

  return (
    <Card className="w-full max-w-xl mx-auto mt-10">
      <CardHeader>
        <h2 className="text-xl font-semibold">Mi asesor</h2>
      </CardHeader>

      <Separator />

      <CardContent className="pt-6 flex flex-col gap-8 items-center">
        {/* ✅ Select */}
        <div className="w-full">
          <Select
            value={selectedAsesoriaId ? String(selectedAsesoriaId) : ""}
            onValueChange={(value) => setSelectedAsesoriaId(Number(value))}
          >
            <SelectTrigger className="bg-white border-gray-300">
              <SelectValue placeholder="Selecciona una asesoría" />
            </SelectTrigger>
            <SelectContent>
              {asesorias.map((a) => (
                <SelectItem key={a.id} value={String(a.id)}>
                  {a.profesion}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* ✅ Avatar del asesor */}
        <Avatar className="h-40 w-40">
          {getImagenAsesor(asesor?.nombre) ? (
            <AvatarImage src={getImagenAsesor(asesor?.nombre)!} />
          ) : (
            <UserCircle className="h-24 w-24 text-gray-400" />
          )}

          <AvatarFallback className="bg-black text-white font-bold">
            {asesor?.nombre?.charAt(0) ?? "A"}
          </AvatarFallback>
        </Avatar>

        {/* ✅ Datos del asesor */}
        {asesor ? (
          <div className="text-center">
            <h1 className="text-lg font-semibold">
              {asesor.nombre} {asesor.apellido}
            </h1>
          </div>
        ) : (
          <p className="text-muted-foreground">
            No hay asesor asignado a esta asesoría.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
