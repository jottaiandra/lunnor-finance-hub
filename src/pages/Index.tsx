
import React from 'react';
import LandingPage from '@/components/landing/LandingPage';

const Index: React.FC = () => {
  return (
    <>
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <img 
          src="public/lovable-uploads/f9b9cb11-5be0-4917-a5b1-90d978ddbe5c.png" 
          alt="Lunnor Caixa Dashboard" 
          className="rounded-lg shadow-xl max-w-full h-auto"
        />
      </div>
      <LandingPage />
    </>
  );
};

export default Index;
