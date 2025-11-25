"use client";

import { useEffect } from "react";
import { X, User, BookMarked, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/lib/date-utils";
import { DocumentSection } from "./document-section";

interface SubjectDetailModalProps {
  subject: any;
  onClose: () => void;
}

export function SubjectDetailModal({
  subject,
  onClose,
}: SubjectDetailModalProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case "terminado":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "entregado":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
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
      default:
        return estado;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40"
      onClick={onClose} // tap en el fondo cierra
    >
      <div
        className="w-full md:w-full md:max-w-2xl bg-background dark:bg-slate-950 rounded-t-2xl md:rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // evita que el click dentro cierre
      >
        {/* Header (SIN AZUL) */}
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl border-b bg-background/95 dark:bg-slate-950/95 px-6 py-4 backdrop-blur">
          <div className="flex-1 pr-4">
            <h2 className="text-xl font-semibold text-foreground mb-1">
              {subject.titulo}
            </h2>
            <Badge variant="outline" className={getStatusColor(subject.estado)}>
              {getStatusLabel(subject.estado)}
            </Badge>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-200 shrink-0"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 bg-slate-100 dark:bg-slate-800">
              <TabsTrigger
                value="info"
                className="dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-white"
              >
                Información
              </TabsTrigger>
              <TabsTrigger
                value="timeline"
                className="dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-white"
              >
                Cronología
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-white"
              >
                Archivos
              </TabsTrigger>
            </TabsList>

            {/* Tab: Information */}
            <TabsContent value="info" className="space-y-4">
              <Card className="border-slate-200 dark:border-slate-700 bg-card dark:bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                    <BookMarked className="w-5 h-5 text-primary" />
                    Detalles Principales
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
                        Asunto
                      </label>
                      <p className="text-foreground font-medium">
                        {subject.titulo}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
                        Profesión de Asesoría
                      </label>
                      <p className="text-foreground">
                        {subject.profesion_asesoria}
                      </p>
                    </div>
                  </div>

                  {subject.titulo_asesor && (
                    <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Asesor
                      </label>
                      <p className="text-foreground font-medium">
                        {subject.titulo_asesor}
                      </p>
                    </div>
                  )}

                  <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
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

            {/* Tab: Timeline */}
            <TabsContent value="timeline" className="space-y-4">
              <Card className="border-slate-200 dark:border-slate-700 bg-card dark:bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                    <Calendar className="w-5 h-5 text-primary" />
                    Cronología de Fechas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-5">
                    {subject.fecha_entrega && (
                      <div className="pb-5 border-b border-slate-200 dark:border-slate-700">
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
                          Fecha de Entrega
                        </label>
                        <p className="text-foreground mt-2 text-base font-medium">
                          {formatDate(subject.fecha_entrega)}
                        </p>
                      </div>
                    )}

                    {subject.fecha_revision && (
                      <div className="pb-5 border-b border-slate-200 dark:border-slate-700">
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
                          Fecha de Revisión
                        </label>
                        <p className="text-foreground mt-2 text-base font-medium">
                          {formatDate(subject.fecha_revision)}
                        </p>
                      </div>
                    )}

                    {subject.fecha_estimada && (
                      <div className="pb-5 border-b border-slate-200 dark:border-slate-700">
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
                          Fecha Estimada
                        </label>
                        <p className="text-foreground mt-2 text-base font-medium">
                          {formatDate(subject.fecha_estimada)}
                        </p>
                      </div>
                    )}

                    {subject.fecha_terminado && (
                      <div className="pb-5 border-b border-slate-200 dark:border-slate-700">
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
                          Fecha Terminado
                        </label>
                        <p className="text-foreground mt-2 text-base font-medium">
                          {formatDate(subject.fecha_terminado)}
                        </p>
                      </div>
                    )}

                    {subject.fecha_principal && (
                      <div>
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
                          Fecha Principal
                        </label>
                        <p className="text-foreground mt-2 text-base font-medium">
                          {formatDate(subject.fecha_principal)}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Documents */}
            <TabsContent value="documents" className="space-y-4">
              <DocumentSection subject={subject} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
