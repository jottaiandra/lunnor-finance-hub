import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Karol',
      role: 'Nail Designer',
      content: 'Eu só pensava que dinheiro era para pagar conta. Hoje, tenho reserva, fiz minha viagem e estou em paz!',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      stars: 5
    },
    {
      name: 'Amanda',
      role: 'Cabeleireira',
      content: 'Parei de trabalhar só para pagar boleto. Agora eu sei exatamente quanto recebo e quanto posso investir!',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      stars: 5
    },
    {
      name: 'Gisele',
      role: 'Lash Designer',
      content: 'Meu Financeiro Boss mudou a minha relação com o salão e com a minha família. Realizei sonhos que pareciam distantes!',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      stars: 5
    }
  ];

  return (
    <div className="bg-gradient-to-b from-beauty-pink-light to-white py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Veja o que nossas <span className="text-beauty-pink">Boss</span> estão falando
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Mulheres reais que transformaram suas vidas financeiras e conquistaram a liberdade que sempre sonharam.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-beauty-pink to-golden mx-auto mt-6"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-xl bg-white hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-beauty-pink to-golden"></div>
              <CardContent className="p-8">
                <Quote className="h-8 w-8 text-beauty-pink/30 mb-4" />
                <div className="flex mb-4">
                  {Array.from({ length: testimonial.stars }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-golden fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic leading-relaxed text-lg">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className="relative">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-full object-cover border-3 border-beauty-pink"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = "https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80";
                      }}
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-beauty-pink rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="font-bold text-gray-900 text-lg">{testimonial.name}</p>
                    <p className="text-beauty-pink font-medium">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-beauty-pink/20 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-beauty-pink mb-4">
              ✨ Você também pode ser a próxima!
            </h3>
            <p className="text-lg text-gray-700 mb-6">
              Junte-se a centenas de mulheres que já transformaram suas vidas financeiras.
            </p>
            <div className="flex justify-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-6 w-6 text-golden fill-current" />
              ))}
              <span className="ml-2 text-gray-600 font-medium">4.9/5 - Mais de 500 avaliações</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;