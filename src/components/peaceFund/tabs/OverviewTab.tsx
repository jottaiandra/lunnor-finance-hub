
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PeaceFundOverview from '../PeaceFundOverview';
import PeaceFundChart from '../PeaceFundChart';
import PeaceFundTransactionList from '../PeaceFundTransactionList';
import { PeaceFund, PeaceFundTransaction } from '@/types/peaceFund';

interface OverviewTabProps {
  peaceFund: PeaceFund;
  transactions: PeaceFundTransaction[];
  chartData: Array<{name: string; value: number}>;
  onShowAllTransactions: () => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ 
  peaceFund, 
  transactions, 
  chartData,
  onShowAllTransactions
}) => {
  return (
    <div className="space-y-6">
      <PeaceFundOverview peaceFund={peaceFund} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-md h-full">
          <CardHeader>
            <CardTitle>Evolução do Fundo</CardTitle>
          </CardHeader>
          <CardContent>
            <PeaceFundChart data={chartData} />
          </CardContent>
        </Card>
        
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Últimas Movimentações</CardTitle>
          </CardHeader>
          <CardContent>
            <PeaceFundTransactionList 
              transactions={transactions} 
              limit={5}
              showAll={onShowAllTransactions} 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewTab;
