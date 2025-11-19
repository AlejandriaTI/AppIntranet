"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Paperclip, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer";
import axios from "axios";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

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
}

export function SubjectRow({
  id,
  title,
  dueDate,
  status,
  document,
  idAsesoramiento,
  subidoPor,
  onEdit,
  onDelete,
  showActions,
}: SubjectRowProps) {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [archivos, setArchivos] = useState<FileList | null>(null);

  // Archivos existentes: robusto contra "undefined"
  const [existingFiles, setExistingFiles] = useState<string[]>([]);
  const user = useSelector((state: RootState) => state.auth.user);
  const userRole = user?.nombre || user?.rol || "estudiante";

  useEffect(() => {
    if (openEdit && existingFiles.length === 0 && document) {
      setTimeout(() => {
        setExistingFiles(document.split(",").map((d) => d.trim()));
      }, 0);
    }
  }, [openEdit]);

  useEffect(() => {
    if (document && !openEdit) {
      setTimeout(() => {
        setExistingFiles(document.split(",").map((d) => d.trim()));
      }, 0);
    }
  }, [document]);

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

  const statusConfig = {
    entregado: { label: "Entregado", variant: "default" as const },
    "en-proceso": { label: "En Proceso", variant: "secondary" as const },
    terminado: { label: "Terminado", variant: "outline" as const },
  };

  return (
    <>
      {/* 🌍 Escritorio */}
      <div className="hidden md:flex items-center justify-between gap-4 rounded-lg border bg-card p-4 hover:bg-accent/50 transition-colors">
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{title}</p>
          {document && (
            <p className="text-sm text-muted-foreground truncate">{document}</p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {dueDate}
          </span>
          <Badge variant={statusConfig[status].variant}>
            {statusConfig[status].label}
          </Badge>

          {showActions && (
            <>
              {/* ✏️ Editar */}
              <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md rounded-xl shadow-lg border bg-white">
                  <DialogHeader className="border-b pb-3">
                    <DialogTitle>Editar Asunto</DialogTitle>
                  </DialogHeader>

                  <div className="grid gap-5 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="titulo">Título</Label>
                      <Input
                        id="titulo"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Ej. Informe semanal"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="archivos">Archivos</Label>
                      {existingFiles.length > 0 && (
                        <div className="flex flex-col gap-2 rounded-md border bg-gray-50 p-2 text-sm text-gray-700">
                          {existingFiles.map((doc, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between rounded-md bg-white border px-2 py-1 shadow-sm"
                            >
                              <div className="flex items-center gap-2 truncate">
                                <Paperclip className="w-4 h-4 text-blue-500" />
                                <span className="truncate max-w-[220px]">
                                  {doc}
                                </span>
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
                      />
                    </div>
                  </div>

                  <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2">
                    <Button onClick={handleSaveEdit}>Guardar</Button>
                    <Button
                      variant="outline"
                      onClick={() => setOpenEdit(false)}
                    >
                      Cancelar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* 🗑️ Eliminar */}
              <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
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
          )}
        </div>
      </div>

      {/* 📱 Móvil */}
      <div className="flex flex-col gap-2 md:hidden rounded-lg border bg-card p-4 hover:bg-accent/50 transition-colors">
        <div className="flex justify-between items-center">
          <Drawer>
            <DrawerTrigger asChild>
              <button className="text-left flex-1">
                <p className="font-medium truncate">{title}</p>
                <p className="text-sm text-muted-foreground">
                  Fecha: {dueDate}
                </p>
              </button>
            </DrawerTrigger>

            <DrawerContent className="p-6 rounded-t-2xl h-[70vh]">
              <DrawerHeader>
                <DrawerTitle className="text-lg font-semibold">
                  {title}
                </DrawerTitle>
                <DrawerDescription className="text-sm text-gray-500">
                  Fecha de entrega: {dueDate}
                </DrawerDescription>
              </DrawerHeader>

              <div className="mt-4 text-sm space-y-3">
                <p>
                  <strong>Estado:</strong> {statusConfig[status].label}
                </p>
                {existingFiles.length > 0 && (
                  <div>
                    <p className="font-medium mb-1">Archivos:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {existingFiles.map((doc, i) => (
                        <li key={i} className="truncate text-blue-600">
                          <a
                            href={doc}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {doc.split("/").pop()}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <DrawerClose asChild>
                  <Button variant="outline">Cerrar</Button>
                </DrawerClose>
              </div>
            </DrawerContent>
          </Drawer>

          {showActions && (
            <div className="flex items-center gap-2 ml-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOpenEdit(true)}
                className="h-8 w-8 p-0"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOpenDelete(true)}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
