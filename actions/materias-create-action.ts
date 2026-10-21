"use server";

import { apiErrorSchema, gatewayErrorSchema } from "@/src/schemas/auth";
import { crearMateriaInputSchema, materiaSchema } from "@/src/schemas/materias";
import { getAuthToken } from "@/src/utils/auth-cookie";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";

type ActionStateType = {
  errors: string[];
  fieldErrors: Record<string, string[]>;
  success: string;
};

export async function createMateriaAction(
  prevState: ActionStateType,
  formData: FormData
): Promise<ActionStateType> {
  const materiaData = {
    nombre: formData.get("nombre"),
    nrc: formData.get("nrc"),
    descripcion: formData.get("descripcion") ?? "",
  };

  // 1. Validar: errores agrupados por campo
  const result = crearMateriaInputSchema.safeParse(materiaData);

  if (!result.success) {
    return {
      errors: [],
      fieldErrors: result.error.flatten().fieldErrors,
      success: "",
    };
  }

  // 2. Token de la cookie (sin sesión → login)
  const token = await getAuthToken();
  if (!token) redirect("/login");

  // 3. Llamar al gateway con el token
  const url = `${process.env.API_URL}/api/v1/materias`;

  let req: Response;
  try {
    req = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(result.data),
      cache: "no-store",
    });
  } catch {
    return { errors: ["No se pudo conectar con el servidor."], fieldErrors: {}, success: "" };
  }

  // Token vencido o inválido → login
  if (req.status === 401) redirect("/login");

  const json = await req.json();

  // 4. Errores del backend
  if (!req.ok) {
    const apiError = apiErrorSchema.safeParse(json);

    if (apiError.success) {
      // 400: errores por campo (nombre, nrc)
      if (apiError.data.errors?.length) {
        const fieldErrors: Record<string, string[]> = {};
        apiError.data.errors.forEach(({ campo, mensaje }) => {
          fieldErrors[campo] = [...(fieldErrors[campo] ?? []), mensaje];
        });
        return { errors: [], fieldErrors, success: "" };
      }

      // 409 "Ya tienes una materia con el NRC ...": error general arriba
      return { errors: [apiError.data.error], fieldErrors: {}, success: "" };
    }

    const gatewayError = gatewayErrorSchema.safeParse(json);
    const message = gatewayError.success ? gatewayError.data.detail : "Ocurrió un error inesperado.";
    return { errors: [message], fieldErrors: {}, success: "" };
  }

  // 5. Validar la respuesta contra el contrato
  const materia = materiaSchema.parse(json);

  // 6. Invalidar el caché de la lista: la próxima lectura trae la materia nueva
  updateTag("materias");

  return { errors: [], fieldErrors: {}, success: `Materia "${materia.nombre}" creada` };
}