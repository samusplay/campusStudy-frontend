import { HeroBackground } from "@/components/ui/home/hero-background";
import { HeroTitle } from "@/components/ui/home/hero-title";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#121A2B] px-6 pb-16 sm:px-10">
      <HeroBackground />

      <div className="relative z-10">
        <HeroTitle />

        <div className="max-w-md">
          <p className="mt-4 text-lg font-medium tracking-wide text-[#8A94A6] uppercase">
            Comparte. Trabaja. Gana.
          </p>
        </div>
      </div>
    </section>
  );
}