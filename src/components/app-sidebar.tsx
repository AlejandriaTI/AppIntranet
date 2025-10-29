"use client";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import * as React from "react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { LINKS } from "@/constants/links";
import { loginSuccess } from "@/store/auth/authSlice";
import { TeamSwitcher } from "./team-switcher";
import getInitials from "@/utils/getInitials";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // ✅ Verifica si hay usuario guardado en localStorage
    if (!user) {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("authToken");

      if (storedUser && token) {
        dispatch(
          loginSuccess({
            datos_usuario: JSON.parse(storedUser),
            access_token: token,
          })
        );
      }
    }
    setLoading(false);
  }, [dispatch, user]);

  // Evita parpadeo mientras carga el usuario
  if (loading) return null;
  if (!user) return null;

  // Genera los links dinámicos
  const userLinks = LINKS[user.rol] || [];

  const formattedLinks = userLinks.map((link) => ({
    title: link.title,
    url: link.path,
    icon: link.icono,
    items: link.subLinks?.map((s) => ({
      title: s.path.split("/").pop() || "Subenlace",
      url: s.path,
    })),
  }));

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher
          teams={[
            {
              name: "Alejandría Consultores",
              plan: "Enterprise",
            },
          ]}
        />{" "}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={formattedLinks} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user.nombre,
            email: user.email,
            avatar: getInitials(user.nombre), // 👈 ahora es "DS" o "EP" o "HS"
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
