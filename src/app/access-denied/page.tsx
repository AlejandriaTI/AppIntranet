"use client";

import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function AccessDeniedPage() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-[400px] shadow-lg border border-gray-200 dark:border-gray-800">
          <CardHeader className="flex flex-col items-center space-y-3">
            <div className="p-4 bg-red-100 dark:bg-red-900/40 rounded-full">
              <ShieldAlert className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Acceso denegado
            </CardTitle>
          </CardHeader>

          <CardContent className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No tienes permisos para acceder a esta sección del sistema.
            </p>
          </CardContent>

          <CardFooter className="flex justify-center gap-3">
            <Button
              variant="destructive"
              onClick={() => router.back()} // 👈 Regresa a la página anterior
              className="font-semibold"
            >
              Volver atrás
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
