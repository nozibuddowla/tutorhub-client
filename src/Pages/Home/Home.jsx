import React from "react";
import Hero from "../../components/Hero";
import LatestTuitions from "../../components/LatestTuitions";
import HowItWorks from "../../components/HowItWorks";
import LatestTutors from "../../components/LatestTutors";
import WhyChooseUs from "../../components/WhyChooseUs";
import StatsSection from "../../components/StatsSection";
import TestimonialsSection from "../../components/TestimonialCard";
import FAQSection from "../../components/FAQSection";
import CTASection from "../../components/CTASection";

const Home = () => {
  return (
    <main className="min-h-screen bg-(--bg-base)">
      <Hero />
      <StatsSection />
      <LatestTuitions />
      <HowItWorks />
      <LatestTutors />
      <WhyChooseUs />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </main>
  );
};

export default Home;
