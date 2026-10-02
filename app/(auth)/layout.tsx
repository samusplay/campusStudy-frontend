import { AuthBrandPanel } from "@/components/ui/auth/auth-brand-panel";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AuthBrandPanel />

      <main className="flex flex-1 items-center justify-center bg-[#EFE7D8] px-6 py-12 sm:px-10">
        <div className="w-full max-w-lg">{children}</div>
      </main>
    </div>
  );
}