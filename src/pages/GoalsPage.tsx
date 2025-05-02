
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import GoalsList from '@/components/GoalsList';
import GoalForm from '@/components/GoalForm';
import { useFinance } from '@/contexts/FinanceContext';
import { Loader2 } from 'lucide-react';

const GoalsPage: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { state, fetchGoals } = useFinance();

  useEffect(() => {
    // Evita chamadas repetidas adicionando uma flag de verificação
    let isMounted = true;
    
    const loadData = async () => {
      try {
        setIsLoading(true);
        await fetchGoals();
      } catch (error) {
        console.error("Erro ao carregar metas:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    loadData();
    
    return () => {
      isMounted = false;
    };
  }, [fetchGoals]);

  const handleFormSuccess = () => {
    setDialogOpen(false);
  };

  // Mostrar loading apenas durante o carregamento inicial, usando a combinação dos dois estados
  // para garantir que não haja conflitos
  if (isLoading && state.loading.goals) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Metas Financeiras</h1>
          <p className="text-muted-foreground">Acompanhe seu progresso em direção às suas metas.</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>Nova Meta</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <GoalForm 
              onSuccess={handleFormSuccess} 
              onCancel={() => setDialogOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <GoalsList />
    </div>
  );
};

export default GoalsPage;
