import { z } from "zod";

export const integranteRolSchema = z.enum(["lider", "miembro"]);

export const integranteSchema = z.object({
  usuario_id: z.number().int().positive(),
  rol: integranteRolSchema,
  unido_en: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/),
});

export type Integrante = z.infer<typeof integranteSchema>;

export const grupoSchema = z.object({
  grupo_id: z.number().int().positive(),
  nombre: z.string().min(1),
  materia_id: z.number().int().positive(),
  creado_por: z.number().int().positive(),
  integrantes: z.array(integranteSchema),
  fecha_creacion: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/),
});

export type Grupo = z.infer<typeof grupoSchema>;

export const crearGrupoInputSchema = z.object({
  nombre: z.string().min(1),
  materia_id: z.number().int().positive(),
});

export type CrearGrupoInput = z.infer<typeof crearGrupoInputSchema>;

export const invitarIntegranteInputSchema = z.object({
  usuario_id: z.number().int().positive(),
});

export type InvitarIntegranteInput = z.infer<typeof invitarIntegranteInputSchema>;

export const gruposListadoSchema = z.array(grupoSchema);

export const mensajeExitoSchema = z.object({
  mensaje: z.string(),
});

export type MensajeExito = z.infer<typeof mensajeExitoSchema>;