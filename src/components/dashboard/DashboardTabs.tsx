
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
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="bg-white border border-gray-100 p-1 shadow-sm">
        <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-white">
          Visão Geral
        </TabsTrigger>
        <TabsTrigger value="transactions" className="data-[state=active]:bg-primary data-[state=active]:text-white">
          Transações
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <ExpenseVsIncomeChart data={barChartData} />
          <ExpenseByCategoryChart data={pieChartData} />
        </div>
        
        <TransactionButtons />
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <TransactionList limit={5} showFilters={false} title="Transações Recentes" />
        </div>
      </TabsContent>
      
      <TabsContent value="transactions">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <TransactionList showFilters={true} title="Todas as Transações" />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
