// 📁 Documento base (del backend)
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

// 📁 Asunto completo (con documentos)
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

// 📁 Respuesta del backend con todos los asuntos
export interface ListadoGlobalizadoResponse {
  mensaje: string;
  total_asuntos: number;
  data: Asunto[];
}

// 📁 Vista simplificada para tabla/listado general
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

// 📁 Vista específica para asuntos terminados
export interface AsuntoTerminadoAPI {
  id: string;
  titulo_asesor: string;
  fecha_entregado: string;
  fecha_proceso: string;
  fecha_terminado: string;
  estado: string;
}

// 📁 Adaptación para UI de tarjetas o listas
export interface SubjectItem {
  id: string;
  title: string;
  dueDate: string;
  status: "entregado" | "en-proceso" | "terminado";
  document?: string;
}

// 📁 Adaptación para vista de documentos por asunto
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

// 📁 DocumentoAPI para consumo si se quiere "aplanar"
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
