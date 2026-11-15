"use client";

import { createTareaAction } from "@/actions/create-tarea-action";
import { updateTareaAction, type ActionStateType } from "@/actions/update-tarea-action";
import MateriaSelect from "@/components/grupos/MateriaSelect";
import ErrorMessage from "@/components/ui/error-message";
import FieldError from "@/components/ui/field-error";
import type { Materia } from "@/src/schemas/materias";
import type { Tarea, TareaPrioridad } from "@/src/schemas/tareas";
import { Users } from "lucide-react";
import { AnimatePresence, motion, useAnimate, useReducedMotion, type Variants } from "motion/react";
import { useActionState, useEffect, useId, useState } from "react";
import { toast } from "sonner";

const initialState: ActionStateType = { errors: {}, error: "", success: "" };

// Crear y editar comparten la forma del estado: el formulario usa una u otra
type Accion = (estado: ActionStateType, formData: FormData) => Promise<ActionStateType>;

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
  hoy: string;            // "YYYY-MM-DD" del servidor → mínimo de la fecha al crear
  tarea?: Tarea;          // si viene, el formulario edita esa tarea
  onCancelar: () => void;
  onSuccess?: () => void;
};

export default function TareaForm({ materias, hoy, tarea, onCancelar, onSuccess }: TareaFormProps) {
  const editando = tarea !== undefined;
  const deGrupo = tarea?.grupo_id != null;

  const accion: Accion = editando ? updateTareaAction : createTareaAction;
  const [state, formAction, isPending] = useActionState(accion, initialState);

  const [materiaId, setMateriaId] = useState<number | null>(tarea?.materia_id ?? materias[0]?.materia_id ?? null);
  const [prioridad, setPrioridad] = useState<TareaPrioridad>(tarea?.prioridad ?? "media");
  const [scope, animate] = useAnimate();
  const reduceMotion = useReducedMotion();
  const uid = useId();

  const nombreMateria =
    materias.find((m) => m.materia_id === tarea?.materia_id)?.nombre ?? `Materia #${tarea?.materia_id}`;

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
      {/* Al editar: qué tarea es y a qué grupo pertenece (se reenvía tal cual) */}
      {editando && (
        <>
          <input type="hidden" name="tarea_id" value={tarea.tarea_id} />
          <input type="hidden" name="grupo_id" value={tarea.grupo_id ?? ""} />
        </>
      )}

      {/* Título */}
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-ink">{editando ? "Editar tarea" : "Nueva tarea"}</h2>
        <motion.span
          initial={{ width: 0 }}
          animate={{ width: 56 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 20 }}
          className="mt-2 block h-1 rounded-full bg-amber"
        />
        <p className="mt-3 text-sm text-ink/55">
          {editando ? "Ajusta los datos de tu entrega." : "Completa los datos de tu entrega."}
        </p>
      </div>

      <div className="space-y-4">
        <Campo id="tarea-titulo" label="Título" errores={state.errors.titulo}>
          <input
            id="tarea-titulo"
            name="titulo"
            defaultValue={tarea?.titulo}
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
          {deGrupo ? (
            // Tarea de grupo: la materia la define el grupo (el backend exige que coincidan)
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between gap-3 rounded-xl border border-ink/10 bg-ink/5 px-3.5 py-3"
            >
              <input type="hidden" name="materia_id" value={tarea.materia_id} />
              <span className="truncate font-medium text-ink/70">{nombreMateria}</span>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-amber/20 px-2.5 py-1 text-xs font-bold text-ink">
                <Users className="size-3.5" aria-hidden="true" />
                Definida por el grupo
              </span>
            </motion.div>
          ) : (
            <MateriaSelect
              id="tarea-materia"
              materias={materias}
              value={materiaId}
              onChange={setMateriaId}
              invalid={!!state.errors.materia_id}
              disabled={isPending}
            />
          )}
        </Campo>

        <Campo id="tarea-descripcion" label="Descripción" opcional errores={state.errors.descripcion}>
          <textarea
            id="tarea-descripcion"
            name="descripcion"
            defaultValue={tarea?.descripcion ?? ""}
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
              defaultValue={tarea?.fecha_entrega}
              min={editando ? undefined : hoy} // al editar se puede corregir una tarea vencida
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
              defaultValue={tarea?.hora_entrega ?? ""}
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

        {/* Error general (404, 409, 503, conexión…) */}
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
          disabled={isPending || (!editando && materias.length === 0)}
          whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          className="group relative overflow-hidden rounded-xl bg-ink px-4 py-3 font-semibold text-cream disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="absolute inset-0 translate-y-full bg-amber transition-transform duration-300 ease-out group-hover:translate-y-0 group-disabled:translate-y-full" />
          <span className="relative transition-colors duration-300 group-hover:text-ink group-disabled:text-cream">
            {editando
              ? isPending ? "Guardando…" : "Guardar cambios"
              : isPending ? "Creando…" : "Crear tarea"}
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