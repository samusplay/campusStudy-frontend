import { z } from "zod";

export const materiaSchema = z.object({
  id: z.string().uuid(),
  nombre: z.string().min(1),
  nrc: z.string().min(1),
  creadaEn: z.string().datetime(),
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