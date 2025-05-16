
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PeaceFundTransaction } from '@/types/peaceFund';
import PeaceFundTransactionForm from './PeaceFundTransactionForm';
import PeaceFundTransactionList from './PeaceFundTransactionList';
import { toast } from 'sonner';

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
  const [isProcessing, setIsProcessing] = useState(false);
  
  console.log('Rendering PeaceFundTransactionsTab with', transactions.length, 'transactions');
  
  const handleTransactionSuccess = () => {
    console.log('Transaction success handler called in PeaceFundTransactionsTab');
    setIsProcessing(false);
    toast.success('Movimentação registrada com sucesso!');
    onTransactionSuccess();
  };

  const handleFormSubmit = () => {
    console.log('Form submission started');
    setIsProcessing(true);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Adicionar Movimentação</CardTitle>
        </CardHeader>
        <CardContent>
          <PeaceFundTransactionForm 
            peaceFundId={peaceFundId} 
            onSuccess={handleTransactionSuccess}
            onSubmitStart={handleFormSubmit}
            isProcessing={isProcessing}
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
