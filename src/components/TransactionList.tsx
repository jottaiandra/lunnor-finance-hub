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
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { CalendarIcon, CircleDollarSign, Loader2, Pencil, Repeat, Search, Trash } from 'lucide-react';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/sonner';
import { Badge } from './ui/badge';
import { Dialog, DialogContent } from './ui/dialog';
import EditTransactionForm from './EditTransactionForm';

interface TransactionListProps {
  limit?: number;
  showFilters?: boolean;
  title?: string;
}

const TransactionList: React.FC<TransactionListProps> = ({ limit, showFilters = true, title = "Transações Recentes" }) => {
  const { state, dispatch, getFilteredTransactions, deleteTransaction, updateTransaction } = useFinance();
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [editingTransaction, setEditingTransaction] = React.useState<Transaction | null>(null);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  
  const handleDelete = async (id: string, deleteOptions?: { deleteAllFuture?: boolean }) => {
    try {
      setDeletingId(id);
      await deleteTransaction(id, deleteOptions);
      toast.success("Transação excluída com sucesso");
    } catch (error) {
      console.error("Erro ao excluir transação:", error);
      toast.error("Erro ao excluir transação");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setEditDialogOpen(true);
  };

  const handleEditSuccess = () => {
    setEditDialogOpen(false);
    setEditingTransaction(null);
    toast.success('Transação atualizada com sucesso!');
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

  if (state.loading.transactions) {
    return (
      <Card className="w-full">
        <div className="p-8 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Card>
    );
  }

  return (
    <>
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

          {state.transactions.length === 0 && !state.loading.transactions ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma transação encontrada. Comece adicionando uma receita ou despesa!
            </div>
          ) : displayedTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma transação encontrada com os filtros atuais.
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
                      <TableCell>
                        <div className="flex items-center">
                          {format(new Date(transaction.date), "dd/MM/yyyy")}
                          {transaction.isRecurrent && (
                            <Badge variant="outline" className="ml-2 px-1">
                              <Repeat className="h-3 w-3 mr-1" />
                              <span className="text-xs">Recorrente</span>
                            </Badge>
                          )}
                        </div>
                      </TableCell>
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
                            <DropdownMenuItem 
                              className="flex items-center"
                              onClick={() => handleEdit(transaction)}
                            >
                              <Pencil className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            
                            {transaction.isRecurrent ? (
                              <DropdownMenuSub>
                                <DropdownMenuSubTrigger className="text-destructive focus:text-destructive">
                                  <Trash className="h-4 w-4 mr-2" />
                                  Excluir
                                </DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                  <DropdownMenuSubContent>
                                    <DropdownMenuItem 
                                      onClick={() => handleDelete(transaction.id)}
                                      disabled={deletingId === transaction.id}
                                    >
                                      Apenas esta ocorrência
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={() => handleDelete(transaction.id, { deleteAllFuture: true })}
                                      disabled={deletingId === transaction.id}
                                    >
                                      Esta e todas futuras
                                    </DropdownMenuItem>
                                  </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                              </DropdownMenuSub>
                            ) : (
                              <DropdownMenuItem 
                                className="flex items-center text-destructive focus:text-destructive" 
                                onClick={() => handleDelete(transaction.id)}
                                disabled={deletingId === transaction.id}
                              >
                                {deletingId === transaction.id ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Excluindo...
                                  </>
                                ) : (
                                  <>
                                    <Trash className="h-4 w-4 mr-2" />
                                    Excluir
                                  </>
                                )}
                              </DropdownMenuItem>
                            )}
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

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {editingTransaction && (
            <EditTransactionForm
              transaction={editingTransaction}
              onSuccess={handleEditSuccess}
              onCancel={() => setEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TransactionList;
