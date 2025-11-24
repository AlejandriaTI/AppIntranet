"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  ExternalLink,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { downloadFile } from "@/utils/downloadFile";

interface Tutorial {
  id: string;
  titulo: string;
  enlace: string;
}

interface Guia {
  id: string;
  titulo: string;
  descripcion: string;
  imagen: string;
  documento: string;
}

interface Herramienta {
  id: string;
  nombre: string;
  descripcion: string;
  imagen: string;
  enlace: string;
}

export default function RecursosEstudiante() {
  const [tutoriales, setTutoriales] = useState<Tutorial[]>([]);
  const [guias, setGuias] = useState<Guia[]>([]);
  const [herramientas, setHerramientas] = useState<Herramienta[]>([]);
  const [loading, setLoading] = useState(true);

  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentVideo, setCurrentVideo] = useState("");
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [currentPdf, setCurrentPdf] = useState("");

  const [tutorialIndex, setTutorialIndex] = useState(0);
  const [guiaIndex, setGuiaIndex] = useState(0);
  const [herramientaIndex, setHerramientaIndex] = useState(0);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tutorialesRes, guiasRes, herramientasRes] = await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/recursos/tutoriales/all`
          ).then((r) => r.json()),
          fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/recursos/guias/all`
          ).then((r) => r.json()),
          fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/recursos/herramientas/all`
          ).then((r) => r.json()),
        ]);

        setTutoriales(tutorialesRes);
        setGuias(guiasRes);
        setHerramientas(herramientasRes);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🔹 Detectar si es móvil (sin romper SSR)
  useEffect(() => {
    const updateIsMobile = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth < 768);
      }
    };
    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);
    return () => window.removeEventListener("resize", updateIsMobile);
  }, []);

  const buildFileUrl = (url: string) => {
    return url || "";
  };

  const getYouTubeId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const itemsPerPage = 3;
  const visibleTutorials = tutoriales.slice(
    tutorialIndex,
    tutorialIndex + itemsPerPage
  );
  const visibleGuias = guias.slice(guiaIndex, guiaIndex + itemsPerPage);
  const visibleHerramientas = herramientas.slice(
    herramientaIndex,
    herramientaIndex + itemsPerPage
  );

  const handleTutorialPrev = () =>
    setTutorialIndex(Math.max(0, tutorialIndex - 1));
  const handleTutorialNext = () =>
    setTutorialIndex(
      Math.min(tutoriales.length - itemsPerPage, tutorialIndex + 1)
    );
  const handleGuiaPrev = () => setGuiaIndex(Math.max(0, guiaIndex - 1));
  const handleGuiaNext = () =>
    setGuiaIndex(Math.min(guias.length - itemsPerPage, guiaIndex + 1));
  const handleHerramientaPrev = () =>
    setHerramientaIndex(Math.max(0, herramientaIndex - 1));
  const handleHerramientaNext = () =>
    setHerramientaIndex(
      Math.min(herramientas.length - itemsPerPage, herramientaIndex + 1)
    );

  if (loading) {
    return (
      <main className="min-h-screen bg-background p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-8 w-32" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((j) => (
                  <Skeleton key={j} className="h-64 w-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  return (
    <section className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Video Modal */}
        <Dialog open={showVideoModal} onOpenChange={setShowVideoModal}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Video Tutorial</DialogTitle>
            </DialogHeader>
            {currentVideo && (
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${getYouTubeId(
                    currentVideo
                  )}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* PDF Modal */}
        <Dialog open={showPdfModal} onOpenChange={setShowPdfModal}>
          <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
            <DialogHeader className="shrink-0">
              <DialogTitle>Documento</DialogTitle>
            </DialogHeader>

            <div className="flex-1 relative">
              {currentPdf && (
                <iframe
                  src={`https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
                    currentPdf
                  )}`}
                  className="absolute inset-0 w-full h-[calc(100%-0px)] border rounded"
                  title="PDF Viewer"
                />
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Tutoriales Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Tutoriales</h2>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handleTutorialPrev}
              disabled={tutorialIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {isMobile
                  ? [visibleTutorials[0]].map(
                      (tutorial) =>
                        tutorial && (
                          <Card
                            key={tutorial.id}
                            className="overflow-hidden hover:shadow-lg transition-shadow"
                          >
                            <div className="relative aspect-video bg-muted">
                              <img
                                src={`https://img.youtube.com/vi/${getYouTubeId(
                                  tutorial.enlace
                                )}/maxresdefault.jpg`}
                                alt={tutorial.titulo}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = "/tutorial-concept.png";
                                }}
                              />
                              <Button
                                size="icon"
                                className="absolute inset-0 m-auto"
                                onClick={() => {
                                  setCurrentVideo(tutorial.enlace);
                                  setShowVideoModal(true);
                                }}
                              >
                                ▶
                              </Button>
                            </div>
                            <CardContent className="pt-4">
                              <p className="font-semibold line-clamp-2 text-center">
                                {tutorial.titulo}
                              </p>
                            </CardContent>
                          </Card>
                        )
                    )
                  : visibleTutorials.map((tutorial) => (
                      <Card
                        key={tutorial.id}
                        className="overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        <div className="relative aspect-video bg-muted">
                          <img
                            src={`https://img.youtube.com/vi/${getYouTubeId(
                              tutorial.enlace
                            )}/maxresdefault.jpg`}
                            alt={tutorial.titulo}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/tutorial-concept.png";
                            }}
                          />
                          <Button
                            size="icon"
                            className="absolute inset-0 m-auto"
                            onClick={() => {
                              setCurrentVideo(tutorial.enlace);
                              setShowVideoModal(true);
                            }}
                          >
                            ▶
                          </Button>
                        </div>
                        <CardContent className="pt-4">
                          <p className="font-semibold line-clamp-2 text-center">
                            {tutorial.titulo}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
              </div>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={handleTutorialNext}
              disabled={tutorialIndex >= tutoriales.length - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </section>

        {/* Guías Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Guías</h2>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handleGuiaPrev}
              disabled={guiaIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {isMobile
                  ? [visibleGuias[0]].map(
                      (guia) =>
                        guia && (
                          <Card
                            key={guia.id}
                            className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow"
                          >
                            <div className="aspect-video bg-muted overflow-hidden">
                              <img
                                src={guia.imagen || "/placeholder.svg"}
                                alt={guia.titulo}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = "/guia.jpg";
                                }}
                              />
                            </div>
                            <CardContent className="pt-4 flex-1 flex flex-col">
                              <h3 className="font-semibold mb-2">
                                {guia.titulo}
                              </h3>
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                                {guia.descripcion}
                              </p>
                              <div className="flex flex-col sm:flex-row gap-2 w-full">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full sm:flex-1 bg-transparent text-xs sm:text-sm justify-center gap-1 sm:gap-2 px-2 sm:px-4"
                                  onClick={() => {
                                    setCurrentPdf(buildFileUrl(guia.documento));
                                    setShowPdfModal(true);
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                  <span>Ver</span>
                                </Button>

                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full sm:flex-1 bg-transparent text-xs sm:text-sm justify-center gap-1 sm:gap-2 px-2 sm:px-4"
                                  onClick={() => downloadFile(guia.documento)}
                                >
                                  <Download className="h-4 w-4" />
                                  <span>Descargar</span>
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        )
                    )
                  : visibleGuias.map((guia) => (
                      <Card
                        key={guia.id}
                        className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow"
                      >
                        <div className="aspect-video bg-muted overflow-hidden">
                          <img
                            src={guia.imagen || "/placeholder.svg"}
                            alt={guia.titulo}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/guia.jpg";
                            }}
                          />
                        </div>
                        <CardContent className="pt-4 flex-1 flex flex-col">
                          <h3 className="font-semibold mb-2">{guia.titulo}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                            {guia.descripcion}
                          </p>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 bg-transparent"
                              onClick={() => {
                                setCurrentPdf(buildFileUrl(guia.documento));
                                setShowPdfModal(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Ver
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 bg-transparent "
                              onClick={() =>
                                downloadFile(
                                  buildFileUrl(guia.documento),
                                  guia.titulo
                                )
                              }
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Descargar
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
              </div>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={handleGuiaNext}
              disabled={guiaIndex >= guias.length - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </section>

        {/* Herramientas Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Herramientas</h2>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handleHerramientaPrev}
              disabled={herramientaIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {isMobile
                  ? [visibleHerramientas[0]].map(
                      (herramienta) =>
                        herramienta && (
                          <Card
                            key={herramienta.id}
                            className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow"
                          >
                            <div className="aspect-video bg-muted overflow-hidden">
                              <img
                                src={herramienta.imagen || "/placeholder.svg"}
                                alt={herramienta.nombre}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = "/herramienta.jpg";
                                }}
                              />
                            </div>

                            <CardContent className="pt-4 flex-1 flex flex-col">
                              <h3 className="font-semibold mb-2 text-center">
                                {herramienta.nombre}
                              </h3>
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-4 text-center flex-1">
                                {herramienta.descripcion}
                              </p>

                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full bg-transparent justify-center"
                                asChild
                              >
                                <a
                                  href={herramienta.enlace}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Ir al sitio
                                </a>
                              </Button>
                            </CardContent>
                          </Card>
                        )
                    )
                  : visibleHerramientas.map((herramienta) => (
                      <Card
                        key={herramienta.id}
                        className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow"
                      >
                        <div className="aspect-video bg-muted overflow-hidden">
                          <img
                            src={herramienta.imagen || "/placeholder.svg"}
                            alt={herramienta.nombre}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/herramienta.jpg";
                            }}
                          />
                        </div>

                        <CardContent className="pt-4 flex-1 flex flex-col">
                          <h3 className="font-semibold mb-2">
                            {herramienta.nombre}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                            {herramienta.descripcion}
                          </p>

                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full bg-transparent justify-center"
                            asChild
                          >
                            <a
                              href={herramienta.enlace}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Ir al sitio
                            </a>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
              </div>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={handleHerramientaNext}
              disabled={herramientaIndex >= herramientas.length - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </section>
      </div>
    </section>
  );
}
