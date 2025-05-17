
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CircleDollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import { useFinance } from '@/contexts/FinanceContext';
import { cn } from '@/lib/utils';

const PeaceFundOverview: React.FC = () => {
  const { state } = useFinance();
  const { peaceFund } = state;
  
  if (!peaceFund) {
    return (
      <Card className="bg-background border shadow-sm">
        <CardContent className="flex items-center justify-center p-6">
          <p className="text-muted-foreground">Carregando dados do Fundo de Paz...</p>
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
    <Card className="bg-gradient-to-r from-primary/5 to-background border shadow-sm overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2.5 rounded-full">
                <CircleDollarSign className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Fundo de Paz</h2>
                <p className="text-muted-foreground text-sm">Sua reserva financeira estratégica</p>
              </div>
            </div>
            
            {showAlert && (
              <div className="flex items-center text-destructive bg-destructive/10 py-1.5 px-3 rounded-full">
                <AlertTriangle className="h-4 w-4 mr-1.5" />
                <span className="text-sm font-medium">Abaixo do mínimo!</span>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={cn(
              "rounded-xl p-4 border",
              showAlert ? "bg-destructive/5 border-destructive/20" : "bg-card"
            )}>
              <p className="text-sm text-muted-foreground mb-1">Saldo Atual</p>
              <h3 className={cn(
                "text-3xl font-bold",
                showAlert ? "text-destructive" : "text-primary"
              )}>
                R$ {peaceFund.current_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
            </div>
            
            <div className="rounded-xl p-4 border bg-card">
              <p className="text-sm text-muted-foreground mb-1">Meta</p>
              <h3 className="text-2xl font-semibold">
                R$ {peaceFund.target_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
            </div>
            
            <div className="rounded-xl p-4 border bg-card">
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm text-muted-foreground">Progresso</p>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="font-medium">{progressPercentage}%</span>
                </div>
              </div>
              <Progress 
                value={progressPercentage} 
                className="h-3 mt-2"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PeaceFundOverview;
