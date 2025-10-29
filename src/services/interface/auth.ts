// Datos que envías al backend
export interface LoginRequest {
  username: string;
  password: string;
}

// Respuesta real del backend
export interface LoginResponse {
  access_token: string;
  id_usuario: number;
  datos_usuario: {
    username: string;
    nombre: string;
    role: {
      id: string;
      nombre: string;
    };
    id_usuario: number;
    esDelegado: boolean;
    id_asesor: number;
    id_cliente: number;
  };
}

// Datos que usaremos en Redux (más limpios)
export interface UserData {
  id: number; // ID del usuario (usuario.id)
  nombre: string;
  email: string;
  rol: string;
  id_cliente?: number | null;

  id_asesor?: number | null;
  esDelegado?: boolean;
}

// 🧭 Mapeador de la respuesta del backend al formato usado en Redux
export const mapLoginResponseToUserData = (
  response: LoginResponse
): UserData => {
  const datos = response.datos_usuario;

  return {
    id: datos.id_usuario,
    nombre: datos.nombre,
    email: datos.username,
    rol: datos.role.nombre,
    id_asesor: datos.id_asesor ?? null,
    id_cliente: datos.id_cliente   ?? null,
    esDelegado: datos.esDelegado ?? false,
  };
};
