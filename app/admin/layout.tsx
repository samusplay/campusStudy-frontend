
import { Sidebar } from "@/components/ui/admin/sidebar";
import { getSessionUser } from "@/src/utils/auth-cookie";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  // Sin sesión válida no hay acceso al panel
  const user = await getSessionUser();
  if (!user) redirect("/login");

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar nombre={user.nombre} />

      <main className="flex-1 overflow-y-auto bg-[#EFE7D8] p-10">
        {children}
      </main>
    </div>
  );
}