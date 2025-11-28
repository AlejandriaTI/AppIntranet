"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
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

    const container = scrollRef.current;
    const cardWidth = container.offsetWidth; // 1 card visible
    const totalWidth = container.scrollWidth;
    const maxScroll = totalWidth - cardWidth;

    // Scroll actual redondeado
    const current = Math.round(container.scrollLeft);

    if (direction === "right") {
      // Si ya está al final → regresa al inicio
      if (current >= maxScroll - 10) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: cardWidth, behavior: "smooth" });
      }
    } else {
      // direction === "left"
      // Si ya está al inicio → salta al final
      if (current <= 10) {
        container.scrollTo({ left: maxScroll, behavior: "smooth" });
      } else {
        container.scrollBy({ left: -cardWidth, behavior: "smooth" });
      }
    }
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
      <div className="relative w-full flex items-center justify-center">
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-hidden w-[260px] sm:w-[300px] lg:w-[330px] snap-x snap-mandatory"
        >
          {noticias.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedNoticia(item)}
              className="snap-center shrink-0 w-full cursor-pointer hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-full max-w-sm bg-card rounded-lg border border-border overflow-hidden hover:shadow-md transition-shadow">
                {/* Accent bar */}
                <div className="h-1 bg-primary" />

                {/* Image */}
                <div className="h-40 bg-muted overflow-hidden">
                  <img
                    src={item.imagen || "/placeholder.svg"}
                    alt={item.titulo}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-primary uppercase tracking-wide">
                    Noticia
                  </h3>

                  <h2 className="text-lg font-semibold text-card-foreground mt-2 line-clamp-2">
                    {item.titulo}
                  </h2>

                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {item.descripcion}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Botones de navegación */}
        {noticias.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full shadow-sm"
              onClick={() => handleScroll("left")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full shadow-sm"
              onClick={() => handleScroll("right")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {/* Modal mejorado */}
      <Dialog
        open={!!selectedNoticia}
        onOpenChange={() => setSelectedNoticia(null)}
      >
        <DialogContent className="max-w-[620px] w-[92vw] p-0 rounded-2xl shadow-xl border border-border/30 overflow-hidden bg-background">
          {selectedNoticia && (
            <div className="flex flex-col sm:flex-row group">
              {/* Imagen vertical */}
              <div className="sm:w-[240px] w-full h-[220px] sm:h-auto overflow-hidden relative">
                <img
                  src={selectedNoticia.imagen}
                  alt={selectedNoticia.titulo}
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              {/* Texto */}
              <div className="flex flex-col justify-between p-6 sm:w-[calc(100%-240px)]">
                <div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {selectedNoticia.titulo}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 mb-4">
                    Noticia destacada · Alejandría Consultores
                  </p>

                  <p className="text-sm text-foreground leading-relaxed mb-6">
                    {selectedNoticia.descripcion}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
