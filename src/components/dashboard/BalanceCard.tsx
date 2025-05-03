
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CircleDollarSign } from 'lucide-react';

interface BalanceCardProps {
  balance: number;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ balance }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
      <div className={`rounded-full p-2 ${balance >= 0 ? 'bg-positive' : 'bg-negative'} text-white`}>
        <CircleDollarSign className="h-4 w-4" />
      </div>
    </CardHeader>
    <CardContent>
      <div className={`text-2xl font-bold ${balance >= 0 ? 'text-positive' : 'text-negative'}`}>
        {balance < 0 ? '-' : ''}R$ {Math.abs(balance).toFixed(2).replace('.', ',')}
      </div>
    </CardContent>
  </Card>
);

export default BalanceCard;
