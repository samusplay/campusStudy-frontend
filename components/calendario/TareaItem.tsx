import { estadoInfo, prioridadInfo } from "@/src/config/tareas";
import type { Tarea } from "@/src/types/calendario";

interface Props {
  tarea: Tarea;
  nombreMateria?: string;
}

export default function TareaItem({ tarea, nombreMateria }: Props) {
  const estado = estadoInfo(tarea.estado);
  const prioridad = tarea.prioridad ? prioridadInfo(tarea.prioridad) : undefined;
  const apagada = tarea.estado === "completada" || tarea.estado === "cancelada";
  const materia = nombreMateria ?? tarea.nombre_materia ?? `Materia #${tarea.materia_id}`;

  return (
    // div y no li: PanelDia ya envuelve cada tarea en un <li>
    <div className="rounded-xl border border-white/10 bg-ink-soft p-4 transition-colors hover:border-amber/40">
      <div className="flex items-start justify-between gap-3">
        <h4
          className={`text-sm font-semibold leading-snug ${
            apagada ? "text-cream/50 line-through" : "text-cream"
          }`}
        >
          {tarea.titulo}
        </h4>
        {prioridad && (
          <span
            className={`shrink-0 rounded-md border px-1.5 text-[11px] font-semibold leading-5 ${prioridad.borde} ${prioridad.texto}`}
          >
            {prioridad.etiqueta}
          </span>
        )}
      </div>

      <p className="mt-1 text-xs uppercase tracking-wider text-cream/50">{materia}</p>

      <div className="mt-3 flex items-center justify-between text-xs text-cream/80">
        <span className="flex items-center gap-1.5">
          <span className={`size-2 rounded-full ${estado.punto}`} aria-hidden />
          {estado.etiqueta}
        </span>
        <span className="font-mono">{tarea.hora_entrega ? `${tarea.hora_entrega} h` : "Sin hora"}</span>
      </div>
    </div>
  );
}