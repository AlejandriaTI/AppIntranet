"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar } from "lucide-react";
import { formatDate } from "@/lib/date-utils";

interface SubjectCardProps {
  subject: any;
  onViewMore: () => void;
}

export function SubjectCard({ subject, onViewMore }: SubjectCardProps) {
  const getStatusColor = (estado: string) => {
    switch (estado) {
      case "terminado":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "entregado":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "en_revision":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
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
      case "en_revision":
        return "👀 En revisión";
      default:
        return estado;
    }
  };

  return (
    <Card
      onClick={onViewMore}
      className="hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer group border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
    >
      <CardHeader className="pb-4 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-50 truncate mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {subject.titulo}
            </CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
              {subject.profesion_asesoria}
            </p>
          </div>
          <Badge
            variant="outline"
            className={`${getStatusColor(
              subject.estado
            )} whitespace-nowrap text-xs font-medium shrink-0`}
          >
            {getStatusLabel(subject.estado)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Asesor info */}
        {subject.titulo_asesor && (
          <div className="text-sm pb-3 border-b border-slate-200 dark:border-slate-700">
            <span className="text-slate-600 dark:text-slate-400 block text-xs font-medium mb-1">
              Asesor
            </span>
            <span className="font-medium text-slate-900 dark:text-slate-100">
              {subject.titulo_asesor}
            </span>
          </div>
        )}

        {/* Quick info with better spacing */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <FileText className="w-4 h-4 text-slate-600 dark:text-slate-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Archivos
              </p>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                {subject.documentos.length}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <Calendar className="w-4 h-4 text-slate-600 dark:text-slate-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Fecha
              </p>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-50 truncate">
                {formatDate(subject.fecha_principal)
                  .split(" ")
                  .slice(0, 3)
                  .join(" ")}
              </p>
            </div>
          </div>
        </div>

        {/* Helpful hint */}
        <div className="text-xs text-slate-500 dark:text-slate-400 italic pt-2">
          Toca para ver más detalles
        </div>
      </CardContent>
    </Card>
  );
}
