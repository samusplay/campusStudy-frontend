import { z } from "zod";

export const integranteRolSchema = z.enum(["lider", "miembro"]);

export const integranteSchema = z.object({
  usuarioId: z.string().uuid(),
  rol: integranteRolSchema,
  unidoEn: z.string().datetime(),
});

export type Integrante = z.infer<typeof integranteSchema>;

export const grupoSchema = z.object({
  id: z.string().uuid(),
  nombre: z.string().min(1),
  materiaId: z.string().uuid(),
  creadoPor: z.string().uuid(),
  integrantes: z.array(integranteSchema),
  creadoEn: z.string().datetime(),
});

export type Grupo = z.infer<typeof grupoSchema>;

export const crearGrupoInputSchema = z.object({
  nombre: z.string().min(1),
  materiaId: z.string().uuid(),
});

export type CrearGrupoInput = z.infer<typeof crearGrupoInputSchema>;

export const invitarIntegranteInputSchema = z.object({
  usuarioId: z.string().uuid(),
});

export type InvitarIntegranteInput = z.infer<typeof invitarIntegranteInputSchema>;

export const gruposListadoSchema = z.array(grupoSchema);

export const mensajeExitoSchema = z.object({
  mensaje: z.string(),
});

export type MensajeExito = z.infer<typeof mensajeExitoSchema>;