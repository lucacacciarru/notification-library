import { NotificationCenter } from '../../src/classes/NotificationCenter';

const notificationCenter = NotificationCenter.getIstance();

describe('setSender', () => {
  test('Change sender', () => {
    const senderName = 'anyString';
    notificationCenter.setSender(senderName);
    expect(notificationCenter.sender).toBe(senderName);
  });
});
