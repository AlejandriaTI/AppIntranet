import api from "@/services/api";
import {
  DocumentoAPI,
  DocumentItem,
  SubjectItem,
  AsuntoAPI,
  AsuntoTerminadoAPI,
  Asunto,
  AsesoramientoDocumento,
} from "@/services/interface/asuntos";
import {
  mapToDocumentItems,
  mapToFinishedSubjectItems,
  mapToSubjectItems,
} from "@/utils/mapper";
type DocumentoResponse = DocumentoAPI[];
type AsuntoResponse = AsuntoAPI[];
type AsuntoTerminadoResponse = AsuntoTerminadoAPI[];

async function getDocumentsClient(idAsesoria: number): Promise<DocumentItem[]> {
  const response = await api.get(`/documentos/estudiante/list/${idAsesoria}`);
  const data = Array.isArray(response.data)
    ? response.data
    : response.data?.data ?? [];
  return mapToDocumentItems(data as DocumentoResponse, "usuario");
}

async function getDocumentsAsesor(idAsesoria: number): Promise<DocumentItem[]> {
  const response = await api.get(`/documentos/asesor/list/${idAsesoria}`);
  const data = Array.isArray(response.data)
    ? response.data
    : response.data?.data ?? [];
  return mapToDocumentItems(data as DocumentoResponse, "asesor");
}

async function getAllAsuntos(idAsesoria: number): Promise<SubjectItem[]> {
  const response = await api.get(`/asuntos/all/${idAsesoria}`);
  const data = Array.isArray(response.data)
    ? response.data
    : response.data?.data ?? [];
  return mapToSubjectItems(data as AsuntoResponse);
}

/**
 * Obtiene los asuntos terminados del asesor
 */
async function getAsuntosTerminados(
  idAsesoria: number
): Promise<SubjectItem[]> {
  const response = await api.get(`/asuntos/terminados/${idAsesoria}`);
  const data = Array.isArray(response.data)
    ? response.data
    : response.data?.data ?? [];
  return mapToFinishedSubjectItems(data as AsuntoTerminadoResponse);
}

async function getAsuntosGlobal(idAsesoria: number): Promise<Asunto[]> {
  const response = await api.get(`asuntos/global/${idAsesoria}`);
  return response.data?.data ?? [];
}

async function getDocumentsAsesoria(
  idAsesoria: number
): Promise<AsesoramientoDocumento[]> {
  const response = await api.get(
    `asesoramiento-documentos/listar/${idAsesoria}`
  );

  console.log("🔍 Full API Response:", response);
  console.log("🔍 Response.data:", response.data);

  // La API retorna el array directamente en response.data, no en response.data.data
  const data = Array.isArray(response.data)
    ? response.data
    : response.data?.data ?? [];

  console.log("🔍 Extracted data:", data);

  return data as AsesoramientoDocumento[];
}

export const asuntosServices = {
  getDocumentsClient,
  getDocumentsAsesor,
  getAllAsuntos,
  getAsuntosTerminados,
  getAsuntosGlobal,
  getDocumentsAsesoria,
};
