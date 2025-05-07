
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

interface WelcomeCardProps {
  userName: string;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({ userName }) => (
  <Card className="mb-6 bg-gradient-to-r from-primary/10 to-primary/5 border-none shadow-md">
    <CardContent className="py-6 px-6 flex items-center">
      <Sparkles className="h-6 w-6 text-primary mr-3" />
      <h2 className="text-xl font-medium">
        Seja bem-vindo(a), <span className="font-bold">{userName}</span>!
      </h2>
    </CardContent>
  </Card>
);

export default WelcomeCard;
