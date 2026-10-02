import { ParallaxPanel } from "@/components/ui/home/parallax-section";

export function ParallaxShowcase() {
  return (
    <>
      <ParallaxPanel
        id="materias"
        title="Organiza cada materia"
        description="Cada materia en su lugar"
        image="/images/artes.jpg"
      />

      <ParallaxPanel
        id="tareas"
        title="Nunca pierdas una entrega"
        description="Lo que falta, siempre a la vista"
        image="/images/libros.jpg"
      />

      <ParallaxPanel
        id="grupos"
        title="Trabaja en equipo"
        description="Nadie trabaja solo"
        image="/images/palmeras.jpg"
      />
    </>
  );
}