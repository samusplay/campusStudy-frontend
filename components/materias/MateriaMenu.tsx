"use client";

import { Pencil } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { useSyncExternalStore, type MouseEvent } from "react";

type MateriaMenuProps = {
  visible: boolean; // la tarjeta avisa si tiene hover o foco
  nombre: string;
  onEditar: () => void;
  onEliminar: () => void;
};

const contenedor: Variants = {
  oculto: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
  visible: { transition: { staggerChildren: 0.07 } },
};

const boton: Variants = {
  oculto: { opacity: 0, scale: 0.5, y: -6 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 500, damping: 22 } },
};

// Lápiz: "escribe" al pasar el mouse
const lapiz: Variants = {
  oculto: { rotate: 0, x: 0 },
  visible: { rotate: 0, x: 0 },
  hover: { rotate: [0, -14, 10, -6, 0], x: [0, -1, 1, -1, 0], transition: { duration: 0.5 } },
};

// Tapa de la basura: se levanta girando sobre su esquina izquierda
const tapa: Variants = {
  oculto: { y: 0, rotate: 0 },
  visible: { y: 0, rotate: 0 },
  hover: { y: -2.5, rotate: -22, transition: { type: "spring", stiffness: 400, damping: 12 } },
};

export default function MateriaMenu({ visible, nombre, onEditar, onEliminar }: MateriaMenuProps) {
  const reduceMotion = useReducedMotion();
  const sinHover = useSinHover(); // celulares: no hay hover → botones siempre visibles
  const mostrar = visible || sinHover;

  // La tarjeta podría ser clickeable (Link): que el clic en el botón no la active
  function manejar(accion: () => void) {
    return (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      accion();
    };
  }

  return (
    <motion.div
      variants={contenedor}
      initial={false}
      animate={mostrar ? "visible" : "oculto"}
      className={`flex items-center gap-1.5 ${mostrar ? "" : "pointer-events-none"}`}
    >
      {/* Editar */}
      <motion.button
        type="button"
        variants={reduceMotion ? undefined : boton}
        whileHover={reduceMotion ? undefined : "hover"}
        whileTap={reduceMotion ? undefined : { scale: 0.88 }}
        onClick={manejar(onEditar)}
        aria-label={`Editar ${nombre}`}
        title="Editar"
        className="grid size-9 place-items-center rounded-full bg-white text-blue-600 shadow-md shadow-ink/10 ring-1 ring-ink/5 transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <motion.span variants={lapiz} className="grid place-items-center">
          <Pencil className="size-4" strokeWidth={2.25} />
        </motion.span>
      </motion.button>

      {/* Eliminar */}
      <motion.button
        type="button"
        variants={reduceMotion ? undefined : boton}
        whileHover={reduceMotion ? undefined : "hover"}
        whileTap={reduceMotion ? undefined : { scale: 0.88 }}
        onClick={manejar(onEliminar)}
        aria-label={`Eliminar ${nombre}`}
        title="Eliminar"
        className="grid size-9 place-items-center rounded-full bg-white text-red-600 shadow-md shadow-ink/10 ring-1 ring-ink/5 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
      >
        <IconoBasura />
      </motion.button>
    </motion.div>
  );
}

/* ---------- Basura con tapa animable (trazos de lucide "trash-2") ---------- */

function IconoBasura() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-4 overflow-visible"
    >
      {/* Tapa + asa: la única parte que se mueve */}
      <motion.g variants={tapa} style={{ originX: 0, originY: 1 }}>
        <path d="M3 6h18" />
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      </motion.g>
      {/* Cuerpo */}
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}

/* ---------- ¿El dispositivo tiene hover? ---------- */

function useSinHover() {
  return useSyncExternalStore(
    (avisar) => {
      const mq = window.matchMedia("(hover: none)");
      mq.addEventListener("change", avisar);
      return () => mq.removeEventListener("change", avisar);
    },
    () => window.matchMedia("(hover: none)").matches, // en el navegador
    () => false, // en el servidor (sin hydration mismatch)
  );
}