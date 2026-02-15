import React from "react";
import Hero from "../../components/Hero";
import LatestTuitions from "../../components/LatestTuitions";
import HowItWorks from "../../components/HowItWorks";
import LatestTutors from "../../components/LatestTutors";
import WhyChooseUs from "../../components/WhyChooseUs";

const Home = () => {
  return (
    <main className="min-h-screen bg-gray-50/50">
      <Hero />
      <LatestTuitions />
      <HowItWorks />
      <LatestTutors />
      <WhyChooseUs />
    </main>
  );
};

export default Home;
