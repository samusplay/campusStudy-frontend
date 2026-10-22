"use client";

import TareaCard from "@/components/tareas/TareaCard";
import type { Tarea } from "@/src/schemas/tareas";
import { ClipboardList, Plus } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

type TareasListProps = {
  tareas: Tarea[];
  nombresMaterias: ReadonlyMap<number, string>;
  hoy: string;                          // "YYYY-MM-DD" del servidor
  onCrear?: () => void;                 // si no viene, no se muestra el botón del estado vacío
  onEliminar: (tarea: Tarea) => void;
  mensajeVacio?: string;
};

export default function TareasList({
  tareas,
  nombresMaterias,
  hoy,
  onCrear,
  onEliminar,
  mensajeVacio = "Aquí aparecerán las tareas que agregues.",
}: TareasListProps) {
  const reduceMotion = useReducedMotion();

  /* ---------- Estado vacío ---------- */
  if (tareas.length === 0) {
    return (
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex min-h-72 flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-ink/15 bg-white/50 p-8 text-center"
      >
        <motion.div
          animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="grid size-14 place-items-center rounded-2xl bg-amber/15 text-amber"
        >
          <ClipboardList className="size-7" aria-hidden="true" />
        </motion.div>

        <div>
          <h3 className="font-display text-xl font-bold text-ink">
            {onCrear ? "Aún no tienes tareas" : "Sin resultados"}
          </h3>
          <p className="mt-1 text-sm text-ink/55">{mensajeVacio}</p>
        </div>

        {onCrear && (
          <motion.button
            type="button"
            onClick={onCrear}
            whileHover={reduceMotion ? undefined : { y: -2 }}
            whileTap={reduceMotion ? undefined : { scale: 0.96 }}
            className="inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 font-semibold text-cream shadow-lg shadow-ink/20 transition-colors hover:bg-amber hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2"
          >
            <Plus className="size-5" aria-hidden="true" />
            Crear primera tarea
          </motion.button>
        )}
      </motion.div>
    );
  }

  /* ---------- Lista ---------- */
  return (
    <motion.ul layout className="grid gap-4 lg:grid-cols-2">
      <AnimatePresence initial={false}>
        {tareas.map((tarea, indice) => (
          <TareaCard
            key={tarea.tarea_id}
            tarea={tarea}
            materiaNombre={nombresMaterias.get(tarea.materia_id) ?? `Materia #${tarea.materia_id}`}
            indice={indice}
            hoy={hoy}
            onEliminar={onEliminar}
          />
        ))}
      </AnimatePresence>
    </motion.ul>
  );
}