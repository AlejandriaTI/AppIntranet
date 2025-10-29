"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const PREGUNTAS = [
  {
    id: "1",
    pregunta: "¿Qué pasa si no entrego a tiempo un trabajo o avance?",
    respuesta:
      "Podrás reprogramar la entrega con previa coordinación. Sin embargo, es importante ajustarse al cronograma acordado para evitar retrasos en tu proyecto.",
  },
  {
    id: "2",
    pregunta: "¿Puedo actualizar mis datos personales después del registro?",
    respuesta:
      "Sí, puedes modificar tus datos desde tu perfil dentro del plazo de edición establecido. Fuera de ese plazo, debes solicitar el cambio al área administrativa.",
  },
  {
    id: "3",
    pregunta: "¿Ofrecen apoyo para todos los grados académicos?",
    respuesta:
      "Sí, brindamos consultoría para tesis y trabajos académicos de pregrado, maestría y doctorado, adaptándonos a los requisitos de cada nivel.",
  },
  {
    id: "4",
    pregunta: "¿También realizan trabajos académicos puntuales?",
    respuesta:
      "Sí, además de tesis completas, ofrecemos servicios por entregables específicos, como capítulos, análisis estadístico, correcciones y más.",
  },
  {
    id: "5",
    pregunta: "¿Puedo solicitar solo la revisión o corrección de mi tesis?",
    respuesta:
      "Sí, ofrecemos servicios de revisión de estilo, redacción académica, normas APA, así como corrección de fondo y forma.",
  },
  {
    id: "6",
    pregunta: "¿Cuánto tiempo tarda el desarrollo de una tesis?",
    respuesta: "El tiempo varía según el grado académico y el alcance del proyecto.",
  },
  {
    id: "7",
    pregunta: "¿Cómo se asigna el asesor que me apoyará?",
    respuesta:
      "El asesor es asignado según tu carrera, el tipo de trabajo requerido y tu disponibilidad de horarios, asegurando afinidad temática y metodológica.",
  },
  {
    id: "8",
    pregunta: "¿Ofrecen acompañamiento hasta la sustentación?",
    respuesta:
      "Sí, brindamos asesoría completa que incluye preparación para la defensa, simulacros de sustentación y elaboración de diapositivas.",
  },
]

export default function PreguntasFrecuentes() {
  return (
    <Accordion type="single" collapsible className="w-full">
      {PREGUNTAS.map((item) => (
        <AccordionItem key={item.id} value={item.id}>
          <AccordionTrigger className="text-left hover:no-underline">
            <span className="font-medium">{item.pregunta}</span>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">{item.respuesta}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
