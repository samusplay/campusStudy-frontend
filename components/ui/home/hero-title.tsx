"use client";

import { motion, useReducedMotion } from "motion/react";

export function HeroTitle() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative pb-6">
      <motion.h1
        initial={shouldReduceMotion ? false : { clipPath: "inset(0 100% 0 0)" }}
        animate={{ clipPath: "inset(0 0% 0 0)" }}
        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        className="font-[family-name:var(--font-display)] text-[clamp(3rem,11vw,7.5rem)] font-bold leading-[1.2] tracking-tight text-[#E8A33D]"
      >
        CampusStudy
      </motion.h1>
    </div>
  );
}