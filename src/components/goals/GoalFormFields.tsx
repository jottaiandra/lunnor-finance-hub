
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Goal } from '@/types';

interface GoalFormFieldsProps {
  title: string;
  setTitle: (value: string) => void;
  target: string;
  setTarget: (value: string) => void;
  current: string;
  setCurrent: (value: string) => void;
  type: 'income' | 'expense-reduction';
  setType: (value: 'income' | 'expense-reduction') => void;
  period: 'weekly' | 'monthly' | 'yearly';
  setPeriod: (value: 'weekly' | 'monthly' | 'yearly') => void;
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
}

const GoalFormFields: React.FC<GoalFormFieldsProps> = ({
  title, setTitle,
  target, setTarget,
  current, setCurrent,
  type, setType,
  period, setPeriod,
  startDate, setStartDate,
  endDate, setEndDate
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          placeholder="Meta de vendas mensal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="target">Valor Alvo (R$)</Label>
          <Input
            id="target"
            type="number"
            step="0.01"
            min="0"
            placeholder="0,00"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="current">Valor Atual (R$)</Label>
          <Input
            id="current"
            type="number"
            step="0.01"
            min="0"
            placeholder="0,00"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Tipo</Label>
          <Select value={type} onValueChange={(value) => setType(value as 'income' | 'expense-reduction')}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">Meta de Receita</SelectItem>
              <SelectItem value="expense-reduction">Redução de Custos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="period">Período</Label>
          <Select value={period} onValueChange={(value) => setPeriod(value as 'weekly' | 'monthly' | 'yearly')}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Semanal</SelectItem>
              <SelectItem value="monthly">Mensal</SelectItem>
              <SelectItem value="yearly">Anual</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Data de Início</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="startDate"
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
          <Label htmlFor="endDate">Data de Término</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="endDate"
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
    </>
  );
};

export default GoalFormFields;
