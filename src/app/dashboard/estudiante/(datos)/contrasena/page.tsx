"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface PasswordState {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function CambiarContraseña() {
  const [loading, setLoading] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const idUsuario = user?.id;

  const [passwords, setPasswords] = useState<PasswordState>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  // ✅ Manejar inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Validaciones frontend
  const validarCampos = () => {
    const { oldPassword, newPassword, confirmPassword } = passwords;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return "Todos los campos son obligatorios.";
    }
    if (newPassword.length < 6 || newPassword.length > 30) {
      return "La nueva contraseña debe tener entre 6 y 30 caracteres.";
    }
    if (newPassword !== confirmPassword) {
      return "Las nuevas contraseñas no coinciden.";
    }
    if (oldPassword === newPassword) {
      return "La nueva contraseña no puede ser igual a la anterior.";
    }

    return null;
  };

  // ✅ Enviar al backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const error = validarCampos();
    if (error) return toast.error(error);

    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/change-password/${idUsuario}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            oldPassword: passwords.oldPassword,
            newPassword: passwords.newPassword,
            repeatPassword: passwords.confirmPassword,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      toast.success("Contraseña cambiada exitosamente");

      setPasswords({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cambiar la contraseña";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Mostrar/ocultar contraseña
  const togglePassword = (field: "old" | "new" | "confirm") => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <section className="flex justify-center items-center h-screen p-4">
      <Card className="w-full max-w-md shadow-xl border">
        <CardHeader>
          <CardTitle className="text-center">Cambiar Contraseña</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contraseña actual */}
            <div className="space-y-2">
              <Label>Contraseña Actual</Label>
              <div className="relative">
                <Input
                  type={showPassword.old ? "text" : "password"}
                  name="oldPassword"
                  value={passwords.oldPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => togglePassword("old")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword.old ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* Nueva contraseña */}
            <div className="space-y-2">
              <Label>Nueva Contraseña</Label>
              <div className="relative">
                <Input
                  type={showPassword.new ? "text" : "password"}
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => togglePassword("new")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword.new ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* Confirmar contraseña */}
            <div className="space-y-2">
              <Label>Confirmar Contraseña</Label>
              <div className="relative">
                <Input
                  type={showPassword.confirm ? "text" : "password"}
                  name="confirmPassword"
                  value={passwords.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => togglePassword("confirm")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword.confirm ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                className="w-1/2"
                onClick={() =>
                  setPasswords({
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  })
                }
              >
                Cancelar
              </Button>

              <Button type="submit" className="w-1/2" disabled={loading}>
                {loading ? "Procesando..." : "Cambiar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
