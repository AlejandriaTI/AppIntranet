"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronsUpDown, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string;
    plan: string;
  }[];
}) {
  const { isMobile } = useSidebar();
  const [activeTeam, setActiveTeam] = React.useState(teams[0]);

  if (!activeTeam) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-muted data-[state=open]:text-foreground transition-all"
            >
              {/* 🔹 Logo dinámico según modo */}
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-transparent">
                {/* Modo claro → logo oscuro */}

                <Image
                  src="/logo/LogoOscuro.svg"
                  alt="Logo Alejandría"
                  width={20}
                  height={20}
                  priority
                  unoptimized
                  className="block dark:hidden"
                />

                {/* Modo oscuro → logo claro */}
                <Image
                  src="/logo/LogoAlejandria.svg"
                  alt="Logo Alejandría"
                  width={20}
                  height={20}
                  priority
                  className="hidden dark:block"
                />
              </div>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-foreground">
                  {activeTeam.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {activeTeam.plan}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto opacity-70" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="min-w-56 rounded-lg shadow-md"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Equipos disponibles
            </DropdownMenuLabel>

            {teams.map((team, index) => (
              <DropdownMenuItem
                key={team.name}
                onClick={() => setActiveTeam(team)}
                className="gap-2 p-2 hover:bg-muted"
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <Image
                    src="/logo/logoOscuro.svg"
                    alt="Logo Alejandría"
                    width={16}
                    height={16}
                    className="block dark:hidden"
                  />
                  <Image
                    src="/logo/LogoAlejandria.svg"
                    alt="Logo Alejandría"
                    width={16}
                    height={16}
                    className="hidden dark:block"
                  />
                </div>
                {team.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
