import { Button } from "@/components/ui/button";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="flex items-center justify-end px-6 py-5 sm:px-10">
      <Button
        asChild
        size="lg"
        className="bg-[#E8A33D] px-8 font-semibold text-[#121A2B] shadow-lg shadow-[#E8A33D]/20 hover:bg-[#E8A33D]/90"
      >
        <Link href="/login">Entrar</Link>
      </Button>
    </header>
  );
}