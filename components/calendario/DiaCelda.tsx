"use client";

import type { Tarea } from "./tipos";
import type { CeldaDia } from "./utils";
import { estadoInfo } from "./config";

interface Props {
  celda: CeldaDia;
  tareas: Tarea[];
  esHoy: boolean;
  seleccionado: boolean;
  onSelect: (iso: string) => void;
}

const MAX_CHIPS = 2;
const MAX_PUNTOS = 4;

export default function DiaCelda({ celda, tareas, esHoy, seleccionado, onSelect }: Props) {
  const extra = tareas.length - MAX_CHIPS;

  return (
    <button
      type="button"
      onClick={() => onSelect(celda.iso)}
      aria-label={`${celda.dia}, ${tareas.length} ${tareas.length === 1 ? "tarea" : "tareas"}`}
      aria-pressed={seleccionado}
      className={`flex min-h-[64px] flex-col items-stretch gap-1 p-1.5 text-left transition-colors focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber md:min-h-[112px] md:p-2 ${
        celda.delMes ? "bg-cream hover:bg-white" : "bg-[#ebe3d3] hover:bg-[#f0e9db]"
      } ${seleccionado ? "ring-2 ring-inset ring-ink" : ""}`}
    >
      <span
        className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs ${
          esHoy
            ? "bg-amber font-semibold text-ink"
            : celda.delMes
              ? "text-ink"
              : "text-ink/35"
        }`}
      >
        {celda.dia}
      </span>

      {/* Escritorio: chips con título */}
      <div className="hidden flex-col gap-1 md:flex">
        {tareas.slice(0, MAX_CHIPS).map((t) => (
          <span
            key={t.tarea_id}
            className="flex items-center gap-1.5 truncate rounded-sm bg-ink/[0.07] px-1.5 py-0.5 text-[11px] text-ink"
          >
            <span className={`h-2 w-2 shrink-0 rounded-full ${estadoInfo(t.estado).punto}`} aria-hidden />
            <span className="truncate">{t.titulo}</span>
          </span>
        ))}
        {extra > 0 && (
          <span className="px-1.5 text-[11px] font-medium text-ink/70">+{extra} más</span>
        )}
      </div>

      {/* Móvil: solo puntos */}
      {tareas.length > 0 && (
        <div className="flex flex-wrap items-center gap-1 px-0.5 md:hidden">
          {tareas.slice(0, MAX_PUNTOS).map((t) => (
            <span key={t.tarea_id} className={`h-2 w-2 rounded-full ${estadoInfo(t.estado).punto}`} aria-hidden />
          ))}
          {tareas.length > MAX_PUNTOS && (
            <span className="text-[10px] text-ink/70">+{tareas.length - MAX_PUNTOS}</span>
          )}
        </div>
      )}
    </button>
  );
}
