import { Sidebar } from "@/components/ui/admin/sidebar";
import { obtenerNotificaciones } from "@/src/services/notificaciones";
import { getAuthToken, getSessionUser } from "@/src/utils/auth-cookie";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  // Sin sesión válida no hay acceso al panel
  const user = await getSessionUser();
  const token = await getAuthToken();
  if (!user || !token) redirect("/login");

  // Cartas sin abrir para la campana del menú (si notificaciones falla, el panel sigue funcionando con 0)
  const { notificaciones } = await obtenerNotificaciones(token);
  const sinLeer = notificaciones.filter((n) => !n.leida).length;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar nombre={user.nombre} sinLeer={sinLeer} />

      <main className="flex-1 overflow-y-auto bg-[#EFE7D8] p-10">
        {children}
      </main>
    </div>
  );
}