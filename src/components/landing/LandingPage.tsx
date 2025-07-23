
import React from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import PainSection from './PainSection';
import BenefitsSection from './BenefitsSection';
import TestimonialsSection from './TestimonialsSection';
import BonusSection from './BonusSection';
import FinalCTA from './FinalCTA';
import Footer from './Footer';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <PainSection />
        <BenefitsSection />
        <TestimonialsSection />
        <BonusSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
