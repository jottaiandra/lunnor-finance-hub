
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCustomization } from '@/contexts/CustomizationContext';
import { toast } from 'sonner';
import { Paintbrush, Type, Palette } from 'lucide-react';

const CustomizationSettings: React.FC = () => {
  const { settings, updateSettings } = useCustomization();
  const [form, setForm] = useState({ ...settings });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await updateSettings(form);
      toast.success('Configurações de customização atualizadas');
    } catch (error) {
      console.error(error);
      toast.error('Falha ao atualizar as configurações de customização');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Paintbrush className="h-5 w-5" />
          Customização da Plataforma
        </CardTitle>
        <CardDescription>
          Personalize a aparência e identidade da plataforma
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="branding">
            <TabsList className="mb-4">
              <TabsTrigger value="branding">
                <Type className="mr-2 h-4 w-4" />
                Identidade
              </TabsTrigger>
              <TabsTrigger value="colors">
                <Palette className="mr-2 h-4 w-4" />
                Cores
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="branding" className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="platformName">Nome da Plataforma</Label>
                <Input
                  id="platformName"
                  value={form.platformName}
                  onChange={(e) => handleChange('platformName', e.target.value)}
                  placeholder="Nome da plataforma"
                />
                <p className="text-sm text-muted-foreground">
                  Este nome será exibido em toda a plataforma, incluindo o cabeçalho e o rodapé.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="colors" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Cor Primária</Label>
                  <div className="flex gap-2">
                    <div 
                      className="w-10 h-10 rounded border" 
                      style={{ backgroundColor: form.primaryColor }}
                    ></div>
                    <Input
                      id="primaryColor"
                      type="text"
                      value={form.primaryColor}
                      onChange={(e) => handleChange('primaryColor', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="positiveColor">Cor Positiva (Sucesso)</Label>
                  <div className="flex gap-2">
                    <div 
                      className="w-10 h-10 rounded border" 
                      style={{ backgroundColor: form.positiveColor }}
                    ></div>
                    <Input
                      id="positiveColor"
                      type="text"
                      value={form.positiveColor}
                      onChange={(e) => handleChange('positiveColor', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="negativeColor">Cor Negativa (Erro)</Label>
                  <div className="flex gap-2">
                    <div 
                      className="w-10 h-10 rounded border" 
                      style={{ backgroundColor: form.negativeColor }}
                    ></div>
                    <Input
                      id="negativeColor"
                      type="text"
                      value={form.negativeColor}
                      onChange={(e) => handleChange('negativeColor', e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mt-2">
                  Estas cores serão aplicadas em toda a plataforma incluindo botões, links e indicadores.
                </p>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full md:w-auto"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CustomizationSettings;
