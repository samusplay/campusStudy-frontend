"use client";

import { createTareaAction, type ActionStateType } from "@/actions/create-tarea-action";
import MateriaSelect from "@/components/grupos/MateriaSelect";
import ErrorMessage from "@/components/ui/error-message";
import FieldError from "@/components/ui/field-error";
import type { Materia } from "@/src/schemas/materias";
import type { TareaPrioridad } from "@/src/schemas/tareas";
import { AnimatePresence, motion, useAnimate, useReducedMotion, type Variants } from "motion/react";
import { useActionState, useEffect, useId, useState } from "react";
import { toast } from "sonner";

const initialState: ActionStateType = { errors: {}, error: "", success: "" };

const desplegar: Variants = {
  oculto: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: "auto", transition: { duration: 0.2 } },
};
const PRIORIDADES: { valor: TareaPrioridad; etiqueta: string; activo: string }[] = [
  { valor: "baja", etiqueta: "Baja", activo: "bg-white text-ink/70" },
  { valor: "media", etiqueta: "Media", activo: "bg-amber/30 text-ink" },
  { valor: "alta", etiqueta: "Alta", activo: "bg-ink text-amber" },
];
type TareaFormProps = {
  materias: Materia[];
  hoy: string;            // "YYYY-MM-DD" del servidor → mínimo del input de fecha
  onCancelar: () => void;
  onSuccess?: () => void;
};

