import type { Tarea } from "./tipos";
import { estadoInfo, prioridadInfo } from "./config";

interface Props {
  tarea: Tarea;
  nombreMateria?: string;
}

export default function TareaItem({ tarea, nombreMateria }: Props) {
  const estado = estadoInfo(tarea.estado);
  const prioridad = tarea.prioridad ? prioridadInfo(tarea.prioridad) : undefined;
  const apagada = tarea.estado === "completada" || tarea.estado === "cancelada";
  const materia =
    nombreMateria ?? tarea.nombre_materia ?? `Materia #${tarea.materia_id}`;

  return (
    <li className="rounded-sm border border-white/10 bg-ink-soft p-3">
      <div className="flex items-start justify-between gap-3">
        <h4
          className={`text-sm font-medium leading-snug ${
            apagada ? "text-cream/60" : "text-cream"
          } ${tarea.estado === "cancelada" ? "line-through" : ""}`}
        >
          {tarea.titulo}
        </h4>
        {prioridad && (
          <span
            className={`shrink-0 rounded-sm border px-1.5 text-[11px] leading-5 ${prioridad.borde} ${prioridad.texto}`}
          >
            {prioridad.etiqueta}
          </span>
        )}
      </div>

      <p className="mt-1 text-xs text-cream/60">{materia}</p>

      <div className="mt-3 flex items-center justify-between text-xs text-cream/80">
        <span className="flex items-center gap-1.5">
          <span className={`h-2 w-2 rounded-full ${estado.punto}`} aria-hidden />
          {estado.etiqueta}
        </span>
        <span>{tarea.hora_entrega ? `${tarea.hora_entrega} h` : "Sin hora"}</span>
      </div>
    </li>
  );
}
