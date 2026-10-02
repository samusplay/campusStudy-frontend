import { FeatureTabs } from "@/components/ui/home/feature-tabs";
import { HeroBackground } from "@/components/ui/home/hero-background";
import { HeroTitle } from "@/components/ui/home/hero-title";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#121A2B] px-6 pb-10 sm:px-10">
      <HeroBackground />

      <div className="relative z-10">
        <HeroTitle />

        <div className="max-w-md">
          <p className="mt-4 text-lg text-[#8A94A6]">
            Materias, tareas y grupos de estudio en un solo lugar.
          </p>
        </div>

        <div className="mt-10">
          <FeatureTabs />
        </div>
      </div>
    </section>
  );
}