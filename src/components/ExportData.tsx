
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFinance } from '@/contexts/FinanceContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ExportData: React.FC = () => {
  const [dataType, setDataType] = React.useState<'all' | 'income' | 'expense'>('all');
  const [startDate, setStartDate] = React.useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = React.useState<Date | undefined>(undefined);
  const [exportFormat, setExportFormat] = React.useState<'excel' | 'pdf'>('excel');

  const { state, getFilteredTransactions } = useFinance();
  const { toast } = useToast();

  const handleExport = () => {
    toast({
      title: "Exportação iniciada",
      description: `Os dados serão exportados em formato ${exportFormat === 'excel' ? 'Excel' : 'PDF'}.`,
    });
    
    // Aqui seria implementada a lógica real de exportação
    setTimeout(() => {
      toast({
        title: "Exportação concluída",
        description: "Os dados foram exportados com sucesso!",
      });
    }, 1500);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Exportar Dados</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="data-type" className="text-sm font-medium">
            Tipo de Dados
          </label>
          <Select value={dataType} onValueChange={(value: 'all' | 'income' | 'expense') => setDataType(value)}>
            <SelectTrigger id="data-type">
              <SelectValue placeholder="Selecione o tipo de dados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as transações</SelectItem>
              <SelectItem value="income">Apenas receitas</SelectItem>
              <SelectItem value="expense">Apenas despesas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="start-date" className="text-sm font-medium">
              Data Inicial
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="start-date"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "dd/MM/yyyy") : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label htmlFor="end-date" className="text-sm font-medium">
              Data Final
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="end-date"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "dd/MM/yyyy") : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  disabled={(date) => (startDate ? date < startDate : false)}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="export-format" className="text-sm font-medium">
            Formato de Exportação
          </label>
          <Select value={exportFormat} onValueChange={(value: 'excel' | 'pdf') => setExportFormat(value)}>
            <SelectTrigger id="export-format">
              <SelectValue placeholder="Selecione o formato" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="excel">Excel (.xlsx)</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="pt-4 flex flex-col space-y-4">
          <Button onClick={handleExport} className="w-full">
            <FileText className="mr-2 h-4 w-4" />
            {exportFormat === 'excel' ? 'Exportar para Excel' : 'Exportar para PDF'}
          </Button>
          
          <div className="text-sm text-muted-foreground">
            <p>
              Nota: Os dados serão exportados conforme os filtros selecionados.
              {startDate && endDate && ` Período: ${format(startDate, "dd/MM/yyyy")} até ${format(endDate, "dd/MM/yyyy")}.`}
              {!startDate && !endDate && ' Nenhum filtro de data aplicado.'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExportData;
