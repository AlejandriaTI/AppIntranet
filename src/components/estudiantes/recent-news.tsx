"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface NewsItem {
  id: number;
  title: string;
  image: string;
}

const newsItems: NewsItem[] = [
  { id: 1, title: "Nuevo convenio con universidades internacionales", image: "/international-meeting.jpg" },
  { id: 2, title: "Concurso de investigación 2025", image: "/research-competition.jpg" },
  { id: 3, title: "Actualización en el reglamento de tesis", image: "/thesis-regulations.jpg" },
  { id: 4, title: "Webinar sobre redacción académica", image: "/academic-writing.png" },
  { id: 5, title: "Nuevo portal de biblioteca digital", image: "/digital-library.jpg" },
  { id: 6, title: "Nuevo convenio con universidades internacionales", image: "/international-meeting.jpg" },
];

interface RecentNewsProps {
  isLoading: boolean;
}

export function RecentNews({ isLoading }: RecentNewsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? newsItems.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === newsItems.length - 1 ? 0 : prev + 1));
  };

  if (isLoading) {
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

  return (
    <div className="space-y-4 w-full">
      <h2 className="text-2xl font-bold">Noticias Recientes</h2>

      <div className="relative w-full">
        {/* Contenedor que limita el ancho */}
        <div className="flex w-full gap-4 overflow-x-auto overflow-y-hidden pb-2 scroll-smooth snap-x snap-mandatory">
          {newsItems.map((item, index) => (
            <Card
              key={item.id}
              className={`shrink-0 snap-start w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 overflow-hidden transition-all duration-300 cursor-pointer ${
                index === currentIndex ? "opacity-100" : "opacity-70"
              }`}
            >
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4 bg-primary text-primary-foreground">
                <p className="text-sm font-medium line-clamp-2">{item.title}</p>
                <button className="text-xs mt-2 opacity-75 hover:opacity-100">ver →</button>
              </div>
            </Card>
          ))}
        </div>

        {/* Botones de navegación */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 hidden md:flex bg-background/80 hover:bg-background"
          onClick={handlePrev}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 hidden md:flex bg-background/80 hover:bg-background"
          onClick={handleNext}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
