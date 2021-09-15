import { NotificationSingle } from '../../src/classes/NotificationSingle';
import { replaceNotification } from '../../src/util/replaceNotification';

let notificationArray = [];
const bodyNotification = {
  title: 'anyString',
  text: 'anyString',
};
const notificationSingleOne = new NotificationSingle(bodyNotification);
const notificationSingleTwo = new NotificationSingle(bodyNotification);
notificationArray.push(notificationSingleOne);

describe('replaceNotification', () => {
  test('not find the id of the notification passed', () => {
    const newNotificationArray = replaceNotification(
      notificationArray,
      notificationSingleTwo
    );

    notificationArray = newNotificationArray;
    expect(notificationArray).toEqual([notificationSingleOne]);
  });
});
