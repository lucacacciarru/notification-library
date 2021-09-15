import {
  ChannelNotifications,
  NotificationSingle,
} from '../classes/NotificationSingle';

export function findNotificationById(
  selectNotificationContainer: NotificationSingle[],
  id: string
) {
  const notification = selectNotificationContainer.findIndex(notification => {
    return notification.id === id;
  });

  return notification;
}
