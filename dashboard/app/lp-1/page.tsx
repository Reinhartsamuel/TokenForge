import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { ProblemSection } from "./components/ProblemSection";
import { SolutionSection } from "./components/SolutionSection";
import { HowItWorksSection } from "./components/HowItWorksSection";
import { ArchitectureSection } from "./components/ArchitectureSection";
import { StatsSection } from "./components/StatsSection";
import { ComparisonSection } from "./components/ComparisonSection";
import { RoadmapSection } from "./components/RoadmapSection";
import { CTASection } from "./components/CTASection";
import { FooterSection } from "./components/FooterSection";

export default function Lp1Page() {
  return (
    <div className="min-h-screen bg-[#0F0F23] text-white">
      <Navbar />
      <main>
        <HeroSection />
        <div id="problem">
          <ProblemSection />
        </div>
        <div id="solution">
          <SolutionSection />
        </div>
        <div id="how-it-works">
          <HowItWorksSection />
        </div>
        <div id="architecture">
          <ArchitectureSection />
        </div>
        <StatsSection />
        <ComparisonSection />
        <div id="roadmap">
          <RoadmapSection />
        </div>
        <CTASection />
      </main>
      <FooterSection />
    </div>
  );
}
