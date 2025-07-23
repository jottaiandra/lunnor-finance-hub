import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Target, 
  PieChart, 
  Shield, 
  Users, 
  Gift,
  Scissors,
  Palette,
  Sparkles
} from 'lucide-react';

const BenefitsSection: React.FC = () => {
  const benefits = [
    {
      icon: <BarChart3 className="h-10 w-10 text-beauty-pink" />,
      title: 'Organização Total',
      description: 'Controle fácil de entradas, saídas e reservas – sem precisar ser "boa de números".',
      decoration: <Scissors className="h-6 w-6 text-golden/30 absolute top-4 right-4" />
    },
    {
      icon: <Target className="h-10 w-10 text-beauty-pink" />,
      title: 'Metas Claras',
      description: 'Veja quanto precisa guardar para sua viagem, salão novo, ou aquele curso dos sonhos.',
      decoration: <Sparkles className="h-6 w-6 text-golden/30 absolute top-4 right-4" />
    },
    {
      icon: <PieChart className="h-10 w-10 text-beauty-pink" />,
      title: 'Relatórios Visuais',
      description: 'Gráficos e dashboards que mostram o que está entrando, saindo e onde cortar gastos.',
      decoration: <Palette className="h-6 w-6 text-golden/30 absolute top-4 right-4" />
    },
    {
      icon: <Shield className="h-10 w-10 text-beauty-pink" />,
      title: 'Paz Financeira',
      description: 'Crie seu "Fundo de Paz" e nunca mais seja refém de imprevistos.',
      decoration: <Sparkles className="h-6 w-6 text-golden/30 absolute top-4 right-4" />
    },
    {
      icon: <Users className="h-10 w-10 text-beauty-pink" />,
      title: 'Comunidade VIP',
      description: 'Entre para um grupo de mulheres que se ajudam, compartilham dicas e se apoiam no crescimento.',
      decoration: <Scissors className="h-6 w-6 text-golden/30 absolute top-4 right-4" />
    },
    {
      icon: <Gift className="h-10 w-10 text-beauty-pink" />,
      title: 'Bônus Exclusivos',
      description: 'E-book, planilhas editáveis e mini consultoria com a equipe da Mirelly.',
      decoration: <Palette className="h-6 w-6 text-golden/30 absolute top-4 right-4" />
    }
  ];

  return (
    <div className="bg-white py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            O QUE VOCÊ GANHA AO ENTRAR PARA O
            <span className="text-beauty-pink block mt-2">MEU FINANCEIRO BOSS?</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-beauty-pink to-golden mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <Card key={index} className="border-2 border-gray-100 hover:border-beauty-pink/50 transition-all duration-300 hover:shadow-xl relative overflow-hidden group">
              {benefit.decoration}
              <CardContent className="p-8">
                <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </CardContent>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-beauty-pink to-golden opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-beauty-pink to-beauty-pink-dark p-8 rounded-2xl max-w-2xl mx-auto text-white shadow-2xl">
            <h3 className="text-2xl font-bold mb-4">
              🚀 Transforme seu salão em uma máquina de lucro!
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Pare de trabalhar apenas para pagar contas e comece a construir sua riqueza de verdade.
            </p>
            <Button 
              onClick={() => window.open('#checkout', '_blank')}
              size="lg"
              className="bg-white text-beauty-pink hover:bg-gray-100 font-bold px-8 py-4 text-lg shadow-lg"
            >
              Quero comprar agora 💸
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenefitsSection;