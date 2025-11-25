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
import { Preferences } from "@capacitor/preferences";

interface DeliveryHeaderProps {
  asesoriaId: string | number;
  showNewButton?: boolean;
  onSuccess?: () => void;
}

export function DeliveryHeader({
  asesoriaId,
  showNewButton,
  onSuccess,
}: DeliveryHeaderProps) {
  const [open, setOpen] = React.useState(false);
  const [titulo, setTitulo] = React.useState("");
  const [archivos, setArchivos] = React.useState<FileList | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [esDelegado, setEsDelegado] = React.useState<boolean>(false);

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

  const getAuthData = async () => {
    let role = "estudiante";

    const tokenRes = await Preferences.get({ key: "authToken" });
    const userRes = await Preferences.get({ key: "user" });

    const token = tokenRes.value || null;

    if (userRes.value) {
      try {
        const parsed = JSON.parse(userRes.value);
        if (parsed?.role) role = parsed.role;
      } catch {}
    }

    return { token, role };
  };

  React.useEffect(() => {
    const fetchData = async () => {
      const userRes = await Preferences.get({ key: "user" });

      if (userRes.value) {
        try {
          const parsedUser = JSON.parse(userRes.value);
          setEsDelegado(Boolean(parsedUser.esDelegado));
        } catch (err) {
          console.log("Error parsing user", err);
        }
      }
    };

    fetchData();
  }, []);

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

    const { token, role } = await getAuthData();
    console.log("🔑 Token value:", token);
    console.log("👤 Role retrieved:", role);

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/asuntos/addWithDocument/${asesoriaId}`;
    console.log("🔗 Target URL:", url);

    if (!token) {
      toast.error(
        "No se encontró sesión activa. Por favor, inicia sesión nuevamente."
      );
      return;
    }

    // 🔍 Verificar si el token está expirado
    try {
      const tokenParts = token.split(".");
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        const exp = payload.exp * 1000; // convertir a milisegundos
        const now = Date.now();
        console.log("🕐 Token expira en:", new Date(exp).toLocaleString());
        console.log("🕐 Hora actual:", new Date(now).toLocaleString());

        if (exp < now) {
          console.error("❌ Token expirado!");
          toast.error(
            "Tu sesión ha expirado. Por favor, inicia sesión nuevamente."
          );
          return;
        }
      }
    } catch (e) {
      console.error("Error validating token:", e);
    }

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("subido_por", role);
    Array.from(archivos).forEach((file) => formData.append("files", file));

    const toastId = toast.loading("📤 Enviando archivos...");
    setIsSubmitting(true);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      toast.dismiss(toastId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Error al enviar los archivos");
      }

      toast.success("✅ Archivos enviados correctamente");
      setTitulo("");
      setArchivos(null);
      setOpen(false);
      onSuccess?.();
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

      {showNewButton && esDelegado && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Avance
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl shadow-lg border dark:border-slate-700 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95">
            <DialogHeader>
              <DialogTitle className="text-slate-900 dark:text-white">
                Nuevo Avance
              </DialogTitle>
              <DialogDescription className="text-slate-600 dark:text-slate-400">
                Ingresa un título y adjunta los archivos correspondientes.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-2">
              {/* Título */}
              <div className="grid gap-2">
                <Label
                  htmlFor="titulo"
                  className="text-slate-700 dark:text-slate-300"
                >
                  Título
                </Label>
                <Input
                  id="titulo"
                  placeholder="Ej. Informe semanal"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  disabled={isSubmitting}
                  className="bg-white dark:bg-slate-800 dark:text-white dark:border-slate-600"
                />
              </div>

              {/* Archivos */}
              <div className="grid gap-2">
                <Label
                  htmlFor="archivos"
                  className="text-slate-700 dark:text-slate-300"
                >
                  Archivos
                </Label>
                <Input
                  id="archivos"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  disabled={isSubmitting}
                  className="bg-white dark:bg-slate-800 dark:text-white dark:border-slate-600"
                />

                {archivos && archivos.length > 0 && (
                  <div className="mt-2 flex flex-col gap-1 border rounded-md p-2 bg-muted/30 dark:bg-slate-800 dark:border-slate-700 max-h-40 overflow-y-auto">
                    {Array.from(archivos).map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded px-2 py-1 bg-white dark:bg-slate-700 shadow-sm border dark:border-slate-600 text-sm text-slate-800 dark:text-white"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Paperclip className="w-3 h-3 text-gray-500 dark:text-slate-300" />
                          <span className="truncate max-w-60">{file.name}</span>
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
                className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 dark:bg-slate-800"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
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
