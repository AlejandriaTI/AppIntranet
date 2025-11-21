"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";

import { Capacitor } from "@capacitor/core";
import { Browser } from "@capacitor/browser";
interface EnvioBack {
  id_asunto: string;
  estado: "terminado" | "pendiente" | "en-revision";
  asunto: { cliente: string; asesor: string };
  fecha: string;

  [key: string]: unknown; // para nombreDocX, rutaX
}

interface ArchivoAdjunto {
  nombre: string;
  ruta: string;
}
interface EnvioAsesor {
  id_asunto: string;
  estado: "terminado" | "pendiente" | "en-revision";
  asunto: {
    cliente: string;
    asesor: string;
  };
  fecha: string;

  archivos: ArchivoAdjunto[]; // 👈 NECESARIA PARA QUE TS NO SE QUEJE
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

        const data = Array.isArray(response.data) ? response.data : [];

        const parsed = data.map((item: EnvioBack) => {
          const archivos: { nombre: string; ruta: string }[] = [];

          for (let i = 1; i <= 5; i++) {
            const nombre = item[`nombreDoc${i}`] as string | undefined;
            const ruta = item[`ruta${i}`] as string | undefined;

            if (nombre && ruta) {
              archivos.push({ nombre, ruta });
            }
          }

          return {
            ...item,
            archivos,
          };
        });

        setMisEnvios(parsed);
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

  const handleDownloadFile = async (url: string) => {
    if (!url) return;

    const isApp = Capacitor.getPlatform() !== "web";

    if (isApp) {
      try {
        await Browser.open({ url });
        console.log("🌐 Archivo abierto en navegador para descarga");
        return;
      } catch (e) {
        console.error("❌ Error abriendo navegador:", e);
        alert("No se pudo abrir el archivo.");
      }
    }

    // 🖥️ WEB
    const a = document.createElement("a");
    a.href = url;
    a.download = url.split("/").pop() || "archivo";
    a.click();
  };

  // 🧱 Skeleton de carga
  if (isLoading || loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Envío del asesor</h2>
        <Card className="p-6 space-y-4">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-10 w-full" />
        </Card>
      </div>
    );
  }

  // 📌 Seleccionar solo el más reciente
  const envioReciente = misEnvios.length
    ? [...misEnvios].sort(
        (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      )[0]
    : null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Envío del asesor</h2>

      {!envioReciente ? (
        <Card className="p-6 text-center text-muted-foreground">
          No hay envíos registrados por el asesor.
        </Card>
      ) : (
        <Card className="shadow-sm border rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Último envío recibido
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Asesor */}
            <div className="flex justify-between text-sm">
              <span className="font-medium">Asesor:</span>
              <span>{envioReciente.asunto?.asesor || "Sin nombre"}</span>
            </div>

            {/* Estado */}
            <div className="flex justify-between text-sm items-center">
              <span className="font-medium">Estado:</span>
              <Badge className={getStatusColor(envioReciente.estado)}>
                {envioReciente.estado}
              </Badge>
            </div>

            {/* Fecha */}
            <div className="flex justify-between text-sm">
              <span className="font-medium">Fecha:</span>
              <span className="text-muted-foreground">
                {formatDate(envioReciente.fecha)}
              </span>
            </div>

            {/* Archivos */}
            <div className="pt-2 flex flex-col gap-3 items-center">
              {envioReciente.archivos?.length ? (
                envioReciente.archivos.map((archivo, index) => (
                  <button
                    key={index}
                    onClick={() => handleDownloadFile(archivo.ruta)}
                    className="inline-flex items-center gap-2 bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-lg transition-colors w-full justify-center"
                  >
                    <Download className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Descargar {archivo.nombre}
                    </span>
                  </button>
                ))
              ) : (
                <div className="text-muted-foreground text-sm">
                  No hay archivos adjuntos
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
