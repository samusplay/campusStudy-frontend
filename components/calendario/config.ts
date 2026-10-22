import type { TareaEstado, TareaPrioridad } from "./tipos";

// Las clases van completas (no concatenadas) para que Tailwind las detecte.
export const ESTADOS: {
  valor: TareaEstado;
  etiqueta: string;
  punto: string;
}[] = [
  { valor: "pendiente", etiqueta: "Pendiente", punto: "bg-amber" },
  { valor: "en_progreso", etiqueta: "En progreso", punto: "bg-[#4a7bb5]" },
  { valor: "completada", etiqueta: "Completada", punto: "bg-[#5f8a5b]" },
  { valor: "cancelada", etiqueta: "Cancelada", punto: "bg-[#8a8f98]" },
];

export const PRIORIDADES: {
  valor: TareaPrioridad;
  etiqueta: string;
  texto: string;
  borde: string;
}[] = [
  { valor: "alta", etiqueta: "Alta", texto: "text-[#e0786d]", borde: "border-[#e0786d]" },
  { valor: "media", etiqueta: "Media", texto: "text-[#d9a441]", borde: "border-[#d9a441]" },
  { valor: "baja", etiqueta: "Baja", texto: "text-[#8fa0b5]", borde: "border-[#8fa0b5]" },
];

export const estadoInfo = (e: TareaEstado) =>
  ESTADOS.find((x) => x.valor === e) ?? ESTADOS[0];

export const prioridadInfo = (p: TareaPrioridad) =>
  PRIORIDADES.find((x) => x.valor === p);
