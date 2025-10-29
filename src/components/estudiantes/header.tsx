import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
interface HeaderProps {
  isLoading: boolean;
}

export function Header({ isLoading }: HeaderProps) {
  if (isLoading) {
    return (
      <div className="bg-primary text-primary-foreground rounded-lg m-4 overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-6 p-6 md:p-8">
          <div className="flex-1 space-y-4">
            <Skeleton className="h-4 w-32 bg-primary-foreground/20" />
            <Skeleton className="h-10 w-full max-w-md bg-primary-foreground/20" />
            <Skeleton className="h-4 w-full max-w-lg bg-primary-foreground/20" />
          </div>
          <Skeleton className="w-full md:w-64 h-40 rounded-lg bg-primary-foreground/20 shrink-0" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-primary text-primary-foreground rounded-lg m-4 overflow-hidden">
      <div className="flex flex-col md:flex-row items-center gap-6 p-6 md:p-8">
        <div className="flex-1">
          <p className="text-sm opacity-90 mb-2">24 de Octubre, 2025</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-balance">
            Bienvenido Juan Tinoco al Intranet de asesoría de tesis
          </h1>
          <p className="text-sm md:text-base opacity-90">
            Aquí encontrarás toda la información para tu asesoría de tesis
          </p>
        </div>
        <div className="w-full md:w-64 h-40 rounded-lg bg-primary-foreground/10 shrink-0 overflow-hidden">
          <Image
            src="/graduation-ceremony-students.jpg"
            alt="Graduación"
            className="w-full h-full object-cover"
            width={32}
            height={32}
          />
        </div>
      </div>
    </div>
  );
}
