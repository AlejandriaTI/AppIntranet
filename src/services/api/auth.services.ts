import type { LoginRequest, LoginResponse } from "@/services/interface/auth";
import api from "@/services/api";

async function loginService(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/auth/login", credentials);

  if (response.data.access_token) {
    localStorage.setItem("token", response.data.access_token);
  }
  return response.data;
}

export const authServices = {
  loginService,
};