export default function TareaForm({ materias, hoy, onCancelar, onSuccess }: TareaFormProps) {
  const [state, formAction, isPending] = useActionState(createTareaAction, initialState);
  const [materiaId, setMateriaId] = useState<number | null>(materias[0]?.materia_id ?? null);
  const [prioridad, setPrioridad] = useState<TareaPrioridad>("media");
  const [scope, animate] = useAnimate();
  const reduceMotion = useReducedMotion();
  const uid = useId();

  useEffect(() => {
    if (state.success) {
      toast.success(state.success);
      onSuccess?.();
      return;
    }

    if (state.error) toast.error(state.error);

    const hayErrores = state.error || Object.keys(state.errors).length > 0;
    if (hayErrores && !reduceMotion && scope.current) {
      animate(scope.current, { x: [0, -10, 10, -6, 6, 0] }, { duration: 0.4 });
    }
  }, [state, animate, scope, reduceMotion, onSuccess]);

  return (
    <form ref={scope} action={formAction} noValidate className="rounded-3xl bg-white p-6 shadow-2xl shadow-ink/20 sm:p-8">
      {/* Título */}
      <div className="mb-6">
        <h2 id="tarea-form-title" className="font-display text-2xl font-bold text-ink">Nueva tarea</h2>
        <motion.span
          initial={{ width: 0 }}
          animate={{ width: 56 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 20 }}
          className="mt-2 block h-1 rounded-full bg-amber"
        />
        <p className="mt-3 text-sm text-ink/55">Completa los datos de tu entrega.</p>
      </div>

      <div className="space-y-4">
        <Campo id="tarea-titulo" label="Título" errores={state.errors.titulo}>
          <input
            id="tarea-titulo"
            name="titulo"
            maxLength={150}
            autoFocus
            autoComplete="off"
            placeholder="Ej: Entregar proyecto final"
            disabled={isPending}
            aria-invalid={!!state.errors.titulo}
            aria-describedby={state.errors.titulo ? "tarea-titulo-error" : undefined}
            className={claseInput(!!state.errors.titulo)}
          />
        </Campo>

        <Campo id="tarea-materia" label="Materia" errores={state.errors.materia_id}>
          <MateriaSelect
            id="tarea-materia"
            materias={materias}
            value={materiaId}
            onChange={setMateriaId}
            invalid={!!state.errors.materia_id}
            disabled={isPending}
          />
        </Campo>

        <Campo id="tarea-descripcion" label="Descripción" opcional errores={state.errors.descripcion}>
          <textarea
            id="tarea-descripcion"
            name="descripcion"
            maxLength={1000}
            rows={3}
            placeholder="Agrega detalles que te ayuden a recordar la tarea"
            disabled={isPending}
            className={`${claseInput(!!state.errors.descripcion)} resize-none`}
          />
        </Campo>

        <div className="grid gap-4 sm:grid-cols-2">
          <Campo id="tarea-fecha" label="Fecha de entrega" errores={state.errors.fecha_entrega}>
            <input
              id="tarea-fecha"
              name="fecha_entrega"
              type="date"
              min={hoy}
              disabled={isPending}
              aria-invalid={!!state.errors.fecha_entrega}
              aria-describedby={state.errors.fecha_entrega ? "tarea-fecha-error" : undefined}
              className={claseInput(!!state.errors.fecha_entrega)}
            />
          </Campo>

          <Campo id="tarea-hora" label="Hora" opcional errores={state.errors.hora_entrega}>
            <input
              id="tarea-hora"
              name="hora_entrega"
              type="time"
              disabled={isPending}
              className={claseInput(!!state.errors.hora_entrega)}
            />
          </Campo>
        </div>

        {/* Prioridad: píldora que se desliza (layoutId) */}
        <div>
          <span className="mb-1.5 block text-sm font-semibold text-ink">Prioridad</span>
          <input type="hidden" name="prioridad" value={prioridad} />
          <div role="radiogroup" aria-label="Prioridad" className="grid grid-cols-3 gap-1 rounded-xl bg-cream/60 p-1">
            {PRIORIDADES.map((p) => {
              const activo = prioridad === p.valor;
              return (
                <button
                  key={p.valor}
                  type="button"
                  role="radio"
                  aria-checked={activo}
                  onClick={() => setPrioridad(p.valor)}
                  disabled={isPending}
                  className="relative rounded-lg py-2 text-sm font-semibold text-ink/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
                >
                  {activo && (
                    <motion.span
                      layoutId={`${uid}-prioridad`}
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      className={`absolute inset-0 rounded-lg shadow-sm ${p.activo}`}
                    />
                  )}
                  <span className={`relative ${activo ? "text-current" : ""}`}>{p.etiqueta}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Error general (503, conexión…) */}
        <AnimatePresence>
          {state.error && (
            <motion.div variants={desplegar} initial="oculto" animate="visible" exit="oculto" className="overflow-hidden">
              <ErrorMessage>{state.error}</ErrorMessage>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-7 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onCancelar}
          disabled={isPending}
          className="rounded-xl border border-ink/15 px-4 py-3 font-semibold text-ink transition-colors hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber disabled:opacity-50"
        >
          Cancelar
        </button>
        <motion.button
          type="submit"
          disabled={isPending || materias.length === 0}
          whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          className="group relative overflow-hidden rounded-xl bg-ink px-4 py-3 font-semibold text-cream disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="absolute inset-0 translate-y-full bg-amber transition-transform duration-300 ease-out group-hover:translate-y-0 group-disabled:translate-y-full" />
          <span className="relative transition-colors duration-300 group-hover:text-ink group-disabled:text-cream">
            {isPending ? "Creando…" : "Crear tarea"}
          </span>
        </motion.button>
      </div>
    </form>
  );
}

/* ---------- Campo con etiqueta y FieldError animado ---------- */

function Campo({
  id,
  label,
  opcional,
  errores,
  children,
}: {
  id: string;
  label: string;
  opcional?: boolean;
  errores?: string[];
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
        {opcional && <span className="ml-1.5 font-normal text-ink/40">(opcional)</span>}
      </label>
      {children}
      <AnimatePresence>
        {errores && errores.length > 0 && (
          <motion.div
            id={`${id}-error`}
            variants={desplegar}
            initial="oculto"
            animate="visible"
            exit="oculto"
            className="mt-2 overflow-hidden"
          >
            <FieldError messages={errores} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function claseInput(invalido: boolean) {
  return `block w-full rounded-xl border bg-cream/40 px-3.5 py-3 text-ink placeholder:text-ink/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber disabled:opacity-60 ${
    invalido ? "border-red-500" : "border-ink/15 hover:border-ink/30"
  }`;
}