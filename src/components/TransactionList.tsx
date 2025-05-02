
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useFinance } from '@/contexts/FinanceContext';
import { Transaction, TransactionType } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { CalendarIcon, CircleDollarSign, Pencil, Search, Trash } from 'lucide-react';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { cn } from '@/lib/utils';

interface TransactionListProps {
  limit?: number;
  showFilters?: boolean;
  title?: string;
}

const TransactionList: React.FC<TransactionListProps> = ({ limit, showFilters = true, title = "Transações Recentes" }) => {
  const { state, dispatch, getFilteredTransactions } = useFinance();
  
  const handleDelete = (id: string) => {
    dispatch({ type: "DELETE_TRANSACTION", payload: id });
  };

  const clearAllFilters = () => {
    dispatch({
      type: "SET_FILTER",
      payload: {
        startDate: null,
        endDate: null,
        type: null,
        category: null,
        searchTerm: ""
      }
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "SET_FILTER",
      payload: { searchTerm: e.target.value }
    });
  };

  const handleTypeChange = (value: string) => {
    dispatch({
      type: "SET_FILTER",
      payload: { type: value === "all" ? null : value }
    });
  };

  const handleCategoryChange = (value: string) => {
    dispatch({
      type: "SET_FILTER",
      payload: { category: value === "all" ? null : value }
    });
  };

  const handleStartDateChange = (date: Date | undefined) => {
    dispatch({
      type: "SET_FILTER",
      payload: { startDate: date || null }
    });
  };

  const handleEndDateChange = (date: Date | undefined) => {
    dispatch({
      type: "SET_FILTER",
      payload: { endDate: date || null }
    });
  };

  const filteredTransactions = getFilteredTransactions();
  const displayedTransactions = limit ? filteredTransactions.slice(0, limit) : filteredTransactions;

  const allCategories = Array.from(new Set(state.transactions.map(t => t.category)));

  return (
    <Card className="w-full">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>

        {showFilters && (
          <div className="space-y-4 mb-4">
            <div className="flex flex-wrap gap-2">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Pesquisar..."
                    value={state.currentFilter.searchTerm}
                    onChange={handleSearchChange}
                    className="pl-8"
                  />
                </div>
              </div>

              <Select 
                value={state.currentFilter.type || "all"} 
                onValueChange={handleTypeChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value={TransactionType.INCOME}>Receitas</SelectItem>
                  <SelectItem value={TransactionType.EXPENSE}>Despesas</SelectItem>
                </SelectContent>
              </Select>

              <Select 
                value={state.currentFilter.category || "all"} 
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {allCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[180px] justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {state.currentFilter.startDate
                      ? format(state.currentFilter.startDate, "dd/MM/yyyy")
                      : "Data Inicial"
                    }
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={state.currentFilter.startDate || undefined}
                    onSelect={handleStartDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[180px] justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {state.currentFilter.endDate
                      ? format(state.currentFilter.endDate, "dd/MM/yyyy")
                      : "Data Final"
                    }
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={state.currentFilter.endDate || undefined}
                    onSelect={handleEndDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Button variant="ghost" onClick={clearAllFilters}>
                Limpar Filtros
              </Button>
            </div>
          </div>
        )}

        {displayedTransactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma transação encontrada.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{format(new Date(transaction.date), "dd/MM/yyyy")}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>{transaction.category}</TableCell>
                    <TableCell className={cn(
                      "text-right font-medium",
                      transaction.type === TransactionType.INCOME ? "text-positive" : "text-negative"
                    )}>
                      R$ {transaction.amount.toFixed(2).replace('.', ',')}
                    </TableCell>
                    <TableCell>{transaction.paymentMethod}</TableCell>
                    <TableCell>{transaction.contact || "-"}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            Ações
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Opções</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="flex items-center">
                            <Pencil className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="flex items-center text-destructive focus:text-destructive" 
                            onClick={() => handleDelete(transaction.id)}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </Card>
  );
};

export default TransactionList;
