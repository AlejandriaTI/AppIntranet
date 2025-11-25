"use client";

import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { SubjectCard } from "@/components/estudiantes/entrega/vermas/subject-card";
import { SubjectDetailDrawer } from "@/components/estudiantes/entrega/vermas/subject-detail-drawer";
import { Header } from "@/components/estudiantes/entrega/vermas/header";

// Mock data
const mockData = {
  data: [
    {
      id_asunto: "5a7b1d0a-1f9a-4f0e-948d-51339c5b132e",
      titulo: "Revisado Avance 1",
      titulo_asesor: "Asesor de Avance 1",
      profesion_asesoria: "Investigacion Sistema tributario",
      estado: "terminado",
      fecha_principal: "2025-05-14T16:00:00.000Z",
      fecha_entrega: "2025-05-01T10:00:00.000Z",
      fecha_revision: "2025-05-06T13:45:00.000Z",
      fecha_estimada: "2025-05-02T10:00:00.000Z",
      fecha_terminado: "2025-05-14T16:00:00.000Z",
      documentos: [
        {
          nombre: "Justificacion.pdf",
          ruta: "https://f004.backblazeb2.com/file/IntranetAlejandria/documentos/1751560728723-Downloads.rar",
          subido_por: "estudiante",
          fecha: "2025-05-01T10:00:00.000Z",
        },
        {
          nombre: "Introduccion.docx",
          ruta: "https://f004.backblazeb2.com/file/IntranetAlejandria/documentos/1751557549104-TRABAJOINDIVIDUAL_1748533065552.docx",
          subido_por: "estudiante",
          fecha: "2025-05-01T10:00:00.000Z",
        },
        {
          nombre: "Revision_Justificacion.webp",
          ruta: "https://f004.backblazeb2.com/file/IntranetAlejandria/documentos/1751557549104-TRABAJOINDIVIDUAL_1748533065552.docx",
          subido_por: "asesor",
          fecha: "2025-05-14T16:00:00.000Z",
        },
        {
          nombre: "Revision_Introduccion.png",
          ruta: "https://f004.backblazeb2.com/file/IntranetAlejandria/documentos/1751558207347-Alternativas-de-Seguridad-para-eCommerce-Samsung.pptx",
          subido_por: "asesor",
          fecha: "2025-05-14T16:00:00.000Z",
        },
      ],
    },
    {
      id_asunto: "2d6f8b7a-3dc6-49e7-92f7-72fd64d6c422",
      titulo: "Correcion parcial",
      titulo_asesor: "Avance 1 entregado",
      profesion_asesoria: "Investigacion Sistema tributario",
      estado: "terminado",
      fecha_principal: "2025-10-30T17:24:06.000Z",
      fecha_entrega: "2025-05-10T09:00:00.000Z",
      fecha_revision: "2025-05-10T14:00:00.000Z",
      fecha_estimada: "2025-05-10T15:30:00.000Z",
      fecha_terminado: "2025-10-30T17:24:06.000Z",
      documentos: [
        {
          nombre: "Tesis_parcial.mp4",
          ruta: "https://f004.backblazeb2.com/file/IntranetAlejandria/documentos/1751558207347-Alternativas-de-Seguridad-para-eCommerce-Samsung.pptx",
          subido_por: "estudiante",
          fecha: "2025-05-10T09:00:00.000Z",
        },
        {
          nombre: "1761845046013-1751475279015-SPRINGS BACKEND (5).xlsx",
          ruta: "https://f004.backblazeb2.com/file/IntranetAlejandria/documentos/1761845046013-1751475279015-SPRINGS BACKEND (5).xlsx",
          subido_por: "asesor",
          fecha: "2025-10-30T17:24:07.000Z",
        },
      ],
    },
    {
      id_asunto: "20ee1e91-6b31-4d34-8bb9-3f0e71628aa6",
      titulo: "Entrega Final",
      titulo_asesor: "Avacne 3 entregado",
      profesion_asesoria: "Investigacion Sistema tributario",
      estado: "terminado",
      fecha_principal: "2025-10-30T17:24:26.000Z",
      fecha_entrega: "2025-05-20T11:30:00.000Z",
      fecha_revision: "2025-10-30T17:24:14.000Z",
      fecha_estimada: "2025-11-07T17:24:14.000Z",
      fecha_terminado: "2025-10-30T17:24:26.000Z",
      documentos: [
        {
          nombre: "Documento_Final.gif",
          ruta: "https://f004.backblazeb2.com/file/IntranetAlejandria/documentos/1751560819207-reunion-de-asesores-juridicos.jpeg",
          subido_por: "estudiante",
          fecha: "2025-05-20T11:30:00.000Z",
        },
        {
          nombre:
            "1761845066781-DocumentaciÃ³n_Funcional_AlejandrÃ­a_FINAL_IMAGENES.docx",
          ruta: "https://f004.backblazeb2.com/file/IntranetAlejandria/documentos/1761845066781-DocumentaciÃ³n_Funcional_AlejandrÃ­a_FINAL_IMAGENES.docx",
          subido_por: "asesor",
          fecha: "2025-10-30T17:24:32.000Z",
        },
      ],
    },
    {
      id_asunto: "b1d0f56f-a2a2-4b7c-9657-de7b18b3d99b",
      titulo: "Hola",
      titulo_asesor: "AÑSAÑS",
      profesion_asesoria: "Investigacion Sistema tributario",
      estado: "terminado",
      fecha_principal: "2025-10-30T17:25:06.000Z",
      fecha_entrega: "2025-10-24T14:58:25.000Z",
      fecha_revision: "2025-10-30T17:24:57.000Z",
      fecha_estimada: "2025-11-07T17:24:57.000Z",
      fecha_terminado: "2025-10-30T17:25:06.000Z",
      documentos: [
        {
          nombre: "1761317905430-prueba.docx",
          ruta: "https://f004.backblazeb2.com/file/IntranetAlejandria/documentos/1761317905430-prueba.docx",
          subido_por: "estudiante",
          fecha: "2025-10-24T14:58:26.000Z",
        },
        {
          nombre: "1761845106197-1751475279015-SPRINGS BACKEND (5).xlsx",
          ruta: "https://f004.backblazeb2.com/file/IntranetAlejandria/documentos/1761845106197-1751475279015-SPRINGS BACKEND (5).xlsx",
          subido_por: "asesor",
          fecha: "2025-10-30T17:25:07.000Z",
        },
      ],
    },
    {
      id_asunto: "fa2a8f38-3161-479f-89d2-ec017d7a028f",
      titulo: "21",
      titulo_asesor: null,
      profesion_asesoria: "Investigacion Sistema tributario",
      estado: "entregado",
      fecha_principal: "2025-10-24T15:26:57.000Z",
      fecha_entrega: "2025-10-24T15:26:57.000Z",
      fecha_revision: null,
      fecha_estimada: null,
      fecha_terminado: null,
      documentos: [
        {
          nombre: "1761319617696-prueba.pdf",
          ruta: "https://f004.backblazeb2.com/file/IntranetAlejandria/documentos/1761319617696-prueba.pdf",
          subido_por: "estudiante",
          fecha: "2025-10-24T15:26:59.000Z",
        },
      ],
    },
    {
      id_asunto: "9d5cc03d-62d1-4790-a8c1-ca99c31a12a5",
      titulo: "12",
      titulo_asesor: null,
      profesion_asesoria: "Investigacion Sistema tributario",
      estado: "entregado",
      fecha_principal: "2025-11-07T19:27:33.000Z",
      fecha_entrega: "2025-11-07T19:27:33.000Z",
      fecha_revision: null,
      fecha_estimada: null,
      fecha_terminado: null,
      documentos: [
        {
          nombre: "1762543653836-kommo_export_leads_2025-11-05.xlsx",
          ruta: "https://f004.backblazeb2.com/file/IntranetAlejandria/documentos/1762543653836-kommo_export_leads_2025-11-05.xlsx",
          subido_por: "estudiante",
          fecha: "2025-11-07T19:27:35.000Z",
        },
      ],
    },
    {
      id_asunto: "f6537256-c767-4498-8aeb-4cbf378041df",
      titulo: "!",
      titulo_asesor: null,
      profesion_asesoria: "Investigacion Sistema tributario",
      estado: "entregado",
      fecha_principal: "2025-11-07T19:28:59.000Z",
      fecha_entrega: "2025-11-07T19:28:59.000Z",
      fecha_revision: null,
      fecha_estimada: null,
      fecha_terminado: null,
      documentos: [
        {
          nombre: "1762543739302-1751475279015-SPRINGS BACKEND (1).xlsx",
          ruta: "https://f004.backblazeb2.com/file/IntranetAlejandria/documentos/1762543739302-1751475279015-SPRINGS BACKEND (1).xlsx",
          subido_por: "estudiante",
          fecha: "2025-11-07T19:29:00.000Z",
        },
      ],
    },
  ],
};

export default function VerMas() {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);

  const handleSelectSubject = (subject: any) => {
    setSelectedSubject(subject);
    setShowDrawer(true);
  };

  const handleCloseDrawer = () => {
    setShowDrawer(false);
    setSelectedSubject(null);
  };

  return (
    <div className="min-h-screen  dark:from-slate-950 dark:to-slate-900">
      <Header />

      <main className="pb-8">
        <div className="max-w-2xl mx-auto px-4 pt-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              {showDrawer && (
                <button
                  onClick={handleCloseDrawer}
                  className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-900 dark:text-white"
                  aria-label="Volver atrás"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Mis Asuntos
              </h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              Total de asuntos: {mockData.data.length}
            </p>
          </div>

          <div className="space-y-4">
            {mockData.data.map((subject) => (
              <SubjectCard
                key={subject.id_asunto}
                subject={subject}
                onViewMore={() => handleSelectSubject(subject)}
              />
            ))}
          </div>
        </div>
      </main>

      {showDrawer && selectedSubject && (
        <SubjectDetailDrawer
          subject={selectedSubject}
          onClose={handleCloseDrawer}
        />
      )}
    </div>
  );
}
