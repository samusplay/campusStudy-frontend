"use client";

import type { Tarea } from "@/src/schemas/tareas";
import { useState, type FormEvent } from "react";

export type TareaDraft = Pick<
  Tarea,
  "titulo" | "descripcion" | "materia_id" | "fecha_entrega" | "hora_entrega" | "prioridad"
>;

type MateriaOption = {
  materia_id: number;
  nombre: string;
};

type TareaFormProps = {
  tarea?: Tarea;
  materias: MateriaOption[];
  onCancelar: () => void;
  onGuardar: (datos: TareaDraft) => void;
};

export default function TareaForm({ tarea, materias, onCancelar, onGuardar }: TareaFormProps) {
  const [titulo, setTitulo] = useState(tarea?.titulo ?? "");
  const [descripcion, setDescripcion] = useState(tarea?.descripcion ?? "");
  const [materiaId, setMateriaId] = useState(String(tarea?.materia_id ?? materias[0]?.materia_id ?? ""));
  const [fechaEntrega, setFechaEntrega] = useState(tarea?.fecha_entrega ?? "");
  const [horaEntrega, setHoraEntrega] = useState(tarea?.hora_entrega ?? "");
  const [prioridad, setPrioridad] = useState<Tarea["prioridad"]>(tarea?.prioridad ?? "media");

  function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onGuardar({
      titulo: titulo.trim(),
      descripcion: descripcion.trim() || undefined,
      materia_id: Number(materiaId),
      fecha_entrega: fechaEntrega,
      hora_entrega: horaEntrega || undefined,
      prioridad,
    });
  }

  return (
    <form onSubmit={enviar} className="rounded-3xl bg-white p-6 shadow-2xl shadow-ink/20 sm:p-8">
      <div className="mb-6">
        <h2 id="tarea-form-title" className="font-display text-2xl font-bold text-ink">
          {tarea ? "Editar tarea" : "Nueva tarea"}
        </h2>
        <span className="mt-2 block h-1 w-14 rounded-full bg-amber" />
        <p className="mt-3 text-sm text-ink/55">Completa los datos de tu entrega.</p>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-semibold text-ink">
          Título
          <input
            required
            autoFocus
            maxLength={150}
            value={titulo}
            onChange={(event) => setTitulo(event.target.value)}
            placeholder="Ej: Entregar proyecto final"
            className={claseInput}
          />
        </label>

        <label className="block text-sm font-semibold text-ink">
          Materia
          <select
            required
            value={materiaId}
            onChange={(event) => setMateriaId(event.target.value)}
            className={claseInput}
          >
            {materias.map((materia) => (
              <option key={materia.materia_id} value={materia.materia_id}>
                {materia.nombre}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-semibold text-ink">
          Descripción <span className="font-normal text-ink/45">(opcional)</span>
          <textarea
            maxLength={1000}
            rows={3}
            value={descripcion}
            onChange={(event) => setDescripcion(event.target.value)}
            placeholder="Agrega detalles que te ayuden a recordar la tarea"
            className={`${claseInput} resize-y`}
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-ink">
            Fecha de entrega
            <input
              required
              type="date"
              value={fechaEntrega}
              onChange={(event) => setFechaEntrega(event.target.value)}
              className={claseInput}
            />
          </label>
          <label className="block text-sm font-semibold text-ink">
            Hora <span className="font-normal text-ink/45">(opcional)</span>
            <input
              type="time"
              value={horaEntrega}
              onChange={(event) => setHoraEntrega(event.target.value)}
              className={claseInput}
            />
          </label>
        </div>

        <label className="block text-sm font-semibold text-ink">
          Prioridad
          <select
            value={prioridad ?? "media"}
            onChange={(event) => setPrioridad(event.target.value as NonNullable<Tarea["prioridad"]>)}
            className={claseInput}
          >
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>
        </label>
      </div>

      <div className="mt-7 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onCancelar}
          className="rounded-xl border border-ink/15 px-4 py-3 font-semibold text-ink transition-colors hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="rounded-xl bg-ink px-4 py-3 font-semibold text-cream transition-colors hover:bg-amber hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2"
        >
          {tarea ? "Guardar cambios" : "Crear tarea"}
        </button>
      </div>
    </form>
  );
}

const claseInput =
  "mt-1.5 block w-full rounded-xl border border-ink/15 bg-white px-3.5 py-3 font-normal text-ink outline-none transition focus:border-amber focus:ring-2 focus:ring-amber/25";
