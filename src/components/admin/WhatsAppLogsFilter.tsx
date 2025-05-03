
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Calendar } from 'lucide-react';

interface StatusOption {
  value: string;
  label: string;
}

interface WhatsAppLogsFilterProps {
  filterNumber: string;
  setFilterNumber: (value: string) => void;
  filterStatus: string;
  setFilterStatus: (value: string) => void;
  filterDateFrom: string;
  setFilterDateFrom: (value: string) => void;
  filterDateTo: string;
  setFilterDateTo: (value: string) => void;
  handleClearFilters: () => void;
  statusLabel?: string;
  statusOptions?: StatusOption[];
}

const WhatsAppLogsFilter: React.FC<WhatsAppLogsFilterProps> = ({
  filterNumber,
  setFilterNumber,
  filterStatus,
  setFilterStatus,
  filterDateFrom,
  setFilterDateFrom,
  filterDateTo,
  setFilterDateTo,
  handleClearFilters,
  statusLabel = "Status",
  statusOptions = [
    { value: "", label: "Todos os status" },
    { value: "success", label: "Sucesso" },
    { value: "failed", label: "Falha" }
  ]
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Input
            placeholder="Filtrar por número..."
            value={filterNumber}
            onChange={(e) => setFilterNumber(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={statusLabel} />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Input
            type="date"
            placeholder="Data inicial"
            value={filterDateFrom}
            onChange={(e) => setFilterDateFrom(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Input
            type="date"
            placeholder="Data final"
            value={filterDateTo}
            onChange={(e) => setFilterDateTo(e.target.value)}
            className="w-full"
          />
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleClearFilters}
        >
          Limpar filtros
        </Button>
      </div>
    </div>
  );
};

export default WhatsAppLogsFilter;
