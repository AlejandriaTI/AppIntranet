export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "No especificada";

  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
