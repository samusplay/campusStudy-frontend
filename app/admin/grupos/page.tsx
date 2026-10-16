import GruposView from "@/components/grupos/GruposView";
import { redirect } from "next/navigation";

import ErrorMessage from "@/components/ui/error-message";
import { gruposListadoSchema, type Grupo } from "@/src/schemas/grupos";
import { materiasListadoSchema, type Materia } from "@/src/schemas/materias";
import { getAuthToken, getSessionUser } from "@/src/utils/auth-cookie";

type GruposResult = { grupos: Grupo[]; error: string };
type MateriasResult = { materias: Materia[]; error: string };

async function getGrupos(token: string): Promise<GruposResult> {
  let req: Response;
  try {
    req = await fetch(`${process.env.API_URL}/api/v1/grupos`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "force-cache",
      next: { tags: ["grupos"] }, // createGrupoAction lo invalida con updateTag("grupos")
    });
  } catch {
    return { grupos: [], error: "No se pudo conectar con el servidor." };
  }

  if (req.status === 401) redirect("/login");

  if (!req.ok) {
    return { grupos: [], error: "No pudimos cargar tus grupos. Intenta de nuevo más tarde." };
  }

  const result = gruposListadoSchema.safeParse(await req.json());
  if (!result.success) {
    return { grupos: [], error: "La respuesta de grupos no tiene el formato esperado." };
  }

  return { grupos: result.data, error: "" };
}

async function getMaterias(token: string): Promise<MateriasResult> {
  let req: Response;
  try {
    req = await fetch(`${process.env.API_URL}/api/v1/materias`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "force-cache",
      next: { tags: ["materias"] }, // la misma caché que usa la página de materias
    });
  } catch {
    return { materias: [], error: "No se pudo conectar con el servidor." };
  }

  if (req.status === 401) redirect("/login");

  if (!req.ok) {
    return { materias: [], error: "No pudimos cargar tus materias. Intenta de nuevo más tarde." };
  }

  const result = materiasListadoSchema.safeParse(await req.json());
  if (!result.success) {
    return { materias: [], error: "La respuesta de materias no tiene el formato esperado." };
  }

  return { materias: result.data, error: "" };
}

export default async function GruposPage() {
  // 1. Sesión: token para el gateway + usuario para saber quién es "Tú"
  const token = await getAuthToken();
  const usuario = await getSessionUser();
  if (!token || !usuario) redirect("/login");

  const usuarioId = Number(usuario.sub); // ← ajusta al campo que devuelve tu getSessionUser

  // 2. Grupos y materias EN PARALELO (no uno después del otro)
  const [{ grupos, error: errorGrupos }, { materias, error: errorMaterias }] = await Promise.all([
    getGrupos(token),
    getMaterias(token),
  ]);

  const error = errorGrupos || errorMaterias;

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <header className="mb-10">
        <h1 className="font-display text-4xl font-bold text-ink">Mis grupos</h1>
        <p className="mt-2 text-ink/60">
          Organízate con tus compañeros: crea grupos dentro de tus materias.
        </p>
      </header>

      {error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : (
        <GruposView grupos={grupos} materias={materias} usuarioId={usuarioId} />
      )}
    </main>
  );
}