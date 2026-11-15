"use client";

import { ESCENAS } from "@/components/notificaciones/escenas";
import { motion, useReducedMotion } from "motion/react";

// El mismo id siempre cae en la misma escena (hash simple del texto)
function escenaDe(seed: string) {
  let hash = 0;
  for (const letra of seed) hash = (hash * 31 + letra.charCodeAt(0)) >>> 0;
  return ESCENAS[hash % ESCENAS.length];
}

type SelloPostalProps = {
  seed: string;              // el id de la notificación
  tamano?: "sm" | "lg";
  inclinacion?: number;      // grados: cada sello queda un poco torcido, como pegado a mano
  matasellado?: boolean;     // carta ya leída: lleva la marca del correo
};

export default function SelloPostal({ seed, tamano = "sm", inclinacion = -4, matasellado = false }: SelloPostalProps) {
  const reduceMotion = useReducedMotion();
  const { nombre, Dibujo } = escenaDe(seed);
  const grande = tamano === "lg";

  return (
    <motion.div
      aria-hidden="true"
      initial={false}
      animate={{ rotate: inclinacion }}
      whileHover={reduceMotion ? undefined : { rotate: 0, scale: 1.06 }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
      className={`relative shrink-0 drop-shadow-sm ${grande ? "w-24" : "w-14"}`}
    >
      {/* Papel con borde perforado: los "huecos" son círculos transparentes en el margen */}
      <div className="bg-[radial-gradient(circle,transparent_2px,#fffdf8_2.5px)] bg-[length:7px_7px] bg-[position:-3.5px_-3.5px] p-[5px]">
        <div className="bg-[#fffdf8] p-1">
          <svg viewBox="0 0 60 60" className="block w-full">
            <Dibujo />
          </svg>

          {grande && (
            <div className="mt-1 flex items-baseline justify-between px-0.5 text-[9px] font-bold uppercase tracking-wider text-ink/70">
              <span>{nombre}</span>
              <span className="text-amber">2026</span>
            </div>
          )}
        </div>
      </div>

      {matasellado && <Matasellos />}
    </motion.div>
  );
}

/* ---------- Matasellos: círculo + ondas, la marca de "ya pasó por el correo" ---------- */

function Matasellos() {
  return (
    <svg viewBox="0 0 60 40" className="pointer-events-none absolute -right-5 -top-3 w-3/4 text-ink/30">
      <circle cx="18" cy="20" r="13" fill="none" stroke="currentColor" strokeWidth="2" />
      <path
        d="M31 12c5-3 9 3 14 0s9 3 14 0M31 20c5-3 9 3 14 0s9 3 14 0M31 28c5-3 9 3 14 0s9 3 14 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}