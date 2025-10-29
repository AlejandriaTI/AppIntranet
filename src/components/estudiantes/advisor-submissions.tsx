import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Download } from "lucide-react"

interface SubmissionItem {
  id: number
  title: string
  status: "terminado" | "pendiente" | "en-revision"
  date: string
  file: string
}

const submissions: SubmissionItem[] = [
  {
    id: 1,
    title: "Asesor de Avance 1",
    status: "terminado",
    date: "14 may. 2025",
    file: "Revision_Introduccion.png",
  },
]

interface AdvisorSubmissionsProps {
  isLoading: boolean
}

export function AdvisorSubmissions({ isLoading }: AdvisorSubmissionsProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Envíos Asesor</h2>
        <Card className="p-6">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-md" />
            ))}
          </div>
        </Card>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "terminado":
        return "bg-primary text-primary-foreground"
      case "pendiente":
        return "bg-yellow-100 text-yellow-800"
      case "en-revision":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Envíos Asesor</h2>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted border-b">
              <tr>
                <th className="text-left p-4 font-semibold">Título</th>
                <th className="text-left p-4 font-semibold">Estado</th>
                <th className="text-left p-4 font-semibold">Fecha</th>
                <th className="text-left p-4 font-semibold">Archivo</th>
                <th className="text-center p-4 font-semibold">Descargas</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((item) => (
                <tr key={item.id} className="border-b hover:bg-muted/50 transition-colors">
                  <td className="p-4">{item.title}</td>
                  <td className="p-4">
                    <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                  </td>
                  <td className="p-4 text-muted-foreground">{item.date}</td>
                  <td className="p-4 text-muted-foreground">{item.file}</td>
                  <td className="p-4 text-center">
                    <button className="inline-flex items-center justify-center hover:bg-muted rounded p-1 transition-colors">
                      <Download className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
