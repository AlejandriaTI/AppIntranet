import { DocumentRow } from "./document-row";
import { EmptyState } from "./empty-state";
import { Skeleton } from "@/components/ui/skeleton";

interface Document {
  name: string;
  url: string;
}

interface DocumentItem {
  id: string;
  tipo: "usuario" | "asesor"; // 👈 Agregado
  title: string;
  date: string;
  status: string;
  documents: Document[];
}

interface DocumentsListProps {
  documents: DocumentItem[];
  loading?: boolean;
  onDownload?: (url: string, name: string) => void;
}

export function DocumentsList({
  documents,
  loading,
  onDownload,
}: DocumentsListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (documents.length === 0) {
    return <EmptyState message="No hay documentos" />;
  }

  return (
    <div className="space-y-3 max-h-80 overflow-y-auto">
      {documents.map((doc) => (
        <DocumentRow key={doc.id} {...doc} onDownload={onDownload} />
      ))}
    </div>
  );
}
