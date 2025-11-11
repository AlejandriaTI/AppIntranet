"use client";

import React, { useEffect, useState } from "react";
import {
  Bell,
  BellOff,
  FileText,
  Paperclip,
  MessageCircle,
  Circle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { notificationServices } from "@/services/api/notification.services";
import type { Notification, User } from "@/services/interface/notification";
import { loadAuthData } from "@/services/storage/authStorage";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export const NotificationSheet: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const user = useSelector((state: RootState) => state.auth.user);
  const idCliente = user?.id_cliente;

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;

      const data = await notificationServices.getUserNotifications(user);
      setNotifications(data);
    };

    fetchNotifications();
  }, [user]); // solo carga cuando el usuario actual cambia

  const onMarkAsRead = async (id: number) => {
    await notificationServices.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, leida: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.leida).length;

  const renderIcon = (tipo: string) => {
    switch (tipo) {
      case "avance_actualizado":
        return <FileText size={18} />;
      case "avance_enviado":
        return <Paperclip size={18} />;
      case "nuevo_avance":
        return <MessageCircle size={18} />;
      default:
        return <Circle size={8} />;
    }
  };

  // 🔹 Agrupación por fecha
  const notificacionesAgrupadas = notifications
    .filter(
      (n) => n.fecha_creacion && !isNaN(new Date(n.fecha_creacion).getTime())
    )
    .sort(
      (a, b) =>
        new Date(b.fecha_creacion).getTime() -
        new Date(a.fecha_creacion).getTime()
    )
    .reduce<Record<string, Notification[]>>((acc, noti) => {
      const fecha = new Date(noti.fecha_creacion);
      const clave = fecha.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
      if (!acc[clave]) acc[clave] = [];
      acc[clave].push(noti);
      return acc;
    }, {});

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-transparent"
          aria-label="Notificaciones"
        >
          <Bell className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 w-2 h-2 bg-destructive rounded-full" />
          )}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="
    bg-white p-0 
    w-[80vw]             /* 📱 75% del ancho en pantallas pequeñas */
    sm:w-[400px]         /* 💻 ancho moderado en escritorio */
    md:w-[420px]
    max-w-full
    shadow-2xl           /* 💫 sombra elegante */
    border-l border-gray-200
    transition-all duration-300 ease-in-out
  "
      >
        {/* 🔹 Encabezado */}
        <SheetHeader className="px-6 py-4 border-b sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-base font-semibold text-gray-800">
              Notificaciones
            </SheetTitle>
            {unreadCount > 0 && (
              <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-md">
                {unreadCount} nuevas
              </span>
            )}
          </div>
        </SheetHeader>

        {/* 🔹 Contenido */}
        <div className="max-h-[calc(100vh-80px)] overflow-y-auto">
          {Object.keys(notificacionesAgrupadas).length > 0 ? (
            <div className="divide-y divide-border">
              {Object.entries(notificacionesAgrupadas).map(
                ([fecha, notisDelDia]) => (
                  <div key={fecha}>
                    {/* 🗓 Fecha */}
                    <div className="px-6 py-2 sticky top-0 z-10">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {fecha}
                      </p>
                    </div>

                    {/* 🔔 Lista de notificaciones */}
                    <div className="divide-y divide-gray-100">
                      {notisDelDia.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => onMarkAsRead(n.id)}
                          className={`flex items-start gap-3 px-5 py-4 transition-all cursor-pointer ${
                            n.leida
                              ? "bg-white hover:bg-gray-50"
                              : "bg-blue-50/50"
                          }`}
                        >
                          {/* Ícono principal */}
                          <div
                            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                              n.leida
                                ? "bg-gray-100 text-gray-500"
                                : "bg-blue-100 text-blue-600"
                            }`}
                          >
                            {renderIcon(n.tipo)}
                          </div>

                          {/* Texto */}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <p className="text-sm font-semibold text-gray-900 truncate">
                                Sistema Alejandría
                              </p>
                              <div className="flex items-center gap-1">
                                {!n.leida && (
                                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                )}
                                <p className="text-xs text-gray-400 whitespace-nowrap">
                                  {new Date(
                                    n.fecha_creacion
                                  ).toLocaleTimeString("es-PE", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              </div>
                            </div>

                            {/* Mensaje */}
                            <p
                              className={`mt-1 text-sm ${
                                n.leida
                                  ? "text-gray-600"
                                  : "text-gray-800 font-medium"
                              }`}
                            >
                              {n.mensaje}
                            </p>

                            {/* Acciones opcionales */}
                            {n.tipo === "solicitud" && (
                              <div className="mt-3 flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs px-3 py-1 border-gray-300 text-gray-600 hover:bg-gray-100"
                                >
                                  Cancelar
                                </Button>
                                <Button
                                  size="sm"
                                  className="text-xs px-3 py-1 bg-blue-600 hover:bg-blue-700"
                                >
                                  Aprobar
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center text-center text-gray-500 py-16 px-6">
              <div className="p-4 bg-gray-100 rounded-full mb-3">
                <BellOff size={30} className="text-gray-400" />
              </div>
              <p className="text-sm font-medium">No hay notificaciones</p>
              <p className="text-xs text-gray-400 mt-1">
                Estás al día con todo 🎉
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
