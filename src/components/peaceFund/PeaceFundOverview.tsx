
import React from 'react';
import { PeaceFund } from '@/types/peaceFund';
import { Progress } from '@/components/ui/progress';
import { CircleDollarSign, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface PeaceFundOverviewProps {
  peaceFund: PeaceFund;
}

const PeaceFundOverview: React.FC<PeaceFundOverviewProps> = ({ peaceFund }) => {
  const progress = peaceFund.target_amount > 0 
    ? Math.min(Math.round((peaceFund.current_amount / peaceFund.target_amount) * 100), 100)
    : 0;
    
  const isUnderMinimum = peaceFund.minimum_alert_amount !== null && 
    peaceFund.current_amount < peaceFund.minimum_alert_amount;
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Valor Atual</p>
            <h3 className="text-2xl font-bold text-primary mt-1">
              R$ {peaceFund.current_amount.toFixed(2).replace('.', ',')}
            </h3>
          </div>
          <div className="p-2 bg-primary/10 rounded-full">
            <CircleDollarSign className="h-5 w-5 text-primary" />
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Meta</p>
            <h3 className="text-2xl font-bold text-primary mt-1">
              R$ {peaceFund.target_amount.toFixed(2).replace('.', ',')}
            </h3>
          </div>
          <div className="p-2 bg-primary/10 rounded-full">
            <CircleDollarSign className="h-5 w-5 text-primary" />
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100">
        <p className="text-sm font-medium text-muted-foreground">Progresso</p>
        <h3 className="text-2xl font-bold text-primary mt-1">{progress}%</h3>
        <Progress className="mt-2" value={progress} />
      </div>
      
      {isUnderMinimum && (
        <div className="lg:col-span-3">
          <Alert variant="destructive" className="border-red-300 bg-red-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Atenção</AlertTitle>
            <AlertDescription>
              O valor atual do seu Fundo de Paz está abaixo do valor mínimo configurado 
              (R$ {peaceFund.minimum_alert_amount?.toFixed(2).replace('.', ',')}).
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
};

export default PeaceFundOverview;
