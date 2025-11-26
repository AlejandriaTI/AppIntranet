import type { LoginRequest, LoginResponse } from "@/services/interface/auth";
import api from "@/services/api";
import {
  updateToken,
  isTokenExpiringSoon,
  loadAuthData,
} from "@/services/storage/authStorage";

async function loginService(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/auth/login", credentials);

  if (response.data.access_token) {
    localStorage.setItem("token", response.data.access_token);
  }
  return response.data;
}

async function refreshTokenService(): Promise<{
  access_token: string;
}> {
  try {
    console.log("Refrescando token...");
    const { token } = await loadAuthData();

    if (!token) {
      throw new Error("No hay token disponible para refrescar");
    }

    const response = await api.post<{
      access_token: string;
      message: string;
    }>("/auth/refresh", { token });

    return { access_token: response.data.access_token };
  } catch (error) {
    console.error("Error al refrescar el token:", error);
    throw error;
  }
}

/**
 * Verifica si el token necesita ser refrescado y lo refresca automáticamente
 * @param bufferMinutes - Minutos de anticipación para refrescar el token
 * @returns true si el token fue refrescado, false si no era necesario
 */
async function checkAndRefreshToken(
  bufferMinutes: number = 10
): Promise<boolean> {
  const needsRefresh = await isTokenExpiringSoon(bufferMinutes);

  if (needsRefresh) {
    try {
      const { access_token } = await refreshTokenService();
      await updateToken(access_token, 10800);
      console.log("✅ Token refrescado automáticamente");
      return true;
    } catch (error) {
      console.error("❌ Error al refrescar el token:", error);
      throw error;
    }
  }

  return false;
}

export const authServices = {
  loginService,
  refreshTokenService,
  checkAndRefreshToken,
};
