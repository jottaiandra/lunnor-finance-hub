
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CircleDollarSign, AlertTriangle } from 'lucide-react';
import { useFinance } from '@/contexts/FinanceContext';

const PeaceFundOverview: React.FC = () => {
  const { state } = useFinance();
  const { peaceFund } = state;
  
  if (!peaceFund) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-10">
          <p>Carregando dados do Fundo de Paz...</p>
        </CardContent>
      </Card>
    );
  }
  
  // Calcular porcentagem de progresso
  const progressPercentage = Math.min(
    Math.round((peaceFund.current_amount / peaceFund.target_amount) * 100),
    100
  );
  
  // Verificar se há alerta
  const showAlert = 
    peaceFund.minimum_alert_amount !== null && 
    peaceFund.current_amount < peaceFund.minimum_alert_amount;
    
  return (
    <Card className="shadow-sm mb-6">
      <CardHeader className="pb-2 space-y-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-full">
              <CircleDollarSign className="h-5 w-5 text-primary" />
            </div>
            Fundo de Paz
          </CardTitle>
          
          {showAlert && (
            <div className="flex items-center text-negative">
              <AlertTriangle className="h-5 w-5 mr-1" />
              <span className="text-sm font-medium">Saldo abaixo do mínimo!</span>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-muted-foreground text-sm">Saldo Atual</p>
              <h3 className="text-2xl font-bold text-primary">
                R$ {peaceFund.current_amount.toFixed(2).replace('.', ',')}
              </h3>
            </div>
            
            <div className="text-right">
              <p className="text-muted-foreground text-sm">Meta</p>
              <h4 className="text-lg font-medium">
                R$ {peaceFund.target_amount.toFixed(2).replace('.', ',')}
              </h4>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progresso</span>
              <span className="font-medium">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PeaceFundOverview;
