
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFinance } from '@/contexts/FinanceContext';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { AlertCircle, Check, Trash, Loader2, Target } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from '@/components/ui/sonner';
import { Skeleton } from './ui/skeleton';

const GoalsList: React.FC = () => {
  const { state, deleteGoal } = useFinance();
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  
  const handleDeleteGoal = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteGoal(id);
      toast.success("Meta excluída com sucesso");
    } catch (error) {
      console.error("Erro ao excluir meta:", error);
      toast.error("Erro ao excluir meta");
    } finally {
      setDeletingId(null);
    }
  };
  
  const calculateProgress = (goal: typeof state.goals[0]) => {
    if (!goal || typeof goal.current !== 'number' || typeof goal.target !== 'number') {
      return 0;
    }
    const percentage = (goal.current / goal.target) * 100;
    return Math.min(100, Math.max(0, percentage));
  };
  
  // Show loading skeleton during API fetch
  if (state.loading.goals) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-2 w-full" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  // Verify the goals data structure is valid
  const hasValidGoals = Array.isArray(state.goals) && state.goals.length > 0;
  
  if (!hasValidGoals) {
    return (
      <Card className="py-12">
        <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
          <Target className="h-12 w-12 text-muted-foreground" />
          <div>
            <h3 className="text-lg font-semibold">Nenhuma meta encontrada</h3>
            <p className="text-muted-foreground">
              Crie sua primeira meta financeira usando o botão "Nova Meta" acima.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {state.goals.map((goal) => {
        // Skip rendering if goal data is invalid
        if (!goal || !goal.id) {
          console.warn("Received invalid goal data:", goal);
          return null;
        }
        
        const progress = calculateProgress(goal);
        const isComplete = progress >= 100;
        
        return (
          <Card key={goal.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{goal.title}</CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleDeleteGoal(goal.id)}
                  disabled={deletingId === goal.id}
                >
                  {deletingId === goal.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progresso:</span>
                  <span className={isComplete ? 'text-green-600 font-medium' : 'font-medium'}>
                    {progress.toFixed(0)}%
                  </span>
                </div>
                
                <Progress value={progress} className="h-2" />
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Atual:</span>
                  <span className="font-medium">R$ {goal.current.toFixed(2).replace('.', ',')}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Meta:</span>
                  <span className="font-medium">R$ {goal.target.toFixed(2).replace('.', ',')}</span>
                </div>
                
                <div className="text-xs text-muted-foreground">
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
                
                <div className="pt-2 flex items-center">
                  {isComplete ? (
                    <div className="text-green-600 text-sm font-medium flex items-center">
                      <Check className="h-4 w-4 mr-1" />
                      Meta alcançada!
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Faltam R$ {(goal.target - goal.current).toFixed(2).replace('.', ',')}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default GoalsList;
