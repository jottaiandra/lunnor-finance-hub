
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFinance } from '@/contexts/FinanceContext';
import { ExpenseCategory } from '@/types';
import { toast } from '@/components/ui/sonner';

interface AlertConfig {
  balanceThreshold: number;
  monitoredCategories: string[];
  showCategoryAlerts: boolean;
  showGoalAlerts: boolean;
  showBalanceAlerts: boolean;
  showTrendAlerts: boolean;
}

const DEFAULT_CONFIG: AlertConfig = {
  balanceThreshold: 1000,
  monitoredCategories: [],
  showCategoryAlerts: true,
  showGoalAlerts: true,
  showBalanceAlerts: true,
  showTrendAlerts: true,
};

const AlertSettings: React.FC = () => {
  const { state } = useFinance();
  const [config, setConfig] = useState<AlertConfig>(DEFAULT_CONFIG);
  
  // Load config from localStorage
  useEffect(() => {
    const savedConfig = localStorage.getItem('lunnorAlertConfig');
    if (savedConfig) {
      try {
        setConfig(JSON.parse(savedConfig));
      } catch (error) {
        console.error('Error parsing alert config:', error);
      }
    }
  }, []);
  
  // Save config to localStorage
  const saveConfig = (newConfig: AlertConfig) => {
    localStorage.setItem('lunnorAlertConfig', JSON.stringify(newConfig));
    setConfig(newConfig);
    toast.success("Configurações de alertas salvas com sucesso");
  };
  
  // Get unique categories from transactions
  const getCategories = () => {
    const categories = new Set<string>();
    state.transactions.forEach(t => {
      if (t.type === 'expense') {
        categories.add(t.category);
      }
    });
    return Array.from(categories);
  };
  
  const categories = getCategories();
  
  // Handle changes
  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setConfig(prev => ({ ...prev, balanceThreshold: value }));
    }
  };
  
  const handleCategoryToggle = (category: string) => {
    setConfig(prev => {
      const newMonitored = prev.monitoredCategories.includes(category)
        ? prev.monitoredCategories.filter(c => c !== category)
        : [...prev.monitoredCategories, category];
      
      return { ...prev, monitoredCategories: newMonitored };
    });
  };
  
  const handleSwitchChange = (key: keyof AlertConfig, value: boolean) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Configurações de Alertas</CardTitle>
        <CardDescription>
          Personalize os tipos de alertas que você deseja receber no dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="balanceThreshold">Limite de saldo para alerta (R$)</Label>
              <div className="w-[160px]">
                <Input
                  id="balanceThreshold"
                  type="number"
                  min="0"
                  step="100"
                  value={config.balanceThreshold}
                  onChange={handleThresholdChange}
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Você será notificado quando seu saldo estiver abaixo deste valor
            </p>
          </div>
          
          <div className="space-y-2">
            <Label>Tipos de alertas</Label>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base" htmlFor="showBalanceAlerts">Alertas de saldo</Label>
                  <p className="text-sm text-muted-foreground">Receber avisos sobre saldo baixo e movimentações</p>
                </div>
                <Switch
                  id="showBalanceAlerts"
                  checked={config.showBalanceAlerts}
                  onCheckedChange={(checked) => handleSwitchChange('showBalanceAlerts', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base" htmlFor="showGoalAlerts">Alertas de metas</Label>
                  <p className="text-sm text-muted-foreground">Receber avisos sobre progresso das suas metas</p>
                </div>
                <Switch
                  id="showGoalAlerts"
                  checked={config.showGoalAlerts}
                  onCheckedChange={(checked) => handleSwitchChange('showGoalAlerts', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base" htmlFor="showCategoryAlerts">Alertas de categorias</Label>
                  <p className="text-sm text-muted-foreground">Receber avisos sobre gastos por categoria</p>
                </div>
                <Switch
                  id="showCategoryAlerts"
                  checked={config.showCategoryAlerts}
                  onCheckedChange={(checked) => handleSwitchChange('showCategoryAlerts', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base" htmlFor="showTrendAlerts">Alertas de tendências</Label>
                  <p className="text-sm text-muted-foreground">Receber avisos sobre tendências de gastos e receitas</p>
                </div>
                <Switch
                  id="showTrendAlerts"
                  checked={config.showTrendAlerts}
                  onCheckedChange={(checked) => handleSwitchChange('showTrendAlerts', checked)}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="categories">Categorias monitoradas</Label>
            {categories.length > 0 ? (
              <ScrollArea className="h-[200px] border rounded-md p-4">
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center gap-2">
                      <Switch
                        id={`category-${category}`}
                        checked={config.monitoredCategories.includes(category)}
                        onCheckedChange={() => handleCategoryToggle(category)}
                      />
                      <Label htmlFor={`category-${category}`}>{category}</Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhuma categoria de despesa encontrada. Adicione transações para monitorar categorias.
              </p>
            )}
          </div>
          
          <Button className="w-full" onClick={() => saveConfig(config)}>Salvar configurações</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertSettings;
