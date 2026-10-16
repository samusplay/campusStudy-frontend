"use client";

import type { Materia } from "@/src/schemas/materias";
import { BookOpen, Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

const formatoFecha = new Intl.DateTimeFormat("es-CO", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

type MateriasListProps = {
  materias: Materia[];
  onCrear: () => void; // abre el modal del formulario (lo maneja MateriasView)
};

export default function MateriasList({ materias, onCrear }: MateriasListProps) {
  // Sin materias: bienvenida + botón para crear la primera
  if (materias.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex min-h-80 flex-col items-center justify-center gap-5 rounded-3xl border-2 border-dashed border-ink/15 p-10 text-center"
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber/15 text-amber"
        >
          <BookOpen className="h-8 w-8" />
        </motion.div>

        <div>
          <p className="font-display text-xl font-bold text-ink">Crea tu primera materia</p>
          <p className="mt-1 text-sm text-ink/50">Aquí aparecerán tus materias cuando las crees.</p>
        </div>

        <motion.button
          type="button"
          onClick={onCrear}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.96 }}
          className="flex items-center gap-2 rounded-xl bg-ink px-5 py-3 font-semibold text-cream shadow-lg shadow-ink/20 transition-colors hover:bg-amber hover:text-ink"
        >
          <Plus className="h-5 w-5" />
          Crear materia
        </motion.button>
      </motion.div>
    );
  }

  // Con materias: tarjetas
  return (
    <motion.ul layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence initial={false}>
        {materias.map((materia, i) => (
          <motion.li
            key={materia.materia_id}
            layout
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 26, delay: i * 0.04 }}
            whileHover={{ y: -4 }}
            className="group flex gap-4 rounded-2xl border border-ink/10 bg-white p-5 shadow-sm transition-shadow hover:shadow-lg hover:shadow-ink/10"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ink text-amber transition-colors group-hover:bg-amber group-hover:text-ink">
              <BookOpen className="h-6 w-6" />
            </div>

            <div className="min-w-0">
              <p className="truncate font-display text-lg font-bold text-ink">{materia.nombre}</p>
              <p className="font-mono text-xs tracking-wider text-ink/50">NRC {materia.nrc}</p>
              <p className="mt-2 text-xs text-ink/40">
                Creada el {formatoFecha.format(new Date(materia.fecha_creacion))}
              </p>
            </div>
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ul>
  );
}