import { SubjectRow } from "./subject-row"
import { EmptyState } from "./empty-state"
import { Skeleton } from "@/components/ui/skeleton"

interface Subject {
  id: string
  title: string
  dueDate: string
  status: "entregado" | "en-proceso" | "terminado"
  document?: string
}

interface SubjectsListProps {
  subjects: Subject[]
  loading?: boolean
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  showActions?: boolean
}

export function SubjectsList({ subjects, loading, onEdit, onDelete, showActions }: SubjectsListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  if (subjects.length === 0) {
    return <EmptyState message="No hay entregas realizadas" />
  }

  return (
    <div className="space-y-3 max-h-80 overflow-y-auto">
      {subjects.map((subject) => (
        <SubjectRow
          key={subject.id}
          {...subject}
          onEdit={() => onEdit?.(subject.id)}
          onDelete={() => onDelete?.(subject.id)}
          showActions={showActions}
        />
      ))}
    </div>
  )
}
