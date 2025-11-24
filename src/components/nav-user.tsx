"use client";

import {
  User,
  GraduationCap,
  FileText,
  KeyRound,
  ChevronsUpDown,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import getInitials from "@/utils/getInitials";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { logout } from "@/store/auth/authSlice";
import { useRouter } from "next/navigation";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar?: string;
    rol?: string; // <-- AÑADIR
  };
}) {
  const { setOpen, setOpenMobile, isMobile } = useSidebar();
  const initials = getInitials(user.name);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout()); // ✅ Limpia Redux + Preferences
    router.push("/"); // ✅ Redirige
  };

  const closeSidebar = () => {
    if (isMobile) setOpenMobile(false);
    else setOpen(false);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                {user.avatar ? (
                  <AvatarImage src={user.avatar} alt={user.name} />
                ) : null}
                <AvatarFallback className="rounded-lg bg-black text-white font-bold border border-slate-700">
                  {initials || "?"}
                </AvatarFallback>
              </Avatar>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 opacity-50" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          {/* MENU DROPDOWN */}
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  {user.avatar ? (
                    <AvatarImage src={user.avatar} alt={user.name} />
                  ) : null}
                  <AvatarFallback className="rounded-lg bg-black text-white font-semibold">
                    {initials || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              {["alumno", "cliente", "estudiante"].includes(
                user?.rol ?? ""
              ) && (
                <>
                  <DropdownMenuItem asChild onSelect={closeSidebar}>
                    <Link
                      href="/dashboard/estudiante/perfil"
                      className="flex items-center gap-2"
                    >
                      <User />
                      Mi perfil
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild onSelect={closeSidebar}>
                    <Link
                      href="/dashboard/estudiante/asesor"
                      className="flex items-center gap-2"
                    >
                      <GraduationCap />
                      Mi asesor
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild onSelect={closeSidebar}>
                    <Link
                      href="/dashboard/estudiante/contrato"
                      className="flex items-center gap-2"
                    >
                      <FileText />
                      Mi contrato
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild onSelect={closeSidebar}>
                    <Link
                      href="/dashboard/estudiante/contrasena"
                      className="flex items-center gap-2"
                    >
                      <KeyRound />
                      Cambiar Contraseña
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-600 focus:text-red-600 cursor-pointer"
            >
              <LogOut className="text-red-600" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
