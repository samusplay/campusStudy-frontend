import { notificacionesListadoSchema, type Notificacion } from "@/src/schemas/notificaciones";
import { redirect } from "next/navigation";

type NotificacionesResult = { notificaciones: Notificacion[]; error: string };

// GET /notificaciones/me → las 50 más recientes del usuario del token
export async function obtenerNotificaciones(token: string): Promise<NotificacionesResult> {
  let req: Response;
  try {
    req = await fetch(`${process.env.API_URL}/api/v1/notificaciones/me`, {
      headers: { Authorization: `Bearer ${token}` },
      // Las crean otros servicios (tareas), no el front: la caché dura máximo 30 s.
      // Marcar como leída la invalida al instante con updateTag("notificaciones").
      next: { tags: ["notificaciones"], revalidate: 30 },
    });
  } catch {
    return { notificaciones: [], error: "No se pudo conectar con el servidor." };
  }

  if (req.status === 401) redirect("/login");
  if (!req.ok) return { notificaciones: [], error: "No pudimos cargar tus notificaciones." };

  const result = notificacionesListadoSchema.safeParse(await req.json());
  if (!result.success) return { notificaciones: [], error: "La respuesta de notificaciones no tiene el formato esperado." };

  return { notificaciones: result.data, error: "" };
}