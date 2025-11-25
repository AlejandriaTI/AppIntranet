"use client";

import { useEffect, useState } from "react";
import { User, BookMarked, Calendar, ChevronLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/lib/date-utils";
import { DocumentSection } from "./document-section";
import { Asunto } from "@/services/interface/asuntos";

interface SubjectDetailDrawerProps {
  subject: Asunto;
  onClose: () => void;
}

export function SubjectDetailDrawer({
  subject,
  onClose,
}: SubjectDetailDrawerProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case "terminado":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "entregado":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200";
    }
  };

  const getStatusLabel = (estado: string) => {
    switch (estado) {
      case "terminado":
        return "✓ Terminado";
      case "entregado":
        return "📤 Entregado";
      case "proceso":
        return "👀 En proceso";
      default:
        return estado;
    }
  };

  return (
    <>
      {/* Fondo / Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          isClosing ? "opacity-0" : "opacity-100"
        }`}
        onClick={handleClose}
      />

      {/* Drawer lateral */}
      <div
        className={`fixed right-0 bottom-0 z-50 w-full md:w-96 h-[85vh] bg-background dark:bg-slate-950 shadow-2xl flex flex-col overflow-hidden rounded-tl-2xl animate-in slide-in-from-right transition-transform duration-300 ${
          isClosing ? "translate-x-full" : ""
        }`}
      >
        {/* Header sin azul, con flecha */}
        <div className="flex-none flex items-center gap-3 border-b bg-background/95 dark:bg-slate-950/95 px-4 py-3 backdrop-blur">
          <button
            onClick={handleClose}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Cerrar"
          >
            <ChevronLeft className="w-5 h-5 text-slate-700 dark:text-slate-100" />
          </button>

          <div className="flex-1 min-w-0">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Detalle de asesoría
            </p>
            <h2 className="text-base font-semibold text-foreground line-clamp-2">
              {subject.titulo}
            </h2>
          </div>

          <Badge
            variant="outline"
            className={`${getStatusColor(subject.estado)} whitespace-nowrap`}
          >
            {getStatusLabel(subject.estado)}
          </Badge>
        </div>

        {/* Contenido */}
        <Tabs
          defaultValue="info"
          className="flex-1 flex flex-col overflow-hidden w-full"
        >
          <div className="flex-none px-4 pt-3 pb-2 border-b border-slate-200 dark:border-slate-800 bg-background dark:bg-slate-950">
            <TabsList className="grid w-full grid-cols-3 bg-slate-100 dark:bg-slate-800">
              <TabsTrigger
                value="info"
                className="text-xs md:text-sm dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-white"
              >
                Información
              </TabsTrigger>
              <TabsTrigger
                value="timeline"
                className="text-xs md:text-sm dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-white"
              >
                Cronología
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="text-xs md:text-sm dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-white"
              >
                Archivos
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {/* Tab: Información */}
            <TabsContent value="info" className="space-y-4 mt-0">
              <Card className="border-slate-200 dark:border-slate-700 bg-card dark:bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-sm md:text-base flex items-center gap-2 text-foreground">
                    <BookMarked className="w-5 h-5 text-primary" />
                    Detalles principales
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                        Asunto
                      </label>
                      <p className="text-sm text-foreground font-medium">
                        {subject.titulo}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                        Profesión de asesoría
                      </label>
                      <p className="text-sm text-foreground">
                        {subject.profesion_asesoria}
                      </p>
                    </div>
                  </div>

                  {subject.titulo_asesor && (
                    <div className="space-y-1 pt-3 border-t border-slate-200 dark:border-slate-700">
                      <label className="text-xs font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Asesor
                      </label>
                      <p className="text-sm text-foreground font-medium">
                        {subject.titulo_asesor}
                      </p>
                    </div>
                  )}

                  <div className="space-y-1 pt-3 border-t border-slate-200 dark:border-slate-700">
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                      Estado
                    </label>
                    <Badge
                      variant="outline"
                      className={getStatusColor(subject.estado)}
                    >
                      {getStatusLabel(subject.estado)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Cronología */}
            <TabsContent value="timeline" className="space-y-4 mt-0">
              <Card className="border-slate-200 dark:border-slate-700 bg-card dark:bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-sm md:text-base flex items-center gap-2 text-foreground">
                    <Calendar className="w-5 h-5 text-primary" />
                    Cronología de fechas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {subject.fecha_entrega && (
                      <div className="pb-3 border-b border-slate-200 dark:border-slate-700">
                        <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                          Fecha de entrega
                        </label>
                        <p className="text-sm text-foreground mt-1 font-medium">
                          {formatDate(subject.fecha_entrega)}
                        </p>
                      </div>
                    )}

                    {subject.fecha_revision && (
                      <div className="pb-3 border-b border-slate-200 dark:border-slate-700">
                        <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                          Fecha de revisión
                        </label>
                        <p className="text-sm text-foreground mt-1 font-medium">
                          {formatDate(subject.fecha_revision)}
                        </p>
                      </div>
                    )}

                    {subject.fecha_estimada && (
                      <div className="pb-3 border-b border-slate-200 dark:border-slate-700">
                        <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                          Fecha estimada
                        </label>
                        <p className="text-sm text-foreground mt-1 font-medium">
                          {formatDate(subject.fecha_estimada)}
                        </p>
                      </div>
                    )}

                    {subject.fecha_terminado && (
                      <div className="pb-3 border-b border-slate-200 dark:border-slate-700">
                        <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                          Fecha terminado
                        </label>
                        <p className="text-sm text-foreground mt-1 font-medium">
                          {formatDate(subject.fecha_terminado)}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Archivos */}
            <TabsContent value="documents" className="space-y-4 mt-0">
              <DocumentSection subject={subject} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </>
  );
}
