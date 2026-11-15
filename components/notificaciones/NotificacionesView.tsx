"use client";

import CartaAbierta from "@/components/notificaciones/CartaAbierta";
import SobreNotificacion from "@/components/notificaciones/SobreNotificacion";
import type { Notificacion } from "@/src/schemas/notificaciones";
import { Inbox, Mail, MailOpen, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useId, useMemo, useState } from "react";

type Filtro = "todas" | "sin_abrir";

const FILTROS: { valor: Filtro; etiqueta: string }[] = [
  { valor: "todas", etiqueta: "Todas" },
  { valor: "sin_abrir", etiqueta: "Sin abrir" },
];

type NotificacionesViewProps = {
  notificaciones: Notificacion[];
  ahora: number; // milisegundos, calculado en el servidor
};

export default function NotificacionesView({ notificaciones, ahora }: NotificacionesViewProps) {
  const [abierta, setAbierta] = useState<Notificacion | null>(null);
  const [filtro, setFiltro] = useState<Filtro>("todas");
  const reduceMotion = useReducedMotion();
  const uid = useId();

  const abrir = useCallback((n: Notificacion) => setAbierta(n), []);
  const cerrar = useCallback(() => setAbierta(null), []);

  const sinAbrir = notificaciones.filter((n) => !n.leida).length;

  const visibles = useMemo(
    () => (filtro === "todas" ? notificaciones : notificaciones.filter((n) => !n.leida)),
    [filtro, notificaciones],
  );

  // Con la carta abierta: Esc la cierra y la página de fondo no hace scroll
  useEffect(() => {
    if (!abierta) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") cerrar();
    };

    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [abierta, cerrar]);

  return (
    <section className="space-y-6">
      {/* ---------- Encabezado del buzón ---------- */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        className="flex flex-col gap-5 rounded-3xl bg-ink p-6 text-cream shadow-xl shadow-ink/10 sm:flex-row sm:items-end sm:justify-between sm:p-8"
      >
        <div>
          <div className="mb-3 flex items-center gap-2 text-amber">
            <Inbox className="size-5" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">Tu correspondencia</span>
          </div>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">Buzón</h1>
          <p className="mt-2 max-w-xl text-sm text-cream/65">Aquí llegan los avisos de tus tareas y grupos.</p>
        </div>

        {/* Contador: el sobre se sacude si hay cartas sin abrir */}
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
          <motion.span
            key={sinAbrir > 0 ? "con-cartas" : "sin-cartas"}
            animate={reduceMotion || sinAbrir === 0 ? undefined : { rotate: [0, -12, 10, -6, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 2.5 }}
            className="text-amber"
            aria-hidden="true"
          >
            {sinAbrir > 0 ? <Mail className="size-6" /> : <MailOpen className="size-6" />}
          </motion.span>
          <div className="leading-tight">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={sinAbrir}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                className="block font-display text-2xl font-bold text-cream"
              >
                {sinAbrir}
              </motion.span>
            </AnimatePresence>
            <span className="text-xs text-cream/60">{sinAbrir === 1 ? "carta sin abrir" : "cartas sin abrir"}</span>
          </div>
        </div>
      </motion.div>

      {/* ---------- Filtros ---------- */}
      <div className="flex w-fit gap-1 rounded-full bg-white p-1 ring-1 ring-ink/10" aria-label="Filtrar cartas">
        {FILTROS.map((opcion) => {
          const seleccionado = filtro === opcion.valor;
          return (
            <button
              key={opcion.valor}
              type="button"
              onClick={() => setFiltro(opcion.valor)}
              aria-pressed={seleccionado}
              className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber ${
                seleccionado ? "text-cream" : "text-ink/60 hover:text-ink"
              }`}
            >
              {seleccionado && (
                <motion.span
                  layoutId={`${uid}-filtro`}
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  className="absolute inset-0 rounded-full bg-ink shadow-md shadow-ink/15"
                />
              )}
              <span className="relative">{opcion.etiqueta}</span>
            </button>
          );
        })}
      </div>

      {/* ---------- Las cartas ---------- */}
      {visibles.length === 0 ? (
        <BuzonVacio todoLeido={notificaciones.length > 0} />
      ) : (
        <motion.ul layout className="space-y-3">
          <AnimatePresence initial={false}>
            {visibles.map((n, indice) => (
              <SobreNotificacion key={n.id} notificacion={n} indice={indice} ahora={ahora} onAbrir={abrir} />
            ))}
          </AnimatePresence>
        </motion.ul>
      )}

      {/* ---------- La carta abierta ---------- */}
      <AnimatePresence>
        {abierta && (
          <motion.div
            key="fondo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={cerrar}
            className="fixed inset-0 z-50 overflow-y-auto bg-ink/60 backdrop-blur-sm"
          >
            <div className="flex min-h-full items-center justify-center p-4">
              <div
                role="dialog"
                aria-modal="true"
                aria-label={`Carta: ${abierta.titulo}`}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-lg"
              >
                <motion.button
                  type="button"
                  onClick={cerrar}
                  aria-label="Cerrar"
                  whileHover={reduceMotion ? undefined : { rotate: 90 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.9 }}
                  className="absolute -left-3 -top-3 z-10 grid size-9 place-items-center rounded-full bg-ink text-cream shadow-lg transition-colors hover:bg-amber hover:text-ink"
                >
                  <X className="size-4" />
                </motion.button>

                <CartaAbierta key={abierta.id} notificacion={abierta} onCerrar={cerrar} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ---------- Buzón vacío ---------- */

function BuzonVacio({ todoLeido }: { todoLeido: boolean }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex min-h-72 flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-ink/15 bg-white/50 p-8 text-center"
    >
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, -8, 0], rotate: [0, -4, 4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="grid size-14 place-items-center rounded-2xl bg-amber/15 text-amber"
      >
        {todoLeido ? <MailOpen className="size-7" aria-hidden="true" /> : <Mail className="size-7" aria-hidden="true" />}
      </motion.div>
      <div>
        <h3 className="font-display text-xl font-bold text-ink">
          {todoLeido ? "Todo leído" : "Tu buzón está vacío"}
        </h3>
        <p className="mt-1 text-sm text-ink/55">
          {todoLeido ? "No tienes cartas sin abrir." : "Cuando crees tareas, aquí te llegarán los avisos."}
        </p>
      </div>
    </motion.div>
  );
}