"use client";

import { createMateriaAction } from "@/actions/materias-create-action";
import { AnimatePresence, motion, useAnimate, useReducedMotion } from "motion/react";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import ErrorMessage from "../ui/error-message";
import FieldError from "../ui/field-error";


type ActionStateType = Awaited<ReturnType<typeof createMateriaAction>>;

const initialState: ActionStateType = { errors: [], fieldErrors: {}, success: "" };

// Entrada/salida de los mensajes de error: se despliegan en altura
const desplegar = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: "auto" },
  exit: { opacity: 0, height: 0 },
  transition: { duration: 0.25, ease: "easeOut" },
} as const;

type CreateMateriaFormProps = {
  onSuccess?: () => void; // el padre decide qué pasa al crear (cerrar el modal)
};

export default function CreateMateriaForm({ onSuccess }: CreateMateriaFormProps) {
  const [state, formAction, isPending] = useActionState(createMateriaAction, initialState);

  const [nombre, setNombre] = useState("");
  const [nrc, setNrc] = useState("");

  const [scope, animate] = useAnimate();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    // Éxito: toast, limpiar y avisar al padre
    if (state.success) {
      toast.success(state.success);
      setNombre("");
      setNrc("");
      onSuccess?.();
      return;
    }

    // Error general (409 NRC repetido, servidor caído...) → toast
    if (state.errors.length > 0) {
      toast.error(state.errors[0]);
    }

    // Cualquier error → el formulario "niega con la cabeza"
    const hayErrores = state.errors.length > 0 || Object.keys(state.fieldErrors).length > 0;
    if (hayErrores && !reduceMotion) {
      animate(scope.current, { x: [0, -10, 10, -6, 6, 0] }, { duration: 0.45 });
    }
  }, [state, animate, scope, reduceMotion, onSuccess]);

  return (
    <motion.form
      ref={scope}
      action={formAction}
      noValidate
      className="flex flex-col gap-5 rounded-3xl border border-ink/10 bg-white p-7 shadow-2xl shadow-ink/20"
    >
      {/* Encabezado */}
      <div>
        <h2 className="font-display text-2xl font-bold text-ink">Nueva materia</h2>
        <motion.span
          className="mt-2 block h-1 rounded-full bg-amber"
          initial={{ width: 0 }}
          animate={{ width: 48 }}
          transition={{ delay: 0.25, duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Error general: tu ErrorMessage */}
      <AnimatePresence>
        {state.errors.length > 0 && (
          <motion.div key="error" {...desplegar} className="overflow-hidden">
            <ErrorMessage>{state.errors[0]}</ErrorMessage>
          </motion.div>
        )}
      </AnimatePresence>

      <Campo
        id="nombre"
        label="Nombre"
        placeholder="Sistemas Distribuidos"
        value={nombre}
        onChange={setNombre}
        maxLength={100}
        errores={state.fieldErrors.nombre}
        autoFocus
      />

      <Campo
        id="nrc"
        label="NRC"
        placeholder="12345"
        value={nrc}
        onChange={setNrc}
        maxLength={20}
        errores={state.fieldErrors.nrc}
        mono
      />

      <motion.button
        type="submit"
        disabled={isPending}
        whileHover={isPending ? undefined : { y: -2 }}
        whileTap={{ scale: 0.97 }}
        className="group relative mt-1 overflow-hidden rounded-xl bg-ink px-5 py-3.5 font-semibold text-cream shadow-lg shadow-ink/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {/* Relleno ámbar que sube al pasar el mouse */}
        <span className="absolute inset-0 translate-y-full bg-amber transition-transform duration-300 ease-out group-hover:translate-y-0 group-disabled:translate-y-full" />
        <span className="relative transition-colors duration-300 group-hover:text-ink group-disabled:text-cream">
          {isPending ? "Creando…" : "Crear materia"}
        </span>
      </motion.button>
    </motion.form>
  );
}

/* ---------- Campo: input + tu FieldError animado ---------- */

type CampoProps = {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  errores?: string[];
  mono?: boolean;
  autoFocus?: boolean;
};

function Campo({ id, label, placeholder, value, onChange, maxLength, errores, mono, autoFocus }: CampoProps) {
  const tieneError = !!errores?.length;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
      </label>

      <input
        id={id}
        name={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        autoFocus={autoFocus}
        aria-invalid={tieneError}
        aria-describedby={tieneError ? `${id}-error` : undefined}
        className={`rounded-xl border-2 bg-cream/40 px-4 py-3 text-ink outline-none transition placeholder:text-ink/30 focus:bg-white ${
          mono ? "font-mono tracking-wider" : ""
        } ${tieneError ? "border-red-500" : "border-ink/10 focus:border-amber"}`}
      />

      <AnimatePresence>
        {tieneError && (
          <motion.div id={`${id}-error`} key={`${id}-error`} {...desplegar} className="overflow-hidden">
            <FieldError messages={errores} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}