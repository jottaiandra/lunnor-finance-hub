
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Target } from 'lucide-react';

const EmptyGoalsList: React.FC = () => {
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
};

export default EmptyGoalsList;
