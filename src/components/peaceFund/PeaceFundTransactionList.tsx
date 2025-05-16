
import React from 'react';
import { PeaceFundTransaction } from '@/types/peaceFund';
import { Button } from '@/components/ui/button';
import { ArrowDownIcon, ArrowUpIcon, ChevronRightIcon } from 'lucide-react';
import { format } from 'date-fns';

interface PeaceFundTransactionListProps {
  transactions: PeaceFundTransaction[];
  limit?: number;
  showAll?: () => void;
  showPagination?: boolean;
}

const PeaceFundTransactionList: React.FC<PeaceFundTransactionListProps> = ({ 
  transactions, 
  limit,
  showAll,
  showPagination = false
}) => {
  const displayedTransactions = limit ? transactions.slice(0, limit) : transactions;
  
  if (displayedTransactions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Ainda não há movimentações no seu Fundo de Paz.
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {displayedTransactions.map((transaction) => (
          <div 
            key={transaction.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center">
              <div className={`p-2 rounded-full ${
                transaction.type === 'deposit' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {transaction.type === 'deposit' ? (
                  <ArrowUpIcon className="h-4 w-4 text-green-600" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 text-red-600" />
                )}
              </div>
              <div className="ml-3">
                <p className="font-medium">{transaction.description}</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(transaction.date), 'dd/MM/yyyy')}
                </p>
              </div>
            </div>
            <div className={`font-medium ${
              transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
            }`}>
              {transaction.type === 'deposit' ? '+' : '-'}
              R$ {transaction.amount.toFixed(2).replace('.', ',')}
            </div>
          </div>
        ))}
      </div>
      
      {showAll && transactions.length > (limit || 0) && (
        <div className="flex justify-center mt-4">
          <Button variant="ghost" onClick={showAll} className="text-primary">
            Ver todas as movimentações
            <ChevronRightIcon className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}
      
      {showPagination && transactions.length > 10 && (
        <div className="flex justify-center mt-4">
          {/* Simple pagination would go here */}
          <Button variant="outline" size="sm" className="mx-1">Anterior</Button>
          <Button variant="outline" size="sm" className="mx-1">Próxima</Button>
        </div>
      )}
    </div>
  );
};

export default PeaceFundTransactionList;
