
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Info } from 'lucide-react';

const PeaceFundInfo: React.FC = () => {
  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          O que é o Fundo de Paz?
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p>
          O <strong>Fundo de Paz</strong> é uma reserva financeira estratégica que proporciona
          estabilidade emocional e segurança para enfrentar imprevistos sem comprometer
          seu orçamento mensal.
        </p>
        
        <blockquote className="border-l-4 border-primary/30 pl-4 italic bg-muted/50 p-3 rounded-r-md">
          "A verdadeira tranquilidade financeira não está em quanto você ganha, mas na segurança 
          que você constrói para os momentos difíceis."
        </blockquote>
        
        <div className="space-y-2 bg-card p-4 rounded-lg border">
          <h3 className="font-semibold flex items-center gap-2">
            <Info className="h-4 w-4 text-primary" />
            Por que ter um Fundo de Paz?
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            <li className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              Proteção contra emergências
            </li>
            <li className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              Redução do estresse financeiro
            </li>
            <li className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              Liberdade para melhores decisões
            </li>
            <li className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              Independência de empréstimos
            </li>
            <li className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              Segurança para família
            </li>
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
