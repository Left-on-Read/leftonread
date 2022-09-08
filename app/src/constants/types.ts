export type NotificationSettings = {
  responseRemindersEnabled: boolean;
};

export type ScheduledMessage = {
  id: string;
  message: string;
  phoneNumber: string;
  contactName: string;
  sendDate: Date;
};
