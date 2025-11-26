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
      <div className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm hover:shadow transition-all dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-none dark:hover:shadow-md">
        <div className="flex-1">
          <p className="font-semibold text-base text-gray-900 dark:text-gray-100">
            {title}
          </p>
          <p className="text-xs text-muted-foreground mt-1 dark:text-gray-400 ">
            {date}
          </p>
        </div>

        <Badge variant="secondary" className="text-xs ">
          {status}
        </Badge>
        {documentos.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0 ml-2 text-gray-700 dark:text-gray-300"
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </Button>
        )}
      </div>

      {isExpanded && documentos.length > 0 && (
        <div className="ml-3 mt-2 space-y-2 rounded-xl border bg-gray-50 p-4 animate-in fade-in duration-200 dark:bg-neutral-800 dark:border-neutral-700">
          {documentos.map((doc, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-lg bg-white p-3 border shadow-sm dark:bg-neutral-900 dark:border-neutral-700"
            >
              <span className="text-sm font-medium truncate text-gray-900 dark:text-gray-100">
                {doc.name}
              </span>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDownload?.(doc.url, doc.name)}
                className="h-8 w-8 p-0 text-primary dark:text-blue-400"
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
