import { NotificationCenter } from '../../src/classes/NotificationCenter';

describe('getIstance', () => {
  test('create two instances of NotificationCenter and check if they are equal', () => {
    const notificationCenterOne = NotificationCenter.getIstance();
    const notificationCenterTwo = NotificationCenter.getIstance();
    expect(notificationCenterOne).toBe(notificationCenterTwo);
  });
});
