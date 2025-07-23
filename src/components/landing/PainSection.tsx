import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, TrendingDown, Clock } from 'lucide-react';

const PainSection: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Você trabalha duro, agenda lotada, mas na hora de olhar o extrato…
            <span className="text-beauty-pink"> cadê o dinheiro?</span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Se sente cansada, perdida nas contas e com medo de não conseguir realizar seus sonhos?
            <br />
            <strong className="text-beauty-pink">Você não está sozinha!</strong>
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-2 border-gray-100 hover:border-beauty-pink/30 transition-all duration-300">
            <CardContent className="p-8 text-center">
              <AlertTriangle className="h-12 w-12 text-beauty-pink mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Dinheiro que Desaparece</h3>
              <p className="text-gray-600">
                Trabalha o mês todo, atende muito, mas no final não sobra nada. 
                O dinheiro some e você não sabe para onde foi.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-gray-100 hover:border-beauty-pink/30 transition-all duration-300">
            <CardContent className="p-8 text-center">
              <TrendingDown className="h-12 w-12 text-beauty-pink mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Sem Controle das Contas</h3>
              <p className="text-gray-600">
                Não sabe quanto entra, quanto sai, quanto deve guardar. 
                Vive no sufoco, sempre correndo atrás do prejuízo.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-gray-100 hover:border-beauty-pink/30 transition-all duration-300">
            <CardContent className="p-8 text-center">
              <Clock className="h-12 w-12 text-beauty-pink mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Sonhos Adiados</h3>
              <p className="text-gray-600">
                Aquela viagem, o salão novo, o curso dos sonhos... 
                Tudo fica para depois porque "não tem dinheiro".
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center mt-16">
          <div className="bg-beauty-pink-light p-8 rounded-2xl max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-beauty-pink mb-4">
              Com o Meu Financeiro Boss, você nunca mais vai sentir vergonha de falar sobre dinheiro.
            </h3>
            <p className="text-lg text-gray-700">
              É hora de transformar seu esforço em riqueza de verdade e conquistar a vida que você merece!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PainSection;