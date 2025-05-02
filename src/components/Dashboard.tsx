
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFinance } from '@/contexts/FinanceContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartPie, CircleDollarSign, BellRing } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import TransactionForm from './TransactionForm';
import { TransactionType } from '@/types';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import TransactionList from './TransactionList';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import AlertsNotifications from './AlertsNotifications';
import AlertSettings from './AlertSettings';

const OverviewCard = ({ title, amount, icon, colorClass, isNegative = false }: { 
  title: string; 
  amount: number; 
  icon: React.ReactNode; 
  colorClass: string;
  isNegative?: boolean;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className={`rounded-full p-2 ${colorClass}`}>
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

const Dashboard: React.FC = () => {
  const { getTotalIncome, getTotalExpense, getCurrentBalance, state } = useFinance();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = React.useState('overview');
  const [userName, setUserName] = useState<string>('');
  const [showAlertsDrawer, setShowAlertsDrawer] = useState<boolean>(false);
  const [showAlertSettings, setShowAlertSettings] = useState<boolean>(false);
  
  const balance = getCurrentBalance();
  const totalIncomeMonth = getTotalIncome('month');
  const totalExpenseMonth = getTotalExpense('month');
  
  useEffect(() => {
    const fetchUserName = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', user.id)
            .single();
          
          if (error) throw error;
          
          if (data) {
            if (data.first_name || data.last_name) {
              setUserName(data.first_name || '');
            } else {
              // If no name is found, use email
              setUserName(user.email?.split('@')[0] || 'Usuário');
            }
          }
        } catch (error) {
          console.error('Erro ao buscar nome do usuário:', error);
          // Fallback to email if error
          setUserName(user.email?.split('@')[0] || 'Usuário');
        }
      }
    };
    
    fetchUserName();
  }, [user]);
  
  // Prepare data for charts (fixed to ensure all months are shown)
  const getBarChartData = () => {
    return [
      { name: 'Receitas', value: totalIncomeMonth, fill: '#28a745' },
      { name: 'Despesas', value: totalExpenseMonth, fill: '#dc3545' },
    ];
  };
  
  // Create category summary for pie chart with improved handling
  const getCategorySummary = () => {
    const categorySummary: Record<string, number> = {};
    const monthlyExpenses = state.transactions.filter(t => 
      t.type === TransactionType.EXPENSE && 
      new Date(t.date).getMonth() === new Date().getMonth()
    );
    
    monthlyExpenses.forEach(transaction => {
      if (!categorySummary[transaction.category]) {
        categorySummary[transaction.category] = 0;
      }
      categorySummary[transaction.category] += transaction.amount;
    });
    
    return Object.entries(categorySummary).map(([category, value]) => ({
      name: category,
      value
    }));
  };
  
  const barChartData = getBarChartData();
  const pieChartData = getCategorySummary();
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28BFF', '#FF6B6B'];
  
  return (
    <>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Confira o resumo das suas finanças.</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={showAlertSettings} onOpenChange={setShowAlertSettings}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Configurar alertas
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <AlertSettings />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Welcome message */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <h2 className="text-xl font-medium">
            Seja bem-vindo(a), {userName}!
          </h2>
        </CardContent>
      </Card>
      
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-3 flex items-center gap-2">
          <BellRing className="h-5 w-5 text-yellow-500" />
          Alertas e notificações
        </h2>
        <AlertsNotifications />
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <OverviewCard 
          title="Receitas do Mês" 
          amount={totalIncomeMonth} 
          icon={<CircleDollarSign className="h-4 w-4 text-white" />} 
          colorClass="bg-positive text-white" 
        />
        
        <OverviewCard 
          title="Despesas do Mês" 
          amount={totalExpenseMonth} 
          icon={<CircleDollarSign className="h-4 w-4 text-white" />} 
          colorClass="bg-negative text-white" 
          isNegative={true}
        />
        
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
      </div>
      
      <div className="mt-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="transactions">Transações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Receitas vs Despesas</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => `R$ ${Number(value).toFixed(2)}`} />
                      <Bar dataKey="value">
                        {barChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Despesas por Categoria</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `R$ ${Number(value).toFixed(2)}`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-positive hover:bg-positive/80">Nova Receita</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <TransactionForm type={TransactionType.INCOME} />
                </DialogContent>
              </Dialog>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-negative hover:bg-negative/80">Nova Despesa</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <TransactionForm type={TransactionType.EXPENSE} />
                </DialogContent>
              </Dialog>
            </div>
            
            <TransactionList limit={5} showFilters={false} title="Transações Recentes" />
          </TabsContent>
          
          <TabsContent value="transactions">
            <TransactionList showFilters={true} title="Todas as Transações" />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Dashboard;
