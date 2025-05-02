
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

interface EventType {
  id: string;
  name: string;
}

interface WhatsAppTemplatesProps {
  eventTypes: EventType[];
  activeTemplate: string;
  templateText: string;
  setActiveTemplate: (id: string) => void;
  setTemplateText: (text: string) => void;
  handleSaveTemplate: () => Promise<void>;
  savingTemplate: boolean;
}

const PLACEHOLDERS_HELP = `
Você pode usar os seguintes placeholders nas suas mensagens:
{nome} - Nome do usuário
{valor} - Valor da transação/saldo (formatado como moeda)
{descricao} - Descrição da transação
{categoria} - Categoria da transação
{data} - Data da transação
{titulo} - Título da meta
{progresso} - Porcentagem de progresso da meta
{mensagem} - Conteúdo personalizado
`;

const WhatsAppTemplates: React.FC<WhatsAppTemplatesProps> = ({
  eventTypes,
  activeTemplate,
  templateText,
  setActiveTemplate,
  setTemplateText,
  handleSaveTemplate,
  savingTemplate
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="space-y-4">
        <Label>Tipo de Evento</Label>
        <div className="space-y-1">
          {eventTypes.map((eventType) => (
            <Button
              key={eventType.id}
              type="button"
              variant={activeTemplate === eventType.id ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTemplate(eventType.id)}
            >
              {eventType.name}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="md:col-span-3 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="templateMessage">Modelo de Mensagem</Label>
          <Textarea
            id="templateMessage"
            placeholder="Digite o modelo de mensagem..."
            value={templateText}
            onChange={e => setTemplateText(e.target.value)}
            className="h-32"
          />
          <p className="text-xs text-muted-foreground whitespace-pre-line">
            {PLACEHOLDERS_HELP}
          </p>
        </div>
        
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleSaveTemplate}
            disabled={savingTemplate}
          >
            {savingTemplate && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Salvar Modelo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppTemplates;
