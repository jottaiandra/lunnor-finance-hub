
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CircleDollarSign, Mail, MapPin, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ContatoPage: React.FC = () => {
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Mensagem enviada!",
      description: "Agradecemos seu contato. Responderemos em breve.",
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Menu de navegação */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <CircleDollarSign className="h-8 w-8 text-primary" />
              <Link to="/" className="ml-2 text-2xl font-bold text-primary">Lunnor Caixa</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-gray-700 hover:text-primary transition-colors">
                Início
              </Link>
              <Link to="/sobre" className="text-gray-700 hover:text-primary transition-colors">
                Sobre
              </Link>
              <Link to="/contato" className="text-primary font-medium transition-colors">
                Contato
              </Link>
              <Link to="/auth">
                <Button>Entrar</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">Entre em contato</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tem alguma dúvida ou sugestão? Entre em contato conosco. Nossa equipe está pronta para ajudar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          <div className="bg-white shadow-md rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Envie uma mensagem</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input id="name" placeholder="Seu nome completo" required />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="seu@email.com" required />
              </div>
              <div>
                <Label htmlFor="subject">Assunto</Label>
                <Input id="subject" placeholder="Assunto da mensagem" required />
              </div>
              <div>
                <Label htmlFor="message">Mensagem</Label>
                <Textarea 
                  id="message" 
                  placeholder="Descreva sua mensagem em detalhes" 
                  className="min-h-[150px]" 
                  required 
                />
              </div>
              <Button type="submit" className="w-full">Enviar mensagem</Button>
            </form>
          </div>

          <div className="bg-white shadow-md rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Informações de contato</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <Mail className="h-6 w-6 text-primary mr-4 mt-1" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-gray-600">contato@lunnorcaixa.com</p>
                  <p className="text-gray-600">suporte@lunnorcaixa.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="h-6 w-6 text-primary mr-4 mt-1" />
                <div>
                  <p className="font-medium">Telefone</p>
                  <p className="text-gray-600">(11) 1234-5678</p>
                  <p className="text-gray-600">(11) 9876-5432</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="h-6 w-6 text-primary mr-4 mt-1" />
                <div>
                  <p className="font-medium">Endereço</p>
                  <p className="text-gray-600">Avenida Paulista, 1000</p>
                  <p className="text-gray-600">São Paulo, SP - 01310-100</p>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-2">Horário de atendimento</h3>
                <p className="text-gray-600">Segunda a Sexta: 9h às 18h</p>
                <p className="text-gray-600">Sábado: 9h às 13h</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContatoPage;
