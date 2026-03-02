// src/pages/LandingPage.tsx
import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { ProjectsMarquee } from '@/components/landing/ProjectsMarquee';
import { DetailedFeatures } from '@/components/landing/DetailedFeatures';
import { CTASection } from '@/components/landing/CTASection';
import { Footer } from '@/components/landing/Footer';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0F14]">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <ProjectsMarquee />
        <DetailedFeatures />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}