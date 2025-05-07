
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OverviewCardProps {
  title: string; 
  amount: number; 
  icon: React.ReactNode; 
  colorClass: string;
  isNegative?: boolean;
}

const OverviewCard: React.FC<OverviewCardProps> = ({ 
  title, 
  amount, 
  icon, 
  colorClass, 
  isNegative = false 
}) => (
  <Card className="overflow-hidden border-none shadow-lg">
    <div className={`${colorClass} absolute top-0 left-0 w-2 h-full rounded-l-lg`}></div>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-6">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className={`rounded-full p-2.5 ${colorClass} shadow-md`}>
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className={`text-2xl font-bold ${isNegative ? 'text-negative' : ''}`}>
        {isNegative ? '-' : ''}R$ {amount.toFixed(2).replace('.', ',')}
      </div>
    </CardContent>
  </Card>
);

export default OverviewCard;
