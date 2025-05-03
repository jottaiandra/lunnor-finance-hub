
export interface WebhookEvent {
  id: string;
  event_type: string;
  sender_number: string;
  recipient_number: string;
  content: string;
  message_type: string;
  status: string;
  raw_data: any;
  created_at: string;
}

export interface MessageLog {
  id: string;
  number: string;
  message: string;
  status: string;
  response: any;
  created_at: string;
}

export interface StatusOption {
  value: string;
  label: string;
}
