
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFinance } from '@/contexts/FinanceContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TransactionType } from '@/types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, 
  PieChart, Pie, Legend, LineChart, Line
} from 'recharts';

const ReportsView: React.FC = () => {
  const { state } = useFinance();
  const [activeTab, setActiveTab] = React.useState('overview');
  
  // Helper to group transactions by month
  const getMonthlyData = () => {
    const now = new Date();
    const monthlyData = [];
    
    // Create data for last 6 months
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = month.toLocaleDateString('pt-BR', { month: 'short' });
      
      const income = state.transactions
        .filter(t => 
          t.type === TransactionType.INCOME && 
          new Date(t.date).getMonth() === month.getMonth() && 
          new Date(t.date).getFullYear() === month.getFullYear()
        )
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expense = state.transactions
        .filter(t => 
          t.type === TransactionType.EXPENSE && 
          new Date(t.date).getMonth() === month.getMonth() && 
          new Date(t.date).getFullYear() === month.getFullYear()
        )
        .reduce((sum, t) => sum + t.amount, 0);
      
      monthlyData.push({
        name: monthName,
        income,
        expense,
        balance: income - expense
      });
    }
    
    return monthlyData;
  };
  
  // Get income by category
  const getIncomeByCategory = () => {
    const categorySummary: Record<string, number> = {};
    
    state.transactions
      .filter(t => t.type === TransactionType.INCOME)
      .forEach(transaction => {
        if (!categorySummary[transaction.category]) {
          categorySummary[transaction.category] = 0;
        }
        categorySummary[transaction.category] += transaction.amount;
      });
    
    return Object.entries(categorySummary).map(([name, value]) => ({
      name,
      value
    }));
  };
  
  // Get expense by category
  const getExpenseByCategory = () => {
    const categorySummary: Record<string, number> = {};
    
    state.transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .forEach(transaction => {
        if (!categorySummary[transaction.category]) {
          categorySummary[transaction.category] = 0;
        }
        categorySummary[transaction.category] += transaction.amount;
      });
    
    return Object.entries(categorySummary).map(([name, value]) => ({
      name,
      value
    }));
  };
  
  const monthlyData = getMonthlyData();
  const incomeByCategory = getIncomeByCategory();
  const expenseByCategory = getExpenseByCategory();
  
  // Colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
        <p className="text-muted-foreground">Visualize seus dados financeiros de diferentes formas.</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="income">Receitas</TabsTrigger>
          <TabsTrigger value="expense">Despesas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fluxo de Caixa Mensal</CardTitle>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `R$ ${Number(value).toFixed(2)}`} />
                  <Legend />
                  <Bar dataKey="income" name="Receitas" fill="#28a745" />
                  <Bar dataKey="expense" name="Despesas" fill="#dc3545" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Evolução do Saldo</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `R$ ${Number(value).toFixed(2)}`} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="balance" 
                    name="Saldo" 
                    stroke="#007bff" 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="income" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Receitas por Categoria</CardTitle>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={incomeByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {incomeByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `R$ ${Number(value).toFixed(2)}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="expense" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Despesas por Categoria</CardTitle>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {expenseByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `R$ ${Number(value).toFixed(2)}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsView;
