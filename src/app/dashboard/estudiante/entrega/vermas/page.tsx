"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { SubjectCard } from "@/components/estudiantes/entrega/vermas/subject-card";
import { SubjectDetailDrawer } from "@/components/estudiantes/entrega/vermas/subject-detail-drawer";
import { Header } from "@/components/estudiantes/entrega/vermas/header";
import {
  Filters,
  FilterPeriod,
} from "@/components/estudiantes/entrega/vermas/filters";
import { asuntosServices } from "@/services/api/asuntos.services";
import { Asunto } from "@/services/interface/asuntos";

const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

function VerMasContent() {
  const searchParams = useSearchParams();
  const selectedAsesoriaId = searchParams.get("id_asesoria");

  const [asuntos, setAsuntos] = useState<Asunto[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Asunto | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>("all");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>(
    undefined
  );

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

  // Obtener años disponibles de los asuntos
  const availableYears = useMemo(() => {
    const years = asuntos.map((asunto) =>
      new Date(asunto.fecha_principal).getFullYear()
    );
    return Array.from(new Set(years)).sort((a, b) => b - a);
  }, [asuntos]);

  // Filtrar asuntos según el período, año y mes seleccionado
  const filteredAsuntos = useMemo(() => {
    const now = new Date();

    return asuntos.filter((asunto) => {
      const asuntoDate = new Date(asunto.fecha_principal);
      const asuntoYear = asuntoDate.getFullYear();
      const asuntoMonth = asuntoDate.getMonth();

      // Primero filtrar por año si hay uno seleccionado
      if (selectedYear && asuntoYear !== selectedYear) {
        return false;
      }

      // Luego aplicar el filtro de período
      switch (filterPeriod) {
        case "specific-month": {
          // Filtrar por mes específico
          if (selectedMonth === undefined) return true;

          // Si hay un año seleccionado, filtrar por ese mes de ese año
          if (selectedYear) {
            return asuntoMonth === selectedMonth && asuntoYear === selectedYear;
          }
          // Si no hay año seleccionado, mostrar ese mes del año actual
          return (
            asuntoMonth === selectedMonth && asuntoYear === now.getFullYear()
          );
        }
        case "week": {
          // Si hay un año seleccionado diferente al actual, mostrar la última semana de ese año
          if (selectedYear && selectedYear !== now.getFullYear()) {
            const endOfYear = new Date(selectedYear, 11, 31); // 31 de diciembre
            const weekBeforeEndOfYear = new Date(endOfYear);
            weekBeforeEndOfYear.setDate(endOfYear.getDate() - 7);
            return asuntoDate >= weekBeforeEndOfYear && asuntoDate <= endOfYear;
          }
          // Si es el año actual o no hay año seleccionado, mostrar los últimos 7 días
          const weekAgo = new Date(now);
          weekAgo.setDate(now.getDate() - 7);
          return asuntoDate >= weekAgo && asuntoDate <= now;
        }
        case "month": {
          // Si hay un año seleccionado diferente al actual, mostrar el último mes de ese año
          if (selectedYear && selectedYear !== now.getFullYear()) {
            const startOfLastMonth = new Date(selectedYear, 11, 1); // 1 de diciembre
            const endOfYear = new Date(selectedYear, 11, 31); // 31 de diciembre
            return asuntoDate >= startOfLastMonth && asuntoDate <= endOfYear;
          }
          // Si es el año actual o no hay año seleccionado, mostrar el último mes
          const monthAgo = new Date(now);
          monthAgo.setMonth(now.getMonth() - 1);
          return asuntoDate >= monthAgo && asuntoDate <= now;
        }
        case "year": {
          // Si hay un año seleccionado, ya fue filtrado arriba
          // Si no hay año seleccionado, mostrar el año actual
          return selectedYear ? true : asuntoYear === now.getFullYear();
        }
        case "all":
        default:
          // Si seleccionó "todos" y un año específico, mostrar todo ese año
          // Si no hay año seleccionado, mostrar todos los asuntos
          return true;
      }
    });
  }, [asuntos, filterPeriod, selectedYear, selectedMonth]);

  const handleSelectSubject = (subject: Asunto) => {
    setSelectedSubject(subject);
    setShowDrawer(true);
  };

  const handleCloseDrawer = () => {
    setShowDrawer(false);
    setSelectedSubject(null);
  };

  // Generar descripción del filtro
  const getFilterDescription = () => {
    let desc = "";
    if (selectedYear) desc += ` (Año ${selectedYear})`;
    if (filterPeriod === "specific-month" && selectedMonth !== undefined) {
      desc += ` - ${MONTHS[selectedMonth]}`;
    }
    return desc;
  };

  return (
    <div className="min-h-screen dark:from-slate-950 dark:to-slate-900">
      <Header />

      <section className="pb-8">
        <div className="max-w-2xl mx-auto px-4 pt-8">
          <div className="mb-6">
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
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Mostrando {filteredAsuntos.length} de {asuntos.length} asuntos
              {getFilterDescription()}
            </p>

            {/* Filtros */}
            <Filters
              selectedPeriod={filterPeriod}
              onPeriodChange={setFilterPeriod}
              selectedYear={selectedYear || undefined}
              availableYears={availableYears}
              onYearChange={setSelectedYear}
              selectedMonth={selectedMonth}
              onMonthChange={setSelectedMonth}
            />
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
            ) : filteredAsuntos.length > 0 ? (
              filteredAsuntos.map((subject) => (
                <SubjectCard
                  key={subject.id_asunto}
                  subject={subject}
                  onViewMore={() => handleSelectSubject(subject)}
                />
              ))
            ) : (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                <p>No se encontraron asuntos con los filtros seleccionados.</p>
                <p className="text-sm mt-2">
                  Intenta cambiar los filtros para ver más resultados.
                </p>
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
