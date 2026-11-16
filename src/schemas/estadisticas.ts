import { z } from "zod";

const PERIODO = /^\d{4}-\d{2}$/; // "2026-11"
const FECHA = /^\d{4}-\d{2}-\d{2}$/; // "2026-11-15"

// --- Filtros (llegan de la URL: siempre como texto) ---
export const consultarEstadisticasUsuarioQuerySchema = z.object({
  periodo: z.string().regex(PERIODO, "El periodo debe tener el formato AAAA-MM").optional(),
  materia_id: z.coerce.number().int().positive().optional(),
});

export type ConsultarEstadisticasUsuarioQuery = z.infer<typeof consultarEstadisticasUsuarioQuerySchema>;

// --- Bloques que se repiten en las tres respuestas ---
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
  nombre: z.string(), // puede ser "Materia {id}": el front lo cruza con las materias del usuario
  tareas_completadas: z.number().int().nonnegative(),
  tareas_total: z.number().int().nonnegative(),
});

export type MateriaResumen = z.infer<typeof materiaResumenSchema>;

// --- GET /estadisticas/me  (?periodo=AAAA-MM opcional) ---
export const estadisticasUsuarioSchema = z.object({
  usuario_id: z.number().int().positive(),
  nombre: z.string(),
  periodo: z.string().regex(PERIODO).nullable().optional(), // solo viene si se filtró por mes
  tareas: tareasResumenSchema,
  grupos: gruposResumenSchema,
  materias: z.array(materiaResumenSchema),
  fecha_calculo: z.string().regex(FECHA),
});

export type EstadisticasUsuario = z.infer<typeof estadisticasUsuarioSchema>;

// --- GET /estadisticas/materia/{materia_id} ---
export const estadisticasMateriaSchema = z.object({
  materia_id: z.number().int().positive(),
  nombre: z.string(),
  nrc: z.string().nullable().optional(), // la proyección lo guarda cuando materias publique eventos
  tareas: tareasResumenSchema,
  grupos: gruposResumenSchema,
  fecha_calculo: z.string().regex(FECHA),
});

export type EstadisticasMateria = z.infer<typeof estadisticasMateriaSchema>;

// --- GET /estadisticas/grupo/{grupo_id} ---
export const estadisticasGrupoSchema = z.object({
  grupo_id: z.number().int().positive(),
  nombre: z.string(),
  materia_id: z.number().int().positive(),
  integrantes: z.number().int().nonnegative(),
  tareas: tareasResumenSchema,
  fecha_calculo: z.string().regex(FECHA),
});

export type EstadisticasGrupo = z.infer<typeof estadisticasGrupoSchema>;