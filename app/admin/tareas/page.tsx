import TareasView from "@/components/tareas/TareasView";
import ErrorMessage from "@/components/ui/error-message";
import { materiasListadoSchema, type Materia } from "@/src/schemas/materias";
import { getAuthToken, getSessionUser } from "@/src/utils/auth-cookie";
import { redirect } from "next/navigation";

type MateriasResult = { materias: Materia[]; error: string };

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
  if (!req.ok) return { materias: [], error: "No pudimos cargar tus materias. Intenta de nuevo más tarde." };

  const result = materiasListadoSchema.safeParse(await req.json());
  if (!result.success) return { materias: [], error: "La respuesta de materias no tiene el formato esperado." };

  return { materias: result.data, error: "" };
}

export default async function TareasPage() {
  const token = await getAuthToken();
  const usuario = await getSessionUser();
  if (!token || !usuario) redirect("/login");

  const usuarioId = Number(usuario.sub);
  if (!Number.isSafeInteger(usuarioId) || usuarioId <= 0) redirect("/login");

  const { materias, error } = await getMaterias(token);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <header className="mb-10">
        <h1 className="font-display text-4xl font-bold text-ink">Mis tareas</h1>
        <p className="mt-2 text-ink/60">Organiza tus entregas y mantén el control de tus pendientes.</p>
      </header>
      {error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : (
        <TareasView tareas={[]} materias={materias} usuarioId={usuarioId} />
      )}
    </main>
  );
}