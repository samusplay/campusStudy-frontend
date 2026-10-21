"use server";

import { apiErrorSchema, gatewayErrorSchema } from "@/src/schemas/auth";
import { editarMateriaInputSchema, materiaSchema } from "@/src/schemas/materias";
import { getAuthToken } from "@/src/utils/auth-cookie";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";

type ActionStateType = {
  errors: string[];
  fieldErrors: Record<string, string[]>;
  success: string;
};

export async function updateMateriaAction(
  prevState: ActionStateType,
  formData: FormData
): Promise<ActionStateType> {
  const materiaData = {
    materia_id: formData.get("materia_id"),
    nombre: formData.get("nombre"),
    nrc: formData.get("nrc"),
    descripcion: formData.get("descripcion") ?? "",
  };

  // 1. Validar: errores agrupados por campo
  const result = editarMateriaInputSchema.safeParse(materiaData);

  if (!result.success) {
    return {
      errors: [],
      fieldErrors: result.error.flatten().fieldErrors,
      success: "",
    };
  }

  // El id va en la URL; el cuerpo solo lleva los campos editables
  const { materia_id, ...datos } = result.data;

  // 2. Token de la cookie (sin sesión → login)
  const token = await getAuthToken();
  if (!token) redirect("/login");

  // 3. Llamar al gateway con el token
  const url = `${process.env.API_URL}/api/v1/materias/${materia_id}`;

  let req: Response;
  try {
    req = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(datos), // PUT reemplaza todo: descripcion SIEMPRE va (texto o null)
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
    // 404: no existe o no es tuya (pudo borrarse en otra pestaña)
    if (req.status === 404) {
      updateTag("materias");
      return { errors: ["Esta materia ya no existe."], fieldErrors: {}, success: "" };
    }

    const apiError = apiErrorSchema.safeParse(json);

    if (apiError.success) {
      // 400: errores por campo (nombre, nrc, descripcion)
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

  // 6. Invalidar el caché: la lista (y el select de grupos) traen el cambio
  updateTag("materias");

  return { errors: [], fieldErrors: {}, success: `Materia "${materia.nombre}" actualizada` };
}