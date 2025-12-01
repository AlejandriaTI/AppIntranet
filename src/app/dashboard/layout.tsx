"use client";

import * as React from "react";
import Image from "next/image";
import { ThemeProvider } from "@/components/theme-provider";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { toast, Toaster } from "sonner";

import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { NotificationSheet } from "@/components/notifications/notification-sheet";
import { App } from "@capacitor/app";
import type { PluginListenerHandle } from "@capacitor/core";
import { useNavigationHistory } from "@/hooks/useNavigationHistory";

// 👇 Importa Redux y almacenamiento nativo
import { useDispatch } from "react-redux";
import { restoreSession } from "@/store/auth/authSlice";
import { loadAuthData } from "@/services/storage/authStorage";

// --- Componente de botones en header ---
function HeaderActions() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-4 ml-auto">
      <NotificationSheet />
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        aria-label="Cambiar tema"
        className="hover:bg-muted/50"
      >
        {theme === "dark" ? (
          <Sun className="w-5 h-5 text-muted-foreground" />
        ) : (
          <Moon className="w-5 h-5 text-muted-foreground" />
        )}
      </Button>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { goBack, canGoBack } = useNavigationHistory();
  const dispatch = useDispatch();

  // 👇 Restaurar sesión persistente al abrir la app
  React.useEffect(() => {
    const initAuth = async () => {
      const { user, token } = await loadAuthData();
      if (user && token) {
        dispatch(restoreSession({ user, token }));
      }
    };
    initAuth();
  }, [dispatch]);

  // Manejo del botón físico "Atrás" en Android
  React.useEffect(() => {
    let listener: PluginListenerHandle | null = null;
    let lastBackPress = 0;

    const addBackButtonListener = async () => {
      listener = await App.addListener("backButton", async () => {
        const now = Date.now();

        if (canGoBack) {
          goBack();
          return;
        }

        // Doble toque dentro de 2 s => salir
        if (now - lastBackPress < 2000) {
          App.exitApp();
        } else {
          lastBackPress = now;
          toast("Presiona nuevamente para salir", {
            description:
              "Si vuelves a presionar atrás, la aplicación se cerrará.",
            duration: 2000,
          });
        }
      });
    };

    addBackButtonListener();
    return () => {
      if (listener) listener.remove();
    };
  }, [goBack, canGoBack]);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme={false}
    >
      <SidebarProvider className="h-full w-full overflow-hidden">
        <AppSidebar />
        <SidebarInset className="relative h-full w-full overflow-hidden">
          {/* HEADER */}
          <header className="fixed top-0 left-0 right-0 z-50 flex h-[calc(3.5rem+env(safe-area-inset-top))] items-center gap-2 border-b bg-background px-4 pt-[env(safe-area-inset-top)] backdrop-blur supports-backdrop-filter:bg-background/80">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="h-6 mx-2" />
              <Image
                src="/logo/LogoAlejandriaSIN.png"
                alt="Logo Alejandría Consultores"
                width={750}
                height={300}
                priority
                className="w-[130px] h-auto object-contain block dark:hidden"
              />
              <Separator orientation="vertical" className="h-6 mx-2" />
              <Image
                src="/logo/alejandria_logo.png"
                alt="Logo Alejandría Consultores"
                width={750}
                height={300}
                priority
                className="w-[90px] h-auto object-contain hidden dark:block"
              />
            </div>
            <HeaderActions />
          </header>

          <main className="h-full overflow-auto bg-background px-4 pt-[calc(1.5rem+env(safe-area-inset-top)+0.5rem)] pb-[calc(2.5rem+env(safe-area-inset-bottom)+0.5rem)]">
            {children}
          </main>

          {/* TOASTS (Sonner) */}
          <Toaster position="bottom-center" richColors />
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}
