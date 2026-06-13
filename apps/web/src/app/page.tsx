// ============================================================================
// LANDING PAGE — FormForge Premium Storytelling Landing
// ============================================================================
// A visually stunning, animation-rich landing page with whimsical design.
// Uses Framer Motion for scroll reveals, parallax, and micro-interactions.
// ============================================================================

import { Navbar } from "@/components/landing/navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { BuilderDemoSection } from "@/components/landing/builder-demo-section";
import { MarketplaceSection } from "@/components/landing/marketplace-section";
import { AiFeaturesSection } from "@/components/landing/ai-features-section";
import { StatsSection } from "@/components/landing/stats-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { FaqSection } from "@/components/landing/faq-section";
import { FooterSection } from "@/components/landing/footer-section";
import { AuthGuard } from "@/components/auth-guard";

export default function LandingPage() {
  return (
    <AuthGuard requireAuth={false}>
      <main className="paper-texture min-h-screen overflow-x-hidden">
        <Navbar />
        <HeroSection />
      <FeaturesSection />
      <BuilderDemoSection />
      <MarketplaceSection />
      <AiFeaturesSection />
      <StatsSection />
      <PricingSection />
      <FaqSection />
      <FooterSection />
      </main>
    </AuthGuard>
  );
}
