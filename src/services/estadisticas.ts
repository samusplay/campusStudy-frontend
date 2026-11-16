import {
    estadisticasGrupoSchema,
    estadisticasMateriaSchema,
    estadisticasUsuarioSchema,
} from "@/src/schemas/estadisticas";
import { redirect } from "next/navigation";
import type { z } from "zod";

export type Resultado<T> = { datos: T | null; error: string };

// Lo común a las tres lecturas: fetch → estado → validación con Zod
async function pedir<T>(ruta: string, token: string, schema: z.ZodType<T>, que: string): Promise<Resultado<T>> {
  let req: Response;
  try {
    req = await fetch(`${process.env.API_URL}/api/v1/estadisticas${ruta}`, {
      headers: { Authorization: `Bearer ${token}` },
      // Cambian cuando tareas publica eventos: las actions de tareas la invalidan con updateTag("estadisticas").
      // Los 60 s son la red de seguridad (ej. una tarea que se vence a medianoche).
      next: { tags: ["estadisticas"], revalidate: 60 },
    });
  } catch {
    return { datos: null, error: "No se pudo conectar con el servidor." };
  }

  if (req.status === 401) redirect("/login");
  if (req.status === 404) return { datos: null, error: `No encontramos ${que}.` };
  if (!req.ok) return { datos: null, error: `No pudimos cargar ${que}.` };

  const result = schema.safeParse(await req.json());
  if (!result.success) return { datos: null, error: `La respuesta de ${que} no tiene el formato esperado.` };

  return { datos: result.data, error: "" };
}

/** GET /estadisticas/me — todo el historial, o solo un mes si viene `periodo` ("2026-11") */
export function obtenerMisEstadisticas(token: string, periodo?: string) {
  const query = periodo ? `?${new URLSearchParams({ periodo })}` : "";
  return pedir(`/me${query}`, token, estadisticasUsuarioSchema, "tus estadísticas");
}

/** GET /estadisticas/materia/{id} — solo si la materia es tuya o de uno de tus grupos (si no, 404) */
export function obtenerEstadisticasMateria(token: string, materiaId: number, periodo?: string) {
  const query = periodo ? `?${new URLSearchParams({ periodo })}` : "";
  return pedir(`/materia/${materiaId}${query}`, token, estadisticasMateriaSchema, "esa materia");
}

/** GET /estadisticas/grupo/{id} — solo si eres integrante (si no, 404) */
export function obtenerEstadisticasGrupo(token: string, grupoId: number) {
  return pedir(`/grupo/${grupoId}`, token, estadisticasGrupoSchema, "ese grupo");
}