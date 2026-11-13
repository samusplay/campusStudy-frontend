"use client";

import { motion, useReducedMotion } from "motion/react";
import { estadoInfo } from "./config";
import type { Tarea } from "./tipos";
import type { CeldaDia } from "./utils";

interface Props {
  celda: CeldaDia;
  tareas: Tarea[];
  esHoy: boolean;
  seleccionado: boolean;
  onSelect: (iso: string) => void;
}

const MAX_CHIPS = 3;
const MAX_PUNTOS = 4;

// Los mismos colores de prioridad de la sección de tareas: cream → ámbar → ink
const CHIP_PRIORIDAD = {
  baja: "bg-cream text-ink/70",
  media: "bg-amber/25 text-ink",
  alta: "bg-ink text-cream",
} as const;

export default function DiaCelda({ celda, tareas, esHoy, seleccionado, onSelect }: Props) {
  const reduceMotion = useReducedMotion();
  const extra = tareas.length - MAX_CHIPS;
  const cantidad = `${tareas.length} ${tareas.length === 1 ? "tarea" : "tareas"}`;

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(celda.iso)}
      aria-label={`${celda.dia}, ${cantidad}`}
      aria-pressed={seleccionado}
      whileHover={reduceMotion ? undefined : { y: -3 }}
      whileTap={reduceMotion ? undefined : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`group relative flex min-h-[76px] flex-col items-stretch gap-1.5 rounded-xl p-1.5 text-left transition-colors focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber sm:p-2 md:min-h-[128px] ${
        celda.delMes ? "bg-cream/50 hover:bg-cream" : "bg-transparent hover:bg-cream/40"
      } ${seleccionado ? "ring-2 ring-ink" : ""} ${tareas.length > 0 && celda.delMes ? "hover:shadow-md hover:shadow-ink/10" : ""}`}
    >
      {/* Número del día */}
      <span className="relative inline-grid size-7 place-items-center">
        {esHoy && !reduceMotion && (
          // Pulso ámbar alrededor de "hoy"
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full bg-amber"
            animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        <span
          className={`relative grid size-7 place-items-center rounded-full text-xs ${
            esHoy
              ? "bg-amber font-bold text-ink"
              : celda.delMes
                ? "font-semibold text-ink"
                : "text-ink/25"
          }`}
        >
          {celda.dia}
        </span>
      </span>

      {/* Escritorio: chips con título, coloreados por prioridad */}
      <div className="hidden flex-col gap-1 md:flex">
        {tareas.slice(0, MAX_CHIPS).map((t, i) => {
          const terminada = t.estado === "completada";
          return (
            <motion.span
              key={t.tarea_id}
              initial={reduceMotion ? false : { opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 + i * 0.04 }}
              className={`flex items-center gap-1.5 truncate rounded-md px-1.5 py-1 text-[11px] font-medium ${
                CHIP_PRIORIDAD[t.prioridad ?? "media"]
              } ${terminada ? "opacity-45 line-through" : ""} ${celda.delMes ? "" : "opacity-40"}`}
            >
              <span className={`size-1.5 shrink-0 rounded-full ${estadoInfo(t.estado).punto}`} aria-hidden />
              {t.hora_entrega && <span className="shrink-0 font-mono opacity-70">{t.hora_entrega}</span>}
              <span className="truncate">{t.titulo}</span>
            </motion.span>
          );
        })}
        {extra > 0 && <span className="px-1.5 text-[11px] font-semibold text-ink/55">+{extra} más</span>}
      </div>

      {/* Móvil: solo puntos */}
      {tareas.length > 0 && (
        <div className="flex flex-wrap items-center gap-1 px-0.5 md:hidden">
          {tareas.slice(0, MAX_PUNTOS).map((t) => (
            <span key={t.tarea_id} className={`size-1.5 rounded-full ${estadoInfo(t.estado).punto}`} aria-hidden />
          ))}
          {tareas.length > MAX_PUNTOS && (
            <span className="text-[10px] text-ink/60">+{tareas.length - MAX_PUNTOS}</span>
          )}
        </div>
      )}
    </motion.button>
  );
}