"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import Link from "next/link";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const { setOpen, setOpenMobile, isMobile } = useSidebar();

  const closeSidebar = () => {
    if (isMobile) setOpenMobile(false);
    else setOpen(false);
  };
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs font-semibold uppercase text-gray-700 dark:text-gray-300 tracking-wider mb-2">
        Menú principal
      </SidebarGroupLabel>

      <SidebarMenu className="space-y-1">
        {items.map((item) =>
          item.items && item.items.length > 0 ? (
            // 🔸 Ítem con submenú
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={`relative flex items-center gap-3 px-3 py-2 w-full rounded-lg transition-all duration-200
                    before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-[3px] before:rounded-r-md before:transition-all
                    ${
                      item.isActive
                        ? "bg-gray-200 dark:bg-gray-800 font-bold text-black dark:text-white before:bg-black dark:before:bg-white"
                        : "text-black dark:text-gray-300 hover:font-bold hover:bg-gray-100 dark:hover:bg-gray-800 before:bg-transparent hover:before:bg-black dark:hover:before:bg-white"
                    }`}
                  >
                    {item.icon && (
                      <item.icon
                        className={`w-5 h-5 transition ${
                          item.isActive
                            ? "text-black dark:text-white"
                            : "text-gray-600 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white"
                        }`}
                      />
                    )}
                    <span className="text-sm">{item.title}</span>
                    <ChevronRight className="ml-auto size-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent className="pl-9 mt-1 space-y-1">
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <Link
                            onClick={closeSidebar} // 👈🔥 cierre automático
                            href={subItem.url}
                            className="flex items-center gap-2 text-sm text-black dark:text-gray-300 hover:font-bold hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition rounded-md px-2 py-1"
                          >
                            <span className="opacity-50">•</span>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            // 🔹 Ítem sin submenú
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                className={`relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200
                before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-[3px] before:rounded-r-md before:transition-all
                ${
                  item.isActive
                    ? "bg-gray-200 dark:bg-gray-800 font-bold text-black dark:text-white before:bg-black dark:before:bg-white"
                    : "text-black dark:text-gray-300 hover:font-bold hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 hover:before:bg-black dark:hover:before:bg-white"
                }`}
              >
                <Link
                  href={item.url}
                  onClick={closeSidebar}
                  className="flex items-center w-full"
                >
                  {item.icon && (
                    <item.icon
                      className={`w-5 h-5 mr-1 transition ${
                        item.isActive
                          ? "text-black dark:text-white"
                          : "text-gray-600 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white"
                      }`}
                    />
                  )}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
