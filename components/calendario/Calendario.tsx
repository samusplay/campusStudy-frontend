"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import type { Tarea } from "./tipos";
import { DIAS_SEMANA, MESES, agruparPorFecha, celdasDelMes, hoyISO } from "./utils";
import DiaCelda from "./DiaCelda";
import PanelDia from "./PanelDia";
import LeyendaCalendario from "./LeyendaCalendario";

interface Props {
  tareas: Tarea[];
  /** Opcional: { materia_id: "Nombre" } para mostrar el nombre en el panel. */
  nombresMaterias?: Record<number, string>;
}

const BOTON =
  "rounded-sm border border-ink/25 px-3 py-1.5 text-sm text-ink hover:bg-ink/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber";

export default function Calendario({ tareas, nombresMaterias }: Props) {
  const [anio, setAnio] = useState(() => new Date().getFullYear());
  const [mes, setMes] = useState(() => new Date().getMonth());
  const [seleccionado, setSeleccionado] = useState<string | null>(null);

  const hoy = hoyISO();
  const celdas = useMemo(() => celdasDelMes(anio, mes), [anio, mes]);
  const porFecha = useMemo(() => agruparPorFecha(tareas), [tareas]);

  const cambiarMes = (delta: number) => {
    const d = new Date(anio, mes + delta, 1);
    setAnio(d.getFullYear());
    setMes(d.getMonth());
  };

  const irAHoy = () => {
    const d = new Date();
    setAnio(d.getFullYear());
    setMes(d.getMonth());
  };

  return (
    <section className="flex w-full flex-col gap-5 text-ink">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display font-bold text-3xl leading-none" aria-live="polite">
          {MESES[mes]} {anio}
        </h2>
        <div className="flex items-center gap-2">
          <button type="button" onClick={irAHoy} className="rounded-sm bg-amber px-3 py-1.5 text-sm font-medium text-ink hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink">
            Hoy
          </button>
          <button type="button" onClick={() => cambiarMes(-1)} aria-label="Mes anterior" className={BOTON}>
            <ChevronLeft size={16} aria-hidden />
          </button>
          <button type="button" onClick={() => cambiarMes(1)} aria-label="Mes siguiente" className={BOTON}>
            <ChevronRight size={16} aria-hidden />
          </button>
        </div>
      </header>

      <LeyendaCalendario />

      <div>
        <div className="grid grid-cols-7 pb-2 text-center text-xs text-ink/70">
          {DIAS_SEMANA.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-px overflow-hidden rounded-sm border border-[#d6c9b2] bg-[#d6c9b2]">
          {celdas.map((c) => (
            <DiaCelda
              key={c.iso}
              celda={c}
              tareas={porFecha[c.iso] ?? []}
              esHoy={c.iso === hoy}
              seleccionado={c.iso === seleccionado}
              onSelect={setSeleccionado}
            />
          ))}
        </div>
      </div>

      {seleccionado && (
        <PanelDia
          fecha={seleccionado}
          tareas={porFecha[seleccionado] ?? []}
          nombresMaterias={nombresMaterias}
          onClose={() => setSeleccionado(null)}
        />
      )}
    </section>
  );
}
