
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: 'Rafael Oliveira',
      role: 'Pequeno Empresário',
      content: 'O Lunnor Caixa transformou completamente como gerencio as finanças da minha empresa. Interface intuitiva e recursos poderosos!',
      stars: 5
    },
    {
      name: 'Ana Silva',
      role: 'Contadora',
      content: 'Como contadora, preciso de precisão e confiabilidade. Esta plataforma entrega isso e muito mais, facilitando meu trabalho diário.',
      stars: 5
    },
    {
      name: 'Carlos Mendes',
      role: 'Gerente Financeiro',
      content: 'Os relatórios detalhados e a capacidade de definir metas nos ajudaram a melhorar significativamente nosso controle financeiro.',
      stars: 5
    }
  ];

  return (
    <div className="bg-gray-50 py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">O Que Nossos Clientes Dizem</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubra como o Lunnor Caixa tem ajudado empresas e profissionais a transformar sua gestão financeira.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-lg bg-white">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {Array.from({ length: testimonial.stars }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                    {testimonial.name[0]}
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
