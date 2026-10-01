import { z } from "zod";

export const usuarioSchema = z.object({
  usuario_id: z.number().int().positive(),
  nombre: z.string().min(1),
  email: z.string().email(),
  rol: z.string(),
  estado: z.string().optional(),
  fecha_registro: z.string().optional(),
});

export type Usuario = z.infer<typeof usuarioSchema>;

export const loginInputSchema = z.object({
  email: z.string().email("Debe ser un email válido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export type LoginInput = z.infer<typeof loginInputSchema>;

export const registroInputSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  email: z.string().email("Debe ser un email válido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export type RegistroInput = z.infer<typeof registroInputSchema>;

export const loginDataSchema = z.object({
  usuario_id: z.number().int().positive(),
  nombre: z.string(),
  email: z.string().email(),
  rol: z.string(),
  token: z.string(),
  tipo_token: z.string(),
  expira_en: z.number().or(z.string()),
});

export type LoginData = z.infer<typeof loginDataSchema>;

export const validateInputSchema = z.object({
  token: z.string(),
});

export type ValidateInput = z.infer<typeof validateInputSchema>;

export const validateResponseSchema = z.object({
  valido: z.boolean(),
  usuario: usuarioSchema.optional(),
});

export type ValidateResponse = z.infer<typeof validateResponseSchema>;

export const errorDetalleSchema = z.object({
  campo: z.string(),
  mensaje: z.string(),
});

export type ErrorDetalle = z.infer<typeof errorDetalleSchema>;

export const apiErrorSchema = z.object({
  error: z.string(),
  errors: z.array(errorDetalleSchema).optional(),
});

export type ApiError = z.infer<typeof apiErrorSchema>;