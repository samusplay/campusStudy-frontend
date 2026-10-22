"use client";

import { cambiarEstadoTareaAction, type ActionStateType } from "@/actions/cambiar-estado-tarea-action";
import type { Tarea, TareaEstado, TareaPrioridad } from "@/src/schemas/tareas";
import { fechaCorta } from "@/src/utils/fechas";
import { CalendarDays, Check, Clock3, Play, Trash2 } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

const initialState: ActionStateType = { error: "", success: "" };

const ESTADO: Record<TareaEstado, { texto: string; estilo: string }> = {
  pendiente: { texto: "Pendiente", estilo: "bg-cream text-ink/70" },
  en_progreso: { texto: "En progreso", estilo: "bg-amber/25 text-ink" },
  completada: { texto: "Completada", estilo: "bg-ink text-amber" },
  cancelada: { texto: "Cancelada", estilo: "bg-ink/10 text-ink/50" },
};

// Los mismos colores del selector de prioridad del formulario
const PRIORIDAD: Record<TareaPrioridad, string> = {
  baja: "bg-ink/5 text-ink/60",
  media: "bg-amber/30 text-ink",
  alta: "bg-ink text-amber",
};

// Máquina de estados del backend: solo se avanza, nunca se retrocede
const SIGUIENTE: Partial<Record<TareaEstado, { estado: TareaEstado; texto: string }>> = {
  pendiente: { estado: "en_progreso", texto: "Empezar" },
  en_progreso: { estado: "completada", texto: "Completar" },
};

type TareaCardProps = {
  tarea: Tarea;
  materiaNombre: string;
  indice: number;
  hoy: string;                          // "YYYY-MM-DD" del servidor
  onEliminar: (tarea: Tarea) => void;   // abre la confirmación en TareasView
};

export default function TareaCard({ tarea, materiaNombre, indice, hoy, onEliminar }: TareaCardProps) {
  const [state, formAction, isPending] = useActionState(cambiarEstadoTareaAction, initialState);
  const reduceMotion = useReducedMotion();

  const completada = tarea.estado === "completada";
  const siguiente = SIGUIENTE[tarea.estado];

  // Comparar textos "YYYY-MM-DD" funciona igual que comparar fechas, y sin new Date()
  const vencida = !completada && tarea.fecha_entrega < hoy;
  const venceHoy = !completada && tarea.fecha_entrega === hoy;

  useEffect(() => {
    if (state.success) toast.success(state.success);
    if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <motion.li
      layout
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)", transition: { duration: 0.25 } }}
      transition={reduceMotion ? { duration: 0 } : { delay: indice * 0.035, type: "spring", stiffness: 300, damping: 26 }}
      whileHover={reduceMotion ? undefined : { y: -3 }}
      className={`rounded-2xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-lg hover:shadow-ink/10 ${
        vencida ? "border-red-200" : completada ? "border-amber/40" : "border-ink/10"
      }`}
    >
      {/* Materia + título + estado */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold uppercase tracking-wider text-ink/45">{materiaNombre}</p>
          <h3 className={`mt-1 font-display text-lg font-bold ${completada ? "text-ink/45 line-through" : "text-ink"}`}>
            {tarea.titulo}
          </h3>
        </div>

        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={tarea.estado}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 22 }}
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${ESTADO[tarea.estado].estilo}`}
          >
            {ESTADO[tarea.estado].texto}
          </motion.span>
        </AnimatePresence>
      </div>

      {tarea.descripcion && (
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink/60">{tarea.descripcion}</p>
      )}

      {/* Fecha, hora y prioridad */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${
            vencida ? "bg-red-50 text-red-700" : venceHoy ? "bg-amber/25 text-ink" : "bg-ink/5 text-ink/60"
          }`}
        >
          <CalendarDays className="size-3.5" aria-hidden="true" />
          {vencida ? "Vencida" : venceHoy ? "Vence hoy" : fechaCorta(tarea.fecha_entrega)}
        </span>

        {tarea.hora_entrega && (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-ink/5 px-2.5 py-1.5 text-xs font-semibold text-ink/60">
            <Clock3 className="size-3.5" aria-hidden="true" />
            {tarea.hora_entrega}
          </span>
        )}

        <span className={`rounded-lg px-2.5 py-1.5 text-xs font-bold capitalize ${PRIORIDAD[tarea.prioridad]}`}>
          Prioridad {tarea.prioridad}
        </span>
      </div>

      {/* Acciones */}
      <div className="mt-5 flex items-center gap-2 border-t border-ink/10 pt-4">
        {siguiente ? (
          <form action={formAction}>
            <input type="hidden" name="tarea_id" value={tarea.tarea_id} />
            <input type="hidden" name="estado" value={siguiente.estado} />
            <motion.button
              type="submit"
              disabled={isPending}
              whileTap={reduceMotion ? undefined : { scale: 0.95 }}
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 disabled:opacity-60 ${
                siguiente.estado === "completada"
                  ? "bg-ink text-cream hover:bg-amber hover:text-ink"
                  : "bg-amber/20 text-ink hover:bg-amber/40"
              }`}
            >
              {isPending ? (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  className="size-4 rounded-full border-2 border-current/30 border-t-current"
                />
              ) : siguiente.estado === "completada" ? (
                <Check className="size-4" aria-hidden="true" />
              ) : (
                <Play className="size-4" aria-hidden="true" />
              )}
              {siguiente.texto}
            </motion.button>
          </form>
        ) : (
          <motion.span
            initial={reduceMotion ? false : { scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink/60"
          >
            <Check className="size-4 text-amber" strokeWidth={3} aria-hidden="true" />
            Terminada
          </motion.span>
        )}

        <span className="flex-1" />

        {!completada && (
          <button
            type="button"
            onClick={() => onEliminar(tarea)}
            aria-label={`Eliminar tarea ${tarea.titulo}`}
            className="grid size-9 place-items-center rounded-lg text-ink/50 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </motion.li>
  );
}