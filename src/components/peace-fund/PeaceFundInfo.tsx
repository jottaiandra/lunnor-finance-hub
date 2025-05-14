
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';

const PeaceFundInfo: React.FC = () => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          O que é o Fundo de Paz?
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4 text-sm">
        <p>
          O <strong>Fundo de Paz</strong> é uma reserva financeira estratégica que proporciona
          estabilidade emocional e segurança para enfrentar imprevistos sem comprometer
          seu orçamento mensal.
        </p>
        
        <blockquote className="border-l-4 border-primary pl-4 italic">
          "A verdadeira tranquilidade financeira não está em quanto você ganha, mas na segurança 
          que você constrói para os momentos difíceis."
        </blockquote>
        
        <div className="space-y-2">
          <p className="font-semibold">Por que ter um Fundo de Paz?</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Proteção contra emergências inesperadas</li>
            <li>Redução do estresse financeiro</li>
            <li>Liberdade para tomar melhores decisões</li>
            <li>Independência de empréstimos de emergência</li>
            <li>Segurança para você e sua família</li>
          </ul>
        </div>
        
        <p>
          Especialistas recomendam ter um fundo de emergência equivalente a 3-6 meses de despesas.
          Comece pequeno, com depósitos regulares, e observe sua tranquilidade crescer junto com seu fundo.
        </p>
      </CardContent>
    </Card>
  );
};

export default PeaceFundInfo;
