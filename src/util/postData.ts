import { NotificationSingle } from '../classes/NotificationSingle';

export async function postdata(url: string, notification: NotificationSingle) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(notification),
  });
  const responseNotification = await response.json();
  return responseNotification;
}
