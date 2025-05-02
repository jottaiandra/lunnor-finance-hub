
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/sonner';
import { Trash2, Plus, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { 
  fetchWhatsappConfig, 
  saveWhatsappConfig,
  testWhatsappConnection,
  fetchWhatsappTemplates,
  saveWhatsappTemplate,
  fetchWhatsappLogs,
  WhatsappConfig,
  WhatsappTemplate,
  WhatsappLog
} from '@/contexts/finance/whatsappService';

const EVENT_TYPES = [
  { id: 'new_income', name: 'Nova receita' },
  { id: 'new_expense', name: 'Nova despesa' },
  { id: 'upcoming_expense', name: 'Despesas a vencer' },
  { id: 'goal_achieved', name: 'Meta alcançada' },
  { id: 'low_balance', name: 'Saldo baixo' },
  { id: 'goal_updated', name: 'Meta atualizada' },
  { id: 'transaction_updated', name: 'Transação atualizada' }
];

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

const WhatsAppSettings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('config');
  const [loading, setLoading] = useState(true);
  const [testingConnection, setTestingConnection] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  const [savingTemplate, setSavingTemplate] = useState(false);
  
  // Config state
  const [config, setConfig] = useState<Partial<WhatsappConfig>>({
    apiToken: '',
    senderNumber: '',
    recipientNumbers: [''],
    isEnabled: true,
    notificationFrequency: 'immediate'
  });
  
  // Templates state
  const [templates, setTemplates] = useState<WhatsappTemplate[]>([]);
  const [activeTemplate, setActiveTemplate] = useState<string>('new_income');
  const [templateText, setTemplateText] = useState<string>('');
  
  // Logs state
  const [logs, setLogs] = useState<WhatsappLog[]>([]);
  
  useEffect(() => {
    if (user) {
      loadConfig();
      loadTemplates();
      loadLogs();
    }
  }, [user]);
  
  useEffect(() => {
    // When active template changes, load the template text
    const template = templates.find(t => t.eventType === activeTemplate);
    if (template) {
      setTemplateText(template.messageTemplate);
    } else {
      // Load default template
      const defaultTemplate = EVENT_TYPES.find(et => et.id === activeTemplate);
      if (defaultTemplate) {
        switch (defaultTemplate.id) {
          case 'new_income':
            setTemplateText("Olá {nome}! Uma nova receita de {valor} foi registrada com a descrição: {descricao}.");
            break;
          case 'new_expense':
            setTemplateText("Atenção {nome}! Uma nova despesa de {valor} foi registrada com a descrição: {descricao}.");
            break;
          case 'upcoming_expense':
            setTemplateText("Lembrete: Você tem {count} despesa(s) a vencer nos próximos dias, totalizando {valor}.");
            break;
          case 'goal_achieved':
            setTemplateText("Parabéns {nome}! Sua meta '{titulo}' foi atingida com sucesso!");
            break;
          case 'low_balance':
            setTemplateText("Alerta! Seu saldo atual de {valor} está abaixo do limite definido.");
            break;
          case 'goal_updated':
            setTemplateText("A meta '{titulo}' foi atualizada. Progresso atual: {progresso}%.");
            break;
          case 'transaction_updated':
            setTemplateText("Uma transação foi atualizada: {descricao} - {valor}");
            break;
          default:
            setTemplateText("Notificação do Lunnor Caixa: {mensagem}");
        }
      }
    }
  }, [activeTemplate, templates]);
  
  const loadConfig = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const data = await fetchWhatsappConfig(user.id);
      if (data) {
        setConfig({
          apiToken: data.apiToken,
          senderNumber: data.senderNumber,
          recipientNumbers: data.recipientNumbers,
          isEnabled: data.isEnabled,
          notificationFrequency: data.notificationFrequency
        });
      }
    } catch (error) {
      console.error("Error loading WhatsApp config:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const loadTemplates = async () => {
    if (!user) return;
    
    try {
      const data = await fetchWhatsappTemplates(user.id);
      setTemplates(data);
    } catch (error) {
      console.error("Error loading WhatsApp templates:", error);
    }
  };
  
  const loadLogs = async () => {
    if (!user) return;
    
    try {
      const data = await fetchWhatsappLogs(user.id);
      setLogs(data);
    } catch (error) {
      console.error("Error loading WhatsApp logs:", error);
    }
  };
  
  const handleSaveConfig = async () => {
    if (!user) return;
    
    setSavingConfig(true);
    try {
      // Validate inputs
      if (!config.apiToken) {
        toast.error("Token da API é obrigatório");
        return;
      }
      
      if (!config.senderNumber) {
        toast.error("Número remetente é obrigatório");
        return;
      }
      
      if (!config.recipientNumbers || config.recipientNumbers.length === 0 || !config.recipientNumbers[0]) {
        toast.error("Pelo menos um número destinatário é obrigatório");
        return;
      }
      
      // Filter out empty recipient numbers
      const filteredRecipients = config.recipientNumbers.filter(num => num.trim() !== '');
      
      const result = await saveWhatsappConfig(user.id, {
        apiToken: config.apiToken || '',
        senderNumber: config.senderNumber || '',
        recipientNumbers: filteredRecipients,
        isEnabled: config.isEnabled ?? true,
        notificationFrequency: config.notificationFrequency as 'immediate' | 'daily' | 'critical' || 'immediate'
      });
      
      if (result) {
        toast.success("Configurações do WhatsApp salvas com sucesso!");
      }
    } catch (error) {
      console.error("Error saving WhatsApp config:", error);
      toast.error("Erro ao salvar configurações do WhatsApp");
    } finally {
      setSavingConfig(false);
    }
  };
  
  const handleTestConnection = async () => {
    if (!user) return;
    
    if (!config.apiToken || !config.senderNumber || !config.recipientNumbers || config.recipientNumbers.length === 0) {
      toast.error("Preencha todos os campos antes de testar a conexão");
      return;
    }
    
    setTestingConnection(true);
    try {
      const result = await testWhatsappConnection(
        config.apiToken,
        config.senderNumber,
        config.recipientNumbers[0]
      );
      
      if (result) {
        toast.success("Conexão testada com sucesso!");
      } else {
        toast.error("Falha ao conectar com a Evolution API");
      }
    } catch (error) {
      console.error("Error testing connection:", error);
      toast.error("Erro ao testar conexão");
    } finally {
      setTestingConnection(false);
    }
  };
  
  const handleAddRecipient = () => {
    setConfig(prev => ({
      ...prev,
      recipientNumbers: [...(prev.recipientNumbers || []), '']
    }));
  };
  
  const handleRemoveRecipient = (index: number) => {
    setConfig(prev => {
      const newRecipients = [...(prev.recipientNumbers || [])];
      newRecipients.splice(index, 1);
      return {
        ...prev,
        recipientNumbers: newRecipients
      };
    });
  };
  
  const handleRecipientChange = (index: number, value: string) => {
    setConfig(prev => {
      const newRecipients = [...(prev.recipientNumbers || [])];
      newRecipients[index] = value;
      return {
        ...prev,
        recipientNumbers: newRecipients
      };
    });
  };
  
  const handleSaveTemplate = async () => {
    if (!user || !activeTemplate) return;
    
    setSavingTemplate(true);
    try {
      const result = await saveWhatsappTemplate(user.id, {
        eventType: activeTemplate,
        messageTemplate: templateText
      });
      
      if (result) {
        // Update templates list
        await loadTemplates();
        toast.success("Modelo de mensagem salvo com sucesso!");
      }
    } catch (error) {
      console.error("Error saving template:", error);
      toast.error("Erro ao salvar modelo de mensagem");
    } finally {
      setSavingTemplate(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Configurações do WhatsApp</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="config">Configuração</TabsTrigger>
            <TabsTrigger value="templates">Modelos de Mensagem</TabsTrigger>
            <TabsTrigger value="logs">Histórico</TabsTrigger>
          </TabsList>
          
          <TabsContent value="config" className="space-y-4">
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
          </TabsContent>
          
          <TabsContent value="templates" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-4">
                <Label>Tipo de Evento</Label>
                <div className="space-y-1">
                  {EVENT_TYPES.map((eventType) => (
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
          </TabsContent>
          
          <TabsContent value="logs" className="space-y-4">
            {logs.length > 0 ? (
              <div className="border rounded-md">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted border-b">
                      <th className="text-left p-2">Data/Hora</th>
                      <th className="text-left p-2">Evento</th>
                      <th className="text-left p-2">Destinatário</th>
                      <th className="text-left p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log.id} className="border-b last:border-0 hover:bg-muted/50">
                        <td className="p-2 text-sm">
                          {log.sentAt.toLocaleString('pt-BR')}
                        </td>
                        <td className="p-2 text-sm">
                          {EVENT_TYPES.find(et => et.id === log.eventType)?.name || log.eventType}
                        </td>
                        <td className="p-2 text-sm">
                          {log.recipient}
                        </td>
                        <td className="p-2 text-sm">
                          <div className="flex items-center">
                            {log.status === 'sent' || log.status === 'delivered' ? (
                              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                            )}
                            {log.status}
                            {log.errorMessage && <span className="ml-2 text-xs text-red-500">{log.errorMessage}</span>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                Nenhum registro de mensagem encontrado
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WhatsAppSettings;
