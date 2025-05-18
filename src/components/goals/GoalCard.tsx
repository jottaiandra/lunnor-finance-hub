
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { AlertCircle, Check, Trash, Loader2, Edit, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Goal } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface GoalCardProps {
  goal: Goal;
  onDelete: (id: string) => void;
  onEdit: (goal: Goal) => void;
  onDeposit: (goal: Goal) => void;
  onWithdrawal: (goal: Goal) => void;
  deletingId: string | null;
}

const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onDelete,
  onEdit,
  onDeposit,
  onWithdrawal,
  deletingId
}) => {
  const calculateProgress = (goal: Goal) => {
    if (!goal || typeof goal.current !== 'number' || typeof goal.target !== 'number') {
      return 0;
    }
    const percentage = (goal.current / goal.target) * 100;
    return Math.min(100, Math.max(0, percentage));
  };
  
  const progress = calculateProgress(goal);
  const isComplete = progress >= 100;
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg truncate">{goal.title}</CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onDelete(goal.id)}
            disabled={deletingId === goal.id}
            className="text-muted-foreground hover:text-destructive"
          >
            {deletingId === goal.id ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="space-y-4">
          <div className="mt-1">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Progresso:</span>
              <span className={isComplete ? 'text-green-600 font-medium' : 'font-medium'}>
                {progress.toFixed(0)}%
              </span>
            </div>
            
            <Progress 
              value={progress} 
              className="h-2" 
              indicatorClassName={isComplete ? "bg-green-500" : undefined}
            />
          </div>
          
          <div className="space-y-2 pt-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Atual:</span>
              <span className="font-medium">{formatCurrency(goal.current)}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Meta:</span>
              <span className="font-medium">{formatCurrency(goal.target)}</span>
            </div>
            
            <div className="text-xs text-muted-foreground pt-1">
              <span>
                {goal.startDate && goal.endDate ? (
                  <>
                    Período: {format(new Date(goal.startDate), "dd/MM/yyyy")} - 
                    {format(new Date(goal.endDate), "dd/MM/yyyy")}
                  </>
                ) : (
                  'Período não definido'
                )}
              </span>
            </div>
          </div>
          
          <div className="pt-1">
            {isComplete ? (
              <div className="text-green-600 text-sm font-medium flex items-center">
                <Check className="h-4 w-4 mr-1" />
                Meta alcançada!
              </div>
            ) : (
              <div className="text-sm text-muted-foreground flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                Faltam {formatCurrency(goal.target - goal.current)}
              </div>
            )}
          </div>

          {/* Ações da meta - com layout melhorado */}
          <div className="grid grid-cols-3 gap-2 mt-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onEdit(goal)}
                  className="w-full transition-colors hover:bg-secondary"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
              </TooltipTrigger>
              <TooltipContent>Editar detalhes da meta</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onDeposit(goal)}
                  className="w-full transition-colors hover:bg-green-100"
                >
                  <ArrowUp className="h-4 w-4 mr-1" />
                  Depositar
                </Button>
              </TooltipTrigger>
              <TooltipContent>Adicionar valor à meta</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onWithdrawal(goal)}
                  disabled={goal.current <= 0}
                  className="w-full transition-colors hover:bg-red-100"
                >
                  <ArrowDown className="h-4 w-4 mr-1" />
                  Sacar
                </Button>
              </TooltipTrigger>
              <TooltipContent>Retirar valor da meta</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalCard;
