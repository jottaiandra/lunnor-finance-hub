
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFinance } from '@/contexts/FinanceContext';
import { Goal } from '@/types';
import { toast } from '@/components/ui/sonner';
import GoalFormActions from './GoalFormActions';
import { formatCurrency } from '@/lib/utils';

export type OperationType = 'deposit' | 'withdrawal';

interface GoalMoneyOperationFormProps {
  goal: Goal;
  operationType: OperationType;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const GoalMoneyOperationForm: React.FC<GoalMoneyOperationFormProps> = ({ 
  goal, 
  operationType, 
  onSuccess, 
  onCancel 
}) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { updateGoal } = useFinance();

  // Configuration based on operation type
  const config = {
    deposit: {
      title: 'Adicionar Depósito',
      submitLabel: 'Confirmar Depósito',
      borderColor: 'border-t-green-500',
      ringColor: 'focus-visible:ring-green-500',
      successMessage: (value: number) => `Depósito de ${formatCurrency(value)} realizado com sucesso!`,
      errorMessage: 'Não foi possível realizar o depósito.',
      validateAmount: (value: number) => value > 0 ? null : "Insira um valor válido para o depósito.",
      calculateNewValue: (current: number, amount: number) => current + amount
    },
    withdrawal: {
      title: 'Realizar Saque',
      submitLabel: 'Confirmar Saque',
      borderColor: 'border-t-amber-500',
      ringColor: 'focus-visible:ring-amber-500',
      successMessage: (value: number) => `Saque de ${formatCurrency(value)} realizado com sucesso!`,
      errorMessage: 'Não foi possível realizar o saque.',
      validateAmount: (value: number) => {
        if (value <= 0) return "Insira um valor válido para o saque.";
        if (value > goal.current) return "O valor do saque não pode ser maior que o valor atual da meta.";
        return null;
      },
      calculateNewValue: (current: number, amount: number) => current - amount
    }
  };

  const currentConfig = config[operationType];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || Number(amount) <= 0) {
      toast.error(currentConfig.validateAmount(Number(amount)) || "Insira um valor válido.");
      return;
    }

    const operationAmount = Number(amount);
    
    // Additional validation for withdrawal
    if (operationType === 'withdrawal' && operationAmount > goal.current) {
      toast.error("O valor do saque não pode ser maior que o valor atual da meta.");
      return;
    }

    try {
      setLoading(true);

      const newCurrent = currentConfig.calculateNewValue(goal.current, operationAmount);

      const updatedGoal: Goal = {
        ...goal,
        current: newCurrent,
      };

      await updateGoal(updatedGoal);

      toast.success(currentConfig.successMessage(operationAmount));

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error(`Erro ao fazer ${operationType === 'deposit' ? 'depósito' : 'saque'}:`, error);
      toast.error(currentConfig.errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Calculate the new balance preview based on the operation
  const getNewBalance = () => {
    if (!amount) return goal.current;
    
    const amountValue = Number(amount);
    return currentConfig.calculateNewValue(goal.current, amountValue);
  };

  return (
    <Card className={`w-full border-t-4 ${currentConfig.borderColor} shadow-sm`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">{currentConfig.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">{operationType === 'deposit' ? 'Valor do Depósito (R$)' : 'Valor do Saque (R$)'}</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              max={operationType === 'withdrawal' ? goal.current : undefined}
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={currentConfig.ringColor}
            />
          </div>

          <div className="rounded-lg bg-muted/50 p-3 space-y-1">
            <div className="flex justify-between text-sm">
              <span>{operationType === 'deposit' ? 'Meta Atual:' : 'Valor Disponível:'}</span>
              <span className="font-medium">{formatCurrency(goal.current)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>{operationType === 'deposit' ? 'Novo Valor:' : 'Novo Saldo:'}</span>
              <span className="font-medium">{formatCurrency(getNewBalance())}</span>
            </div>
          </div>

          <GoalFormActions 
            loading={loading}
            onCancel={onCancel}
            submitLabel={currentConfig.submitLabel}
          />
        </form>
      </CardContent>
    </Card>
  );
};

export default GoalMoneyOperationForm;
