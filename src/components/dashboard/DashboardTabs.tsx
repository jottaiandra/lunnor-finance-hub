
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExpenseVsIncomeChart, ExpenseByCategoryChart } from './FinancialCharts';
import TransactionButtons from './TransactionButtons';
import TransactionList from '@/components/TransactionList';

interface DashboardTabsProps {
  barChartData: Array<{
    name: string;
    value: number;
    fill: string;
  }>;
  pieChartData: Array<{
    name: string;
    value: number;
  }>;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ barChartData, pieChartData }) => {
  const [activeTab, setActiveTab] = React.useState('overview');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Visão Geral</TabsTrigger>
        <TabsTrigger value="transactions">Transações</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <ExpenseVsIncomeChart data={barChartData} />
          <ExpenseByCategoryChart data={pieChartData} />
        </div>
        
        <TransactionButtons />
        
        <TransactionList limit={5} showFilters={false} title="Transações Recentes" />
      </TabsContent>
      
      <TabsContent value="transactions">
        <TransactionList showFilters={true} title="Todas as Transações" />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
