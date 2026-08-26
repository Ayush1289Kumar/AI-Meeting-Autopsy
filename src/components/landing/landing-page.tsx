import { LandingNav } from "./landing-nav";
import { LandingHero } from "./hero";
import { ProofStrip } from "./proof-strip";
import { HowItWorks } from "./how-it-works";
import { FeatureGrid } from "./feature-grid";
import { FinalCta } from "./final-cta";
import { LandingFooter } from "./landing-footer";

/**
 * LandingPage — full public marketing page.
 * Narrative arc: Nav → Hero → Proof → How It Works → Features → Social Proof → CTA → Footer
 */
export function LandingPage() {
  return (
    <div className="relative min-h-screen bg-canvas text-white">
      <LandingNav />
      <main id="main-content" tabIndex={-1} className="outline-none">
        <LandingHero />
        <ProofStrip />
        <HowItWorks />
        <FeatureGrid />
        <FinalCta />
      </main>
      <LandingFooter />
    </div>
  );
}
