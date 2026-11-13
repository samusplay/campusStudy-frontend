import { Calendario } from "@/components/calendario";
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
      next: { tags: ["tareas"] }, // la MISMA caché que la página de tareas
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

export default async function CalendarioPage() {
  const token = await getAuthToken();
  if (!token) redirect("/login");

  const [{ tareas, error: errorTareas }, { materias, error: errorMaterias }] = await Promise.all([
    getTareas(token),
    getMaterias(token),
  ]);

  // Si materias falla, el calendario igual funciona: muestra "Materia #id"
  if (errorTareas) {
    return (
      <main className="mx-auto w-full max-w-7xl px-6 py-10">
        <ErrorMessage>{errorTareas}</ErrorMessage>
      </main>
    );
  }

  const nombresMaterias = Object.fromEntries(materias.map((m) => [m.materia_id, m.nombre]));

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-10">
      <Calendario tareas={tareas} nombresMaterias={nombresMaterias} hoy={hoyColombia()} />
      {errorMaterias && <p className="mt-4 text-sm text-ink/50">{errorMaterias}</p>}
    </main>
  );
}