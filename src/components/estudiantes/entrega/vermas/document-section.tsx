"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { formatDate } from "@/lib/date-utils";

interface DocumentSectionProps {
  subject: any;
}

export function DocumentSection({ subject }: DocumentSectionProps) {
  const getFileIcon = (filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "pdf":
        return "📄";
      case "docx":
      case "doc":
        return "📝";
      case "xlsx":
      case "xls":
        return "📊";
      case "pptx":
      case "ppt":
        return "🎯";
      case "mp4":
      case "avi":
      case "mov":
        return "🎬";
      case "webp":
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
        return "🖼️";
      default:
        return "📦";
    }
  };

  const getFileColor = (subido_por: string) => {
    return subido_por === "estudiante"
      ? "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700"
      : "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700";
  };

  const studentDocs = subject.documentos.filter(
    (d: any) => d.subido_por === "estudiante"
  );
  const advisorDocs = subject.documentos.filter(
    (d: any) => d.subido_por === "asesor"
  );

  return (
    <div className="space-y-6">
      {/* Student Documents */}
      {studentDocs.length > 0 && (
        <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900 dark:text-slate-50">
              Documentos Entregados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {studentDocs.map((doc: any, idx: number) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border ${getFileColor(
                    doc.subido_por
                  )} hover:shadow-md dark:hover:shadow-slate-800 transition-shadow`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <span className="text-2xl mt-1 shrink-0">
                        {getFileIcon(doc.nombre)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-slate-900 dark:text-slate-50 truncate">
                          {doc.nombre}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                          {formatDate(doc.fecha)}
                        </p>
                        <Badge
                          variant="secondary"
                          className="mt-2 text-xs bg-purple-200 dark:bg-purple-800 text-purple-900 dark:text-purple-200"
                        >
                          👤 Estudiante
                        </Badge>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="shrink-0 hover:bg-purple-200 dark:hover:bg-purple-800 text-slate-600 dark:text-slate-400"
                      onClick={() => window.open(doc.ruta, "_blank")}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Advisor Documents */}
      {advisorDocs.length > 0 && (
        <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900 dark:text-slate-50">
              Revisiones del Asesor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {advisorDocs.map((doc: any, idx: number) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border ${getFileColor(
                    doc.subido_por
                  )} hover:shadow-md dark:hover:shadow-slate-800 transition-shadow`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <span className="text-2xl mt-1 shrink-0">
                        {getFileIcon(doc.nombre)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-slate-900 dark:text-slate-50 truncate">
                          {doc.nombre}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                          {formatDate(doc.fecha)}
                        </p>
                        <Badge
                          variant="secondary"
                          className="mt-2 text-xs bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-200"
                        >
                          👨‍🏫 Asesor
                        </Badge>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="shrink-0 hover:bg-green-200 dark:hover:bg-green-800 text-slate-600 dark:text-slate-400"
                      onClick={() => window.open(doc.ruta, "_blank")}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {subject.documentos.length === 0 && (
        <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          <CardContent className="pt-6 text-center text-slate-600 dark:text-slate-400">
            No hay documentos en este asunto
          </CardContent>
        </Card>
      )}
    </div>
  );
}
