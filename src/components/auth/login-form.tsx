"use client";

import React, { useEffect, useState } from "react";
import { Eye, EyeOff, User, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/store/auth/authSlice";
import { authServices } from "@/services/api/auth.services";
import { useRouter } from "next/navigation";
import type { AxiosError } from "axios";
import { mapLoginResponseToUserData } from "@/services/interface/auth";
import { LINKS } from "@/constants/links"; // 👈 importa el objeto LINKS
import { restoreSession } from "@/store/auth/authSlice";
import { loadAuthData } from "@/services/storage/authStorage";

export default function LoginPage() {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { user, token } = await loadAuthData();

      // Si hay sesión guardada, restaurarla y redirigir
      if (user && token) {
        dispatch(restoreSession({ user, token }));

        const rolUsuario = user.rol?.toLowerCase();
        const primerLink = LINKS[rolUsuario]?.[0]?.path ?? "/dashboard";

        router.replace(primerLink); // 👈 redirige automáticamente
      }
    };

    checkSession();
  }, [dispatch, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!username || !password) {
      setError("Por favor completa todos los campos");
      setIsLoading(false);
      return;
    }

    try {
      const response = await authServices.loginService({ username, password });
      const userData = mapLoginResponseToUserData(response);
      const datosUsuario = response.datos_usuario;
      const token = response.access_token;

      if (!datosUsuario || !token) {
        throw new Error("Respuesta inválida del servidor");
      }

      // Guardar en Redux
      dispatch(
        loginSuccess({
          datos_usuario: userData,
          access_token: token,
        })
      );

      // 🚀 Obtener rol del usuario
      const rolUsuario = datosUsuario.role?.nombre?.toLowerCase();

      // 🚦 Buscar el primer link según su rol
      const primerLink = LINKS[rolUsuario]?.[0]?.path ?? "/dashboard";

      // Redirigir automáticamente
      router.push(primerLink);
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      setError(
        error.response?.data?.message ??
          "Credenciales incorrectas o error de servidor"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full flex justify-center px-4 relative z-10">
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-[410px] flex-col justify-center items-center gap-10 bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700/50"
        >
          {/* Logo */}
          <div className="w-32 h-32 flex items-center justify-center">
            <svg
              width="120"
              height="120"
              viewBox="0 0 250 251"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="Capa 1">
                <path
                  id="Vector"
                  d="M156.288 228.304L136.392 170.724H111.692L84 250.88H98.2375C100.562 246.057 104.217 241.986 108.781 239.135C113.344 236.284 118.63 234.772 124.025 234.772C129.42 234.772 134.706 236.284 139.269 239.135C143.833 241.986 147.488 246.057 149.813 250.88H164.083L156.288 228.304ZM133.263 219.106C127.209 217.6 120.874 217.6 114.821 219.106L110.746 220.138L119.913 193.147H128.458L137.375 220.138L133.263 219.106Z"
                  fill="#0CB2D6"
                />
                <path
                  id="Vector_2"
                  d="M220.071 173.662L164.887 146.881L147.425 164.175L185.075 240.25L195.141 230.277C193.342 225.239 193.02 219.8 194.212 214.589C195.404 209.378 198.061 204.607 201.877 200.829C205.692 197.051 210.509 194.42 215.772 193.24C221.034 192.06 226.526 192.38 231.612 194.162L241.704 184.168L220.071 173.662ZM197.221 183.268C191.868 186.447 187.388 190.883 184.179 196.184L182.037 199.774L169.241 174.277L175.291 168.289L200.862 181.139L197.221 183.268Z"
                  fill="white"
                />
                <path
                  id="Vector_3"
                  d="M174.466 30.5197L147.425 85.1701L164.887 102.464L241.704 65.1776L231.633 55.2081C226.547 56.9898 221.055 57.3089 215.792 56.1285C210.53 54.948 205.713 52.3164 201.898 48.5379C198.083 44.7594 195.427 39.9885 194.235 34.7771C193.044 29.5657 193.367 24.1267 195.166 19.0894L185.075 9.09521L174.466 30.5197ZM184.166 53.149C187.376 58.4503 191.855 62.8864 197.208 66.0648L200.829 68.1857L175.083 80.858L169.041 74.8664L182.016 49.5425L184.166 53.149Z"
                  fill="white"
                />
                <path
                  id="Vector_4"
                  d="M92.7543 23.4551L112.65 81.0354H137.35L165.042 0.879395H150.804C148.467 5.68674 144.81 9.74548 140.253 12.5914C135.695 15.4374 130.421 16.9556 125.033 16.9725C119.64 16.9608 114.36 15.4451 109.796 12.5989C105.232 9.75273 101.57 5.69117 99.2293 0.879395L84.9585 0.879395L92.7543 23.4551ZM115.779 32.6529C121.832 34.1591 128.168 34.1591 134.221 32.6529L138.296 31.6213L129.129 58.6123H120.583L111.667 31.6213L115.779 32.6529Z"
                  fill="white"
                />
                <path
                  id="Vector_5"
                  d="M227.204 92.7381L169.062 112.442V136.903L250 164.328V150.228C245.131 147.926 241.019 144.306 238.141 139.786C235.263 135.267 233.735 130.032 233.735 124.689C233.735 119.346 235.263 114.112 238.141 109.592C241.019 105.073 245.131 101.453 250 99.1506V85.0176L227.204 92.7381ZM217.917 115.541C216.396 121.536 216.396 127.81 217.917 133.804L218.958 137.84L191.704 128.762V120.299L218.958 111.468L217.917 115.541Z"
                  fill="white"
                />
                <path
                  id="Vector_6"
                  d="M75.5334 218.826L102.575 164.175L85.1126 146.881L8.2959 184.168L18.3667 194.137C23.4533 192.356 28.9454 192.037 34.2074 193.217C39.4695 194.397 44.2866 197.029 48.1015 200.807C51.9164 204.586 54.5732 209.357 55.7645 214.568C56.9559 219.78 56.633 225.219 54.8334 230.256L64.9251 240.25L75.5334 218.826ZM65.8334 196.196C62.6241 190.895 58.1447 186.459 52.7917 183.281L49.1667 181.16L74.9126 168.487L80.9584 174.479L67.9834 199.803L65.8334 196.196Z"
                  fill="white"
                />
                <path
                  id="Vector_7"
                  d="M29.9292 75.6835L85.1126 102.464L102.575 85.1701L64.9251 9.09521L54.8584 19.0688C56.6574 24.1063 56.9796 29.5453 55.7877 34.7566C54.5958 39.9678 51.9385 44.7384 48.1231 48.5165C44.3078 52.2946 39.4904 54.9257 34.2282 56.1055C28.966 57.2853 23.474 56.9656 18.3876 55.1834L8.2959 65.1776L29.9292 75.6835ZM52.7792 66.0771C58.1322 62.8988 62.6116 58.4627 65.8209 53.1614L67.9626 49.5755L80.7584 75.0728L74.7084 81.0561L49.1376 68.2064L52.7792 66.0771Z"
                  fill="white"
                />
                <path
                  id="Vector_8"
                  d="M22.7958 156.607L80.9375 136.903V112.442L0 85.0176V99.1176C4.85421 101.433 8.95253 105.054 11.8262 109.567C14.6999 114.081 16.233 119.304 16.25 124.64C16.2382 129.981 14.7077 135.211 11.8338 139.73C8.95985 144.25 4.85869 147.876 0 150.195L0 164.328L22.7958 156.607ZM32.0833 133.804C33.6041 127.81 33.6041 121.536 32.0833 115.541L31.0417 111.505L58.2958 120.583V129.047L31.0417 137.877L32.0833 133.804Z"
                  fill="white"
                />
                <g id="Group 3">
                  <path
                    id="Subtract"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M117.969 145.879L112.5 161.23L112.5 161.23V161.23H111V161.23H133.445L128.217 145.879H117.969ZM133.445 161.23H135V161.23H133.5V161.159L133.445 161.23ZM135 159.249V159.23L134.985 159.249H135Z"
                    fill="#0CB2D6"
                  />
                </g>
              </g>
            </svg>
          </div>

          {/* Inputs */}
          <div className="flex flex-col justify-center items-center gap-6 w-full">
            {/* Usuario */}
            <div className="w-full">
              <Label
                htmlFor="username"
                className="text-white text-sm font-medium mb-2 block"
              >
                Nombre de Usuario
              </Label>
              <div className="relative flex items-center">
                <User className="absolute left-3 w-5 h-5 text-slate-400 top-1/2 -translate-y-1/2" />
                <Input
                  id="username"
                  type="text"
                  className="bg-slate-700/50 w-full pl-10 pr-4 py-3 text-white border border-slate-600 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                  placeholder="Ejemplo: juan.perez"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="w-full">
              <Label
                htmlFor="password"
                className="text-white text-sm font-medium mb-2 block"
              >
                Contraseña
              </Label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 w-5 h-5 text-slate-400 top-1/2 -translate-y-1/2" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="bg-slate-700/50 w-full pl-10 pr-12 py-3 text-white border border-slate-600 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                  placeholder="Ingrese su contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-400 hover:text-slate-200 transition top-1/2 -translate-y-1/2"
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            {/* Botón */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 text-slate-900 bg-white font-semibold rounded-lg hover:bg-slate-100 transition disabled:opacity-50"
            >
              {isLoading ? "INICIANDO SESIÓN..." : "INICIAR SESIÓN"}
            </Button>

            {/* Recuperar contraseña */}
            <Link
              href="/recuperar-contrasena"
              className="text-slate-300 text-sm hover:text-white transition"
            >
              ¿OLVIDÓ SU CONTRASEÑA?
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
