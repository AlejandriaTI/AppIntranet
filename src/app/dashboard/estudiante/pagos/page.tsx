"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useAsesorias } from "@/hooks/useAsesoria";

interface Pago {
  id: string;
  titulo: string;
  monto: string;
  fecha_pago: string;
  estado_pago: string;
}

export default function PagosEstudiante() {
  const [pagosAsesoria, setPagosAsesoria] = useState<Pago[]>([]);
  const [pagosServicios, setPagosServicios] = useState<Pago[]>([]);
  const user = useSelector((state: RootState) => state.auth.user);
  const idCliente = user?.id_cliente;

  // ✅ Usamos el hook que ya maneja asesorías, loading, error y selección
  const {
    asesorias,
    loading,
    error,
    selectedAsesoriaId,
    setSelectedAsesoriaId,
  } = useAsesorias(idCliente);

  // ✅ Carga de pagos cuando cambia la asesoría seleccionada
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

  // ✅ Cálculos
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

  const getStatusBadge = (estado: string) => {
    const isPaid = estado?.toLowerCase() === "pagado";
    return (
      <Badge variant={isPaid ? "default" : "destructive"}>
        {estado === "por_pagar"
          ? "Por pagar"
          : estado?.toLowerCase() === "pagado"
          ? "Pagado"
          : "Pendiente"}
      </Badge>
    );
  };

  // ✅ Loading y error states
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

  return (
    <section className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Estado de Cuenta
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestiona tus pagos y asesorías
          </p>
        </div>

        {/* Selector de Asesoría */}
        <Card>
          <CardContent className="pt-6">
            <Select
              value={selectedAsesoriaId ? String(selectedAsesoriaId) : ""}
              onValueChange={(value) => setSelectedAsesoriaId(Number(value))} // 👈 conversión segura
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

        {/* Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">
                Total de Cuotas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">S/. {calcularTotalCuotas()}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">
                Total Pagado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">
                S/. {calcularTotalPagado()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">
                Por Pagar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-600">
                S/. {calcularDeudaPendiente()}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="asesorias" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="asesorias">Asesorías</TabsTrigger>
            <TabsTrigger value="servicios">Servicios</TabsTrigger>
          </TabsList>

          {/* Tab: Asesorías */}
          <TabsContent value="asesorias" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Pagos de Asesorías</CardTitle>
              </CardHeader>
              <CardContent>
                {pagosAsesoria.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Título</TableHead>
                          <TableHead className="text-right">Monto</TableHead>
                          <TableHead>Fecha de Pago</TableHead>
                          <TableHead className="text-right">Estado</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pagosAsesoria.map((pago, i) => (
                          <TableRow key={i}>
                            <TableCell>{pago.titulo}</TableCell>
                            <TableCell className="text-right">
                              S/. {(parseFloat(pago.monto) || 0).toFixed(2)}
                            </TableCell>
                            <TableCell>{formatDate(pago.fecha_pago)}</TableCell>
                            <TableCell className="text-right">
                              {getStatusBadge(pago.estado_pago)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No hay pagos de asesoría registrados
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Servicios */}
          <TabsContent value="servicios" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Pagos de Servicios</CardTitle>
              </CardHeader>
              <CardContent>
                {pagosServicios.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Título</TableHead>
                          <TableHead className="text-right">Monto</TableHead>
                          <TableHead>Fecha de Pago</TableHead>
                          <TableHead className="text-right">Estado</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pagosServicios.map((pago, i) => (
                          <TableRow key={i}>
                            <TableCell>{pago.titulo}</TableCell>
                            <TableCell className="text-right">
                              S/. {(parseFloat(pago.monto) || 0).toFixed(2)}
                            </TableCell>
                            <TableCell>{formatDate(pago.fecha_pago)}</TableCell>
                            <TableCell className="text-right">
                              {getStatusBadge(pago.estado_pago)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No hay pagos de servicios registrados
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
