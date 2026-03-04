import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import ProductPreview from "../components/landing/ProductPreview";
import Features from "../components/landing/Features";
import ArchitectureSection from "../components/landing/ArchitectureSection";
import CTASection from "../components/landing/CTASection";
import Footer from "../components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="bg-[#fafafa] text-[#18181b] min-h-screen">
      <Navbar />
      <Hero />
      <ProductPreview />
      <Features />
      <ArchitectureSection />
      <CTASection />
      <Footer />
    </main>
  );
}
