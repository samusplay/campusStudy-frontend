"use client";

import { deleteTareaAction, type ActionStateType } from "@/actions/delete-tarea-action";
import TareaForm from "@/components/tareas/TareaForm";
import TareasList from "@/components/tareas/TareasList";
import type { Materia } from "@/src/schemas/materias";
import type { Tarea, TareaEstado } from "@/src/schemas/tareas";
import { AlertTriangle, CheckCircle2, Circle, Clock3, ListTodo, Plus, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useActionState, useCallback, useEffect, useId, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";

type Filtro = "todas" | Exclude<TareaEstado, "cancelada">;

const FILTROS: { valor: Filtro; etiqueta: string }[] = [
  { valor: "todas", etiqueta: "Todas" },
  { valor: "pendiente", etiqueta: "Pendientes" },
  { valor: "en_progreso", etiqueta: "En progreso" },
  { valor: "completada", etiqueta: "Completadas" },
];

// Qué muestra el modal (null = cerrado)
type Modal = { modo: "crear" } | { modo: "eliminar"; tarea: Tarea } | null;

type TareasViewProps = {
  tareas: Tarea[];
  materias: Materia[];
  hoy: string; // "YYYY-MM-DD" del servidor
};

export default function TareasView({ tareas, materias, hoy }: TareasViewProps) {
  const [modal, setModal] = useState<Modal>(null);
  const [filtro, setFiltro] = useState<Filtro>("todas");
  const reduceMotion = useReducedMotion();
  const uid = useId();

  // Estables: TareaForm y el diálogo los usan en las dependencias de su useEffect
  const abrirCrear = useCallback(() => setModal({ modo: "crear" }), []);
  const abrirEliminar = useCallback((tarea: Tarea) => setModal({ modo: "eliminar", tarea }), []);
  const cerrar = useCallback(() => setModal(null), []);

  const nombresMaterias = useMemo(
    () => new Map(materias.map((m) => [m.materia_id, m.nombre])),
    [materias],
  );

  const tareasFiltradas = useMemo(
    () => (filtro === "todas" ? tareas : tareas.filter((t) => t.estado === filtro)),
    [filtro, tareas],
  );

  const contar = (estado: TareaEstado) => tareas.filter((t) => t.estado === estado).length;
  const abierto = modal !== null;
  const puedeCrear = materias.length > 0;

  // Con el modal abierto: Esc lo cierra y la página de fondo no hace scroll
  useEffect(() => {
    if (!abierto) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") cerrar();
    };

    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [abierto, cerrar]);

  return (
    <section className="space-y-6">
      {/* ---------- Encabezado + resumen ---------- */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        className="flex flex-col gap-5 rounded-3xl bg-ink p-6 text-cream shadow-xl shadow-ink/10 sm:p-8 lg:flex-row lg:items-end lg:justify-between"
      >
        <div>
          <div className="mb-3 flex items-center gap-2 text-amber">
            <ListTodo className="size-5" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">Organiza tu estudio</span>
          </div>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">Mis tareas</h1>
          <p className="mt-2 max-w-xl text-sm text-cream/65">Revisa tus entregas y avanza una tarea a la vez.</p>
        </div>

        <div className="flex flex-wrap gap-2" aria-label="Resumen de tareas">
          <Resumen icono={<Circle className="size-4" />} etiqueta="Pendientes" cantidad={contar("pendiente")} />
          <Resumen icono={<Clock3 className="size-4" />} etiqueta="En progreso" cantidad={contar("en_progreso")} />
          <Resumen icono={<CheckCircle2 className="size-4" />} etiqueta="Completadas" cantidad={contar("completada")} />
        </div>
      </motion.div>

      {/* ---------- Filtros + botón ---------- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 overflow-x-auto rounded-full bg-white p-1 ring-1 ring-ink/10" aria-label="Filtrar tareas">
          {FILTROS.map((opcion) => {
            const seleccionado = filtro === opcion.valor;
            return (
              <button
                key={opcion.valor}
                type="button"
                onClick={() => setFiltro(opcion.valor)}
                aria-pressed={seleccionado}
                className={`relative shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber ${
                  seleccionado ? "text-cream" : "text-ink/60 hover:text-ink"
                }`}
              >
                {/* Píldora que se desliza entre filtros */}
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

        {puedeCrear ? (
          <motion.button
            type="button"
            onClick={abrirCrear}
            whileHover="hover"
            whileTap={reduceMotion ? undefined : { scale: 0.95 }}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-amber py-2.5 pl-3 pr-5 font-bold text-ink shadow-lg shadow-amber/20 transition-colors hover:bg-ink hover:text-cream"
          >
            <motion.span
              variants={{ hover: { rotate: 90 } }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="grid size-7 place-items-center rounded-full bg-ink/10"
            >
              <Plus className="size-4" />
            </motion.span>
            Nueva tarea
          </motion.button>
        ) : (
          <p className="text-sm font-medium text-ink/55">Primero crea una materia para asignar tus tareas.</p>
        )}
      </div>

      <TareasList
        tareas={tareasFiltradas}
        nombresMaterias={nombresMaterias}
        hoy={hoy}
        onCrear={filtro === "todas" && puedeCrear ? abrirCrear : undefined}
        onEliminar={abrirEliminar}
        mensajeVacio={filtro === "todas" ? undefined : "No hay tareas en este filtro."}
      />

      {/* ---------- Modal: crear o eliminar ---------- */}
      <AnimatePresence>
        {modal && (
          <motion.div
            key="fondo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={cerrar}
            // El scroll va en el fondo: así la lista de MateriaSelect no se corta
            className="fixed inset-0 z-50 overflow-y-auto bg-ink/60 backdrop-blur-sm"
          >
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                role={modal.modo === "eliminar" ? "alertdialog" : "dialog"}
                aria-modal="true"
                aria-label={modal.modo === "eliminar" ? "Eliminar tarea" : "Nueva tarea"}
                onClick={(e) => e.stopPropagation()}
                initial={reduceMotion ? false : { opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
                className={`relative w-full ${modal.modo === "eliminar" ? "max-w-sm" : "max-w-lg"}`}
              >
                <motion.button
                  type="button"
                  onClick={cerrar}
                  aria-label="Cerrar"
                  whileHover={reduceMotion ? undefined : { rotate: 90 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.9 }}
                  className="absolute -right-3 -top-3 z-10 grid size-9 place-items-center rounded-full bg-ink text-cream shadow-lg transition-colors hover:bg-amber hover:text-ink"
                >
                  <X className="size-4" />
                </motion.button>

                {modal.modo === "crear" ? (
                  <TareaForm materias={materias} hoy={hoy} onCancelar={cerrar} onSuccess={cerrar} />
                ) : (
                  <EliminarTareaDialog key={modal.tarea.tarea_id} tarea={modal.tarea} onCancelar={cerrar} onSuccess={cerrar} />
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ---------- Confirmación de eliminar ---------- */

const estadoInicialEliminar: ActionStateType = { error: "", success: "" };

function EliminarTareaDialog({
  tarea,
  onCancelar,
  onSuccess,
}: {
  tarea: Tarea;
  onCancelar: () => void;
  onSuccess: () => void;
}) {
  const [state, formAction, isPending] = useActionState(deleteTareaAction, estadoInicialEliminar);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (state.success) {
      toast.success(state.success);
      onSuccess();
    }
    if (state.error) toast.error(state.error);
  }, [state, onSuccess]);

  return (
    <form action={formAction} className="rounded-3xl bg-white p-7 text-center shadow-2xl shadow-ink/20">
      <input type="hidden" name="tarea_id" value={tarea.tarea_id} />
      <input type="hidden" name="titulo" value={tarea.titulo} />

      <motion.div
        initial={reduceMotion ? false : { scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 14 }}
        className="mx-auto grid size-14 place-items-center rounded-2xl bg-red-50 text-red-600"
      >
        <AlertTriangle className="size-7" aria-hidden="true" />
      </motion.div>

      <h2 className="mt-4 font-display text-2xl font-bold text-ink">¿Eliminar esta tarea?</h2>
      <p className="mt-2 text-ink/65">
        Se eliminará <strong className="text-ink">“{tarea.titulo}”</strong>.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onCancelar}
          disabled={isPending}
          autoFocus
          className="rounded-xl border border-ink/15 px-4 py-3 font-semibold text-ink transition-colors hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-70"
        >
          {isPending && (
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              className="size-4 rounded-full border-2 border-white/40 border-t-white"
            />
          )}
          {isPending ? "Eliminando…" : "Eliminar"}
        </button>
      </div>
    </form>
  );
}

/* ---------- Píldora del resumen ---------- */

function Resumen({ icono, etiqueta, cantidad }: { icono: ReactNode; etiqueta: string; cantidad: number }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
      <span className="text-amber" aria-hidden="true">{icono}</span>
      <span className="text-sm text-cream/70">{etiqueta}</span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={cantidad}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          className="font-display font-bold text-cream"
        >
          {cantidad}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}