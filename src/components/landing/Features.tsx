
import React from 'react';
import { ChartBar, CheckCircle, Clock, ArrowUpRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const Features: React.FC = () => {
  const features = [
    {
      icon: <ChartBar className="h-10 w-10 text-primary" />,
      title: 'Relatórios Detalhados',
      description: 'Visualize suas finanças com gráficos e análises completas para tomar decisões bem informadas.'
    },
    {
      icon: <Clock className="h-10 w-10 text-primary" />,
      title: 'Economize Tempo',
      description: 'Automatize tarefas repetitivas e concentre-se no que realmente importa para o seu negócio.'
    },
    {
      icon: <CheckCircle className="h-10 w-10 text-primary" />,
      title: 'Defina Metas',
      description: 'Estabeleça objetivos financeiros claros e acompanhe seu progresso em tempo real.'
    },
    {
      icon: <ArrowUpRight className="h-10 w-10 text-primary" />,
      title: 'Controle Total',
      description: 'Tenha o controle completo sobre entradas, saídas e o fluxo de caixa do seu negócio.'
    }
  ];

  return (
    <div className="bg-white py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Recursos Poderosos</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubra como o Lunnor Caixa pode transformar sua gestão financeira com ferramentas intuitivas e eficientes.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
