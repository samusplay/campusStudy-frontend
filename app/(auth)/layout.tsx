import { AuthBrandPanel } from "@/components/ui/auth/auth-brand-panel";
import { getSessionUser } from "@/src/utils/auth-cookie";

import { redirect } from "next/navigation";
export default  async function AuthLayout({ children }: { children: React.ReactNode }) {
  //sesion del payload
  const user=await getSessionUser();
  if(user) redirect("/admin");
  return (
    <div className="flex min-h-screen">
      <AuthBrandPanel />

      <main className="flex flex-1 items-center justify-center bg-[#EFE7D8] px-6 py-12 sm:px-10">
        <div className="w-full max-w-lg">{children}</div>
      </main>
    </div>
  );
}