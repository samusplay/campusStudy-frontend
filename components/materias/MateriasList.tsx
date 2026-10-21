"use client";

import MateriaMenu from "@/components/materias/MateriaMenu";
import type { Materia } from "@/src/schemas/materias";
import { fechaCorta } from "@/src/utils/fechas";
import { BookOpen, Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

type MateriasListProps = {
  materias: Materia[];
  onCrear: () => void;                     // abre el modal en modo crear
  onEditar: (materia: Materia) => void;    // abre el modal en modo editar
  onEliminar: (materia: Materia) => void;  // abre la confirmación
};

export default function MateriasList({ materias, onCrear, onEditar, onEliminar }: MateriasListProps) {
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
          <MateriaCard
            key={materia.materia_id}
            materia={materia}
            indice={i}
            onEditar={onEditar}
            onEliminar={onEliminar}
          />
        ))}
      </AnimatePresence>
    </motion.ul>
  );
}

/* ---------- Tarjeta ---------- */

type MateriaCardProps = {
  materia: Materia;
  indice: number;
  onEditar: (materia: Materia) => void;
  onEliminar: (materia: Materia) => void;
};

function MateriaCard({ materia, indice, onEditar, onEliminar }: MateriaCardProps) {
  // Hover o foco dentro de la tarjeta → aparecen editar / eliminar
  const [activo, setActivo] = useState(false);

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      // Al eliminar: se encoge y se desenfoca mientras las demás se reacomodan
      exit={{ opacity: 0, scale: 0.85, filter: "blur(4px)", transition: { duration: 0.25 } }}
      transition={{ type: "spring", stiffness: 300, damping: 26, delay: indice * 0.04 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setActivo(true)}
      onHoverEnd={() => setActivo(false)}
      onFocus={() => setActivo(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setActivo(false);
      }}
      className="group relative flex gap-4 rounded-2xl border border-ink/10 bg-white p-5 shadow-sm transition-shadow hover:shadow-lg hover:shadow-ink/10"
    >
      {/* Editar / Eliminar */}
      <div className="absolute top-3 right-3">
        <MateriaMenu
          visible={activo}
          nombre={materia.nombre}
          onEditar={() => onEditar(materia)}
          onEliminar={() => onEliminar(materia)}
        />
      </div>

      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ink text-amber transition-colors group-hover:bg-amber group-hover:text-ink">
        <BookOpen className="h-6 w-6" />
      </div>

      {/* pr-20: deja espacio para los dos botones y que el nombre no quede debajo */}
      <div className="min-w-0 flex-1 pr-20">
        <p className="truncate font-display text-lg font-bold text-ink">{materia.nombre}</p>
        <p className="font-mono text-xs tracking-wider text-ink/50">NRC {materia.nrc}</p>

        {materia.descripcion && (
          <p className="mt-2 line-clamp-2 text-sm text-ink/60" title={materia.descripcion}>
            {materia.descripcion}
          </p>
        )}

        <p className="mt-2 text-xs text-ink/40">Creada el {fechaCorta(materia.fecha_creacion)}</p>
      </div>
    </motion.li>
  );
}