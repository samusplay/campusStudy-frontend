import { Button } from "@/components/ui/button";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="flex items-center justify-end px-6 py-5 sm:px-10">
      <Button asChild size="sm" variant="secondary">
        <Link href="/login">Entrar</Link>
      </Button>
    </header>
  );
}