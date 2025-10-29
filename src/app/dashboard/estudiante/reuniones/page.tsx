"use client";

import { useEffect, useState } from "react";
import { VideoOff, GraduationCap, Play, Video } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import VideoPlayer from "@/components/reuniones/videoPlayer";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useAsesorias } from "@/hooks/useAsesoria";

// Interfaces de datos
interface Reunion {
  id: number;
  titulo: string;
  meetingId: string;
  enlace_zoom: string;
  fecha_reunion: string;
}

interface Induccion {
  id: number;
  titulo: string;
  url: string;
}

function App() {
  const [showModalVideo, setShowModalVideo] = useState(false);
  const [urlVideo, setUrlVideo] = useState<string>("");
  const [proximasReuniones, setProximasReuniones] = useState<Reunion[]>([]);
  const [inducciones, setInducciones] = useState<Induccion[]>([]);
  const [loadingLocal, setLoadingLocal] = useState(true);

  const user = useSelector((state: RootState) => state.auth.user);
  const idCliente = user?.id_cliente;

  // ✅ Hook que obtiene asesorías del cliente
  const {
    asesorias,
    loading: loadingAsesorias,
    error,
    selectedAsesoriaId,
    setSelectedAsesoriaId,
  } = useAsesorias(idCliente);

  // ✅ Efecto para cargar reuniones
  useEffect(() => {
    if (!selectedAsesoriaId) return;

    const fetchReuniones = async () => {
      setLoadingLocal(true); // ✅ ahora dentro del flujo async

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/reuniones/espera/${selectedAsesoriaId}`
        );
        const data = await res.json();
        setProximasReuniones(data || []);
      } catch (error) {
        console.error("Error al obtener reuniones próximas:", error);
      } finally {
        setLoadingLocal(false);
      }
    };

    fetchReuniones();
  }, [selectedAsesoriaId]);

  // ✅ Efecto para cargar inducciones
  useEffect(() => {
    if (!selectedAsesoriaId) return;
    const fetchInducciones = async () => {
      setLoadingLocal(true); // ✅ ahora dentro del flujo async

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/inducciones/induccionesByAsesoria/${selectedAsesoriaId}`
        );
        const data = await res.json();
        setInducciones(data || []);
      } catch (error) {
        console.error("Error al obtener inducciones:", error);
      } finally {
        setLoadingLocal(false);
      }
    };

    fetchInducciones();
  }, [selectedAsesoriaId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { month: "long" };
    return {
      month: new Intl.DateTimeFormat("es-ES", options).format(date),
      day: date.getUTCDate(),
      time: date.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
      }),
    };
  };

  if (loadingAsesorias || loadingLocal) {
    return (
      <section className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Cargando información...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Error al cargar asesorías: {error}</p>
      </section>
    );
  }

  return (
    <section className="min-h-screen  dark:from-slate-900 dark:to-slate-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 md:p-8 bg-white dark:bg-slate-800 shadow-lg">
          <div className="flex flex-col gap-10">
            {/* Encabezado */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center flex-col sm:flex-row gap-4">
                <h1 className="font-semibold text-2xl md:text-3xl text-slate-800 dark:text-white">
                  Reuniones
                </h1>

                {/* Select de asesorías */}
                <Select
                  value={selectedAsesoriaId ? String(selectedAsesoriaId) : ""}
                  onValueChange={(value) =>
                    setSelectedAsesoriaId(Number(value))
                  }
                >
                  <SelectTrigger className="w-full md:w-64">
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

              <div className="flex w-full border-b-4 gap-3 border-slate-800 dark:border-slate-500">
                <button className="px-6 py-2 rounded-t-lg bg-slate-800 text-white font-medium shadow-sm hover:bg-slate-700 transition-colors">
                  Próximos
                </button>
              </div>
            </div>

            {/* Próximas reuniones */}
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {proximasReuniones.length > 0 ? (
                  proximasReuniones.map((reunion) => {
                    const formattedDate = formatDate(reunion.fecha_reunion);
                    return (
                      <Card
                        key={reunion.id}
                        className="overflow-hidden hover:shadow-xl transition-shadow duration-300"
                      >
                        <div className="flex flex-col sm:flex-row h-full">
                          <div className="flex flex-col justify-between items-center bg-slate-800 text-white p-6 sm:w-32 h-full">
                            <div className="flex flex-col items-center gap-2">
                              <p className="text-sm font-medium uppercase">
                                {formattedDate.month}
                              </p>
                              <h1 className="text-4xl font-bold">
                                {formattedDate.day}
                              </h1>
                            </div>
                            <p className="text-xs mt-4">{formattedDate.time}</p>
                          </div>

                          <div className="flex flex-col justify-between flex-1 p-6 bg-slate-50 dark:bg-slate-900">
                            <div className="flex flex-col gap-3">
                              <p className="font-semibold text-slate-800 dark:text-white text-lg">
                                {reunion.titulo}
                              </p>
                              <p className="text-slate-500 dark:text-slate-300 text-sm">
                                Código: {reunion.meetingId}
                              </p>
                            </div>

                            <Button
                              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full h-11 gap-2"
                              asChild
                            >
                              <a
                                href={reunion.enlace_zoom}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <span className="font-medium">Enlace Zoom</span>
                                <Video className="w-5 h-5 hidden xl:block" />
                              </a>
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );
                  })
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-16 text-center text-slate-500 dark:text-slate-400">
                    <VideoOff className="w-16 h-16 mb-4 text-slate-300" />
                    <p className="text-lg font-medium">
                      Aún no tienes reuniones programadas.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Inducciones */}
            <div className="flex flex-col gap-6">
              <div className="flex w-full border-b-4 border-cyan-500">
                <button className="px-6 py-2 rounded-t-lg bg-cyan-500 text-white font-medium shadow-sm hover:bg-cyan-600 transition-colors">
                  Inducciones
                </button>
              </div>

              {inducciones.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {inducciones.map((induccion) => (
                    <Card
                      key={induccion.id}
                      className="relative overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300"
                      onClick={() => {
                        setUrlVideo(induccion.url);
                        setShowModalVideo(true);
                      }}
                    >
                      <div className="relative aspect-video bg-linear-to-br from-slate-700 to-slate-900">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                            <Play className="w-8 h-8 text-white ml-1" />
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <p className="text-white text-lg font-semibold line-clamp-2">
                            {induccion.titulo}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center text-slate-500 dark:text-slate-400">
                  <GraduationCap className="w-16 h-16 mb-4 text-slate-300" />
                  <p className="text-lg font-medium">
                    No hay inducciones disponibles.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Modal de video */}
        <Dialog open={showModalVideo} onOpenChange={setShowModalVideo}>
          <DialogContent className="max-w-5xl w-full p-0 bg-transparent border-none flex justify-center items-center">
            <DialogHeader className="sr-only">
              <DialogTitle>Video de Inducción</DialogTitle>
            </DialogHeader>
            <div className="relative w-full aspect-video">
              <VideoPlayer urlVideo={urlVideo} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}

export default App;
