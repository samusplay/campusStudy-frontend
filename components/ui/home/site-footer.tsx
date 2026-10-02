export function SiteFooter() {
  return (
    <footer className="sticky bottom-0 z-0 bg-[#121A2B] px-6 pt-20 pb-8 sm:px-10">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <p className="font-[family-name:var(--font-display)] text-3xl font-semibold italic leading-snug text-[#EFE7D8] sm:text-4xl">
          "Si quieres ir rápido, ve solo. Si quieres llegar lejos, ve acompañado."
        </p>
        <p className="mt-4 text-xs font-medium tracking-[0.2em] text-[#8A94A6] uppercase">
          — Proverbio africano
        </p>

        <nav className="mt-10 flex gap-6">
          <a href="#materias" className="text-sm text-[#8A94A6] transition-colors hover:text-[#EFE7D8]">
            Materias
          </a>
          <a href="#tareas" className="text-sm text-[#8A94A6] transition-colors hover:text-[#EFE7D8]">
            Tareas
          </a>
          <a href="#grupos" className="text-sm text-[#8A94A6] transition-colors hover:text-[#EFE7D8]">
            Grupos
          </a>
        </nav>

        <div className="mt-10 w-full border-t border-white/10 pt-6">
          <p className="text-xs text-[#8A94A6]">© 2026 CampusStudy</p>
        </div>
      </div>
    </footer>
  );
}