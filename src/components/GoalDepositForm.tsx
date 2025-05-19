
import React from 'react';
import { Goal } from '@/types';
import GoalMoneyOperationForm from './goals/GoalMoneyOperationForm';

interface GoalDepositFormProps {
  goal: Goal;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const GoalDepositForm: React.FC<GoalDepositFormProps> = ({ goal, onSuccess, onCancel }) => {
  return (
    <GoalMoneyOperationForm
      goal={goal}
      operationType="deposit"
      onSuccess={onSuccess}
      onCancel={onCancel}
    />
  );
};

export default GoalDepositForm;
