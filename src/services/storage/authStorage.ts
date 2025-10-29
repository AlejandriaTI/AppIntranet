import { Preferences } from "@capacitor/preferences"
import type { UserData } from "@/services/interface/auth" // 👈 Importa el tipo real

const USER_KEY = "user"
const TOKEN_KEY = "authToken"

/**
 * Guarda los datos de sesión (usuario y token) en almacenamiento persistente.
 */
export const saveAuthData = async (user: UserData, token: string): Promise<void> => {
  await Preferences.set({ key: USER_KEY, value: JSON.stringify(user) })
  await Preferences.set({ key: TOKEN_KEY, value: token })
}

/**
 * Carga los datos de sesión persistentes.
 */
export const loadAuthData = async (): Promise<{ user: UserData | null; token: string | null }> => {
  const userRes = await Preferences.get({ key: USER_KEY })
  const tokenRes = await Preferences.get({ key: TOKEN_KEY })

  return {
    user: userRes.value ? (JSON.parse(userRes.value) as UserData) : null,
    token: tokenRes.value || null,
  }
}

/**
 * Elimina los datos de sesión almacenados.
 */
export const clearAuthData = async (): Promise<void> => {
  await Preferences.remove({ key: USER_KEY })
  await Preferences.remove({ key: TOKEN_KEY })
}
