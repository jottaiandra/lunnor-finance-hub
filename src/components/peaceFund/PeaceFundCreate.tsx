
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PeaceFundForm from './PeaceFundForm';
import PeaceFundInfo from './PeaceFundInfo';
import { PeaceFund } from '@/types/peaceFund';

interface PeaceFundCreateProps {
  onSubmit: (formData: Partial<PeaceFund>) => Promise<boolean>;
}

const PeaceFundCreate: React.FC<PeaceFundCreateProps> = ({ onSubmit }) => {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Crie seu Fundo de Paz</CardTitle>
      </CardHeader>
      <CardContent>
        <PeaceFundInfo />
        <div className="mt-6">
          <PeaceFundForm onSubmit={onSubmit} />
        </div>
      </CardContent>
    </Card>
  );
};

export default PeaceFundCreate;
