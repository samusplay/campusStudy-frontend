import Hola from "@/components/inicio/Hola";
import { getSessionUser } from "@/src/utils/auth-cookie";
import { Dancing_Script } from "next/font/google";

// Letra manuscrita para el "hola"
const manuscrita = Dancing_Script({ subsets: ["latin"], weight: "700" });

export default async function AdminHomePage() {
  const usuario = await getSessionUser();
  const nombre = (usuario as { nombre?: string } | null)?.nombre?.split(" ")[0] ?? "";

  return <Hola nombre={nombre} fuente={manuscrita.style.fontFamily} />;
}