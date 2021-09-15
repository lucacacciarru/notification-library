import { NotificationSingle } from '../classes/NotificationSingle';

export function pathLocalNotification(
  oldNotification: NotificationSingle,
  timestamp: number
): NotificationSingle {
  const newNotification = {
    ...oldNotification,
    read: true,
    read_at: timestamp,
  };

  return newNotification;
}
