"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Video,
  Clock,
  FileText,
  AlertCircle,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { calendarioServices } from "@/services/api/calendario.services";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useAsesorias } from "@/hooks/useAsesoria";

interface DayData {
  day: number;
  currentMonth: boolean;
  isToday: boolean;
}
// tipo unificado de evento
interface CalendarioEvento {
  id: string | number;
  titulo: string;
  tipo: "reunion" | "contrato" | "asunto";
  fecha?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  fecha_entregado?: string | null;
  fecha_revision?: string | null;
  fecha_estimada?: string | null;
  fecha_terminado?: string | null;
  estado?: string;
  enlace_zoom?: string;
  servicio?: string;
  modalidad?: string;
}

export default function CalendarioEstudiante() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // octubre = 9
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [calendarDays, setCalendarDays] = useState<DayData[]>([]);
  const [monthName, setMonthName] = useState("");
  const [dayName, setDayName] = useState("");

  const [eventos, setEventos] = useState<{
    reuniones: CalendarioEvento[];
    contratos: CalendarioEvento[];
    asuntos: CalendarioEvento[];
  }>({
    reuniones: [],
    contratos: [],
    asuntos: [],
  });

  const user = useSelector((state: RootState) => state.auth.user);
  const idCliente = user?.id_cliente;
  const { asesorias, selectedAsesoriaId, setSelectedAsesoriaId } =
    useAsesorias(idCliente);

  const [eventosDia, setEventosDia] = useState<CalendarioEvento[]>([]);
  const months = useMemo(
    () => [
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
    ],
    []
  );

  const daysOfWeek = useMemo(
    () => ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    []
  );
  // ✅ Funciones definidas antes de uso
  const updateSelectedDayInfo = useCallback(
    (day: number) => {
      const date = new Date(selectedYear, selectedMonth, day);
      const options: Intl.DateTimeFormatOptions = { weekday: "long" };
      const dName = new Intl.DateTimeFormat("es-ES", options).format(date);
      setDayName(dName.charAt(0).toUpperCase() + dName.slice(1));
    },
    [selectedMonth, selectedYear]
  );

  const fetchEventosDia = useCallback(
    (eventosData: {
      reuniones: CalendarioEvento[];
      contratos: CalendarioEvento[];
      asuntos: CalendarioEvento[];
    }) => {
      const getDateParts = (dateString?: string | null) => {
        if (!dateString) return null;
        const d = new Date(dateString);
        return {
          day: d.getDate(),
          month: d.getMonth(),
          year: d.getFullYear(),
        };
      };

      const eventosDelDia: CalendarioEvento[] = [
        ...eventosData.reuniones.filter((evento) => {
          const d = getDateParts(evento.fecha);
          return (
            d &&
            d.day === selectedDay &&
            d.month === selectedMonth &&
            d.year === selectedYear
          );
        }),
        ...eventosData.contratos.filter((evento) => {
          const inicio = getDateParts(evento.fecha_inicio);
          const fin = getDateParts(evento.fecha_fin);
          return (
            (inicio &&
              inicio.day === selectedDay &&
              inicio.month === selectedMonth &&
              inicio.year === selectedYear) ||
            (fin &&
              fin.day === selectedDay &&
              fin.month === selectedMonth &&
              fin.year === selectedYear)
          );
        }),
        ...eventosData.asuntos.filter((evento) => {
          const fechas = [
            getDateParts(evento.fecha_entregado),
            getDateParts(evento.fecha_revision),
            getDateParts(evento.fecha_terminado),
            getDateParts(evento.fecha_estimada),
          ];
          return fechas.some(
            (d) =>
              d &&
              d.day === selectedDay &&
              d.month === selectedMonth &&
              d.year === selectedYear
          );
        }),
      ];

      setEventosDia(eventosDelDia);
    },
    [selectedDay, selectedMonth, selectedYear]
  );

  const generateCalendar = useCallback(() => {
    const firstDay = new Date(selectedYear, selectedMonth, 1);
    const lastDay = new Date(selectedYear, selectedMonth + 1, 0);
    const startDay = (firstDay.getDay() + 6) % 7;
    const totalDays = lastDay.getDate();
    const prevMonthDays = new Date(selectedYear, selectedMonth, 0).getDate();
    const today = new Date();
    const days: DayData[] = [];

    for (let i = startDay - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      days.push({
        day,
        currentMonth: false,
        isToday:
          day === today.getDate() &&
          selectedMonth - 1 === today.getMonth() &&
          selectedYear === today.getFullYear(),
      });
    }

    for (let i = 1; i <= totalDays; i++) {
      days.push({
        day: i,
        currentMonth: true,
        isToday:
          i === today.getDate() &&
          selectedMonth === today.getMonth() &&
          selectedYear === today.getFullYear(),
      });
    }

    const totalFilled = days.length;
    for (let i = 1; i <= 35 - totalFilled; i++) {
      days.push({
        day: i,
        currentMonth: false,
        isToday:
          i === today.getDate() &&
          selectedMonth + 1 === today.getMonth() &&
          selectedYear === today.getFullYear(),
      });
    }

    setCalendarDays(days);
    setMonthName(months[selectedMonth]);
    updateSelectedDayInfo(selectedDay);
  }, [selectedMonth, selectedYear, selectedDay, months, updateSelectedDayInfo]);

  // 🔵 Cargar eventos reales del servicio
  useEffect(() => {
    if (!selectedAsesoriaId) return;

    const controller = new AbortController();

    const fetchEventos = async () => {
      try {
        const data = await calendarioServices.getEventosCalendarioService(
          selectedAsesoriaId
        );

        const eventosConTipo = {
          reuniones: (data.reuniones || []).map((r) => ({
            ...r,
            id: String(r.id),
            tipo: "reunion" as const,
          })),
          contratos: (data.contratos || []).map((c) => ({
            ...c,
            id: String(c.id),
            titulo: c.servicio, // 👈 usamos servicio como título
            tipo: "contrato" as const,
          })),
          asuntos: (data.asuntos || []).map((a) => ({
            ...a,
            id: String(a.id),
            tipo: "asunto" as const,
          })),
        };

        setEventos(eventosConTipo);
        fetchEventosDia(eventosConTipo);
      } catch (error: unknown) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error(
            "Error al obtener eventos del calendario:",
            error.message
          );
        }
      }
    };

    fetchEventos();

    return () => {
      controller.abort();
      setEventosDia([]);
    };
  }, [
    selectedAsesoriaId,
    selectedYear,
    selectedMonth,
    selectedDay,
    fetchEventosDia,
  ]);
  useEffect(() => {
    const id = requestAnimationFrame(() => generateCalendar());
    return () => cancelAnimationFrame(id);
  }, [selectedMonth, selectedYear, generateCalendar]);

  // ✅ Resto de helpers visuales
  const handleDayClick = (day: number, isCurrentMonth: boolean) => {
    if (isCurrentMonth) {
      setSelectedDay(day);
      updateSelectedDayInfo(day);
    }
  };

  const getEventIcon = (tipo: string) => {
    switch (tipo) {
      case "reunion":
        return <Video className="w-4 h-4" />;
      case "contrato":
        return <FileText className="w-4 h-4" />;
      case "asunto":
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const EventIndicators = ({
    reuniones,
    contratos,
    asuntosDelDia,
  }: {
    reuniones: CalendarioEvento[];
    contratos: CalendarioEvento[];
    asuntosDelDia: CalendarioEvento[];
  }) => {
    // función auxiliar para determinar color según estado
    const getAsuntoColor = (estado?: string | null) => {
      switch (estado) {
        case "proceso":
          return "bg-yellow-500";
        case "entregado":
          return "bg-blue-500";
        case "terminado":
          return "bg-green-500";
        default:
          return "bg-gray-400";
      }
    };

    return (
      <>
        {/* 📱 VISTA MÓVIL */}
        <div className="md:hidden flex flex-wrap gap-1 justify-center mt-1 min-h-2.5">
          {reuniones.length > 0 && (
            <div
              className="w-1.5 h-1.5 rounded-full bg-blue-500 border border-white shadow-[0_0_2px_rgba(0,0,0,0.3)]"
              title="Reunión"
            />
          )}
          {contratos.length > 0 && (
            <div
              className="w-1.5 h-1.5 rounded-full bg-green-500 border border-white shadow-[0_0_2px_rgba(0,0,0,0.3)]"
              title="Contrato"
            />
          )}
          {asuntosDelDia.map((a) => (
            <div
              key={a.id}
              className={`w-1.5 h-1.5 rounded-full border border-white shadow-[0_0_2px_rgba(0,0,0,0.3)] ${getAsuntoColor(
                a.estado
              )}`}
              title={a.estado || "Asunto"}
            />
          ))}
        </div>

        {/* 💻 VISTA ESCRITORIO */}
        <div className="hidden md:flex flex-wrap gap-1 justify-center mt-1">
          {reuniones.length > 0 && <Video className="w-4 h-4 text-blue-500" />}
          {contratos.length > 0 && (
            <FileText className="w-4 h-4 text-green-500" />
          )}
          {asuntosDelDia.map((a) => (
            <Clock
              key={a.id}
              className={`w-4 h-4 ${getAsuntoColor(a.estado).replace(
                "bg-",
                "text-"
              )}`}
            />
          ))}
        </div>
      </>
    );
  };

  // Render calendario
  const renderCalendarDays = () => {
    const weeks = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      weeks.push(calendarDays.slice(i, i + 7));
    }

    return weeks.map((week, weekIndex) => (
      <div key={weekIndex} className="grid grid-cols-7 gap-2">
        {week.map((dayData, dayIndex) => {
          const isSelected =
            dayData.currentMonth && dayData.day === selectedDay;
          const isToday = dayData.isToday;

          const eventosEnElDia = eventos.reuniones.filter((evento) => {
            const eventDate = new Date(evento.fecha || "");
            return (
              eventDate.getUTCDate() === dayData.day &&
              eventDate.getUTCMonth() === selectedMonth &&
              eventDate.getUTCFullYear() === selectedYear
            );
          });

          const eventosDeContrato = eventos.contratos.filter((evento) => {
            const inicio = new Date(evento.fecha_inicio || "");
            const fin = new Date(evento.fecha_fin || "");
            return (
              (inicio.getUTCDate() === dayData.day &&
                inicio.getUTCMonth() === selectedMonth &&
                inicio.getUTCFullYear() === selectedYear) ||
              (fin.getUTCDate() === dayData.day &&
                fin.getUTCMonth() === selectedMonth &&
                fin.getUTCFullYear() === selectedYear)
            );
          });

          const eventosDeAsunto = eventos.asuntos.filter((evento) => {
            const fechas = [
              new Date(evento.fecha_entregado || ""),
              new Date(evento.fecha_revision || ""),
              new Date(evento.fecha_terminado || ""),
              new Date(evento.fecha_estimada || ""),
            ];
            return fechas.some(
              (d) =>
                d.getDate() === dayData.day &&
                d.getMonth() === selectedMonth &&
                d.getFullYear() === selectedYear
            );
          });

          const tieneEventos =
            eventosEnElDia.length > 0 ||
            eventosDeContrato.length > 0 ||
            eventosDeAsunto.length > 0;

          const isActive = isToday || isSelected;
          const bgClass = isToday
            ? "bg-blue-500 text-white"
            : isSelected
            ? "bg-gray-200 text-gray-900"
            : tieneEventos
            ? "bg-gray-100 text-gray-900"
            : "text-gray-400";

          return (
            <button
              key={dayIndex}
              onClick={() => handleDayClick(dayData.day, dayData.currentMonth)}
              className={`aspect-square p-2 rounded-lg font-semibold text-sm transition-all ${
                dayData.currentMonth
                  ? "cursor-pointer hover:bg-gray-100"
                  : "cursor-default"
              } ${
                isActive
                  ? bgClass
                  : dayData.currentMonth
                  ? "text-gray-700"
                  : "text-gray-300"
              }`}
            >
              <div className="flex flex-col items-center justify-center h-full gap-1">
                <span className="text-xs md:text-sm">{dayData.day}</span>
                {tieneEventos && (
                  <EventIndicators
                    reuniones={eventosEnElDia}
                    contratos={eventosDeContrato}
                    asuntosDelDia={eventosDeAsunto}
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>
    ));
  };

  const getEventColor = (tipo: string, estado?: string | null) => {
    if (tipo === "asunto") {
      switch (estado) {
        case "proceso":
          return "bg-yellow-50 border-yellow-200";
        case "entregado":
          return "bg-blue-50 border-blue-200";
        case "terminado":
          return "bg-green-50 border-green-200";
        default:
          return "bg-gray-50 border-gray-200";
      }
    }

    switch (tipo) {
      case "reunion":
        return "bg-blue-50 border-blue-200";
      case "contrato":
        return "bg-green-50 border-green-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 🗓️ Panel del calendario */}
          <div className="lg:col-span-2">
            <Card className="p-4 md:p-6 shadow-lg border border-gray-200 dark:border-gray-800 dark:bg-gray-900 transition-colors duration-300">
              {/* Controles superiores */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setSelectedMonth(Math.max(0, selectedMonth - 1))
                    }
                    className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setSelectedMonth(Math.min(11, selectedMonth + 1))
                    }
                    className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>

                <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 order-first md:order-0 w-full md:w-auto text-center">
                  {monthName} {selectedYear}
                </h2>

                <div className="flex gap-2 flex-wrap md:flex-nowrap justify-center md:justify-end">
                  <Select
                    value={selectedMonth.toString()}
                    onValueChange={(val) =>
                      setSelectedMonth(Number.parseInt(val))
                    }
                  >
                    <SelectTrigger className="w-32 bg-white dark:bg-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700">
                      <SelectValue placeholder="Mes" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      {months.map((month, index) => (
                        <SelectItem key={month} value={index.toString()}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={selectedYear.toString()}
                    onValueChange={(val) =>
                      setSelectedYear(Number.parseInt(val))
                    }
                  >
                    <SelectTrigger className="w-32 bg-white dark:bg-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700">
                      <SelectValue placeholder="Año" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      {Array.from({ length: 6 }, (_, i) => 2030 - i).map(
                        (year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator className="mb-4 dark:bg-gray-700" />

              {/* Días de la semana */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {daysOfWeek.map((day) => (
                  <div
                    key={day}
                    className="text-center font-semibold text-gray-600 dark:text-gray-400 text-xs md:text-sm py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Celdas del calendario */}
              {renderCalendarDays()}
            </Card>
          </div>

          {/* 📅 Panel lateral de detalles */}
          <div>
            <Card className="p-4 md:p-6 flex flex-col h-full shadow-lg border border-gray-200 dark:border-gray-800 dark:bg-gray-900 transition-colors duration-300">
              <div className="mb-6">
                <Label
                  htmlFor="asesoria"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
                >
                  Asesoría
                </Label>
                <Select
                  value={selectedAsesoriaId ? String(selectedAsesoriaId) : ""}
                  onValueChange={(value) =>
                    setSelectedAsesoriaId(Number(value))
                  } // 👈 conversión segura
                >
                  <SelectTrigger
                    id="asesoria"
                    className="bg-white dark:bg-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                  >
                    <SelectValue placeholder="Selecciona una asesoría" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    {asesorias.map((asesoria) => (
                      <SelectItem
                        key={asesoria.id}
                        value={asesoria.id.toString()}
                      >
                        {asesoria.profesion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-linear-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-950/60 rounded-xl p-4 mb-6 text-center">
                <p className="text-xs md:text-sm text-blue-700 dark:text-blue-300 font-medium mb-1">
                  {dayName}
                </p>
                <h3 className="text-3xl md:text-4xl font-bold text-blue-900 dark:text-blue-100">
                  {selectedDay}
                </h3>
                <p className="text-base md:text-lg text-blue-700 dark:text-blue-400 font-semibold">
                  {monthName}
                </p>
              </div>

              <Separator className="mb-4 dark:bg-gray-700" />

              <div className="flex-1 overflow-y-auto">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 text-sm md:text-base">
                  Eventos del día
                </h4>
                {eventosDia.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      No hay eventos para este día
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {eventosDia.map((evento) => (
                      <Card
                        key={evento.id}
                        className={`p-4 border-2 transition-colors duration-300 ${getEventColor(
                          evento.tipo
                        )} dark:bg-gray-800`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1 hidden md:block text-gray-600 dark:text-gray-300">
                            {getEventIcon(evento.tipo)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                              {evento.titulo}
                            </h5>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {evento.fecha &&
                                new Date(evento.fecha).toLocaleDateString(
                                  "es-ES"
                                )}
                              {evento.fecha_inicio &&
                                new Date(
                                  evento.fecha_inicio
                                ).toLocaleDateString("es-ES")}
                            </p>
                            {evento.estado && (
                              <Badge
                                variant="outline"
                                className="mt-2 text-xs text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
                              >
                                {evento.estado}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
