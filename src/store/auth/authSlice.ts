import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { UserData } from "@/services/interface/auth";
import {
  saveAuthData,
  clearAuthData,
  updateToken,
} from "@/services/storage/authStorage";

export interface AuthState {
  user: UserData | null;
  isAuthenticated: boolean;
  tokenExpiry: number | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  tokenExpiry: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{
        datos_usuario: UserData;
        access_token: string;
        expires_in?: number;
      }>
    ) => {
      const { datos_usuario, access_token, expires_in } = action.payload;
      state.user = datos_usuario;
      state.isAuthenticated = true;

      const expiryTime = expires_in || 10800;
      state.tokenExpiry = Date.now() + expiryTime * 1000;

      saveAuthData(datos_usuario, access_token, expiryTime);
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.tokenExpiry = null;

      clearAuthData();
    },

    restoreSession: (
      state,
      action: PayloadAction<{
        user: UserData;
        token: string;
        tokenExpiry?: number | null;
      }>
    ) => {
      state.user = action.payload.user;
      state.isAuthenticated = !!action.payload.token;
      state.tokenExpiry = action.payload.tokenExpiry || null;
    },

    refreshTokenSuccess: (
      state,
      action: PayloadAction<{
        access_token: string;
        expires_in?: number;
      }>
    ) => {
      const { access_token, expires_in } = action.payload;

      const expiryTime = expires_in || 10800;
      state.tokenExpiry = Date.now() + expiryTime * 1000;

      updateToken(access_token, expiryTime);
    },
  },
});

export const { loginSuccess, logout, restoreSession, refreshTokenSuccess } =
  authSlice.actions;
export default authSlice.reducer;
