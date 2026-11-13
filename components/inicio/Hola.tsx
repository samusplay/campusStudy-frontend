"use client";

import { motion, useReducedMotion } from "motion/react";

type HolaProps = {
  nombre: string;
  fuente: string; // fontFamily de la letra manuscrita
};

export default function Hola({ nombre, fuente }: HolaProps) {
  const reduceMotion = useReducedMotion();
  const letras = Array.from(nombre);

  return (
    <main className="relative grid min-h-[85vh] place-items-center overflow-hidden px-6">
      {/* Halo ámbar que se enciende detrás */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute size-[36rem] rounded-full bg-amber/20 blur-3xl"
        initial={reduceMotion ? false : { scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.5, ease: "easeOut" }}
      />

      <div className="relative flex flex-col items-center text-center">
        {/* "hola" escrito a mano: primero el trazo, luego el relleno */}
        <svg
          viewBox="0 0 600 220"
          className="w-[min(90vw,640px)] overflow-visible"
          role="img"
          aria-label={nombre ? `Hola, ${nombre}` : "Hola"}
        >
          <defs>
            <linearGradient id="hola-degradado" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" style={{ stopColor: "var(--color-amber)" }} />
              <stop offset="100%" style={{ stopColor: "var(--color-ink)" }} />
            </linearGradient>
          </defs>

          <motion.text
            x="50%"
            y="58%"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="200"
            style={{ fontFamily: fuente }}
            stroke="url(#hola-degradado)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="url(#hola-degradado)"
            strokeDasharray="2200"
            initial={reduceMotion ? false : { strokeDashoffset: 2200, fillOpacity: 0 }}
            animate={{ strokeDashoffset: 0, fillOpacity: 1 }}
            transition={{
              strokeDashoffset: { duration: 2.8, ease: "easeInOut" },
              fillOpacity: { delay: 2.2, duration: 0.9, ease: "easeOut" },
            }}
          >
            hola
          </motion.text>
        </svg>

        {/* El nombre aparece letra por letra, saliendo del desenfoque */}
        {nombre && (
          <h1 aria-hidden className="-mt-2 font-display text-5xl font-bold text-ink sm:text-6xl">
            {letras.map((letra, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={reduceMotion ? false : { opacity: 0, y: 24, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 2.8 + i * 0.07, type: "spring", stiffness: 200, damping: 18 }}
              >
                {letra === " " ? "\u00A0" : letra}
              </motion.span>
            ))}
          </h1>
        )}

        <motion.p
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.6, duration: 0.8 }}
          className="mt-5 text-ink/50"
        >
          Bienvenido de nuevo a CampusStudy
        </motion.p>
      </div>
    </main>
  );
}