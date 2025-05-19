
import React from 'react';
import { Goal } from '@/types';
import GoalMoneyOperationForm from './goals/GoalMoneyOperationForm';

interface GoalWithdrawalFormProps {
  goal: Goal;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const GoalWithdrawalForm: React.FC<GoalWithdrawalFormProps> = ({ goal, onSuccess, onCancel }) => {
  return (
    <GoalMoneyOperationForm
      goal={goal}
      operationType="withdrawal"
      onSuccess={onSuccess}
      onCancel={onCancel}
    />
  );
};

export default GoalWithdrawalForm;
