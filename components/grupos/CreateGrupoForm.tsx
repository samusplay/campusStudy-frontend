"use client";

import { createGrupoAction, type ActionStateType } from "@/actions/create-grupo-action";
import MateriaSelect from "@/components/grupos/MateriaSelect";
import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar";
import { BookOpen, Crown, Users } from "lucide-react";
import { AnimatePresence, motion, useAnimate, useReducedMotion, type Variants } from "motion/react";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

import type { Materia } from "@/src/schemas/materias";
import ErrorMessage from "../ui/error-message";
import FieldError from "../ui/field-error";

const initialState: ActionStateType = { errors: {}, error: "", success: "" };

const desplegar: Variants = {
  oculto: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: "auto", transition: { duration: 0.2 } },
};

type CreateGrupoFormProps = {
  materias: Materia[];
  usuarioId: number;
  onSuccess?: () => void;
};

export default function CreateGrupoForm({ materias, usuarioId, onSuccess }: CreateGrupoFormProps) {
  const [state, formAction, isPending] = useActionState(createGrupoAction, initialState);
  const [nombre, setNombre] = useState("");
  const [materiaId, setMateriaId] = useState<number | null>(null);
  const [sellado, setSellado] = useState(false);
  const [scope, animate] = useAnimate();
  const reduceMotion = useReducedMotion();

  const materia = materias.find((m) => m.materia_id === materiaId) ?? null;

  useEffect(() => {
    // Éxito: toast → sello "Creado" en la vista previa → limpiar y cerrar
    if (state.success) {
      toast.success(state.success);
      setSellado(true);
      const timer = setTimeout(
        () => {
          setNombre("");
          setMateriaId(null);
          setSellado(false);
          onSuccess?.();
        },
        reduceMotion ? 0 : 750,
      );
      return () => clearTimeout(timer);
    }

    // Error general → toast
    if (state.error) toast.error(state.error);

    // Cualquier error → shake
    const hayErrores = state.error || Object.keys(state.errors).length > 0;
    if (hayErrores && !reduceMotion && scope.current) {
      animate(scope.current, { x: [0, -10, 10, -6, 6, 0] }, { duration: 0.4 });
    }
  }, [state, animate, scope, reduceMotion, onSuccess]);

  return (
    <form ref={scope} action={formAction} noValidate className="rounded-3xl bg-white p-7 shadow-2xl shadow-ink/20">
      {/* Título */}
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-ink">Nuevo grupo</h2>
        <motion.span
          initial={{ width: 0 }}
          animate={{ width: 56 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 20 }}
          className="mt-2 block h-1 rounded-full bg-amber"
        />
      </div>

      {/* Vista previa en vivo */}
      <VistaPrevia
        nombre={nombre.trim()}
        materia={materia}
        usuarioId={usuarioId}
        isPending={isPending}
        sellado={sellado}
      />

      <div className="mt-6 space-y-5">
        {/* Nombre */}
        <div>
          <div className="mb-1.5 flex items-baseline justify-between">
            <label htmlFor="grupo-nombre" className="text-sm font-semibold text-ink">
              Nombre del grupo
            </label>
            <span className={`font-mono text-xs ${nombre.length > 90 ? "text-amber" : "text-ink/40"}`}>
              {nombre.length}/100
            </span>
          </div>
          <input
            id="grupo-nombre"
            name="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            maxLength={100}
            autoFocus
            autoComplete="off"
            placeholder="Ej: Equipo A"
            disabled={isPending || sellado}
            aria-invalid={!!state.errors.nombre}
            aria-describedby={state.errors.nombre ? "grupo-nombre-error" : undefined}
            className={`w-full rounded-xl border bg-cream/40 px-4 py-3 text-ink placeholder:text-ink/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber disabled:opacity-60 ${
              state.errors.nombre ? "border-red-500" : "border-ink/15 hover:border-ink/30"
            }`}
          />
          <AnimatePresence>
            {state.errors.nombre && (
              <motion.div
                id="grupo-nombre-error"
                variants={desplegar}
                initial="oculto"
                animate="visible"
                exit="oculto"
                className="mt-2 overflow-hidden"
              >
                <FieldError messages={state.errors.nombre} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Materia */}
        <div>
          <label htmlFor="grupo-materia" className="mb-1.5 block text-sm font-semibold text-ink">
            Materia
          </label>
          <MateriaSelect
            id="grupo-materia"
            materias={materias}
            value={materiaId}
            onChange={setMateriaId}
            invalid={!!state.errors.materia_id}
            disabled={isPending || sellado}
          />
          <AnimatePresence>
            {state.errors.materia_id && (
              <motion.div
                id="grupo-materia-error"
                variants={desplegar}
                initial="oculto"
                animate="visible"
                exit="oculto"
                className="mt-2 overflow-hidden"
              >
                <FieldError messages={state.errors.materia_id} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Error general (409, 503…) */}
        <AnimatePresence>
          {state.error && (
            <motion.div variants={desplegar} initial="oculto" animate="visible" exit="oculto" className="overflow-hidden">
              <ErrorMessage>{state.error}</ErrorMessage>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Botón: relleno ámbar que sube al pasar el mouse */}
        <motion.button
          type="submit"
          disabled={isPending || sellado || materias.length === 0}
          whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          className="group relative w-full overflow-hidden rounded-xl bg-ink px-5 py-3.5 font-semibold text-cream disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="absolute inset-0 translate-y-full bg-amber transition-transform duration-300 ease-out group-hover:translate-y-0 group-disabled:translate-y-full" />
          <span className="relative transition-colors duration-300 group-hover:text-ink group-disabled:text-cream">
            {isPending ? "Creando…" : sellado ? "¡Listo!" : "Crear grupo"}
          </span>
        </motion.button>
      </div>
    </form>
  );
}

/* ---------- Vista previa del grupo ---------- */

type VistaPreviaProps = {
  nombre: string;
  materia: Materia | null;
  usuarioId: number;
  isPending: boolean;
  sellado: boolean;
};

function VistaPrevia({ nombre, materia, usuarioId, isPending, sellado }: VistaPreviaProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      animate={isPending && !reduceMotion ? { scale: [1, 0.98, 1] } : { scale: 1 }}
      transition={isPending ? { duration: 1, repeat: Infinity, ease: "easeInOut" } : { type: "spring" }}
      className="relative overflow-hidden rounded-2xl bg-ink p-5 text-cream"
    >
      {/* Ícono decorativo de fondo */}
      <Users className="pointer-events-none absolute -right-5 -bottom-7 size-32 text-cream/5" />

      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-amber/80">Vista previa</p>

      {/* Nombre */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.h3
          key={nombre ? "con-nombre" : "sin-nombre"}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
          className={`mt-2 truncate font-display text-2xl font-bold ${nombre ? "text-cream" : "text-cream/30"}`}
        >
          {nombre || "Tu nuevo grupo"}
        </motion.h3>
      </AnimatePresence>

      {/* Materia */}
      <div className="mt-1 flex h-5 items-center gap-1.5 text-sm">
        <BookOpen className="size-3.5 shrink-0 text-amber" />
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={materia?.materia_id ?? "sin-materia"}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 6 }}
            transition={{ duration: 0.18 }}
            className={`truncate ${materia ? "text-cream/80" : "text-cream/30"}`}
          >
            {materia ? materia.nombre : "Sin materia"}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Tú como líder */}
      <div className="mt-5 flex items-center gap-3">
        <Avatar>
          <AvatarFallback seed={usuarioId}>Tú</AvatarFallback>
          <AvatarBadge label="Líder">
            <Crown className="size-2.5" strokeWidth={2.5} />
          </AvatarBadge>
        </Avatar>
        <div className="text-xs leading-tight">
          <p className="font-semibold text-cream">Tú · líder</p>
          <p className="text-cream/50">1 integrante</p>
        </div>
      </div>

      {/* Sello al crear */}
      <AnimatePresence>
        {sellado && (
          <motion.div
            initial={{ scale: 2.4, opacity: 0, rotate: -30 }}
            animate={{ scale: 1, opacity: 1, rotate: -12 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 14 }}
            className="absolute top-5 right-5 rounded-lg border-2 border-amber px-3 py-1 font-mono text-xs font-bold uppercase tracking-[0.2em] text-amber"
          >
            Creado
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}