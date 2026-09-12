import ContactSection from "./Components/Home/ContactSection";
import FeaturesSection from "./Components/Home/FeaturesSection";
import HeroSection from "./Components/Home/HeroSection";
import PricingSection from "./Components/Home/PricingSection";
import SolutionsSection from "./Components/Home/SolutionsSection";
import Footer from "./Components/shared/Footer";
import Header from "./Components/shared/Header";

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-white text-gray-900 font-sans overflow-x-hidden selection:bg-indigo-500 selection:text-white scroll-smooth">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <SolutionsSection />
      <PricingSection />
      <ContactSection />
      <Footer />
    </main>
  );
}