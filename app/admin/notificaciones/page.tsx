import NotificacionesView from "@/components/notificaciones/NotificacionesView";
import ErrorMessage from "@/components/ui/error-message";
import { obtenerNotificaciones } from "@/src/services/notificaciones";
import { getAuthToken } from "@/src/utils/auth-cookie";
import { redirect } from "next/navigation";

export default async function NotificacionesPage() {
  // 1. Sesión
  const token = await getAuthToken();
  if (!token) redirect("/login");

  // 2. Las cartas del usuario (servicio compartido con la campana del menú)
  const { notificaciones, error } = await obtenerNotificaciones(token);

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-10">
      {error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : (
        // "ahora" se calcula una vez aquí: el servidor y el navegador muestran el mismo "hace X"
        <NotificacionesView notificaciones={notificaciones} ahora={Date.now()} />
      )}
    </main>
  );
}