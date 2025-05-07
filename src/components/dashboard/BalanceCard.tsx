
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CircleDollarSign } from 'lucide-react';

interface BalanceCardProps {
  balance: number;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ balance }) => {
  const isPositive = balance >= 0;
  const colorClass = isPositive ? 'bg-positive' : 'bg-negative';
  
  return (
    <Card className="overflow-hidden border-none shadow-lg">
      <div className={`${colorClass} absolute top-0 left-0 w-2 h-full rounded-l-lg`}></div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-6">
        <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
        <div className={`rounded-full p-2.5 ${colorClass} text-white shadow-md`}>
          <CircleDollarSign className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${isPositive ? 'text-positive' : 'text-negative'}`}>
          {balance < 0 ? '-' : ''}R$ {Math.abs(balance).toFixed(2).replace('.', ',')}
        </div>
      </CardContent>
    </Card>
  );
};

export default BalanceCard;
