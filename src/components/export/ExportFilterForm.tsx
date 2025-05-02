
import React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';

interface ExportFilterFormProps {
  dataType: 'all' | 'income' | 'expense';
  setDataType: (value: 'all' | 'income' | 'expense') => void;
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
  exportFormat: 'excel' | 'pdf';
  setExportFormat: (value: 'excel' | 'pdf') => void;
}

const ExportFilterForm: React.FC<ExportFilterFormProps> = ({
  dataType,
  setDataType,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  exportFormat,
  setExportFormat
}) => {
  return (
    <div className="space-y-4">
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

      <div className="text-sm text-muted-foreground">
        <p>
          Nota: Os dados serão exportados conforme os filtros selecionados.
          {startDate && endDate && ` Período: ${format(startDate, "dd/MM/yyyy")} até ${format(endDate, "dd/MM/yyyy")}.`}
          {!startDate && !endDate && ' Nenhum filtro de data aplicado.'}
        </p>
      </div>
    </div>
  );
};

export default ExportFilterForm;
