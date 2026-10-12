"use client";

import { registerAction } from "@/actions/register-action";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import ErrorMessage from "../ui/error-message";
import FieldError from "../ui/field-error";


const inputClass =
  "border-b-2 border-[#121A2B]/15 bg-transparent px-0 py-3 text-lg text-[#121A2B] placeholder:text-[#121A2B]/30 outline-none focus:border-[#E8A33D] aria-[invalid=true]:border-[#C2410C]";
const labelClass = "text-sm font-medium tracking-[0.15em] text-[#121A2B]/50 uppercase";

export function RegisterForm() {
  const router = useRouter();

  const [state, dispatch, isPending] = useActionState(registerAction, {
    errors: [],
    fieldErrors: {},
    success: "",
  });

  useEffect(() => {
    if (!state.success) return;

    toast.success(state.success);
    router.push("/login");
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
          Crea tu cuenta
        </h1>
        <p className="mt-3 text-base text-[#121A2B]/60">
          Empieza a organizar tu semestre en minutos.
        </p>
      </div>

      {/* Solo errores generales: correo repetido, servicio caído */}
      {state.errors.length > 0 && (
        <div>
          {state.errors.map((error) => (
            <ErrorMessage key={error}>{error}</ErrorMessage>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <label htmlFor="nombre" className={labelClass}>Nombre</label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            autoComplete="name"
            placeholder="Ana Martínez"
            aria-invalid={!!state.fieldErrors.nombre}
            className={inputClass}
          />
          <FieldError messages={state.fieldErrors.nombre} />
        </div>

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
            autoComplete="new-password"
            placeholder="Mínimo 8 caracteres"
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
        {isPending ? "Creando cuenta..." : "Crear cuenta"}
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