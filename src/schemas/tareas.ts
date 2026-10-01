import { z } from "zod";

export const tareaPrioridadSchema = z.enum(["baja", "media", "alta"]);

export const tareaEstadoSchema = z.enum([
  "pendiente",
  "en_progreso",
  "completada",
  "cancelada",
]);

export const tareaSchema = z.object({
  tarea_id: z.number().int().positive(),
  titulo: z.string().min(1).max(150),
  descripcion: z.string().max(1000).optional(),
  usuario_id: z.number().int().positive(),
  materia_id: z.number().int().positive(),
  grupo_id: z.number().int().positive().nullable().optional(),
  fecha_entrega: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  hora_entrega: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  prioridad: tareaPrioridadSchema.optional(),
  estado: tareaEstadoSchema,
  fecha_creacion: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/),
  fecha_actualizacion: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/),
});

export type Tarea = z.infer<typeof tareaSchema>;

export const crearTareaInputSchema = z.object({
  titulo: z.string().min(1).max(150),
  descripcion: z.string().max(1000).optional(),
  usuario_id: z.number().int().positive(),
  materia_id: z.number().int().positive(),
  grupo_id: z.number().int().positive().nullable().optional(),
  fecha_entrega: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  hora_entrega: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  prioridad: tareaPrioridadSchema.optional(),
});

export type CrearTareaInput = z.infer<typeof crearTareaInputSchema>;

export const actualizarTareaInputSchema = z.object({
  titulo: z.string().min(1).max(150).optional(),
  descripcion: z.string().max(1000).optional(),
  fecha_entrega: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  hora_entrega: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  prioridad: tareaPrioridadSchema.optional(),
});

export type ActualizarTareaInput = z.infer<typeof actualizarTareaInputSchema>;

export const actualizarEstadoTareaInputSchema = z.object({
  estado: tareaEstadoSchema,
});

export type ActualizarEstadoTareaInput = z.infer<typeof actualizarEstadoTareaInputSchema>;

export const tareaListadoItemSchema = z.object({
  tarea_id: z.number().int().positive(),
  titulo: z.string(),
  materia_id: z.number().int().positive(),
  fecha_entrega: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  estado: tareaEstadoSchema,
});

export type TareaListadoItem = z.infer<typeof tareaListadoItemSchema>;

export const tareasListadoSchema = z.object({
  total: z.number().int().nonnegative(),
  pagina: z.number().int().positive(),
  tamano: z.number().int().positive(),
  tareas: z.array(tareaListadoItemSchema),
});

export type TareasListado = z.infer<typeof tareasListadoSchema>;

export const resumenTareasSchema = z.object({
  usuario_id: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  pendientes: z.number().int().nonnegative(),
  en_progreso: z.number().int().nonnegative(),
  completadas: z.number().int().nonnegative(),
  canceladas: z.number().int().nonnegative(),
  vencidas: z.number().int().nonnegative(),
});

export type ResumenTareas = z.infer<typeof resumenTareasSchema>;

export const errorTareasSchema = z.object({
  codigo: z.number().int(),
  tipo: z.string(),
  mensaje: z.string(),
});

export type ErrorTareas = z.infer<typeof errorTareasSchema>;

export function respuestaTareasSchema<T extends z.ZodTypeAny>(datosSchema: T) {
  return z.discriminatedUnion("exito", [
    z.object({
      exito: z.literal(true),
      datos: datosSchema,
      mensaje: z.string(),
    }),
    z.object({
      exito: z.literal(false),
      error: errorTareasSchema,
    }),
  ]);
}

export const crearTareaResponseSchema = respuestaTareasSchema(tareaSchema);
export const obtenerTareaResponseSchema = respuestaTareasSchema(tareaSchema);
export const actualizarTareaResponseSchema = respuestaTareasSchema(tareaSchema);
export const listarTareasResponseSchema = respuestaTareasSchema(tareasListadoSchema);
export const cambiarEstadoResponseSchema = respuestaTareasSchema(
  z.object({ tarea_id: z.number().int().positive(), estado: tareaEstadoSchema })
);
export const cancelarTareaResponseSchema = respuestaTareasSchema(
  z.object({ tarea_id: z.number().int().positive(), estado: z.literal("cancelada") })
);
export const resumenTareasResponseSchema = respuestaTareasSchema(resumenTareasSchema);