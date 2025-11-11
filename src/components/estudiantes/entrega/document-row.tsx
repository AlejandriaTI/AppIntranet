"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, ChevronDown } from "lucide-react"
import { useState } from "react"

interface Document {
  name: string
  url: string
}

interface DocumentRowProps {
  id: string
  title: string
  date: string
  status: string
  documents: Document[]
  onDownload?: (url: string, name: string) => void
}

export function DocumentRow({ id, title, date, status, documents, onDownload }: DocumentRowProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <>
      <div className="flex items-center justify-between gap-4 rounded-lg border bg-card p-4 hover:bg-accent/50 transition-colors">
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{title}</p>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{date}</span>
          <Badge variant="outline">{status}</Badge>
        </div>

        <div className="flex items-center gap-2">
          {documents.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="h-8 w-8 p-0">
              <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
            </Button>
          )}
        </div>
      </div>

      {isExpanded && documents.length > 0 && (
        <div className="ml-4 mt-2 space-y-2 rounded-lg border border-dashed bg-muted/30 p-4">
          {documents.map((doc, idx) => (
            <div key={idx} className="flex items-center justify-between rounded bg-background p-2">
              <span className="text-sm truncate">{doc.name}</span>
              <Button variant="ghost" size="sm" onClick={() => onDownload?.(doc.url, doc.name)} className="h-8 w-8 p-0">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
