"use server";

import { gatewayErrorSchema } from "@/src/schemas/auth";
import { crearTareaInputSchema, tareaErrorSchema, tareaSchema } from "@/src/schemas/tareas";
import { getAuthToken } from "@/src/utils/auth-cookie";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";

export type ActionStateType = {
  errors: {
    titulo?: string[];
    descripcion?: string[];
    materia_id?: string[];
    fecha_entrega?: string[];
    hora_entrega?: string[];
    prioridad?: string[];
  };
  error: string;   // error general → toast + ErrorMessage
  success: string; // mensaje de éxito → toast
};

const CAMPOS = ["titulo", "descripcion", "materia_id", "fecha_entrega", "hora_entrega", "prioridad"] as const;

export async function createTareaAction(
  prevState: ActionStateType,
  formData: FormData,
): Promise<ActionStateType> {
  // 1. Validar en el front
  const input = crearTareaInputSchema.safeParse({
    titulo: formData.get("titulo"),
    descripcion: formData.get("descripcion") ?? "",
    materia_id: formData.get("materia_id"),
    fecha_entrega: formData.get("fecha_entrega"),
    hora_entrega: formData.get("hora_entrega") ?? "",
    prioridad: formData.get("prioridad") ?? undefined, // sin prioridad → "media"
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
    req = await fetch(`${process.env.API_URL}/api/v1/tareas`, {
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

  // 4. Errores: 400 (campos o fecha pasada), 503 (tareas caído)
  if (!req.ok) {
    const tareaError = tareaErrorSchema.safeParse(json);
    if (tareaError.success) {
      const errors: ActionStateType["errors"] = {};
      for (const { campo, mensaje } of tareaError.data.error.errores ?? []) {
        if ((CAMPOS as readonly string[]).includes(campo)) {
          (errors[campo as keyof ActionStateType["errors"]] ??= []).push(mensaje);
        }
      }
      // Con errores por campo, el mensaje general sobra ("Datos de entrada inválidos")
      const general = Object.keys(errors).length > 0 ? "" : tareaError.data.error.mensaje;
      return { errors, error: general, success: "" };
    }

    const gatewayError = gatewayErrorSchema.safeParse(json);
    return {
      errors: {},
      error: gatewayError.success ? gatewayError.data.detail : "No se pudo crear la tarea.",
      success: "",
    };
  }

  // 5. Éxito
  const tarea = tareaSchema.parse(json);
  updateTag("tareas");

  return { errors: {}, error: "", success: `Tarea "${tarea.titulo}" creada` };
}