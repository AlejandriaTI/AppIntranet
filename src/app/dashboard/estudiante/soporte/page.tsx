"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle } from "lucide-react";
import PreguntasFrecuentes from "@/components/preguntas-frecuentes";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const ASUNTOS = [
  {
    value: "Error_en_entrega_y_revision",
    label: "Error en entrega y revisión",
  },
  {
    value: "Error_en_reuniones",
    label: "Error en reuniones",
  },
  {
    value: "Error_en_calendario",
    label: "Error en calendario",
  },
  {
    value: "Error_en_recursos",
    label: "Error en recursos",
  },
  {
    value: "Otro",
    label: "Otro",
  },
];

interface FormData {
  asunto: string;
  descripcion: string;
  id_cliente: number | null | undefined; // 👈 agrega undefined
}

export default function SoporteEstudiante() {
  const [formData, setFormData] = useState<FormData>({
    asunto: "",
    descripcion: "",
    id_cliente: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!user) return; // ni siquiera intentes antes de tener user

    const id = typeof user.id_cliente === "number" ? user.id_cliente : null;

    setFormData((prev) => ({
      ...prev,
      id_cliente: id,
    }));

    setUserLoaded(true);
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userLoaded || !formData.id_cliente) {
      setSubmitStatus({
        success: false,
        message:
          "No se pudo identificar al usuario. Por favor, inicie sesión nuevamente.",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/soporte/add`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      let responseData: { message?: string } = {};

      try {
        responseData = await response.clone().json(); // intenta parsear JSON
      } catch {
        const text = await response.text(); // fallback si es texto plano
        responseData = { message: text };
      }

      if (!response.ok) {
        throw new Error(responseData.message || "Error en la solicitud");
      }

      setSubmitStatus({
        success: true,
        message: responseData.message || "Solicitud enviada con éxito",
      });

      setFormData((prev) => ({
        asunto: "",
        descripcion: "",
        id_cliente: prev.id_cliente,
      }));
    } catch (error) {
      setSubmitStatus({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error al procesar la solicitud",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!userLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">
          Cargando información del usuario...
        </p>
      </div>
    );
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Formulario */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Formulario de Soporte</CardTitle>
              <CardDescription>Envía tu consulta o problema</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Asunto</label>
                  <Select
                    value={formData.asunto}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, asunto: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un asunto" />
                    </SelectTrigger>
                    <SelectContent>
                      {ASUNTOS.map((asunto) => (
                        <SelectItem key={asunto.value} value={asunto.value}>
                          {asunto.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Descripción</label>
                  <Textarea
                    placeholder="Describe tu problema o consulta..."
                    value={formData.descripcion}
                    onChange={(e) =>
                      setFormData({ ...formData, descripcion: e.target.value })
                    }
                    className="min-h-[150px] resize-none"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || !formData.id_cliente}
                >
                  {isSubmitting ? "Enviando..." : "Enviar Solicitud"}
                </Button>

                {submitStatus && (
                  <Alert
                    variant={submitStatus.success ? "default" : "destructive"}
                  >
                    {submitStatus.success ? (
                      <CheckCircle2 className="h-4 w-4 " />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    <AlertDescription>{submitStatus.message}</AlertDescription>
                  </Alert>
                )}
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Preguntas Frecuentes */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Preguntas Frecuentes</CardTitle>
              <CardDescription>
                Encuentra respuestas a preguntas comunes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PreguntasFrecuentes />
              <div className="flex flex-col items-center justify-center mt-6 w-full">
                <a
                  href="https://alejandriaconsultora.com/libro-de-reclamaciones"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-linear-to-r from-[#1C1C34] to-[#2E3A59] 
      dark:from-[#2A2A4A] dark:to-[#3E4A6A]
      p-3 sm:p-4 md:p-5 rounded-xl 
      shadow-md hover:shadow-lg hover:scale-105 
      transition-transform duration-300 
      flex items-center justify-center 
      w-[80%] sm:w-[60%] md:w-[40%] lg:w-[30%]"
                >
                  <img
                    src="/libro_reclamaciones.png"
                    alt="Libro de Reclamaciones"
                    className="w-32 sm:w-40 md:w-56 lg:w-64 object-contain 
        filter brightness-0 invert 
        dark:invert-0 dark:brightness-100"
                  />
                </a>

                <p
                  className="text-xs sm:text-sm md:text-base 
    text-[#1C1C34] dark:text-gray-100 
    mt-3 font-medium text-center px-4"
                >
                  Haz clic para acceder al Libro de Reclamaciones
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
