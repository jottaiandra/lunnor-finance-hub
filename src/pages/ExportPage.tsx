
import React from 'react';
import ExportData from '@/components/ExportData';

const ExportPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Exportar Dados</h1>
        <p className="text-muted-foreground">Exporte seus dados financeiros em diferentes formatos.</p>
      </div>
      
      <ExportData />
    </div>
  );
};

export default ExportPage;
