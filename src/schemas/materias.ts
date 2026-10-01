import { z } from "zod";

export const materiaSchema = z.object({
  materia_id: z.number().int().positive(),
  nombre: z.string().min(1),
  nrc: z.string().min(1),
  fecha_creacion: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/),
});

export type Materia = z.infer<typeof materiaSchema>;

export const crearMateriaInputSchema = z.object({
  nombre: z.string().min(1),
  nrc: z.string().min(1),
});

export type CrearMateriaInput = z.infer<typeof crearMateriaInputSchema>;

export const materiasListadoSchema = z.array(materiaSchema);

export const mensajeExitoSchema = z.object({
  mensaje: z.string(),
});

export type MensajeExito = z.infer<typeof mensajeExitoSchema>;