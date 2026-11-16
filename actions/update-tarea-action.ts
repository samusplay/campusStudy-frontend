"use server";

import { gatewayErrorSchema } from "@/src/schemas/auth";
import { editarTareaInputSchema, tareaErrorSchema, tareaSchema } from "@/src/schemas/tareas";
import { getAuthToken } from "@/src/utils/auth-cookie";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";

export type ActionStateType = {
  errors: {
    titulo?: string[];
    descripcion?: string[];
    materia_id?: string[];
    grupo_id?: string[];
    fecha_entrega?: string[];
    hora_entrega?: string[];
    prioridad?: string[];
  };
  error: string;   // error general → toast + ErrorMessage
  success: string; // mensaje de éxito → toast
};

const CAMPOS = [
  "titulo", "descripcion", "materia_id", "grupo_id", "fecha_entrega", "hora_entrega", "prioridad",
] as const;

export async function updateTareaAction(
  prevState: ActionStateType,
  formData: FormData,
): Promise<ActionStateType> {
  // 1. Validar en el front
  const input = editarTareaInputSchema.safeParse({
    tarea_id: formData.get("tarea_id"),
    titulo: formData.get("titulo"),
    descripcion: formData.get("descripcion") ?? "",
    materia_id: formData.get("materia_id"),
    grupo_id: formData.get("grupo_id") ?? "", // input oculto: "" = tarea personal
    fecha_entrega: formData.get("fecha_entrega"),
    hora_entrega: formData.get("hora_entrega") ?? "",
    prioridad: formData.get("prioridad"),
  });

  if (!input.success) {
    const errors: ActionStateType["errors"] = {};
    let general = "";
    for (const issue of input.error.issues) {
      const campo = issue.path[0];
      if ((CAMPOS as readonly unknown[]).includes(campo)) {
        (errors[campo as keyof ActionStateType["errors"]] ??= []).push(issue.message);
      } else {
        general = issue.message; // ej. tarea_id manipulado: no tiene campo en el formulario
      }
    }
    return { errors, error: general, success: "" };
  }

  // El id va en la URL; el resto es el cuerpo del PUT (incluido grupo_id, para no perder el grupo)
  const { tarea_id, ...cuerpo } = input.data;

  // 2. Token de la cookie
  const token = await getAuthToken();
  if (!token) redirect("/login");

  // 3. PUT al gateway
  let req: Response;
  try {
    req = await fetch(`${process.env.API_URL}/api/v1/tareas/${tarea_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(cuerpo),
      cache: "no-store",
    });
  } catch {
    return { errors: {}, error: "No se pudo conectar con el servidor.", success: "" };
  }

  if (req.status === 401) redirect("/login");

  const json = await req.json().catch(() => null);

  // 4. Errores: 400 (campos), 404 (no existe o no es tuya), 409 (completada/cancelada), 503 (caído)
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
      error: gatewayError.success ? gatewayError.data.detail : "No se pudo actualizar la tarea.",
      success: "",
    };
  }

  // 5. Éxito
  const tarea = tareaSchema.parse(json);
  updateTag("tareas");
  updateTag("estadisticas");

  return { errors: {}, error: "", success: `Tarea "${tarea.titulo}" actualizada` };
}