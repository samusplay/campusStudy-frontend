"use client";

import SelloPostal from "@/components/notificaciones/SelloPostal";
import { remitenteDe } from "@/src/config/notificaciones";
import type { Notificacion } from "@/src/schemas/notificaciones";
import { fechaHoraColombia, haceCuanto } from "@/src/utils/fechas";
import { motion, useReducedMotion } from "motion/react";
// Cada sello queda pegado un poco distinto
const INCLINACIONES = [-4, 3, -1, 5, -3];

type SobreNotificacionProps = {
  notificacion: Notificacion;
  indice: number;
  ahora: number;                                  // milisegundos, calculado en el servidor
  onAbrir: (notificacion: Notificacion) => void;  // abre la carta en NotificacionesView
};

export default function SobreNotificacion({ notificacion, indice, ahora, onAbrir }: SobreNotificacionProps) {
  const reduceMotion = useReducedMotion();
  const { id, tipo, titulo, leida, fecha_creacion } = notificacion;

  return (
    <motion.li
      layout
      initial={reduceMotion ? false : { opacity: 0, y: 16, rotate: -1 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={reduceMotion ? { duration: 0 } : { delay: indice * 0.04, type: "spring", stiffness: 260, damping: 22 }}
    >
      <motion.button
        type="button"
        onClick={() => onAbrir(notificacion)}
        aria-label={`${leida ? "Carta leída" : "Carta nueva"}: ${titulo}`}
        whileHover={reduceMotion ? undefined : { y: -4 }}
        whileTap={reduceMotion ? undefined : { scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className={`relative w-full overflow-hidden rounded-2xl border text-left shadow-sm transition-shadow hover:shadow-lg hover:shadow-ink/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber ${
          leida ? "border-ink/10 bg-white/60" : "border-amber/40 bg-[#fffdf8]"
        }`}
      >
        {/* Solapa del sobre: dos líneas de las esquinas al centro */}
        <svg
          viewBox="0 0 100 40"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-16 w-full"
        >
          <path
            d="M0 0 L50 32 L100 0"
            fill={leida ? "transparent" : "rgba(232, 163, 61, 0.08)"}
            stroke="rgba(27, 34, 54, 0.12)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div className="relative flex items-center gap-4 p-5">
          <Lacre intacto={!leida} />

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink/45">
              De: {remitenteDe(tipo)}
            </p>
            <h3 className={`mt-1 truncate font-display text-lg font-bold ${leida ? "text-ink/55" : "text-ink"}`}>
              {titulo}
            </h3>
            <time
              dateTime={fecha_creacion}
              title={fechaHoraColombia(fecha_creacion)}
              className="mt-0.5 block text-sm text-ink/45"
            >
              {haceCuanto(fecha_creacion, ahora)}
            </time>
          </div>

          <SelloPostal seed={id} inclinacion={INCLINACIONES[indice % INCLINACIONES.length]} matasellado={leida} />
        </div>
      </motion.button>
    </motion.li>
  );
}

/* ---------- Sello de lacre: cerrado si la carta no se ha abierto ---------- */

function Lacre({ intacto }: { intacto: boolean }) {
  const reduceMotion = useReducedMotion();

  if (!intacto) {
    // Carta abierta: solo queda la marca donde estaba el lacre
    return <span aria-hidden="true" className="size-9 shrink-0 rounded-full border-2 border-dashed border-ink/15" />;
  }

  return (
    <motion.span
      aria-hidden="true"
      animate={reduceMotion ? undefined : { scale: [1, 1.08, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className="grid size-9 shrink-0 place-items-center rounded-full bg-amber shadow-md shadow-amber/40 ring-4 ring-amber/20"
    >
      <span className="grid size-6 place-items-center rounded-full border border-ink/20 text-[9px] font-black tracking-tight text-ink/70">
        CS
      </span>
    </motion.span>
  );
}