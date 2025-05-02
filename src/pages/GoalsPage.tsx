
import React, { useEffect, useState, useCallback } from 'react';
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

  // Use useCallback to prevent the function from being recreated on each render
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      await fetchGoals();
    } catch (error) {
      console.error("Erro ao carregar metas:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchGoals]);

  useEffect(() => {
    // Avoid repeated calls by adding a flag check
    let isMounted = true;
    
    // Call the memoized function
    loadData().then(() => {
      if (isMounted) {
        setIsLoading(false);
      }
    });
    
    return () => {
      isMounted = false;
    };
  }, [loadData]); // Only depend on the memoized function

  const handleFormSuccess = () => {
    setDialogOpen(false);
  };

  // Use only local loading state to prevent conflicts with context state
  if (isLoading) {
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
