export interface User {
  id: number;
  id_cliente?: number | null;
  id_asesor?: number | null;
}
export interface Notification {
  id: number;
  tipo: string;
  mensaje: string;
  leida: boolean;
  fecha_creacion: string;
  vence_en?: string;

  clienteReceptor?: {
    id: number;
  };

  asesorReceptor?: {
    id: number;
    usuario?: {
      id: number;
    };
  };

  // Opcionales según lo que uses
  contrato?: {
    id: string;
    servicio: string;
    modalidad: string;
    fecha_inicio: string;
    fecha_fin: string;
  };
}
