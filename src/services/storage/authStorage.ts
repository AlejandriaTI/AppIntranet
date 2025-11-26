import { Preferences } from "@capacitor/preferences";
import type { UserData } from "@/services/interface/auth"; // 👈 Importa el tipo real

const USER_KEY = "user";
const TOKEN_KEY = "authToken";
const TOKEN_EXPIRY_KEY = "tokenExpiry"; // 👈 Nueva clave para guardar el tiempo de expiración
const REFRESH_TOKEN_KEY = "refreshToken"; // 👈 Nueva clave para el refresh token (si el backend lo provee)

/**
 * Guarda los datos de sesión (usuario, token y tiempo de expiración) en almacenamiento persistente.
 */
export const saveAuthData = async (
  user: UserData,
  token: string,
  expiresIn?: number // 👈 Tiempo de expiración en segundos (ej: 7200 para 2 horas)
): Promise<void> => {
  await Preferences.set({ key: USER_KEY, value: JSON.stringify(user) });
  await Preferences.set({ key: TOKEN_KEY, value: token });

  // Calcular y guardar el timestamp de expiración
  if (expiresIn) {
    const expiryTime = Date.now() + expiresIn * 1000; // Convertir segundos a milisegundos
    await Preferences.set({
      key: TOKEN_EXPIRY_KEY,
      value: expiryTime.toString(),
    });
  }
};

/**
 * Guarda el refresh token (si el backend lo provee)
 */
export const saveRefreshToken = async (refreshToken: string): Promise<void> => {
  await Preferences.set({ key: REFRESH_TOKEN_KEY, value: refreshToken });
};

/**
 * Obtiene el refresh token
 */
export const getRefreshToken = async (): Promise<string | null> => {
  const result = await Preferences.get({ key: REFRESH_TOKEN_KEY });
  return result.value || null;
};

/**
 * Carga los datos de sesión persistentes.
 */
export const loadAuthData = async (): Promise<{
  user: UserData | null;
  token: string | null;
  tokenExpiry: number | null;
}> => {
  const userRes = await Preferences.get({ key: USER_KEY });
  const tokenRes = await Preferences.get({ key: TOKEN_KEY });
  const expiryRes = await Preferences.get({ key: TOKEN_EXPIRY_KEY });

  return {
    user: userRes.value ? (JSON.parse(userRes.value) as UserData) : null,
    token: tokenRes.value || null,
    tokenExpiry: expiryRes.value ? parseInt(expiryRes.value) : null,
  };
};

/**
 * Verifica si el token ha expirado o está próximo a expirar
 * @param bufferMinutes - Minutos de anticipación para considerar el token como "próximo a expirar"
 */
export const isTokenExpiringSoon = async (
  bufferMinutes: number = 5
): Promise<boolean> => {
  const expiryRes = await Preferences.get({ key: TOKEN_EXPIRY_KEY });

  if (!expiryRes.value) return true; // Si no hay tiempo de expiración, considerarlo expirado

  const expiryTime = parseInt(expiryRes.value);
  const bufferMs = bufferMinutes * 60 * 1000;

  return Date.now() >= expiryTime - bufferMs;
};

export const updateToken = async (
  token: string,
  expiresIn?: number
): Promise<void> => {
  await Preferences.set({ key: TOKEN_KEY, value: token });

  if (expiresIn) {
    const expiryTime = Date.now() + expiresIn * 1000;
    await Preferences.set({
      key: TOKEN_EXPIRY_KEY,
      value: expiryTime.toString(),
    });
  }
};

export const clearAuthData = async (): Promise<void> => {
  await Preferences.remove({ key: USER_KEY });
  await Preferences.remove({ key: TOKEN_KEY });
  await Preferences.remove({ key: TOKEN_EXPIRY_KEY });
  await Preferences.remove({ key: REFRESH_TOKEN_KEY });
};
