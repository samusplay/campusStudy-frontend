"use client";

import {
    Bell,
    BookOpen,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Home,
    ListChecks,
    Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS = [
    { href: "/admin", label: "Inicio", icon: Home },
    { href: "/admin/calendario", label: "Calendario", icon: Calendar },
    { href: "/admin/materias", label: "Materias", icon: BookOpen },
    { href: "/admin/tareas", label: "Tareas", icon: ListChecks },
    { href: "/admin/grupos", label: "Grupos", icon: Users },
    { href: "/admin/notificaciones", label: "Notificaciones", icon: Bell },
];

export function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    const toggleButton = (
        <button
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
            className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#8A94A6] hover:bg-white/15 hover:text-[#EFE7D8]"
        >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
    );

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
                            className={`flex items-center gap-3 overflow-hidden rounded-lg px-3 py-3 text-base whitespace-nowrap transition-colors ${collapsed ? "justify-center" : ""
                                } ${isActive
                                    ? "bg-white/10 text-[#EFE7D8]"
                                    : "text-[#8A94A6] hover:bg-white/5 hover:text-[#EFE7D8]"
                                }`}
                        >
                            <Icon size={20} strokeWidth={1.75} className="shrink-0" />
                            <AnimatePresence>
                                {!collapsed && (
                                    <motion.span
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: "auto" }}
                                        exit={{ opacity: 0, width: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        {label}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>
                    );
                })}
            </nav>

            {/* TODO: reemplazar por el usuario real del store de Zustand (JWT decodificado) */}
            <div
                className={`mt-auto flex items-center gap-3 overflow-hidden border-t border-white/10 pt-5 whitespace-nowrap ${collapsed ? "justify-center" : "px-2"
                    }`}
            >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#E8A33D]/20 text-sm font-medium text-[#E8A33D]">
                    AM
                </div>
                <AnimatePresence>
                    {!collapsed && (
                        <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden text-base text-[#EFE7D8]"
                        >
                            Ana Martínez
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>
        </motion.aside>
    );
}