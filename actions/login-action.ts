"use server";

import {
    apiErrorSchema,
    gatewayErrorSchema,
    loginDataSchema,
    loginInputSchema,
} from "@/src/schemas/auth";
import { setAuthCookie } from "@/src/utils/auth-cookie";

type ActionStateType = {
  errors: string[];
  fieldErrors: Record<string, string[]>;
  success: string;
};

export async function loginAction(
  prevState: ActionStateType,
  formData: FormData
): Promise<ActionStateType> {
  const loginData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  // 1. Validar: errores agrupados por campo
  const result = loginInputSchema.safeParse(loginData);

  if (!result.success) {
    return {
      errors: [],
      fieldErrors: result.error.flatten().fieldErrors,
      success: "",
    };
  }

  // 2. Llamar al gateway
  const url = `${process.env.API_URL}/api/v1/auth/login`;

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
      // 400: errores por campo
      if (apiError.data.errors?.length) {
        const fieldErrors: Record<string, string[]> = {};
        apiError.data.errors.forEach(({ campo, mensaje }) => {
          fieldErrors[campo] = [...(fieldErrors[campo] ?? []), mensaje];
        });
        return { errors: [], fieldErrors, success: "" };
      }

      // 401 "Email o contraseña incorrectos": error general arriba
      return { errors: [apiError.data.error], fieldErrors: {}, success: "" };
    }

    const gatewayError = gatewayErrorSchema.safeParse(json);
    const message = gatewayError.success ? gatewayError.data.detail : "Ocurrió un error inesperado.";
    return { errors: [message], fieldErrors: {}, success: "" };
  }

  // 4. Validar la respuesta y guardar el token
  const data = loginDataSchema.parse(json);
  await setAuthCookie(data.token, Number(data.expira_en));

  return { errors: [], fieldErrors: {}, success: "Sesión iniciada" };
}