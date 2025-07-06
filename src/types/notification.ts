export interface Notification {
  id: string;
  user_id: string;
  type: 'offer' | 'voucher' | 'achievement' | 'system' | 'performance' | 'opportunity';
  title: string;
  message: string;
  icon?: string;
  action_url?: string;
  action_text?: string;
  is_read: boolean;
  created_at: string;
  updated_at?: string;
}

export type NotificationType = Notification['type'];