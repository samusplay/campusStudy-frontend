"use client";

import { logoutAction } from "@/actions/logout-action";
import {
    Bell,
    BookOpen,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Home,
    ListChecks,
    LogOut,
    Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useTransition } from "react";

const NAV_ITEMS = [
    { href: "/admin", label: "Inicio", icon: Home },
    { href: "/admin/calendario", label: "Calendario", icon: Calendar },
    { href: "/admin/materias", label: "Materias", icon: BookOpen },
    { href: "/admin/tareas", label: "Tareas", icon: ListChecks },
    { href: "/admin/grupos", label: "Grupos", icon: Users },
    { href: "/admin/notificaciones", label: "Notificaciones", icon: Bell },
];

type SidebarProps = {
    nombre: string;
};

// "Ana Martínez" → "AM", "samuel" → "S"
function getInitials(nombre: string) {
    return nombre
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((parte) => parte[0])
        .join("")
        .toUpperCase();
}

// Texto que aparece y desaparece al colapsar el sidebar
function NavLabel({ collapsed, children }: { collapsed: boolean; children: React.ReactNode }) {
    return (
        <AnimatePresence>
            {!collapsed && (
                <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                >
                    {children}
                </motion.span>
            )}
        </AnimatePresence>
    );
}

export function Sidebar({ nombre }: SidebarProps) {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const [isLoggingOut, startTransition] = useTransition();

    function handleLogout() {
        startTransition(async () => {
            await logoutAction();
        });
    }

    const toggleButton = (
        <button
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
            className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#8A94A6] hover:bg-white/15 hover:text-[#EFE7D8]"
        >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
    );

    const itemBase = `flex w-full items-center gap-3 overflow-hidden rounded-lg px-3 py-3 text-base whitespace-nowrap transition-colors ${
        collapsed ? "justify-center" : ""
    }`;

    return (
        <motion.aside
            animate={{ width: collapsed ? 84 : 256 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="flex shrink-0 flex-col overflow-hidden bg-[#121A2B] px-4 py-6"
        >
            {collapsed ? (
                <div className="flex flex-col items-center gap-3 pb-9">
                    <Link href="/admin" className="font-[family-name:var(--font-display)] text-2xl font-bold text-[#E8A33D]">
                        CS
                    </Link>
                    {toggleButton}
                </div>
            ) : (
                <div className="flex items-center justify-between gap-3 pb-9">
                    <Link
                        href="/admin"
                        className="min-w-0 truncate font-[family-name:var(--font-display)] text-2xl font-bold text-[#E8A33D]"
                    >
                        CampusStudy
                    </Link>
                    {toggleButton}
                </div>
            )}

            <nav className="flex flex-col gap-1.5">
                {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                    const isActive = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

                    return (
                        <Link
                            key={href}
                            href={href}
                            title={collapsed ? label : undefined}
                            className={`${itemBase} ${
                                isActive
                                    ? "bg-white/10 text-[#EFE7D8]"
                                    : "text-[#8A94A6] hover:bg-white/5 hover:text-[#EFE7D8]"
                            }`}
                        >
                            <Icon size={20} strokeWidth={1.75} className="shrink-0" />
                            <NavLabel collapsed={collapsed}>{label}</NavLabel>
                        </Link>
                    );
                })}

                {/* Cerrar sesión: debajo de Notificaciones, separado por una línea */}
                <div className="my-2 border-t border-white/10" />
                <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    title={collapsed ? "Cerrar sesión" : undefined}
                    className={`${itemBase} text-[#8A94A6] hover:bg-[#E5484D]/10 hover:text-[#FF8A80] disabled:opacity-50`}
                >
                    <LogOut size={20} strokeWidth={1.75} className="shrink-0" />
                    <NavLabel collapsed={collapsed}>
                        {isLoggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
                    </NavLabel>
                </button>
            </nav>

            {/* Usuario de la sesión */}
            <div
                title={collapsed ? nombre : undefined}
                className={`mt-auto flex items-center gap-3 overflow-hidden border-t border-white/10 pt-5 whitespace-nowrap ${
                    collapsed ? "justify-center" : "px-2"
                }`}
            >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#E8A33D]/20 text-sm font-medium text-[#E8A33D]">
                    {getInitials(nombre)}
                </div>
                <AnimatePresence>
                    {!collapsed && (
                        <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2 }}
                            title={nombre}
                            className="truncate text-base text-[#EFE7D8]"
                        >
                            {nombre}
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>
        </motion.aside>
    );
}