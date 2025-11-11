export interface AsuntoAPI {
  id_asunto: string;
  titulo: string;
  estado: string;
  fecha_entrega: string;
  profesion_asesoria: string;
  fecha_revision: string | null;
  fecha_estimada: string | null;
  fecha_terminado: string | null;
  documento_0?: string;
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

export interface Documento {
  name: string;
  url: string;
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

export interface DocumentItem {
  id: string;
  tipo: "usuario" | "asesor";
  title: string;
  date: string;
  status: string;
  documents: Documento[];
}
