"use server";

import { crearGrupoInputSchema, grupoSchema } from "@/src/schemas/grupos";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
 // la misma ruta que usa createMateriaAction
import { apiErrorSchema, gatewayErrorSchema } from "@/src/schemas/auth";
import { getAuthToken } from "@/src/utils/auth-cookie";

export type ActionStateType = {
  errors: {
    nombre?: string[];
    materia_id?: string[];
  };
  error: string;   // error general → toast + ErrorMessage
  success: string; // mensaje de éxito → toast
};

export async function createGrupoAction(
  prevState: ActionStateType,
  formData: FormData,
): Promise<ActionStateType> {
  // 1. Validar en el front
  const input = crearGrupoInputSchema.safeParse({
    nombre: formData.get("nombre"),
    materia_id: formData.get("materia_id"),
  });

  if (!input.success) {
    const errors: ActionStateType["errors"] = {};
    for (const issue of input.error.issues) {
      const campo = issue.path[0] as keyof ActionStateType["errors"];
      (errors[campo] ??= []).push(issue.message);
    }
    return { errors, error: "", success: "" };
  }

  // 2. Token de la cookie
  const token = await getAuthToken();
  if (!token) redirect("/login");

  // 3. POST al gateway
  let req: Response;
  try {
    req = await fetch(`${process.env.API_URL}/api/v1/grupos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(input.data),
      cache: "no-store",
    });
  } catch {
    return { errors: {}, error: "No se pudo conectar con el servidor.", success: "" };
  }

  if (req.status === 401) redirect("/login");

  const json = await req.json().catch(() => null);

  // 4. Errores: 400 (campos), 409 (nombre repetido), 503 (materias caído)
  if (!req.ok) {
    const apiError = apiErrorSchema.safeParse(json);
    if (apiError.success) {
      const errors: ActionStateType["errors"] = {};
      for (const { campo, mensaje } of apiError.data.errors ?? []) {
        if (campo === "nombre" || campo === "materia_id") {
          (errors[campo] ??= []).push(mensaje);
        }
      }
      return { errors, error: apiError.data.error, success: "" };
    }

    const gatewayError = gatewayErrorSchema.safeParse(json);
    return {
      errors: {},
      error: gatewayError.success ? gatewayError.data.detail : "No se pudo crear el grupo.",
      success: "",
    };
  }

  // 5. Éxito
  const grupo = grupoSchema.parse(json);
  updateTag("grupos");

  return { errors: {}, error: "", success: `Grupo "${grupo.nombre}" creado` };
}