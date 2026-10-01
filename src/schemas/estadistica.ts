import { z } from "zod";

export const consultarEstadisticasUsuarioQuerySchema = z.object({
  periodo: z.string().regex(/^\d{4}-\d{2}$/).optional(),
  materia_id: z.number().int().positive().optional(),
});

export type ConsultarEstadisticasUsuarioQuery = z.infer<typeof consultarEstadisticasUsuarioQuerySchema>;

export const tareasResumenSchema = z.object({
  total: z.number().int().nonnegative(),
  completadas: z.number().int().nonnegative(),
  pendientes: z.number().int().nonnegative(),
  vencidas: z.number().int().nonnegative(),
  porcentaje_completado: z.number().min(0).max(100),
});

export type TareasResumen = z.infer<typeof tareasResumenSchema>;

export const gruposResumenSchema = z.object({
  total_grupos: z.number().int().nonnegative(),
  grupos_activos: z.number().int().nonnegative(),
});

export type GruposResumen = z.infer<typeof gruposResumenSchema>;

export const materiaResumenSchema = z.object({
  materia_id: z.number().int().positive(),
  nombre: z.string(),
  tareas_completadas: z.number().int().nonnegative(),
  tareas_total: z.number().int().nonnegative(),
});

export type MateriaResumen = z.infer<typeof materiaResumenSchema>;

export const estadisticasUsuarioSchema = z.object({
  usuario_id: z.number().int().positive(),
  nombre: z.string(),
  periodo: z.string().regex(/^\d{4}-\d{2}$/).optional(),
  tareas: tareasResumenSchema,
  grupos: gruposResumenSchema,
  materias: z.array(materiaResumenSchema),
  fecha_calculo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export type EstadisticasUsuario = z.infer<typeof estadisticasUsuarioSchema>;