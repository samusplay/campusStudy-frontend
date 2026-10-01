import { z } from "zod";

export const notificacionSchema = z.object({
  notificacion_id: z.number().int().positive(),
  usuario_id: z.number().int().positive(),
  tipo: z.string(),
  titulo: z.string().min(1),
  mensaje: z.string().min(1),
  fecha_creacion: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  estado: z.string(),
  referencia_id: z.number().int().positive().optional(),
});

export type Notificacion = z.infer<typeof notificacionSchema>;

export const notificacionesListadoSchema = z.array(notificacionSchema);

export const crearNotificacionInputSchema = z.object({
  usuario_id: z.number().int().positive(),
  tipo: z.string(),
  titulo: z.string().min(1),
  mensaje: z.string().min(1),
  fecha_creacion: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  estado: z.string(),
  referencia_id: z.number().int().positive().optional(),
});

export type CrearNotificacionInput = z.infer<typeof crearNotificacionInputSchema>;

export const crearNotificacionResponseSchema = z.object({
  codigo: z.literal(201),
  mensaje: z.string(),
  fecha_creacion: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export type CrearNotificacionResponse = z.infer<typeof crearNotificacionResponseSchema>;

export const errorNotificacionesSchema = z.object({
  codigo: z.number().int(),
  mensaje: z.string(),
  detalle: z.string().optional(),
});

export type ErrorNotificaciones = z.infer<typeof errorNotificacionesSchema>;