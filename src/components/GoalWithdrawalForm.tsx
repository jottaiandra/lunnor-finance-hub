
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFinance } from '@/contexts/FinanceContext';
import { Goal } from '@/types';
import { toast } from '@/components/ui/sonner';
import GoalFormActions from './goals/GoalFormActions';
import { formatCurrency } from '@/lib/utils';

interface GoalWithdrawalFormProps {
  goal: Goal;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const GoalWithdrawalForm: React.FC<GoalWithdrawalFormProps> = ({ goal, onSuccess, onCancel }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { updateGoal } = useFinance();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || Number(amount) <= 0) {
      toast.error("Insira um valor válido para o saque.");
      return;
    }

    const withdrawalAmount = Number(amount);
    if (withdrawalAmount > goal.current) {
      toast.error("O valor do saque não pode ser maior que o valor atual da meta.");
      return;
    }

    try {
      setLoading(true);

      const newCurrent = goal.current - withdrawalAmount;

      const updatedGoal: Goal = {
        ...goal,
        current: newCurrent,
      };

      await updateGoal(updatedGoal);

      toast.success(`Saque de ${formatCurrency(withdrawalAmount)} realizado com sucesso!`);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Erro ao fazer saque:", error);
      toast.error("Não foi possível realizar o saque.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full border-t-4 border-t-amber-500 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Realizar Saque</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Valor do Saque (R$)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              max={goal.current}
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="focus-visible:ring-amber-500"
            />
          </div>

          <div className="rounded-lg bg-muted/50 p-3 space-y-1">
            <div className="flex justify-between text-sm">
              <span>Valor Disponível:</span>
              <span className="font-medium">{formatCurrency(goal.current)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Novo Saldo:</span>
              <span className="font-medium">{amount ? formatCurrency(goal.current - Number(amount)) : formatCurrency(goal.current)}</span>
            </div>
          </div>

          <GoalFormActions 
            loading={loading}
            onCancel={onCancel}
            submitLabel="Confirmar Saque"
          />
        </form>
      </CardContent>
    </Card>
  );
};

export default GoalWithdrawalForm;
