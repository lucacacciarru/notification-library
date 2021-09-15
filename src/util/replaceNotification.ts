import { NotificationSingle } from '../classes/NotificationSingle';

export function replaceNotification(
  notificationList: NotificationSingle[],
  newNotification: NotificationSingle
) {
  notificationList = notificationList.map(notification =>
    notification.id === newNotification.id ? newNotification : notification
  );
  return notificationList;
}
