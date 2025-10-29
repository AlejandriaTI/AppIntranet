"use client";

import { useState, useEffect } from "react";

interface RawAsesoria {
  id: number;
  profesion_asesoria: string;
}

interface Asesoria {
  id: number;
  profesion: string;
}

export function useAsesorias(idCliente?: number | null) {
  const [asesorias, setAsesorias] = useState<Asesoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAsesoriaId, setSelectedAsesoriaId] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (!idCliente) return;

    const fetchAsesorias = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/cliente/miAsesoramiento/${idCliente}`
        );
        if (!res.ok) throw new Error("Error al obtener asesorías");

        const data: Record<string, RawAsesoria> = await res.json();

        const asesoriasArray: Asesoria[] = Object.values(data).map((item) => ({
          id: item.id,
          profesion: item.profesion_asesoria,
        }));

        setAsesorias(asesoriasArray);
        if (asesoriasArray.length > 0)
          setSelectedAsesoriaId(asesoriasArray[0].id);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Ocurrió un error desconocido");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAsesorias();
  }, [idCliente]);

  return {
    asesorias,
    loading,
    error,
    selectedAsesoriaId,
    setSelectedAsesoriaId,
  };
}
