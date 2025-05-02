
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFinance } from '@/contexts/FinanceContext';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { AlertCircle, Check, Trash, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from '@/components/ui/sonner';

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
    const percentage = (goal.current / goal.target) * 100;
    return Math.min(100, Math.max(0, percentage));
  };
  
  // First check if the goals are still loading
  if (state.loading.goals) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Then check if goals array exists and has items
  if (!Array.isArray(state.goals) || state.goals.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <p className="text-muted-foreground">Nenhuma meta encontrada. Crie sua primeira meta financeira!</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {state.goals.map((goal) => {
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
                  <span className={isComplete ? 'text-positive font-medium' : 'font-medium'}>
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
                  <span>Período: {format(new Date(goal.startDate), "dd/MM/yyyy")} - {format(new Date(goal.endDate), "dd/MM/yyyy")}</span>
                </div>
                
                <div className="pt-2 flex items-center">
                  {isComplete ? (
                    <div className="text-positive text-sm font-medium flex items-center">
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
