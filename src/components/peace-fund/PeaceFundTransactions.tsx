
import React, { useState } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, MinusCircle, CalendarIcon, Search, SlidersHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PeaceFundTransaction } from '@/types';

const PeaceFundTransactions: React.FC = () => {
  const { state } = useFinance();
  const { peaceFundTransactions } = state;
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'deposit' | 'withdrawal'>('all');
  
  const filteredTransactions = peaceFundTransactions
    .filter(tx => {
      const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'all' || tx.type === typeFilter;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-xl">Histórico de Transações</CardTitle>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-auto">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Buscar..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filtrar por tipo</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => setTypeFilter('all')}
                  className={typeFilter === 'all' ? 'bg-muted' : ''}
                >
                  Todos
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setTypeFilter('deposit')}
                  className={typeFilter === 'deposit' ? 'bg-muted' : ''}
                >
                  Depósitos
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setTypeFilter('withdrawal')}
                  className={typeFilter === 'withdrawal' ? 'bg-muted' : ''}
                >
                  Saques
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {searchTerm || typeFilter !== 'all' 
                ? "Nenhuma transação encontrada com os filtros atuais." 
                : "Não há transações registradas no seu Fundo de Paz."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((transaction: PeaceFundTransaction) => (
              <div 
                key={transaction.id} 
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <div className={transaction.type === 'deposit' 
                    ? 'bg-positive/10 p-2 rounded-full' 
                    : 'bg-destructive/10 p-2 rounded-full'
                  }>
                    {transaction.type === 'deposit' 
                      ? <PlusCircle className="h-5 w-5 text-positive" /> 
                      : <MinusCircle className="h-5 w-5 text-destructive" />
                    }
                  </div>
                  
                  <div>
                    <h4 className="font-medium">{transaction.description}</h4>
                    <p className="text-xs text-muted-foreground flex items-center">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      {format(new Date(transaction.date), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                    </p>
                  </div>
                </div>
                
                <span className={`font-semibold ${
                  transaction.type === 'deposit' ? 'text-positive' : 'text-destructive'
                }`}>
                  {transaction.type === 'deposit' ? '+' : '-'}
                  R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PeaceFundTransactions;
