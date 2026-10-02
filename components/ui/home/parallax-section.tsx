"use client";

import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";

interface ParallaxPanelProps {
  id: string;
  title: string;
  description: string;
  image: string;
}

export function ParallaxPanel({ id, title, description, image }: ParallaxPanelProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);

  return (
    <section
      id={id}
      ref={ref}
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 sm:px-10"
    >
      <motion.div aria-hidden="true" style={{ y: imageY }} className="absolute inset-0 scale-110">
        <Image src={image} alt="" fill className="object-cover" />
      </motion.div>

      <motion.div style={{ y: textY }} className="relative z-10 flex flex-col items-center text-center">
        <h2
          className="font-[family-name:var(--font-display)] text-5xl font-bold text-white sm:text-7xl"
          style={{
            WebkitTextStroke: "1.5px rgba(0,0,0,0.55)",
            paintOrder: "stroke fill",
            textShadow: "0 6px 28px rgba(0,0,0,0.6)",
          }}
        >
          {title}
        </h2>
        <p className="mt-6 inline-block rounded-full bg-black/35 px-5 py-2 text-xs font-medium tracking-[0.2em] text-white uppercase backdrop-blur-sm">
          {description}
        </p>
      </motion.div>
    </section>
  );
}