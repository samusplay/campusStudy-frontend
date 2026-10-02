import { HeroSection } from "@/components/ui/home/hero-section";
import { ParallaxShowcase } from "@/components/ui/home/parallax-showcase";
import { SiteFooter } from "@/components/ui/home/site-footer";
import { SiteHeader } from "@/components/ui/home/site-header";

export default function Home() {
  return (
    <main>
      <div className="relative z-10 rounded-b-[2.5rem] bg-[#121A2B] shadow-2xl">
        <SiteHeader />
        <HeroSection />
        <ParallaxShowcase />
      </div>
      <SiteFooter />
    </main>
  );
}