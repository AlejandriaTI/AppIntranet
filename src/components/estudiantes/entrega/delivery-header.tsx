"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Plus, Paperclip, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface DeliveryHeaderProps {
  onNewClick?: (payload?: {
    titulo: string
    archivos: FileList | null
  }) => void
  showNewButton?: boolean
}

export function DeliveryHeader({ onNewClick, showNewButton }: DeliveryHeaderProps) {
  const [open, setOpen] = React.useState(false)
  const [titulo, setTitulo] = React.useState("")
  const [archivos, setArchivos] = React.useState<FileList | null>(null)

  const handleSave = () => {
    onNewClick?.({ titulo, archivos })
    setOpen(false)
    setTitulo("")
    setArchivos(null)
  }

  // 🔹 Elimina un archivo específico de la lista
  const handleRemoveFile = (index: number) => {
    if (!archivos) return
    const dt = new DataTransfer()
    Array.from(archivos)
      .filter((_, i) => i !== index)
      .forEach((file) => dt.items.add(file))
    setArchivos(dt.files)
  }

  // 🔹 Permite subir archivos en varias tandas (acumula los nuevos)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const nuevos = Array.from(e.target.files)
    const existentes = archivos ? Array.from(archivos) : []
    const combinados = [...existentes, ...nuevos]

    const dt = new DataTransfer()
    combinados.forEach((file) => dt.items.add(file))
    setArchivos(dt.files)
  }

  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold tracking-tight">Entregas</h2>

      {showNewButton && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Avance
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Nuevo Avance</DialogTitle>
              <DialogDescription>
                Ingresa un título y adjunta los archivos correspondientes.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-2">
              {/* Campo título */}
              <div className="grid gap-2">
                <Label htmlFor="titulo">Título</Label>
                <Input
                  id="titulo"
                  placeholder="Ej. Informe semanal"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                />
              </div>

              {/* Campo archivos */}
              <div className="grid gap-2">
                <Label htmlFor="archivos">Archivos</Label>
                <Input
                  id="archivos"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                />

                {/* Lista de archivos debajo del input */}
                {archivos && archivos.length > 0 && (
                  <div className="mt-2 flex flex-col gap-1 border rounded-md p-2 bg-muted/30 max-h-40 overflow-y-auto">
                    {Array.from(archivos).map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded px-2 py-1 bg-white shadow-sm border text-sm"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Paperclip className="w-3 h-3 text-gray-500" />
                          <span className="truncate max-w-[240px]">{file.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          className="text-gray-400 hover:text-red-500 transition"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={!titulo.trim()}>
                Guardar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
