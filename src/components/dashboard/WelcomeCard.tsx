
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface WelcomeCardProps {
  userName: string;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({ userName }) => (
  <Card className="mb-6">
    <CardContent className="py-4">
      <h2 className="text-xl font-medium">
        Seja bem-vindo(a), {userName}!
      </h2>
    </CardContent>
  </Card>
);

export default WelcomeCard;
