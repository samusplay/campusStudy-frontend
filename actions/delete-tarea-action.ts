"use server";

import { gatewayErrorSchema } from "@/src/schemas/auth";
import { eliminarTareaInputSchema, tareaErrorSchema } from "@/src/schemas/tareas";
import { getAuthToken } from "@/src/utils/auth-cookie";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";

export type ActionStateType = {
  error: string;   // → toast.error
  success: string; // → toast.success
};

export async function deleteTareaAction(
  prevState: ActionStateType,
  formData: FormData,
): Promise<ActionStateType> {
  // 1. Validar el id (viene de un input hidden)
  const input = eliminarTareaInputSchema.safeParse({
    tarea_id: formData.get("tarea_id"),
  });

  if (!input.success) {
    return { error: "Tarea inválida.", success: "" };
  }

  // Solo para el mensaje del toast; el backend no lo usa
  const titulo = String(formData.get("titulo") ?? "").trim();

  // 2. Token de la cookie
  const token = await getAuthToken();
  if (!token) redirect("/login");

  // 3. DELETE al gateway
  let req: Response;
  try {
    req = await fetch(`${process.env.API_URL}/api/v1/tareas/${input.data.tarea_id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }, // sin body → sin Content-Type
      cache: "no-store",
    });
  } catch {
    return { error: "No se pudo conectar con el servidor.", success: "" };
  }

  if (req.status === 401) redirect("/login");

  // 4. 204 No Content: NO hay cuerpo → aquí no se hace req.json()
  if (req.status === 204) {
    updateTag("tareas");
    updateTag("estadisticas"); // eliminar = cancelar: tareas-service ya actualizó la proyección de estadísticas
    return { error: "", success: titulo ? `Tarea "${titulo}" eliminada` : "Tarea eliminada" };
  }

  // 404: ya no existe → el resultado es el mismo que queríamos (no hubo evento: estadísticas no cambió)
  if (req.status === 404) {
    updateTag("tareas");
    return { error: "", success: "La tarea ya había sido eliminada" };
  }

  // 5. Otros errores (400: ya cancelada o completada; 503). Puede que no traigan JSON
  const json = await req.json().catch(() => null);

  const tareaError = tareaErrorSchema.safeParse(json);
  if (tareaError.success) {
    return { error: tareaError.data.error.mensaje, success: "" };
  }

  const gatewayError = gatewayErrorSchema.safeParse(json);
  return {
    error: gatewayError.success ? gatewayError.data.detail : "No se pudo eliminar la tarea.",
    success: "",
  };
}