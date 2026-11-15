import type { Tarea as TareaApi } from "@/src/schemas/tareas";

// Derivados del contrato real (src/schemas/tareas.ts) para que no se desincronicen.
export type TareaEstado = TareaApi["estado"];
export type TareaPrioridad = NonNullable<TareaApi["prioridad"]>;

// El listado del backend solo trae 5 campos; hora y prioridad son opcionales.
// Una Tarea completa de la API también es asignable a este tipo.
export type Tarea = Pick<
  TareaApi,
  "tarea_id" | "titulo" | "materia_id" | "fecha_entrega" | "estado"
> &
  Partial<Pick<TareaApi, "hora_entrega" | "prioridad">> & {
    nombre_materia?: string;
  };
