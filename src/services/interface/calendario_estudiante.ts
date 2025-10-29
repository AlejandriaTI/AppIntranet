

// src/types/CalendarioEstudiante.ts

export interface Reunión {
  id: number;
  titulo: string;
  fecha: string; // ISO string (UTC)
  enlace_zoom: string;
}

export interface Contrato {
  id: string;
  servicio: string;
  modalidad: string;
  fecha_inicio: string; // ISO string (UTC)
  fecha_fin: string;    // ISO string (UTC)
}

export interface Asunto {
  id: string;
  titulo: string;
  estado: "entregado" | "proceso" | "terminado" | string;
  fecha_entregado: string | null;
  fecha_revision: string | null;
  fecha_estimada: string | null;
  fecha_terminado: string | null;
}

export interface CalendarioEstudianteResponse {
  reuniones: Reunión[];
  contratos: Contrato[];
  asuntos: Asunto[];
}
