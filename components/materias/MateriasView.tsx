"use client";

import CreateMateriaForm from "@/components/materias/CreateMateriaForm";
import MateriasList from "@/components/materias/MateriasList";
import type { Materia } from "@/src/schemas/materias";
import { Plus, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

export default function MateriasView({ materias }: { materias: Materia[] }) {
  const [abierto, setAbierto] = useState(false);

  // Funciones estables: el formulario recibe "cerrar" como onSuccess
  const abrir = useCallback(() => setAbierto(true), []);
  const cerrar = useCallback(() => setAbierto(false), []);

  // Con el modal abierto: Esc lo cierra y la página de fondo no hace scroll
  useEffect(() => {
    if (!abierto) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") cerrar();
    };

    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [abierto, cerrar]);

  return (
    <>
      {/* Barra: contador + botón "+" (solo si ya hay materias) */}
      {materias.length > 0 && (
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm font-medium text-ink/50">
            {materias.length} {materias.length === 1 ? "materia" : "materias"}
          </p>

          <motion.button
            type="button"
            onClick={abrir}
            whileHover="hover"
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 rounded-full bg-ink py-2.5 pl-3 pr-5 font-semibold text-cream shadow-lg shadow-ink/20 transition-colors hover:bg-amber hover:text-ink"
          >
            <motion.span
              variants={{ hover: { rotate: 90 } }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-cream/15"
            >
              <Plus className="h-4 w-4" />
            </motion.span>
            Nueva materia
          </motion.button>
        </div>
      )}

      <MateriasList materias={materias} onCrear={abrir} />

      {/* Modal con el formulario */}
      <AnimatePresence>
        {abierto && (
          <motion.div
            key="fondo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={cerrar}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm"
          >
            <motion.div
              key="modal"
              role="dialog"
              aria-modal="true"
              aria-label="Nueva materia"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="relative w-full max-w-md"
            >
              {/* Botón cerrar flotando en la esquina */}
              <motion.button
                type="button"
                onClick={cerrar}
                aria-label="Cerrar"
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="absolute -right-3 -top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-ink text-cream shadow-lg transition-colors hover:bg-amber hover:text-ink"
              >
                <X className="h-4 w-4" />
              </motion.button>

              <CreateMateriaForm onSuccess={cerrar} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}