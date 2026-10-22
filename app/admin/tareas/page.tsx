
import TareasView from "@/components/tareas/TareasView";
import ErrorMessage from "@/components/ui/error-message";
import { materiasListadoSchema, type Materia } from "@/src/schemas/materias";
import { tareasListadoSchema, type Tarea } from "@/src/schemas/tareas";
import { getAuthToken } from "@/src/utils/auth-cookie";
import { hoyColombia } from "@/src/utils/fechas";

import { redirect } from "next/navigation";

type TareasResult = { tareas: Tarea[]; error: string };
type MateriasResult = { materias: Materia[]; error: string };

async function getTareas(token: string): Promise<TareasResult> {
  let req: Response;
  try {
    req = await fetch(`${process.env.API_URL}/api/v1/tareas`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "force-cache",
      next: { tags: ["tareas"] }, // las 3 actions lo invalidan con updateTag("tareas")
    });
  } catch {
    return { tareas: [], error: "No se pudo conectar con el servidor." };
  }

  if (req.status === 401) redirect("/login");
  if (!req.ok) return { tareas: [], error: "No pudimos cargar tus tareas. Intenta de nuevo más tarde." };

  const result = tareasListadoSchema.safeParse(await req.json());
  if (!result.success) return { tareas: [], error: "La respuesta de tareas no tiene el formato esperado." };

  return { tareas: result.data, error: "" };
}

async function getMaterias(token: string): Promise<MateriasResult> {
  let req: Response;
  try {
    req = await fetch(`${process.env.API_URL}/api/v1/materias`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "force-cache",
      next: { tags: ["materias"] }, // la misma caché de la página de materias
    });
  } catch {
    return { materias: [], error: "No se pudo conectar con el servidor." };
  }

  if (req.status === 401) redirect("/login");
  if (!req.ok) return { materias: [], error: "No pudimos cargar tus materias. Intenta de nuevo más tarde." };

  const result = materiasListadoSchema.safeParse(await req.json());
  if (!result.success) return { materias: [], error: "La respuesta de materias no tiene el formato esperado." };

  return { materias: result.data, error: "" };
}

export default async function TareasPage() {
  // 1. Sesión
  const token = await getAuthToken();
  if (!token) redirect("/login");

  // 2. Tareas y materias EN PARALELO
  const [{ tareas, error: errorTareas }, { materias, error: errorMaterias }] = await Promise.all([
    getTareas(token),
    getMaterias(token),
  ]);

  const error = errorTareas || errorMaterias;

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      {error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : (
        <TareasView tareas={tareas} materias={materias} hoy={hoyColombia()} />
      )}
    </main>
  );
}