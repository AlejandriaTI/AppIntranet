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

export const NotificationSheet: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUser = () => {
      try {
        const stored = localStorage.getItem("user");
        if (stored) {
          const parsed = JSON.parse(stored);
          setTimeout(() => {
            setUser(parsed);
          }, 0);
        }
      } catch (e) {
        console.error("❌ Error al leer user de localStorage:", e);
      }
    };

    loadUser();
  }, []);

  // Obtener notificaciones desde el servicio
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      const data = await notificationServices.getUserNotifications(user);
      setNotifications(data);
    };

    fetchData();
  }, [user]);

  // Marcar notificación como leída
  const onMarkAsRead = async (id: number) => {
    await notificationServices.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, leida: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.leida).length;

  // Agrupar por fecha
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
      const dia = fecha.getDate().toString().padStart(2, "0");
      const mes = fecha.toLocaleString("es-ES", { month: "long" });
      const año = fecha.getFullYear();
      const clave = `${dia} ${mes} ${año}`;
      if (!acc[clave]) acc[clave] = [];
      acc[clave].push(noti);
      return acc;
    }, {});

  const renderIcon = (tipo: string) => {
    switch (tipo) {
      case "avance_actualizado":
        return <FileText size={16} />;
      case "avance_enviado":
        return <Paperclip size={16} />;
      case "nuevo_avance":
        return <MessageCircle size={16} />;
      default:
        return <Circle size={8} />;
    }
  };

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

      <SheetContent side="right" className="w-[360px] sm:w-[420px] p-0">
        <SheetHeader className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-base font-medium">
              Notificaciones
            </SheetTitle>
          </div>
        </SheetHeader>

        <div className="max-h-[calc(100vh-80px)] overflow-y-auto">
          {Object.keys(notificacionesAgrupadas).length > 0 ? (
            <div className="divide-y divide-border">
              {Object.entries(notificacionesAgrupadas).map(
                ([fecha, notisDelDia]) => (
                  <div key={fecha}>
                    <div className="px-6 py-3 bg-muted/30">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        {fecha}
                      </p>
                    </div>
                    <div className="divide-y divide-border">
                      {notisDelDia.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => onMarkAsRead(n.id)}
                          className={`px-6 py-4 cursor-pointer flex items-start gap-3 transition-all border-l-2 ${
                            n.leida
                              ? "border-l-transparent hover:bg-muted/20"
                              : "border-l-blue-600 bg-muted/30 hover:bg-muted/40"
                          }`}
                        >
                          <div className="mt-0.5 shrink-0">
                            {renderIcon(n.tipo)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm leading-relaxed ${
                                n.leida
                                  ? "text-muted-foreground"
                                  : "text-foreground font-medium"
                              }`}
                            >
                              {n.mensaje}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center text-center text-muted-foreground py-16 px-6">
              <BellOff size={40} className="mb-3 opacity-50" />
              <p className="text-sm">No hay notificaciones</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
