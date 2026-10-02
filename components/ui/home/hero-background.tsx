import { BookOpen, FlaskConical, GraduationCap } from "lucide-react";

export function HeroBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden text-white/[0.14]"
    >
      <BookOpen className="absolute top-8 right-10 size-24 -rotate-6 sm:size-32" strokeWidth={1} />
      <GraduationCap className="absolute bottom-10 right-[32%] size-20 rotate-6 sm:size-28" strokeWidth={1} />
      <FlaskConical className="absolute top-1/2 right-[12%] size-16 -translate-y-1/2 rotate-12 sm:size-20" strokeWidth={1} />
    </div>
  );
}