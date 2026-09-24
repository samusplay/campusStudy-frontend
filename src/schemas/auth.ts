import { z } from "zod";

export const usuarioSchema = z.object({
  id: z.string().uuid(),
  nombre: z.string().min(1),
  correo: z.string().email(),
});

export type Usuario = z.infer<typeof usuarioSchema>;

export const loginInputSchema = z.object({
  correo: z.string().email(),
  password: z.string().min(8),
});

export type LoginInput = z.infer<typeof loginInputSchema>;

export const registroInputSchema = z.object({
  nombre: z.string().min(1),
  correo: z.string().email(),
  password: z.string().min(8),
});

export type RegistroInput = z.infer<typeof registroInputSchema>;

export const loginDataSchema = z.object({
  usuario: usuarioSchema,
  token: z.string(),
});

export type LoginData = z.infer<typeof loginDataSchema>;

export const mensajeExitoSchema = z.object({
  mensaje: z.string(),
});

export type MensajeExito = z.infer<typeof mensajeExitoSchema>;