
import React from 'react';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Repeat } from 'lucide-react';

interface RecurrenceOptionsProps {
  isRecurrent: boolean;
  setIsRecurrent: (value: boolean) => void;
  recurrenceFrequency: string;
  setRecurrenceFrequency: (value: string) => void;
  recurrenceInterval: string;
  setRecurrenceInterval: (value: string) => void;
  recurrenceEndDate: Date | undefined;
  setRecurrenceEndDate: (value: Date | undefined) => void;
}

const RecurrenceOptions: React.FC<RecurrenceOptionsProps> = ({
  isRecurrent,
  setIsRecurrent,
  recurrenceFrequency,
  setRecurrenceFrequency,
  recurrenceInterval,
  setRecurrenceInterval,
  recurrenceEndDate,
  setRecurrenceEndDate
}) => {
  return (
    <div className="space-y-4 pt-2 border-t border-border">
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="is-recurrent" 
          checked={isRecurrent}
          onCheckedChange={(checked) => setIsRecurrent(checked === true)}
        />
        <Label htmlFor="is-recurrent" className="flex items-center">
          <Repeat className="h-4 w-4 mr-1" />
          Esta é uma transação recorrente
        </Label>
      </div>

      {isRecurrent && (
        <div className="space-y-4 pl-6 border-l-2 border-primary/20">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="recurrence-frequency">Frequência</Label>
              <Select value={recurrenceFrequency} onValueChange={setRecurrenceFrequency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Diária</SelectItem>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="biweekly">Quinzenal</SelectItem>
                  <SelectItem value="monthly">Mensal</SelectItem>
                  <SelectItem value="yearly">Anual</SelectItem>
                  <SelectItem value="custom">Personalizada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {recurrenceFrequency === 'custom' && (
              <div className="space-y-2">
                <Label htmlFor="recurrence-interval">A cada (dias)</Label>
                <Input
                  id="recurrence-interval"
                  type="number"
                  min="1"
                  placeholder="Dias"
                  value={recurrenceInterval}
                  onChange={(e) => setRecurrenceInterval(e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="recurrence-end">Data de término (opcional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="recurrence-end"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !recurrenceEndDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {recurrenceEndDate ? format(recurrenceEndDate, "dd/MM/yyyy") : "Sem data de término"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <div className="p-2">
                  <Button 
                    variant="ghost" 
                    className="text-xs w-full mb-2"
                    onClick={() => setRecurrenceEndDate(undefined)}
                  >
                    Limpar data
                  </Button>
                  <Calendar
                    mode="single"
                    selected={recurrenceEndDate}
                    onSelect={setRecurrenceEndDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </div>
              </PopoverContent>
            </Popover>
            <p className="text-xs text-muted-foreground">
              Deixe em branco para recorrência contínua
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecurrenceOptions;
