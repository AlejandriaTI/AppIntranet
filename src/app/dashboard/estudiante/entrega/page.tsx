"use client";

import { useState, useEffect } from "react";
import { DeliveryHeader } from "@/components/estudiantes/entrega/delivery-header";
import { TabsSection } from "@/components/estudiantes/entrega/tabs-section";
import { SubjectsList } from "@/components/estudiantes/entrega/subjects-list";
import { DocumentsList } from "@/components/estudiantes/entrega/documents-list";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useAsesorias } from "@/hooks/useAsesoria";
import { asuntosServices } from "@/services/api/asuntos.services";
import { Asunto, AsesoramientoDocumento } from "@/services/interface/asuntos";
import { downloadFile } from "@/utils/downloadFile";
import Link from "next/link";

export default function DeliveriesPage() {
  const [asuntos, setAsuntos] = useState<Asunto[]>([]);
  const [documents, setDocuments] = useState<AsesoramientoDocumento[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "en-proceso" | "entregado" | "terminado"
  >("all");

  const user = useSelector((state: RootState) => state.auth.user);
  const idCliente = user?.id_cliente;
  const { asesorias, loading, selectedAsesoriaId, setSelectedAsesoriaId } =
    useAsesorias(idCliente);

  useEffect(() => {
    if (!selectedAsesoriaId) return;

    const fetchAsuntos = async () => {
      try {
        const data = await asuntosServices.getAsuntosGlobal(selectedAsesoriaId);
        setAsuntos(data);
      } catch (err) {
        console.error("❌ Error al cargar asuntos:", err);
      }
    };
    fetchAsuntos();
  }, [selectedAsesoriaId]);

  useEffect(() => {
    if (!selectedAsesoriaId) return;
    const fetchDocuments = async () => {
      try {
        console.log(
          "🔍 Fetching documents for asesoriaId:",
          selectedAsesoriaId
        );
        const docs = await asuntosServices.getDocumentsAsesoria(
          selectedAsesoriaId
        );
        console.log("✅ Documents received:", docs);
        setDocuments(docs);
      } catch (err) {
        console.error("❌ Error al cargar documentos:", err);
      }
    };
    fetchDocuments();
  }, [selectedAsesoriaId]);

  const handleEditSubject = (id: string) => console.log("Editar asunto:", id);
  const handleDeleteSubject = (id: string) =>
    console.log("Eliminar asunto:", id);

  const filteredAsuntos = asuntos.filter((asunto) => {
    const matchesText = asunto.titulo
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    if (filterStatus === "all") return matchesText;
    return matchesText && asunto.estado === filterStatus;
  });

  const mappedDocuments = documents.map((doc) => ({
    id: doc.id.toString(),
    tipo: "asesor" as const,
    title: doc.titulo,
    date: new Date(doc.fecha).toLocaleDateString(),
    status: "Disponible",
    documentos: doc.archivos.map((file) => ({
      name: file.url,
      url: file.signedUrl,
    })),
  }));

  console.log("📄 Documents from API:", documents);
  console.log("📋 Mapped documents:", mappedDocuments);

  return (
    <section className="container mx-auto py-8 px-4 space-y-8">
      <DeliveryHeader
        asesoriaId={selectedAsesoriaId ?? 0}
        showNewButton={!!selectedAsesoriaId} // solo se muestra si hay asesoría elegida
      />
      {/* 🎓 Selección de asesoría */}
      <Card className="p-6">
        <div className="space-y-4">
          <label className="text-sm font-medium">Selecciona una asesoría</label>
          <Select
            value={selectedAsesoriaId ? String(selectedAsesoriaId) : ""}
            onValueChange={(value) => setSelectedAsesoriaId(Number(value))}
          >
            <SelectTrigger className="bg-white border-gray-300">
              <SelectValue placeholder="Selecciona una asesoría" />
            </SelectTrigger>
            <SelectContent>
              {asesorias.map((a) => (
                <SelectItem key={a.id} value={a.id.toString()}>
                  {a.profesion}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* 📂 Tabs principales */}
      <TabsSection
        tabs={[
          {
            id: "subjects",
            label: "Asuntos",
            content: (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Avances en curso
                </h3>

                {/* 🔍 Buscador + Filtro */}
                <div className="flex items-center gap-3 w-full">
                  <Input
                    type="search"
                    placeholder="Buscar asunto..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 min-w-0"
                  />

                  <Select
                    value={filterStatus}
                    onValueChange={(v) =>
                      setFilterStatus(v as typeof filterStatus)
                    }
                  >
                    <SelectTrigger className="w-[140px] text-sm">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="en-proceso">En Proceso</SelectItem>
                      <SelectItem value="entregado">Entregado</SelectItem>
                      <SelectItem value="terminado">Terminado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 🟡 Pendientes */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Tus Avances</h3>
                    <Link
                      href="/dashboard/estudiante/entrega/vermas"
                      className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
                    >
                      Ver más
                    </Link>
                  </div>

                  <SubjectsList
                    asuntos={filteredAsuntos}
                    loading={loading}
                    onEdit={handleEditSubject}
                    onDelete={handleDeleteSubject}
                    showActions={true}
                  />
                </div>
              </div>
            ),
          },

          // 📄 Documentos
          {
            id: "documents",
            label: "Documentos",
            content: (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">Otros Documentos</h3>
                  <DocumentsList
                    documents={mappedDocuments}
                    loading={loading}
                    onDownload={downloadFile}
                  />
                </div>
              </div>
            ),
          },
        ]}
      />
    </section>
  );
}
