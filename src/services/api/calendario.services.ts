import api from "@/services/api";
import { CalendarioEstudianteResponse } from "@/services/interface/calendario_estudiante";

async function getEventosCalendarioService(
  idAsesoria: number
): Promise<CalendarioEstudianteResponse> {
  const response = await api.get<CalendarioEstudianteResponse>(
    `/common/calendario_estudiante/${idAsesoria}/`
  );
  return response.data;
}

export const calendarioServices = {
  getEventosCalendarioService,
};
