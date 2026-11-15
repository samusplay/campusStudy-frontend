"use client";

import { marcarLeidaNotificacionAction, type ActionStateType } from "@/actions/marcar-leida-notificacion-action";
import SelloPostal from "@/components/notificaciones/SelloPostal";
import { remitenteDe } from "@/src/config/notificaciones";
import type { Notificacion } from "@/src/schemas/notificaciones";
import { fechaHoraColombia } from "@/src/utils/fechas";
import { ArrowRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import Link from "next/link";
import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const initialState: ActionStateType = { error: "", success: "" };

type CartaAbiertaProps = {
    notificacion: Notificacion;
    onCerrar: () => void;
};

export default function CartaAbierta({ notificacion, onCerrar }: CartaAbiertaProps) {
    const reduceMotion = useReducedMotion();
    // Sin animaciones o carta ya leída: directo al mensaje (la ceremonia es solo la primera vez)
    const [abierta, setAbierta] = useState(Boolean(reduceMotion) || notificacion.leida);
    const [state, formAction] = useActionState(marcarLeidaNotificacionAction, initialState);
    const marcada = useRef(false);

    // Abrir la carta = leerla: se marca sola, una sola vez (aunque React monte dos veces en desarrollo)
    useEffect(() => {
        if (notificacion.leida || marcada.current) return;
        marcada.current = true;

        const datos = new FormData();
        datos.set("id", notificacion.id);
        startTransition(() => formAction(datos));
    }, [notificacion.id, notificacion.leida, formAction]);

    useEffect(() => {
        if (state.error) toast.error(state.error);
    }, [state]);

    return (
        <AnimatePresence mode="wait" initial={false}>
            {abierta ? (
                <Carta key="carta" notificacion={notificacion} onCerrar={onCerrar} />
            ) : (
                <SobreAbriendose key="sobre" titulo={notificacion.titulo} onAbierto={() => setAbierta(true)} />
            )}
        </AnimatePresence>
    );
}

/* ---------- Fase 1: el sobre se abre y la hoja sube (menos de 1 s; clic para saltar) ---------- */

function SobreAbriendose({ titulo, onAbierto }: { titulo: string; onAbierto: () => void }) {
    return (
        <motion.div
            role="button"
            tabIndex={0}
            aria-label="Abrir carta"
            onClick={onAbierto}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onAbierto();
            }}
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, y: 60, transition: { duration: 0.2 } }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{ perspective: 900 }} // da profundidad al giro 3D de la solapa
            className="relative mx-auto mt-28 h-52 w-full max-w-md cursor-pointer focus-visible:outline-none"
        >
            {/* Fondo del sobre */}
            <div className="absolute inset-0 rounded-xl bg-[#e9dcc4] shadow-2xl shadow-ink/30" />

            {/* La hoja: sube con el título ya visible; al terminar se despliega la carta */}
            <motion.div
                initial={{ y: 0 }}
                animate={{ y: -110 }}
                transition={{ delay: 0.6, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                onAnimationComplete={onAbierto}
                style={{ zIndex: 10 }}
                className="absolute inset-x-5 top-3 h-44 rounded-lg bg-[#fffdf8] p-5 shadow-md"
            >
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber">Para ti</p>
                <p className="mt-1 line-clamp-2 font-display text-lg font-bold text-ink">{titulo}</p>
            </motion.div>

            {/* Bolsillo: tapa la parte de abajo de la hoja y deja la "V" del sobre */}
            <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
                style={{ zIndex: 20 }}
                className="absolute inset-0 size-full"
            >
                <path d="M0 100V0l50 50L100 0v100z" fill="#f4eadb" />
                <path
                    d="M0 100l50-45 50 45"
                    fill="none"
                    stroke="rgba(27, 34, 54, 0.08)"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                />
            </svg>

            {/* Solapa: gira hacia arriba desde su borde superior; al terminar queda detrás de la hoja */}
            <motion.div
                initial={{ rotateX: 0, zIndex: 30 }}
                animate={{ rotateX: 180, transitionEnd: { zIndex: 0 } }}
                transition={{ delay: 0.2, duration: 0.35, ease: "easeInOut" }}
                style={{ transformOrigin: "top" }}
                className="absolute inset-x-0 top-0 h-1/2"
            >
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" className="size-full">
                    <path
                        d="M0 0l50 100L100 0z"
                        fill="#eadbbf"
                        stroke="rgba(27, 34, 54, 0.1)"
                        strokeWidth="1"
                        vectorEffect="non-scaling-stroke"
                    />
                </svg>

                {/* Lacre: se rompe al instante */}
                <motion.span
                    aria-hidden="true"
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{ scale: 1.6, opacity: 0 }}
                    transition={{ delay: 0.05, duration: 0.18 }}
                    className="absolute -bottom-5 left-[calc(50%-1.25rem)] grid size-10 place-items-center rounded-full bg-amber text-[10px] font-black text-ink/70 ring-4 ring-amber/30"
                >
                    CS
                </motion.span>
            </motion.div>
        </motion.div>
    );
}

/* ---------- Fase 2: la carta desplegada con el mensaje ---------- */

const linea: Variants = {
    oculto: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0 },
};

function Carta({ notificacion, onCerrar }: CartaAbiertaProps) {
    const reduceMotion = useReducedMotion();
    const { id, tipo, titulo, mensaje, referencia_id, fecha_creacion } = notificacion;
    const remitente = remitenteDe(tipo);

    return (
        <motion.article
            initial={reduceMotion ? false : { opacity: 0, scaleY: 0.4, y: -40 }}
            animate={{ opacity: 1, scaleY: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            style={{ transformOrigin: "top" }}
            // Papel rayado: una línea azul tenue cada 28px, igual al alto de línea del mensaje
            className="relative rounded-2xl bg-[#fffdf8] bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_27px,rgba(74,123,181,0.14)_27px,rgba(74,123,181,0.14)_28px)] px-7 pb-7 pt-8 shadow-2xl shadow-ink/30"
        >
            <div className="absolute -top-5 right-6">
                <SelloPostal seed={id} tamano="lg" inclinacion={4} matasellado />
            </div>

            <motion.div
                initial={reduceMotion ? false : "oculto"}
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } } }}
            >
                <motion.p variants={linea} className="pr-28 text-xs font-semibold uppercase tracking-wider text-ink/45">
                    De: {remitente} · {fechaHoraColombia(fecha_creacion)}
                </motion.p>

                <motion.h2 variants={linea} className="mt-3 pr-24 font-display text-2xl font-bold text-ink">
                    {titulo}
                </motion.h2>

                <motion.p variants={linea} className="mt-4 text-lg leading-7 text-ink/80">
                    {mensaje}
                </motion.p>

                <motion.p variants={linea} className="mt-6 font-display italic text-ink/60">
                    — Equipo de {remitente}, CampusStudy
                </motion.p>

                <motion.div variants={linea} className="mt-7 flex flex-wrap gap-3">
                    {tipo === "tarea" && referencia_id && (
                        <Link
                            href="/admin/tareas"
                            className="group inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-3 font-semibold text-cream transition-colors hover:bg-amber hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
                        >
                            Ver mis tareas
                            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                        </Link>
                    )}
                    <button
                        type="button"
                        onClick={onCerrar}
                        autoFocus
                        className="rounded-xl border border-ink/15 px-4 py-3 font-semibold text-ink transition-colors hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
                    >
                        Volver al buzón
                    </button>
                </motion.div>
            </motion.div>
        </motion.article>
    );
}