
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
      {/* Top gradient */}
      <div 
        className="absolute top-0 left-0 right-0 h-16 z-10 pointer-events-none"
        style={{ background: settings.topGradient }}
      ></div>
      
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
      
      {/* Bottom gradient */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-16 z-10 pointer-events-none"
        style={{ background: settings.bottomGradient }}
      ></div>
    </div>
  );
};

export default LandingPage;
