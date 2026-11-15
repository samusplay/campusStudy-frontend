"use client";

import type { Tarea } from "@/src/types/calendario";
import { DIAS_SEMANA, MESES, agruparPorFecha, celdasDelMes } from "@/src/utils/calendario";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import { useMemo, useState } from "react";
import DiaCelda from "./DiaCelda";
import LeyendaCalendario from "./LeyendaCalendario";
import PanelDia from "./PanelDia";

interface Props {
  tareas: Tarea[];
  nombresMaterias?: Record<number, string>;
  hoy: string; // "YYYY-MM-DD" del servidor (hora de Colombia)
}

// El mes entra desde el lado hacia donde navegas y sale por el contrario
const mesVariants: Variants = {
  entrar: (dir: number) => ({ x: dir * 80, opacity: 0 }),
  centro: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 260, damping: 28 } },
  salir: (dir: number) => ({ x: dir * -80, opacity: 0, transition: { duration: 0.18 } }),
};

const BOTON_NAV =
  "grid size-10 place-items-center rounded-full border border-cream/15 text-cream transition-colors hover:bg-cream/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber";

export default function Calendario({ tareas, nombresMaterias, hoy }: Props) {
  const reduceMotion = useReducedMotion();

  // El mes inicial sale de "hoy" del servidor, no de new Date() (sin error de hidratación)
  const [anioHoy, mesHoy] = hoy.split("-").map(Number);
  const [anio, setAnio] = useState(anioHoy);
  const [mes, setMes] = useState(mesHoy - 1); // 0 = enero
  const [direccion, setDireccion] = useState(0);
  const [seleccionado, setSeleccionado] = useState<string | null>(null);

  const celdas = useMemo(() => celdasDelMes(anio, mes), [anio, mes]);
  const porFecha = useMemo(() => agruparPorFecha(tareas), [tareas]);

  const prefijoMes = `${anio}-${String(mes + 1).padStart(2, "0")}`;
  const tareasDelMes = tareas.filter((t) => t.fecha_entrega.startsWith(prefijoMes));
  const pendientesDelMes = tareasDelMes.filter((t) => t.estado !== "completada").length;
  const enMesActual = anio === anioHoy && mes === mesHoy - 1;

  function cambiarMes(delta: number) {
    const d = new Date(anio, mes + delta, 1);
    setDireccion(delta);
    setAnio(d.getFullYear());
    setMes(d.getMonth());
  }

  function irAHoy() {
    const destino = anioHoy * 12 + (mesHoy - 1);
    const actual = anio * 12 + mes;
    setDireccion(Math.sign(destino - actual));
    setAnio(anioHoy);
    setMes(mesHoy - 1);
  }

  return (
    <section className="flex w-full flex-col gap-6 text-ink">
      {/* ---------- Encabezado ---------- */}
      <motion.header
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        className="relative overflow-hidden rounded-3xl bg-ink p-6 text-cream shadow-xl shadow-ink/10 sm:p-8"
      >
        <CalendarDays className="pointer-events-none absolute -right-6 -bottom-8 size-44 text-cream/5" aria-hidden />

        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber">Calendario</p>

            {/* Mes que rueda como un odómetro */}
            <div className="mt-2 h-12 overflow-hidden sm:h-14" aria-live="polite">
              <AnimatePresence mode="popLayout" initial={false} custom={direccion}>
                <motion.h1
                  key={prefijoMes}
                  custom={direccion}
                  initial={reduceMotion ? false : { y: direccion >= 0 ? 40 : -40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: direccion >= 0 ? -40 : 40, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="font-display text-4xl font-bold sm:text-5xl"
                >
                  {MESES[mes]} <span className="text-cream/40">{anio}</span>
                </motion.h1>
              </AnimatePresence>
            </div>

            <p className="mt-2 text-sm text-cream/60">
              {tareasDelMes.length === 0
                ? "Sin entregas este mes"
                : `${tareasDelMes.length} ${tareasDelMes.length === 1 ? "entrega" : "entregas"} · ${pendientesDelMes} por terminar`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              type="button"
              onClick={irAHoy}
              disabled={enMesActual}
              whileTap={reduceMotion ? undefined : { scale: 0.95 }}
              className="rounded-full bg-amber px-5 py-2.5 text-sm font-bold text-ink transition-opacity disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream"
            >
              Hoy
            </motion.button>
            <motion.button
              type="button"
              onClick={() => cambiarMes(-1)}
              aria-label="Mes anterior"
              whileHover={reduceMotion ? undefined : { x: -2 }}
              whileTap={reduceMotion ? undefined : { scale: 0.9 }}
              className={BOTON_NAV}
            >
              <ChevronLeft className="size-5" aria-hidden />
            </motion.button>
            <motion.button
              type="button"
              onClick={() => cambiarMes(1)}
              aria-label="Mes siguiente"
              whileHover={reduceMotion ? undefined : { x: 2 }}
              whileTap={reduceMotion ? undefined : { scale: 0.9 }}
              className={BOTON_NAV}
            >
              <ChevronRight className="size-5" aria-hidden />
            </motion.button>
          </div>
        </div>
      </motion.header>

      <LeyendaCalendario />

      {/* ---------- Cuadrícula ---------- */}
      <div className="rounded-3xl bg-white p-3 shadow-sm shadow-ink/5 sm:p-5">
        <div className="grid grid-cols-7 pb-3 text-center text-xs font-semibold uppercase tracking-wider text-ink/45">
          {DIAS_SEMANA.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>

        <div className="overflow-hidden">
          <AnimatePresence mode="wait" initial={false} custom={direccion}>
            <motion.div
              key={prefijoMes}
              custom={direccion}
              variants={reduceMotion ? undefined : mesVariants}
              initial="entrar"
              animate="centro"
              exit="salir"
              className="grid grid-cols-7 gap-1.5 sm:gap-2"
            >
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
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ---------- Panel del día ---------- */}
      <AnimatePresence>
        {seleccionado && (
          <PanelDia
            key={seleccionado}
            fecha={seleccionado}
            tareas={porFecha[seleccionado] ?? []}
            nombresMaterias={nombresMaterias}
            onClose={() => setSeleccionado(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}