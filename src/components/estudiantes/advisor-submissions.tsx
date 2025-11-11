"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";

interface EnvioAsesor {
  id_asunto: string;
  estado: "terminado" | "pendiente" | "en-revision";
  asunto: {
    cliente: string;
    asesor: string;
  };
  fecha: string;
  nombreDoc1?: string;
  ruta1?: string;
  nombreDoc2?: string;
  ruta2?: string;
}

interface AdvisorSubmissionsProps {
  isLoading: boolean;
  selectedAsesoriaId: number | null;
}

export function AdvisorSubmissions({
  isLoading,
  selectedAsesoriaId,
}: AdvisorSubmissionsProps) {
  const [misEnvios, setMisEnvios] = useState<EnvioAsesor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnvios = async () => {
      if (!selectedAsesoriaId) {
        setMisEnvios([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/documentos/asesor/list/${selectedAsesoriaId}`
        );
        setMisEnvios(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("❌ Error al obtener los envíos del asesor:", error);
        setMisEnvios([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEnvios();
  }, [selectedAsesoriaId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "terminado":
        return "bg-primary text-primary-foreground";
      case "pendiente":
        return "bg-yellow-100 text-yellow-800";
      case "en-revision":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (isoDate: string) => {
    const fecha = new Date(isoDate);
    return fecha.toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleDownloadBoth = (ruta1?: string, ruta2?: string) => {
    if (ruta1) window.open(ruta1, "_blank");
    if (ruta2) window.open(ruta2, "_blank");
  };

  // 🧱 Estado de carga visual
  if (isLoading || loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Envíos del Asesor</h2>
        <Card className="p-6">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-md" />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Envíos del Asesor</h2>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted border-b">
              <tr>
                <th className="text-left p-4 font-semibold">Asesor</th>
                <th className="text-left p-4 font-semibold">Estado</th>
                <th className="text-left p-4 font-semibold">Fecha</th>
                <th className="text-left p-4 font-semibold">Archivos</th>
                <th className="text-center p-4 font-semibold">Descargar</th>
              </tr>
            </thead>
            <tbody>
              {misEnvios.length > 0 ? (
                misEnvios.map((item, index) => (
                  <tr
                    key={item.id_asunto || index}
                    className="border-b hover:bg-muted/50 transition-colors"
                  >
                    <td className="p-4 font-medium">
                      {item.asunto?.asesor || "Sin nombre"}
                    </td>

                    <td className="p-4">
                      <Badge className={getStatusColor(item.estado)}>
                        {item.estado}
                      </Badge>
                    </td>

                    <td className="p-4 text-muted-foreground">
                      {formatDate(item.fecha)}
                    </td>

                    <td className="p-4 text-muted-foreground">
                      <ul className="space-y-1">
                        {item.nombreDoc1 && <li>{item.nombreDoc1}</li>}
                        {item.nombreDoc2 && <li>{item.nombreDoc2}</li>}
                      </ul>
                    </td>

                    <td className="p-4 text-center">
                      {(item.ruta1 || item.ruta2) ? (
                        <button
                          onClick={() =>
                            handleDownloadBoth(item.ruta1, item.ruta2)
                          }
                          className="inline-flex items-center justify-center hover:bg-muted rounded p-2 transition-colors"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          No disponible
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="p-6 text-center text-muted-foreground"
                  >
                    No hay envíos registrados por el asesor.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
