"use client";

import CreateGrupoForm from "@/components/grupos/CreateGrupoForm";
import GruposList from "@/components/grupos/GruposList";
import type { Grupo } from "@/src/schemas/grupos";
import type { Materia } from "@/src/schemas/materias";
import { Plus, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import { useCallback, useEffect, useState } from "react";

const plusVariants: Variants = {
  reposo: { rotate: 0 },
  hover: { rotate: 90 },
};

type GruposViewProps = {
  grupos: Grupo[];
  materias: Materia[];
  usuarioId: number;
};

export default function GruposView({ grupos, materias, usuarioId }: GruposViewProps) {
  const [abierto, setAbierto] = useState(false);
  const reduceMotion = useReducedMotion();

  // Estables: CreateGrupoForm usa onSuccess en las dependencias de su useEffect
  const abrir = useCallback(() => setAbierto(true), []);
  const cerrar = useCallback(() => setAbierto(false), []);

  // Modal abierto: Esc cierra y el fondo no hace scroll
  useEffect(() => {
    if (!abierto) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") cerrar();
    }

    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [abierto, cerrar]);

  const total = grupos.length;
  const puedeCrear = materias.length > 0;

  return (
    <>
      {/* Barra: contador + botón (solo si ya hay grupos; si no, el botón está en el estado vacío) */}
      {total > 0 && (
        <div className="mb-6 flex items-center justify-between gap-4">
          <motion.p
            key={total}
            initial={reduceMotion ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-ink/60"
          >
            {total} {total === 1 ? "grupo" : "grupos"}
          </motion.p>

          <motion.button
            type="button"
            onClick={abrir}
            disabled={!puedeCrear}
            title={puedeCrear ? undefined : "Primero crea una materia"}
            initial="reposo"
            whileHover={reduceMotion || !puedeCrear ? undefined : "hover"}
            whileTap={reduceMotion || !puedeCrear ? undefined : { scale: 0.96 }}
            className="inline-flex items-center gap-2 rounded-full bg-ink py-2.5 pr-5 pl-3 font-semibold text-cream shadow-lg shadow-ink/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <motion.span
              variants={plusVariants}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="grid size-7 place-items-center rounded-full bg-cream/10"
            >
              <Plus className="size-4" />
            </motion.span>
            Nuevo grupo
          </motion.button>
        </div>
      )}

      <GruposList grupos={grupos} materias={materias} usuarioId={usuarioId} onCrear={abrir} />

      {/* Modal */}
      <AnimatePresence>
        {abierto && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={cerrar}
            // El scroll va en el backdrop, NO en el diálogo: así la lista de MateriaSelect no se corta
            className="fixed inset-0 z-50 overflow-y-auto bg-ink/60 backdrop-blur-sm"
          >
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label="Crear grupo"
                onClick={(e) => e.stopPropagation()}
                initial={reduceMotion ? false : { opacity: 0, scale: 0.9, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 12 }}
                transition={{ type: "spring", stiffness: 320, damping: 26 }}
                className="relative w-full max-w-md"
              >
                <motion.button
                  type="button"
                  onClick={cerrar}
                  aria-label="Cerrar"
                  whileHover={reduceMotion ? undefined : { rotate: 90, scale: 1.05 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="absolute -top-3 -right-3 z-10 grid size-9 place-items-center rounded-full bg-white text-ink shadow-lg shadow-ink/20"
                >
                  <X className="size-4" />
                </motion.button>

                <CreateGrupoForm materias={materias} usuarioId={usuarioId} onSuccess={cerrar} />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}