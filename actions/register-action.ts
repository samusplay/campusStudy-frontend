"use server";

import {
    apiErrorSchema,
    gatewayErrorSchema,
    registroInputSchema,
    usuarioSchema,
} from "@/src/schemas/auth";

type ActionStateType = {
  errors: string[];
  fieldErrors: Record<string, string[]>;
  success: string;
};

export async function registerAction(prevState: ActionStateType, formData: FormData):Promise<ActionStateType> {
  const registerData = {
    nombre: formData.get("nombre"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  // 1. Validar: Zod agrupa los errores por campo
  const result = registroInputSchema.safeParse(registerData);

  if (!result.success) {
    return {
      errors: [],
      fieldErrors: result.error.flatten().fieldErrors,
      success: "",
    };
  }

  // 2. Llamar al gateway
  const url = `${process.env.API_URL}/api/v1/auth/registro`;

  let req: Response;
  try {
    req = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result.data),
      cache: "no-store",
    });
  } catch {
    return { errors: ["No se pudo conectar con el servidor."], fieldErrors: {}, success: "" };
  }

  const json = await req.json();

  // 3. Errores del backend
  if (!req.ok) {
    const apiError = apiErrorSchema.safeParse(json);

    if (apiError.success) {
      // 400: auth también dice el campo → se muestra debajo de cada input
      if (apiError.data.errors?.length) {
        const fieldErrors: Record<string, string[]> = {};
        apiError.data.errors.forEach(({ campo, mensaje }) => {
          fieldErrors[campo] = [...(fieldErrors[campo] ?? []), mensaje];
        });
        return { errors: [], fieldErrors, success: "" };
      }

      // 409 y otros: error general arriba
      return { errors: [apiError.data.error], fieldErrors: {}, success: "" };
    }

    const gatewayError = gatewayErrorSchema.safeParse(json);
    const message = gatewayError.success ? gatewayError.data.detail : "Ocurrió un error inesperado.";
    return { errors: [message], fieldErrors: {}, success: "" };
  }

  // 4. Validar la respuesta exitosa (201)
  usuarioSchema.parse(json);

  return {
    errors: [],
    fieldErrors: {},
    success: "Registrado exitosamente",
  };
}