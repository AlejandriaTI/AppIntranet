import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MeetingsProps {
  isLoading: boolean
}

export function Meetings({ isLoading }: MeetingsProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Reuniones</h2>
        <Skeleton className="h-10 w-full rounded-md" />
        <Card className="p-6 space-y-4">
          <Skeleton className="h-20 w-full rounded-md" />
          <Skeleton className="h-10 w-24 rounded-md" />
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Reuniones</h2>
      <Select defaultValue="investigacion">
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="investigacion">Investigación Sistema tributario</SelectItem>
          <SelectItem value="tesis">Asesoría de Tesis</SelectItem>
          <SelectItem value="seminario">Seminario</SelectItem>
        </SelectContent>
      </Select>

      <Card className="p-6 space-y-4">
        <div className="flex gap-4">
          <div className="bg-primary text-primary-foreground rounded-lg p-4 text-center min-w-fit">
            <p className="text-xs opacity-75">JUNIO</p>
            <p className="text-3xl font-bold">1</p>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">Reunión inicial</h3>
            <p className="text-sm text-muted-foreground">Código: 4532498</p>
          </div>
        </div>
        <Button className="w-full bg-blue-600 hover:bg-blue-700">Zoom</Button>
      </Card>
    </div>
  )
}
