"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Paperclip, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { toast } from "sonner";

import { DeliveryDetailDrawer } from "./delivery-detail-drawer";
import type { Documento } from "@/services/interface/asuntos";

interface SubjectRowProps {
  id: string;
  title: string;
  dueDate: string;
  status: "entregado" | "en-proceso" | "terminado";
  document?: string;
  idAsesoramiento?: number;
  subidoPor?: string;
  onEdit?: (newTitle: string, updatedFiles?: string[]) => void;
  onDelete?: () => void;
  showActions?: boolean;
  expandedContent?: React.ReactNode;
  // Optional fields from Asunto API for DeliveryDetailDrawer
  titulo_asesor?: string | null;
  profesion_asesoria?: string;
  fecha_revision?: string | null;
  fecha_estimada?: string | null;
  fecha_terminado?: string | null;
  documentos?: Documento[];
}

export function SubjectRow({
  id,
  title,
  dueDate,
  status,
  document,
  onEdit,
  onDelete,
  titulo_asesor,
  profesion_asesoria,
  fecha_revision,
  fecha_estimada,
  fecha_terminado,
  documentos,
}: SubjectRowProps) {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [archivos, setArchivos] = useState<FileList | null>(null);

  // Archivos existentes: robusto contra "undefined"
  const [existingFiles, setExistingFiles] = useState<string[]>([]);

  useEffect(() => {
    if (openEdit && existingFiles.length === 0 && document) {
      setTimeout(() => {
        setExistingFiles(document.split(",").map((d) => d.trim()));
      }, 0);
    }
  }, [openEdit, document, existingFiles.length]);

  useEffect(() => {
    if (document && !openEdit) {
      setTimeout(() => {
        setExistingFiles(document.split(",").map((d) => d.trim()));
      }, 0);
    }
  }, [document, openEdit]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setArchivos(e.target.files);
  };

  const handleRemoveExisting = (index: number) => {
    const updated = [...existingFiles];
    updated.splice(index, 1);
    setExistingFiles(updated);
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) {
      toast.error("El título no puede estar vacío");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("titulo", editTitle);
      if (archivos) {
        Array.from(archivos).forEach((file) => {
          formData.append("files", file);
        });
      }
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/asuntos/estudiante/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      toast.success("✅ Asunto actualizado correctamente");
      console.log("Respuesta del servidor:", response.data);
      onEdit?.(editTitle, existingFiles);
      setOpenEdit(false);
    } catch (error) {
      console.error("❌ Error al actualizar el asunto:", error);
      toast.error("Error al actualizar el asunto");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/asuntos/${id}`
      );

      toast.success("Asunto eliminado correctamente");
      onDelete?.(); // notificar al padre
      setOpenDelete(false);
    } catch (error) {
      console.error("Error eliminando asunto:", error);
      toast.error("No se pudo eliminar el asunto");
    }
  };

  // Use documentos from API if available, otherwise parse from document string
  const documents: Documento[] =
    documentos ||
    (document
      ? document.split(",").map((d) => ({
          nombre: d.trim(),
          ruta: d.trim(),
          subido_por: "estudiante",
          fecha: new Date().toISOString(),
        }))
      : []);

  // Helper function to map SubjectRow props to DeliveryDetailDrawer props
  const mapAsuntoToDrawerProps = () => ({
    titulo: title,
    titulo_asesor: titulo_asesor || undefined,
    profesion_asesoria: profesion_asesoria || "Asesoría General",
    estado: status,
    fecha_entrega: dueDate,
    fecha_revision: fecha_revision || undefined,
    fecha_estimada: fecha_estimada || undefined,
    fecha_terminado: fecha_terminado || undefined,
    documentos: documents,
  });

  return (
    <>
      <DeliveryDetailDrawer
        {...mapAsuntoToDrawerProps()}
        onEdit={() => setOpenEdit(true)}
        onDelete={() => setOpenDelete(true)}
      />
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-md rounded-xl shadow-lg border bg-white dark:bg-slate-900 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95">
          <DialogHeader className="border-b pb-3 dark:border-slate-700">
            <DialogTitle className="text-slate-900 dark:text-white">
              Editar Asunto
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-5 py-4">
            <div className="grid gap-2">
              <Label
                htmlFor="titulo"
                className="text-slate-700 dark:text-slate-200"
              >
                Título
              </Label>
              <Input
                id="titulo"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Ej. Informe semanal"
                className="bg-white dark:bg-slate-800 dark:text-white dark:border-slate-700"
              />
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="archivos"
                className="text-slate-700 dark:text-slate-200"
              >
                Archivos
              </Label>

              {existingFiles.length > 0 && (
                <div className="flex flex-col gap-2 rounded-md border bg-gray-50 dark:bg-slate-800 p-2 text-sm text-gray-700 dark:text-slate-200 dark:border-slate-700">
                  {existingFiles.map((doc, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-md bg-white dark:bg-slate-700 border px-2 py-1 shadow-sm dark:border-slate-600"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Paperclip className="w-4 h-4 text-blue-500" />
                        <span className="truncate max-w-[220px]">{doc}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveExisting(i)}
                        className="text-gray-400 hover:text-red-500 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <Input
                id="archivos"
                type="file"
                multiple
                onChange={handleFileChange}
                className="bg-white dark:bg-slate-800 dark:text-white dark:border-slate-700"
              />
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button
              onClick={handleSaveEdit}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Guardar
            </Button>
            <Button
              variant="outline"
              onClick={() => setOpenEdit(false)}
              className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 dark:bg-slate-800"
            >
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar asunto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/80"
              onClick={handleDelete}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
