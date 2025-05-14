
export interface AlertConfig {
  balanceThreshold: number;
  monitoredCategories: string[];
  showCategoryAlerts: boolean;
  showGoalAlerts: boolean;
  showBalanceAlerts: boolean;
  showTrendAlerts: boolean;
}

export const DefaultAlertConfig: AlertConfig = {
  balanceThreshold: 1000,
  monitoredCategories: [],
  showCategoryAlerts: true,
  showGoalAlerts: true,
  showBalanceAlerts: true,
  showTrendAlerts: true,
};

export const loadAlertConfig = (): AlertConfig => {
  try {
    const savedConfig = localStorage.getItem('lunnorAlertConfig');
    if (savedConfig) {
      return JSON.parse(savedConfig);
    }
  } catch (error) {
    console.error('Error parsing alert config:', error);
  }
  return DefaultAlertConfig;
};
