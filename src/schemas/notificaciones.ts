import { z } from "zod";

// ObjectId de Mongo: 24 caracteres hexadecimales
const OBJECT_ID = /^[a-f0-9]{24}$/;

// --- Una notificación, tal como la devuelve GET /notificaciones/me ---
export const notificacionSchema = z.object({
  id: z.string().regex(OBJECT_ID),
  tipo: z.string(),
  titulo: z.string().min(1),
  mensaje: z.string().min(1),
  leida: z.boolean(),
  referencia_id: z.number().int().positive().nullable().optional(), // ej. el id de la tarea
  fecha_creacion: z.string().datetime(), // ISO en UTC: "2026-11-15T01:15:05.075Z"
});

export type Notificacion = z.infer<typeof notificacionSchema>;

// GET /notificaciones/me → las 50 más recientes, de la más nueva a la más vieja
export const notificacionesListadoSchema = z.array(notificacionSchema);

// --- Marcar como leída (PATCH /notificaciones/{id}/leida → 204) ---
export const marcarLeidaInputSchema = z.object({
  id: z.string().regex(OBJECT_ID, "Notificación inválida"),
});

// --- Errores de NestJS: { message, error, statusCode } ---
export const notificacionErrorSchema = z.object({
  statusCode: z.number().int(),
  message: z.union([z.string(), z.array(z.string())]), // el ValidationPipe manda una lista
  error: z.string().optional(),
});