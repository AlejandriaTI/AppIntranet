import api from "@/services/api";
import type { Notification, User } from "@/services/interface/notification";

async function getUserNotifications(user: User): Promise<Notification[]> {
  if (!user) return [];

  const idCliente = user.id_cliente;
  const idAsesor = user.id_asesor;

  try {
    let res;

    if (idCliente) {
      res = await api.get<Notification[]>(
        `/notificaciones/enviadas/cliente/${idCliente}`
      );
    } else if (idAsesor) {
      res = await api.get<Notification[]>(
        `/notificaciones/enviadas/asesor/${idAsesor}`
      );
    } else {
      return [];
    }

    return Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    console.error("⚠️ Error al obtener notificaciones:", error);
    return [];
  }
}

async function markAsRead(id: number): Promise<void> {
  try {
    await api.patch(`/notificaciones/${id}/leida`);
  } catch (err) {
    console.error("❌ Error al marcar notificación como leída:", err);
  }
}

export const notificationServices = {
  getUserNotifications,
  markAsRead
};
