import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, BookOpen, FileSpreadsheet, MessageCircle, Clock, Zap } from 'lucide-react';

const BonusSection: React.FC = () => {
  const bonuses = [
    {
      icon: <BookOpen className="h-8 w-8 text-golden" />,
      title: 'E-book Meu Financeiro Boss',
      description: 'Guia completo com estratégias para organizar suas finanças',
      value: 'R$ 97'
    },
    {
      icon: <FileSpreadsheet className="h-8 w-8 text-golden" />,
      title: 'Planilha Prática',
      description: 'Planilhas editáveis para controlar seu fluxo de caixa',
      value: 'R$ 67'
    },
    {
      icon: <MessageCircle className="h-8 w-8 text-golden" />,
      title: 'Mini Consultoria Exclusiva',
      description: 'Sessão personalizada com a equipe da Mirelly',
      value: 'R$ 197'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-golden/10 via-white to-beauty-pink/10 py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-golden/20 px-6 py-3 rounded-full mb-6">
            <Clock className="h-5 w-5 text-golden" />
            <span className="font-bold text-golden text-lg">SÓ HOJE</span>
            <Zap className="h-5 w-5 text-golden" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            Ao se inscrever, você recebe
            <span className="text-beauty-pink block mt-2">BÔNUS EXCLUSIVOS!</span>
          </h2>
          
          <div className="w-24 h-1 bg-gradient-to-r from-beauty-pink to-golden mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {bonuses.map((bonus, index) => (
            <Card key={index} className="border-2 border-golden/30 hover:border-golden transition-all duration-300 hover:shadow-xl relative overflow-hidden group bg-white">
              <div className="absolute top-0 right-0 bg-golden text-white px-3 py-1 text-sm font-bold rounded-bl-lg">
                {bonus.value}
              </div>
              <CardContent className="p-8 text-center">
                <div className="mb-6 flex justify-center group-hover:scale-110 transition-transform duration-300">
                  <div className="p-3 bg-golden/10 rounded-full">
                    {bonus.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">{bonus.title}</h3>
                <p className="text-gray-600 leading-relaxed">{bonus.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <div className="bg-gradient-to-r from-beauty-pink to-beauty-pink-dark p-8 rounded-2xl max-w-3xl mx-auto text-white shadow-2xl relative overflow-hidden">
            <Gift className="absolute top-4 right-4 h-12 w-12 text-white/20" />
            
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              🎁 Valor Total dos Bônus: R$ 361
            </h3>
            
            <p className="text-xl mb-6 opacity-90">
              Mas hoje você leva TUDO por apenas uma fração desse valor!
            </p>
            
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl mb-6">
              <p className="text-lg font-semibold">
                ⚡ Não perca! Oferta por tempo limitado.
              </p>
            </div>
            
            <Button 
              onClick={() => window.open('#checkout', '_blank')}
              size="lg"
              className="bg-white text-beauty-pink hover:bg-gray-100 font-bold px-10 py-5 text-xl shadow-lg animate-pulse"
            >
              Quero comprar agora 💸
            </Button>
            
            <p className="text-sm mt-4 opacity-80">
              👑 Seja uma das primeiras a transformar sua vida financeira
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BonusSection;