"use client";

import { Atom, BookOpen, Calculator, FlaskConical, GraduationCap, PenTool } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";

const PHRASES = [
    "Cada materia en su lugar.",
    "Lo que falta, siempre a la vista.",
    "Nadie trabaja solo.",
];

const FLOATERS = [
    { Icon: BookOpen, top: "12%", left: "72%", size: 56, duration: 7 },
    { Icon: GraduationCap, top: "22%", left: "14%", size: 44, duration: 9 },
    { Icon: Atom, top: "68%", left: "20%", size: 40, duration: 8 },
    { Icon: FlaskConical, top: "78%", left: "68%", size: 48, duration: 6.5 },
    { Icon: Calculator, top: "48%", left: "82%", size: 36, duration: 10 },
    { Icon: PenTool, top: "38%", left: "6%", size: 32, duration: 7.5 },
];

function FloatingIcons() {
    const shouldReduceMotion = useReducedMotion();

    return (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 text-white/[0.08]">
            {FLOATERS.map(({ Icon, top, left, size, duration }, i) => (
                <motion.div
                    key={i}
                    className="absolute"
                    style={{ top, left }}
                    animate={shouldReduceMotion ? undefined : { y: [0, -18, 0], rotate: [0, 6, 0] }}
                    transition={{ duration, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
                >
                    <Icon width={size} height={size} strokeWidth={1} />
                </motion.div>
            ))}
        </div>
    );
}

function CyclingPhrase() {
    const shouldReduceMotion = useReducedMotion();
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (shouldReduceMotion) return;
        const id = setInterval(() => setIndex((i) => (i + 1) % PHRASES.length), 2600);
        return () => clearInterval(id);
    }, [shouldReduceMotion]);

    if (shouldReduceMotion) {
        return <span>{PHRASES[0]}</span>;
    }

    return (
        <span className="relative block h-[1.4em] overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.span
                    key={PHRASES[index]}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="absolute left-0"
                >
                    {PHRASES[index]}
                </motion.span>
            </AnimatePresence>
        </span>
    );
}

export function AuthBrandPanel() {
    const shouldReduceMotion = useReducedMotion();

    return (
        <aside className="relative hidden w-[42%] overflow-hidden bg-[#121A2B] lg:block">
            <FloatingIcons />

            <Link
                href="/"
                className="absolute top-12 left-10 z-10 text-sm font-medium tracking-wide text-[#8A94A6] uppercase transition-colors hover:text-[#EFE7D8]"
            >
                ← Volver al inicio
            </Link>

            <div className="absolute top-1/2 left-10 z-10 -translate-y-1/2">
                <motion.h1
                    initial={shouldReduceMotion ? false : { clipPath: "inset(0 100% 0 0)" }}
                    animate={{ clipPath: "inset(0 0% 0 0)" }}
                    transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
                    className="font-[family-name:var(--font-display)] text-[clamp(2.5rem,6vw,4rem)] font-bold whitespace-nowrap text-[#E8A33D]"
                >
                    CampusStudy
                </motion.h1>

                <p className="mt-4 max-w-xs text-lg font-medium text-[#EFE7D8]/80">
                    <CyclingPhrase />
                </p>
            </div>

            <p className="absolute bottom-12 left-10 z-10 text-sm font-medium tracking-wide text-[#8A94A6] uppercase">
                Comparte. Trabaja. Gana.
            </p>
        </aside>
    );
}