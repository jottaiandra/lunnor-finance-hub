
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFinance } from '@/contexts/FinanceContext';
import ExportFilterForm from './ExportFilterForm';
import ExportFormatButton from './ExportFormatButton';
import { exportToExcel, exportToPDF } from './exportUtils';

const ExportData: React.FC = () => {
  const [dataType, setDataType] = useState<'all' | 'income' | 'expense'>('all');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [exportFormat, setExportFormat] = useState<'excel' | 'pdf'>('excel');
  const [isExporting, setIsExporting] = useState(false);

  const { state } = useFinance();

  const handleExport = async () => {
    setIsExporting(true);
    try {
      if (exportFormat === 'excel') {
        await exportToExcel(state.transactions || [], { dataType, startDate, endDate });
      } else {
        await exportToPDF(state.transactions || [], { dataType, startDate, endDate });
      }
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Exportar Dados</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ExportFilterForm
          dataType={dataType}
          setDataType={setDataType}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          exportFormat={exportFormat}
          setExportFormat={setExportFormat}
        />

        <div className="pt-4 flex flex-col space-y-4">
          <ExportFormatButton
            isExporting={isExporting}
            exportFormat={exportFormat}
            onExport={handleExport}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ExportData;
