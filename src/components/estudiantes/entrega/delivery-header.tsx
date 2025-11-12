"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Paperclip, X, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface DeliveryHeaderProps {
  asesoriaId: string | number;
  showNewButton?: boolean;
}

export function DeliveryHeader({
  asesoriaId,
  showNewButton,
}: DeliveryHeaderProps) {
  const [open, setOpen] = React.useState(false);
  const [titulo, setTitulo] = React.useState("");
  const [archivos, setArchivos] = React.useState<FileList | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // 🔹 Tipos permitidos
  const tiposPermitidos = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/zip",
    "application/x-rar-compressed",
    "application/x-7z-compressed",
  ];

  // 🔹 Recuperar token y rol (igual que tu EnvioArchivo original)
  const getAuthData = () => {
    let token: string | null = null;
    let role = "estudiante";

    const rawToken = localStorage.getItem("authToken");
    if (rawToken) {
      try {
        token = rawToken.trim().startsWith("{")
          ? JSON.parse(rawToken)?.access_token
          : rawToken;
      } catch {
        token = rawToken;
      }
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed?.role) role = parsed.role;
      } catch {}
    }

    return { token, role };
  };

  // 🔹 Elimina un archivo específico
  const handleRemoveFile = (index: number) => {
    if (!archivos) return;
    const dt = new DataTransfer();
    Array.from(archivos)
      .filter((_, i) => i !== index)
      .forEach((file) => dt.items.add(file));
    setArchivos(dt.files);
  };

  // 🔹 Maneja subida múltiple acumulando archivos
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const nuevos = Array.from(e.target.files).filter((file) =>
      tiposPermitidos.includes(file.type)
    );

    const existentes = archivos ? Array.from(archivos) : [];
    const combinados = [...existentes, ...nuevos].slice(0, 7); // máximo 7

    const dt = new DataTransfer();
    combinados.forEach((file) => dt.items.add(file));
    setArchivos(dt.files);
  };

  // 🔹 Enviar al backend
  const handleSubmit = async () => {
    if (!titulo.trim() || !archivos || archivos.length === 0) {
      toast.error("Debes ingresar un título y al menos un archivo.");
      return;
    }

    const { token, role } = getAuthData();
    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("subido_por", role);
    Array.from(archivos).forEach((file) => formData.append("files", file));

    const toastId = toast.loading("📤 Enviando archivos...");
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/asuntos/addWithDocument/${asesoriaId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      toast.dismiss(toastId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Error al enviar los archivos");
      }

      toast.success("✅ Archivos enviados correctamente");
      setTitulo("");
      setArchivos(null);
      setOpen(false);
    } catch (error) {
      console.error("Error al enviar:", error);
      toast.dismiss(toastId);
      toast.error("❌ Ocurrió un error al enviar los archivos.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
              {/* Título */}
              <div className="grid gap-2">
                <Label htmlFor="titulo">Título</Label>
                <Input
                  id="titulo"
                  placeholder="Ej. Informe semanal"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              {/* Archivos */}
              <div className="grid gap-2">
                <Label htmlFor="archivos">Archivos</Label>
                <Input
                  id="archivos"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  disabled={isSubmitting}
                />

                {archivos && archivos.length > 0 && (
                  <div className="mt-2 flex flex-col gap-1 border rounded-md p-2 bg-muted/30 max-h-40 overflow-y-auto">
                    {Array.from(archivos).map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded px-2 py-1 bg-white shadow-sm border text-sm"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Paperclip className="w-3 h-3 text-gray-500" />
                          <span className="truncate max-w-60">
                            {file.name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          className="text-gray-400 hover:text-red-500 transition"
                          disabled={isSubmitting}
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
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  "Subir"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
