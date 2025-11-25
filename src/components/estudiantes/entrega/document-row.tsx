"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, ChevronDown } from "lucide-react";
import { useState } from "react";

interface Document {
  name: string;
  url: string;
}

interface DocumentRowProps {
  id: string;
  title: string;
  date: string;
  status: string;
  documentos: Document[];
  onDownload?: (url: string, name: string) => void;
}

export function DocumentRow({
  title,
  date,
  status,
  documentos,
  onDownload,
}: DocumentRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* CONTENEDOR PRINCIPAL */}
      <div className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm hover:shadow transition-all">
        {/* Título */}
        <div className="flex-1">
          <p className="font-semibold text-base">{title}</p>
          <p className="text-xs text-muted-foreground mt-1">{date}</p>
        </div>

        {/* Estado */}
        <Badge variant="secondary" className="text-xs">
          {status}
        </Badge>

        {/* Botón de expandir */}
        {documentos.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0 ml-2"
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </Button>
        )}
      </div>

      {/* LISTA DE ARCHIVOS */}
      {isExpanded && documentos.length > 0 && (
        <div className="ml-3 mt-2 space-y-2 rounded-xl border bg-gray-50 p-4 animate-in fade-in duration-200">
          {documentos.map((doc, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-lg bg-white p-3 border shadow-sm"
            >
              <span className="text-sm font-medium truncate">{doc.name}</span>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDownload?.(doc.url, doc.name)}
                className="h-8 w-8 p-0"
              >
                <Download className="h-4 w-4 text-primary" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
