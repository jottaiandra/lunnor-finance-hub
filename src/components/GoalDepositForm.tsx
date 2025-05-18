
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFinance } from '@/contexts/FinanceContext';
import { Goal } from '@/types';
import { toast } from '@/components/ui/sonner';
import GoalFormActions from './goals/GoalFormActions';

interface GoalDepositFormProps {
  goal: Goal;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const GoalDepositForm: React.FC<GoalDepositFormProps> = ({ goal, onSuccess, onCancel }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { updateGoal } = useFinance();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || Number(amount) <= 0) {
      toast.error("Insira um valor válido para o depósito.");
      return;
    }

    try {
      setLoading(true);

      const depositAmount = Number(amount);
      const newCurrent = goal.current + depositAmount;

      const updatedGoal: Goal = {
        ...goal,
        current: newCurrent,
      };

      await updateGoal(updatedGoal);

      toast.success(`Depósito de R$ ${depositAmount.toFixed(2).replace('.', ',')} realizado com sucesso!`);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Erro ao fazer depósito:", error);
      toast.error("Não foi possível realizar o depósito.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Adicionar Depósito</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Valor do Depósito (R$)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="pt-4">
            <p className="text-sm text-muted-foreground">
              Meta Atual: R$ {goal.current.toFixed(2).replace('.', ',')}
            </p>
            <p className="text-sm text-muted-foreground">
              Novo Valor: R$ {amount ? (goal.current + Number(amount)).toFixed(2).replace('.', ',') : goal.current.toFixed(2).replace('.', ',')}
            </p>
          </div>

          <GoalFormActions 
            loading={loading}
            onCancel={onCancel}
            submitLabel="Confirmar Depósito"
          />
        </form>
      </CardContent>
    </Card>
  );
};

export default GoalDepositForm;
