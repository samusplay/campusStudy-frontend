"use client";

import { loginAction } from "@/actions/login-action";
import { Button } from "@/components/ui/button";
import ErrorMessage from "@/components/ui/error-message";
import FieldError from "@/components/ui/field-error";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";

const inputClass =
  "border-b-2 border-[#121A2B]/15 bg-transparent px-0 py-3 text-lg text-[#121A2B] placeholder:text-[#121A2B]/30 outline-none focus:border-[#E8A33D] aria-[invalid=true]:border-red-600";
const labelClass = "text-sm font-medium tracking-[0.15em] text-[#121A2B]/50 uppercase";

export default function LoginForm() {
  const router = useRouter();

  const [state, dispatch, isPending] = useActionState(loginAction, {
    errors: [],
    fieldErrors: {},
    success: "",
  });

  // Login exitoso: toast y al panel
  useEffect(() => {
    if (!state.success) return;

    toast.success(state.success);
    router.push("/admin");
  }, [state.success, router]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(() => {
      dispatch(formData);
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-10">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold text-[#121A2B] sm:text-5xl">
          Bienvenido de nuevo
        </h1>
        <p className="mt-3 text-base text-[#121A2B]/60">
          Inicia sesión para continuar con tu semestre.
        </p>
      </div>

      {/* Errores generales: credenciales incorrectas, servicio caído */}
      {state.errors.length > 0 && (
        <div>
          {state.errors.map((error) => (
            <ErrorMessage key={error}>{error}</ErrorMessage>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className={labelClass}>Correo</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="ana@uniminuto.edu.co"
            aria-invalid={!!state.fieldErrors.email}
            className={inputClass}
          />
          <FieldError messages={state.fieldErrors.email} />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className={labelClass}>Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Tu contraseña"
            aria-invalid={!!state.fieldErrors.password}
            className={inputClass}
          />
          <FieldError messages={state.fieldErrors.password} />
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isPending}
        className="h-14 bg-[#E8A33D] text-base font-semibold text-[#121A2B] hover:bg-[#E8A33D]/90"
      >
        {isPending ? "Ingresando..." : "Iniciar sesión"}
      </Button>

      <p className="text-center text-base text-[#121A2B]/60">
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="font-medium text-[#121A2B] underline underline-offset-2">
          Regístrate
        </Link>
      </p>
    </form>
  );
}