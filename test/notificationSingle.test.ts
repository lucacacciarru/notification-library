import { NotificationSingle } from '../src/classes/NotificationSingle';

describe('notificationSingle', () => {
  test('create notification', () => {
    const body = {
      title: 'anyString',
      text: 'anyString',
    };
    const notification = new NotificationSingle(body);
    console.log(notification);
    expect(notification.body).toEqual(body);
  });
});
