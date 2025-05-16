
import React from 'react';
import { PeaceFund } from '@/types/peaceFund';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PeaceFundForm from './PeaceFundForm';
import PeaceFundInfo from './PeaceFundInfo';

interface CreatePeaceFundProps {
  onCreatePeaceFund: (formData: Partial<PeaceFund>) => Promise<PeaceFund | null>;
}

const CreatePeaceFund: React.FC<CreatePeaceFundProps> = ({ 
  onCreatePeaceFund 
}) => {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Crie seu Fundo de Paz</CardTitle>
      </CardHeader>
      <CardContent>
        <PeaceFundInfo />
        <div className="mt-6">
          <PeaceFundForm onSubmit={onCreatePeaceFund} />
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatePeaceFund;
