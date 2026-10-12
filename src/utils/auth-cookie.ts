import { cookies } from "next/headers";
import { tokenPayloadSchema } from "../schemas/auth";

export const TOKEN_COOKIE = "token";

/** Guarda el token en una cookie httpOnly (solo la lee el servidor). */
export async function setAuthCookie(token: string, maxAgeSeconds: number) {
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSeconds,
  });
}


/** Lee el usuario desde el token. Devuelve null si no hay sesión o el token no sirve. */
export async function getSessionUser() {
  const token = await getAuthToken();
  if (!token) return null;

  try {
    // Un JWT es header.payload.firma; el payload es JSON en base64url
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString());
    const result = tokenPayloadSchema.safeParse(payload);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

/** Devuelve el token, o undefined si no hay sesión. */
export async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_COOKIE)?.value;
}

/** Borra el token (logout). */
export async function deleteAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_COOKIE);
}