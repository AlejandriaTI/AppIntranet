"use client";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, refreshTokenSuccess } from "@/store/auth/authSlice";
import { authServices } from "@/services/api/auth.services";
import type { RootState } from "@/store/store";
import { useRouter } from "next/navigation";

/**
 * Hook personalizado para verificar la expiración del token
 *
 * Sin endpoint de refresh, este hook:
 * 1. Verifica cada cierto intervalo si el token ha expirado
 * 2. Si el token expiró, cierra la sesión y redirige al login
 * 3. Muestra una notificación al usuario antes de que expire (opcional)
 *
 * @param checkIntervalMinutes - Intervalo en minutos para verificar el token (por defecto 5 minutos)
 * @param warningMinutes - Minutos antes de expirar para mostrar advertencia (por defecto 10 minutos)
 */
export function useTokenRefresh(
  checkIntervalMinutes: number = 5,
  warningMinutes: number = 10
) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated, tokenExpiry } = useSelector(
    (state: RootState) => state.auth
  );
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasShownWarning = useRef(false);
  const isRefreshing = useRef(false);

  useEffect(() => {
    if (!isAuthenticated || !tokenExpiry) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const checkExpiration = () => {
      const now = Date.now();
      const timeUntilExpiry = tokenExpiry - now;
      const warningTime = warningMinutes * 60 * 1000;

      if (timeUntilExpiry <= 0) {
        console.warn("⚠️ Token expirado, cerrando sesión");
        dispatch(logout());
        router.push("/");
        return;
      }

      if (timeUntilExpiry <= warningTime && !isRefreshing.current) {
        console.log("🔄 Token próximo a expirar, intentando refrescar...");
        isRefreshing.current = true;

        authServices
          .refreshTokenService()
          .then((data) => {
            dispatch(refreshTokenSuccess(data));
            console.log("✅ Token refrescado exitosamente");
            hasShownWarning.current = false;
          })
          .catch((error) => {
            console.error("❌ Error al refrescar el token:", error);
            if (!hasShownWarning.current) {
              const minutesLeft = Math.floor(timeUntilExpiry / 60000);
              console.warn(
                `⚠️ No se pudo refrescar. El token expirará en ${minutesLeft} minutos`
              );
              hasShownWarning.current = true;
            }
          })
          .finally(() => {
            isRefreshing.current = false;
          });
      }
    };

    checkExpiration();

    const intervalMs = checkIntervalMinutes * 60 * 1000;
    intervalRef.current = setInterval(checkExpiration, intervalMs);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [
    isAuthenticated,
    tokenExpiry,
    dispatch,
    router,
    checkIntervalMinutes,
    warningMinutes,
  ]);
}
