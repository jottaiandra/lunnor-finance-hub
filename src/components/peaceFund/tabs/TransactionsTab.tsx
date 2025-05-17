
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PeaceFundTransactionForm from '../PeaceFundTransactionForm';
import PeaceFundTransactionList from '../PeaceFundTransactionList';
import { PeaceFundTransaction } from '@/types/peaceFund';

interface TransactionsTabProps {
  peaceFundId: string;
  transactions: PeaceFundTransaction[];
  onTransactionSuccess: () => void;
}

const TransactionsTab: React.FC<TransactionsTabProps> = ({ 
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
            onSuccess={onTransactionSuccess}
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

export default TransactionsTab;
