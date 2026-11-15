import { z } from "zod";

// --- Valores fijos (iguales al backend) ---
export const tareaPrioridadSchema = z.enum(["baja", "media", "alta"]);
export const tareaEstadoSchema = z.enum(["pendiente", "en_progreso", "completada", "cancelada"]);

export type TareaPrioridad = z.infer<typeof tareaPrioridadSchema>;
export type TareaEstado = z.infer<typeof tareaEstadoSchema>;

// --- Formatos compartidos ---
const FECHA = /^\d{4}-\d{2}-\d{2}$/;
const HORA = /^([01]\d|2[0-3]):[0-5]\d$/; // 00:00 a 23:59

// --- Una tarea, tal como la devuelven GET, POST y PUT /tareas ---
export const tareaSchema = z.object({
  tarea_id: z.number().int().positive(),
  titulo: z.string().min(1),
  descripcion: z.string().nullable(),
  materia_id: z.number().int().positive(),
  grupo_id: z.number().int().positive().nullable(), // null = tarea personal
  fecha_entrega: z.string().regex(FECHA),
  hora_entrega: z.string().regex(HORA).nullable(),
  prioridad: tareaPrioridadSchema,
  estado: tareaEstadoSchema,
});

export type Tarea = z.infer<typeof tareaSchema>;

// GET /tareas → arreglo plano
export const tareasListadoSchema = z.array(tareaSchema);

// --- Formulario de crear ---
export const crearTareaInputSchema = z.object({
  titulo: z.string().trim().min(1, "El título es obligatorio").max(150, "Máximo 150 caracteres"),
  descripcion: z
    .string()
    .trim()
    .max(1000, "Máximo 1000 caracteres")
    .transform((valor) => (valor === "" ? null : valor)),
  materia_id: z.coerce.number().int().positive("Selecciona una materia"),
  fecha_entrega: z.string().regex(FECHA, "La fecha de entrega es obligatoria"),
  hora_entrega: z
    .string()
    .refine((valor) => valor === "" || HORA.test(valor), "La hora debe estar entre 00:00 y 23:59")
    .transform((valor) => (valor === "" ? null : valor)),
  prioridad: tareaPrioridadSchema.default("media"),
});

export type CrearTareaInput = z.infer<typeof crearTareaInputSchema>;

// --- Formulario de editar (PUT /tareas/{id}: reemplaza la tarea completa) ---
export const editarTareaInputSchema = crearTareaInputSchema.extend({
  tarea_id: z.coerce.number().int().positive("Tarea inválida"),
  // Viaja en un input oculto: "" = personal, "12" = del grupo 12. Se reenvía tal cual.
  grupo_id: z
    .string()
    .transform((valor) => (valor === "" ? null : Number(valor)))
    .pipe(z.number().int().positive().nullable()),
  // Al editar, la prioridad ya existe: es obligatoria (sin default)
  prioridad: tareaPrioridadSchema,
});

export type EditarTareaInput = z.infer<typeof editarTareaInputSchema>;

// --- Cambiar estado (botones Empezar / Completar) ---
export const cambiarEstadoInputSchema = z.object({
  tarea_id: z.coerce.number().int().positive("Tarea inválida"),
  estado: tareaEstadoSchema,
});

export type CambiarEstadoInput = z.infer<typeof cambiarEstadoInputSchema>;

// PUT /tareas/{id}/estado → solo lo que cambió
export const cambioEstadoSchema = z.object({
  tarea_id: z.number().int().positive(),
  estado: tareaEstadoSchema,
  fecha_actualizacion: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/),
});

export type CambioEstado = z.infer<typeof cambioEstadoSchema>;

// --- Eliminar (cancelar): solo el id ---
export const eliminarTareaInputSchema = cambiarEstadoInputSchema.pick({ tarea_id: true });

// --- Errores del servicio de tareas: { exito: false, error: { …, errores } } ---
export const tareaErrorSchema = z.object({
  exito: z.literal(false),
  error: z.object({
    codigo: z.number().int(),
    tipo: z.string(),
    mensaje: z.string(),
    errores: z
      .array(z.object({ campo: z.string(), mensaje: z.string() }))
      .nullable()
      .optional(),
  }),
});