import { Sidebar } from "@/components/ui/admin/sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-[#EFE7D8] p-8">{children}</main>
    </div>
  );
}