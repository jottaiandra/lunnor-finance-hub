
import React, { useEffect, useState } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { TransactionType } from '@/types';

// Dashboard component imports
import DashboardHeader from './dashboard/DashboardHeader';
import WelcomeCard from './dashboard/WelcomeCard';
import DashboardAlerts from './dashboard/DashboardAlerts';
import FinancialOverview from './dashboard/FinancialOverview';
import DashboardTabs from './dashboard/DashboardTabs';

const Dashboard: React.FC = () => {
  const { getTotalIncome, getTotalExpense, getCurrentBalance, state } = useFinance();
  const { user } = useAuth();
  const [userName, setUserName] = useState<string>('');
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
  
  // Prepare data for charts
  const getBarChartData = () => {
    return [
      { name: 'Receitas', value: totalIncomeMonth, fill: '#28C76F' },
      { name: 'Despesas', value: totalExpenseMonth, fill: '#EA5455' },
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
  
  return (
    <div className="px-1 py-2 bg-gray-50">
      <DashboardHeader 
        showAlertSettings={showAlertSettings}
        setShowAlertSettings={setShowAlertSettings}
      />
      
      <WelcomeCard userName={userName} />
      
      <DashboardAlerts />
      
      <div className="mb-6">
        <FinancialOverview
          totalIncomeMonth={totalIncomeMonth}
          totalExpenseMonth={totalExpenseMonth}
          balance={balance}
        />
      </div>
      
      <div className="mt-6">
        <DashboardTabs 
          barChartData={barChartData}
          pieChartData={pieChartData}
        />
      </div>
    </div>
  );
};

export default Dashboard;
