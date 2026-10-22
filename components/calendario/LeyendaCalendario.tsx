import { ESTADOS, PRIORIDADES } from "./config";

export default function LeyendaCalendario() {
  return (
    <div className="flex flex-col gap-2 text-xs text-ink/80 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6">
      <ul className="flex flex-wrap items-center gap-x-4 gap-y-1" aria-label="Estados">
        {ESTADOS.map((e) => (
          <li key={e.valor} className="flex items-center gap-1.5">
            <span className={`h-2.5 w-2.5 rounded-full ${e.punto}`} aria-hidden />
            {e.etiqueta}
          </li>
        ))}
      </ul>
      <ul className="flex flex-wrap items-center gap-x-4 gap-y-1" aria-label="Prioridades">
        {PRIORIDADES.map((p) => (
          <li key={p.valor} className="flex items-center gap-1.5">
            <span
              className={`rounded-sm border px-1 text-[10px] leading-4 ${p.borde} ${p.texto} bg-ink`}
            >
              {p.etiqueta}
            </span>
            Prioridad {p.etiqueta.toLowerCase()}
          </li>
        ))}
      </ul>
    </div>
  );
}
