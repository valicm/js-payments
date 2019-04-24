export interface NotificationEvent {
  type: string;
  content: string;
}

export enum NotificationType {
  Error = 'ERROR',
  Info = 'INFO',
  Success = 'SUCCESS',
  Warning = 'WARNING'
}
