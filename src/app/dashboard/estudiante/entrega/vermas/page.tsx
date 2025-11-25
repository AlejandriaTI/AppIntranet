"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { SubjectCard } from "@/components/estudiantes/entrega/vermas/subject-card";
import { SubjectDetailDrawer } from "@/components/estudiantes/entrega/vermas/subject-detail-drawer";
import { Header } from "@/components/estudiantes/entrega/vermas/header";
import { asuntosServices } from "@/services/api/asuntos.services";
import { Asunto } from "@/services/interface/asuntos";

function VerMasContent() {
  const searchParams = useSearchParams();
  const selectedAsesoriaId = searchParams.get("id_asesoria");

  const [asuntos, setAsuntos] = useState<Asunto[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Asunto | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedAsesoriaId) {
      setLoading(false);
      return;
    }

    const fetchAsuntos = async () => {
      try {
        setLoading(true);
        const data = await asuntosServices.getAsuntosGlobal(
          Number(selectedAsesoriaId)
        );
        setAsuntos(data);
      } catch (err) {
        console.error("❌ Error al cargar asuntos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAsuntos();
  }, [selectedAsesoriaId]);

  const handleSelectSubject = (subject: Asunto) => {
    setSelectedSubject(subject);
    setShowDrawer(true);
  };

  const handleCloseDrawer = () => {
    setShowDrawer(false);
    setSelectedSubject(null);
  };

  return (
    <div className="min-h-screen dark:from-slate-950 dark:to-slate-900">
      <Header />

      <section className="pb-8">
        <div className="max-w-2xl mx-auto px-4 pt-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              {showDrawer && (
                <button
                  onClick={handleCloseDrawer}
                  className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-900 dark:text-white"
                  aria-label="Volver atrás"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Mis Asuntos
              </h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              Total de asuntos: {asuntos.length}
            </p>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
              </div>
            ) : !selectedAsesoriaId ? (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                <p>No se ha seleccionado una asesoría.</p>
                <p className="text-sm mt-2">
                  Por favor, regresa e intenta nuevamente.
                </p>
              </div>
            ) : asuntos.length > 0 ? (
              asuntos.map((subject) => (
                <SubjectCard
                  key={subject.id_asunto}
                  subject={subject}
                  onViewMore={() => handleSelectSubject(subject)}
                />
              ))
            ) : (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                <p>No se encontraron asuntos registrados.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {showDrawer && selectedSubject && (
        <SubjectDetailDrawer
          subject={selectedSubject}
          onClose={handleCloseDrawer}
        />
      )}
    </div>
  );
}

export default function VerMas() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <VerMasContent />
    </Suspense>
  );
}
