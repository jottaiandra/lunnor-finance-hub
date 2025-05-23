import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus, Send, Trash2, Webhook } from 'lucide-react';
import { WhatsappConfig } from '@/contexts/finance/whatsapp/types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from '@/components/ui/sonner';

interface WhatsAppConfigProps {
  config: Partial<WhatsappConfig>;
  setConfig: React.Dispatch<React.SetStateAction<Partial<WhatsappConfig>>>;
  handleSaveConfig: () => Promise<void>;
  handleTestConnection: () => Promise<void>;
  handleConfigureWebhook: () => Promise<void>;
  handleAddRecipient: () => void;
  handleRemoveRecipient: (index: number) => void;
  handleRecipientChange: (index: number, value: string) => void;
  savingConfig: boolean;
  testingConnection: boolean;
  configuringWebhook: boolean;
}

const WhatsAppConfig: React.FC<WhatsAppConfigProps> = ({
  config,
  setConfig,
  handleSaveConfig,
  handleTestConnection,
  handleConfigureWebhook,
  handleAddRecipient,
  handleRemoveRecipient,
  handleRecipientChange,
  savingConfig,
  testingConnection,
  configuringWebhook
}) => {
  // Generate the webhook URL for this project
  const baseUrl = window.location.origin;
  const webhookEndpoint = `https://dpfteiyxodigjvzzrwbt.supabase.co/functions/v1/evolution-webhook`;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between space-x-2">
        <Label htmlFor="isEnabled" className="font-medium">Ativar notificações por WhatsApp</Label>
        <Switch
          id="isEnabled"
          checked={config.isEnabled}
          onCheckedChange={checked => setConfig(prev => ({ ...prev, isEnabled: checked }))}
        />
      </div>
      
      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="apiToken">Token da API Evolution</Label>
          <Input
            id="apiToken"
            type="password"
            placeholder="Seu token da API Evolution"
            value={config.apiToken || ''}
            onChange={e => setConfig(prev => ({ ...prev, apiToken: e.target.value }))}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="senderNumber">Número Remetente (com código do país)</Label>
          <Input
            id="senderNumber"
            placeholder="Ex: 5511999999999"
            value={config.senderNumber || ''}
            onChange={e => setConfig(prev => ({ ...prev, senderNumber: e.target.value }))}
          />
          <p className="text-xs text-muted-foreground">Número configurado na Evolution API</p>
        </div>
        
        <div className="space-y-2">
          <Label>Números Destinatários (com código do país)</Label>
          <div className="space-y-2">
            {config.recipientNumbers?.map((recipient, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  placeholder="Ex: 5511999999999"
                  value={recipient}
                  onChange={e => handleRecipientChange(index, e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveRecipient(index)}
                  disabled={config.recipientNumbers?.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddRecipient}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" /> Adicionar número
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="frequency">Frequência de Notificações</Label>
          <Select
            value={config.notificationFrequency}
            onValueChange={value => setConfig(prev => ({ ...prev, notificationFrequency: value as any }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma frequência" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="immediate">Imediatamente</SelectItem>
              <SelectItem value="daily">Resumo diário</SelectItem>
              <SelectItem value="critical">Apenas eventos críticos</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Webhook Configuration Section */}
        <div className="space-y-2 border-t pt-4 mt-4">
          <div className="flex items-center">
            <Webhook className="h-5 w-5 mr-2" />
            <Label className="text-lg">Configuração de Webhook</Label>
          </div>
          
          <Alert>
            <AlertDescription>
              Para receber eventos do WhatsApp, configure este webhook na Evolution API:
            </AlertDescription>
          </Alert>
          
          <div className="flex items-center space-x-2 mt-2">
            <Input 
              value={webhookEndpoint}
              readOnly 
              className="font-mono text-sm bg-muted"
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(webhookEndpoint);
                      toast.success("URL copiada para a área de transferência");
                    }}
                  >
                    Copiar
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copiar URL do webhook</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <Button
            type="button"
            variant="outline"
            onClick={handleConfigureWebhook}
            disabled={configuringWebhook || !config.apiToken || !config.senderNumber}
            className="mt-2"
          >
            {configuringWebhook && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            <Webhook className="h-4 w-4 mr-2" />
            Configurar Webhook Automaticamente
          </Button>
          <p className="text-xs text-muted-foreground">
            Este botão configura automaticamente o webhook na Evolution API para receber eventos.
          </p>
        </div>
        
        <div className="flex items-center justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleTestConnection}
            disabled={testingConnection}
          >
            {testingConnection && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Testar Conexão
          </Button>
          <Button
            type="button"
            onClick={handleSaveConfig}
            disabled={savingConfig}
          >
            {savingConfig && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Salvar Configurações
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppConfig;
