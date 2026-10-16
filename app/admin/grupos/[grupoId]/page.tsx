import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import GrupoDetalle from "@/components/grupos/GrupoDetalle";
import ErrorMessage from "@/components/ui/error-message";
import { grupoSchema, type Grupo } from "@/src/schemas/grupos";
import { materiasListadoSchema, type Materia } from "@/src/schemas/materias";
import { getAuthToken, getSessionUser } from "@/src/utils/auth-cookie";

type GrupoPageProps = {
  params: Promise<{ grupoId: string }>; // en Next 15/16 params es una Promise
};

type GrupoResult = { grupo: Grupo | null; error: string };
type MateriasResult = { materias: Materia[]; error: string };

async function getGrupo(token: string, grupoId: number): Promise<GrupoResult> {
  let req: Response;
  try {
    req = await fetch(`${process.env.API_URL}/api/v1/grupos/${grupoId}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "force-cache",
      // "grupos": se refresca al crear un grupo · "grupo-{id}": al invitar a alguien a ESTE grupo
      next: { tags: ["grupos", `grupo-${grupoId}`] },
    });
  } catch {
    return { grupo: null, error: "No se pudo conectar con el servidor." };
  }

  if (req.status === 401) redirect("/login");

  // El backend responde 404 si no existe O si no perteneces → la misma página 404
  if (req.status === 404) notFound();

  if (!req.ok) {
    return { grupo: null, error: "No pudimos cargar el grupo. Intenta de nuevo más tarde." };
  }

  const result = grupoSchema.safeParse(await req.json());
  if (!result.success) {
    return { grupo: null, error: "La respuesta del grupo no tiene el formato esperado." };
  }

  return { grupo: result.data, error: "" };
}

async function getMaterias(token: string): Promise<MateriasResult> {
  let req: Response;
  try {
    req = await fetch(`${process.env.API_URL}/api/v1/materias`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "force-cache",
      next: { tags: ["materias"] },
    });
  } catch {
    return { materias: [], error: "No se pudo conectar con el servidor." };
  }

  if (req.status === 401) redirect("/login");
  if (!req.ok) return { materias: [], error: "No pudimos cargar tus materias." };

  const result = materiasListadoSchema.safeParse(await req.json());
  if (!result.success) return { materias: [], error: "La respuesta de materias no tiene el formato esperado." };

  return { materias: result.data, error: "" };
}

export default async function GrupoPage({ params }: GrupoPageProps) {
  // 1. Validar el id de la URL: /admin/grupos/abc o /admin/grupos/-1 → 404
  const { grupoId } = await params;
  const id = Number(grupoId);
  if (!Number.isInteger(id) || id <= 0) notFound();

  // 2. Sesión
  const token = await getAuthToken();
  const usuario = await getSessionUser();
  if (!token || !usuario) redirect("/login");

  const usuarioId = Number(usuario.sub); // ← el mismo ajuste que en la página de grupos

  // 3. Grupo y materias en paralelo
  const [{ grupo, error: errorGrupo }, { materias }] = await Promise.all([
    getGrupo(token, id),
    getMaterias(token),
  ]);

  // Si materias falla no rompemos la página: solo perdemos el nombre de la materia
  const materia = grupo ? (materias.find((m) => m.materia_id === grupo.materia_id) ?? null) : null;

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <Link
        href="/admin/grupos"
        className="group mb-8 inline-flex items-center gap-2 text-sm font-medium text-ink/60 transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
        Mis grupos
      </Link>

      {errorGrupo || !grupo ? (
        <ErrorMessage>{errorGrupo || "No pudimos cargar el grupo."}</ErrorMessage>
      ) : (
        <GrupoDetalle grupo={grupo} materia={materia} usuarioId={usuarioId} />
      )}
    </main>
  );
}