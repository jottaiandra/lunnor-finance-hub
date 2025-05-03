
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { useWhatsAppSettings, EVENT_TYPES } from '@/hooks/whatsapp/useWhatsAppSettings';
import WhatsAppConfig from './WhatsAppConfig';
import WhatsAppTemplates from './WhatsAppTemplates';
import WhatsAppLogs from './WhatsAppLogs';
import { Badge } from '@/components/ui/badge';

const WhatsAppSettings: React.FC = () => {
  const {
    user,
    loading,
    activeTab,
    setActiveTab,
    config,
    setConfig,
    activeTemplate,
    setActiveTemplate,
    templateText,
    setTemplateText,
    logs,
    loadingLogs,
    refreshLogs,
    testingConnection,
    savingConfig,
    savingTemplate,
    configuringWebhook,
    handleSaveConfig,
    handleTestConnection,
    handleConfigureWebhook,
    handleAddRecipient,
    handleRemoveRecipient,
    handleRecipientChange,
    handleSaveTemplate,
  } = useWhatsAppSettings();
  
  if (loading && !config) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Configurações do WhatsApp</CardTitle>
        <Badge variant={config.isEnabled ? "default" : "outline"}>
          {config.isEnabled ? "Ativo" : "Inativo"}
        </Badge>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="config">Configuração</TabsTrigger>
            <TabsTrigger value="templates">Modelos de Mensagem</TabsTrigger>
            <TabsTrigger value="logs">Histórico</TabsTrigger>
          </TabsList>
          
          <TabsContent value="config" className="space-y-4">
            <WhatsAppConfig 
              config={config}
              setConfig={setConfig}
              handleSaveConfig={handleSaveConfig}
              handleTestConnection={handleTestConnection}
              handleConfigureWebhook={handleConfigureWebhook}
              handleAddRecipient={handleAddRecipient}
              handleRemoveRecipient={handleRemoveRecipient}
              handleRecipientChange={handleRecipientChange}
              savingConfig={savingConfig}
              testingConnection={testingConnection}
              configuringWebhook={configuringWebhook}
            />
          </TabsContent>
          
          <TabsContent value="templates" className="space-y-4">
            <WhatsAppTemplates 
              eventTypes={EVENT_TYPES}
              activeTemplate={activeTemplate}
              templateText={templateText}
              setActiveTemplate={setActiveTemplate}
              setTemplateText={setTemplateText}
              handleSaveTemplate={handleSaveTemplate}
              savingTemplate={savingTemplate}
            />
          </TabsContent>
          
          <TabsContent value="logs" className="space-y-4">
            <WhatsAppLogs 
              logs={logs}
              eventTypes={EVENT_TYPES}
              loading={loadingLogs}
              onRefresh={refreshLogs}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WhatsAppSettings;
