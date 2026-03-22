import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import ArchitectureSection from "../components/landing/ArchitectureSection";
import RolesSection from "../components/landing/RolesSection";
import CTASection from "../components/landing/CTASection";
import Footer from "../components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#faf8ff] text-[#131b2e]">
      <Navbar />
      <Hero />
      <Features />
      <ArchitectureSection />
      <RolesSection />
      <CTASection />
      <Footer />
    </main>
  );
}
