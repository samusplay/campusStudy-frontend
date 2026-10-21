"use server";

import { apiErrorSchema, gatewayErrorSchema } from "@/src/schemas/auth";
import { editarMateriaInputSchema } from "@/src/schemas/materias";
import { getAuthToken } from "@/src/utils/auth-cookie";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";

type ActionStateType = {
  errors: string[];
  fieldErrors: Record<string, string[]>;
  success: string;
};

// Para borrar solo necesitamos el id: reutilizamos la regla de editar
const eliminarMateriaInputSchema = editarMateriaInputSchema.pick({ materia_id: true });

export async function deleteMateriaAction(
  prevState: ActionStateType,
  formData: FormData
): Promise<ActionStateType> {
  // 1. Validar el id (viene de un input hidden)
  const result = eliminarMateriaInputSchema.safeParse({
    materia_id: formData.get("materia_id"),
  });

  if (!result.success) {
    return { errors: ["Materia inválida."], fieldErrors: {}, success: "" };
  }

  // Solo para el mensaje del toast; el backend no lo usa
  const nombre = String(formData.get("nombre") ?? "").trim();

  // 2. Token de la cookie (sin sesión → login)
  const token = await getAuthToken();
  if (!token) redirect("/login");

  // 3. Llamar al gateway con el token
  const url = `${process.env.API_URL}/api/v1/materias/${result.data.materia_id}`;

  let req: Response;
  try {
    req = await fetch(url, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }, // sin body → sin Content-Type
      cache: "no-store",
    });
  } catch {
    return { errors: ["No se pudo conectar con el servidor."], fieldErrors: {}, success: "" };
  }

  // Token vencido o inválido → login
  if (req.status === 401) redirect("/login");

  // 4. 204 No Content: NO hay cuerpo → aquí no se hace req.json()
  if (req.status === 204) {
    updateTag("materias");
    return {
      errors: [],
      fieldErrors: {},
      success: nombre ? `Materia "${nombre}" eliminada` : "Materia eliminada",
    };
  }

  // 404: ya no existe (otra pestaña la borró) → el resultado es el mismo que queríamos
  if (req.status === 404) {
    updateTag("materias");
    return { errors: [], fieldErrors: {}, success: "La materia ya había sido eliminada" };
  }

  // 5. Otros errores: puede que no traigan JSON, por eso el catch
  const json = await req.json().catch(() => null);

  const apiError = apiErrorSchema.safeParse(json);
  if (apiError.success) {
    return { errors: [apiError.data.error], fieldErrors: {}, success: "" };
  }

  const gatewayError = gatewayErrorSchema.safeParse(json);
  const message = gatewayError.success ? gatewayError.data.detail : "No se pudo eliminar la materia.";
  return { errors: [message], fieldErrors: {}, success: "" };
}