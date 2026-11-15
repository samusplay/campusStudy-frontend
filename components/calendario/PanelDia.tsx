"use client";

import type { Tarea } from "@/src/types/calendario";
import { fechaConDia } from "@/src/utils/calendario";
import { CalendarCheck, X } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { useEffect, useRef, useSyncExternalStore } from "react";
import TareaItem from "./TareaItem";
interface Props {
  fecha: string; // YYYY-MM-DD
  tareas: Tarea[];
  nombresMaterias?: Record<number, string>;
  onClose: () => void;
}

const lista: Variants = {
  oculto: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
};

const item: Variants = {
  oculto: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 26 } },
};

export default function PanelDia({ fecha, tareas, nombresMaterias, onClose }: Props) {
  const cerrarRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();
  const esEscritorio = useEsEscritorio();

  useEffect(() => {
    cerrarRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  // Escritorio: entra desde la derecha. Móvil: sube desde abajo.
  const fuera = esEscritorio ? { x: "100%" } : { y: "100%" };
  const dentro = esEscritorio ? { x: 0 } : { y: 0 };

  const pendientes = tareas.filter((t) => t.estado !== "completada").length;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={`Tareas del ${fechaConDia(fecha)}`}>
      {/* Fondo */}
      <motion.button
        type="button"
        aria-label="Cerrar panel"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 cursor-default bg-ink/50 backdrop-blur-sm"
      />

      {/* Panel */}
      <motion.aside
        initial={reduceMotion ? { opacity: 0 } : fuera}
        animate={reduceMotion ? { opacity: 1 } : dentro}
        exit={reduceMotion ? { opacity: 0 } : fuera}
        transition={{ type: "spring", stiffness: 320, damping: 34 }}
        className="absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col rounded-t-3xl bg-ink text-cream shadow-2xl md:inset-y-0 md:left-auto md:right-0 md:max-h-none md:w-[440px] md:rounded-none md:rounded-l-3xl"
      >
        {/* Agarradera (solo móvil) */}
        <span className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-cream/20 md:hidden" aria-hidden />

        <header className="flex items-start justify-between gap-4 border-b border-cream/10 p-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber">Entregas del día</p>
            <h3 className="mt-2 font-display text-2xl font-bold leading-tight">{fechaConDia(fecha)}</h3>
            <p className="mt-1 text-sm text-cream/60">
              {tareas.length === 0
                ? "Sin tareas"
                : `${tareas.length} ${tareas.length === 1 ? "tarea" : "tareas"} · ${pendientes} por terminar`}
            </p>
          </div>
          <motion.button
            ref={cerrarRef}
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            whileHover={reduceMotion ? undefined : { rotate: 90 }}
            whileTap={reduceMotion ? undefined : { scale: 0.9 }}
            className="grid size-9 shrink-0 place-items-center rounded-full bg-cream/10 text-cream transition-colors hover:bg-amber hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
          >
            <X className="size-4" aria-hidden />
          </motion.button>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {tareas.length === 0 ? (
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-cream/15 p-8 text-center"
            >
              <CalendarCheck className="size-8 text-amber" aria-hidden />
              <p className="text-sm text-cream/60">Día libre: no hay entregas.</p>
            </motion.div>
          ) : (
            <motion.ul
              variants={lista}
              initial={reduceMotion ? false : "oculto"}
              animate="visible"
              className="flex flex-col gap-3"
            >
              {tareas.map((t) => (
                <motion.li key={t.tarea_id} variants={item}>
                  <TareaItem tarea={t} nombreMateria={nombresMaterias?.[t.materia_id]} />
                </motion.li>
              ))}
            </motion.ul>
          )}
        </div>
      </motion.aside>
    </div>
  );
}

/* ---------- ¿Pantalla de escritorio? (md = 768 px) ---------- */

function useEsEscritorio() {
  return useSyncExternalStore(
    (avisar) => {
      const mq = window.matchMedia("(min-width: 768px)");
      mq.addEventListener("change", avisar);
      return () => mq.removeEventListener("change", avisar);
    },
    () => window.matchMedia("(min-width: 768px)").matches,
    () => true, // en el servidor
  );
}