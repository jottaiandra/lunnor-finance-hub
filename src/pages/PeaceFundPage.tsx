
import React from 'react';
import PeaceFundDashboard from '@/components/peace-fund/PeaceFundDashboard';

const PeaceFundPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Fundo de Paz</h1>
      <PeaceFundDashboard />
    </div>
  );
};

export default PeaceFundPage;
