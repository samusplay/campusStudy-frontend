const tabs = [
  { href: "#materias", label: "Materias" },
  { href: "#tareas", label: "Tareas" },
  { href: "#grupos", label: "Grupos" },
];

export function FeatureTabs() {
  return (
    <nav className="flex gap-6 border-t border-white/10 pt-4">
      {tabs.map((tab) => (
        <a
          key={tab.href}
          href={tab.href}
          className="text-sm text-[#8A94A6] transition-colors hover:text-[#EFE7D8]"
        >
          {tab.label}
        </a>
      ))}
    </nav>
  );
}