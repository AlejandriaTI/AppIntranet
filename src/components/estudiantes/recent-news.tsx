"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface Noticia {
  id: number;
  titulo: string;
  descripcion: string;
  imagen: string;
}

export function RecentNews() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNoticia, setSelectedNoticia] = useState<Noticia | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/recursos/noticias/all`
        );
        if (!res.ok) throw new Error("Error al obtener noticias");
        const data = await res.json();
        if (Array.isArray(data)) setNoticias(data);
      } catch (error) {
        console.error("Error al obtener noticias recientes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNoticias();
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.offsetWidth * 0.9; // desplaza casi un ancho visible
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <div className="space-y-4 w-full">
        <h2 className="text-2xl font-bold">Noticias Recientes</h2>
        <div className="flex gap-4 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full sm:w-1/3 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!noticias.length) {
    return (
      <p className="text-muted-foreground text-sm">
        No hay noticias disponibles por el momento.
      </p>
    );
  }

  return (
    <div className="space-y-4 w-full relative">
      <h2 className="text-2xl font-bold">Noticias Recientes</h2>

      {/* Carrusel controlado */}
      <div className="relative w-full">
        <div
          ref={scrollRef}
          className="flex w-full gap-4 overflow-hidden pb-2 scroll-smooth snap-x snap-mandatory"
        >
          {noticias.map((item) => (
            <Card
              key={item.id}
              onClick={() => setSelectedNoticia(item)}
              className="shrink-0 snap-start w-[280px] sm:w-[320px] lg:w-[350px] overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-lg hover:scale-[1.02]"
            >
              <img
                src={item.imagen || "/placeholder.svg"}
                alt={item.titulo}
                className="w-full h-40 object-cover"
              />
              <CardContent className="p-4 bg-primary text-primary-foreground">
                <p className="text-sm font-medium line-clamp-2">
                  {item.titulo}
                </p>
                <span className="text-xs mt-2 opacity-75 hover:opacity-100">
                  Ver más →
                </span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Botones de navegación */}
        {noticias.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full shadow-sm"
              onClick={() => handleScroll("left")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full shadow-sm"
              onClick={() => handleScroll("right")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {/* Modal elegante tipo tarjeta */}
      <Dialog
        open={!!selectedNoticia}
        onOpenChange={() => setSelectedNoticia(null)}
      >
        <DialogContent className="max-w-[550px] w-[90vw] p-0 rounded-2xl shadow-xl border border-border/40 overflow-hidden">
          {selectedNoticia && (
            <div className="flex flex-col sm:flex-row bg-background">
              {/* Imagen vertical */}
              <div className="sm:w-[180px] w-full h-[220px] sm:h-auto overflow-hidden">
                <img
                  src={selectedNoticia.imagen}
                  alt={selectedNoticia.titulo}
                  className="object-cover w-full h-full sm:rounded-l-2xl"
                />
              </div>

              {/* Texto alineado */}
              <div className="flex flex-col justify-center p-6 sm:w-[calc(100%-180px)]">
                <h3 className="text-lg font-semibold text-foreground leading-snug">
                  {selectedNoticia.titulo}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 mb-3">
                  Noticia destacada de Alejandría Consultores
                </p>
                <p className="text-sm text-foreground leading-relaxed mb-6">
                  {selectedNoticia.descripcion}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
