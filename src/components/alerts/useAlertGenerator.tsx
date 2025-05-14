
import { useState, useEffect } from 'react';
import { AlertItem } from './AlertItem';
import { AlertConfig, loadAlertConfig } from './AlertsConfig';
import { 
  getUpcomingExpenses, 
  getExpectedIncome, 
  isBalanceBelowThreshold, 
  calculateGoalProgress, 
  isGoalAchievable, 
  compareMonthlyExpenses, 
  isBalanceTrending 
} from '@/contexts/finance/statsService';
import { formatCurrency } from '@/lib/utils';
import { useFinance } from '@/contexts/FinanceContext';
import { 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle, 
  Info, 
  Check 
} from 'lucide-react';

export const useAlertGenerator = () => {
  const { state } = useFinance();
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [config, setConfig] = useState<AlertConfig>(loadAlertConfig());

  // Generate alerts based on transactions and goals
  useEffect(() => {
    if (state.loading.transactions || state.loading.goals) return;

    const newAlerts: AlertItem[] = [];

    // 1. Upcoming expenses alerts
    if (config.showBalanceAlerts) {
      const upcomingExpenses = getUpcomingExpenses(state.transactions, 7);
      if (upcomingExpenses.length > 0) {
        const total = upcomingExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        newAlerts.push({
          id: 'upcoming-expenses',
          title: 'Despesas próximas',
          message: `Você tem ${upcomingExpenses.length} despesa${upcomingExpenses.length > 1 ? 's' : ''} nos próximos 7 dias, totalizando ${formatCurrency(total)}.`,
          type: 'warning',
          icon: <AlertTriangle className="h-4 w-4" />
        });
      }
    }

    // 2. Expected income alerts
    if (config.showBalanceAlerts) {
      const expectedIncome = getExpectedIncome(state.transactions);
      if (expectedIncome.length > 0) {
        const total = expectedIncome.reduce((sum, inc) => sum + inc.amount, 0);
        newAlerts.push({
          id: 'expected-income',
          title: 'Receitas previstas',
          message: `Você tem ${expectedIncome.length} receita${expectedIncome.length > 1 ? 's' : ''} prevista${expectedIncome.length > 1 ? 's' : ''}, totalizando ${formatCurrency(total)}.`,
          type: 'info',
          icon: <Info className="h-4 w-4" />
        });
      }
    }

    // 3. Balance threshold alert
    if (config.showBalanceAlerts) {
      const balance = state.transactions.reduce((sum, t) => 
        t.type === 'income' ? sum + t.amount : sum - t.amount, 0);
        
      if (balance < config.balanceThreshold) {
        newAlerts.push({
          id: 'low-balance',
          title: 'Saldo baixo',
          message: `Seu saldo atual de ${formatCurrency(balance)} está abaixo do limite definido de ${formatCurrency(config.balanceThreshold)}.`,
          type: 'danger',
          icon: <AlertTriangle className="h-4 w-4" />
        });
      }
    }

    // 4. Goal progress alerts
    if (config.showGoalAlerts && state.goals.length > 0) {
      state.goals.forEach(goal => {
        const progress = calculateGoalProgress(goal);
        const remaining = goal.target - goal.current;
        
        if (progress >= 80 && progress < 100) {
          newAlerts.push({
            id: `goal-near-${goal.id}`,
            title: 'Meta quase alcançada',
            message: `Sua meta "${goal.title}" está ${progress.toFixed(0)}% completa. Faltam apenas ${formatCurrency(remaining)}!`,
            type: 'success',
            icon: <TrendingUp className="h-4 w-4" />
          });
        } else if (progress < 50) {
          const isAchievable = isGoalAchievable(goal, state.transactions);
          if (!isAchievable) {
            newAlerts.push({
              id: `goal-risk-${goal.id}`,
              title: 'Meta em risco',
              message: `No ritmo atual, sua meta "${goal.title}" pode não ser alcançada até ${new Date(goal.end_date).toLocaleDateString()}. Progresso atual: ${progress.toFixed(0)}%.`,
              type: 'warning',
              icon: <TrendingDown className="h-4 w-4" />
            });
          }
        } else if (progress === 100) {
          newAlerts.push({
            id: `goal-complete-${goal.id}`,
            title: 'Meta alcançada',
            message: `Parabéns! Você alcançou a meta "${goal.title}"!`,
            type: 'success',
            icon: <Check className="h-4 w-4" />
          });
        }
      });
    }

    // 5. Category spending alerts
    if (config.showCategoryAlerts) {
      const categoryComparison = compareMonthlyExpenses(state.transactions);
      
      Object.entries(categoryComparison).forEach(([category, data]) => {
        if (data.percentChange > 20 && data.current > 0) {
          newAlerts.push({
            id: `category-increase-${category}`,
            title: 'Aumento de gastos',
            message: `Os gastos na categoria ${category} aumentaram ${data.percentChange.toFixed(0)}% em relação ao mês anterior.`,
            type: 'warning',
            icon: <TrendingUp className="h-4 w-4" />
          });
        }
      });
    }

    // 6. Balance trend alert
    if (config.showTrendAlerts) {
      const trend = isBalanceTrending(state.transactions, 3);
      
      if (trend === 'down') {
        newAlerts.push({
          id: 'balance-trend-down',
          title: 'Tendência de queda',
          message: 'Seu saldo tem diminuído nos últimos 3 meses. Considere revisar seus gastos.',
          type: 'danger',
          icon: <TrendingDown className="h-4 w-4" />
        });
      } else if (trend === 'up') {
        newAlerts.push({
          id: 'balance-trend-up',
          title: 'Tendência de alta',
          message: 'Ótimo trabalho! Seu saldo tem aumentado nos últimos 3 meses.',
          type: 'success',
          icon: <TrendingUp className="h-4 w-4" />
        });
      }
    }

    setAlerts(newAlerts);
  }, [state.transactions, state.goals, config]);

  return { alerts, config, setConfig };
};
