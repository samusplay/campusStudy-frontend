import MateriasView from "@/components/materias/MateriasView";
import { redirect } from "next/navigation";

import ErrorMessage from "@/components/ui/error-message";
import { materiasListadoSchema, type Materia } from "@/src/schemas/materias";
import { getAuthToken } from "@/src/utils/auth-cookie";

type MateriasResult = { materias: Materia[]; error: string };

async function getMaterias(): Promise<MateriasResult> {
  // 1. Token de la cookie (sin sesión → login)
  const token = await getAuthToken();
  if (!token) redirect("/login");

  // 2. GET al gateway con caché etiquetado
  const url = `${process.env.API_URL}/api/v1/materias`;

  let req: Response;
  try {
    req = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "force-cache",
      next: { tags: ["materias"] }, // createMateriaAction lo invalida con updateTag("materias")
    });
  } catch {
    return { materias: [], error: "No se pudo conectar con el servidor." };
  }

  // Token vencido o inválido → login
  if (req.status === 401) redirect("/login");

  if (!req.ok) {
    return { materias: [], error: "No pudimos cargar tus materias. Intenta de nuevo más tarde." };
  }

  // 3. Validar la respuesta contra el contrato
  const result = materiasListadoSchema.safeParse(await req.json());
  if (!result.success) {
    return { materias: [], error: "La respuesta del servidor no tiene el formato esperado." };
  }

  return { materias: result.data, error: "" };
}

export default async function MateriasPage() {
  const { materias, error } = await getMaterias();

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <header className="mb-10">
        <h1 className="font-display text-4xl font-bold text-ink">Mis materias</h1>
        <p className="mt-2 text-ink/60">
          Crea tus materias y organiza en ellas tus grupos y tareas.
        </p>
      </header>

      {error ? <ErrorMessage>{error}</ErrorMessage> : <MateriasView materias={materias} />}
    </main>
  );
}