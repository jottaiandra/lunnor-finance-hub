
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFinance } from '@/contexts/FinanceContext';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TrendingUp, Loader2 } from 'lucide-react';

const PeaceFundChart: React.FC = () => {
  const { state, getPeaceFundMonthlyData } = useFinance();
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      if (!isMounted) return;
      
      setLoading(true);
      setError(null);
      
      try {
        if (state.peaceFund?.id) {
          const data = await getPeaceFundMonthlyData();
          
          if (!isMounted) return;
          
          if (data && data.length > 0) {
            const formattedData = data.map(item => {
              try {
                return {
                  month: format(
                    parse(item.month, 'yyyy-MM', new Date()), 
                    'MMM/yy', 
                    { locale: ptBR }
                  ),
                  amount: Number(item.amount)
                };
              } catch (e) {
                console.error('Erro ao formatar data:', e, item);
                return null;
              }
            }).filter(Boolean);
            
            setChartData(formattedData);
          } else {
            setChartData([]);
          }
        } else {
          setChartData([]);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do gráfico:', error);
        if (isMounted) {
          setError('Não foi possível carregar os dados do gráfico.');
          setChartData([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    if (state.peaceFund?.id) {
      fetchData();
    } else {
      setLoading(false);
      setChartData([]);
    }
    
    return () => {
      isMounted = false;
    };
  }, [state.peaceFund?.id, getPeaceFundMonthlyData, state.peaceFundTransactions]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          Evolução do Fundo
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-72">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-72">
            <p className="text-destructive">{error}</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-72">
            <p className="text-muted-foreground text-center">
              Não há dados suficientes para mostrar a evolução do fundo.
            </p>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Adicione depósitos ao seu fundo para visualizar a evolução.
            </p>
          </div>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `R$ ${value}`}
                />
                <Tooltip 
                  formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'Saldo']}
                  labelFormatter={(label) => `Mês: ${label}`}
                  contentStyle={{
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--border)',
                    borderRadius: '0.5rem'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="var(--primary)"
                  fillOpacity={1}
                  fill="url(#colorAmount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PeaceFundChart;
