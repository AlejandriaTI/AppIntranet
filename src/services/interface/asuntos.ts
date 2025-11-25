export interface Documento {
  nombre: string;
  ruta: string;
  subido_por: "asesor" | "estudiante";
  fecha: string; // ISO date
}

export interface EntregaDetalleItem {
  id: string;
  titulo: string;
  titulo_asesor?: string;
  profesion_asesoria: string;
  estado: "entregado" | "en-proceso" | "terminado";
  fecha_entrega: string;
  fecha_revision?: string;
  fecha_estimada?: string;
  fecha_terminado?: string;
  documentos: Documento[];
}

export interface Asunto {
  id_asunto: string;
  titulo: string;
  titulo_asesor: string | null;
  profesion_asesoria: string;
  estado: "terminado" | "entregado" | string;
  fecha_principal: string;
  fecha_entrega: string;
  fecha_revision: string | null;
  fecha_estimada: string | null;
  fecha_terminado: string | null;
  documentos: Documento[];
}

export interface ListadoGlobalizadoResponse {
  mensaje: string;
  total_asuntos: number;
  data: Asunto[];
}

export interface AsuntoAPI {
  id_asunto: string;
  titulo: string;
  estado: string;
  fecha_entrega: string;
  profesion_asesoria: string;
  fecha_revision: string | null;
  fecha_estimada: string | null;
  fecha_terminado: string | null;
  documento_0?: string; // solo el primero si se requiere en tabla
}

export interface AsuntoTerminadoAPI {
  id: string;
  titulo_asesor: string;
  fecha_entregado: string;
  fecha_proceso: string;
  fecha_terminado: string;
  estado: string;
}

export interface SubjectItem {
  id: string;
  title: string;
  dueDate: string;
  status: "entregado" | "en-proceso" | "terminado";
  document?: string;
}

export interface DocumentItem {
  id: string;
  tipo: "usuario" | "asesor";
  title: string;
  date: string;
  status: string;
  documents: {
    name: string;
    url: string;
  }[];
}

export interface AsesoramientoDocumentoArchivo {
  id: number;
  documento_id: number;
  url: string;
  signedUrl: string; // ← viene del backend
}

export interface AsesoramientoDocumento {
  id: number;
  asesoramiento_id: number;
  titulo: string;
  fecha: string; // tipo date del backend
  archivos: AsesoramientoDocumentoArchivo[];
}

export interface DocumentoAPI {
  id_asunto: string;
  estado: string;
  fecha: string;
  asunto?: {
    cliente?: string;
    asesor?: string;
  };
  nombreDoc1?: string;
  ruta1?: string;
  nombreDoc2?: string;
  ruta2?: string;
  nombreDoc3?: string;
  ruta3?: string;
}
