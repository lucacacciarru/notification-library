import { NotificationSingle } from '../classes/NotificationSingle';

export function changeSenderNotification(
  oldNotification: NotificationSingle,
  sender: string
): NotificationSingle {
  const notificationNewSender = {
    ...oldNotification,
    sender: sender,
  };

  return notificationNewSender;
}
