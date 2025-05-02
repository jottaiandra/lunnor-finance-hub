
// Types for WhatsApp configuration
export interface WhatsappConfig {
  id: string;
  userId: string;
  apiToken: string;
  senderNumber: string;
  recipientNumbers: string[];
  isEnabled: boolean;
  notificationFrequency: 'immediate' | 'daily' | 'critical';
  createdAt: Date;
  updatedAt: Date;
}

// Types for message templates
export interface WhatsappTemplate {
  id: string;
  userId: string;
  eventType: string;
  messageTemplate: string;
  createdAt: Date;
  updatedAt: Date;
}

// Types for message logs
export interface WhatsappLog {
  id: string;
  userId: string;
  eventType: string;
  message: string;
  recipient: string;
  status: string;
  sentAt: Date;
  errorMessage?: string;
}
