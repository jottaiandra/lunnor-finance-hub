
import React from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import Features from './Features';
import Testimonials from './Testimonials';
import CTA from './CTA';
import Footer from './Footer';
import { useCustomization } from '@/contexts/CustomizationContext';

const LandingPage: React.FC = () => {
  const { settings } = useCustomization();
  
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Removed top gradient */}
      
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
      
      {/* Removed bottom gradient */}
    </div>
  );
};

export default LandingPage;
