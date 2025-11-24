import { SubjectRow } from "./subject-row";
import { EmptyState } from "./empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import type { Asunto } from "@/services/interface/asuntos";

interface SubjectsListProps {
  asuntos: Asunto[];
  loading?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

export function SubjectsList({
  asuntos,
  loading,
  onEdit,
  onDelete,
  showActions,
}: SubjectsListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (asuntos.length === 0) {
    return <EmptyState message="No hay entregas realizadas" />;
  }

  return (
    <div className="space-y-3 max-h-80 overflow-y-auto">
      {asuntos.map((asunto) => (
        <SubjectRow
          key={asunto.id_asunto}
          id={asunto.id_asunto}
          title={asunto.titulo}
          dueDate={asunto.fecha_entrega}
          status={asunto.estado as "entregado" | "en-proceso" | "terminado"}
          titulo_asesor={asunto.titulo_asesor}
          profesion_asesoria={asunto.profesion_asesoria}
          fecha_revision={asunto.fecha_revision}
          fecha_estimada={asunto.fecha_estimada}
          fecha_terminado={asunto.fecha_terminado}
          documentos={asunto.documentos}
          onEdit={() => onEdit?.(asunto.id_asunto)}
          onDelete={() => onDelete?.(asunto.id_asunto)}
          showActions={showActions}
        />
      ))}
    </div>
  );
}
