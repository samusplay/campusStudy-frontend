"use client";

import { AnimatePresence, motion, useAnimate, useReducedMotion, type Variants } from "motion/react";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

import { updateMateriaAction } from "@/actions/update-materia-action";

import { createMateriaAction } from "@/actions/materias-create-action";
import type { Materia } from "@/src/schemas/materias";
import ErrorMessage from "../ui/error-message";
import FieldError from "../ui/field-error";

const initialState = { errors: [] as string[], fieldErrors: {} as Record<string, string[]>, success: "" };

const MAX_DESCRIPCION = 500;

const desplegar: Variants = {
  oculto: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: "auto", transition: { duration: 0.2 } },
};

type MateriaFormProps = {
  materia?: Materia;     // si viene → modo editar
  onSuccess?: () => void;
};

export default function MateriaForm({ materia, onSuccess }: MateriaFormProps) {
  const editando = Boolean(materia);
  const [state, formAction, isPending] = useActionState(
    editando ? updateMateriaAction : createMateriaAction,
    initialState,
  );

  const [nombre, setNombre] = useState(materia?.nombre ?? "");
  const [nrc, setNrc] = useState(materia?.nrc ?? "");
  const [descripcion, setDescripcion] = useState(materia?.descripcion ?? "");
  const [scope, animate] = useAnimate();
  const reduceMotion = useReducedMotion();

  // En editar: si no cambió nada, no tiene sentido guardar
  const sinCambios =
    editando &&
    nombre.trim() === materia!.nombre &&
    nrc.trim() === materia!.nrc &&
    descripcion.trim() === (materia!.descripcion ?? "");

  useEffect(() => {
    if (state.success) {
      toast.success(state.success);
      if (!editando) {
        setNombre("");
        setNrc("");
        setDescripcion("");
      }
      onSuccess?.();
      return;
    }

    if (state.errors.length) toast.error(state.errors[0]);

    const hayErrores = state.errors.length > 0 || Object.keys(state.fieldErrors).length > 0;
    if (hayErrores && !reduceMotion && scope.current) {
      animate(scope.current, { x: [0, -10, 10, -6, 6, 0] }, { duration: 0.4 });
    }
  }, [state, editando, animate, scope, reduceMotion, onSuccess]);

  return (
    <form ref={scope} action={formAction} noValidate className="rounded-3xl bg-white p-7 shadow-2xl shadow-ink/20">
      {editando && <input type="hidden" name="materia_id" value={materia!.materia_id} />}

      {/* Título */}
      <div className="mb-6">
        <AnimatePresence mode="wait" initial={false}>
          <motion.h2
            key={editando ? "editar" : "crear"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="font-display text-2xl font-bold text-ink"
          >
            {editando ? "Editar materia" : "Nueva materia"}
          </motion.h2>
        </AnimatePresence>
        <motion.span
          initial={{ width: 0 }}
          animate={{ width: 56 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 20 }}
          className="mt-2 block h-1 rounded-full bg-amber"
        />
        {editando && (
          <p className="mt-3 text-sm text-ink/50">
            Creada el {materia!.fecha_creacion.slice(0, 10).split("-").reverse().join("/")}
          </p>
        )}
      </div>

      <div className="space-y-5">
        <Campo
          id="materia-nombre"
          label="Nombre"
          errores={state.fieldErrors.nombre}
        >
          <input
            id="materia-nombre"
            name="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            maxLength={100}
            autoFocus
            autoComplete="off"
            placeholder="Ej: Sistemas Distribuidos"
            disabled={isPending}
            aria-invalid={!!state.fieldErrors.nombre}
            aria-describedby={state.fieldErrors.nombre ? "materia-nombre-error" : undefined}
            className={claseInput(!!state.fieldErrors.nombre)}
          />
        </Campo>

        <Campo id="materia-nrc" label="NRC" errores={state.fieldErrors.nrc}>
          <input
            id="materia-nrc"
            name="nrc"
            value={nrc}
            onChange={(e) => setNrc(e.target.value)}
            maxLength={20}
            autoComplete="off"
            placeholder="Ej: 12345"
            disabled={isPending}
            aria-invalid={!!state.fieldErrors.nrc}
            aria-describedby={state.fieldErrors.nrc ? "materia-nrc-error" : undefined}
            className={`${claseInput(!!state.fieldErrors.nrc)} font-mono`}
          />
        </Campo>

        <Campo
          id="materia-descripcion"
          label="Descripción"
          opcional
          contador={`${descripcion.length}/${MAX_DESCRIPCION}`}
          contadorAlerta={descripcion.length > MAX_DESCRIPCION - 50}
          errores={state.fieldErrors.descripcion}
        >
          <textarea
            id="materia-descripcion"
            name="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            maxLength={MAX_DESCRIPCION}
            rows={3}
            placeholder="Ej: Salón 302 · martes y jueves 7:00"
            disabled={isPending}
            aria-invalid={!!state.fieldErrors.descripcion}
            aria-describedby={state.fieldErrors.descripcion ? "materia-descripcion-error" : undefined}
            className={`${claseInput(!!state.fieldErrors.descripcion)} resize-none`}
          />
        </Campo>

        {/* Errores generales (409 NRC repetido, 404, 503…) */}
        <AnimatePresence>
          {state.errors.length > 0 && (
            <motion.div variants={desplegar} initial="oculto" animate="visible" exit="oculto" className="overflow-hidden">
              {state.errors.map((error) => (
                <ErrorMessage key={error}>{error}</ErrorMessage>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Botón: relleno ámbar que sube al pasar el mouse */}
        <motion.button
          type="submit"
          disabled={isPending || sinCambios}
          whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          className="group relative w-full overflow-hidden rounded-xl bg-ink px-5 py-3.5 font-semibold text-cream disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="absolute inset-0 translate-y-full bg-amber transition-transform duration-300 ease-out group-hover:translate-y-0 group-disabled:translate-y-full" />
          <span className="relative transition-colors duration-300 group-hover:text-ink group-disabled:text-cream">
            {isPending
              ? editando ? "Guardando…" : "Creando…"
              : sinCambios
                ? "Sin cambios"
                : editando ? "Guardar cambios" : "Crear materia"}
          </span>
        </motion.button>
      </div>
    </form>
  );
}

/* ---------- Campo con etiqueta, contador y FieldError animado ---------- */

type CampoProps = {
  id: string;
  label: string;
  opcional?: boolean;
  contador?: string;
  contadorAlerta?: boolean;
  errores?: string[];
  children: React.ReactNode;
};

function Campo({ id, label, opcional, contador, contadorAlerta, errores, children }: CampoProps) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <label htmlFor={id} className="text-sm font-semibold text-ink">
          {label}
          {opcional && <span className="ml-1.5 font-normal text-ink/40">(opcional)</span>}
        </label>
        {contador && (
          <span className={`font-mono text-xs ${contadorAlerta ? "text-amber" : "text-ink/40"}`}>{contador}</span>
        )}
      </div>
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
  return `w-full rounded-xl border bg-cream/40 px-4 py-3 text-ink placeholder:text-ink/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber disabled:opacity-60 ${
    invalido ? "border-red-500" : "border-ink/15 hover:border-ink/30"
  }`;
}