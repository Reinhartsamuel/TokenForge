import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { VantaFogSection } from "./components/VantaFogSection";
import { TrustBarSection } from "./components/TrustBarSection";
import { PlatformOverview } from "./components/PlatformOverview";
import { IssuerDashboard } from "./components/IssuerDashboard";
import { ComplianceEngine } from "./components/ComplianceEngine";
import { TranchingWorkflow } from "./components/TranchingWorkflow";
import { HowItWorksSection } from "./components/HowItWorksSection";
import { ComparisonSection } from "./components/ComparisonSection";
import { UseCasesSection } from "./components/UseCasesSection";
import { StatsSection } from "./components/StatsSection";
import { CTASection } from "./components/CTASection";
import { FooterSection } from "./components/FooterSection";

export default function Lp2Page() {
  return (
    <div className="min-h-screen text-slate-900">
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <VantaFogSection />
        <TrustBarSection />
        <PlatformOverview />
        <IssuerDashboard />
        <ComplianceEngine />
        <TranchingWorkflow />
        <HowItWorksSection />
        <ComparisonSection />
        <UseCasesSection />
        <CTASection />
      </main>
      <FooterSection />
    </div>
  );
}
