
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PeaceFundChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
}

const PeaceFundChart: React.FC<PeaceFundChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Ainda não há dados suficientes para exibir o gráfico.</p>
      </div>
    );
  }

  const formatValue = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 5,
            right: 5,
            left: 5,
            bottom: 5,
          }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7367F0" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#7367F0" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis 
            tickFormatter={formatValue}
            axisLine={false}
            tickLine={false}
            width={80}
          />
          <Tooltip formatter={(value: number) => [formatValue(value), 'Valor']} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#7367F0"
            strokeWidth={2}
            fill="url(#colorValue)"
            activeDot={{ r: 8 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PeaceFundChart;
