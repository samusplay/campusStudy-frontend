"use client";

import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount } from "@/components/ui/avatar";
import type { Grupo, Integrante } from "@/src/schemas/grupos";
import type { Materia } from "@/src/schemas/materias";
import { ArrowUpRight, BookOpen, Crown, Plus, Users } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import Link from "next/link";
import { useMemo } from "react";

const MAX_AVATARES = 4;

const fecha = new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short", year: "numeric" });

const tarjetaVariants: Variants = {
  oculto: { opacity: 0, y: 16, scale: 0.97 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 24, delay: index * 0.05 },
  }),
  salir: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
};

type GruposListProps = {
  grupos: Grupo[];
  materias: Materia[];
  usuarioId: number;
  onCrear: () => void;
};

export default function GruposList({ grupos, materias, usuarioId, onCrear }: GruposListProps) {
  const reduceMotion = useReducedMotion();

  // materia_id → nombre, para no buscar en el arreglo en cada tarjeta
  const nombresMaterias = useMemo(
    () => new Map(materias.map((m) => [m.materia_id, m.nombre])),
    [materias],
  );

  /* ---------- Estado vacío ---------- */
  if (grupos.length === 0) {
    const sinMaterias = materias.length === 0;

    return (
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center rounded-3xl border-2 border-dashed border-ink/15 px-6 py-16 text-center"
      >
        <motion.span
          animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="grid size-16 place-items-center rounded-2xl bg-ink text-amber shadow-lg shadow-ink/20"
        >
          <Users className="size-8" />
        </motion.span>

        <h2 className="mt-6 font-display text-2xl font-bold text-ink">
          {sinMaterias ? "Primero crea una materia" : "Crea tu primer grupo"}
        </h2>
        <p className="mt-2 max-w-sm text-ink/60">
          {sinMaterias
            ? "Los grupos viven dentro de tus materias. Crea una y vuelve aquí."
            : "Aquí aparecerán los grupos que crees y a los que te inviten."}
        </p>

        {sinMaterias ? (
          <Link
            href="/admin/materias"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 font-semibold text-cream transition-colors hover:bg-ink-soft"
          >
            <BookOpen className="size-4" /> Ir a materias
          </Link>
        ) : (
          <motion.button
            type="button"
            onClick={onCrear}
            whileHover={reduceMotion ? undefined : { scale: 1.03 }}
            whileTap={reduceMotion ? undefined : { scale: 0.97 }}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 font-semibold text-cream"
          >
            <Plus className="size-4" /> Crear grupo
          </motion.button>
        )}
      </motion.div>
    );
  }

  /* ---------- Lista ---------- */
  return (
    <motion.ul layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence>
        {grupos.map((grupo, index) => (
          <motion.li
            key={grupo.grupo_id}
            layout
            custom={index}
            variants={tarjetaVariants}
            initial={reduceMotion ? false : "oculto"}
            animate="visible"
            exit="salir"
          >
            <GrupoCard
              grupo={grupo}
              materiaNombre={nombresMaterias.get(grupo.materia_id) ?? `Materia #${grupo.materia_id}`}
              usuarioId={usuarioId}
            />
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ul>
  );
}

/* ---------- Tarjeta ---------- */

type GrupoCardProps = {
  grupo: Grupo;
  materiaNombre: string;
  usuarioId: number;
};

function GrupoCard({ grupo, materiaNombre, usuarioId }: GrupoCardProps) {
  const reduceMotion = useReducedMotion();
  const miRol = grupo.integrantes.find((i) => i.usuario_id === usuarioId)?.rol ?? "miembro";

  // Líder primero, luego tú, luego el resto
  const ordenados = [...grupo.integrantes].sort((a, b) => peso(a, usuarioId) - peso(b, usuarioId));
  const visibles = ordenados.slice(0, MAX_AVATARES);
  const restantes = ordenados.length - visibles.length;
  const total = grupo.integrantes.length;

  return (
    <motion.div
      whileHover={reduceMotion ? undefined : { y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group h-full"
    >
      <Link
        href={`/admin/grupos/${grupo.grupo_id}`}
        className="relative flex h-full flex-col rounded-3xl bg-white p-6 shadow-sm shadow-ink/5 transition-shadow hover:shadow-xl hover:shadow-ink/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
      >
        {/* Flecha que se desplaza al pasar el mouse */}
        <span className="absolute top-6 right-6 text-ink/25 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-amber">
          <ArrowUpRight className="size-5" />
        </span>

        {/* Materia + mi rol */}
        <div className="flex flex-wrap items-center gap-2 pr-8">
          <span className="inline-flex max-w-full items-center gap-1.5 truncate rounded-full bg-cream px-3 py-1 text-xs font-medium text-ink/70">
            <BookOpen className="size-3.5 shrink-0 text-ink" />
            <span className="truncate">{materiaNombre}</span>
          </span>
          {miRol === "lider" ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber px-2.5 py-1 text-xs font-semibold text-ink">
              <Crown className="size-3" strokeWidth={2.5} /> Líder
            </span>
          ) : (
            <span className="rounded-full bg-ink/5 px-2.5 py-1 text-xs font-semibold text-ink/60">Miembro</span>
          )}
        </div>

        {/* Nombre */}
        <h3 className="mt-4 line-clamp-2 font-display text-xl font-bold text-ink">{grupo.nombre}</h3>

        {/* Integrantes */}
        <div className="mt-auto flex items-end justify-between gap-3 pt-6">
          <AvatarGroup size="sm">
            {visibles.map((integrante) => (
              <Avatar
                key={integrante.usuario_id}
                title={integrante.usuario_id === usuarioId ? "Tú" : `Usuario #${integrante.usuario_id}`}
              >
                <AvatarFallback seed={integrante.usuario_id}>
                  {integrante.usuario_id === usuarioId ? "Tú" : `#${integrante.usuario_id}`}
                </AvatarFallback>
                {integrante.rol === "lider" && (
                  <AvatarBadge label="Líder">
                    <Crown className="size-2" strokeWidth={3} />
                  </AvatarBadge>
                )}
              </Avatar>
            ))}
            {restantes > 0 && <AvatarGroupCount>+{restantes}</AvatarGroupCount>}
          </AvatarGroup>

          <div className="text-right text-xs leading-tight">
            <p className="font-semibold text-ink/70">
              {total} {total === 1 ? "integrante" : "integrantes"}
            </p>
            <p className="text-ink/40">{fecha.format(new Date(grupo.fecha_creacion))}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function peso(integrante: Integrante, usuarioId: number) {
  if (integrante.rol === "lider") return 0;
  if (integrante.usuario_id === usuarioId) return 1;
  return 2;
}