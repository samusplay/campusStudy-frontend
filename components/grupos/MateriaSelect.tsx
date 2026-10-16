"use client";

import type { Materia } from "@/src/schemas/materias";
import { BookOpen, Check, ChevronDown, Plus } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import Link from "next/link";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

type MateriaSelectProps = {
  id: string;
  materias: Materia[];
  value: number | null;
  onChange: (materiaId: number | null) => void;
  name?: string;
  invalid?: boolean;
  disabled?: boolean;
};

const listaVariants: Variants = {
  cerrada: { opacity: 0, y: -6, scale: 0.98, transition: { duration: 0.12 } },
  abierta: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 420, damping: 30, staggerChildren: 0.035 },
  },
};

const opcionVariants: Variants = {
  cerrada: { opacity: 0, x: -8 },
  abierta: { opacity: 1, x: 0 },
};

export default function MateriaSelect({
  id,
  materias,
  value,
  onChange,
  name = "materia_id",
  invalid = false,
  disabled = false,
}: MateriaSelectProps) {
  const [abierto, setAbierto] = useState(false);
  const [activo, setActivo] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const uid = useId();
  const reduceMotion = useReducedMotion();

  const seleccionada = materias.find((m) => m.materia_id === value) ?? null;
  const listId = `${id}-lista`;
  const opcionId = (materiaId: number) => `${id}-opcion-${materiaId}`;

  // Clic fuera → cerrar
  useEffect(() => {
    if (!abierto) return;
    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setAbierto(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [abierto]);

  // Con teclado, la opción activa siempre queda visible en la lista
  useEffect(() => {
    if (!abierto) return;
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${activo}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activo, abierto]);

  function abrir() {
    const index = materias.findIndex((m) => m.materia_id === value);
    setActivo(index >= 0 ? index : 0);
    setAbierto(true);
  }

  function elegir(materia: Materia) {
    onChange(materia.materia_id);
    setAbierto(false);
  }

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    if (!abierto) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        abrir();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActivo((i) => Math.min(i + 1, materias.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActivo((i) => Math.max(i - 1, 0));
        break;
      case "Home":
        e.preventDefault();
        setActivo(0);
        break;
      case "End":
        e.preventDefault();
        setActivo(materias.length - 1);
        break;
      case "Enter":
        e.preventDefault();
        elegir(materias[activo]);
        break;
      case "Escape":
        e.preventDefault();
        e.stopPropagation(); // Esc cierra la lista, NO el modal
        setAbierto(false);
        break;
      case "Tab":
        setAbierto(false);
        break;
    }
  }

  // ---------- Sin materias: no se puede crear un grupo ----------
  if (materias.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-ink/15 bg-cream/40 p-5 text-center">
        <input type="hidden" name={name} value="" />
        <p className="text-sm text-ink/70">Para crear un grupo primero necesitas una materia.</p>
        <Link
          href="/admin/materias"
          className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-ink-soft"
        >
          <Plus className="size-4" /> Crear materia
        </Link>
      </div>
    );
  }

  // ---------- Selector ----------
  return (
    <div ref={rootRef} className="relative">
      <input type="hidden" name={name} value={value ?? ""} />

      <motion.button
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={abierto}
        aria-controls={listId}
        aria-activedescendant={abierto ? opcionId(materias[activo].materia_id) : undefined}
        aria-invalid={invalid}
        aria-describedby={invalid ? `${id}-error` : undefined}
        disabled={disabled}
        onClick={() => (abierto ? setAbierto(false) : abrir())}
        onKeyDown={onKeyDown}
        whileTap={reduceMotion ? undefined : { scale: 0.99 }}
        className={`flex w-full items-center gap-3 rounded-xl border bg-cream/40 px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber disabled:opacity-60 ${
          invalid ? "border-red-500" : abierto ? "border-amber" : "border-ink/15 hover:border-ink/30"
        }`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {seleccionada ? (
            <motion.span
              key={seleccionada.materia_id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="flex min-w-0 flex-1 items-center gap-3"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-ink text-amber">
                <BookOpen className="size-4" />
              </span>
              <span className="min-w-0">
                <span className="block truncate font-semibold text-ink">{seleccionada.nombre}</span>
                <span className="block font-mono text-xs text-ink/50">NRC {seleccionada.nrc}</span>
              </span>
            </motion.span>
          ) : (
            <motion.span
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 py-1.5 text-ink/40"
            >
              Elige una materia
            </motion.span>
          )}
        </AnimatePresence>

        <motion.span
          animate={{ rotate: abierto ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="text-ink/50"
        >
          <ChevronDown className="size-5" />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {abierto && (
          <motion.ul
            ref={listRef}
            id={listId}
            role="listbox"
            aria-labelledby={id}
            variants={listaVariants}
            initial={reduceMotion ? false : "cerrada"}
            animate="abierta"
            exit="cerrada"
            style={{ transformOrigin: "top" }}
            className="absolute inset-x-0 top-full z-30 mt-2 max-h-64 overflow-y-auto rounded-2xl border border-ink/10 bg-white p-1.5 shadow-xl shadow-ink/15"
          >
            {materias.map((materia, index) => {
              const esSeleccionada = materia.materia_id === value;
              return (
                <motion.li
                  key={materia.materia_id}
                  id={opcionId(materia.materia_id)}
                  role="option"
                  aria-selected={esSeleccionada}
                  data-index={index}
                  variants={opcionVariants}
                  onMouseEnter={() => setActivo(index)}
                  onMouseDown={(e) => e.preventDefault()} // el foco se queda en el botón
                  onClick={() => elegir(materia)}
                  className="relative flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2"
                >
                  {/* Fondo que se desliza entre opciones */}
                  {activo === index && (
                    <motion.span
                      layoutId={`${uid}-resaltado`}
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      className="absolute inset-0 rounded-xl bg-cream"
                    />
                  )}

                  <span
                    className={`relative grid size-8 shrink-0 place-items-center rounded-lg transition-colors ${
                      esSeleccionada ? "bg-amber text-ink" : "bg-ink text-amber"
                    }`}
                  >
                    <BookOpen className="size-4" />
                  </span>
                  <span className="relative min-w-0 flex-1">
                    <span className="block truncate font-semibold text-ink">{materia.nombre}</span>
                    <span className="block font-mono text-xs text-ink/50">NRC {materia.nrc}</span>
                  </span>

                  <AnimatePresence>
                    {esSeleccionada && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 20 }}
                        className="relative text-amber"
                      >
                        <Check className="size-5" strokeWidth={3} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}