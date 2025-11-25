"use client";

import { Button } from "@/components/ui/button";
import { Calendar, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type FilterPeriod = "all" | "week" | "month" | "year" | "specific-month";

interface FiltersProps {
  selectedPeriod: FilterPeriod;
  onPeriodChange: (period: FilterPeriod) => void;
  selectedYear?: number;
  availableYears: number[];
  onYearChange: (year: number) => void;
  selectedMonth?: number;
  onMonthChange: (month: number) => void;
}

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

export function Filters({
  selectedPeriod,
  onPeriodChange,
  selectedYear,
  availableYears,
  onYearChange,
  selectedMonth,
  onMonthChange,
}: FiltersProps) {
  const getPeriodLabel = (period: FilterPeriod) => {
    switch (period) {
      case "all":
        return "Todos";
      case "week":
        return "Esta semana";
      case "month":
        return "Este mes";
      case "year":
        return "Este año";
      case "specific-month":
        return selectedMonth !== undefined
          ? MONTHS[selectedMonth]
          : "Seleccionar mes";
      default:
        return "Todos";
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      {/* Filtro por período */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
          >
            <Calendar className="w-4 h-4" />
            <span>{getPeriodLabel(selectedPeriod)}</span>
            <ChevronDown className="w-4 h-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-40">
          <DropdownMenuItem onClick={() => onPeriodChange("all")}>
            Todos
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onPeriodChange("week")}>
            Esta semana
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onPeriodChange("month")}>
            Este mes
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onPeriodChange("year")}>
            Este año
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onPeriodChange("specific-month")}>
            Por mes específico
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Filtro por mes específico (solo visible cuando se selecciona "Por mes específico") */}
      {selectedPeriod === "specific-month" && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
            >
              <span className="text-sm">
                {selectedMonth !== undefined
                  ? MONTHS[selectedMonth]
                  : "Seleccionar mes"}
              </span>
              <ChevronDown className="w-4 h-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40">
            {MONTHS.map((month, index) => (
              <DropdownMenuItem
                key={index}
                onClick={() => onMonthChange(index)}
              >
                {month}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Filtro por año (siempre visible si hay años disponibles) */}
      {availableYears.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
            >
              <span className="text-sm">
                {selectedYear || "Seleccionar año"}
              </span>
              <ChevronDown className="w-4 h-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-32">
            {availableYears.map((year) => (
              <DropdownMenuItem key={year} onClick={() => onYearChange(year)}>
                {year}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
