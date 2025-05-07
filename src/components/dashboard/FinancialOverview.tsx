
import React from 'react';
import { CircleDollarSign } from 'lucide-react';
import OverviewCard from './OverviewCard';
import BalanceCard from './BalanceCard';

interface FinancialOverviewProps {
  totalIncomeMonth: number;
  totalExpenseMonth: number;
  balance: number;
}

const FinancialOverview: React.FC<FinancialOverviewProps> = ({
  totalIncomeMonth,
  totalExpenseMonth,
  balance
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <OverviewCard 
        title="Receitas do Mês" 
        amount={totalIncomeMonth} 
        icon={<CircleDollarSign className="h-5 w-5 text-white" />} 
        colorClass="bg-positive text-white" 
      />
      
      <OverviewCard 
        title="Despesas do Mês" 
        amount={totalExpenseMonth} 
        icon={<CircleDollarSign className="h-5 w-5 text-white" />} 
        colorClass="bg-negative text-white" 
        isNegative={true}
      />
      
      <BalanceCard balance={balance} />
    </div>
  );
};

export default FinancialOverview;
