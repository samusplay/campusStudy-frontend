"use server";

import { gatewayErrorSchema } from "@/src/schemas/auth";
import { marcarLeidaInputSchema, notificacionErrorSchema } from "@/src/schemas/notificaciones";
import { getAuthToken } from "@/src/utils/auth-cookie";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";

export type ActionStateType = {
  error: string;   // → toast
  success: string; // → el componente decide si mostrarlo
};

export async function marcarLeidaNotificacionAction(
  prevState: ActionStateType,
  formData: FormData,
): Promise<ActionStateType> {
  // 1. Validar en el front: el id viene de un input oculto
  const input = marcarLeidaInputSchema.safeParse({ id: formData.get("id") });
  if (!input.success) {
    return { error: input.error.issues[0].message, success: "" };
  }

  // 2. Token de la cookie
  const token = await getAuthToken();
  if (!token) redirect("/login");

  // 3. PATCH al gateway
  let req: Response;
  try {
    req = await fetch(`${process.env.API_URL}/api/v1/notificaciones/${input.data.id}/leida`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
  } catch {
    return { error: "No se pudo conectar con el servidor.", success: "" };
  }

  if (req.status === 401) redirect("/login");

  // 4. Errores: 404 (no existe o no es tuya), 503 (notificaciones caído)
  if (!req.ok) {
    const json = await req.json().catch(() => null);

    const notificacionError = notificacionErrorSchema.safeParse(json);
    if (notificacionError.success) {
      const { message } = notificacionError.data;
      return { error: Array.isArray(message) ? message[0] : message, success: "" };
    }

    const gatewayError = gatewayErrorSchema.safeParse(json);
    return {
      error: gatewayError.success ? gatewayError.data.detail : "No se pudo marcar la notificación.",
      success: "",
    };
  }

  // 5. Éxito: 204 sin cuerpo, no hay nada que leer
  updateTag("notificaciones");

  return { error: "", success: "Notificación marcada como leída" };
}