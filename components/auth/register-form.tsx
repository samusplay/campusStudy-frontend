"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function RegisterForm() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // TODO: leer los valores del formulario (FormData o estado controlado)
    // TODO: validar con registroInputSchema.safeParse({ nombre, email, password })
    // TODO: si falla -> guardar los errores por campo en estado y mostrarlos debajo de cada input
    // TODO: si pasa -> llamar a POST /api/v1/auth/registro de usuarios-service
    // TODO: si el backend responde error (ej. correo ya registrado) -> mostrarlo como error general del formulario
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold text-[#121A2B] sm:text-5xl">
          Crea tu cuenta
        </h1>
        <p className="mt-3 text-base text-[#121A2B]/60">
          Empieza a organizar tu semestre en minutos.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <label htmlFor="nombre" className="text-sm font-medium tracking-[0.15em] text-[#121A2B]/50 uppercase">
            Nombre
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            autoComplete="name"
            placeholder="Ana Martínez"
            className="border-b-2 border-[#121A2B]/15 bg-transparent px-0 py-3 text-lg text-[#121A2B] placeholder:text-[#121A2B]/30 outline-none focus:border-[#E8A33D]"
          />
          {/* Error de "nombre" (se renderiza cuando conectemos la validación) */}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium tracking-[0.15em] text-[#121A2B]/50 uppercase">
            Correo
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="ana@uniminuto.edu.co"
            className="border-b-2 border-[#121A2B]/15 bg-transparent px-0 py-3 text-lg text-[#121A2B] placeholder:text-[#121A2B]/30 outline-none focus:border-[#E8A33D]"
          />
          {/* Error de "email" (se renderiza cuando conectemos la validación) */}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-sm font-medium tracking-[0.15em] text-[#121A2B]/50 uppercase">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="Mínimo 8 caracteres"
            className="border-b-2 border-[#121A2B]/15 bg-transparent px-0 py-3 text-lg text-[#121A2B] placeholder:text-[#121A2B]/30 outline-none focus:border-[#E8A33D]"
          />
          {/* Error de "password" (se renderiza cuando conectemos la validación) */}
        </div>
      </div>

      {/* Error general del formulario — ej. "correo ya registrado" que devuelva el backend */}

      <Button type="submit" size="lg" className="h-14 bg-[#E8A33D] text-base font-semibold text-[#121A2B] hover:bg-[#E8A33D]/90">
        Crear cuenta
      </Button>

      <p className="text-center text-base text-[#121A2B]/60">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-medium text-[#121A2B] underline underline-offset-2">
          Inicia sesión
        </Link>
      </p>
    </form>
  );
}