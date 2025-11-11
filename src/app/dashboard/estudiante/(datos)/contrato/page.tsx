"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { FileText } from "lucide-react";
import { useAsesorias } from "@/hooks/useAsesoria";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface Contrato {
  servicio?: string;
  modalidad?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  categoria?: { descripcion: string };
  tipoPago?: { nombre: string };
  tipoTrabajo?: { nombre: string };
  documentos?: string;
}

export default function MiContrato() {
  const [contrato, setContrato] = useState<Contrato | null>(null);

  const user = useSelector((state: RootState) => state.auth.user);
  const idCliente = user?.id_cliente;

  // ✅ Hook que trae asesorías
  const { asesorias, loading, selectedAsesoriaId, setSelectedAsesoriaId } =
    useAsesorias(idCliente);

  // ✅ Obtener contrato
  const obtenerDatosContrato = (asesoriaId: number) => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/cliente/misContratos/${asesoriaId}`
    )
      .then((res) => res.json())
      .then((data) => setContrato(data))
      .catch((err) => console.error("❌ Error contrato:", err));
  };

  // ✅ Oír cambios en selectedAsesoriaId
  useEffect(() => {
    if (selectedAsesoriaId) {
      obtenerDatosContrato(selectedAsesoriaId);
    }
  }, [selectedAsesoriaId]);

  const formatearFecha = (fecha?: string) => {
    if (!fecha) return "Por asignar";
    return new Date(fecha).toLocaleDateString("es-PE");
  };

  return (
    <Card className="w-full max-w-3xl mx-auto mt-10">
      <CardHeader>
        <h2 className="text-2xl font-semibold">Mis Contratos</h2>
      </CardHeader>

      <Separator />

      <CardContent className="flex flex-col gap-8 pt-6">
        {/* ✅ SELECT SHADCN */}
        <div className="w-full max-w-xs">
          <Select
            value={selectedAsesoriaId ? String(selectedAsesoriaId) : ""}
            onValueChange={(value) => setSelectedAsesoriaId(Number(value))}
            disabled={loading}
          >
            <SelectTrigger className="bg-white border-gray-300">
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
        </div>

        {/* ✅ CONTENIDO DEL CONTRATO */}
        {contrato ? (
          <div className="grid gap-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <Field label="Servicio" value={contrato.servicio} />
              <Field label="Modalidad" value={contrato.modalidad} />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <Field
                label="Fecha Inicio"
                value={formatearFecha(contrato.fecha_inicio)}
              />
              <Field
                label="Fecha Fin"
                value={formatearFecha(contrato.fecha_fin)}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <Field
                label="Categoría"
                value={contrato.categoria?.descripcion}
              />
              <Field label="Tipo de Pago" value={contrato.tipoPago?.nombre} />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <Field
                label="Tipo de Trabajo"
                value={contrato.tipoTrabajo?.nombre}
              />
              <DocumentoField url={contrato.documentos} />
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">
            No hay contrato disponible para esta asesoría.
          </p>
        )}
      </CardContent>

      <CardFooter className="flex justify-end p-4">
        <img
          src="/logo/LogoOscuro.svg"
          alt="Logo Alejandría"
          className="h-14 opacity-70 hover:opacity-100 transition"
        />
      </CardFooter>
    </Card>
  );
}

/* ✅ COMPONENTES REUTILIZABLES */

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm font-medium">{label}</p>
      <div className="rounded-md border bg-muted p-3 text-sm text-muted-foreground">
        {value || "No asignado"}
      </div>
    </div>
  );
}

function DocumentoField({ url }: { url?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm font-medium">Documento</p>

      <div className="rounded-md border bg-muted p-3 text-sm text-muted-foreground flex justify-between items-center">
        {url ? (
          <>
            <span>Archivo disponible</span>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-700 hover:text-cyan-900 flex items-center gap-1 font-medium"
            >
              <FileText className="w-4 h-4" />
              Ver / Descargar
            </a>
          </>
        ) : (
          <span>No asignado</span>
        )}
      </div>
    </div>
  );
}
