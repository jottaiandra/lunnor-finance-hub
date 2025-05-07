
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';

interface BarChartProps {
  data: {
    name: string;
    value: number;
    fill: string;
  }[];
}

interface PieChartProps {
  data: {
    name: string;
    value: number;
  }[];
}

const COLORS = ['#7367F0', '#28C76F', '#FF9F43', '#EA5455', '#00CFE8', '#A8AAFF'];

export const ExpenseVsIncomeChart: React.FC<BarChartProps> = ({ data }) => (
  <Card className="border-none shadow-lg overflow-hidden">
    <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent pb-4">
      <CardTitle>Receitas vs Despesas</CardTitle>
    </CardHeader>
    <CardContent className="h-80 pt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            {data.map((entry, index) => (
              <linearGradient key={`gradient-${index}`} id={`barGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={entry.fill} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={entry.fill} stopOpacity={0.4}/>
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip 
            formatter={(value) => `R$ ${Number(value).toFixed(2)}`}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
            labelStyle={{ fontWeight: 'bold' }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={`url(#barGradient${index})`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export const ExpenseByCategoryChart: React.FC<PieChartProps> = ({ data }) => (
  <Card className="border-none shadow-lg overflow-hidden">
    <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent pb-4">
      <CardTitle>Despesas por Categoria</CardTitle>
    </CardHeader>
    <CardContent className="h-80 pt-4">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <defs>
            {COLORS.map((color, index) => (
              <linearGradient key={`pieGradient-${index}`} id={`pieColorGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={color} stopOpacity={0.6}/>
              </linearGradient>
            ))}
          </defs>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            strokeWidth={2}
            stroke="#ffffff"
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={`url(#pieColorGradient${index % COLORS.length})`} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => `R$ ${Number(value).toFixed(2)}`}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
            labelStyle={{ fontWeight: 'bold' }}
          />
          <Legend 
            layout="horizontal" 
            verticalAlign="bottom" 
            align="center"
            wrapperStyle={{ paddingTop: '20px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);
