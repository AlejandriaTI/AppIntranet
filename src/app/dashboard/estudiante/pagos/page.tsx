"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useAsesorias } from "@/hooks/useAsesoria";
import { CalendarIcon } from "lucide-react";

interface Pago {
  id: string;
  titulo: string;
  monto: string;
  tipo_pago: string;
  fecha_pago: string;
  estado_pago: string;
}

export default function PagosEstudiante() {
  const [pagosAsesoria, setPagosAsesoria] = useState<Pago[]>([]);
  const [pagosServicios, setPagosServicios] = useState<Pago[]>([]);
  const user = useSelector((state: RootState) => state.auth.user);
  const idCliente = user?.id_cliente;

  const {
    asesorias,
    loading,
    error,
    selectedAsesoriaId,
    setSelectedAsesoriaId,
  } = useAsesorias(idCliente);

  useEffect(() => {
    if (!selectedAsesoriaId) return;

    const fetchPagos = async () => {
      try {
        const [asesoriaRes, serviciosRes] = await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/pagos/misAsesorias/${selectedAsesoriaId}`
          ).then((r) => r.json()),
          fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/pagos/misServicios/${selectedAsesoriaId}`
          ).then((r) => r.json()),
        ]);

        setPagosAsesoria(asesoriaRes);
        setPagosServicios(serviciosRes);
      } catch (error) {
        console.error("Error al obtener pagos:", error);
      }
    };

    fetchPagos();
  }, [selectedAsesoriaId]);

  const formatDate = (dateString: string) => {
    if (!dateString || dateString.includes("1969-12-31")) {
      return "Fecha no definida";
    }

    const isoString = dateString.replace(" ", "T");
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "Fecha no definida";

    return date.toLocaleDateString("es-ES", {
      timeZone: "UTC",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const calcularTotalCuotas = () => {
    const cuotas = pagosAsesoria.filter((p) => p.titulo?.includes("Cuota"));
    const total = cuotas.reduce(
      (sum, p) => sum + (parseFloat(p.monto) || 0),
      0
    );
    return total.toFixed(2);
  };

  const calcularDeudaPendiente = () => {
    const pendientes = pagosAsesoria.filter(
      (p) =>
        p.titulo?.includes("Cuota") &&
        ["por_pagar", "pendiente"].includes(p.estado_pago?.toLowerCase())
    );
    const total = pendientes.reduce(
      (sum, p) => sum + (parseFloat(p.monto) || 0),
      0
    );
    return total.toFixed(2);
  };

  const calcularTotalPagado = () => {
    const pagados = pagosAsesoria.filter(
      (p) =>
        (p.titulo?.includes("Cuota") || p.titulo?.includes("total")) &&
        p.estado_pago?.toLowerCase() === "pagado"
    );
    const total = pagados.reduce(
      (sum, p) => sum + (parseFloat(p.monto) || 0),
      0
    );
    return total.toFixed(2);
  };
  type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

  const getStatusStyle = (estado: string) => {
    const isPaid = estado?.toLowerCase() === "pagado";

    return {
      badge: (isPaid ? "default" : "destructive") as BadgeVariant,
      dotColor: isPaid ? "bg-green-500" : "bg-orange-500",
    };
  };

  if (loading) {
    return (
      <section className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Cargando asesorías...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Error: {error}</p>
      </section>
    );
  }
  const getNumeroCuota = (titulo: string) => {
    const match = titulo.match(/(\d+)/);
    return match ? match[1] : null;
  };

  return (
    <section className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Estado de Cuenta
          </h1>
          <p className="text-muted-foreground mt-2">
            Gestiona tus pagos y asesorías de forma clara y simple
          </p>
        </div>

        {/* Selector de Asesoría */}
        <Card className="border-0 shadow-sm bg-card/50">
          <CardContent className="pt-6">
            <Select
              value={selectedAsesoriaId ? String(selectedAsesoriaId) : ""}
              onValueChange={(value) => setSelectedAsesoriaId(Number(value))}
            >
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Selecciona una asesoría" />
              </SelectTrigger>
              <SelectContent>
                {asesorias.map((a) => (
                  <SelectItem key={a.id} value={String(a.id)}>
                    {a.profesion}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-card/50">
          <CardContent className="pt-6 space-y-4">
            {/* Total de Cuotas */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground font-medium">
                Total de Cuotas
              </p>
              <p className="text-2xl font-bold text-foreground">
                S/ {calcularTotalCuotas()}
              </p>
            </div>

            {/* Total Pagado */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                Total Pagado
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                S/ {calcularTotalPagado()}
              </p>
            </div>

            {/* Por Pagar */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-orange-700 dark:text-orange-300 font-medium">
                Por Pagar
              </p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                S/ {calcularDeudaPendiente()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="asesorias" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50">
            <TabsTrigger value="asesorias">Asesorías</TabsTrigger>
            <TabsTrigger value="servicios">Servicios</TabsTrigger>
          </TabsList>

          {/* Tab: Asesorías */}
          <TabsContent value="asesorias" className="mt-6">
            {pagosAsesoria.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pagosAsesoria.map((pago, i) => {
                  const statusStyle = getStatusStyle(pago.estado_pago);
                  const esCuota = pago.titulo.toLowerCase().includes("cuota");
                  const numeroCuota = getNumeroCuota(pago.titulo);

                  return (
                    <Card
                      key={i}
                      className="border-0 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <CardContent className="pt-6">
                        {esCuota ? (
                          /* ------------- DISEÑO ESPECIAL PARA CUOTAS ------------- */
                          <>
                            {/* Primera fila: Cuota - Monto */}
                            <div className="grid grid-cols-2">
                              {/* Izquierda */}
                              <div className="border-r border-gray-200 px-4 py-2">
                                <p className="text-sm text-muted-foreground">
                                  Cuota
                                </p>
                                <p className="text-3xl font-bold mt-1">
                                  {numeroCuota}
                                </p>
                              </div>

                              {/* Derecha */}
                              <div className="px-4 py-2">
                                <p className="text-sm text-muted-foreground">
                                  Monto
                                </p>
                                <p className="text-2xl font-bold">
                                  S/ {parseFloat(pago.monto).toFixed(2)}
                                </p>
                              </div>
                            </div>

                            {/* Estado */}
                            <div className="mt-4">
                              <Badge variant={statusStyle.badge}>
                                {pago.estado_pago === "por_pagar"
                                  ? "En proceso"
                                  : pago.estado_pago?.toLowerCase() === "pagado"
                                  ? "Pagado"
                                  : pago.estado_pago?.toLowerCase() ===
                                    "vencido"
                                  ? "Vencido"
                                  : "Pendiente"}
                              </Badge>
                            </div>

                            {/* Fecha */}
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4 border-t pt-3">
                              <CalendarIcon className="w-4 h-4" />
                              <span>{formatDate(pago.fecha_pago)}</span>
                            </div>
                          </>
                        ) : (
                          /* ------------- DISEÑO NORMAL QUE YA TENÍAS ------------- */
                          <>
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <p className="text-sm text-muted-foreground mb-1">
                                  {pago.titulo}
                                </p>
                                <p className="text-2xl font-bold">
                                  S/ {(parseFloat(pago.monto) || 0).toFixed(2)}
                                </p>
                              </div>
                              <Badge variant={statusStyle.badge}>
                                {pago.estado_pago}
                              </Badge>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4 border-t border-border/50">
                              <CalendarIcon className="w-4 h-4" />
                              <span>{formatDate(pago.fecha_pago)}</span>
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="border-0 shadow-sm bg-card/50">
                <CardContent className="pt-12 pb-12 text-center">
                  <p className="text-muted-foreground">
                    No hay pagos de asesoría registrados
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab: Servicios */}
          <TabsContent value="servicios" className="mt-6">
            {pagosServicios.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pagosServicios.map((pago, i) => {
                  const statusStyle = getStatusStyle(pago.estado_pago);
                  return (
                    <Card
                      key={i}
                      className="border-0 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <CardContent className="pt-6">
                        {/* Encabezado con estado */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <p className="text-sm text-muted-foreground mb-1">
                              {pago.titulo}
                            </p>
                            <p className="text-2xl font-bold">
                              S/. {(parseFloat(pago.monto) || 0).toFixed(2)}
                            </p>
                          </div>
                          <Badge variant={statusStyle.badge}>
                            {pago.estado_pago === "por_pagar"
                              ? "Por pagar"
                              : pago.estado_pago?.toLowerCase() === "pagado"
                              ? "Pagado"
                              : "Pendiente"}
                          </Badge>
                        </div>

                        {/* Fecha */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4 border-t border-border/50">
                          <CalendarIcon className="w-4 h-4" />
                          <span>{formatDate(pago.fecha_pago)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="border-0 shadow-sm bg-card/50">
                <CardContent className="pt-12 pb-12 text-center">
                  <p className="text-muted-foreground">
                    No hay pagos de servicios registrados
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
