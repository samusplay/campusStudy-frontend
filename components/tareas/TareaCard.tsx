"use client";

import type { Tarea } from "@/src/schemas/tareas";
import { CalendarDays, Check, Clock3, Pencil, RotateCcw, Trash2 } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

type TareaCardProps = {
  tarea: Tarea;
  materiaNombre: string;
  indice: number;
  onEditar?: (tarea: Tarea) => void;
  onEliminar?: (tarea: Tarea) => void;
  onCambiarEstado?: (tarea: Tarea, estado: Tarea["estado"]) => void;
};

const estadoTexto: Record<Tarea["estado"], string> = {
  pendiente: "Pendiente",
  en_progreso: "En progreso",
  completada: "Completada",
  cancelada: "Cancelada",
};

const estadoEstilo: Record<Tarea["estado"], string> = {
  pendiente: "bg-amber/20 text-amber-900",
  en_progreso: "bg-blue-100 text-blue-800",
  completada: "bg-emerald-100 text-emerald-800",
  cancelada: "bg-ink/10 text-ink/55",
};

const prioridadEstilo: Record<NonNullable<Tarea["prioridad"]>, string> = {
  baja: "bg-slate-100 text-slate-600",
  media: "bg-violet-100 text-violet-700",
  alta: "bg-rose-100 text-rose-700",
};

export default function TareaCard({
  tarea,
  materiaNombre,
  indice,
  onEditar,
  onEliminar,
  onCambiarEstado,
}: TareaCardProps) {
  const reduceMotion = useReducedMotion();
  const completada = tarea.estado === "completada";
  const cancelada = tarea.estado === "cancelada";
  const fechaEntrega = crearFechaLocal(tarea.fecha_entrega);
  const hoy = crearFechaLocal(fechaActual());
  const vencida =
    !completada &&
    !cancelada &&
    fechaEntrega.getTime() < hoy.getTime();
  const venceHoy = fechaEntrega.getTime() === hoy.getTime();
  const siguienteEstado = completada || cancelada ? "pendiente" : "completada";

  return (
    <motion.li
      layout
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduceMotion ? { duration: 0 } : { delay: indice * 0.035, type: "spring", stiffness: 300, damping: 26 }}
      whileHover={reduceMotion ? undefined : { y: -3 }}
      className={`rounded-2xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-lg hover:shadow-ink/10 ${
        completada ? "border-emerald-200/80" : vencida ? "border-rose-200" : "border-ink/10"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold uppercase tracking-wider text-ink/45">{materiaNombre}</p>
          <h3 className={`mt-1 font-display text-lg font-bold ${completada ? "text-ink/50 line-through" : "text-ink"}`}>
            {tarea.titulo}
          </h3>
        </div>
        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${estadoEstilo[tarea.estado]}`}>
          {estadoTexto[tarea.estado]}
        </span>
      </div>

      {tarea.descripcion && <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink/60">{tarea.descripcion}</p>}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${
          vencida ? "bg-rose-50 text-rose-700" : venceHoy ? "bg-amber/20 text-amber-900" : "bg-ink/5 text-ink/60"
        }`}>
          <CalendarDays className="size-3.5" aria-hidden="true" />
          {vencida ? "Vencida" : venceHoy ? "Vence hoy" : fechaEntrega.toLocaleDateString("es", { day: "numeric", month: "short", year: "numeric" })}
        </span>
        {tarea.hora_entrega && (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-ink/5 px-2.5 py-1.5 text-xs font-semibold text-ink/60">
            <Clock3 className="size-3.5" aria-hidden="true" />
            {tarea.hora_entrega}
          </span>
        )}
        {tarea.prioridad && (
          <span className={`rounded-lg px-2.5 py-1.5 text-xs font-bold capitalize ${prioridadEstilo[tarea.prioridad]}`}>
            Prioridad {tarea.prioridad}
          </span>
        )}
      </div>

      {(onCambiarEstado || onEditar || onEliminar) && (
        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-ink/8 pt-4">
          {onCambiarEstado && (
            <button
              type="button"
              onClick={() => onCambiarEstado(tarea, siguienteEstado)}
              aria-label={`${completada || cancelada ? "Reabrir" : "Completar"} tarea ${tarea.titulo}`}
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 ${
                completada || cancelada
                  ? "bg-ink/5 text-ink/70 hover:bg-ink/10"
                  : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
              }`}
            >
              {completada || cancelada ? <RotateCcw className="size-4" /> : <Check className="size-4" />}
              {completada || cancelada ? "Reabrir" : "Completar"}
            </button>
          )}
          <span className="flex-1" />
          {onEditar && (
            <button
              type="button"
              onClick={() => onEditar(tarea)}
              aria-label={`Editar tarea ${tarea.titulo}`}
              className="grid size-9 place-items-center rounded-lg text-ink/55 transition-colors hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <Pencil className="size-4" aria-hidden="true" />
            </button>
          )}
          {onEliminar && (
            <button
              type="button"
              onClick={() => onEliminar(tarea)}
              aria-label={`Eliminar tarea ${tarea.titulo}`}
              className="grid size-9 place-items-center rounded-lg text-ink/55 transition-colors hover:bg-rose-50 hover:text-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
            >
              <Trash2 className="size-4" aria-hidden="true" />
            </button>
          )}
        </div>
      )}
    </motion.li>
  );
}

function fechaActual() {
  const hoy = new Date();
  const año = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const dia = String(hoy.getDate()).padStart(2, "0");
  return `${año}-${mes}-${dia}`;
}

function crearFechaLocal(fecha: string) {
  const [año, mes, dia] = fecha.split("-").map(Number);
  return new Date(año, mes - 1, dia);
}
