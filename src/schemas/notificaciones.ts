import { z } from "zod";

export const notificacionTipoSchema = z.enum([
  "recordatorio_tarea",
  "tarea_por_vencer",
  "tarea_vencida",
  "invitacion_grupo",
  "nueva_tarea_grupo",
  "informativo",
]);

export const notificacionSchema = z.object({
  id: z.string().uuid(),
  tipo: notificacionTipoSchema,
  tareaId: z.string().uuid().optional(),
  grupoId: z.string().uuid().optional(),
  titulo: z.string().min(1),
  mensaje: z.string().min(1),
  leida: z.boolean(),
  creadaEn: z.string().datetime(),
});

export type Notificacion = z.infer<typeof notificacionSchema>;

export const notificacionesListadoSchema = z.array(notificacionSchema);