"use client";


import { logoutAction } from "@/actions/logout-action";
import { LogOut } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useFormStatus } from "react-dom";

type LogoutButtonProps = {
  collapsed: boolean;
};

export default function LogoutButton({ collapsed }: LogoutButtonProps) {
  return (
    <form action={logoutAction}>
      <SubmitButton collapsed={collapsed} />
    </form>
  );
}

function SubmitButton({ collapsed }: LogoutButtonProps) {
  // Sabe si el form se está enviando, para evitar doble clic
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      title={collapsed ? "Cerrar sesión" : undefined}
      className={`flex w-full items-center gap-3 overflow-hidden rounded-lg px-3 py-3 text-base whitespace-nowrap text-[#8A94A6] transition-colors hover:bg-[#E5484D]/10 hover:text-[#FF8A80] disabled:opacity-50 ${
        collapsed ? "justify-center" : ""
      }`}
    >
      <LogOut size={20} strokeWidth={1.75} className="shrink-0" />
      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {pending ? "Cerrando sesión..." : "Cerrar sesión"}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}