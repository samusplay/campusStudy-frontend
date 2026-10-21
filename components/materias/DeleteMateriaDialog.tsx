"use client";

import { deleteMateriaAction } from "@/actions/delete-materia-action";
import { AlertTriangle } from "lucide-react";
import { AnimatePresence, motion, useAnimate, useReducedMotion, type Variants } from "motion/react";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

import type { Materia } from "@/src/schemas/materias";
import ErrorMessage from "../ui/error-message";

const initialState = { errors: [] as string[], fieldErrors: {} as Record<string, string[]>, success: "" };

const desplegar: Variants = {
  oculto: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: "auto", transition: { duration: 0.2 } },
};

type DeleteMateriaDialogProps = {
  materia: Materia;
  onCancelar: () => void;
  onSuccess?: () => void;
};

export default function DeleteMateriaDialog({ materia, onCancelar, onSuccess }: DeleteMateriaDialogProps) {
  const [state, formAction, isPending] = useActionState(deleteMateriaAction, initialState);
  const [scope, animate] = useAnimate();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (state.success) {
      toast.success(state.success);
      onSuccess?.();
      return;
    }

    if (state.errors.length) {
      toast.error(state.errors[0]);
      if (!reduceMotion && scope.current) {
        animate(scope.current, { x: [0, -10, 10, -6, 6, 0] }, { duration: 0.4 });
      }
    }
  }, [state, animate, scope, reduceMotion, onSuccess]);

  return (
    <form
      ref={scope}
      action={formAction}
      className="rounded-3xl bg-white p-7 text-center shadow-2xl shadow-ink/20"
    >
      <input type="hidden" name="materia_id" value={materia.materia_id} />
      <input type="hidden" name="nombre" value={materia.nombre} />

      {/* Basura: entra rebotando y abre la tapa dos veces */}
      <motion.div
        initial={reduceMotion ? false : { scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 14 }}
        className="relative mx-auto grid size-16 place-items-center rounded-2xl bg-red-50 text-red-600"
      >
        {/* Onda roja que se expande una vez */}
        {!reduceMotion && (
          <motion.span
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.6, opacity: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: "easeOut" }}
            className="absolute inset-0 rounded-2xl bg-red-200"
          />
        )}
        <BasuraAnimada abriendo={!reduceMotion} />
      </motion.div>

      <h2 className="mt-5 font-display text-2xl font-bold text-ink">¿Eliminar materia?</h2>

      <p className="mt-2 text-ink/70">
        Vas a eliminar <span className="font-semibold text-ink">“{materia.nombre}”</span>
        <span className="mt-0.5 block font-mono text-xs text-ink/40">NRC {materia.nrc}</span>
      </p>

      {/* Aviso: grupos huérfanos */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-5 flex gap-3 rounded-2xl bg-amber/15 px-4 py-3 text-left text-sm text-ink/80"
      >
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber" />
        <p>
          Los grupos de esta materia quedarán <strong>sin materia asociada</strong>. Esta acción no se puede deshacer.
        </p>
      </motion.div>

      <AnimatePresence>
        {state.errors.length > 0 && (
          <motion.div variants={desplegar} initial="oculto" animate="visible" exit="oculto" className="mt-4 overflow-hidden">
            {state.errors.map((error) => (
              <ErrorMessage key={error}>{error}</ErrorMessage>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Acciones: Cancelar recibe el foco (la opción segura) */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <motion.button
          type="button"
          onClick={onCancelar}
          disabled={isPending}
          autoFocus
          whileTap={reduceMotion ? undefined : { scale: 0.97 }}
          className="rounded-xl border border-ink/15 px-5 py-3 font-semibold text-ink transition-colors hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber disabled:opacity-50"
        >
          Cancelar
        </motion.button>

        <motion.button
          type="submit"
          disabled={isPending}
          whileTap={reduceMotion ? undefined : { scale: 0.97 }}
          className="group relative overflow-hidden rounded-xl bg-red-600 px-5 py-3 font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {/* Relleno oscuro que sube al pasar el mouse */}
          <span className="absolute inset-0 translate-y-full bg-red-800 transition-transform duration-300 ease-out group-hover:translate-y-0 group-disabled:translate-y-full" />
          <span className="relative inline-flex items-center justify-center gap-2">
            {isPending && (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                className="size-4 rounded-full border-2 border-white/40 border-t-white"
              />
            )}
            {isPending ? "Eliminando…" : "Eliminar"}
          </span>
        </motion.button>
      </div>
    </form>
  );
}

/* ---------- Basura grande con tapa que se abre al aparecer ---------- */

function BasuraAnimada({ abriendo }: { abriendo: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="relative size-8 overflow-visible"
    >
      <motion.g
        style={{ originX: 0, originY: 1 }}
        animate={abriendo ? { rotate: [0, -25, 0, -25, 0], y: [0, -2.5, 0, -2.5, 0] } : undefined}
        transition={{ duration: 1, delay: 0.35, times: [0, 0.25, 0.5, 0.75, 1] }}
      >
        <path d="M3 6h18" />
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      </motion.g>
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}