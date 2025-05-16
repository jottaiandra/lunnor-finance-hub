
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
        // Verificar se o fundo de paz existe
        if (state.peaceFund?.id) {
          const data = await getPeaceFundMonthlyData();
          
          if (!isMounted) return;
          
          if (data && data.length > 0) {
            // Formatar os dados para o gráfico
            const formattedData = data.map(item => ({
              month: format(
                parse(item.month, 'yyyy-MM', new Date()), 
                'MMM/yy', 
                { locale: ptBR }
              ),
              amount: Number(item.amount)
            }));
            
            setChartData(formattedData);
          } else {
            // Se não tiver dados, criar array vazio
            setChartData([]);
          }
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
    
    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, [state.peaceFund?.id, getPeaceFundMonthlyData]);
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">
          Evolução do Fundo
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-72">
            <p>Carregando gráfico...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-72">
            <p className="text-red-500">{error}</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex justify-center items-center h-72">
            <p className="text-muted-foreground text-center">
              Não há dados suficientes para mostrar a evolução do fundo.
              <br />
              Adicione depósitos ao seu fundo para visualizar a evolução.
            </p>
          </div>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7367F0" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#7367F0" stopOpacity={0.1} />
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
                  formatter={(value: number) => [`R$ ${value.toFixed(2)}`, 'Saldo']}
                  labelFormatter={(label) => `Mês: ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#7367F0"
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
