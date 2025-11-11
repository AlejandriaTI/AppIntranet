"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useAsesorias } from "@/hooks/useAsesoria";

interface MeetingsProps {
  isLoading: boolean;
  selectedAsesoriaId: number | null;
  setSelectedAsesoriaId: (id: number | null) => void;
}

interface Reunion {
  titulo: string;
  fecha_reunion: string;
  enlace_zoom: string;
  zoom_password: string;
  meetingId: string;
}

export function Meetings({
  isLoading,
  selectedAsesoriaId,
  setSelectedAsesoriaId,
}: MeetingsProps) {
  const user = useSelector((state: RootState) => state.auth.user);
  const idCliente = user?.id_cliente;

  // 🔹 Hook de asesorías (solo para listar las opciones)
  const { asesorias, loading: loadingAsesorias } = useAsesorias(idCliente);

  const [proximasReuniones, setProximasReuniones] = useState<Reunion[]>([]);
  const [loadingReuniones, setLoadingReuniones] = useState(false);

  // 🔹 Obtener reuniones cuando cambia la asesoría seleccionada
  useEffect(() => {
    const fetchReuniones = async () => {
      if (!selectedAsesoriaId) {
        console.warn("⚠️ Cliente sin asesoría. No hay reuniones que mostrar.");
        setProximasReuniones([]);
        return;
      }

      try {
        setLoadingReuniones(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/reuniones/espera/${selectedAsesoriaId}`
        );
        const data = await res.json();
        const reuniones = Array.isArray(data) ? data : data?.reuniones || [];
        setProximasReuniones(reuniones);
      } catch (error) {
        console.error("❌ Error al obtener reuniones próximas:", error);
        setProximasReuniones([]);
      } finally {
        setLoadingReuniones(false);
      }
    };

    fetchReuniones();
  }, [selectedAsesoriaId]);
  // 🔹 Seleccionar automáticamente la primera asesoría al cargar
  useEffect(() => {
    if (asesorias.length > 0 && !selectedAsesoriaId) {
      setSelectedAsesoriaId(asesorias[0].id);
    }
  }, [asesorias, selectedAsesoriaId, setSelectedAsesoriaId]);

  // 🔄 Estado de carga
  if (isLoading || loadingAsesorias || loadingReuniones) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Reuniones</h2>
        <Skeleton className="h-10 w-full rounded-md" />
        <Card className="p-6 space-y-4">
          <Skeleton className="h-20 w-full rounded-md" />
          <Skeleton className="h-10 w-24 rounded-md" />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Reuniones</h2>

      {/* 🔸 Selector de asesorías */}
      {/* 🔸 Selector de asesorías */}
      <Select
        value={selectedAsesoriaId ? String(selectedAsesoriaId) : ""}
        onValueChange={(value) => setSelectedAsesoriaId(Number(value))}
      >
        <SelectTrigger
          id="asesoria"
          className="bg-white dark:bg-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700"
        >
          <SelectValue placeholder="Selecciona una asesoría" />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          {asesorias.length > 0 ? (
            asesorias.map((asesoria) => (
              <SelectItem key={asesoria.id} value={asesoria.id.toString()}>
                {asesoria.profesion}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="none" disabled>
              No hay asesorías disponibles
            </SelectItem>
          )}
        </SelectContent>
      </Select>

      {/* 🔸 Lista de reuniones */}
      {proximasReuniones.length > 0 ? (
        proximasReuniones.map((reunion) => {
          const fecha = new Date(reunion.fecha_reunion);
          const mes = fecha
            .toLocaleString("es-ES", { month: "short" })
            .toUpperCase();
          const dia = fecha.getDate();

          return (
            <Card
              key={reunion.meetingId}
              className="p-6 space-y-4 border border-border/40 hover:shadow-md transition-all"
            >
              <div className="flex gap-4 items-center">
                <div className="bg-primary text-primary-foreground rounded-lg p-4 text-center min-w-fit">
                  <p className="text-xs opacity-75">{mes}</p>
                  <p className="text-3xl font-bold">{dia}</p>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{reunion.titulo}</h3>
                  <p className="text-sm text-muted-foreground">
                    Código: {reunion.meetingId}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Contraseña: {reunion.zoom_password}
                  </p>
                </div>
              </div>

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => window.open(reunion.enlace_zoom, "_blank")}
              >
                Ingresar a Zoom
              </Button>
            </Card>
          );
        })
      ) : (
        <Card className="p-6 text-center text-sm text-muted-foreground">
          No hay reuniones próximas registradas.
        </Card>
      )}
    </div>
  );
}
