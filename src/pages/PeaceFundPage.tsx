
import React from 'react';
import PeaceFundDashboard from '@/components/peace-fund/PeaceFundDashboard';

const PeaceFundPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Fundo de Paz</h1>
      <PeaceFundDashboard />
    </div>
  );
};

export default PeaceFundPage;
