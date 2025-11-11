import { LucideIcon } from "lucide-react";

export interface NavLink {
  icono: LucideIcon; // 👈 Cambia JSX.Element por LucideIcon
  path: string;
  title: string;
  subLinks?: { path: string }[];
}

import {
  Home,
  Video,
  FileText,
  Calendar,
  Users,
  GraduationCap,
  ClipboardList,
  DollarSign,
  BookOpen,
  LifeBuoy,
  Settings,
  MonitorCog,
  Briefcase,
  FolderCog,
} from "lucide-react";

export const LINKS: Record<string, NavLink[]> = {
  asesor: [
    { icono: Home, path: "/dashboard/asesor/home", title: "Home" },
    {
      icono: Video,
      path: "/dashboard/asesor/reuniones",
      title: "Zoom / Inducciones",
    },
    {
      icono: FileText,
      path: "/dashboard/asesor/entrega",
      title: "Entrega / Revisión",
      subLinks: [
        { path: "/dashboard/asesor/entrega/terminados" },
        { path: "/dashboard/asesor/entrega/pendientes" },
      ],
    },
    {
      icono: Calendar,
      path: "/dashboard/asesor/calendario",
      title: "Calendario",
    },
    {
      icono: Users,
      path: "/dashboard/asesor/gestionarAlumno",
      title: "Gestionar Clientes",
    },
    {
      icono: GraduationCap,
      path: "/dashboard/asesor/inducciones",
      title: "Inducciones",
    },
  ],

  contabilidad: [
    {
      icono: Briefcase,
      path: "/dashboard/cont-pago/contratos",
      title: "Contratos",
    },
    { icono: DollarSign, path: "/dashboard/cont-pago/pagos", title: "Pagos" },
  ],

  estudiante: [
    { icono: Home, path: "/dashboard/estudiante/home", title: "Home" },
    {
      icono: Video,
      path: "/dashboard/estudiante/reuniones",
      title: "Zoom / Inducciones",
    },
    {
      icono: FileText,
      path: "/dashboard/estudiante/entrega",
      title: "Entrega / Revisión",
    },
    {
      icono: Calendar,
      path: "/dashboard/estudiante/calendario",
      title: "Calendario",
    },
    {
      icono: BookOpen,
      path: "/dashboard/estudiante/recursos",
      title: "Recursos",
    },
    { icono: DollarSign, path: "/dashboard/estudiante/pagos", title: "Pagos" },
    {
      icono: LifeBuoy,
      path: "/dashboard/estudiante/soporte",
      title: "Soporte",
    },
  ],

  jefeOperaciones: [
    {
      icono: Users,
      path: "/dashboard/jefe-operaciones/gestionar-usuarios",
      title: "Gestionar Usuarios",
    },
    {
      icono: ClipboardList,
      path: "/dashboard/jefe-operaciones/supervisor-asig",
      title: "Asignados",
    },
  ],

  marketing: [
    {
      icono: Settings,
      path: "/dashboard/marketing/ConfigIntra",
      title: "Configuración de Intranet",
    },
  ],

  soporte: [
    {
      icono: MonitorCog,
      path: "/dashboard/soporte-ti",
      title: "Gestión de Soporte",
    },
  ],

  supervisor: [
    {
      icono: ClipboardList,
      path: "/dashboard/supervisor/asignaciones",
      title: "Asignaciones",
    },
    { icono: FolderCog, path: "/dashboard/supervisor/panel", title: "Panel" },
  ],
};
