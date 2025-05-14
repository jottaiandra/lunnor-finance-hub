
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFinance } from '@/contexts/FinanceContext';
import { PlusCircle, MinusCircle, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const PeaceFundTransactionsList: React.FC<{ limit?: number }> = ({ limit }) => {
  const { state } = useFinance();
  const { peaceFundTransactions } = state;
  
  const displayTransactions = limit 
    ? peaceFundTransactions.slice(0, limit) 
    : peaceFundTransactions;
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">
          Movimentações Recentes
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {displayTransactions.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            Ainda não há movimentações no seu Fundo de Paz.
          </p>
        ) : (
          <div className="space-y-4">
            {displayTransactions.map(transaction => (
              <div 
                key={transaction.id} 
                className="flex items-center justify-between p-3 rounded-lg border border-border"
              >
                <div className="flex items-center space-x-3">
                  <div className={transaction.type === 'deposit' 
                    ? 'bg-positive/10 p-2 rounded-full' 
                    : 'bg-negative/10 p-2 rounded-full'
                  }>
                    {transaction.type === 'deposit' 
                      ? <PlusCircle className="h-5 w-5 text-positive" /> 
                      : <MinusCircle className="h-5 w-5 text-negative" />
                    }
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm">{transaction.description}</h4>
                    <p className="text-xs text-muted-foreground flex items-center">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      {format(new Date(transaction.date), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                    </p>
                  </div>
                </div>
                
                <span className={`font-semibold ${
                  transaction.type === 'deposit' ? 'text-positive' : 'text-negative'
                }`}>
                  {transaction.type === 'deposit' ? '+' : '-'}
                  R$ {transaction.amount.toFixed(2).replace('.', ',')}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PeaceFundTransactionsList;
