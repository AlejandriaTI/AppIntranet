"use client";

import { useState } from "react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Calendar,
  FileText,
  CheckCircle2,
  Clock,
  User,
  BookOpen,
  Download,
} from "lucide-react";

interface Document {
  nombre: string;
  ruta: string;
  subido_por: "estudiante" | "asesor";
  fecha: string;
}

interface DeliveryDetailDrawerProps {
  titulo: string;
  titulo_asesor?: string;
  profesion_asesoria: string;
  estado: "terminado" | "entregado" | "en-proceso";
  fecha_entrega: string;
  fecha_revision?: string;
  fecha_estimada?: string;
  fecha_terminado?: string;
  documentos: Document[];
}

const statusConfig = {
  terminado: {
    label: "Terminado",
    variant: "default" as const,
    icon: CheckCircle2,
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  },
  entregado: {
    label: "Entregado",
    variant: "secondary" as const,
    icon: Clock,
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  },
  "en-proceso": {
    label: "En Proceso",
    variant: "outline" as const,
    icon: Clock,
    color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100",
  },
};

function formatDate(dateString?: string) {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getFileIcon(fileName: string) {
  const ext = fileName.split(".").pop()?.toLowerCase();
  const iconClass = "w-4 h-4";

  if (["doc", "docx"].includes(ext || ""))
    return <FileText className={iconClass} />;
  if (["pdf"].includes(ext || "")) return <FileText className={iconClass} />;
  if (["xlsx", "xls", "csv"].includes(ext || ""))
    return <FileText className={iconClass} />;
  return <FileText className={iconClass} />;
}

export function DeliveryDetailDrawer({
  titulo,
  titulo_asesor,
  profesion_asesoria,
  estado,
  fecha_entrega,
  fecha_revision,
  fecha_estimada,
  fecha_terminado,
  documentos,
}: DeliveryDetailDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const StatusIcon = statusConfig[estado].icon;
  const estudianteDocumentos = documentos.filter(
    (d) => d.subido_por === "estudiante"
  );
  const asesorDocumentos = documentos.filter((d) => d.subido_por === "asesor");

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <button className="w-full text-left p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
          <p className="font-semibold text-foreground">{titulo}</p>
          <p className="text-sm text-muted-foreground mt-1">
            Entrega: {formatDate(fecha_entrega)}
          </p>
        </button>
      </DrawerTrigger>

      <DrawerContent className="max-h-[90vh] overflow-hidden flex flex-col">
        <DrawerHeader className="border-b pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <DrawerTitle className="text-xl font-bold text-foreground">
                {titulo}
              </DrawerTitle>
              <DrawerDescription className="text-sm mt-2 text-muted-foreground">
                {profesion_asesoria}
              </DrawerDescription>
            </div>
            <Badge variant={statusConfig[estado].variant} className="ml-2">
              <StatusIcon className="w-3 h-3 mr-1" />
              {statusConfig[estado].label}
            </Badge>
          </div>
        </DrawerHeader>

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {/* 📌 Información Principal */}
          <div className="bg-background/50 rounded-lg p-4 border border-border/50">
            <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Información General
            </h3>
            {titulo_asesor && (
              <div className="flex items-start gap-3 mb-3 pb-3 border-b border-border/50">
                <User className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground font-medium">
                    Asesor
                  </p>
                  <p className="text-sm font-medium text-foreground truncate">
                    {titulo_asesor}
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground font-medium">
                  Fecha Entrega
                </p>
                <p className="text-sm font-medium text-foreground">
                  {formatDate(fecha_entrega)}
                </p>
              </div>
            </div>
          </div>

          {/* 📅 Timeline de Fechas */}
          <div className="bg-background/50 rounded-lg p-4 border border-border/50">
            <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Línea de Tiempo
            </h3>
            <div className="space-y-3">
              {/* Entrega */}
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                  <div className="w-0.5 h-8 bg-border/50 my-1" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    ENTREGADO
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {formatDate(fecha_entrega)}
                  </p>
                </div>
              </div>

              {/* Revisión */}
              {fecha_revision && (
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mt-2" />
                    <div className="w-0.5 h-8 bg-border/50 my-1" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      REVISADO
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {formatDate(fecha_revision)}
                    </p>
                  </div>
                </div>
              )}

              {/* Estimado */}
              {fecha_estimada && (
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-amber-400 mt-2" />
                    <div className="w-0.5 h-8 bg-border/50 my-1" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      ESTIMADO
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {formatDate(fecha_estimada)}
                    </p>
                  </div>
                </div>
              )}

              {/* Terminado */}
              {fecha_terminado && (
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      TERMINADO
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {formatDate(fecha_terminado)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 📎 Documentos */}
          <Accordion type="single" collapsible defaultValue="item-1">
            {/* Documentos del Estudiante */}
            {estudianteDocumentos.length > 0 && (
              <AccordionItem
                value="item-1"
                className="border rounded-lg px-4 bg-background/50"
              >
                <AccordionTrigger className="py-3 hover:no-underline">
                  <span className="flex items-center gap-2 font-semibold text-sm">
                    <FileText className="w-4 h-4" />
                    Mis Envíos
                    <span className="ml-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-2 py-0.5 rounded-full">
                      {estudianteDocumentos.length}
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-3 pt-2">
                  <div className="space-y-2">
                    {estudianteDocumentos.map((doc, idx) => (
                      <a
                        key={idx}
                        href={doc.ruta}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-3 p-3 rounded-lg bg-white dark:bg-slate-800 border border-border/50 hover:bg-accent/50 transition-colors group"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="text-blue-600 dark:text-blue-400 shrink-0">
                            {getFileIcon(doc.nombre)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate group-hover:underline">
                              {doc.nombre}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(doc.fecha)}
                            </p>
                          </div>
                        </div>
                        <Download className="w-4 h-4 text-muted-foreground group-hover:text-foreground shrink-0" />
                      </a>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Documentos del Asesor */}
            {asesorDocumentos.length > 0 && (
              <AccordionItem
                value="item-2"
                className="border rounded-lg px-4 bg-background/50 mt-3"
              >
                <AccordionTrigger className="py-3 hover:no-underline">
                  <span className="flex items-center gap-2 font-semibold text-sm">
                    <FileText className="w-4 h-4" />
                    Retroalimentación del Asesor
                    <span className="ml-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 px-2 py-0.5 rounded-full">
                      {asesorDocumentos.length}
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-3 pt-2">
                  <div className="space-y-2">
                    {asesorDocumentos.map((doc, idx) => (
                      <a
                        key={idx}
                        href={doc.ruta}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-3 p-3 rounded-lg bg-white dark:bg-slate-800 border border-border/50 hover:bg-accent/50 transition-colors group"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="text-green-600 dark:text-green-400 shrink-0">
                            {getFileIcon(doc.nombre)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate group-hover:underline">
                              {doc.nombre}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(doc.fecha)}
                            </p>
                          </div>
                        </div>
                        <Download className="w-4 h-4 text-muted-foreground group-hover:text-foreground shrink-0" />
                      </a>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setIsOpen(false)}
          >
            Cerrar
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
