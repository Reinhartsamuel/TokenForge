import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { TheGoldSection } from "./components/TheGoldSection";
import { PainPointsSection } from "./components/PainPointsSection";
import { StatsSection } from "./components/StatsSection";
import { SocialProofSection } from "./components/SocialProofSection";
import { VantaFogSection } from "./components/VantaFogSection";
import { TrustBarSection } from "./components/TrustBarSection";
import { PlatformOverview } from "./components/PlatformOverview";
import { IssuerDashboard } from "./components/IssuerDashboard";
import { ComplianceEngine } from "./components/ComplianceEngine";
import { TranchingWorkflow } from "./components/TranchingWorkflow";
import { HowItWorksSection } from "./components/HowItWorksSection";
import { ComparisonSection } from "./components/ComparisonSection";
import { UseCasesSection } from "./components/UseCasesSection";
import { UrgencyCTASection } from "./components/UrgencyCTASection";
import { FooterSection } from "./components/FooterSection";

export default function Lp3Page() {
  return (
    <div className="min-h-screen text-slate-900">
      <Navbar />
      <main>
        <HeroSection />
        <TheGoldSection />
        <PainPointsSection />
        <StatsSection />
        <SocialProofSection />
        <VantaFogSection />
        <TrustBarSection />
        <PlatformOverview />
        <IssuerDashboard />
        <ComplianceEngine />
        <TranchingWorkflow />
        <HowItWorksSection />
        <ComparisonSection />
        <UseCasesSection />
        <UrgencyCTASection />
      </main>
      <FooterSection />
    </div>
  );
}
