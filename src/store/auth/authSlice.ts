import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { UserData } from "@/services/interface/auth";
import { saveAuthData, clearAuthData } from "@/services/storage/authStorage"; // 👈 importar

export interface AuthState {
  user: UserData | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ datos_usuario: UserData; access_token: string }>
    ) => {
      const { datos_usuario, access_token } = action.payload;
      state.user = datos_usuario;
      state.isAuthenticated = true;

      // 👇 Guardar en almacenamiento nativo
      saveAuthData(datos_usuario, access_token);
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;

      // 👇 Limpiar el almacenamiento nativo
      clearAuthData();
    },
    restoreSession: (
      state,
      action: PayloadAction<{ user: UserData; token: string }>
    ) => {
      state.user = action.payload.user;
      state.isAuthenticated = !!action.payload.token;
    },
  },
});

export const { loginSuccess, logout, restoreSession } = authSlice.actions;
export default authSlice.reducer;
