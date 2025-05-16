
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PeaceFundTransaction } from '@/types/peaceFund';
import PeaceFundTransactionForm from './PeaceFundTransactionForm';
import PeaceFundTransactionList from './PeaceFundTransactionList';

interface PeaceFundTransactionsTabProps {
  peaceFundId: string;
  transactions: PeaceFundTransaction[];
  onTransactionSuccess: () => void;
}

const PeaceFundTransactionsTab: React.FC<PeaceFundTransactionsTabProps> = ({
  peaceFundId,
  transactions,
  onTransactionSuccess
}) => {
  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Adicionar Movimentação</CardTitle>
        </CardHeader>
        <CardContent>
          <PeaceFundTransactionForm 
            peaceFundId={peaceFundId} 
            onSuccess={() => {
              // Garantimos que a função de callback é chamada
              if (onTransactionSuccess) {
                onTransactionSuccess();
              }
            }}
          />
        </CardContent>
      </Card>
      
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Histórico de Movimentações</CardTitle>
        </CardHeader>
        <CardContent>
          <PeaceFundTransactionList 
            transactions={transactions} 
            showPagination
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PeaceFundTransactionsTab;
