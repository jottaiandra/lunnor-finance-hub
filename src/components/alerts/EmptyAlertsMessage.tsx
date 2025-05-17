
import React from 'react';

const EmptyAlertsMessage: React.FC = () => {
  return (
    <div className="text-center text-muted-foreground py-4">
      <p>Não há alertas ou notificações no momento.</p>
    </div>
  );
};

export default EmptyAlertsMessage;
