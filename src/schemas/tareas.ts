import { z } from "zod";

export const tareaPrioridadSchema = z.enum(["alta", "media", "baja"]);

export const tareaEstadoSchema = z.enum([
  "pendiente",
  "en_progreso",
  "completada",
  "vencida",
]);

export const tareaSchema = z.object({
  id: z.string().uuid(),
  titulo: z.string().min(1),
  descripcion: z.string().optional(),
  materiaId: z.string().uuid(),
  grupoId: z.string().uuid().optional(),
  usuarioId: z.string().uuid(),
  prioridad: tareaPrioridadSchema,
  estado: tareaEstadoSchema,
  fechaEntrega: z.string().datetime(),
  recordatorioEn: z.string().datetime().optional(),
  creadaEn: z.string().datetime(),
});

export type Tarea = z.infer<typeof tareaSchema>;

export const crearTareaInputSchema = z.object({
  titulo: z.string().min(1),
  descripcion: z.string().optional(),
  materiaId: z.string().uuid(),
  grupoId: z.string().uuid().optional(),
  prioridad: tareaPrioridadSchema,
  fechaEntrega: z.string().datetime(),
  recordatorioEn: z.string().datetime().optional(),
});

export type CrearTareaInput = z.infer<typeof crearTareaInputSchema>;

export const actualizarEstadoTareaInputSchema = z.object({
  estado: tareaEstadoSchema,
});

export type ActualizarEstadoTareaInput = z.infer<typeof actualizarEstadoTareaInputSchema>;

export const tareasListadoSchema = z.array(tareaSchema);

export const comentarioSchema = z.object({
  id: z.string().uuid(),
  tareaId: z.string().uuid(),
  usuarioId: z.string().uuid(),
  mensaje: z.string().min(1),
  creadoEn: z.string().datetime(),
});

export type Comentario = z.infer<typeof comentarioSchema>;

export const crearComentarioInputSchema = z.object({
  mensaje: z.string().min(1),
});

export type CrearComentarioInput = z.infer<typeof crearComentarioInputSchema>;

export const comentariosListadoSchema = z.array(comentarioSchema);

export const mensajeExitoSchema = z.object({
  mensaje: z.string(),
});

export type MensajeExito = z.infer<typeof mensajeExitoSchema>;