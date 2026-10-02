import { HeroSection } from "@/components/ui/home/hero-section";
import { SiteHeader } from "@/components/ui/home/site-header";

export default function Home() {
  return (
    <main className="bg-[#121A2B]">
      <SiteHeader />
      <HeroSection />
    </main>
  );
}