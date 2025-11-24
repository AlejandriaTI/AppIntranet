import { Filesystem, Directory } from "@capacitor/filesystem";
import { Capacitor, CapacitorHttp } from "@capacitor/core";
import { toast } from "sonner";

/**
 * Descarga un archivo usando Capacitor en móvil o el navegador en web
 * @param url - URL del archivo a descargar
 * @param fileName - Nombre del archivo (se extrae de la URL si no se proporciona)
 */
export async function downloadFile(
  url: string,
  fileName?: string
): Promise<void> {
  try {
    // Extraer el nombre del archivo de la URL si no se proporciona
    const finalFileName =
      fileName || decodeURIComponent(url.split("/").pop() || "documento");

    // Verificar si estamos en una plataforma nativa (iOS/Android)
    const isNative = Capacitor.isNativePlatform();

    if (isNative) {
      // Descarga para dispositivos móviles usando CapacitorHttp (bypasses CORS)
      toast.loading("Descargando archivo...");

      try {
        const response = await CapacitorHttp.get({
          url: url,
          responseType: "blob",
        });

        if (response.status !== 200) {
          throw new Error(`Error al descargar: ${response.status}`);
        }

        const base64Data = response.data;

        const result = await Filesystem.writeFile({
          path: finalFileName,
          data: base64Data,
          directory: Directory.Documents,
        });

        toast.dismiss();
        toast.success(`Archivo guardado exitosamente`);
        console.log("✅ Archivo guardado en:", result.uri);
      } catch (downloadError) {
        console.error("❌ Error en descarga:", downloadError);
        toast.dismiss();
        toast.error("Error al descargar el archivo");
        throw downloadError;
      }
    } else {
      // Descarga para navegador web
      const link = document.createElement("a");
      link.href = url;
      link.download = finalFileName;
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Descarga iniciada");
    }
  } catch (error) {
    console.error("❌ Error al descargar archivo:", error);
    toast.dismiss();
    toast.error("Error al descargar el archivo");
    throw error;
  }
}
