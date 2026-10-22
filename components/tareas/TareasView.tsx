"use client";

import TareaForm, { type TareaDraft } from "@/components/tareas/TareaForm";
import TareasList from "@/components/tareas/TareasList";
import type { Tarea } from "@/src/schemas/tareas";
import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle, CheckCircle2, Circle, Clock3, ListTodo, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

type Filtro = "todas" | Tarea["estado"];

type MateriaOption = {
  materia_id: number;
  nombre: string;
};

type TareasViewProps = {
  tareas: Tarea[];
  materias: MateriaOption[];
  usuarioId: number;
};

const filtros: { valor: Filtro; etiqueta: string }[] = [
  { valor: "todas", etiqueta: "Todas" },
  { valor: "pendiente", etiqueta: "Pendientes" },
  { valor: "en_progreso", etiqueta: "En progreso" },
  { valor: "completada", etiqueta: "Completadas" },
  { valor: "cancelada", etiqueta: "Canceladas" },
];

type Modal = { modo: "crear" } | { modo: "editar"; tarea: Tarea } | { modo: "eliminar"; tarea: Tarea } | null;

export default function TareasView({ tareas: tareasIniciales, materias, usuarioId }: TareasViewProps) {
  const [tareas, setTareas] = useState(tareasIniciales);
  const [modal, setModal] = useState<Modal>(null);
  const [filtro, setFiltro] = useState<Filtro>("todas");
  const cerrar = useCallback(() => setModal(null), []);
  const nombresMaterias = useMemo(
    () => new Map(materias.map((materia) => [materia.materia_id, materia.nombre])),
    [materias],
  );
  const tareasFiltradas = useMemo(
    () => (filtro === "todas" ? tareas : tareas.filter((tarea) => tarea.estado === filtro)),
    [filtro, tareas],
  );
  const pendientes = tareas.filter((tarea) => tarea.estado === "pendiente").length;
  const enProgreso = tareas.filter((tarea) => tarea.estado === "en_progreso").length;
  const completadas = tareas.filter((tarea) => tarea.estado === "completada").length;
  const abierto = modal !== null;

  useEffect(() => {
    if (!abierto) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") cerrar();
    }

    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [abierto, cerrar]);

  function guardar(datos: TareaDraft) {
    const ahora = fechaHoraActual();

    if (modal?.modo === "editar") {
      setTareas((actuales) =>
        actuales.map((tarea) =>
          tarea.tarea_id === modal.tarea.tarea_id ? { ...tarea, ...datos, fecha_actualizacion: ahora } : tarea,
        ),
      );
    } else {
      setTareas((actuales) => [
        {
          ...datos,
          tarea_id: actuales.reduce((maximo, tarea) => Math.max(maximo, tarea.tarea_id), 0) + 1,
          usuario_id: usuarioId,
          estado: "pendiente",
          fecha_creacion: ahora,
          fecha_actualizacion: ahora,
        },
        ...actuales,
      ]);
    }

    cerrar();
  }

  function cambiarEstado(tarea: Tarea, estado: Tarea["estado"]) {
    setTareas((actuales) =>
      actuales.map((actual) =>
        actual.tarea_id === tarea.tarea_id
          ? { ...actual, estado, fecha_actualizacion: fechaHoraActual() }
          : actual,
      ),
    );
  }

  function eliminar(tarea: Tarea) {
    setTareas((actuales) => actuales.filter((actual) => actual.tarea_id !== tarea.tarea_id));
    cerrar();
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-5 rounded-3xl bg-ink p-6 text-cream shadow-xl shadow-ink/10 sm:p-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2 text-amber">
            <ListTodo className="size-5" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">Organiza tu estudio</span>
          </div>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Mis tareas</h2>
          <p className="mt-2 max-w-xl text-sm text-cream/65">
            Revisa tus entregas y avanza una tarea a la vez.
          </p>
        </div>

        <div className="flex flex-wrap gap-2" aria-label="Resumen de tareas">
          <Resumen icono={<Circle className="size-4" />} etiqueta="Pendientes" cantidad={pendientes} />
          <Resumen icono={<Clock3 className="size-4" />} etiqueta="En progreso" cantidad={enProgreso} />
          <Resumen icono={<CheckCircle2 className="size-4" />} etiqueta="Completadas" cantidad={completadas} />
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Filtrar tareas">
          {filtros.map((opcion) => {
            const seleccionado = filtro === opcion.valor;

            return (
              <button
                key={opcion.valor}
                type="button"
                onClick={() => setFiltro(opcion.valor)}
                aria-pressed={seleccionado}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 ${
                  seleccionado
                    ? "bg-ink text-cream shadow-md shadow-ink/15"
                    : "bg-white text-ink/60 ring-1 ring-ink/10 hover:bg-cream hover:text-ink"
                }`}
              >
                {opcion.etiqueta}
              </button>
            );
          })}
        </div>

        {materias.length > 0 ? (
          <button
            type="button"
            onClick={() => setModal({ modo: "crear" })}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-amber px-5 py-3 font-bold text-ink shadow-lg shadow-amber/20 transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2"
          >
            <span aria-hidden="true" className="text-xl leading-none">+</span>
            Nueva tarea
          </button>
        ) : (
          <p className="text-sm font-medium text-ink/55">Primero crea una materia para asignar tus tareas.</p>
        )}
      </div>

      <TareasList
        tareas={tareasFiltradas}
        nombresMaterias={nombresMaterias}
        onCrear={filtro === "todas" && materias.length > 0 ? () => setModal({ modo: "crear" }) : undefined}
        onEditar={(tarea) => setModal({ modo: "editar", tarea })}
        onEliminar={(tarea) => setModal({ modo: "eliminar", tarea })}
        onCambiarEstado={cambiarEstado}
        mensajeVacio={filtro === "todas" ? undefined : "No hay tareas en este filtro."}
      />

      <AnimatePresence>
        {modal && (
          <motion.div
            key="tareas-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={cerrar}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ink/60 p-4 backdrop-blur-sm"
          >
            <motion.div
              role={modal.modo === "eliminar" ? "alertdialog" : "dialog"}
              aria-modal="true"
              aria-labelledby={modal.modo === "eliminar" ? "eliminar-tarea-title" : "tarea-form-title"}
              onClick={(event) => event.stopPropagation()}
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 8 }}
              className="relative my-auto w-full max-w-lg"
            >
              <button
                type="button"
                onClick={cerrar}
                aria-label="Cerrar"
                className="absolute -right-2 -top-2 z-10 grid size-9 place-items-center rounded-full bg-ink text-cream shadow-lg transition-colors hover:bg-amber hover:text-ink"
              >
                <X className="size-4" />
              </button>

              {modal.modo !== "eliminar" ? (
                <TareaForm
                  key={modal.modo === "editar" ? `editar-${modal.tarea.tarea_id}` : "crear"}
                  tarea={modal.modo === "editar" ? modal.tarea : undefined}
                  materias={materias}
                  onCancelar={cerrar}
                  onGuardar={guardar}
                />
              ) : (
                <div className="rounded-3xl bg-white p-7 shadow-2xl shadow-ink/20">
                  <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-rose-50 text-rose-600">
                    <AlertTriangle className="size-7" aria-hidden="true" />
                  </div>
                  <h2 id="eliminar-tarea-title" className="mt-4 text-center font-display text-2xl font-bold text-ink">
                    ¿Eliminar esta tarea?
                  </h2>
                  <p className="mt-2 text-center text-ink/65">
                    Se eliminará <strong className="text-ink">{modal.tarea.titulo}</strong>. Esta acción no se puede deshacer.
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={cerrar}
                      className="rounded-xl border border-ink/15 px-4 py-3 font-semibold text-ink hover:bg-cream"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => eliminar(modal.tarea)}
                      className="rounded-xl bg-rose-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-rose-700"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Resumen({
  icono,
  etiqueta,
  cantidad,
}: {
  icono: ReactNode;
  etiqueta: string;
  cantidad: number;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
      <span className="text-amber" aria-hidden="true">{icono}</span>
      <span className="text-sm text-cream/70">{etiqueta}</span>
      <span className="font-display font-bold text-cream">{cantidad}</span>
    </div>
  );
}

function fechaHoraActual() {
  const ahora = new Date();
  const fecha = [
    ahora.getFullYear(),
    String(ahora.getMonth() + 1).padStart(2, "0"),
    String(ahora.getDate()).padStart(2, "0"),
  ].join("-");
  const hora = [
    String(ahora.getHours()).padStart(2, "0"),
    String(ahora.getMinutes()).padStart(2, "0"),
    String(ahora.getSeconds()).padStart(2, "0"),
  ].join(":");
  return `${fecha}T${hora}`;
}
