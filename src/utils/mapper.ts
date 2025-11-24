import {
  DocumentoAPI,
  DocumentItem,
  AsuntoAPI,
  AsuntoTerminadoAPI,
  SubjectItem,
} from "@/services/interface/asuntos";

export function mapToDocumentItems(
  data: DocumentoAPI[] | unknown,
  tipo: "usuario" | "asesor"
): DocumentItem[] {
  if (!Array.isArray(data)) {
    console.warn(`⚠️ La API de ${tipo} no devolvió un array:`, data);
    return [];
  }

  return data.map((item) => ({
    id: item.id_asunto,
    tipo,
    title:
      item.asunto?.[tipo === "usuario" ? "cliente" : "asesor"] ?? "Sin título",
    date: new Date(item.fecha).toLocaleDateString("es-PE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    status: item.estado,
    documents: [
      ...(item.nombreDoc1 && item.ruta1
        ? [{ name: item.nombreDoc1, url: item.ruta1 }]
        : []),
      ...(item.nombreDoc2 && item.ruta2
        ? [{ name: item.nombreDoc2, url: item.ruta2 }]
        : []),
      ...(item.nombreDoc3 && item.ruta3
        ? [{ name: item.nombreDoc3, url: item.ruta3 }]
        : []),
    ],
  }));
}

export function mapToSubjectItems(data: AsuntoAPI[] | unknown): SubjectItem[] {
  if (!Array.isArray(data)) {
    console.warn(
      "⚠️ La API de asuntos (estudiante) no devolvió un array:",
      data
    );
    return [];
  }

  return data.map((item) => {
    // Buscar todos los documentos dinámicamente
    const documentos = Object.entries(item)
      .filter(([key]) => key.startsWith("documento_") && item[key])
      .map(([_, value]) => String(value));

    return {
      id: item.id_asunto,
      title: item.titulo,
      dueDate: new Date(item.fecha_entrega).toLocaleDateString("es-PE", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      status:
        item.estado === "proceso"
          ? "en-proceso"
          : (item.estado as "entregado" | "terminado"),
      document:
        documentos.length > 0 ? documentos.join(", ") : "Sin archivos adjuntos",
    };
  });
}

export function mapToFinishedSubjectItems(
  data: AsuntoTerminadoAPI[] | unknown
): SubjectItem[] {
  if (!Array.isArray(data)) {
    console.warn(
      "⚠️ La API de asuntos terminados (asesor) no devolvió un array:",
      data
    );
    return [];
  }

  return data.map((item) => ({
    id: item.id,
    title: item.titulo_asesor,
    dueDate: new Date(item.fecha_terminado).toLocaleDateString("es-PE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    status: item.estado as "terminado",
  }));
}
