function getInitials(nombreCompleto: string): string {
  if (!nombreCompleto) return "";
  const partes = nombreCompleto.trim().split(" ");
  const iniciales = partes
    .slice(0, 2) // Toma máximo 2 palabras (nombre y apellido)
    .map((p) => p.charAt(0).toUpperCase())
    .join("");
  return iniciales;
}
export default getInitials;