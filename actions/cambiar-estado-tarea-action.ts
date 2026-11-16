"use server";

import { gatewayErrorSchema } from "@/src/schemas/auth";
import { cambiarEstadoInputSchema, cambioEstadoSchema, tareaErrorSchema } from "@/src/schemas/tareas";
import { getAuthToken } from "@/src/utils/auth-cookie";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";

export type ActionStateType = {
  error: string;   // → toast.error
  success: string; // → toast.success
};

const MENSAJES = {
  pendiente: "Tarea marcada como pendiente",
  en_progreso: "¡Manos a la obra! Tarea en progreso",
  completada: "¡Bien hecho! Tarea completada",
  cancelada: "Tarea cancelada",
} as const;

export async function cambiarEstadoTareaAction(
  prevState: ActionStateType,
  formData: FormData,
): Promise<ActionStateType> {
  // 1. Validar (vienen de inputs hidden)
  const input = cambiarEstadoInputSchema.safeParse({
    tarea_id: formData.get("tarea_id"),
    estado: formData.get("estado"),
  });

  if (!input.success) {
    return { error: "No se pudo cambiar el estado de la tarea.", success: "" };
  }

  const { tarea_id, estado } = input.data;

  // 2. Token de la cookie
  const token = await getAuthToken();
  if (!token) redirect("/login");

  // 3. PUT al gateway: el id va en la URL, el estado en el body
  let req: Response;
  try {
    req = await fetch(`${process.env.API_URL}/api/v1/tareas/${tarea_id}/estado`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ estado }),
      cache: "no-store",
    });
  } catch {
    return { error: "No se pudo conectar con el servidor.", success: "" };
  }

  if (req.status === 401) redirect("/login");

  const json = await req.json().catch(() => null);

  // 4. Errores
  if (!req.ok) {
    // 404: la borraron en otra pestaña → refrescar para que desaparezca
    if (req.status === 404) {
      updateTag("tareas");
      return { error: "Esta tarea ya no existe.", success: "" };
    }

    // 400: transición no permitida ("No se permite pasar de completada a pendiente")
    const tareaError = tareaErrorSchema.safeParse(json);
    if (tareaError.success) {
      return { error: tareaError.data.error.mensaje, success: "" };
    }

    const gatewayError = gatewayErrorSchema.safeParse(json);
    return {
      error: gatewayError.success ? gatewayError.data.detail : "No se pudo cambiar el estado.",
      success: "",
    };
  }

  // 5. Éxito
  const cambio = cambioEstadoSchema.parse(json);
  
  updateTag("tareas");
  updateTag("estadisticas"); // tareas-service ya actualizó la proyección de estadísticas

  return { error: "", success: MENSAJES[cambio.estado] };
}