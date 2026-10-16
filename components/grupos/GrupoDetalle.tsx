"use client";

import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount } from "@/components/ui/avatar";
import type { Grupo, Integrante } from "@/src/schemas/grupos";
import type { Materia } from "@/src/schemas/materias";
import { fechaHora, fechaLarga } from "@/src/utils/fechas";
import { BookOpen, CalendarDays, Crown, Hash, UserPlus, Users } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";
const MAX_AVATARES = 5;

const contenedor: Variants = {
  oculto: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const bloque: Variants = {
  oculto: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 24 } },
};

const lista: Variants = {
  oculto: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } },
};

const fila: Variants = {
  oculto: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

type GrupoDetalleProps = {
  grupo: Grupo;
  materia: Materia | null;
  usuarioId: number;
};

export default function GrupoDetalle({ grupo, materia, usuarioId }: GrupoDetalleProps) {
  const reduceMotion = useReducedMotion();

  const integrantes = [...grupo.integrantes].sort((a, b) => peso(a, usuarioId) - peso(b, usuarioId));
  const lider = integrantes.find((i) => i.rol === "lider");
  const soyLider = lider?.usuario_id === usuarioId;
  const total = integrantes.length;
  const visibles = integrantes.slice(0, MAX_AVATARES);
  const restantes = total - visibles.length;

  return (
    <motion.div
      variants={contenedor}
      initial={reduceMotion ? false : "oculto"}
      animate="visible"
      className="grid gap-6 lg:grid-cols-3"
    >
      {/* ---------- Cabecera ---------- */}
      <motion.section
        variants={bloque}
        className="relative overflow-hidden rounded-3xl bg-ink p-8 text-cream lg:col-span-3"
      >
        <Users className="pointer-events-none absolute -right-8 -bottom-10 size-56 text-cream/5" />

        <div className="relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-cream/10 px-3 py-1 text-xs font-medium text-cream/80">
                <BookOpen className="size-3.5 text-amber" />
                {materia ? materia.nombre : `Materia #${grupo.materia_id}`}
              </span>
              {soyLider ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber px-2.5 py-1 text-xs font-semibold text-ink">
                  <Crown className="size-3" strokeWidth={2.5} /> Eres el líder
                </span>
              ) : (
                <span className="rounded-full bg-cream/10 px-2.5 py-1 text-xs font-semibold text-cream/70">
                  Miembro
                </span>
              )}
            </div>

            <h1 className="mt-4 font-display text-4xl font-bold break-words md:text-5xl">{grupo.nombre}</h1>

            <motion.span
              initial={reduceMotion ? false : { width: 0 }}
              animate={{ width: 72 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 20 }}
              className="mt-4 block h-1 rounded-full bg-amber"
            />

            <p className="mt-4 flex items-center gap-2 text-sm text-cream/60">
              <CalendarDays className="size-4" />
              Creado el {fechaLarga(grupo.fecha_creacion)}
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 md:items-end">
            <AvatarGroup size="lg">
              {visibles.map((integrante) => (
                <Avatar key={integrante.usuario_id} title={etiqueta(integrante, usuarioId)}>
                  <AvatarFallback seed={integrante.usuario_id}>{iniciales(integrante, usuarioId)}</AvatarFallback>
                  {integrante.rol === "lider" && (
                    <AvatarBadge label="Líder">
                      <Crown className="size-3" strokeWidth={2.5} />
                    </AvatarBadge>
                  )}
                </Avatar>
              ))}
              {restantes > 0 && <AvatarGroupCount>+{restantes}</AvatarGroupCount>}
            </AvatarGroup>

            {/* Lugar reservado: se activa con el endpoint de invitar por correo */}
            {soyLider && (
              <button
                type="button"
                disabled
                title="Disponible muy pronto"
                className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-cream/20 px-4 py-2 text-sm font-semibold text-cream/50"
              >
                <UserPlus className="size-4" />
                Invitar · pronto
              </button>
            )}
          </div>
        </div>
      </motion.section>

      {/* ---------- Integrantes ---------- */}
      <motion.section variants={bloque} className="rounded-3xl bg-white p-7 shadow-sm shadow-ink/5 lg:col-span-2">
        <div className="mb-5 flex items-baseline justify-between">
          <h2 className="font-display text-2xl font-bold text-ink">Integrantes</h2>
          <span className="font-mono text-sm text-ink/40">{total}</span>
        </div>

        <motion.ul variants={lista} className="divide-y divide-ink/5">
          {integrantes.map((integrante) => {
            const soyYo = integrante.usuario_id === usuarioId;
            return (
              <motion.li
                key={integrante.usuario_id}
                variants={fila}
                className="flex items-center gap-4 py-3.5"
              >
                <Avatar>
                  <AvatarFallback seed={integrante.usuario_id}>{iniciales(integrante, usuarioId)}</AvatarFallback>
                  {integrante.rol === "lider" && (
                    <AvatarBadge label="Líder">
                      <Crown className="size-2.5" strokeWidth={2.5} />
                    </AvatarBadge>
                  )}
                </Avatar>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-ink">
                    {etiqueta(integrante, usuarioId)}
                    {soyYo && <span className="ml-2 text-xs font-normal text-ink/40">(tú)</span>}
                  </p>
                  <p className="text-xs text-ink/50">
                    Se unió el {fechaHora(integrante.unido_en)}
                  </p>
                </div>

                {integrante.rol === "lider" ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber px-2.5 py-1 text-xs font-semibold text-ink">
                    <Crown className="size-3" strokeWidth={2.5} /> Líder
                  </span>
                ) : (
                  <span className="rounded-full bg-ink/5 px-2.5 py-1 text-xs font-semibold text-ink/60">Miembro</span>
                )}
              </motion.li>
            );
          })}
        </motion.ul>

        {total === 1 && (
          <p className="mt-4 rounded-2xl bg-cream/60 px-4 py-3 text-sm text-ink/60">
            {soyLider
              ? "Por ahora estás solo. Muy pronto podrás invitar a tus compañeros por correo."
              : "Este grupo todavía no tiene más integrantes."}
          </p>
        )}
      </motion.section>

      {/* ---------- Información ---------- */}
      <motion.aside variants={bloque} className="h-fit rounded-3xl bg-white p-7 shadow-sm shadow-ink/5">
        <h2 className="font-display text-2xl font-bold text-ink">Información</h2>

        <dl className="mt-5 space-y-4 text-sm">
          <Dato icono={<BookOpen className="size-4" />} titulo="Materia">
            {materia ? materia.nombre : `Materia #${grupo.materia_id}`}
            {materia && <span className="block font-mono text-xs text-ink/40">NRC {materia.nrc}</span>}
          </Dato>
          <Dato icono={<Crown className="size-4" />} titulo="Líder">
            {lider ? etiqueta(lider, usuarioId) : "—"}
          </Dato>
          <Dato icono={<CalendarDays className="size-4" />} titulo="Creado">
            {fechaHora(grupo.fecha_creacion)}
          </Dato>
          <Dato icono={<Hash className="size-4" />} titulo="ID del grupo">
            <span className="font-mono">{grupo.grupo_id}</span>
          </Dato>
        </dl>
      </motion.aside>
    </motion.div>
  );
}

/* ---------- Auxiliares ---------- */

function Dato({ icono, titulo, children }: { icono: React.ReactNode; titulo: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-ink text-amber">{icono}</span>
      <div className="min-w-0">
        <dt className="text-xs uppercase tracking-wider text-ink/40">{titulo}</dt>
        <dd className="font-semibold text-ink">{children}</dd>
      </div>
    </div>
  );
}

// Hoy grupos solo conoce el usuario_id; con la invitación por correo cambiaremos esto por nombre/correo
function etiqueta(integrante: Integrante, usuarioId: number) {
  return integrante.usuario_id === usuarioId ? "Tú" : `Usuario #${integrante.usuario_id}`;
}

function iniciales(integrante: Integrante, usuarioId: number) {
  return integrante.usuario_id === usuarioId ? "Tú" : `#${integrante.usuario_id}`;
}

function peso(integrante: Integrante, usuarioId: number) {
  if (integrante.rol === "lider") return 0;
  if (integrante.usuario_id === usuarioId) return 1;
  return 2;
}