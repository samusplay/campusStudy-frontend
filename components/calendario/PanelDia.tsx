"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import type { Tarea } from "./tipos";
import { fechaLarga } from "./utils";
import TareaItem from "./TareaItem";

interface Props {
  fecha: string; // YYYY-MM-DD
  tareas: Tarea[];
  nombresMaterias?: Record<number, string>;
  onClose: () => void;
}

export default function PanelDia({ fecha, tareas, nombresMaterias, onClose }: Props) {
  const cerrarRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cerrarRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={`Tareas del ${fechaLarga(fecha)}`}>
      <button
        type="button"
        aria-label="Cerrar panel"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-ink/50"
      />

      {/* Móvil: hoja inferior. Escritorio: panel lateral derecho. */}
      <aside className="absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col rounded-t-md bg-ink text-cream md:inset-y-0 md:left-auto md:right-0 md:max-h-none md:w-[420px] md:rounded-none">
        <header className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
          <div>
            <h3 className="font-display font-bold text-xl leading-tight">{fechaLarga(fecha)}</h3>
            <p className="mt-1 text-xs text-cream/60">
              {tareas.length === 0
                ? "Sin tareas"
                : `${tareas.length} ${tareas.length === 1 ? "tarea vence" : "tareas vencen"} este día`}
            </p>
          </div>
          <button
            ref={cerrarRef}
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-sm p-1.5 text-cream/70 hover:bg-white/10 hover:text-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber"
          >
            <X size={18} aria-hidden />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-5">
          {tareas.length === 0 ? (
            <p className="rounded-sm border border-dashed border-white/10 p-6 text-center text-sm text-cream/60">
              No hay tareas este día.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {tareas.map((t) => (
                <TareaItem key={t.tarea_id} tarea={t} nombreMateria={nombresMaterias?.[t.materia_id]} />
              ))}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}
